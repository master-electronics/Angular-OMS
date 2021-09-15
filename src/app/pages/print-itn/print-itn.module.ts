import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentModule } from '../../components/shared-component.module';

import { PrintITNComponent } from './print-itn.component';
import { PrintITNRoutingModule } from './print-itn.routing';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [PrintITNComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    SharedUtilityModule,
    PrintITNRoutingModule,
    NzInputModule,
    NzModalModule,
    NzAlertModule,
    NzFormModule,
    NzButtonModule,
  ],
  bootstrap: [PrintITNComponent],
})
export class PrintITNModule {}
