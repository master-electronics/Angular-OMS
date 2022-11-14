import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import {
  FetchProductInfoForReceivingGQL,
  FindPartForReceivingGQL,
  FindReceiptHeaderForReceivingGQL,
} from 'src/app/graphql/receiptReceiving.graphql-gen';

@Injectable()
export class PartStore {
  constructor(
    private _findReceiptH$: FindReceiptHeaderForReceivingGQL,
    private _findPart$: FindPartForReceivingGQL,
    private _findverifyInfo$: FetchProductInfoForReceivingGQL
  ) {}
  // For Receipt Header page
  private _receiptHeader = new BehaviorSubject<any>({ isLoading: false });
  public get receiptHeader$(): Observable<any> {
    return this._receiptHeader.asObservable();
  }
  public get receiptHeader() {
    return this._receiptHeader.value;
  }
  public findReceiptHeader(ReceiptHID: number) {
    return this._receiptHeader.pipe(
      take(1),
      switchMap(() => {
        return this._findReceiptH$.fetch(
          {
            ReceiptHID,
          },
          { fetchPolicy: 'network-only' }
        );
      }),
      tap((res) => {
        if (!res.data.findReceiptH) {
          throw new Error("Can't find this Receipt!");
        }
        if (!res.data.findReceiptH.RECEIPTLs.length) {
          throw new Error('No receipt lines under this Receipt!');
        }
        this._receiptHeader.next(res.data.findReceiptH);
      }),
      shareReplay(1)
    );
  }

  // For part number page
  private _part = new BehaviorSubject<any>({ isLoading: false });
  public get part$(): Observable<any> {
    return this._part.asObservable();
  }
  public get part() {
    return this._part.getValue();
  }

  public filterPartnumber(PartNumber: string): void {
    const tmp = this.receiptHeader.RECEIPTLs.filter(
      (res) =>
        res.Product.PartNumber.trim().toLowerCase() ===
        PartNumber.trim().toLowerCase()
    );
    this._part.next(tmp);
  }

  //For part verify page
  private _verifyInfo = new BehaviorSubject<any>({ isLoading: true });
  public get _verifyInfo$() {
    return this._verifyInfo.asObservable();
  }
  public findVerifyInfo() {
    return this._part.pipe(
      take(1),
      switchMap((line) => {
        return this._findverifyInfo$
          .fetch({
            PartNumber: line[0].Product.PartNumber,
            ProductCode: line[0].Product.ProductCode.ProductCodeNumber,
          })
          .pipe(
            map((info) => {
              return {
                ProductID: line[0].Product.ProductID,
                ProductCode: line[0].Product.ProductCode.ProductCodeNumber,
                PartNumber: line[0].Product.PartNumber,
                MICNumber: info.data.fetchProductMICFromMerp,
                message: info.data.fetchPartMessage.comments,
                kitInfo: '',
              };
            })
          );
      }),
      tap((res) => {
        this._verifyInfo.next(res);
      }),
      shareReplay()
    );
  }
}
