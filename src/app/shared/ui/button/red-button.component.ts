import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LoaderButtonComponent } from './loader-button.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'red-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoaderButtonComponent, CommonModule],
  template: `
    <button
      (click)="onClick()"
      class="h-full w-full rounded-lg bg-red-700 font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-red-200  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      type="button"
      [disabled]="disabled"
      *ngIf="!loading; else buttonLoading"
    >
      {{ buttonText }}
    </button>
    <ng-template #buttonLoading>
      <loader-button></loader-button>
    </ng-template>
  `,
})
export class RedButtonComponent {
  @Input() disabled = false;
  @Input() loading;
  @Input() buttonText = 'Cancel';
  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  public onClick(): void {
    this.buttonClick.emit();
  }
}
