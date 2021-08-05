import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';

import { SearchBarcodeComponent } from './search-barcode.component';
import { SearchBarcodeRoutingModule } from './search-barcode.routing';
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';

@NgModule({
  declarations: [SearchBarcodeComponent],
  imports: [
    CommonModule,
    FormsModule,
    KeyboardShortcutsModule,
    ReactiveFormsModule,
    SearchBarcodeRoutingModule,
    SharedComponentModule,
    SharedUtilityModule,
  ],
  bootstrap: [SearchBarcodeComponent],
})
export class SearchBarcodeModule {}
