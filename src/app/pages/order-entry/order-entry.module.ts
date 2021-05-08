import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrderEntryComponent } from './order-entry.component';
import { TypeInComponent } from './type-in/type-in.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { SelectListsComponent } from './select-lists/select-lists.component';
import { OrderEntryRoutingModule } from './order-entry-routing.module';
@NgModule({
  declarations: [OrderEntryComponent, TypeInComponent, CustomerInfoComponent, SelectListsComponent],
  imports: [CommonModule, OrderEntryRoutingModule, FormsModule, ReactiveFormsModule],
  bootstrap: [OrderEntryComponent],
})
export class OrderEntryModule {}
