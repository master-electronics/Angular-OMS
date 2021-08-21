import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderViewComponent } from './order-view.component';

const routes: Routes = [{ path: '', component: OrderViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderViewRoutingModule {}
