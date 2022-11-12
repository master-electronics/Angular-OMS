import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchBarcodeComponent } from './search-barcode.component';
import { SearchBarcodeRoutingModule } from './search-barcode.routing';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@NgModule({
  declarations: [SearchBarcodeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchBarcodeRoutingModule,
    NzInputModule,
    NzTableModule,
    NzDropDownModule,
    NzButtonModule,
    NzFormModule,
    NzTreeViewModule,
    NzSkeletonModule,
  ],
  bootstrap: [SearchBarcodeComponent],
})
export class SearchBarcodeModule {}
