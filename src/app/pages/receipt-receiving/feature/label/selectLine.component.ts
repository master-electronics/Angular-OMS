import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { TabService } from '../../data/tab';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';

interface DataItem {
  PurchaseOrder: string;
  Line: number;
  Quantity: number;
  Status: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, GreenButtonComponent, NormalButtonComponent],
  template: `
    <p class="text-4xl">Select One Receipt Line:</p>
    <div class="grid w-full grid-cols-3 gap-12 text-4xl md:mt-6">
      <div *ngFor="let option of data">
        <green-button
          (buttonClick)="onClick(option)"
          [buttonText]="option.content"
        >
        </green-button>
      </div>
      <normal-button
        class="col-start-1 h-32"
        (buttonClick)="onBack()"
      ></normal-button>
    </div>
  `,
})
export class SelectLineComponent implements OnInit {
  public data;
  public listOfColumn = [];

  constructor(
    private _router: Router,
    private _tab: TabService,
    private _receipt: ReceiptInfoService
  ) {}

  ngOnInit(): void {
    this.data = this._receipt.receiptLsAfterQuantity.map((res) => ({
      id: res._id,
      content: `Line ${res.LineNumber}`,
    }));
    this._tab.changeSteps(3);
  }

  public onClick(data): void {
    this._receipt.pickOneReceiptLine(data.id);
    this._router.navigateByUrl('receiptreceiving/label/assign');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/ROHS');
  }
}
