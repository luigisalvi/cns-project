import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {stream_analytics_get} from "@API/server-api";
import {StreamAnalytics, View} from "@API/server.interface";
import {MetricsService} from "../metrics.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  streamId: string = "";
  streamAnalytics: void | StreamAnalytics = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private metricsService: MetricsService
  ) {
  }

  ngOnInit(): void {
    this.streamId = this.activatedRoute.snapshot.paramMap.get('id')!;

    stream_analytics_get(this.streamId).then(
      (data) => {
        this.streamAnalytics = data;
        console.log(this.streamAnalytics)
        this.metricsService.setStreamAnalytics(this.streamAnalytics!)
      }
    )
  }

}
