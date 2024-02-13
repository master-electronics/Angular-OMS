import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// NG ZORRO
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { QualityControlService } from './quality-control.server';
import { QualityControlComponent } from './quality-control.component';
import { QualityControlRoutingModule } from './quality-control.routing';
import { StepTabsComponent } from './step-tabs/step-tabs.component';
import { ScanItnComponent } from './scan-itn/scan-itn.component';
import { GlobalMessagesComponent } from './global-messages/global-messages.component';
import { VerifyPackComponent } from './verfiy-pack/verify-pack.component';
import { RepackComponent } from './repack/repack.component';
import { FocusInvlidInputDirective } from 'src/app/shared/directives/focusInvalidInput.directive';
import { HDIService } from 'src/app/shared/data/hdi';
import { WeightScaleComponent } from 'src/app/shared/ui/button/weight-scale.component';
import { LogWeightComponent } from './log-weight.component';

@NgModule({
  declarations: [QualityControlComponent],
  imports: [
    CommonModule,
    QualityControlRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // NG ZORRO
    NzInputModule,
    NzSpinModule,
    NzButtonModule,
    NzFormModule,
    NzAlertModule,
    NzDescriptionsModule,
    NzSkeletonModule,
    NzStepsModule,
    NzSpaceModule,
    NzImageModule,
    NzDividerModule,
    NzSelectModule,
    NzDrawerModule,
    NzModalModule,
    //
    FocusInvlidInputDirective,
    ScanItnComponent,
    StepTabsComponent,
    GlobalMessagesComponent,
    VerifyPackComponent,
    WeightScaleComponent,
    LogWeightComponent,
    RepackComponent,
  ],
  providers: [QualityControlService, HDIService],
  bootstrap: [QualityControlComponent],
})
export class QualityControlModule {}
