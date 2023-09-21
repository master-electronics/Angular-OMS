import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'select-input',
  template: `
    <label
      for="select"
      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
    >
      {{ label }}
    </label>
    <select
      id="select"
      [formControl]="control"
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
    >
      <option *ngFor="let option of options" [value]="option.value">
        {{ option.prop }}
      </option>
    </select>
  `,
})
export class SelectInputComponent {
  @Input() options: { value: string; prop: string }[];
  @Input() control: FormControl; /* form control */
  @Input() label: string;
}
