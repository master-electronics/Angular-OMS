import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import {
  FetchProductInfoForReceivingGQL,
  FindReceiptHeaderForReceivingGQL,
} from 'src/app/graphql/receiptReceiving.graphql-gen';

@Injectable()
export class PartStore {
  constructor(
    private _findReceiptH$: FindReceiptHeaderForReceivingGQL,
    private _findverifyInfo$: FetchProductInfoForReceivingGQL
  ) {}
  // For Receipt Header page
  private _receiptHeader = new BehaviorSubject<any>(null);
  public get receiptHeader$(): Observable<any> {
    return this._receiptHeader.asObservable();
  }
  public get receiptHeader() {
    return this._receiptHeader.value;
  }
  public findReceiptHeader(ReceiptHID: number) {
    return this._findReceiptH$
      .fetch(
        {
          ReceiptHID,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
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
  private _receiptLs = new BehaviorSubject<any>(null);
  public get receiptLs$(): Observable<any> {
    return this._receiptLs.asObservable();
  }
  public get receiptLs() {
    return this._receiptLs.getValue();
  }

  public filterReceiptLines(PartNumber: string): void {
    const tmp = this.receiptHeader.RECEIPTLs.filter(
      (res) =>
        res.Product.PartNumber.trim().toLowerCase() ===
        PartNumber.trim().toLowerCase()
    );
    this._receiptLs.next(tmp);
  }

  //For part verify page
  private _verifyInfo = new BehaviorSubject<any>(null);
  public get _verifyInfo$() {
    return this._verifyInfo.asObservable();
  }
  public findVerifyInfo() {
    return this._receiptLs.pipe(
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
                MIC: info.data.fetchProductMICFromMerp,
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
