import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'submit-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onClick()"
      class="h-full w-full  rounded-lg bg-blue-700 font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-200 dark:bg-blue-600 dark:focus:ring-blue-800"
      type="submit"
      [disabled]="disabled"
    >
      {{ buttonText }}
    </button>
  `,
})
export class SubmitButtonComponent {
  @Input() disabled = false;
  @Input() buttonText = 'Submit';
  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  public onClick(): void {
    this.buttonClick.emit();
  }
}
