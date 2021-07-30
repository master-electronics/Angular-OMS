import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchBarcodeComponent } from './search-barcode.component';
import { SearchBarcodeRoutingModule } from './search-barcode.routing';
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';

@NgModule({
  declarations: [SearchBarcodeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchBarcodeRoutingModule,
    SharedComponentModule,
    SharedUtilityModule,
  ],
  bootstrap: [SearchBarcodeComponent],
})
export class SearchBarcodeModule {}
