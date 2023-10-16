import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VjsPlayerComponent } from './videojs/videojs.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from '@angular/material/icon';
import { BarViewComponent } from './bar-view-chart/bar-view-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NumberCardViewComponent } from './number-card-view/number-card-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StreamingComponent } from './streaming/streaming.component';

@NgModule({
  declarations: [
    AppComponent,
    VjsPlayerComponent,
    BarViewComponent,
    NumberCardViewComponent,
    DashboardComponent,
    StreamingComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        NgxChartsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
