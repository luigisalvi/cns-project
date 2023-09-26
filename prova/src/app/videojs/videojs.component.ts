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

    constructor(
      private elementRef: ElementRef,
      private urlService: UrlService
    ) { }

    // Server request functions 
    play_event () {
      const url = 'https://184f-151-50-139-61.ngrok-free.app/stream/start';
      let play_data = {
        sreamId:'1234',
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

    pause_event () {
      const url = 'https://184f-151-50-139-61.ngrok-free.app/stream/start';

      let play_data = {
        sreamId:'1234',
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

    } //pause_event

    ngOnInit() {
      // instantiate Video.js
      this.player = videojs(this.target.nativeElement,
        this.options, function onPlayerReady() {
          console.log('onPlayerReady', this);
        }
      );
    }

    ngAfterViewInit(): void {
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
      this.player.on('play', this.play_event);
      this.player.on('pause', this.pause_event);
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
