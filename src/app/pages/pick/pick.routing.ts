import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PullITNComponent } from './pull-itn/pull-itn.component';
import { PickComponent } from './pick.component';
import { PositionComponent } from './position/position.component';
import { DropOffComponent } from './drop-off/drop-off.component';

const routes: Routes = [
  { path: '', component: PickComponent },
  { path: 'position', component: PositionComponent },
  { path: 'pullitn', component: PullITNComponent },
  { path: 'dropoff', component: DropOffComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickRoutingModule {}
