import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'itn-info',
  imports: [CommonModule],
  template: `
    <!-- Item Info -->
    <div
      class="grid grid-cols-3 justify-items-end gap-0 text-black md:text-lg lg:text-xl"
      *ngFor="let item of sortingInfo.info | keyvalue"
    >
      <span class="mr-2 font-medium">{{ item.key }}:</span>
      <span class="col-span-2 justify-self-start text-blue-600">{{
        item.value
      }}</span>
    </div>
    <!-- Suggetion location -->
    <table
      *ngIf="sortingInfo.locations?.length"
      class="w-full md:text-lg lg:text-xl"
    >
      <tr class="grid grid-cols-3">
        <th>Locations</th>
        <th>Zone</th>
        <th>Quantity</th>
      </tr>
      <tr
        *ngFor="let location of sortingInfo.locations"
        class="grid grid-cols-3 justify-items-center"
      >
        <td>{{ location.Bincode }}</td>
        <td>{{ location.Zone }}</td>
        <td>{{ location.Quantity }}</td>
      </tr>
    </table>
  `,
})
export class ITNInfoComponent {
  @Input() sortingInfo;
}
