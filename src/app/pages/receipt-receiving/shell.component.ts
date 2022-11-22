import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { StepBarComponent } from 'src/app/shared/ui/step-bar.component';
import { ReceivingService, Tab } from './data/receivingService';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, StepBarComponent],
  template: `
    <div class=" mx-auto px-2 py-2">
      <div *ngIf="tab$ | async as input">
        <step-bar
          [currentStep]="input.currentStep"
          [steps]="input.steps"
        ></step-bar>
      </div>
      <div class="mt-4">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class ReceivingShell implements OnInit {
  public tab$ = new Observable<Tab>();
  constructor(
    private commonService: CommonService,
    private _service: ReceivingService
  ) {}

  ngOnInit(): void {
    this._service.initTab(this.steps);
    this.tab$ = this._service.tab$;
    this.commonService.changeNavbar('Receiving');
  }

  private readonly steps = [
    {
      title: 'Identify',
    },
    { title: 'Verify' },
    { title: 'Update' },
    {
      title: 'Label',
    },
  ];
}
