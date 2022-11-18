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
  CheckReceiptHeaderGQL,
  FetchProductInfoForReceivingGQL,
  FindReceiptHeaderForReceivingGQL,
} from 'src/app/graphql/receiptReceiving.graphql-gen';

@Injectable()
export class ReceiptStore {
  constructor(
    private _findReceiptH$: FindReceiptHeaderForReceivingGQL,
    private _findverifyInfo$: FetchProductInfoForReceivingGQL,
    private _checkHeader: CheckReceiptHeaderGQL
  ) {}

  /**
   * checkReceiptHeader
   */
  private _headerID = new BehaviorSubject<number>(null);
  public get headerID(): number {
    return this._headerID.value;
  }
  public checkReceiptHeader(id: number): Observable<boolean> {
    return this._checkHeader.fetch({ id }).pipe(
      tap((res) => {
        if (!res.data.findReceiptH?._id) {
          throw new Error("Can't find this Receipt!");
        }
      }),
      map((res) => {
        this._headerID.next(id);
        return true;
      })
    );
  }

  /**
   * Find Receipt Header info by ID, and all lines under this header
   */
  private _receiptHeader = new BehaviorSubject<any>(null);
  public get receiptHeader$(): Observable<any> {
    return this._receiptHeader.asObservable();
  }
  public get receiptHeader() {
    return this._receiptHeader.value;
  }
  public findReceiptHeader$() {
    return this._findReceiptH$
      .fetch(
        {
          ReceiptHID: this.headerID,
          statusID: 10,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findReceiptInfoByIdAndStatus) {
            throw new Error("Can't find this Receipt!");
          }
          if (!res.data.findReceiptInfoByIdAndStatus.RECEIPTLs.length) {
            throw new Error('No receipt lines under this Receipt!');
          }
          this._receiptHeader.next(res.data.findReceiptInfoByIdAndStatus);
        }),
        shareReplay(1)
      );
  }

  /**
   * First Filter for Receipt by part number
   */
  private _receiptLs = new BehaviorSubject<any>(null);
  public get receiptLs$(): Observable<any> {
    return this._receiptLs.asObservable();
  }
  public get receiptLs() {
    return this._receiptLs.getValue();
  }

  public filterbyPartNumber(PartNumber: string): void {
    const tmp = this.receiptHeader.RECEIPTLs.filter(
      (res) =>
        res.Product.PartNumber.trim().toLowerCase() ===
        PartNumber.trim().toLowerCase()
    );
    this._receiptLs.next(tmp);
  }

  /**
   * fetch Part Info
   */
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

  /**
   * Second Filter for Receipt lines by quantity
   */
  private _receiptLsAfterQuantity = new BehaviorSubject<any>(null);
  /**
   * get receiptLsAfterQuantity$
 : Observable<any>  */
  public get receiptLsAfterQuantity$(): Observable<any> {
    return this._receiptLsAfterQuantity.asObservable();
  }
  /**
   * get receiptLsAfterQuantity
   */
  public get receiptLsAfterQuantity(): any {
    return this._receiptLsAfterQuantity.value;
  }
  /**
   * filterByQuantity
   */
  public filterByQuantity(Quantity: number): void {
    const tmp = this.receiptLs.filter(
      (res) => res.ExpectedQuantity === Quantity
    );
    this._receiptLsAfterQuantity.next(tmp);
  }

  /**
   * After two filter, still have multi lines, let user select one line.
   */
  private _selectedReceiptLine = new BehaviorSubject<any>(null);
  /**
   * get selectedReceiptLine
   */
  public get selectedReceiptLine() {
    return this._selectedReceiptLine.value;
  }

  /**
   * pickOneReceiptLine
   */
  public pickOneReceiptLine(id?: number) {
    if (!id) {
      this._selectedReceiptLine.next(this.receiptLsAfterQuantity);
    } else {
      const selected = this.receiptLsAfterQuantity.filter(
        (res) => res._id === id
      );
      this._selectedReceiptLine.next(selected);
    }
  }

  /**
   * InitValue
   */
  public InitValue() {
    // this._receiptHeader.next(null);
    this._receiptLs.next(null);
    this._receiptLsAfterQuantity.next(null);
    this._verifyInfo.next(null);
    this._selectedReceiptLine.next(null);
  }
}
