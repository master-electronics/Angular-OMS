import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';

import { OrderViewComponent } from './order-view.component';
import { OrderViewRoutingModule } from './order-view.routing';
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';

@NgModule({
  declarations: [OrderViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    KeyboardShortcutsModule,
    ReactiveFormsModule,
    OrderViewRoutingModule,
    SharedUtilityModule,
    SharedComponentModule,
  ],
  bootstrap: [OrderViewComponent],
})
export class OrderViewModule {}
