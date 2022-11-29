import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
// Utiltiy Module
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
// local components
import { PickRoutingModule } from './pick.routing';
import { PickService } from './pick.server';
import { PullITNComponent } from './pull-itn/pull-itn.component';
import { SelectCartComponent } from './select-cart/select-cart.component';
import { SelectLocationComponent } from './select-location/select-location.component';
import { DropOffComponent } from './drop-off/drop-off.component';
import { DetailAuthComponent } from './detail-auth/detail-auth.component';
import { PullerAssignmentComponent } from './puller-assignment/puller-assignment.component';
import { FocusInvlidInputDirective } from 'src/app/shared/directives/focusInvalidInput.directive';

@NgModule({
  declarations: [
    SelectCartComponent,
    SelectLocationComponent,
    PullITNComponent,
    DropOffComponent,
    DetailAuthComponent,
    PullerAssignmentComponent,
  ],
  imports: [
    CommonModule,
    PickRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSpinModule,
    NzButtonModule,
    NzFormModule,
    NzAlertModule,
    NzDescriptionsModule,
    NzSkeletonModule,
    NzDividerModule,
    NzSelectModule,
    NzSliderModule,
    NzTableModule,
    NzDropDownModule,
    NzRadioModule,
    DragDropModule,
    NzCheckboxModule,
    FocusInvlidInputDirective,
  ],
  providers: [PickService],
  bootstrap: [SelectCartComponent],
})
export class PickModule {}
