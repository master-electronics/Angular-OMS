import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentModule } from '../../components/shared-component.module';

import { RelocateComponent } from './relocate.component';
import { DestinationComponent } from './destination.component';
import { RelocateRoutingModule } from './relocate.routing';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
import { NzInputModule } from 'ng-zorro-antd/input';

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
  ],
  bootstrap: [RelocateComponent],
})
export class RelocateModule {}
