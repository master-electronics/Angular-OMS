import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import {
  catchError,
  map,
  mergeMap,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
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
  templateUrl: './verify.component.html',
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
    this._router.navigateByUrl('receiptreceiving/parchaseorder');
  }

  kickout(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }

  back(): void {
    this._router.navigateByUrl('receiptreceiving/part');
  }
}
