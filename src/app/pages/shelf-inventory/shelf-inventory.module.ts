import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShelfInventoryService } from './shelf-inventory.server';
import { ShelfInventoryRouting } from './shelf-inventory.routing';
import { ShelfInventoryComponent } from './shelf-inventory.component';
import { ScanITNComponent } from './scan-itn/scan-itn.component';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  declarations: [ShelfInventoryComponent, ScanITNComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShelfInventoryRouting,
    NzInputModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzSkeletonModule,
    NzAlertModule,
  ],
  providers: [ShelfInventoryService],
  bootstrap: [ShelfInventoryComponent],
})
export class ShelfInventoryModule {}
