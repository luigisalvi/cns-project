import {Component, Input, OnInit} from '@angular/core';
import {LegendPosition} from "@swimlane/ngx-charts";
import {MetricsService} from "../metrics.service";

@Component({
  selector: 'app-session-pie-charts',
  templateUrl: './session-pie-charts.component.html',
  styleUrls: ['./session-pie-charts.component.css']
})
export class SessionPieChartsComponent implements OnInit {

  single: any[] = [];
  @Input() streamId: string | undefined;
  @Input() metric: 'mediaLevels' | 'screenSizes' | undefined;

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;

  colorScheme =  'vivid';
  // {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };

  constructor(
    private metricsService: MetricsService
  ) { }

  ngOnInit(): void {
    this.metricsService.sessionAnalytics$.subscribe(sessionAnalytics => {

      const streamId = this.streamId;
      const targetRecord = sessionAnalytics.find(item => item._id == streamId);

      if (targetRecord) {
        switch (this.metric) {
          case 'mediaLevels':
            let levelsAmount: number = targetRecord.mediaLevels.length;


            for (let i = 0; i < levelsAmount; i++) {
              this.single.push(
                {
                  name: 'Level ' + targetRecord.mediaLevels[i]["level"],
                  value: targetRecord.mediaLevels[i]["%totalStreamedTime"]
                }
              )
            }
            break;
          case 'screenSizes':
            let sizesAmount: number = targetRecord.screenSizes.length;

            for (let i = 0; i < sizesAmount; i++) {
              this.single.push(
                {
                  name: targetRecord.screenSizes[i]["size"]["width"] + 'x' + targetRecord.screenSizes[i]["size"]["height"],
                  value: targetRecord.screenSizes[i]["%totalStreamedTime"]
                }
              )
            }
        }
      }

      this.single = [...this.single];

    })

  }
}
