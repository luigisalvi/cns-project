// videojs.ts component
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import videojs, {VideoJsPlayerOptions} from 'video.js';
import {UrlService} from "../url.service";
import {Subscription} from "rxjs";
import TextTrackCue = videojs.TextTrackCueList.TextTrackCue;
import { session_get, session_post, streams_get, play_call, pause_call, view_post, metrics_post, m3u8_get } from './server-api';


@Component({
    selector: 'app-videojs',
    templateUrl: './videojs.component.html',
    styleUrls: ['./videojs.component.scss'],
    encapsulation: ViewEncapsulation.None,
  })

  export class VjsPlayerComponent implements OnInit,
  OnDestroy, AfterViewInit {
    @ViewChild('target', { static: true })
    target!: ElementRef;
    options: VideoJsPlayerOptions =  {
      controls: true,
      // autoplay: true,
      //liveui: false,
      fluid: true,
      enableSourceset: true,
      html5: {
        vhs: {
          //https://github.com/videojs/http-streaming#overridenative
          overrideNative: true
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false
      },
    };
    player!: videojs.Player;

    urlServiceSubscription: Subscription = new Subscription(); //Service
    videoWatched = false; //Control variable
    private bufferingEvents: number = 0;
    private bufferingStartTime: number = 0;
    private bufferingTime: number=0;
    private downloadedBytes: number = 0;
    private downloadRate: number = 0;
    private bandwidth: number = 0;
    private currentMediaLevel: {resolution: string, bandwidth: number, level: number, media: string} | undefined = undefined;
    private bufferingTimes: [{timestamp: string,videoTimestamp: number,duration: number}?] = [];
    private totalStreamedTime: number = 0;
    private screenSize: {width: number, height: number} = {width: 0, height: 0};
    private streamId: string='';

    liveCounter: number = 0;

    constructor(
      private elementRef: ElementRef,
      private urlService: UrlService
    ) { }

    // METRICS EVALUATION FUNCTIONS //

    rebuffering=() => {
      this.player.on('waiting', () => {
        this.bufferingStartTime = new Date().getTime();
        this.bufferingEvents++ ;
      })

      this.player.on('playing', () => {
        if(this.bufferingStartTime > 0) {
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

    user_metrics = () => {
      //https://github.com/videojs/http-streaming#vhssystembandwidthbandwidth
      // @ts-ignore
      let bandwidth = (this.player.tech({ IWillNotUseThisInPlugins: true}).vhs.systemBandwidth!) / 1000000; //Mbps
      this.bandwidth = bandwidth;

      //https://github.com/videojs/http-streaming#vhsbandwidth
      // @ts-ignore
      let downloadRate = (this.player.tech({ IWillNotUseThisInPlugins: true}).vhs.bandwidth!) / 1000000; //Mbps
      this.downloadRate = downloadRate;

      //https://github.com/videojs/http-streaming#vhsstats
      // @ts-ignore
      let  downloaded_bytes = this.player.tech({ IWillNotUseThisInPlugins: true}).vhs.stats.mediaBytesTransferred!;
      this.downloadedBytes += downloaded_bytes;

    } //user_metrics

    detectMediaChange() {
      //https://github.com/videojs/http-streaming#segment-metadata
      let tracks = this.player.textTracks();
      let segmentMetadataTrack: TextTrack | undefined = undefined;

      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].label === 'segment-metadata') {
          segmentMetadataTrack = tracks[i];
        }
      }

      let previousPlaylist: string | undefined = undefined;

      if (segmentMetadataTrack) {
        segmentMetadataTrack.oncuechange = () => {
            let activeCue: TextTrackCue | undefined = segmentMetadataTrack?.activeCues?.[0] as (TextTrackCue | undefined);

            if (activeCue) {
              // @ts-ignore
              const acValue = activeCue.value;

              if (previousPlaylist !== acValue.playlist) {

                let currPlaylist: string = acValue.playlist;

                let mediaLevel: {resolution: string, bandwidth: number, level: number, media: string} = {
                  resolution: acValue.resolution.width + "x" + acValue.resolution.height,
                  bandwidth: acValue.bandwidth,
                  level: Number(currPlaylist.split('_')[1].at(0)!),
                  media: currPlaylist
                }
                this.currentMediaLevel = mediaLevel;
                this.sendMetrics('mediaChange');
              } // if (previousPlaylist !== acValue.playlist)

              previousPlaylist = acValue.playlist;
            }
        }
      }
    }

    view_event = () => {
      let currentTime = this.player.currentTime();
      if (currentTime > 10 && !this.videoWatched)  {
        this.videoWatched = true;
        console.log('Video Watched');

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

    sendMetrics(trigger: string) {
      //Inner variables
      let timestamp = new Date().toISOString();
      let streamedTime = this.player.currentTime();

      // Send metrics to server
      console.log('===== SENDING METRICS ======');
      // Add the session id --> USER
      // Add the video id --> STREAM
      console.log('Trigger', trigger);
      console.log('Timestamp (iso)', timestamp);
      console.log('Downloaded Bytes', this.downloadedBytes);
      console.log('Streamed Time (in seconds)', streamedTime);
      console.log('Current Media Level', this.currentMediaLevel);
      console.log('Buffering Times', this.bufferingTimes);
      console.log('Screen Size', this.screenSize);
      console.log('Download Rate', this.downloadRate);
      console.log('Bandwidth', this.bandwidth);
      console.log('===== END METRICS ======');

      //Server call
      metrics_post(this.streamId, trigger, timestamp, this.screenSize,this.currentMediaLevel!, streamedTime,
        this.downloadedBytes, this.bufferingTimes,this.downloadRate, this.bandwidth )
    }

    // COMPONENT'S LIFCYCLE HOOKS //

    async ngOnInit() {

      // Server call for session set up
      session_post();

      //video.js init
      this.player = videojs(this.target.nativeElement,
        this.options, function onPlayerReady() {
          console.log('onPlayerReady', this);
        }
      );

      this.getScreenSize();

      // Get first stream
      let stream = (await streams_get()).at(0);
      this.streamId = stream?.id!
      this.urlService.setVideo(stream?.ref!, stream?.name!);


      const ws = new WebSocket('ws://localhost:3001/live-users?streamId=' + this.streamId);

      ws.onopen = () => {
        console.log('Connected to server');

        ws.send('Hello, server!');
      };

      ws.onmessage = (message: any) => {
        console.log(`Received message from server: ${message.data}`);
        let jsonMessage = JSON.parse(message.data);
        if (jsonMessage.hasOwnProperty('liveUsersCount')) {
          this.liveCounter = jsonMessage.liveUsersCount;
        }
      }

      ws.onclose = () => {
        console.log('Disconnected from server');
      }


    }


    ngAfterViewInit(): void {

      // Player Settling
      this.urlServiceSubscription = this.urlService.url$.subscribe(
        (value: {url: string, type: string}) => {

          if (value.url === "" || value.type === "") {
            return;
          }

          this.player.src(
            {
              src: value.url,
              type: value.type
            }
          );

      });

      // Event Listeners

      this.player.on('play', () => {
        let width = this.player.currentDimension('width');
        let height = this.player.currentDimension('height');
        //play_call(streamId);
      })

      this.player.on('pause', () => {
        this.sendMetrics('pause');
        //pause_call(streamId);
      });

      // this.player.on('playing', this.user_metrics);

      //This event listener implements the views video policy
      //in case of ended video.
      //https://docs.videojs.com/player#event:ended:~:text=line%20110-,ended,-%23
      this.player.on('ended', () => {
        this.detectMediaChange();
        this.sendMetrics('ended'); //no needed: included in detectMediaChange. Choose one of them(?)
        this.videoWatched=false;
        this.player.on('timeupdate', this.view_event);
      })

      //This event listener implements the views video policy
      //in case of video source change.
      //https://docs.videojs.com/player#event:sourceset:~:text=line%201831-,sourceset,-%23
      this.player.on('sourceset', () => {
        this.detectMediaChange();
        this.videoWatched=false;
        this.player.on('timeupdate', this.view_event);
      })

      //This function evaulate each buffering event occurred while
      //playing a video and generate a set of metrics sent to the server-side.
      this.rebuffering();

      //---------------//
    }

    ngOnDestroy() {
      // destroy player
      if (this.player) {
        this.sendMetrics('destroy');
        this.player.dispose();
        this.urlServiceSubscription.unsubscribe();
        //this.player.off('play', this.play_event);
        //this.player.off('pause', this.pause_event);

        console.log('player disposed')
      }
    }
  }
