import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QualityControlService } from './quality-control.server';
import { QualityControlComponent } from './quality-control.component';
import { QualityControlRoutingModule } from './quality-control.routing';
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
import { StepTabsComponent } from './step-tabs/step-tabs.component';
import { ScanItnComponent } from './scan-itn/scan-itn.component';
import { GlobalMessagesComponent } from './global-messages/global-messages.component';
import { VerifyPackComponent } from './verfiy-pack/verify-pack.component';
import { RepackComponent } from './repack/repack.component';
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

@NgModule({
  declarations: [
    QualityControlComponent,
    ScanItnComponent,
    StepTabsComponent,
    GlobalMessagesComponent,
    VerifyPackComponent,
    RepackComponent,
  ],
  imports: [
    CommonModule,
    QualityControlRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    SharedUtilityModule,
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
  ],
  providers: [QualityControlService],

  bootstrap: [QualityControlComponent],
})
export class QualityControlModule {}
