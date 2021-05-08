import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderEntryComponent } from './order-entry.component';

const routes: Routes = [{ path: '', component: OrderEntryComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderEntryRoutingModule {}
