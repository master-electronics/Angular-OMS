import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'green-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onClick()"
      class="h-full w-full rounded-lg bg-green-700 font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      type="button"
      [disabled]="disabled"
    >
      {{ buttonText }}
    </button>
  `,
})
export class GreenButtonComponent {
  @Input() disabled = false;
  @Input() buttonText = 'Back';
  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  public onClick(): void {
    this.buttonClick.emit();
  }
}
