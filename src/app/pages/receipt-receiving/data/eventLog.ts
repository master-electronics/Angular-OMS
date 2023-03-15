import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ReceivingLog {
  UserName: string;
  UserEventID: number;
  ReceiptHeader: number;
  ReceiptLine?: number;
  PartNumber?: string;
  ProductCode?: string;
  Quantity?: number;
  PurchaseOrderNumber?: string;
  PurchaseLine?: number;
  InventoryTrackingNumber?: string;
  Message?: string;
}

@Injectable()
export class LogService {
  private _receivingLog = new BehaviorSubject<ReceivingLog>(null);
  public get receivingLog(): ReceivingLog {
    return this._receivingLog.value;
  }
  public initReceivingLog(log: ReceivingLog): void {
    this._receivingLog.next(log);
  }
  public updateReceivingLog(log): void {
    this._receivingLog.next({
      ...this._receivingLog?.value,
      ...log,
    });
  }
}
