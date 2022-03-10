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
import { IconsProviderModule } from '../../icons-provider.module';
import { PickRoutingModule } from './pick.routing';
import { PickService } from './pick.server';
import { PullITNComponent } from './pull-itn/pull-itn.component';
import { SelectCartComponent } from './select-cart/select-cart.component';
import { SelectLocationComponent } from './select-location/select-location.component';
import { DropOffComponent } from './drop-off/drop-off.component';
import { DetailAuthComponent } from './detail-auth/detail-auth.component';

@NgModule({
  declarations: [
    SelectCartComponent,
    SelectLocationComponent,
    PullITNComponent,
    DropOffComponent,
    DetailAuthComponent,
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
    IconsProviderModule,
  ],
  providers: [PickService],
  bootstrap: [SelectCartComponent],
})
export class PickModule {}
