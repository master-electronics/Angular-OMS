import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableViewsComponent } from './table-views.component';
import { WmsStatusComponent } from './wms-countby-status/wms-status.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { ITNViewComponent } from './order-view/itn-view.component';
import { UserEventLogComponent } from './user-event-log/user-event-log.component';
import { EventLogComponent } from './event-log/event-log.component';
import { TaskCounterComponent } from './task-counter/task-counter.component';
import { OrderTasktimeComponent } from './order-tasktime/order-tasktime.component';

const routes: Routes = [
  { path: '', component: TableViewsComponent },
  {
    path: 'wmsstatus',
    component: WmsStatusComponent,
  },
  {
    path: 'orderview',
    component: OrderViewComponent,
  },
  {
    path: 'orderview/itnview',
    component: ITNViewComponent,
  },
  // {
  //   path: 'usereventlog',
  //   component: UserEventLogComponent,
  // },
  // {
  //   path: 'eventlog',
  //   component: EventLogComponent,
  // },
  {
    path: 'taskcounter',
    component: TaskCounterComponent,
  },
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
