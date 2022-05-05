import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScanITNComponent } from './sorting/scan-ITN/scan-ITN.component';
import { SortingLocationComponent } from './sorting/sorting-location/sorting-location.component';
import { StockingComponent } from './stocking.component';

const routes: Routes = [
  { path: '', component: StockingComponent },
  { path: 'sorting', component: ScanITNComponent },
  { path: 'sorting/location', component: SortingLocationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockingRoutingModule {}
