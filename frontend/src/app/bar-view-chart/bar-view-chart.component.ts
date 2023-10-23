// docs at: https://swimlane.gitbook.io/ngx-charts/examples/bar-charts/vertical-bar-chart (see also demo in readme.md)
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { MetricsService } from '../metrics.service';
import {View} from "@API/server.interface";
import {stream_analytics_get} from "@API/server-api";
//import { Color, ScaleType } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-bar-view-chart',
  templateUrl: './bar-view-chart.component.html',
  styleUrls: ['./bar-view-chart.component.scss']
})
export class BarViewComponent implements OnInit {
  data: { name: Date, value: number }[] = [];

  view: any[] = [650, 350]; // Dimensioni del grafico

  // Opzioni per il grafico
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Days';
  showYAxisLabel = true;
  yAxisLabel = 'Views';

  //See: https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-horizontal
  colorScheme ='vivid';

  /* //Custom colorScheme
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#00FFFF", "#7FFFD4", "#66CDAA", "#20B2AA", "#5F9EA0"]
  }; */


  constructor(private metricsService: MetricsService) {}

  ngOnInit() {
    // ViewList Data
    this.metricsService.streamAnalytics$.subscribe(streamAnalytics => {
      console.log(streamAnalytics)
      const dailyViewsMap = new Map<string, number>();
      streamAnalytics.viewList.forEach(view => {
        const date = new Date(view.timestamp).toISOString().split('T')[0];
        const count = (dailyViewsMap.get(date) ?? 0) + 1;
        dailyViewsMap.set(date, count);
      });
      dailyViewsMap.forEach((count, date) => {
        this.data.push({
          name: new Date(date),
          value: count
        });
      });
      //Refresh data vector whenever new data comes 
      this.data = [...this.data]

    })

  }

}
