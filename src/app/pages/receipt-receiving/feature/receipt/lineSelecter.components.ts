import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { CreateReceiptService } from '../../data/createReceipt';
import { TableViewComponent } from 'src/app/shared/ui/table-view.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    TableViewComponent,
    NormalButtonComponent,
  ],
  template: `
    <div class="flew justify-center gap-2 md:gap-6 lg:gap-12">
      <h1 class="text-4xl">Select One Receipt Line:</h1>
      <table-view [data]="this.createreceipt.linesInfo">
        <ng-template #headers>
          <th
            *ngFor="let header of listOfColumn"
            [nzSortFn]="header.compare"
            [nzSortPriority]="header.priority"
          >
            {{ header.title }}
          </th>
        </ng-template>
        <ng-template #rows let-row>
          <td class="select-none" *ngFor="let node of row | keyvalue">
            {{ node.value }}
          </td>
          <td>
            <button
              (click)="selectLine(row)"
              class="h-full w-full bg-green-700 font-medium text-white "
            >
              Select
            </button>
          </td>
        </ng-template>
      </table-view>
      <div class="grid h-16 grid-cols-5 text-2xl md:mt-10 md:h-32 md:text-4xl">
        <normal-button
          class="col-start-3"
          (buttonClick)="onBack()"
        ></normal-button>
      </div>
    </div>
  `,
})
export class LineSelecterComponent implements OnInit {
  public listOfColumn = [
    {
      title: 'DueDate',
      compare: (a: string, b: string) => a.localeCompare(b),
      priority: false,
    },
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
    {
      title: ' ',
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
    this._router.navigateByUrl('/receiptreceiving/purchasenumber');
  }

  public selectLine(data): void {
    if (!data.LineNumber) {
      return;
    }
    this.createreceipt.updatePurchaseInfo({ LineNumber: data.LineNumber });
    this.createreceipt.updateLeftQuantity(
      data.QuantityOnOrder - data.QuantityReceived
    );
    this._router.navigate(['../receiptquantity'], {
      relativeTo: this._actRoute,
    });
  }
}
