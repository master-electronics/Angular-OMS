import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: 'itn-info-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
})
export class InfoListComponent {
  @Input() info;
}
