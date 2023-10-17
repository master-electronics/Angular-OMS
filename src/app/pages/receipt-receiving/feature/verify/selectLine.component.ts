import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { TableViewComponent } from 'src/app/shared/ui/table-view.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';

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
      <table-view [data]="tableData">
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
export class SelectLineComponent implements OnInit {
  constructor(
    private _router: Router,
    private _steps: TabService,
    public receipt: ReceiptInfoService
  ) {}
  public tableData;

  ngOnInit(): void {
    this._steps.changeSteps(0);
    this.tableData = this.receipt.LineInfoForOverReceiving();
    if (this.tableData.length === 1) {
      this.receipt.filterByOverReceiving();
      this._router.navigateByUrl('/receiptreceiving/overreceiving');
    }
  }

  public onBack(): void {
    this._router.navigateByUrl('/receiptreceiving/receipt');
  }

  public selectLine(data): void {
    if (!data.id) {
      return;
    }
    // select line;
    this.receipt.filterByOverReceiving(data.id);
    this._router.navigateByUrl('/receiptreceiving/overreceiving');
  }
}
