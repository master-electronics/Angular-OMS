import { Component, Input } from '@angular/core';

@Component({
  selector: 'message-bar',
  templateUrl: './message-bar.component.html',
})
export class MessageBarComponent {
  @Input() message: string;
  @Input() type: string;
}
