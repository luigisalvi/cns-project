// videojs.ts component
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import videojs, {VideoJsPlayerOptions} from 'video.js';
import {metrics_post, session_post, stream_get, view_post} from '@API/server-api';
import {ActivatedRoute, Router} from "@angular/router";
import {MediaLevel, Stream} from "@API/server.interface";
import {interval, Subscription} from "rxjs";
import TextTrackCue = videojs.TextTrackCueList.TextTrackCue;

declare var require: any;
require('videojs-contrib-quality-levels');
require('@mycujoo/videojs-hls-quality-selector');

@Component({
  selector: 'app-videojs',
  templateUrl: './videojs.component.html',
  styleUrls: ['./videojs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class VjsPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('target', {static: true})
  target!: ElementRef;
  options: VideoJsPlayerOptions = {
    controls: true,
    fluid: true,
    enableSourceset: true,
    liveui: true,
    autoplay: false,
    controlBar: {
      'pictureInPictureToggle': false,
      'liveDisplay': true,
    },
    plugins: { hlsQualitySelector: { displayCurrentQuality: true } },
    html5: {
      vhs: {
        //https://github.com/videojs/http-streaming#overridenative
        overrideNative: true,
        limitRenditionByPlayerDimensions: false,
        smoothQualityChange: true,
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false
    },
  };
  player!: videojs.Player;

  //Global Variables
  videoWatched = false; //Control variable
  liveCounter: number = 0;
  private bufferingEvents: number = 0;
  private bufferingStartTime: number = 0;
  private bufferingTime: number = 0;
  private downloadedBytes: number = 0;
  private downloadRate: number = 0;
  private bandwidth: number = 0;
  private currentMediaLevel: MediaLevel | undefined = undefined;
  private bufferingTimes: [{ timestamp: string, videoTimestamp: number, duration: number }?] = [];
  private screenSize: { width: number, height: number } = {width: 0, height: 0};
  private streamId: string = '';

  private videoStartedAt: number = 0;
  private totalSecondsWatched = 0;

  timer$: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  // METRICS EVALUATION FUNCTIONS //

  //This function evaulate the buffering events by implementing a simple mathematical
  //approach which takes in account the time between two contiguous waiting-playing events.
  rebuffering = () => {
    this.player.on('waiting', () => {
      this.bufferingStartTime = new Date().getTime();
      this.bufferingEvents++;
    })

    this.player.on('playing', () => {
      if (this.bufferingStartTime > 0) {
        const bufferingStopTime = new Date().getTime();
        this.bufferingTime = bufferingStopTime - this.bufferingStartTime;
        this.bufferingStartTime = 0;
        this.bufferingTimes.push({
          timestamp: new Date().toISOString(),
          videoTimestamp: this.player.currentTime(),
          duration: this.bufferingTime / 1000
        });
      }
    })
  } //rebuffering

  //This function allows to collect some streaming videojs-builtin metrics.
  user_metrics = () => {
    //https://github.com/videojs/http-streaming#vhssystembandwidthbandwidth
    // @ts-ignore
     //Mbps
    this.bandwidth = (this.player.tech({IWillNotUseThisInPlugins: true}).vhs.systemBandwidth!) / 1000000;

    //https://github.com/videojs/http-streaming#vhsbandwidth
    // @ts-ignore
     //Mbps
    this.downloadRate = (this.player.tech({IWillNotUseThisInPlugins: true}).vhs.bandwidth!) / 1000000;

    //https://github.com/videojs/http-streaming#vhsstats
    // @ts-ignore
    let downloaded_bytes = this.player.tech({IWillNotUseThisInPlugins: true}).vhs.stats.mediaBytesTransferred!;
    this.downloadedBytes += downloaded_bytes;

  } //user_metrics


  //This function is uset to track each quality streaming level change:
  //when an ffmpeg chunk from a different quality is played while streaming,
  //this function detect it and informs the server.

  previousPlaylist: string | undefined = undefined;
  detectMediaChange() {
    //https://github.com/videojs/http-streaming#segment-metadata
    let tracks = this.player.textTracks();
    let segmentMetadataTrack: TextTrack | undefined = undefined;

    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].label === 'segment-metadata') {
        segmentMetadataTrack = tracks[i];
      }
    }

    let activeCue: TextTrackCue | undefined = segmentMetadataTrack?.activeCues?.[0] as (TextTrackCue | undefined);

    if (activeCue) {
      // @ts-ignore
      const acValue = activeCue.value;

      if (this.previousPlaylist !== acValue.playlist) {

        let currPlaylist: string = acValue.playlist;

        this.currentMediaLevel = {
          resolution: acValue.resolution.width + "x" + acValue.resolution.height,
          bandwidth: acValue.bandwidth,
          level: Number(currPlaylist.split('_')[1].at(0)!),
          media: currPlaylist
        };
        this.sendMetrics('mediaChange');
      } // if (previousPlaylist !== acValue.playlist)

      this.previousPlaylist = acValue.playlist;
    }
  } //detectMediaChange

  //Implement the view policy: if user watch a video for at least 10s,
  //the video is considered viewed and the video views'counter take it into account.
  view_event = () => {
    if (this.totalSecondsWatched > 10 && !this.videoWatched) {
      this.videoWatched = true;

      //Server call for view event tracker
      view_post(this.streamId, this.currentMediaLevel?.resolution!);
    }

    this.user_metrics();

  } //view_event

  getScreenSize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.screenSize = {width: width, height: height};
  }

  // METRICS COLLECTION //

  sendMetrics(trigger: string, debug: boolean = true) {
    //Inner variables
    let timestamp = new Date();
    let streamedTime = (timestamp.getTime() - this.videoStartedAt) / 1000;

    //Server call
    metrics_post(this.streamId, trigger, timestamp.toISOString(), this.screenSize, this.currentMediaLevel!,
      streamedTime, this.downloadedBytes, this.bufferingTimes, this.downloadRate, this.bandwidth);

    this.videoStartedAt = timestamp.getTime();

    if (debug) {
      // Send metrics to server
      console.log('===== SENDING METRICS ======');
      // Add the session id --> USER (from cookie)
      // Add the video id --> STREAM (from cookie)
      console.log('Trigger', trigger);
      console.log('Timestamp (iso)', timestamp.toISOString());
      console.log('Screen Size', this.screenSize);
      console.log('Current Media Level', this.currentMediaLevel);
      console.log('Streamed Time (in seconds)', streamedTime);
      console.log('Downloaded Bytes', this.downloadedBytes);
      console.log('Buffering Times', this.bufferingTimes);
      console.log('Download Rate', this.downloadRate);
      console.log('Bandwidth', this.bandwidth);
      console.log('===== END METRICS ======');
    }

    this.downloadedBytes = 0;
    this.bufferingTimes = [];
  }


  changeVideoSource(url: string, type: string = 'application/x-mpegURL'): void {
    this.player.src({ src: url, type: type });
  }

  trackLiveUser(streamId: string, sessionId: string) {
    // Track live users using WekSocket connection //
    const ws = new WebSocket(`ws://localhost:3001/live-users?streamId=${streamId}&clientId=${sessionId}`);

    ws.onopen = () => {
    };

    ws.onmessage = (message: any) => {
      let jsonMessage = JSON.parse(message.data);
      if (jsonMessage.hasOwnProperty('liveUsersCount')) {
        this.liveCounter = jsonMessage.liveUsersCount;
      }
    }

    ws.onclose = () => {
    }
  }

  // COMPONENT'S LIFCYCLE HOOKS //

  sessionId: string = '';

  ngOnInit() {
    session_post().then(
      session => {
        this.sessionId = session.sessionId
      }
    );

    this.streamId = this.route.snapshot.paramMap.get('id')!

    //video.js init
    if (!this.player) {
      this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
        // @ts-ignore
        this.hlsQualitySelector({ displayCurrentQuality: true })
        // @ts-ignore
        this.controlBar.addChild("qualitySelector")
      });

    }

    this.getScreenSize();

    // Get first stream and streamId, setting the video source. Here, since
    // just one video has been uploaded in the playlist, the first streamId
    // (at 0-index) is chosen. Whenever the playlist is populated by
    // different videos, a user input-reader is needed, in order to collect
    // the input chosen by the user and set the appropriate index in the following line.
    stream_get(this.streamId).then(stream => {

      // Change VideoJS source
      this.changeVideoSource(stream?.ref!);

      // Track live users
      this.trackLiveUser(this.streamId, this.sessionId);
    });

  }

  ngAfterViewInit(): void {
    // Event Listeners
    this.player.on('play', () => {
      // @ts-ignore
      this.videoStartedAt = new Date().getTime();
      this.timer$ = interval(3000).subscribe(() => this.sendMetrics('timeupdate'))
      this.detectMediaChange();
      this.sendMetrics('play');
    })

    this.player.on('pause', () => {
      this.timer$.unsubscribe();
      this.sendMetrics('pause');
    });

    //This event listener implements the views video policy
    //in case of video source change and collects metrics on each new set.
    //https://docs.videojs.com/player#event:sourceset:~:text=line%201831-,sourceset,-%23
    this.player.on('timeupdate', () => {
      this.totalSecondsWatched += 0.250;
      this.view_event();
      this.detectMediaChange();
    })

    //This event listener implements the views video policy
    //in case of ended video and collects metrics.
    //https://docs.videojs.com/player#event:ended:~:text=line%20110-,ended,-%23
    this.player.on('ended', () => {
      this.videoWatched = false;
      this.sendMetrics('ended');
    })

    //This function evaulate each buffering event occurred while
    //playing a video and generate a set of buffers'metrics sent to the server-side.
    this.rebuffering();

    //---------------ADD HERE OTHER LISTENERS AND FUNCTIONS------------//

  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.off('timeupdate');
      this.player.off('play');
      this.player.off('pause');
      this.player.off('ended');
      this.player.dispose();
    }
  }

  selectDashboard(type: string) {
    this.router.navigate([type + '-dashboard', this.streamId]);
  }
}
