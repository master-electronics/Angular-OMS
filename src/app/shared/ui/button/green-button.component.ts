import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onClick()"
      class="w-full btn btn-sm btn-active btn-accent hover:bg-teal-400 md:btn-md lg:btn-lg"
      type="button"
      [disabled]="disabled"
      *ngIf="!loading; else buttonLoading"
    >
      {{ buttonText }}
    </button>
    <ng-template #buttonLoading>
      <button
        type="button"
        class="w-full no-animation btn btn-sm btn-accent md:btn-md lg:btn-lg"
      >
        <span class="loading loading-spinner"></span>
        loading
      </button>
    </ng-template>
  `,
})
export class GreenButtonComponent {
  @Input() disabled = false;
  @Input() loading = false;
  @Input() buttonText = 'Back';
  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  public onClick(): void {
    this.buttonClick.emit();
  }
}
