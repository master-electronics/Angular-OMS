import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from '../../icons-provider.module';

import { ManagerToolsComponent } from './manager-tools.component';
import { TableViewsRoutingModule } from './manager-tools';
import { SharedComponentModule } from '../../components/shared-component.module';
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

@NgModule({
  declarations: [ManagerToolsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUtilityModule,
    SharedComponentModule,
    TableViewsRoutingModule,
    NzInputModule,
    NzTableModule,
    NzDropDownModule,
    NzButtonModule,
    IconsProviderModule,
    NzFormModule,
    NzListModule,
    NzCardModule,
    NzDatePickerModule,
    NzSelectModule,
    NzDividerModule,
  ],
  bootstrap: [ManagerToolsComponent],
})
export class TableViewsModule {}
