//This component aims to be the parent component of number-card-view.component.ts and 
//bar-chart-view.component.ts. It is used to make server calls for child components and 
//to make possible the routing towords a dedicated path. 

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {stream_analytics_get} from "@API/server-api";
import {StreamAnalytics} from "@API/server.interface";
import {MetricsService} from "../metrics.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class StreamDashboardComponent implements OnInit {

  streamId: string = "";
  streamAnalytics: void | StreamAnalytics = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private metricsService: MetricsService
  ) {
  }

  ngOnInit(): void {
    //Get from the path the video streamId to send a server request
    this.streamId = this.activatedRoute.snapshot.paramMap.get('id')!;
    
    //GET req. to the http server. It consists of a MongoDB query to 
    //retrive desired data about a single video.
    stream_analytics_get(this.streamId).then(
      (data) => {
        this.streamAnalytics = data;
        console.log(this.streamAnalytics)
        this.metricsService.setStreamAnalytics(this.streamAnalytics!)
      }
    )
  }

}
