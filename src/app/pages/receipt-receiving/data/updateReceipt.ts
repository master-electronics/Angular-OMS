import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReceivingUpdateReceiptLGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { ReceiptInfoService } from './ReceiptInfo';

interface ReceiptInfo {
  ReceiptLIDs: number[];
  DateCode?: string;
  CountryID?: number;
  ROHS?: boolean;
  ISO3?: string;
}

@Injectable()
export class updateReceiptInfoService {
  constructor(
    private _update: ReceivingUpdateReceiptLGQL,
    private _receipt: ReceiptInfoService
  ) {}
  private _receiptInfo = new BehaviorSubject<ReceiptInfo>(null);
  public get receiptInfo(): ReceiptInfo {
    return this._receiptInfo.value;
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
   * updateROHS
   */
  public updateROHS(ROHS: boolean) {
    this._receiptInfo.next({
      ...this._receiptInfo.value,
      ROHS,
    });
  }

  public updateReceiptLSQL() {
    return this._update.mutate({
      idList: this.receiptInfo.ReceiptLIDs,
      DateCode: this.receiptInfo.DateCode,
      CountryID: this.receiptInfo.CountryID,
      ROHS: this.receiptInfo.ROHS,
    });
  }

  public initValue() {
    this._receiptInfo.next(null);
  }
}
