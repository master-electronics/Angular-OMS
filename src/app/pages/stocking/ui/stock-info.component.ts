import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'stock-info',
  imports: [CommonModule],
  template: `
    <!-- Item Info -->
    <div class="col-span-2">
      <div
        class="grid grid-cols-3 justify-items-end gap-0 text-black md:text-lg lg:text-xl"
        *ngFor="let item of stockingInfo | keyvalue"
      >
        <span class="mr-2 font-medium">{{ item.key }}:</span>
        <span class="col-span-2 justify-self-start break-all text-blue-600">{{
          item.value
        }}</span>
      </div>
    </div>
  `,
})
export class StockInfoComponent {
  @Input() stockingInfo;
}
