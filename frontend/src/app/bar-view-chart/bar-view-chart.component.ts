// docs at: https://swimlane.gitbook.io/ngx-charts/examples/bar-charts/vertical-bar-chart (see also demo in readme.md)
import { Component, OnInit } from '@angular/core';
import { MetricsService } from '../metrics.service';
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

  ngOnInit(): void {
    const allData = this.metricsService.getData();
    allData.forEach(videoData => {
      const dailyViewsMap = new Map<string, number>();
      videoData.viewList.forEach(view => {
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
    });
  }
}