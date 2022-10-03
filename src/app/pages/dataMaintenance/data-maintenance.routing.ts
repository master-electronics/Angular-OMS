import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataMaintenance } from './data-maintenance.component';

const routes: Routes = [{ path: '', component: DataMaintenance }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DataMaintenanceRoutingModule {}
