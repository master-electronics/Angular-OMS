import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedUtilityModule } from '../../shared/shared-utility.module';

import { SimpleKeyboardComponent } from '../../components/simple-keyboard/simple-keyboard.component';
import { StepTabsComponent } from './step-tabs/step-tabs.component';
import { ReceivingComponent } from './receiving.component';
import { ReceivingService } from './receiving.server';
import { ReceivingRoutingModule } from './receiving.routing';
import { ReceiptComponent } from './input-receipt/receipt.component';
import { PartComponent } from './input-part/part.component';
import { VerifyComponent } from './verify/verify.component';
import { KickoutComponent } from './kickout/kickout.component';
import { PartFilterPipe } from './input-part/part-filter.pipe';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [
    SimpleKeyboardComponent,
    ReceivingComponent,
    StepTabsComponent,
    ReceiptComponent,
    PartComponent,
    VerifyComponent,
    KickoutComponent,
    PartFilterPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReceivingRoutingModule,
    ReactiveFormsModule,
    SharedUtilityModule,
    NzInputModule,
    NzSpinModule,
    NzFormModule,
    NzStepsModule,
    NzButtonModule,
    NzSkeletonModule,
    NzImageModule,
    NzDescriptionsModule,
    NzDrawerModule,
    NzSelectModule,
    NzTableModule,
  ],
  providers: [ReceivingService],
  bootstrap: [ReceivingComponent],
})
export class ReceivingModule {}
