import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Utiltiy Module
import { SharedComponentModule } from '../../components/shared-component.module';
import { SharedUtilityModule } from '../../shared/shared-utility.module';
//UI Module
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDividerModule } from 'ng-zorro-antd/divider';
// local components
import { PickRoutingModule } from './pick.routing';
import { PickService } from './pick.server';
import { PullITNComponent } from './pull-itn/pull-itn.component';
import { PickComponent } from './pick.component';
import { PositionComponent } from './position/position.component';
import { DropOffComponent } from './drop-off/drop-off.component';

@NgModule({
  declarations: [
    PickComponent,
    PullITNComponent,
    PositionComponent,
    DropOffComponent,
  ],
  imports: [
    CommonModule,
    PickRoutingModule,
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
  providers: [PickService],
  bootstrap: [PickComponent],
})
export class PickModule {}
