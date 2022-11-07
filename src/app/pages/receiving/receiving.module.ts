import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SimpleKeyboardComponent } from '../../shared/ui/simple-keyboard/simple-keyboard.component';
import { ReceivingComponent } from './receiving.component';
import { ReceivingService } from './data/receiving.server';
import { ReceivingRoutingModule } from './receiving.routing';
import { ReceiptComponent } from './feature/receipt/receipt.component';
import { PartComponent } from './feature/part/part.component';
import { VerifyComponent } from './feature/verify/verify.component';
import { KickoutComponent } from './feature/kickout/kickout.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { StepBarComponent } from 'src/app/shared/ui/step-bar/step-bar.component';

@NgModule({
  declarations: [
    ReceivingComponent,
    ReceiptComponent,
    PartComponent,
    VerifyComponent,
    KickoutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SimpleKeyboardComponent,
    StepBarComponent,
    ReceivingRoutingModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSpinModule,
    NzFormModule,
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
