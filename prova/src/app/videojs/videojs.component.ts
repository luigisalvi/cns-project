// videojs.ts component
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import videojs, {VideoJsPlayerOptions} from 'video.js';
import {UrlService} from "../url.service";
import {Subscription} from "rxjs";

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
    // see options: https://github.com/videojs/video.js/blob/maintutorial-options.html
    options: VideoJsPlayerOptions =  {
      controls: true,
      autoplay: false,
      liveui: true,
      fluid: true,
      width: 640,
      height: 264,
      html5: {
        vhs: {
          overrideNative: true
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false
      },
    };
    player!: videojs.Player;

    urlServiceSubscription: Subscription = new Subscription();
    videoWatched = false;

    constructor(
      private elementRef: ElementRef,
      private urlService: UrlService
    ) { }

    // Server request functions 
    play_call () {
      const url = 'https://184f-151-50-139-61.ngrok-free.app/stream/start';
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
  
  } //play_call

    pause_call () {
      const url = 'https://';

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

    } //pause_call

    view_event() {
      let currentTime = this.player.currentTime();
      let videoWatched = false;
      console.log('Current Time', currentTime);
      if (currentTime > 10 && !videoWatched)  {
        videoWatched = true;
        console.log('Video Watched');
        this.player.off('timeupdate');
        this.play_call;
      }
      
      if(this.videoWatched===true) {
      //this.play_call();
      // Azzeramento current Time che è la seconda variabile di controllo interna
      currentTime=0;
      }

      
    } //view_event

    ngOnInit() {
      // instantiate Video.js
      this.player = videojs(this.target.nativeElement,
        this.options, function onPlayerReady() {
          console.log('onPlayerReady', this);
        }
      );
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
      //this.player.on('pause', this.pause_call);
      
      this.player.on('timeupdate', this.view_event);
    }

    ngOnDestroy() {
      // destroy player
      if (this.player) {
        this.player.dispose();
        this.urlServiceSubscription.unsubscribe();
        console.log('player disposed')
      }
    }
  }
