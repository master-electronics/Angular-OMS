import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Utiltiy Module
//UI Module
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus..directive';
// local components
import { IconsProviderModule } from '../../icons-provider.module';
import { StockingService } from './stocking.server';
import { StockingRoutingModule } from './stocking.routing';
import { StockingComponent } from './stocking.component';
import { ScanITNComponent } from './sorting/scan-ITN/scan-ITN.component';
import { SortingLocationComponent } from './sorting/sorting-location/sorting-location.component';
import { StartPageComponent } from './stocking/start-page/start-page';
import { StockingLocationComponent } from './stocking/stocking-location/stocking-location.component';
import { ITNListComponent } from './stocking/ITN-list/ITN-list';
import { VerifyITNMatchComponent } from './stocking/verify-ITN-match/verify-ITN';
import { VerifyITNMismatchComponent } from './stocking/verify-ITN-mismatch/verify-ITN-mismatch';
import { FocusInvlidInputDirective } from 'src/app/shared/directives/focusInvalidInput.directive';

@NgModule({
  declarations: [
    StockingComponent,
    ScanITNComponent,
    SortingLocationComponent,
    StartPageComponent,
    StockingLocationComponent,
    ITNListComponent,
    VerifyITNMatchComponent,
    VerifyITNMismatchComponent,
  ],
  imports: [
    CommonModule,
    StockingRoutingModule,
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
    IconsProviderModule,
    NzInputNumberModule,
    AutoFocusDirective,
    FocusInvlidInputDirective,
  ],
  providers: [StockingService],
  bootstrap: [StockingComponent],
})
export class StockingModule {}
