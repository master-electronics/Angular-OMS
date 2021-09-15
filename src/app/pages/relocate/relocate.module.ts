import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentModule } from '../../components/shared-component.module';

import { RelocateComponent } from './relocate.component';
import { DestinationComponent } from './destination.component';
import { RelocateRoutingModule } from './relocate.routing';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [RelocateComponent, DestinationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    SharedUtilityModule,
    RelocateRoutingModule,
    NzInputModule,
    NzModalModule,
    NzAlertModule,
    NzFormModule,
    NzButtonModule,
  ],
  bootstrap: [RelocateComponent],
})
export class RelocateModule {}
