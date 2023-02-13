import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import {
  CheckReceiptHeaderGQL,
  FetchProductInfoForReceivingGQL,
  FindReceiptHeaderForReceivingGQL,
  SuspectInventoryGQL,
} from 'src/app/graphql/receiptReceiving.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { PrinterService } from 'src/app/shared/data/printer';
import { Logger } from 'src/app/shared/services/logger.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { LogService } from './eventLog';

@Injectable()
export class ReceiptInfoService {
  constructor(
    private _findReceiptH$: FindReceiptHeaderForReceivingGQL,
    private _findverifyInfo$: FetchProductInfoForReceivingGQL,
    private _checkHeader: CheckReceiptHeaderGQL,
    private _suspect: SuspectInventoryGQL,
    private _log: LogService,
    private _insertLog: Insert_UserEventLogsGQL,
    private _printer: PrinterService
  ) {}

  /**
   * Store header id after verify
   */
  private _headerID = new BehaviorSubject<number>(null);
  public get headerID(): number {
    return this._headerID.value;
  }
  /**
   * Find Receipt info by ID, and all lines under this header with status "Entered".
   */
  private _receiptLines = new BehaviorSubject<any>(null);
  public get receiptLines() {
    return this._receiptLines.value;
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
  /**
   * Second Filter for Receipt lines by quantity
   */
  private _receiptLsAfterQuantity = new BehaviorSubject<any>(null);
  public get receiptLsAfterQuantity$(): Observable<any> {
    return this._receiptLsAfterQuantity.asObservable();
  }
  public get receiptLsAfterQuantity(): any {
    return this._receiptLsAfterQuantity.value;
  }
  /**
   * After two filter, still have multi lines, let user select one line.
   */
  private _selectedReceiptLine = new BehaviorSubject<any>(null);
  public get selectedReceiptLine() {
    return this._selectedReceiptLine.value;
  }

  /**
   * resetAfterDone
   */
  public resetAfterDone() {
    this._receiptLines.next(null);
    this._lineAfterPart.next(null);
    this._receiptLsAfterQuantity.next(null);
    this._selectedReceiptLine.next(null);
  }

  public checkReceiptHeader(id: number): Observable<any> {
    return this._checkHeader.fetch({ id }).pipe(
      tap((res) => {
        if (!res.data.findReceiptH?._id) {
          throw new Error("Can't find this Receipt!");
        }
      }),
      switchMap(() => {
        this._headerID.next(id);
        this._log.initReceivingLog({
          ReceiptHeader: id,
          UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
          UserEventID: sqlData.Event_Receiving_Start,
        });
        return this._insertLog.mutate({ log: this._log.receivingLog });
      })
    );
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
          Logger.devOnly('ReceiptInfo', 'findLines', res[0].Product.PartNumber);
          Logger.devOnly('ReceiptInfo', 'findLines', res[0].ExpectedQuantity);
          this._receiptLines.next(res);
          return true;
        })
      );
  }

  public filterbyPartNumber(PartNumber: string): void {
    const tmp = this.receiptLines.filter(
      (res) =>
        res.Product.PartNumber.trim().toLowerCase() ===
        PartNumber.trim().toLowerCase()
    );
    this._lineAfterPart.next(tmp);
    this._log.updateReceivingLog({
      PartNumber: tmp[0].Product.PartNumber,
      ProductCode: tmp[0].Product.ProductCode.ProductCodeNumber,
    });
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
      })
    );
  }

  public printKickOutLabel$(
    list: string[],
    itn: string,
    reason: string,
    reasonID: number
  ) {
    const log = this._lineAfterPart.value.map((line) => {
      return {
        ...this._log.receivingLog,
        InventoryTrackingNumber: itn,
        UserEventID: sqlData.Event_Receiving_KickOut,
        ReceiptLine: line.LineNumber,
        Quantity: line.ExpectedQuantity,
        Message: reason,
      };
    });
    return this._suspect
      .mutate({
        DC: environment.DistributionCenter,
        ITN: itn,
        reasonIDList: [reasonID],
      })
      .pipe(
        switchMap(() => {
          return combineLatest({
            log: this._insertLog.mutate({ log }),
            print: this._printer.printText$(list),
          });
        })
      );
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
   * pickOneReceiptLine
   */
  public pickOneReceiptLine(id?: number) {
    let line;
    if (!id) {
      this._selectedReceiptLine.next(this.receiptLsAfterQuantity);
      line = this.receiptLsAfterQuantity[0];
    } else {
      const selected = this.receiptLsAfterQuantity.filter(
        (res) => res._id === id
      );
      this._selectedReceiptLine.next(selected);
      line = selected[0];
    }
    this._log.updateReceivingLog({
      ReceiptLine: line.LineNumber,
      Quantity: line.ExpectedQuantity,
    });
  }
}
