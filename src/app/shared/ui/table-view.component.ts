import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NzTableModule],
  selector: 'table-view',
  template: `
    <nz-table id="table-view" #table [nzData]="data">
      <thead>
        <tr>
          <ng-container
            *ngTemplateOutlet="
              headers || defaultHeaderTemplate;
              context: { $implicit: data }
            "
          ></ng-container>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of data" (click)="onClick(data)">
          <ng-container
            *ngTemplateOutlet="
              rows || defaultRowTemplate;
              context: { $implicit: row }
            "
          ></ng-container>
        </tr>
      </tbody>
    </nz-table>

    <!-- If no template is provided use keys as headers and display all values -->
    <ng-template #defaultHeaderTemplate let-data>
      <th *ngFor="let header of data[0] | keyvalue">
        {{ header.key }}
      </th>
    </ng-template>

    <ng-template #defaultRowTemplate let-row>
      <td *ngFor="let node of row | keyvalue">{{ node.value }}</td>
    </ng-template>
  `,
})
export class TableViewComponent {
  @Input() data!: any[];
  @Input() listOfColumn;
  @ContentChild('headers') headers: TemplateRef<any> | undefined;
  @ContentChild('rows') rows: TemplateRef<any> | undefined;
  @Output() click: EventEmitter<any> = new EventEmitter();

  public onClick(data): void {
    if (!data) {
      return;
    }
    this.click.emit(data);
  }
}
