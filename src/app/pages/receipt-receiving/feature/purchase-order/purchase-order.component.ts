import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import {
  catchError,
  map,
  mergeMap,
  Observable,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { FindReceiptLineForReceivingGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { TableViewComponent } from '../../ui/table-view.component';

interface DataItem {
  PurchaseOrder: string;
  Line: number;
  Quantity: number;
  Status: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, TableViewComponent, NzSkeletonModule],
  template: `<div *ngIf="data$ | async as info">
      <div *ngIf="info.value; else loading">
        <p class="mt-2">Purchase Order List</p>
        <table-view
          [listOfData]="info.value"
          [listOfColumn]="listOfColumn"
          (click)="onClick($event)"
        ></table-view>
      </div>
    </div>
    <ng-template #loading>
      <nz-skeleton-element
        nzType="image"
        [nzActive]="true"
      ></nz-skeleton-element>
      <nz-skeleton [nzActive]="true"></nz-skeleton>
    </ng-template> `,
})
export class PurchaseOrderComponent {
  public data$: Observable<any>;
  public listOfColumn = [];

  constructor(
    private _router: Router,
    private _findLines: FindReceiptLineForReceivingGQL
  ) {
    // this.data$ = this._service.getReceiptHInfo().pipe(
    //   take(1),
    //   mergeMap((res) =>
    //     this._findLines.fetch({
    //       ProductID: res.value[0].ProductID,
    //     })
    //   ),
    //   map((res) => {
    //     const tableList = [];
    //     res.data.findReceiptLs.map((line) => {
    //       line.RECEIPTLDs.map((detail) => {
    //         const node = {
    //           PurchaseOrder:
    //             detail.PurchaseOrderL.PurchaseOrderH.PurchaseOrderNumber,
    //           Line: detail.PurchaseOrderL.LineNumber,
    //           Quantity: detail.ExpectedQuantity,
    //           Status: detail.ReceiptStatus.Name,
    //         };
    //         tableList.push(node);
    //       });
    //     });
    //     this.listOfColumn = [
    //       {
    //         title: 'PurchaseOrder',
    //         compare: (a: DataItem, b: DataItem) =>
    //           a.PurchaseOrder.localeCompare(b.PurchaseOrder),
    //       },
    //       {
    //         title: 'Line',
    //         compare: (a: DataItem, b: DataItem) => a.Line - b.Line,
    //       },
    //       {
    //         title: 'Quantity',
    //         compare: (a: DataItem, b: DataItem) => a.Quantity - b.Quantity,
    //       },
    //       {
    //         title: 'Status',
    //         compare: (a: DataItem, b: DataItem) =>
    //           a.Status.localeCompare(b.Status),
    //       },
    //     ];
    //     return {
    //       isLoading: false,
    //       value: tableList,
    //     };
    //   }),
    //   tap((res) => {
    //     this._service.changereceiptH(res);
    //   }),
    //   catchError((error) =>
    //     of({ isLoading: false, error, messageType: 'error' })
    //   ),
    //   startWith({ isLoading: true })
    // );
  }

  public onClick(data): void {
    this._router.navigateByUrl('receiptreceiving/purchaseorder/quantity');
  }
}
