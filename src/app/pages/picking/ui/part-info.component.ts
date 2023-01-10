import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'picking-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <img width="600" height="600" [ngSrc]="MIC" priority />
    <div *ngFor="let item of info | keyvalue">
      <label for="ProductCode">{{ item.key }}</label>
      <input
        type="text"
        name="ProductCode"
        id="ProductCode"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        disabled
        [value]="item.value"
      />
    </div>
  `,
})
export class PickingInfoComponent {
  @Input() info;
  @Input() MIC;
}
