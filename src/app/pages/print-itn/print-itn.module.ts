import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentModule } from '../../components/shared-component.module';

import { PrintITNComponent } from './print-itn.component';
import { PrintITNRoutingModule } from './print-itn.routing';
import { SharedUtilityModule } from '../../shared/shared-utility.module';

@NgModule({
  declarations: [PrintITNComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    SharedUtilityModule,
    PrintITNRoutingModule,
  ],
  bootstrap: [PrintITNComponent],
})
export class PrintITNModule {}
