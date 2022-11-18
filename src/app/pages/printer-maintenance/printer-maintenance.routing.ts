import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrinterMaintenance } from './printer-maintenance.component';

const routes: Routes = [{ path: '', component: PrinterMaintenance }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrinterMaintenanceRoutingModule {}
