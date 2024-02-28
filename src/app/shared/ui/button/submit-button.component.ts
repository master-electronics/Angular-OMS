import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'submit-button',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      *ngIf="!loading; else buttonLoading"
      type="submit"
      [disabled]="disabled"
      (click)="onClick()"
      class="w-full btn btn-sm btn-active btn-primary hover:bg-indigo-400 hover:text-gray-600 md:btn-md lg:btn-lg"
    >
      {{ buttonText }}
    </button>
    <ng-template #buttonLoading>
      <button
        type="button"
        class="w-full no-animation btn btn-sm btn-primary md:btn-md lg:btn-lg"
      >
        <span class="loading loading-spinner"></span>
        loading
      </button>
    </ng-template>
  `,
})
export class SubmitButtonComponent {
  @Input() disabled = false;
  @Input() loading = false;
  @Input() buttonText = 'Submit';
  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  public onClick(): void {
    this.buttonClick.emit();
  }
}
