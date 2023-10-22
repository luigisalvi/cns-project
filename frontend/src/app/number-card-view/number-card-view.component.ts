//docs at:https://swimlane.gitbook.io/ngx-charts/examples/number-card-chart
import { Component, OnInit } from '@angular/core';
import { MetricsService } from '../metrics.service';

@Component({
  selector: 'app-number-card-view',
  templateUrl: './number-card-view.component.html',
  styleUrls: ['./number-card-view.component.scss']
})
export class NumberCardViewComponent implements OnInit {
  single: any[]=[];
  constructor(private metricsService: MetricsService) {}

  colorScheme ='vivid';
  cardColor: string = '#232837';

  ngOnInit(): void {
    this.metricsService.streamAnalytics$.subscribe(streamAnalytics => {
      const totalStreamedBytes = (streamAnalytics.totalStreamedBytes/1e6).toFixed(2);
      const totalStreamedTime = (streamAnalytics.totalStreamedTime/60).toFixed(2);

      this.single = [
        {
          name: 'Total Streamed Data',
          value: totalStreamedBytes + ' MB'
        },
        {
          name: 'Total Streamed Time',
          value: totalStreamedTime + ' min'
        }

      ]

    });


  }

}
