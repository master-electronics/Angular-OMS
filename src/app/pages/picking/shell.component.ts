import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { StepBarComponent } from 'src/app/shared/ui/step-bar.component';
import { Tab, TabService } from './data/step.service';

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
export class StockingShell {
  public tab$ = new Observable<Tab>();
  constructor(
    private commonService: CommonService,
    private _tab: TabService,
    private _title: Title
  ) {}

  ngOnInit(): void {
    this._tab.initTab(this.steps);
    this.tab$ = this._tab.tab$;
    this.commonService.changeNavbar('Picking');
    this._title.setTitle('Picking');
  }

  private readonly steps = [
    {
      title: 'ITN',
    },
    { title: 'Verify' },
    { title: 'Update' },
    {
      title: 'Label',
    },
  ];
}
