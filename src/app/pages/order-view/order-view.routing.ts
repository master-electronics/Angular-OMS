import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderViewComponent } from './order-view.component';
import { ITNViewComponent } from './itn-view.component';

const routes: Routes = [
  { path: '', component: OrderViewComponent },
  {
    path: 'itnview',
    component: ITNViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderViewRoutingModule {}
