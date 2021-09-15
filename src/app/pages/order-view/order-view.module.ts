import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITNViewComponent } from './itn-view.component';
import { OrderViewComponent } from './order-view.component';
import { OrderViewRoutingModule } from './order-view.routing';
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [OrderViewComponent, ITNViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrderViewRoutingModule,
    SharedUtilityModule,
    SharedComponentModule,
    NzInputModule,
  ],
  bootstrap: [OrderViewComponent],
})
export class OrderViewModule {}
