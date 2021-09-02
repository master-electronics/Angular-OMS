import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelocateComponent } from './relocate.component';
import { DestinationComponent } from './destination.component';

const routes: Routes = [
  { path: '', component: RelocateComponent },
  { path: 'destination', component: DestinationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelocateRoutingModule {}
