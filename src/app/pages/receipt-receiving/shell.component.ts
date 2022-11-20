import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CountryListService } from 'src/app/shared/data/countryList';
import { GlobalService } from 'src/app/shared/data/Global';
import { CommonService } from 'src/app/shared/services/common.service';
import { StepBarComponent } from 'src/app/shared/ui/step-bar.component';
import { KickoutService } from './data/kickout';
import { LabelService } from './data/label';
import { ReceiptInfoService } from './data/ReceiptInfo';
import { ReceivingService, Tab } from './data/receivingService';
import { updateReceiptInfoService } from './data/updateReceipt';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, StepBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ReceivingService,
    ReceiptInfoService,
    KickoutService,
    GlobalService,
    updateReceiptInfoService,
    LabelService,
    CountryListService,
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
      title: 'Select',
      subtitle: '',
      description: 'ReceiptID, Part',
    },
    { title: 'Verify', subtitle: '', description: `Info, Quantity` },
    { title: 'Update', subtitle: '', description: `Country Date ROHS` },
    {
      title: 'Label',
      subtitle: '',
      description: 'Assign Print',
    },
  ];
}
