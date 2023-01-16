import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'receipt-header-table',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead
        class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">ReceiptID</th>
          <th scope="col" class="px-6 py-3">Vendor</th>
        </tr>
      </thead>
      <ng-container *ngIf="headerList?.length">
        <tbody>
          <tr
            class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            *ngFor="let node of headerList"
            (click)="onSelected(node._id)"
          >
            <th
              scope="row"
              class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
              {{ node._id }}
            </th>
            <td class="px-6 py-4">{{ node.VendorName }}</td>
          </tr>
        </tbody>
      </ng-container>
    </table>
  `,
})
export class ReceiptHeaderTableComponent {
  @Input() headerList = [];
  @Output() selectCol: EventEmitter<number> = new EventEmitter();
  onSelected(id: number): void {
    this.selectCol.emit(id);
  }
}
