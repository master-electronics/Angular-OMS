import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AggregationInComponent } from './aggregation-in.component';
import { LocationComponent } from './location/location.component';
import { AggregationInRoutingModule } from './aggregation-in.routing';
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
import { FocusInvlidInputDirective } from 'src/app/shared/directives/focusInvalidInput.directive';

@NgModule({
  declarations: [AggregationInComponent],
  imports: [
    CommonModule,
    AggregationInRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSpinModule,
    NzButtonModule,
    NzFormModule,
    NzAlertModule,
    NzDescriptionsModule,
    NzSkeletonModule,
    NzDividerModule,
    FocusInvlidInputDirective,
    LocationComponent,
    VerifyToteComponent,
    VerifyITNComponent,
  ],
  providers: [AggregationInService],
  bootstrap: [AggregationInComponent],
})
export class AggregationInModule {}
