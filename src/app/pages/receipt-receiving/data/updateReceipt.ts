import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ReceivingUpdateReceiptLGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { LogService } from './eventLog';
import { ReceiptInfoService } from './ReceiptInfo';

interface ReceiptInfo {
  ReceiptLIDs: number[];
  DateCode?: string;
  CountryID?: number;
  RHOS?: boolean;
  ISO3?: string;
}

@Injectable()
export class updateReceiptInfoService {
  constructor(
    private _update: ReceivingUpdateReceiptLGQL,
    private _receipt: ReceiptInfoService,
    private _log: LogService,
    private _insertLog: Insert_UserEventLogsGQL
  ) {}
  /**
   * Store info for update receipt
   */
  private _receiptInfo = new BehaviorSubject<ReceiptInfo>(null);
  public get receiptInfo(): ReceiptInfo {
    return this._receiptInfo.value;
  }

  /**
   * reset
   */
  public reset() {
    this._receiptInfo.next(null);
  }

  /**
   * initReceiptInfo: After filter by Quantity. All lines are target receipt
   */
  public initReceiptInfo(): void {
    const ReceiptLIDs = this._receipt.receiptLsAfterQuantity.map(
      (res) => res._id
    );
    this._receiptInfo.next({
      ReceiptLIDs,
    });
  }

  public updateDateCode(DateCode: string): void {
    this._receiptInfo.next({
      ...this._receiptInfo.value,
      DateCode,
    });
  }
  /**
   * updateCountryID
   */
  public updateCountry(CountryID: number, ISO3: string): void {
    this._receiptInfo.next({
      ...this._receiptInfo.value,
      CountryID,
      ISO3,
    });
  }
  /**
   * updateRHOS
   */
  public updateRHOS(RHOS: boolean) {
    this._receiptInfo.next({
      ...this._receiptInfo.value,
      RHOS,
    });
  }

  public updateReceiptLSQL() {
    const update = this._update.mutate({
      idList: this.receiptInfo.ReceiptLIDs,
      DateCode: this.receiptInfo.DateCode,
      CountryID: this.receiptInfo.CountryID,
      RHOS: this.receiptInfo.RHOS,
    });
    const log = this._receipt.receiptLsAfterQuantity.map((line) => {
      return {
        ...this._log.receivingLog,
        UserEventID: sqlData.Event_Receiving_UpdateInfo,
        ReceiptLine: line.LineNumber,
        Quantity: line.ExpectedQuantity,
      };
    });
    return combineLatest({
      update,
      log: this._insertLog.mutate({ log }),
    });
  }
}
