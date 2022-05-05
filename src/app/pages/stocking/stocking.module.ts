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
import { StockingService } from './stocking.server';
import { StockingRoutingModule } from './stocking.routing';
import { StockingComponent } from './stocking.component';
import { ScanITNComponent } from './sorting/scan-ITN/scan-ITN.component';

@NgModule({
  declarations: [StockingComponent, ScanITNComponent],
  imports: [
    CommonModule,
    StockingRoutingModule,
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
  providers: [StockingService],
  bootstrap: [StockingComponent],
})
export class StockingModule {}
