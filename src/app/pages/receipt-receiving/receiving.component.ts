import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UIStateStore } from 'src/app/shared/data/app-ui-state';
import { CommonService } from 'src/app/shared/services/common.service';
import { StepBarComponent } from 'src/app/shared/ui/step-bar.component';
import { KickoutStore } from './data/kickout';
import { PartStore } from './data/part';
import { ReceivingUIStateStore, Tab } from './data/ui-state';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, StepBarComponent],
  providers: [ReceivingUIStateStore, PartStore, KickoutStore, UIStateStore],
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
    private _service: ReceivingUIStateStore
  ) {}

  ngOnInit(): void {
    this.tab$ = this._service.tab$;
    this.commonService.changeNavbar('Receiving');
  }
}
