import { Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {session_analytics_get} from "@API/server-api";
import {SessionAnalytics} from "@API/server.interface";
import {MetricsService} from "../metrics.service";

@Component({
  selector: 'app-session-dashboard',
  templateUrl: './session-dashboard.component.html',
  styleUrls: ['./session-dashboard.component.scss']
})
export class SessionDashboardComponent implements OnInit {

  streamId: string | undefined;
  sessionAnalytics: SessionAnalytics[] = [];
  titles: string[] = ["Session ID", "User IP", "User Agent", "StreamID", "Download Rate", "Bandwidth"];
  data: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private metricsService: MetricsService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    //Get from the path the video sessionId to send a server request
    this.streamId = this.activatedRoute.snapshot.paramMap.get('id')!;

    //GET req. to the http server. It consists of a MongoDB query to
    //retrive desired data about a single session.
    session_analytics_get(this.streamId).then(
      (data) => {
        this.sessionAnalytics = data!;
        console.log(this.sessionAnalytics)
        this.metricsService.setSessionAnalytics(this.sessionAnalytics!)
        for (let i = 0; i < this.sessionAnalytics!.length; i++) {
          this.data.push(
            [
              this.sessionAnalytics[i]["sessionId"],
              this.sessionAnalytics[i]["clientIp"],
              this.sessionAnalytics[i]["userAgent"],
              this.sessionAnalytics[i]["_id"],
              this.sessionAnalytics[i]["downloadRate"].toFixed(2) + " Mbps",
              this.sessionAnalytics[i]["bandwidth"].toFixed(2) + " Mbps"
            ]
          )
        }
      }
    )
  }

}
