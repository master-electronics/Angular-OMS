import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PullQueueService } from '../../data/pull-queue.service';

@Component({
  standalone: true,
  imports: [CommonModule, NzGridModule, NzTableModule, NzButtonModule],
  template: `<div *ngIf="data$ | async"></div>
    <div style="margin-bottom: 16px">
      <button
        nz-button
        nzType="primary"
        [disabled]="setOfCheckedId.size === 0"
        (click)="removeItems()"
      >
        Remove
      </button>
      <span style="margin-left: 8px"
        >{{ setOfCheckedId.size }}
        {{ setOfCheckedId.size == 1 ? 'item' : 'items' }} selected</span
      >
    </div>
    <nz-table
      #pullQueue
      [nzData]="pullQueueTableData"
      [nzFooter]="pullQueueFooter"
    >
      <thead>
        <tr>
          <th
            [nzChecked]="checked"
            [nzIndeterminate]="indeterminate"
            nzLabel="Select all"
            (nzCheckedChange)="onAllChecked($event)"
          ></th>
          <th>ITN</th>
          <th>Barcode</th>
          <th>Warehouse</th>
          <th>Row</th>
          <th>Aisle</th>
          <th>Section</th>
          <th>Shelf</th>
          <th>Shelf Detail</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of pullQueue.data">
          <td
            [nzChecked]="setOfCheckedId.has(data._id)"
            [nzLabel]="data.InventoryTrackingNumber"
            (nzCheckedChange)="onItemChecked(data._id, $event)"
          ></td>
          <td>{{ data.InventoryTrackingNumber }}</td>
          <td>{{ data.Barcode }}</td>
          <td>{{ data.Warehosue }}</td>
          <td>{{ data.Row }}</td>
          <td>{{ data.Aisle }}</td>
          <td>{{ data.Section }}</td>
          <td>{{ data.Shelf }}</td>
          <td>{{ data.ShelfDetail }}</td>
        </tr>
      </tbody>
    </nz-table>
    <ng-template #pullQueueFooter>
      <span>ITN Count: {{ pullQueueTableData.length }}</span>
    </ng-template>`,
})
export class PullingQueue implements OnInit {
  constructor(
    private _actRoute: ActivatedRoute,
    private _pullQueueService: PullQueueService
  ) {}
  public data$;
  pullQueueTableData = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  ngOnInit(): void {
    this.data$ = this._actRoute.data.pipe(
      map((res) => {
        res.PullQueue.forEach((item) => {
          this.pullQueueTableData.push({
            _id: Number(item._id),
            InventoryTrackingNumber: item.InventoryTrackingNumber,
            Barcode: item.Barcode,
            Warehosue: item.Warehouse,
            Row: item.Row,
            Aisle: item.Aisle,
            Section: item.Section,
            Shelf: item.Shelf,
            ShelfDetail: item.ShelfDetail,
          });
        });
      })
    );
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.pullQueueTableData.every(({ _id }) =>
      this.setOfCheckedId.has(_id)
    );

    this.indeterminate =
      this.pullQueueTableData.some(({ _id }) => this.setOfCheckedId.has(_id)) &&
      !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.pullQueueTableData.forEach(({ _id }) =>
      this.updateCheckedSet(_id, checked)
    );

    this.refreshCheckedStatus();
  }

  removeItems() {
    this.data$ = this._pullQueueService
      .removePullingQueueItems(Array.from(this.setOfCheckedId))
      .pipe(
        switchMap(() => {
          return this._pullQueueService.pullQueue$.pipe(
            map((res) => {
              const tableData = JSON.parse(
                JSON.stringify(this.pullQueueTableData)
              );
              this.setOfCheckedId.forEach((id) => {
                const item = tableData.find((item) => item._id == id);

                if (item) {
                  const index = tableData.indexOf(item);
                  if (index > -1) {
                    tableData.splice(index, 1);
                  }
                }
              });
              this.pullQueueTableData = tableData;
              this.checked = false;
              this.indeterminate = false;
              this.setOfCheckedId.clear();
            })
          );
        }),
        catchError((error) => {
          return of(false);
        })
      );
  }
}
