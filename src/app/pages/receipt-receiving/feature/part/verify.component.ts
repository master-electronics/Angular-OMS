import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { catchError, Observable, of, startWith, map } from 'rxjs';
import { NzImageBasicComponent } from 'src/app/shared/ui/nz-image-basic.component';
import { environment } from 'src/environments/environment';
import { ReceiptStore } from '../../data/Receipt';
import { ReceivingStore } from '../../data/receivingStore';

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
      <div *ngIf="!info.isLoading; else loading">
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
          <nz-descriptions-item nzTitle="Golbal Message" [nzSpan]="2">
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
            [disabled]="info.isLoading"
            type="submit"
          >
            Verify
          </button>
          <button nz-button class="w-32" (click)="onBack()">Back</button>
        </div>
      </div>
    </div>
    <ng-template #loading>
      <nz-skeleton-element
        nzType="image"
        [nzActive]="true"
      ></nz-skeleton-element>
      <nz-skeleton [nzActive]="true"></nz-skeleton>
    </ng-template>
  `,
})
export class VerifyComponent implements OnInit {
  public data$: Observable<any>;
  public imgURL = environment.productImgSource;

  constructor(
    private _router: Router,
    private _ui: ReceivingStore,
    private _receipt: ReceiptStore,
    private _step: ReceivingStore
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(2);
    if (!this._receipt.receiptLs) {
      this.onBack();
    }
    this._step.changeSteps(1);
    this.data$ = this._receipt.findVerifyInfo().pipe(
      map((res) => {
        return {
          ...res,
          MIC: `${this.imgURL}${res.MIC}.jpg`,
        };
      }),
      catchError((error) =>
        of({ isLoading: false, message: error.message, messageType: 'error' })
      ),
      startWith({ isLoading: true })
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
