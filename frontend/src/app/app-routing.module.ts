import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VjsPlayerComponent } from './videojs/videojs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BarViewComponent } from './bar-view-chart/bar-view-chart.component';
import { NumberCardViewComponent } from './number-card-view/number-card-view.component';
import { StreamingComponent } from './streaming/streaming.component';

const routes: Routes = [
  {path: 'streaming', component: StreamingComponent},
  {path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
