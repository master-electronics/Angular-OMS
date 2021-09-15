import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentModule } from '../../components/shared-component.module';

import { PrintITNComponent } from './print-itn.component';
import { PrintITNRoutingModule } from './print-itn.routing';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
import { NzInputModule } from 'ng-zorro-antd/input';

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
  ],
  bootstrap: [PrintITNComponent],
})
export class PrintITNModule {}
