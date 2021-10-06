import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentModule } from '../../components/shared-component.module';

import { AggregationInComponent } from './aggregation-in.component';
import { LocationComponent } from './location/location.component';
import { AggregationInRoutingModule } from './aggregation-in.routing';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
import { AggregationInService } from './aggregation-in.server';
// ng-zorro
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { VerifyToteComponent } from './verify-tote/verify-tote.component';
import { VerifyITNComponent } from './verify-itn/verify-itn.component';

@NgModule({
  declarations: [
    AggregationInComponent,
    LocationComponent,
    VerifyToteComponent,
    VerifyITNComponent,
  ],
  imports: [
    CommonModule,
    AggregationInRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
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
  providers: [AggregationInService],
  bootstrap: [AggregationInComponent],
})
export class AggregationInModule {}
