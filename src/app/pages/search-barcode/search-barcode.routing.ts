import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchBarcodeComponent } from './search-barcode.component';

const routes: Routes = [{ path: '', component: SearchBarcodeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchBarcodeRoutingModule {}
