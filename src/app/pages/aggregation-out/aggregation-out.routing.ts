import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AggregationOutComponent } from './aggregation-out.component';
import { PickITNComponent } from './pick-itn/pick-itn.component';
import { PickToteComponent } from './pick-tote/pick-tote.component';

const routes: Routes = [
  { path: '', component: AggregationOutComponent },
  {
    path: 'picktote',
    component: PickToteComponent,
  },
  {
    path: 'pickitn',
    component: PickITNComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggregationOutRoutingModule {}
