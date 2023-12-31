import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VjsPlayerComponent } from './videojs/videojs.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from '@angular/material/icon';
import { BarViewComponent } from './bar-view-chart/bar-view-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NumberCardViewComponent } from './number-card-view/number-card-view.component';
import { StreamDashboardComponent } from './dashboard/dashboard.component';
import { StreamingComponent } from './streaming/streaming.component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { SessionDashboardComponent } from './session-dashboard/session-dashboard.component';
import { SessionNumberCardViewComponent } from './session-number-card-view/session-number-card-view.component';
import { SessionPieChartsComponent } from './session-pie-charts/session-pie-charts.component';
import { BackButtonComponent } from './back-button/back-button.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    VjsPlayerComponent,
    BarViewComponent,
    NumberCardViewComponent,
    StreamDashboardComponent,
    StreamingComponent,
    StreamListComponent,
    SessionDashboardComponent,
    SessionNumberCardViewComponent,
    SessionPieChartsComponent,
    BackButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    NgxChartsModule,
    FormsModule,
    ClipboardModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
