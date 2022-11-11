import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, NzStepsModule],
  selector: 'step-bar',
  template: `
    <nz-steps [nzCurrent]="currentTab$ | async">
      <nz-step
        *ngFor="let step of steps"
        [nzTitle]="step.title"
        [nzSubtitle]="step.subtitle"
        [nzDescription]="step.description"
      ></nz-step>
    </nz-steps>
  `,
})
export class StepBarComponent {
  @Input() currentTab$!: Observable<number>;
  @Input() steps: { title: string; subtitle?: string; description?: string }[];
}
