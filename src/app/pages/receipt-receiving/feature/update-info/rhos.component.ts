import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';
import { updateReceiptInfoService } from '../../data/updateReceipt';

@Component({
  standalone: true,
  imports: [CommonModule, NzButtonModule, MessageBarComponent],
  template: `
    <div class="grid-col-1 grid justify-center gap-12">
      <h1 class="text-xl">RHOS:</h1>
      <div class="flex flex-row justify-center gap-5">
        <div class="w-32 rounded-md bg-green-300">
          <button
            class="w-32"
            nz-button
            nzGhost
            nzSize="large"
            type="button"
            (click)="onUpdate(true)"
          >
            YES
          </button>
        </div>
        <div class="w-32 rounded-md bg-red-300">
          <button
            class="w-32 "
            nz-button
            nzGhost
            nzSize="large"
            type="button"
            (click)="onUpdate(false)"
          >
            NO
          </button>
        </div>
      </div>

      <button
        class="w-32"
        nz-button
        nzSize="large"
        type="button"
        (click)="onBack()"
      >
        Back
      </button>
      <div *ngIf="update$ | async as data">
        <message-bar *ngIf="data.message"></message-bar>
      </div>
    </div>
  `,
})
export class RHOSComponent implements OnInit {
  public update$: Observable<any>;

  constructor(
    private _router: Router,
    private _update: updateReceiptInfoService,
    private _receipt: ReceiptInfoService,
    private _steps: ReceivingService
  ) {}

  ngOnInit(): void {
    if (!this._update.receiptInfo?.DateCode) {
      this._router.navigateByUrl('/receiptreceiving');
    }
    this._steps.changeSteps(2);
  }

  public onUpdate(RHOS: boolean): void {
    this._update.updateRHOS(RHOS);
    this.update$ = this._update.updateReceiptLSQL().pipe(
      tap((res) => {
        if (!res.data.updateReceiptLsByID) {
          throw new Error('Fail to updat to SQL!');
        }
      }),
      map(() => {
        switch (this._receipt.receiptLsAfterQuantity?.length) {
          case 1:
            this._receipt.pickOneReceiptLine();
            this._router.navigateByUrl('receiptreceiving/label/assign');
            break;
          default:
            this._router.navigateByUrl('receiptreceiving/label/selectline');
        }
      }),
      catchError((error) => {
        return of({ message: error.message, messageType: 'error' });
      })
    );
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/datecode');
  }
}
