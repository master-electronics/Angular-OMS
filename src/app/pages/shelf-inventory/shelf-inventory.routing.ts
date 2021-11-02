import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScanITNComponent } from './scan-itn/scan-itn.component';
import { ShelfInventoryComponent } from './shelf-inventory.component';

const routes: Routes = [
  { path: '', component: ShelfInventoryComponent },
  { path: 'scanitn', component: ScanITNComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShelfInventoryRouting {}
