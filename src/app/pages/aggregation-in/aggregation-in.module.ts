import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentModule } from '../../components/shared-component.module';

import { AggregationInComponent } from './aggregation-in.component';
import { LocationComponent } from './location/location.component';
import { AggregationInRoutingModule } from './aggregation-in.routing';
import { SharedUtilityModule } from '../../shared/shared-utility.module';

@NgModule({
  declarations: [AggregationInComponent, LocationComponent],
  imports: [
    CommonModule,
    AggregationInRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    SharedUtilityModule,
  ],
  bootstrap: [AggregationInComponent],
})
export class AggregationInModule {}
