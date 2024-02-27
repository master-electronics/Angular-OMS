import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NzImageModule } from 'ng-zorro-antd/image';
import { QcItnInfo } from '../data-access/order';

@Component({
  standalone: true,
  selector: 'verify-info',
  imports: [CommonModule, NzImageModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-6 gap-4">
      <!-- picture and print button -->
      <div class="...">
        <img
          nz-image
          [nzSrc]="imgUrl"
          width="200px"
          height="200px"
          alt="ProductImage"
          nzFallback="assets/img/image-not-found.png"
        />
      </div>

      <!-- ITN Info -->
      <div
        class="col-span-5 w-full bg-gray-200 text-lg rounded-lg shadow-md p-6 "
      >
        <div class="grid grid-cols-3 gap-6 ">
          <div class="items-center ">
            <span class="font-semibold mr-2">ITN:</span>
            <span>{{ itnInfo.InventoryTrackingNumber }}</span>
          </div>
          <div class="col-span-2 grid grid-cols-3">
            <div>
              <span class="font-semibold mr-2">PRC:</span>
              <span>{{ itnInfo.ProductCode }}</span>
            </div>
            <a [href]="productUrl" target="_blank" class="ml-4">Product</a>
            <a [href]="specSheetUrl" target="_blank" class="ml-4">SpecSheet</a>
          </div>
          <div class="col-span-3">
            <span class="font-semibold mr-2">Part Number:</span>
            <span>{{ itnInfo.PartNumber }}</span>
          </div>
          <div class="col-span-2">
            <span class="font-semibold mr-2">Quantity:</span>
            <span class="text-2xl">{{ itnInfo.Quantity }}</span>
          </div>
          <div class="..">
            <span class="font-semibold mr-2">HML:</span>
            <span *ngIf="HML; else no_content" class="text-2xl text-red-500"
              >Yes</span
            >
            <ng-template #no_content>
              <span class="text-2xl">No</span>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class VerifyInfoComponent {
  @Input() imgUrl = '';
  @Input() productUrl = '';
  @Input() specSheetUrl = '';
  @Input() HML = false;
  @Input() itnInfo: QcItnInfo;
}
