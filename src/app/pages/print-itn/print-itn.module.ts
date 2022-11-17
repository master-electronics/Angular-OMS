import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrintITNComponent } from './print-itn.component';
import { PrintITNRoutingModule } from './print-itn.routing';
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
