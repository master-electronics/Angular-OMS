import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PullITNComponent } from './pull-itn/pull-itn.component';
import { SelectCartComponent } from './select-cart/select-cart.component';
import { SelectLocationComponent } from './select-location/select-location.component';
import { DropOffComponent } from './drop-off/drop-off.component';
import { DetailAuthComponent } from './detail-auth/detail-auth.component';

const routes: Routes = [
  { path: '', component: SelectCartComponent },
  { path: 'location', component: SelectLocationComponent },
  { path: 'pullitn', component: PullITNComponent },
  { path: 'dropoff', component: DropOffComponent },
  { path: 'detailauth', component: DetailAuthComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickRoutingModule {}
