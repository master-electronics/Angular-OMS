import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'normal-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onClick()"
      class="h-full w-full rounded-lg border border-gray-200 bg-gray-100 font-medium text-gray-900 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
      type="button"
      [disabled]="disabled"
    >
      {{ buttonText }}
    </button>
  `,
})
export class NormalButtonComponent {
  @Input() disabled = false;
  @Input() buttonText = 'Back';
  @Output() formClick: EventEmitter<null> = new EventEmitter();

  public onClick(): void {
    this.formClick.emit();
  }
}
