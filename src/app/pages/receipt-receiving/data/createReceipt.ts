import { Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { ReceiptInfoService } from './ReceiptInfo';
import {
  FetchPurchaseOrderInfoGQL,
  GenerateReceiptForReceivingGQL,
} from 'src/app/graphql/receiptReceiving.graphql-gen';
import { LogService } from './eventLog';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

interface PurchaseInfo {
  PurchaseOrderNumber?: string;
  LineNumber?: number;
  Quantity?: number;
}

interface LineInfo {
  LineNumber: number;
  VendorName: string;
  QuantityOnOrder: number;
  QuantityReceived: number;
  PartNumber: string;
  ProductCode: string;
  DueDate: string;
}

@Injectable()
export class CreateReceiptService {
  private _purchaseInfo = new BehaviorSubject<PurchaseInfo>({});
  public get purchaseInfo(): PurchaseInfo {
    return this._purchaseInfo.value;
  }
  public updatePurchaseInfo(info: PurchaseInfo) {
    this._purchaseInfo.next({
      ...this._purchaseInfo.value,
      ...info,
    });
  }

  private _linesInfo = new BehaviorSubject<LineInfo[]>([]);
  public get linesInfo(): LineInfo[] {
    return this._linesInfo.value;
  }
  public insertLineInfo(line: LineInfo) {
    const tmp = this.linesInfo;
    tmp.push(line);
    this._linesInfo.next(tmp);
  }

  private _leftQuantity = new BehaviorSubject<number>(null);
  public get leftQuantity(): number {
    return this._leftQuantity.value;
  }
  public updateLeftQuantity(data: number) {
    this._leftQuantity.next(data);
  }

  public reset() {
    this._purchaseInfo.next({});
    this._linesInfo.next([]);
    this._leftQuantity.next(null);
  }

  constructor(
    private _receiptInfo: ReceiptInfoService,
    private _generateReceipt: GenerateReceiptForReceivingGQL,
    private _fetchpurchase: FetchPurchaseOrderInfoGQL,
    private _log: LogService,
    private _eventLog: EventLogService,
    private _userInfo: StorageUserInfoService,
    private _insertLog: Create_EventLogsGQL
  ) {}

  /**
   * getPurchaseOrderInfo
   */
  public getPurchaseOrderInfo$(order: string) {
    this.updatePurchaseInfo({ PurchaseOrderNumber: order });
    return this._fetchpurchase
      .fetch({
        PurchaseOrderNumber: order,
        DistributionCenter: environment.DistributionCenter,
      })
      .pipe(
        tap((res) => {
          if (!res.data.findPurchaseOrderH._id) {
            throw new Error("Can't find this purchase Order!");
          }
          if (!res.data.findPurchaseOrderH.PURCHASEORDERLs.length) {
            throw new Error("Can't find line under this purchase order!");
          }
        }),
        map((res) => {
          res.data.findPurchaseOrderH.PURCHASEORDERLs.map((line) => {
            if (line.QuantityOnOrder <= line.QuantityReceived) {
              return;
            }
            const date = new Date(Number(line.DueDate));
            const lineInfo: LineInfo = {
              LineNumber: line.LineNumber,
              VendorName: res.data.findPurchaseOrderH.Vendor.VendorName,
              QuantityOnOrder: line.QuantityOnOrder,
              QuantityReceived: line.QuantityReceived,
              PartNumber: line.Product.PartNumber,
              ProductCode: line.Product.ProductCode.ProductCodeNumber,
              DueDate: date.toLocaleDateString(),
            };
            this.insertLineInfo(lineInfo);
          });
          if (!this.insertLineInfo.length) {
            throw new Error('No line!');
          }
        }),
        switchMap(() => {
          this._log.initReceivingLog({
            UserName: this._userInfo.userName,
            UserEventID: sqlData.Event_Receiving_Start,
            PurchaseOrderNumber: order,
          });
          this._eventLog.initEventLog({
            UserName: this._userInfo.userName,
            EventTypeID: sqlData.Event_Receiving_Start,
            Log: JSON.stringify({
              PurchaseOrderNumber: order,
            }),
          });
          return this._insertLog.mutate({
            oldLogs: [this._log.receivingLog],
            eventLogs: [this._eventLog.eventLog],
          });
        })
      );
  }

  /**
   * GenerateRecipt: Use puchase order number, lineNumber to find information to create receipt header, line and detail.
   */
  public generateReceipt$() {
    return this._generateReceipt
      .mutate({
        LineNumber: this.purchaseInfo.LineNumber,
        PurchaseOrderNumber: this.purchaseInfo.PurchaseOrderNumber,
        Quantity: this.purchaseInfo.Quantity,
      })
      .pipe(
        switchMap((res) => {
          const id = res.data.generateReceiptForReceiving;
          this._receiptInfo.updateHeaderID(id);
          this._log.updateReceivingLog({
            ReceiptHeader: id,
            UserEventID: sqlData.Event_Receiving_Start,
          });
          this._eventLog.updateEventLog({
            UserName: this._userInfo.userName,
            EventTypeID: sqlData.Event_Receiving_Start,
            Log: JSON.stringify({
              ReceiptHeader: id,
              ...this.purchaseInfo,
            }),
          });
          const oldlog2 = {
            ReceiptHeader: id,
            UserName: this._userInfo.userName,
            UserEventID: sqlData.Event_Receiving_create_receipt_done,
          };
          const eventlog2 = {
            UserName: this._userInfo.userName,
            EventTypeID: sqlData.Event_Receiving_create_receipt_done,
            Log: JSON.stringify({
              ReceiptHeader: id,
              ...this.purchaseInfo,
            }),
          };
          return this._insertLog.mutate({
            oldLogs: [this._log.receivingLog, oldlog2],
            eventLogs: [this._eventLog.eventLog, eventlog2],
          });
        })
      );
  }
}
