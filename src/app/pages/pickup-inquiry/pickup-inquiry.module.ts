import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from '@ag-grid-community/angular';

import { PickupInquiryComponent } from './pickup-inquiry.component';
import { PickupInquiryRoutingModule } from './pickup-inquiry-routing.module';
@NgModule({
  declarations: [PickupInquiryComponent],
  imports: [
    CommonModule,
    PickupInquiryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([PickupInquiryComponent]),
  ],
  bootstrap: [PickupInquiryComponent],
})
export class PickupInquiryModule {}
