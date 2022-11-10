import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'alert-bar',
  standalone: true,
  imports: [CommonModule, NzAlertModule],
  template: `
    <div nz-row *ngIf="error.error" nzJustify="center">
      <nz-alert
        [nzType]="error.messageType"
        [nzMessage]="error.error.message"
        nzShowIcon
        class="w-full"
      ></nz-alert>
    </div>
  `,
})
export class AlertBarComponent {
  @Input() error;
}
