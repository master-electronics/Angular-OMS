import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';

import { PickerManageComponent } from './picker-manage.component';
import { PickerManageRoutingModule } from './picker-manage.routing';

@NgModule({
  declarations: [PickerManageComponent],
  imports: [
    CommonModule,
    FormsModule,
    PickerManageRoutingModule,
    ReactiveFormsModule,
    SharedUtilityModule,
    SharedComponentModule,
  ],
  bootstrap: [PickerManageComponent],
})
export class LogViewerModule {}
