import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  standalone: true,
  imports: [CommonModule, NzTableModule],
  selector: 'table-view',
  template: `
    <nz-table #table [nzData]="listOfData">
      <thead>
        <tr>
          <th
            *ngFor="let column of listOfColumn"
            [nzSortFn]="column.compare"
            [nzSortPriority]="column.priority"
          >
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of table.data" (click)="onClick(data)">
          <td *ngFor="let key of listOfColumn">
            {{ data[key.title] }}
          </td>
        </tr>
      </tbody>
    </nz-table>
  `,
})
export class TableViewComponent {
  @Input() listOfData = [];
  @Input() listOfColumn = [];
  @Output() click: EventEmitter<any> = new EventEmitter();

  public onClick(data): void {
    this.click.emit(data);
  }
}
