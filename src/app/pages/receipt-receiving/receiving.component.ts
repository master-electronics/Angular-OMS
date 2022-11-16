import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UIStateStore } from 'src/app/shared/data/app-ui-state';
import { CommonService } from 'src/app/shared/services/common.service';
import { StepBarComponent } from 'src/app/shared/ui/step-bar.component';
import { KickoutStore } from './data/kickout';
import { ReceiptStore } from './data/Receipt';
import { ReceivingStore, Tab } from './data/receivingStore';
import { updateReceiptStore } from './data/updateReceipt';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, StepBarComponent],
  providers: [
    ReceivingStore,
    ReceiptStore,
    KickoutStore,
    UIStateStore,
    updateReceiptStore,
  ],
  template: `
    <ng-container *ngIf="tab$ | async as input">
      <step-bar
        [currentStep]="input.currentStep"
        [steps]="input.steps"
      ></step-bar>
    </ng-container>
    <div class=" mx-auto mt-4 px-2 py-2 md:mt-6">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class ReceivingComponent implements OnInit {
  public tab$ = new Observable<Tab>();
  constructor(
    private commonService: CommonService,
    private _service: ReceivingStore
  ) {}

  ngOnInit(): void {
    this._service.initTab(this.steps);
    this.tab$ = this._service.tab$;
    this.commonService.changeNavbar('Receiving');
  }

  private readonly steps = [
    {
      title: 'Select',
      subtitle: '',
      description: 'ReceiptID, Part',
    },
    { title: 'Verify', subtitle: '', description: `Info, Quantity` },
    { title: 'Update', subtitle: '', description: `Country Date RHOS` },
    {
      title: 'Label',
      subtitle: '',
      description: 'Assign Label Quantity',
    },
    { title: 'ITN', subtitle: '', description: 'Print ITNs' },
  ];
}
