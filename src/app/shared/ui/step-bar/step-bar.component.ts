import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, NzStepsModule],
  selector: 'step-bar',
  templateUrl: './step-bar.component.html',
})
export class StepBarComponent {
  @Input() currentTab$!: Observable<number>;
  @Input() steps: { title: string; subtitle?: string; description?: string }[];
}
