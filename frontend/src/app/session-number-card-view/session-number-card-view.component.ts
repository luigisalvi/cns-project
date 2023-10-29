//docs at:https://swimlane.gitbook.io/ngx-charts/examples/number-card-chart
import { Component, Input } from '@angular/core';
import { MetricsService } from '../metrics.service';

@Component({
  selector: 'app-session-number-card-view',
  templateUrl: './session-number-card-view.component.html',
  styleUrls: ['./session-number-card-view.component.scss']
})
export class SessionNumberCardViewComponent {

  single: any[]=[];
  @Input() streamId: string | undefined;

  totalStreamedTime: string = " ";
  totalStreamedBytes: string =  " ";
  totalBufferingEvents: number = 0;
  totalBufferingTime: string = " ";

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

      const streamId = this.streamId;
      const targetRecord = sessionAnalytics.find(item => item._id == streamId);

      if(targetRecord){
        this.totalStreamedBytes = (targetRecord.totalStreamedBytes/1e6).toFixed(2);
        this.totalStreamedTime =  this.secondsToHHMMSS(targetRecord.totalStreamedTime);
        this.totalBufferingEvents = targetRecord.bufferingEvents;
        this.totalBufferingTime = targetRecord.bufferingTime.toFixed(3);

        this.single = [
          {
            name: 'Total Streamed Data',
            value: this.totalStreamedBytes + ' MB'
          },
          {
            name: 'Total Streamed Time',
            value: this.totalStreamedTime
          },
          {
            name: 'Total Buffering Events',
            value: this.totalBufferingEvents
          },
          {
            name: 'Total Buffering Time',
            value: this.totalBufferingTime
          }


        ]

      } //if

      else {

        if(sessionAnalytics && sessionAnalytics.length>0) {
          let tStreamedBytes: number = 0;
          let tStreamedTime: number = 0;
          let tBufferingEvents: number = 0;
          let tBufferingTime: number = 0;
          for (const metrics of sessionAnalytics) {
            tStreamedBytes += (metrics.totalStreamedBytes/1e6);
            tStreamedTime += metrics.totalStreamedTime;
            tBufferingEvents += metrics.bufferingEvents;
            tBufferingTime += metrics.bufferingTime;
          }

          this.totalStreamedBytes = tStreamedBytes.toFixed(2);
          this.totalStreamedTime =  this.secondsToHHMMSS(tStreamedTime);
          this.totalBufferingEvents = tBufferingEvents;
          this.totalBufferingTime = tBufferingTime.toFixed(3);
        }

        this.single = [
          {
            name: 'Total Streamed Data per Session',
            value: this.totalStreamedBytes + ' MB'
          },
          {
            name: 'Total Streamed Time per Session',
            value: this.totalStreamedTime
          },
          {
            name: 'Total Buffering Events per Session',
            value: this.totalBufferingEvents
          },
          {
            name: 'Total Buffering Time per Session',
            value: this.totalBufferingTime
          }
        ]

      } //else



      // NECESSARIO ? ? Se si aggiungere anche all'altro component
      //this.single = [...this.single];

    });


  }
}
