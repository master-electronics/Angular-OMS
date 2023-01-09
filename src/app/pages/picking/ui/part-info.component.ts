import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'picking-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: ``,
})
export class PickingInfoComponent {
  @Input() info;
}
