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
  selector: 'red-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      (click)="onClick()"
      class="w-full hover:bg-pink-400 btn btn-secondary btn-sm btn-active md:btn-md lg:btn-lg"
      type="button"
      [disabled]="disabled"
      *ngIf="!loading; else buttonLoading"
    >
      {{ buttonText }}
    </button>
    <ng-template #buttonLoading>
      <button
        type="button"
        class="w-full no-animation btn btn-sm btn-secondary md:btn-md lg:btn-lg"
      >
        <span class="loading loading-spinner"></span>
        loading
      </button>
    </ng-template>
  `,
})
export class RedButtonComponent {
  @Input() disabled = false;
  @Input() loading = false;
  @Input() buttonText = 'Cancel';
  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  public onClick(): void {
    this.buttonClick.emit();
  }
}
