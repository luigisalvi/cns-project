import { Injectable } from '@angular/core';
import {SessionAnalytics, StreamAnalytics, View} from "@API/server.interface";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  streamAnalytics$: Subject<StreamAnalytics> = new Subject<StreamAnalytics>();
  sessionAnalytics$: Subject<SessionAnalytics[]> = new Subject<SessionAnalytics[]>()

  setStreamAnalytics(streamAnalytics: StreamAnalytics) {
    this.streamAnalytics$.next(streamAnalytics)
  }

  setSessionAnalytics(sessionAnalytics: SessionAnalytics[]) {
    this.sessionAnalytics$.next(sessionAnalytics)
  }

}
