import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import {
  CheckReceiptHeaderGQL,
  FetchProductInfoForReceivingGQL,
  FetchReceiptForOverReceivingGQL,
  FindReceiptHeaderForReceivingGQL,
  OverReceivingUpdateReceiptLGQL,
} from 'src/app/graphql/receiptReceiving.graphql-gen';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { Logger } from 'src/app/shared/services/logger.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

export interface ReceiptInfo {
  PurchaseLineNumber: number;
  PurchaseOrderNumber: string;
  QuantityOnOrder: number;
  QuantityReceived: number;
  UnitOfMeasure: string;
  ReceiptLineID: number;
  ReceiptHID: number;
  Status: string;
  ReceiptLineNumber: number;
  ExpectedQuantity: number;
  DateCode: string;
  ROHS: boolean;
  ProductID: number;
  PartNumber: string;
  ProductCodeNumber: string;
}

@Injectable()
export class ReceiptInfoService {
  constructor(
    private _findReceiptH$: FindReceiptHeaderForReceivingGQL,
    private _findverifyInfo$: FetchProductInfoForReceivingGQL,
    private _fetchLinesForOverReceipt$: FetchReceiptForOverReceivingGQL,
    private _checkHeader: CheckReceiptHeaderGQL,
    private _updateReceiptLine: OverReceivingUpdateReceiptLGQL,
    private _eventLog: EventLogService,
    private _insertLog: Create_EventLogsGQL,
    private _userInfo: StorageUserInfoService
  ) {}

  /**
   * State
   */
  private _receiptState = signal({
    headerID: null,
    PartNumber: null,
    Quantity: null,
    ReceiptLine: null,
    receiptList: <ReceiptInfo[]>[],
  });

  /**
   * Selector
   */
  headerID = computed(() => this._receiptState().headerID);
  receiptLine = computed(() => this._receiptState().ReceiptLine);
  quantity = computed(() => this._receiptState().Quantity);

  receiptInfoAfterFilter = computed(() => {
    if (!this._receiptState().receiptList.length) {
      return null;
    }
    let tmp: ReceiptInfo[] = [...this._receiptState().receiptList];
    if (this._receiptState().ReceiptLine) {
      return tmp.filter(
        (line) => line.ReceiptLineID === this._receiptState().ReceiptLine
      );
    }
    if (this._receiptState().PartNumber) {
      tmp = tmp.filter(
        (line) =>
          line.PartNumber.trim().toLocaleLowerCase() ===
          this._receiptState().PartNumber.trim().toLocaleLowerCase()
      );
    }
    if (this._receiptState().Quantity) {
      tmp = tmp.filter(
        (line) => line.ExpectedQuantity === this._receiptState().Quantity
      );
    }
    return tmp;
  });
  ExpectQuantity = computed(
    () => this.receiptInfoAfterFilter()[0].ExpectedQuantity
  );
  partNumber = computed(() => this.receiptInfoAfterFilter()[0].PartNumber);
  productCode = computed(
    () => this.receiptInfoAfterFilter()[0].ProductCodeNumber
  );
  purchaseLineNumber = computed(
    () => this.receiptInfoAfterFilter()[0].PurchaseLineNumber
  );
  purchaseOrderNumber = computed(
    () => this.receiptInfoAfterFilter()[0].PurchaseOrderNumber
  );
  openQuantityForPOs = computed(
    () =>
      this.receiptInfoAfterFilter()[0].QuantityOnOrder -
      this.receiptInfoAfterFilter()[0].QuantityReceived
  );

  OverReceivingTableinfo = computed(() => {
    return this._receiptState().receiptList.map((line) => ({
      ID: line.ReceiptLineID,
      ReceiptHeader: line.ReceiptHID,
      Quantity: line.ExpectedQuantity,
      PartNumber: line.PartNumber,
      PurchaseOrderNumber: line.PurchaseOrderNumber,
      QuantityOnOrder: line.QuantityOnOrder,
      Status: line.Status,
    }));
  });

  /**
   * Reducer
   */
  resetAfterDone() {
    this._receiptState.set({
      headerID: null,
      PartNumber: null,
      Quantity: null,
      ReceiptLine: null,
      receiptList: <ReceiptInfo[]>[],
    });
  }

  updateheaderID(id: number) {
    this._receiptState.update((info) => ({ ...info, headerID: id }));
  }
  updatePartNumber(part: string) {
    this._receiptState.update((info) => ({ ...info, PartNumber: part }));
  }
  updateQuantity(quantity: number) {
    this._receiptState.update((info) => ({ ...info, Quantity: quantity }));
  }
  updateReceiptLine(line: number) {
    this._receiptState.update((info) => ({ ...info, ReceiptLine: line }));
    this._receiptState().receiptList.map((node) => {
      if (node.ReceiptLineID === line) {
        this._receiptState.update((info) => ({
          ...info,
          headerID: node.ReceiptHID,
          Quantity: node.ExpectedQuantity,
          PartNumber: node.PartNumber,
        }));
      }
    });
  }
  updateReceiptList(list: ReceiptInfo[]) {
    this._receiptState.update((info) => ({ ...info, receiptList: list }));
  }
  updateExpectQuantity(quantity: number) {
    const list = this._receiptState().receiptList.map((line) => {
      if (line.ReceiptLineID === this._receiptState().ReceiptLine) {
        return { ...line, ExpectedQuantity: quantity };
      }
      return line;
    });
    this._receiptState.update((info) => ({
      ...info,
      receiptList: list,
    }));
  }

  //checkReceiptHeader: Search receiptHeader by id, check if this header id is vaild.
  public checkReceiptHeader$(id: number) {
    return this._checkHeader.fetch({ id }).pipe(
      tap((res) => {
        if (!res.data.findReceiptH?._id) {
          throw new Error("Can't find this Receipt!");
        }
        this.updateheaderID(id);
      }),
      switchMap(() => {
        const oldLogs = [
          {
            ReceiptHeader: id,
            UserName: this._userInfo.userName,
            UserEventID: sqlData.Event_Receiving_Start,
          },
        ];
        this._eventLog.initEventLog({
          UserName: this._userInfo.userName,
          EventTypeID: sqlData.Event_Receiving_Start,
          Log: JSON.stringify({
            ReceiptHeader: id,
          }),
        });
        return this._insertLog.mutate({
          oldLogs,
          eventLogs: this._eventLog.eventLog,
        });
      })
    );
  }

  // find all Receipt Line by Receipt heaser ID with status 10, then update State by result list.
  public findLines$() {
    return this._findReceiptH$
      .fetch(
        {
          ReceiptHID: this.headerID(),
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
        map((res) => res.data.findReceiptInfoByIdAndStatus),
        tap((res) => {
          Logger.devOnly(
            'ReceiptInfo',
            'findLines',
            res.RECEIPTLs[0].Product.PartNumber
          );
          Logger.devOnly(
            'ReceiptInfo',
            'findLines',
            res.RECEIPTLs[0].ExpectedQuantity
          );
          const list: ReceiptInfo[] = res.RECEIPTLs.map((line) => ({
            ReceiptHID: res._id,
            PurchaseLineNumber: line.RECEIPTLDs[0].PurchaseOrderL.LineNumber,
            PurchaseOrderNumber:
              line.RECEIPTLDs[0].PurchaseOrderL.PurchaseOrderH
                .PurchaseOrderNumber,
            QuantityOnOrder: line.RECEIPTLDs[0].PurchaseOrderL.QuantityOnOrder,
            QuantityReceived:
              line.RECEIPTLDs[0].PurchaseOrderL.QuantityReceived,
            UnitOfMeasure: line.RECEIPTLDs[0].PurchaseOrderL.UnitOfMeasure,
            ReceiptLineID: line.RECEIPTLDs[0]._id,
            Status: line.RECEIPTLDs[0].ReceiptStatus.Name,
            ReceiptLineNumber: line.LineNumber,
            ExpectedQuantity: line.ExpectedQuantity,
            DateCode: line.DateCode,
            ROHS: line.ROHS,
            ProductID: line.ProductID,
            PartNumber: line.Product.PartNumber,
            ProductCodeNumber: line.Product.ProductCode.ProductCodeNumber,
          }));
          this.updateReceiptList(list);
        })
      );
  }

  // Fetch Receipt line info by purchase Order Number for over receipt. For this case, fetch all Status, let user able to redo some receipt line.
  public fetchReceiptLinesForOverReceipt$(PurchaseOrder: string) {
    return this._fetchLinesForOverReceipt$
      .fetch({ PurchaseOrder }, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => res.data.findPurchaseOrderH.PURCHASEORDERLs),
        tap((res) => {
          if (!res.some((pl) => pl.RECEIPTLDs.length > 0)) {
            throw { name: 'error', message: "Can't find this Receipt!" };
          }
        }),
        tap((res) => {
          const list: ReceiptInfo[] = [];
          res.forEach((pl) => {
            pl.RECEIPTLDs.forEach((rd) => {
              const node: ReceiptInfo = {
                PurchaseLineNumber: pl.LineNumber,
                PurchaseOrderNumber: PurchaseOrder.trim(),
                QuantityOnOrder: pl.QuantityOnOrder,
                QuantityReceived: pl.QuantityReceived,
                UnitOfMeasure: pl.UnitOfMeasure,
                ReceiptHID: rd.ReceiptL.ReceiptHID,
                ReceiptLineID: rd.ReceiptL._id,
                Status: rd.ReceiptStatus.Name,
                ReceiptLineNumber: rd.ReceiptL.LineNumber,
                ExpectedQuantity: rd.ReceiptL.ExpectedQuantity,
                DateCode: rd.ReceiptL.DateCode,
                ROHS: rd.ReceiptL.ROHS,
                ProductID: rd.ReceiptL.ProductID,
                PartNumber: rd.ReceiptL.Product.PartNumber,
                ProductCodeNumber:
                  rd.ReceiptL.Product.ProductCode.ProductCodeNumber,
              };
              list.push(node);
            });
          });
          this.updateReceiptList(list);
        }),
        // insert Log
        switchMap(() => {
          const oldLogs = [
            {
              PurchaseOrderNumber: PurchaseOrder,
              UserName: this._userInfo.userName,
              UserEventID: sqlData.Event_Receiving_OverReceiving_start,
            },
          ];
          this._eventLog.initEventLog({
            UserName: this._userInfo.userName,
            EventTypeID: sqlData.Event_Receiving_OverReceiving_start,
            Log: JSON.stringify({
              PurchaseOrderNumber: PurchaseOrder,
            }),
          });
          return this._insertLog.mutate({
            oldLogs,
            eventLogs: this._eventLog.eventLog,
          });
        })
      );
  }

  /**
   * fetch Part Info
   */
  public findVerifyInfo$() {
    const info = this.receiptInfoAfterFilter()[0];
    return this._findverifyInfo$
      .fetch({
        PartNumber: info.PartNumber,
        ProductCode: info.ProductCodeNumber,
      })
      .pipe(
        map((res) => {
          return {
            ProductID: info.ProductID,
            ProductCode: info.ProductCodeNumber,
            PartNumber: info.PartNumber,
            MIC: `${environment.productImgSource}${res.data.fetchProductMICFromMerp}.jpg`,
            message: res.data.fetchPartMessage.comments,
            kitInfo: '',
            UoM: info.UnitOfMeasure,
          };
        })
      );
  }

  public updateQuanityForOverReceiving$(quantity: number, AuthName: string) {
    const prevQuantity = this.receiptInfoAfterFilter()[0].ExpectedQuantity;
    return this._updateReceiptLine
      .mutate({
        _id: this.receiptInfoAfterFilter()[0].ReceiptLineID,
        ExpectedQuantity: quantity,
      })
      .pipe(
        tap(() => {
          this.updateExpectQuantity(quantity);
        }),
        switchMap(() => {
          const line = this.receiptInfoAfterFilter()[0];
          const oldLogs = {
            UserName: this._userInfo.userName,
            UserEventID: sqlData.Event_Receiving_OverReceiving_done,
            ReceiptLine: line.ReceiptLineNumber,
            Quantity: line.ExpectedQuantity,
            PurchaseOrderNumber: line.PurchaseOrderNumber,
            PurchaseLine: line.PurchaseLineNumber,
            Message: `${AuthName} from ${prevQuantity} to ${quantity}`,
          };
          const eventLogs = {
            EventTypeID: sqlData.Event_Receiving_OverReceiving_done,
            UserName: this._userInfo.userName,
            Log: JSON.stringify({
              ...JSON.parse(this._eventLog.eventLog.Log),
              ...line,
              Message: `${AuthName} from ${prevQuantity} to ${quantity}`,
            }),
          };
          return this._insertLog.mutate({
            oldLogs,
            eventLogs,
          });
        })
      );
  }
}
