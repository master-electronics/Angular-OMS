import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { StepBarComponent } from 'src/app/shared/ui/step-bar/step-bar.component';
import { Tab, TabService } from 'src/app/shared/ui/step-bar/tab';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, StepBarComponent],
  template: `
    <div class="px-2 py-2">
      <div *ngIf="tab$ | async as tab" class="mb-4">
        <step-bar
          [currentStep]="tab.currentStep"
          [steps]="tab.steps"
        ></step-bar>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class StockingShell {
  constructor(private commonService: CommonService, private _tab: TabService) {}
  public tab$ = new Observable<Tab>();

  ngOnInit(): void {
    this.commonService.changeNavbar('Picking');
    this._tab.initTab(this.steps);
    this.tab$ = this._tab.tab$;
  }

  private readonly steps = [
    {
      title: 'ITN',
    },
    { title: 'Info' },
    { title: 'Verify' },
  ];
}
