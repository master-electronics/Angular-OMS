import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'alert-bar',
  standalone: true,
  imports: [CommonModule, NzAlertModule],
  template: `
    <div nz-row *ngIf="message" nzJustify="center">
      <nz-alert
        [nzType]="type"
        [nzMessage]="message"
        nzShowIcon
        class="w-full"
      ></nz-alert>
    </div>
  `,
})
export class AlertBarComponent {
  @Input() message = '';
  @Input() type;
}
