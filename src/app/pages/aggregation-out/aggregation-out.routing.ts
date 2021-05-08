import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../shared/services/auth-guard.service';
import { AggregationOutComponent } from './aggregation-out.component';
import { PickComponent } from './pick/pick.component';

const routes: Routes = [
  { path: '', component: AggregationOutComponent },
  {
    path: 'pick',
    component: PickComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggregationOutRoutingModule {}
