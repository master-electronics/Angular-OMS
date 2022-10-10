import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataMaintenance } from './data-maintenance.component';
import { DataMaintenanceRoutingModule } from './data-maintenance.routing';

import { SharedComponentModule } from 'src/app/components/shared-component.module';
import { SharedUtilityModule } from 'src/app/shared/shared-utility.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [DataMaintenance],
  imports: [
    CommonModule,
    DataMaintenanceRoutingModule,
    SharedComponentModule,
    SharedUtilityModule,
    NzTableModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule,
    NzPopconfirmModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzRadioModule,
    NzAlertModule,
    NzCheckboxModule,
    NzSpinModule,
    NzSelectModule,
    NzGridModule,
  ],
})
export class DataMaintenanceModule {}
