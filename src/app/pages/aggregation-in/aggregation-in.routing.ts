import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AggregationInComponent } from './aggregation-in.component';
import { LocationComponent } from './location/location.component';
import { VerifyITNComponent } from './verify-itn/verify-itn.component';
import { VerifyToteComponent } from './verify-tote/verify-tote.component';

const routes: Routes = [
  { path: '', component: AggregationInComponent },
  {
    path: 'location',
    component: LocationComponent,
  },
  {
    path: 'verifytote',
    component: VerifyToteComponent,
  },
  {
    path: 'verifyitn',
    component: VerifyITNComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggregationInRoutingModule {}
