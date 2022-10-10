import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableViewsComponent } from './table-views.component';
import { EventLogComponent } from './event-log/event-log.component';
import { WmsStatusComponent } from './wms-countby-status/wms-status.component';
import { OrderListComponent } from './wms-countby-status/order-list.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { ITNViewComponent } from './order-view/itn-view.component';
import { TaskCounterComponent } from './task-counter/task-counter.component';
import { OrderTasktimeComponent } from './order-tasktime/order-tasktime.component';
import { HoldOnCounterComponent } from './hold-on-counter/hold-on-counter.component';

const routes: Routes = [
  { path: '', component: TableViewsComponent },
  {
    path: 'wmsstatus',
    component: WmsStatusComponent,
  },
  {
    path: 'wmsstatus/orderlist',
    component: OrderListComponent,
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
    path: 'eventlog',
    component: EventLogComponent,
  },
  {
    path: 'taskcounter',
    component: TaskCounterComponent,
  },
  {
    path: 'ordertasktime',
    component: OrderTasktimeComponent,
  },
  {
    path: 'holdoncounter',
    component: HoldOnCounterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableViewsRoutingModule {}
