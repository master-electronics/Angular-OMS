import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: 'receipt-part-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="grid gap-6 text-lg md:grid-cols-2 md:text-2xl">
      <div>
        <label for="ProductCode">Product Code</label>
        <input
          type="text"
          name="ProductCode"
          id="ProductCode"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          disabled
          [value]="info.ProductCode"
        />
      </div>
      <div>
        <label for="PartNumber">Product Code</label>
        <input
          type="text"
          name="PartNumber"
          id="PartNumber"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          disabled
          [value]="info.PartNumber"
        />
      </div>
    </form>
  `,
})
export class ReceiptPartInfoComponent {
  @Input() info;
}
