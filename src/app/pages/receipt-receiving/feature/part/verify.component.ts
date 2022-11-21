import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { catchError, Observable, of, map } from 'rxjs';
import { NzImageBasicComponent } from 'src/app/shared/ui/nz-image-basic.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzSkeletonModule,
    NzDescriptionsModule,
    NzButtonModule,
    NzImageBasicComponent,
  ],
  template: `
    <div *ngIf="data$ | async as info">
      <div class="w-1/4">
        <nz-image-basic [imgURL]="info.MIC"></nz-image-basic>
      </div>
      <nz-descriptions nzTitle="Part Info" nzBordered [nzColumn]="2">
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
      </nz-descriptions>

      <div class="mt-5 flex gap-5">
        <div class="w-32 rounded-md bg-red-500">
          <button
            nz-button
            type="button"
            (click)="kickout()"
            class="w-32"
            nzGhost
          >
            KickOut
          </button>
        </div>
        <div class="grow"></div>
        <button
          nz-button
          class="w-32"
          nzType="primary"
          (click)="onSubmit()"
          type="submit"
        >
          Verify
        </button>
        <button nz-button class="w-32" (click)="onBack()">Back</button>
      </div>
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
      this.onBack();
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

  kickout(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }

  onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part');
  }
}
