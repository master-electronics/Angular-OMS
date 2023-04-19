import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'itn-info',
  imports: [CommonModule],
  template: `
    <div *ngIf="itnInfo">
      <div
        class="grid grid-cols-5 justify-items-end gap-0 text-black md:text-lg lg:text-xl"
        *ngIf="itnInfo.Warehouse || itnInfo.Row"
      >
        <span></span>
        <span class="mr-2 font-medium">Warehouse:</span>
        <span class="justify-self-start text-blue-600">
          {{ itnInfo.Warehouse }}
        </span>
        <span class="mr-2 font-medium">Row:</span>
        <span class="justify-self-start text-blue-600">
          {{ itnInfo.Row }}
        </span>
      </div>
      <div
        class="grid grid-cols-5 justify-items-end gap-0 text-black md:text-lg lg:text-xl"
        *ngIf="itnInfo.Aisle || itnInfo.Section"
      >
        <span></span>
        <span class="mr-2 font-medium">Aisle:</span>
        <span class="justify-self-start text-blue-600">
          {{ itnInfo.Aisle }}
        </span>
        <span class="mr-2 font-medium">Section:</span>
        <span class="justify-self-start text-blue-600">
          {{ itnInfo.Section }}
        </span>
      </div>
      <div
        class="grid grid-cols-5 justify-items-end gap-0 text-black md:text-lg lg:text-xl"
        *ngIf="itnInfo.Shelf || itnInfo.ShelfDetail"
      >
        <span></span>
        <span class="mr-2 font-medium">Shelf:</span>
        <span class="justify-self-start text-blue-600">
          {{ itnInfo.Shelf }}
        </span>
        <span class="mr-2 font-medium">Detail:</span>
        <span class="justify-self-start text-blue-600">
          {{ itnInfo.ShelfDetail }}
        </span>
      </div>
      <div
        class="grid grid-cols-5 justify-items-end gap-0 text-black md:text-lg lg:text-xl"
        *ngIf="itnInfo.InventoryTrackingNumber"
      >
        <span></span>
        <span class="mr-2 font-medium">ITN:</span>
        <span class="col-span-3 justify-self-start text-blue-600">
          {{ itnInfo.InventoryTrackingNumber }}
        </span>
      </div>
    </div>
  `,
})
export class ITNInfoComponent {
  @Input() itnInfo;
}
