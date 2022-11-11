import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReceivingComponent } from './receiving.component';
import { ReceivingService } from './data/receiving.server';
import { StepBarComponent } from 'src/app/shared/ui/step-bar.component';
import { ReceivingRoutingModule } from './receiving.routing';

@NgModule({
  declarations: [ReceivingComponent],
  imports: [CommonModule, StepBarComponent, ReceivingRoutingModule],
  providers: [ReceivingService],
  bootstrap: [ReceivingComponent],
})
export class ReceivingModule {}
