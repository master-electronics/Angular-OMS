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
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';

@Injectable()
export class ReceiptInfoService {
  constructor(
    private _findReceiptH$: FindReceiptHeaderForReceivingGQL,
    private _findverifyInfo$: FetchProductInfoForReceivingGQL,
    private _checkHeader: CheckReceiptHeaderGQL
  ) {}

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
      map(() => {
        this._headerID.next(id);
        return true;
      }),
      shareReplay(1)
    );
  }

  /**
   * Find Receipt info by ID, and all lines under this header with status "Entered".
   */
  private _receiptLines = new BehaviorSubject<any>(null);
  public get receiptLines() {
    return this._receiptLines.value;
  }
  public findLines$(): Observable<boolean> {
    return this._findReceiptH$
      .fetch(
        {
          ReceiptHID: this.headerID,
          statusID: sqlData.Receipt_Entered,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findReceiptInfoByIdAndStatus) {
            throw { name: 'error', message: "Can't find this Receipt!" };
          }
          if (!res.data.findReceiptInfoByIdAndStatus.RECEIPTLs?.length) {
            throw {
              name: 'warning',
              message: 'No avaiable line under this Receipt!',
            };
          }
        }),
        map((res) => res.data.findReceiptInfoByIdAndStatus.RECEIPTLs),
        map((res) => {
          console.log(res[0].Product.PartNumber);
          this._receiptLines.next(res);
          return true;
        }),
        shareReplay(1)
      );
  }

  /**
   * First Filter for Receipt by part number
   */
  private _lineAfterPart = new BehaviorSubject<any>(null);
  public get lineAfterPart$(): Observable<any> {
    return this._lineAfterPart.asObservable();
  }
  public get lineAfterPart() {
    return this._lineAfterPart.getValue();
  }

  public filterbyPartNumber(PartNumber: string): void {
    const tmp = this.receiptLines.filter(
      (res) =>
        res.Product.PartNumber.trim().toLowerCase() ===
        PartNumber.trim().toLowerCase()
    );
    this._lineAfterPart.next(tmp);
  }

  /**
   * fetch Part Info
   */
  public findVerifyInfo() {
    return this._lineAfterPart.pipe(
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
                MIC: `${environment.productImgSource}${info.data.fetchProductMICFromMerp}.jpg`,
                message: info.data.fetchPartMessage.comments,
                kitInfo: '',
              };
            })
          );
      }),
      shareReplay(1)
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
    const tmp = this.lineAfterPart.filter(
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
}
