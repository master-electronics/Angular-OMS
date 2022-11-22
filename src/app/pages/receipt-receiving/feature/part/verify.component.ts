import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, Observable, of, map } from 'rxjs';
import { NormalButtonComponent } from 'src/app/shared/ui/button/back-button.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { NzImageBasicComponent } from 'src/app/shared/ui/nz-image-basic.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzImageBasicComponent,
    SubmitButtonComponent,
    NormalButtonComponent,
    RedButtonComponent,
  ],
  template: `
    <div *ngIf="data$ | async as info" class="grid grid-cols-2">
      <nz-image-basic [imgURL]="info.MIC"></nz-image-basic>

      <!-- <nz-descriptions nzTitle="Part Info" nzBordered [nzColumn]="2">
        <nz-descriptions-item nzTitle="Product Code">
          {{ info.ProductCode }}</nz-descriptions-item
        >
        <nz-descriptions-item nzTitle="Part Number">{{
          info.PartNumber
        }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="Global Message" [nzSpan]="2">
          <div *ngFor="let line of info.message">
            <p>{{ line }}</p>
          </div>
        </nz-descriptions-item>
        <nz-descriptions-item nzTitle="Kit Info" [nzSpan]="2">{{
          info.kitInfo
        }}</nz-descriptions-item>
      </nz-descriptions> -->
    </div>
    <div class="grid h-16 w-full grid-cols-4 gap-6 md:mt-16 md:h-32">
      <red-button (formClick)="onKickout()" buttonText="Kickout"></red-button>
      <div></div>
      <submit-button (formClick)="onSubmit()"> </submit-button>
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
