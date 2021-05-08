import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { QualityControlService } from './quality-control.server';
import { QualityControlComponent } from './quality-control.component';
import { QualityControlRoutingModule } from './quality-control.routing';
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
import { StepTabsComponent } from './step-tabs/step-tabs.component';
import { ScanItnComponent } from './scan-itn/scan-itn.component';
import { VerifyPackComponent } from './verfiy-pack/verify-pack.component';

@NgModule({
  declarations: [QualityControlComponent, ScanItnComponent, StepTabsComponent, VerifyPackComponent],
  imports: [
    CommonModule,
    QualityControlRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    SharedComponentModule,
    SharedUtilityModule,
  ],
  providers: [QualityControlService],

  bootstrap: [QualityControlComponent],
})
export class QualityControlModule {}

export interface packInfo {}
