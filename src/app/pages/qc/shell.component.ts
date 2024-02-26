import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';
import { StepBarComponent } from 'src/app/shared/ui/step-bar/step-bar.component';
import { Tab, TabService } from 'src/app/shared/ui/step-bar/tab';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, StepBarComponent],
  template: `
    <div class="mx-auto px-2 py-2 ">
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
export class QualityControlShell {
  public tab$ = new Observable<Tab>();
  constructor(
    private _title: NavbarTitleService,
    private _service: TabService
  ) {}

  ngOnInit(): void {
    this._service.initTab(this.steps);
    this.tab$ = this._service.tab$;
    this._title.update('Quality Control');
  }

  private readonly steps = [
    {
      title: 'Scan ITN',
    },
    { title: 'Messages' },
    { title: 'Verifiy' },
    { title: 'Hold On' },
    {
      title: 'Repack',
    },
  ];
}
