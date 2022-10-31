import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValueMapping } from './value-mapping.component';
import { ValueMappingRoutingModule } from './value-mapping.routing';

import { SharedUtilityModule } from '../../shared/shared-utility.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  declarations: [ValueMapping],
  imports: [
    CommonModule,
    ValueMappingRoutingModule,
    SharedUtilityModule,
    NzInputModule,
    NzTableModule,
    NzButtonModule,
    NzListModule,
    NzCardModule,
    NzDropDownModule,
    NzFormModule,
    NzDatePickerModule,
    NzSelectModule,
    NzDividerModule,
    NzInputNumberModule,
    NzIconModule,
    FormsModule,
    ReactiveFormsModule,
    NzPopconfirmModule,
    NzAlertModule,
  ],
  bootstrap: [ValueMapping],
})
export class ValueMappingModule {}
