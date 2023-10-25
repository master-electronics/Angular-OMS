import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { StepBarComponent } from 'src/app/shared/ui/step-bar/step-bar.component';
import { TabService, Tab } from '../../shared/ui/step-bar/tab';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';

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
    private _title: NavbarTitleService,
    private _service: TabService
  ) {}

  ngOnInit(): void {
    this._service.initTab(this.steps);
    this.tab$ = this._service.tab$;
    this._title.update('Receiving');
  }

  private readonly steps = [
    {
      title: 'Create',
    },
    { title: 'Verify' },
    { title: 'Update' },
    {
      title: 'Label',
    },
  ];
}
