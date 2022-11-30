import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';
import { updateReceiptInfoService } from '../../data/updateReceipt';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MessageBarComponent,
    NormalButtonComponent,
    RedButtonComponent,
    GreenButtonComponent,
  ],
  template: `
    <div class="flew justify-center gap-2 md:gap-6 lg:gap-12">
      <h1 class="text-4xl">RHOS:</h1>
      <div
        class="grid h-64 grid-cols-2 justify-center gap-4 text-4xl md:gap-10 lg:gap-16"
      >
        <green-button
          buttonText="Yes"
          (buttonClick)="onUpdate(true)"
        ></green-button>
        <red-button
          buttonText="No"
          (buttonClick)="onUpdate(false)"
        ></red-button>
        <normal-button (buttonClick)="onBack()">Back</normal-button>
      </div>

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
      // this._router.navigateByUrl('/receiptreceiving');
    }
    this._steps.changeSteps(2);
  }

  public onUpdate(RHOS: boolean): void {
    console.log(RHOS);

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
