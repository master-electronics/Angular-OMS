import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickupInquiryComponent } from './pickup-inquiry.component';

const routes: Routes = [{ path: '', component: PickupInquiryComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickupInquiryRoutingModule {}
