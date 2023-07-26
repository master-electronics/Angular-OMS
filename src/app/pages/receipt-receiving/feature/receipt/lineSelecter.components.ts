import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { CreateReceiptService } from '../../data/createReceipt';
import { TableViewComponent } from 'src/app/shared/ui/table-view.component';

@Component({
  standalone: true,
  imports: [CommonModule, TableViewComponent],
  template: `
    <div class="flew justify-center gap-2 md:gap-6 lg:gap-12">
      <h1 class="text-4xl">Generate Receipt:</h1>
      <table-view
        [listOfData]="this.createreceipt.linesInfo"
        [listOfColumn]="listOfColumn"
        (click)="onSelect($event)"
      ></table-view>
    </div>
  `,
})
export class LineSelecterComponent implements OnInit {
  public listOfColumn = [
    {
      title: 'LineNumber',
      compare: (a: string, b: string) => a.localeCompare(b),
      priority: false,
    },
    {
      title: 'ProductCode',
      compare: (a: string, b: string) => a.localeCompare(b),
      priority: false,
    },
    {
      title: 'PartNumber',
      compare: (a: string, b: string) => a.localeCompare(b),
      priority: false,
    },
    {
      title: 'VendorName',
      compare: (a: string, b: string) => a.localeCompare(b),
      priority: false,
    },
    {
      title: 'QuantityOnOrder',
      compare: (a: string, b: string) => a.localeCompare(b),
      priority: false,
    },
    {
      title: 'QuantityReceived',
      compare: (a: string, b: string) => a.localeCompare(b),
      priority: false,
    },
  ];
  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _steps: TabService,
    public createreceipt: CreateReceiptService
  ) {}

  ngOnInit(): void {
    this._steps.changeSteps(0);
  }

  public onBack(): void {
    this._router.navigateByUrl('home');
  }

  public onSelect(data): void {
    if (!data.LineNumber) {
      return;
    }
    this.createreceipt.updatePurchaseInfo({ LineNumber: data.LineNumber });
    this.createreceipt.updateLeftQuantity(
      data.QuantityOnOrder - data.QuantityReceived
    );
    if (this.createreceipt.purchaseInfo.LineNumber) {
      console.log('111');
    }
    this._router.navigate(['../receiptquantity'], {
      relativeTo: this._actRoute,
    });
  }
}
