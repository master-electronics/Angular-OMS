import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AggregationOutComponent } from './aggregation-out.component';
import { AggregationOutRoutingModule } from './aggregation-out.routing';
import { PickComponent } from './pick/pick.component';
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';

@NgModule({
  declarations: [AggregationOutComponent, PickComponent],
  imports: [
    CommonModule,
    AggregationOutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    SharedUtilityModule,
  ],
  bootstrap: [AggregationOutComponent],
})
export class AggregationOutModule {}
