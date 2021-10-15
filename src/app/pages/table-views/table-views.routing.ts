import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableViewsComponent } from './table-views.component';
import { ItnStatusComponent } from './itn-countby-status/itn-status.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { ITNViewComponent } from './order-view/itn-view.component';
import { UserEventLogComponent } from './user-event-log/user-event-log.component';
// import { TaskCounterComponent } from './task-counter/task-counter.component';
import { OrderTasktimeComponent } from './order-tasktime/order-tasktime.component';

const routes: Routes = [
  { path: '', component: TableViewsComponent },
  {
    path: 'itnstatus',
    component: ItnStatusComponent,
  },
  {
    path: 'orderview',
    component: OrderViewComponent,
  },
  {
    path: 'orderview/itnview',
    component: ITNViewComponent,
  },
  {
    path: 'usereventlog',
    component: UserEventLogComponent,
  },
  // {
  //   path: 'taskcounter',
  //   component: TaskCounterComponent,
  // },
  {
    path: 'ordertasktime',
    component: OrderTasktimeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableViewsRoutingModule {}
