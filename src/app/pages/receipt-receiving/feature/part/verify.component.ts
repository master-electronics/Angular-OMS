import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { catchError, Observable, of, mergeMap, startWith, take } from 'rxjs';
import { FetchProductInfoForReceivingGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { NzImageBasicComponent } from 'src/app/shared/ui/nz-image-basic.component';
import { environment } from 'src/environments/environment';
import { ReceivingService } from '../../data/receiving.server';

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
          <nz-image-basic
            [imgURL]="imgURL + info.value.MICNumber"
          ></nz-image-basic>
        </div>
        <nz-descriptions nzTitle="Part Info" nzBordered [nzColumn]="2">
          <nz-descriptions-item nzTitle="Product Code">
            {{ info.value.ProductCode }}</nz-descriptions-item
          >
          <nz-descriptions-item nzTitle="Part Number">{{
            info.value.PartNumber
          }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="Golbal Message" [nzSpan]="2">
            <div *ngFor="let line of info.value.message">
              <p>{{ line }}</p>
            </div>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="Kit Info" [nzSpan]="2">{{
            info.value.kitInfo
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
          <button nz-button class="w-32" (click)="back()">Back</button>
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
export class VerifyComponent {
  public data$: Observable<any>;
  public current;
  public imgURL = environment.productImgSource;

  constructor(
    private _router: Router,
    private _service: ReceivingService,
    private readonly _findInfo: FetchProductInfoForReceivingGQL
  ) {
    _service.changeTab(2);
    if (!this._service.getValueReceiptH().value) {
      this._router.navigate(['receiptreceiving']);
    }
    this.data$ = this._service.getReceiptHInfo().pipe(
      take(1),
      mergeMap(
        (res) =>
          this._findInfo.fetch({
            ProductCode: res.value[0].Product.ProductCode.ProductCodeNumber,
            PartNumber: res.value[0].Product.PartNumber,
          }),
        (fromsource, fromfetch) => ({
          isLoading: false,
          value: {
            ProductID: fromsource.value[0].ProductID,
            ProductCode:
              fromsource.value[0].Product.ProductCode.ProductCodeNumber,
            PartNumber: fromsource.value[0].Product.PartNumber,
            MICNumber: fromfetch.data.fetchProductMICFromMerp,
            message: fromfetch.data.fetchPartMessage.comments,
            kitInfo: '',
          },
        })
      ),
      catchError((error) =>
        of({ isLoading: false, error, messageType: 'error' })
      ),
      startWith({ isLoading: true })
    );
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/purchaseorder');
  }

  kickout(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }

  back(): void {
    this._router.navigateByUrl('receiptreceiving/part');
  }
}
