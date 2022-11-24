import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'alert-bar',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class AlertBarComponent {
  public type;
  @Input() message = '';
  @Input() set name(name: string) {
    const list = ['error', 'success', 'info', 'warning'];
    if (list.includes(name)) {
      this.type = name;
      return;
    }
    this.type = 'error';
  }
}
