import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScanITNComponent } from './sorting/scan-ITN/scan-ITN.component';
import { StockingComponent } from './stocking.component';

const routes: Routes = [
  { path: '', component: StockingComponent },
  { path: 'sorting', component: ScanITNComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockingRoutingModule {}
