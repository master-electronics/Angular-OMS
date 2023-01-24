import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'red-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onClick()"
      class="h-full w-full rounded-lg bg-red-700 font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      type="button"
      [disabled]="disabled"
    >
      {{ buttonText }}
    </button>
  `,
})
export class RedButtonComponent {
  @Input() disabled = false;
  @Input() buttonText = 'Cancel';
  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  public onClick(): void {
    this.buttonClick.emit();
  }
}
