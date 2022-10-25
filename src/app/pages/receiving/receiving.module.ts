import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';

import { NzStepsModule } from 'ng-zorro-antd/steps';
import { StepTabsComponent } from './step-tabs/step-tabs.component';
import { ReceivingComponent } from './receiving.component';
import { ReceivingService } from './receiving.server';
import { ReceivingRoutingModule } from './receiving.routing';

@NgModule({
  declarations: [ReceivingComponent, StepTabsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReceivingRoutingModule,
    ReactiveFormsModule,
    SharedComponentModule,
    SharedUtilityModule,
    NzStepsModule,
  ],
  providers: [ReceivingService],
  bootstrap: [ReceivingComponent],
})
export class ReceivingModule {}
