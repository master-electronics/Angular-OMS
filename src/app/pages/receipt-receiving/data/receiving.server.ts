import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable()
export class ReceivingService {
  // Tab
  private _currentTab = new BehaviorSubject<number>(0);
  public currentTab$ = this._currentTab.asObservable();
  public changeTab(tab: number): void {
    this._currentTab.next(tab);
  }

  // data stream
  private _receiptH$ = new BehaviorSubject<any>({ isLoading: false });
  public getReceiptHInfo(): Observable<any> {
    return this._receiptH$;
  }
  public changereceiptH(data) {
    this._receiptH$.next(data);
  }
  public getValueReceiptH() {
    return this._receiptH$.getValue();
  }
}
