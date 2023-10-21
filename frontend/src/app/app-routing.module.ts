import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {StreamingComponent} from './streaming/streaming.component';
import {StreamListComponent} from "./stream-list/stream-list.component";

const routes: Routes = [
  {
    path: 'streaming', component: StreamListComponent,
  },
  {path: 'streaming/:id', component: StreamingComponent, pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
