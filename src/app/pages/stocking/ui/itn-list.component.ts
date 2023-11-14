import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'itn-list',
  imports: [CommonModule],
  template: `
    <table *ngIf="ItnList" class="w-full md:text-lg lg:text-xl">
      <tr class="grid grid-cols-2">
        <th>ITN</th>
        <th>Quantity</th>
      </tr>
      <tr
        *ngFor="let itn of ItnList"
        class="grid grid-cols-2 justify-items-center"
      >
        <td>{{ itn.InventoryTrackingNumber }}</td>
        <td>{{ itn.QuantityOnHand }}</td>
      </tr>
    </table>
  `,
})
export class ItnListComponent {
  @Input() ItnList;
}
