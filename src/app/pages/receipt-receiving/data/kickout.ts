import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ReceiptInfoService } from './ReceiptInfo';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { SuspectInventoryGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { PrinterService } from 'src/app/shared/data/printer';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Injectable()
export class kickoutService {
  private _receipt = inject(ReceiptInfoService);
  private _eventLog = inject(EventLogService);
  private _suspect = inject(SuspectInventoryGQL);
  private _insertLog = inject(Create_EventLogsGQL);
  private _printer = inject(PrinterService);
  private _userInfo = inject(StorageUserInfoService);

  private _kickoutItns = new BehaviorSubject<string[]>(null);
  public get kickoutItns(): string[] {
    return this._kickoutItns.value;
  }
  public updatekickoutItns(list: string[]): void {
    this._kickoutItns.next(list);
  }

  public printKickOutLabel$(
    list: string[],
    itn: string,
    reason: string,
    reasonID: number
  ) {
    const oldLogs = this._receipt.receiptInfoAfterFilter().map((line) => {
      return {
        UserName: this._userInfo.userName,
        InventoryTrackingNumber: itn,
        UserEventID: sqlData.Event_Receiving_KickOut,
        ReceiptLine: line.ReceiptLineNumber,
        Quantity: line.ExpectedQuantity,
        PartNumber: line.PartNumber,
        ProductCode: line.ProductCodeNumber,
        ReceiptHeader: this._receipt.headerID(),
        PurchaseOrderNumber: line.PurchaseOrderNumber,
        PurchaseLine: line.PurchaseLineNumber,
        Message: reason,
      };
    });
    const eventLogs = this._receipt.receiptInfoAfterFilter().map((line) => {
      return {
        ...this._eventLog.eventLog,
        EventTypeID: sqlData.Event_Receiving_KickOut,
        Log: JSON.stringify({
          ...JSON.parse(this._eventLog.eventLog.Log),
          InventoryTrackingNumber: itn,
          ReceiptLine: line.ReceiptLineNumber,
          ExpectedQuantity: line.ExpectedQuantity,
          Reason: reason,
        }),
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
          return this._printer.printText$(list);
        }),
        switchMap(() => {
          return this._insertLog.mutate({ oldLogs, eventLogs });
        })
      );
  }
}
