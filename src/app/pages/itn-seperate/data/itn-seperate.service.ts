import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ItnInfo {
  ITN: string;
  InventoryID: number;
  ProductID: number;
  ProductCode: string;
  PartNumber: string;
  QuantityOnHand: number;
  Remaining: number;
  ProductType: string;
  Velocity: string;
}

@Injectable()
export class ItnSeperateService {
  constructor() {
    //
  }

  private _itnInfo = new BehaviorSubject<ItnInfo>(null);
  public get itnInfo() {
    return this._itnInfo.value;
  }
  public get itnInfo$() {
    return this._itnInfo.asObservable();
  }

  /**
   *
   * @param date Update itnInfo
   */
  public changeItnInfo(date: ItnInfo): void {
    this._itnInfo.next(date);
  }

  /**
   * resetItnInfo
   */
  public resetItnInfo(): void {
    this._itnInfo.next(null);
  }
}
