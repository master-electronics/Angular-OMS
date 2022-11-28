import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, Observable, of, map } from 'rxjs';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { NzImageBasicComponent } from 'src/app/shared/ui/nz-image-basic.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';
import { ReceiptPartInfoComponent } from '../../ui/receipt-part-info.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzImageBasicComponent,
    SubmitButtonComponent,
    NormalButtonComponent,
    RedButtonComponent,
    ReceiptPartInfoComponent,
  ],
  template: `
    <div *ngIf="data$ | async as info" class="grid grid-cols-2">
      <div class="w-1/2">
        <nz-image-basic [imgURL]="info.MIC"></nz-image-basic>
      </div>
      <receipt-part-info [info]="info"></receipt-part-info>
    </div>
    <div
      class="grid h-16 w-full grid-cols-4 gap-6 md:mt-16 md:h-32 md:text-4xl"
    >
      <red-button (formClick)="onKickout()" buttonText="Kickout"></red-button>
      <div></div>
      <submit-button (formClick)="onSubmit()" buttonText="Verify">
      </submit-button>
      <normal-button (formClick)="onBack()"></normal-button>
    </div>
  `,
})
export class VerifyComponent implements OnInit {
  public data$: Observable<any>;

  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _receipt: ReceiptInfoService,
    private _step: ReceivingService
  ) {}

  ngOnInit(): void {
    if (!this._receipt.lineAfterPart) {
      this._router.navigateByUrl('/receiptreceiving');
    }
    this._step.changeSteps(1);
    this.data$ = this._actRoute.data.pipe(
      map((res) => {
        console.log(res);
        return res.info;
      }),
      catchError((error) =>
        of({ isLoading: false, message: error.message, messageType: 'error' })
      )
    );
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/part/quantity');
  }

  onKickout(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }

  onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part');
  }
}
