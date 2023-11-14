import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'suggetion-location',
  imports: [CommonModule],
  template: `
    <table class="w-full md:text-lg lg:text-xl">
      <tr class="grid grid-cols-3">
        <th>Locations</th>
        <th>Zone</th>
        <th>Quantity</th>
      </tr>
      <tr
        *ngFor="let location of locations"
        class="grid grid-cols-3 justify-items-center"
      >
        <td>{{ location.Bincode }}</td>
        <td>{{ location.Zone }}</td>
        <td>{{ location.Quantity }}</td>
      </tr>
    </table>
  `,
})
export class SuggetionLocationComponent {
  @Input() locations;
}
