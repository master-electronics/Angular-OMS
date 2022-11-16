import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { ReceiptStore } from '../../data/Receipt';
import { ReceivingStore } from '../../data/receivingStore';
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
  template: `
    <div *ngIf="table$ | async as table">
      <div *ngIf="!table.loading; else loading">
        <p class="mt-2">Purchase Order List</p>
        <table-view
          [listOfData]="table.value"
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
    </ng-template>
  `,
})
export class SelectLineComponent implements OnInit {
  public table$: Observable<any>;
  public listOfColumn = [];

  constructor(
    private _router: Router,
    private _tab: ReceivingStore,
    private _receipt: ReceiptStore
  ) {}

  ngOnInit(): void {
    if (!this._receipt.receiptLsAfterQuantity?.length) {
      // this.onBack();
    }
    this._tab.changeSteps(3);
  }

  public onClick(data): void {
    this._router.navigateByUrl('receiptreceiving/purchaseorder/assignlabel');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/rohs');
  }
}
