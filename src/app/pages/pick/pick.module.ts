import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PickComponent } from './pick.component';
import { StepTabsComponent } from './step-tabs/step-tabs.component';
import { PickRoutingModule } from './pick.routing';
import { PickService } from './pick.server';
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';

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

@NgModule({
  declarations: [PickComponent, StepTabsComponent],
  imports: [
    CommonModule,
    FormsModule,
    PickRoutingModule,
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
    NzStepsModule,
    NzSpaceModule,
    NzImageModule,
    NzDividerModule,
    NzSelectModule,
    NzDrawerModule,
    NzModalModule,
  ],
  providers: [PickService],
  bootstrap: [PickComponent],
})
export class PickModule {}
