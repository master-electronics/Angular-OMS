import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScanITNComponent } from './sorting/scan-ITN/scan-ITN.component';
import { SortingLocationComponent } from './sorting/sorting-location/sorting-location.component';
import { StockingComponent } from './stocking.component';
import { ITNListComponent } from './stocking/ITN-list/ITN-list';
import { StartPageComponent } from './stocking/start-page/start-page';
import { StockingLocationComponent } from './stocking/stocking-location/stocking-location.component';
import { VerifyITNMatchComponent } from './stocking/verify-ITN-match/verify-ITN';
import { VerifyITNMismatchComponent } from './stocking/verify-ITN-mismatch/verify-ITN-mismatch';

const routes: Routes = [
  { path: '', component: StockingComponent },
  { path: 'sorting', component: ScanITNComponent },
  { path: 'sorting/location', component: SortingLocationComponent },
  { path: 'stocking', component: StartPageComponent },
  { path: 'stocking/verifiy', component: VerifyITNMatchComponent },
  { path: 'stocking/mismatch', component: VerifyITNMismatchComponent },
  { path: 'stocking/location', component: StockingLocationComponent },
  { path: 'stocking/itnlist', component: ITNListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockingRoutingModule {}
