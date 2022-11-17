import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReceiptStore } from '../../data/Receipt';
import { ReceivingStore } from '../../data/receivingStore';
import { TableViewComponent } from '../../../../shared/ui/table-view.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface DataItem {
  PurchaseOrder: string;
  Line: number;
  Quantity: number;
  Status: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, TableViewComponent, NzRadioModule, NzButtonModule],
  template: `
    <div class="grid-col-1 grid justify-center gap-12">
      <h1 class="text-lg">Select One Receipt Line:</h1>
      <nz-radio-group nzSize="large">
        <div
          *ngFor="let option of data"
          class="mb-4 grid grid-cols-2 justify-center gap-5"
        >
          <label
            nz-radio-button
            [nzValue]="option.id"
            (click)="onClick(option)"
            >{{ option.content }}</label
          >
        </div>
      </nz-radio-group>
      <button
        class="w-32"
        nz-button
        nzSize="large"
        type="button"
        (click)="onBack()"
      >
        Back
      </button>
    </div>
  `,
})
export class SelectLineComponent implements OnInit {
  public data;
  public listOfColumn = [];

  constructor(
    private _router: Router,
    private _tab: ReceivingStore,
    private _receipt: ReceiptStore
  ) {}

  ngOnInit(): void {
    if (!this._receipt.receiptLsAfterQuantity?.length) {
      this.onBack();
    }
    this.data = this._receipt.receiptLsAfterQuantity.map((res) => ({
      id: res._id,
      content: `Line ${res.LineNumber}`,
    }));
    this._tab.changeSteps(3);
  }

  public onClick(data): void {
    console.log(data);
    this._receipt.pickOneReceiptLine(data._id);
    this._router.navigateByUrl('receiptreceiving/label/assign');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/rohs');
  }
}
