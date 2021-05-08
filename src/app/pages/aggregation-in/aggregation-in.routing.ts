import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AggregationInComponent } from './aggregation-in.component';
import { LocationComponent } from './location/location.component';

const routes: Routes = [
  { path: '', component: AggregationInComponent },
  {
    path: 'location',
    component: LocationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggregationInRoutingModule {}
