import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { StepBarComponent } from 'src/app/shared/ui/step-bar.component';
import { ReceivingService, Tab } from './data/receivingService';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, StepBarComponent],
  template: `
    <div class="px-2 py-2">
      <div *ngIf="tab$ | async as tab">
        <step-bar
          [currentStep]="tab.currentStep"
          [steps]="tab.steps"
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
    private _service: ReceivingService,
    private _title: Title
  ) {}

  ngOnInit(): void {
    this._service.initTab(this.steps);
    this.tab$ = this._service.tab$;
    this.commonService.changeNavbar('Receiving');
    this._title.setTitle('Receiving');
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
