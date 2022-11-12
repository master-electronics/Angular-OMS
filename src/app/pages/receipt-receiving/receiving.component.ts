import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { StepBarComponent } from 'src/app/shared/ui/step-bar.component';
import { ReceivingService } from './data/receiving.server';

@Component({
  standalone: true,
  imports: [RouterModule, StepBarComponent],
  providers: [ReceivingService],
  template: `
    <step-bar
      [currentTab$]="this._service.currentTab$"
      [steps]="receivingSteps"
    ></step-bar>
    <div class="container mx-auto px-2 py-2 md:mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class ReceivingComponent {
  constructor(
    private commonService: CommonService,
    public _service: ReceivingService
  ) {
    this.commonService.changeNavbar('Receiving');
  }
  receivingSteps = [
    { title: 'Receipt', subtitle: '', description: '' },
    { title: 'Part', subtitle: '', description: '' },
    { title: 'Verify', subtitle: '', description: '' },
    { title: 'Purchase Order', subtitle: '', description: '' },
    { title: 'ITN', subtitle: '', description: '' },
  ];
}
