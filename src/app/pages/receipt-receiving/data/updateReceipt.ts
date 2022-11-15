import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface ReceiptInfo {
  quantity: number;
  dateCode?: string;
  countryISO3?: string;
  ROHS?: boolean;
}

@Injectable()
export class updateReceiptStore {
  private _receiptInfo = new BehaviorSubject<ReceiptInfo>(null);
  public get receiptInfo(): ReceiptInfo {
    return this._receiptInfo.value;
  }
  public updateReceiptInfo(
    dateCode: string = undefined,
    countryISO3: string = undefined,
    ROHS: boolean = undefined
  ): void {
    let current = this._receiptInfo.value;
    if (typeof dateCode !== 'undefined') {
      current = {
        ...current,
        dateCode,
      };
    }
    if (typeof countryISO3 !== 'undefined') {
      current = {
        ...current,
        countryISO3,
      };
    }
    if (typeof ROHS !== 'undefined') {
      current = {
        ...current,
        ROHS,
      };
    }

    this._receiptInfo.next({
      ...current,
    });
  }
}
