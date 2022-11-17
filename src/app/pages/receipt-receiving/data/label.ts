import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, switchMap, tap } from 'rxjs';
import { PrintReceivingLabelGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { CreateItnGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { environment } from 'src/environments/environment';
import { ReceivingStore } from './receivingStore';

export interface ITNinfo {
  ITN: string;
  quantity: number;
}

@Injectable()
export class LabelStore {
  constructor(
    private _print: PrintReceivingLabelGQL,
    private _itn: CreateItnGQL
  ) {}

  /**
   * save quantitylist after assign label
   */
  private _quantityList = new BehaviorSubject<number[]>(null);
  public get quantityList(): number[] {
    return this._quantityList.value;
  }
  public initQuantityList(list: number[]) {
    this._quantityList.next(list);
  }
  /**
   * label and quantity assign list
   */
  private _ITNList = new BehaviorSubject<ITNinfo[]>(null);
  /**
   * get ITNList$
   */
  public get ITNList$() {
    return this._ITNList.asObservable();
  }
  /**
   * get value
   */
  public get ITNList(): ITNinfo[] {
    return this._ITNList.value;
  }
  /**
   * updateITNList
   */
  public updateITNList(ITN: string, quantity: number): void {
    let tmp = [{ ITN, quantity }];
    if (this._ITNList.value) {
      tmp = [...this._ITNList.value, { ITN, quantity }];
    }
    this._ITNList.next(tmp);
  }

  /**
   * printReceivingLabel
   */
  public printReceivingLabel$(
    index: number,
    quantity: number,
    PRINTER: string,
    DPI: string,
    ORIENTATION: string
  ) {
    return this._itn
      .fetch(
        { LocationCode: environment.DistributionCenter },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          this.updateITNList(res.data.createITN, quantity);
        }),
        switchMap((res) => {
          return this._print.fetch(
            {
              PRINTER,
              ITN: res.data.createITN,
              DPI,
              ORIENTATION,
            },
            { fetchPolicy: 'network-only' }
          );
        }),
        delay(5000)
      );
  }
}
