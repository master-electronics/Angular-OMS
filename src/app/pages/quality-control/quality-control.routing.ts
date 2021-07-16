import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QualityControlComponent } from './quality-control.component';
import { ScanItnComponent } from './scan-itn/scan-itn.component';
import { VerifyPackComponent } from './verfiy-pack/verify-pack.component';
import { GlobalMessagesComponent } from './global-messages/global-messages.component';
import { RepackComponent } from './repack/repack.component';

const routes: Routes = [
  {
    path: '',
    component: QualityControlComponent,
    children: [
      { path: 'scanitn', component: ScanItnComponent },
      { path: 'globalmessages', component: GlobalMessagesComponent },
      { path: 'verifypack', component: VerifyPackComponent },
      { path: 'repack', component: RepackComponent },
      { path: '', pathMatch: 'full', redirectTo: 'scanitn' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QualityControlRoutingModule {}
