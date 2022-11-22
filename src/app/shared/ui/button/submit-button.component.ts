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
      class="h-full w-full  rounded-lg bg-blue-700 font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      [disabled]="disabled"
      (click)="onClick()"
      type="submit"
    >
      {{ buttonText }}
    </button>
  `,
})
export class SubmitButtonComponent {
  @Input() disabled = false;
  @Input() buttonText = 'Submit';
  @Output() formClick: EventEmitter<null> = new EventEmitter();

  public onClick(): void {
    this.formClick.emit();
  }
}
