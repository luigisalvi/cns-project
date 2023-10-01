// videojs.ts component
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import videojs, {VideoJsPlayerOptions} from 'video.js';
import {UrlService} from "../url.service";
import {Subscription} from "rxjs";
import TextTrackCue = videojs.TextTrackCueList.TextTrackCue;



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
      width: 640,
      height: 264,
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
    private bufferingTimes: [{
      timestamp: string,
      videoTimestamp: number,
      duration: number
    }?] = [];
    private totalStreamedTime: number = 0;
    private screenSize: {width: number, height: number} = {width: 0, height: 0};

    constructor(
      private elementRef: ElementRef,
      private urlService: UrlService
    ) { }


    // Server request functions
    play_call () {
      const url = 'https://184f-151-50-139-61.ngrok-free.app/stream/view'; //Server endpoint
      let play_data = {
        streamId:'1234',
        resolution:'1080'
      }

      fetch(url , {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(play_data),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      } )
      // Gestione degli errori //
      .then(response => {
        if (!response.ok) {
          throw new Error('Errore nella chiamata al server');
        }
        return response.json();
      })
      .then(data => {
      })
      .catch(error => {
        console.error('Errore:', error);
      });

  } //play_event
/*
    pause_call () {
      const url = 'https://184f-151-50-139-61.ngrok-free.app/stream/start';

      let pause_data = {
        streamId:'1234',
        resolution:'1080'
      }

      fetch(url , {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(pause_data),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      } )

      // Gestione degli errori //
      .then(response => {
        if (!response.ok) {
          throw new Error('Errore nella chiamata al server');
        }
        return response.json();
      })
      .then(data => {
      })
      .catch(error => {
        console.error('Errore:', error);
      });

    } //pause_event */

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
      // console.log('Playback Quality', playbackQuality);
      if (currentTime > 10 && !this.videoWatched)  {
        this.videoWatched = true;
        console.log('Video Watched');
        // this.player.off('timeupdate');
        // this.play_call(); //Server call
      }

      this.user_metrics();

    } //view_event

    getScreenSize() {
      let width = window.innerWidth;
      let height = window.innerHeight;
      this.screenSize = {width: width, height: height};
    }

    ngOnInit() {
      //video.js init
      this.player = videojs(this.target.nativeElement,
        this.options, function onPlayerReady() {
          console.log('onPlayerReady', this);
        }
      );

      this.getScreenSize();
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

      //this.player.on('play', this.play_call);

      this.player.on('pause', () => {
        this.sendMetrics('pause');
        //this.pause_call();
      });

      this.player.on('play', () => {
        let width = this.player.currentDimension('width');
        let height = this.player.currentDimension('height');
      })

      // this.player.on('playing', this.user_metrics);

      //This event listener implements the views video policy
      //in case of ended video.
      //https://docs.videojs.com/player#event:ended:~:text=line%20110-,ended,-%23
      this.player.on('ended', () => {
        this.sendMetrics('ended');
        this.videoWatched=false;
        this.player.on('timeupdate', this.view_event);
      })

      //This event listener implements the views video policy
      //in case of video source change.
      //https://docs.videojs.com/player#event:sourceset:~:text=line%201831-,sourceset,-%23
      this.player.on('sourceset', () => {
        this.videoWatched=false;
        this.detectMediaChange();
        this.player.on('timeupdate', this.view_event);
      })

      this.rebuffering();

      //---------------//
    }

    sendMetrics(trigger: string) {
      // Send metrics to server
      console.log('===== SENDING METRICS ======');
      // Add the session id --> USER
      // Add the video id --> STREAM
      console.log('Trigger', trigger);
      console.log('Timestamp (iso)', new Date().toISOString());
      console.log('Downloaded Bytes', this.downloadedBytes);
      console.log('Streamed Time (in seconds)', this.player.currentTime());
      console.log('Current Media Level', this.currentMediaLevel);
      console.log('Buffering Times', this.bufferingTimes);
      console.log('Screen Size', this.screenSize);
      console.log('Download Rate', this.downloadRate);
      console.log('Bandwidth', this.bandwidth);
      console.log('===== END METRICS ======');
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
