import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'sort-info',
  imports: [CommonModule],
  template: `
    <!-- Item Info -->
    <div class="grid grid-cols-3">
      <div class="col-span-2">
        <div
          class="grid grid-cols-3 justify-items-end gap-0 text-black md:text-lg lg:text-xl"
          *ngFor="let item of sortingInfo | keyvalue"
        >
          <span class="mr-2 font-medium">{{ item.key }}:</span>
          <span class="col-span-2 justify-self-start break-all text-blue-600">{{
            item.value
          }}</span>
        </div>
      </div>

      <div
        class="grid grid-cols-3 justify-items-end gap-0 text-black md:text-lg lg:text-xl"
      >
        <span class="mr-2 font-medium">AutoStore:</span>
        <span class="col-span-2 justify-self-start text-blue-600"> F</span>

        <span class="mr-2 font-medium">In:</span>
        <span class="col-span-2 justify-self-start text-blue-600"> 00</span>

        <span class="mr-2 font-medium">Out:</span>
        <span class="col-span-2 justify-self-start text-blue-600"> 00</span>

        <span class="mr-2 font-medium">Current:</span>
        <span class="col-span-2 justify-self-start text-blue-600"> 00</span>
      </div>
    </div>
  `,
})
export class SortInfoComponent {
  @Input() sortingInfo;
}
