import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'form-button',
  templateUrl: './form-button.component.html',
})
export class SubmitButtonComponent {
  @Input() styles = 'bg-indigo-800';
  @Input() label = 'Submit';
  @Input() type = 'button';
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() isHighLight = false;
  @Output() onClickEmt = new EventEmitter<MouseEvent>();

  onClickButton(): void {
    this.onClickEmt.emit();
  }
}
