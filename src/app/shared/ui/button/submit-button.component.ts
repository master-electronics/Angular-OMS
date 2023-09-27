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
  selector: 'submit-button',
  imports: [LoaderButtonComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onClick()"
      class="h-full w-full  rounded-lg bg-blue-700 font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-200 dark:bg-blue-600 dark:focus:ring-blue-800"
      type="submit"
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
export class SubmitButtonComponent {
  @Input() disabled = false;
  @Input() loading;
  @Input() buttonText = 'Submit';
  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  public onClick(): void {
    this.buttonClick.emit();
  }
}
