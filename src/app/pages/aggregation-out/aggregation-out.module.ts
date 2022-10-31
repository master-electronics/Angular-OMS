import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AggregationOutComponent } from './aggregation-out.component';
import { AggregationOutRoutingModule } from './aggregation-out.routing';
import { PickToteComponent } from './pick-tote/pick-tote.component';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
import { AggregationOutService } from './aggregation-out.server';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { PickITNComponent } from './pick-itn/pick-itn.component';

@NgModule({
  declarations: [AggregationOutComponent, PickToteComponent, PickITNComponent],
  imports: [
    CommonModule,
    AggregationOutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUtilityModule,
    NzInputModule,
    NzSpinModule,
    NzButtonModule,
    NzFormModule,
    NzAlertModule,
    NzDescriptionsModule,
    NzSkeletonModule,
    NzDividerModule,
  ],
  providers: [AggregationOutService],
  bootstrap: [AggregationOutComponent],
})
export class AggregationOutModule {}
