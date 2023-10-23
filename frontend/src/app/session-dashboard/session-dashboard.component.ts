import { Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {session_analytics_get} from "@API/server-api";
import {SessionAnalytics} from "@API/server.interface";
import {MetricsService} from "../metrics.service";

@Component({
  selector: 'app-session-dashboard',
  templateUrl: './session-dashboard.component.html',
  styleUrls: ['./session-dashboard.component.scss']
})
export class SessionDashboardComponent implements OnInit {

  sessionId: string = "";
  sessionAnalytics: void | SessionAnalytics[] = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private metricsService: MetricsService
  ) {
  }

  ngOnInit(): void {
    //Get from the path the video sessionId to send a server request
    this.sessionId = this.activatedRoute.snapshot.paramMap.get('id')!;
    
    //GET req. to the http server. It consists of a MongoDB query to 
    //retrive desired data about a single session.
    session_analytics_get(this.sessionId).then(
      (data) => {
        this.sessionAnalytics = data;
        console.log(this.sessionAnalytics)
        this.metricsService.setSessionAnalytics(this.sessionAnalytics!)
      }
    )
  }

  
}
