import {Component} from '@angular/core';
import {UrlService} from "./url.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  urlServiceSubscription: Subscription = new Subscription();

  videoInfo: {
    type: string;
    name: string;
    size: string;
  } = {
    type: "",
    name: "",
    size: ""
  }

  constructor(private urlService: UrlService) { }

  ngOnInit(): void {
    this.urlServiceSubscription = this.urlService.url$.subscribe(videoObj => {
      this.videoInfo = {
        // url: videoObj.url,
        type: videoObj.type,
        name: videoObj.name,
        size: (videoObj.size / (1024 * 1024)).toFixed(2)
      }
    });
  }

  ngOnDestroy(): void {
    this.urlServiceSubscription.unsubscribe();
  }

}
