//docs at:https://swimlane.gitbook.io/ngx-charts/examples/number-card-chart
import { Component } from '@angular/core';
import { MetricsService } from '../metrics.service';

@Component({
  selector: 'app-session-number-card-view',
  templateUrl: './session-number-card-view.component.html',
  styleUrls: ['./session-number-card-view.component.scss']
})
export class SessionNumberCardViewComponent {

  single: any[]=[];
  constructor(private metricsService: MetricsService) {}

  colorScheme ='vivid';
  cardColor: string = '#232837';

  //This function converts seconds in the time format 'HH:MM:SS'
  secondsToHHMMSS(totalSeconds: number) {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = Math.floor(totalSeconds - (hours * 3600) - (minutes * 60));

    return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
  }

  ngOnInit(): void {
    this.metricsService.sessionAnalytics$.subscribe(sessionAnalytics => {
      const totalStreamedBytes = (sessionAnalytics[0].totalStreamedBytes/1e6).toFixed(2);
      const totalStreamedTime: string = this.secondsToHHMMSS(sessionAnalytics[0].totalStreamedTime);
      const totalBufferingEvents: number = sessionAnalytics[0].bufferingEvents;
      const totalBufferingTime: string = this.secondsToHHMMSS(sessionAnalytics[0].bufferingTime);

      this.single = [
        {
          name: 'Total Streamed Data',
          value: totalStreamedBytes + ' MB'
        },
        {
          name: 'Total Streamed Time',
          value: totalStreamedTime
        },
        {
          name: 'Total Buffering Events',
          value: totalBufferingEvents
        },
        {
          name: 'Total Buffering Time',
          value: totalBufferingTime
        }  


      ],
      
      // NECESSARIO ? ? Se si aggiungere anche all'altro component
      this.single = [...this.single];

    });


  }
}
