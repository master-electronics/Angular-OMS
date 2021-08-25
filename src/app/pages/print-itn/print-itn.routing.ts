import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrintITNComponent } from './print-itn.component';

const routes: Routes = [{ path: '', component: PrintITNComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintITNRoutingModule {}
