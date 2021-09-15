import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from '../../icons-provider.module';

import { ITNViewComponent } from './itn-view.component';
import { OrderViewComponent } from './order-view.component';
import { OrderViewRoutingModule } from './order-view.routing';
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
    NzTableModule,
    NzDropDownModule,
    NzButtonModule,
    IconsProviderModule,
  ],
  bootstrap: [OrderViewComponent],
})
export class OrderViewModule {}
