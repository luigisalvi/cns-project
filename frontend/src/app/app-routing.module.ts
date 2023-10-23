import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StreamDashboardComponent} from './dashboard/dashboard.component';
import {StreamingComponent} from './streaming/streaming.component';
import {StreamListComponent} from "./stream-list/stream-list.component";
import { SessionDashboardComponent } from './session-dashboard/session-dashboard.component';

const routes: Routes = [
  {path: '', component: StreamListComponent},
  {path: 'streaming/:id', component: StreamingComponent, pathMatch: 'full'},
  {path: 'stream-dashboard/:id', component: StreamDashboardComponent},
  {path: 'session-dashboard/:id', component: SessionDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
