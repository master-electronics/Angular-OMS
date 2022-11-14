import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { FindReceiptHeaderForReceivingGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';

@Injectable()
export class PartStore {
  constructor(private _findReceiptH$: FindReceiptHeaderForReceivingGQL) {}
  // For Receipt Header page
  private _receiptHeader = new BehaviorSubject<any>({ isLoading: false });
  public get receiptHeader$(): Observable<any> {
    return this._receiptHeader.asObservable();
  }
  public get receiptHeader() {
    return this._receiptHeader.value;
  }
  public changereceiptH(data) {
    this._receiptHeader.next(data);
  }

  public findReceiptHeader(ReceiptHID: number): Observable<any> {
    return this._findReceiptH$
      .fetch(
        {
          ReceiptHID,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          this._receiptHeader.next(res.data.findReceiptH);
          console.log('1234');
        })
      );
  }

  // For part number page
  private _part = new BehaviorSubject<any>({ isLoading: false });
  public get part$(): Observable<any> {
    return this._part.asObservable();
  }
  public get part() {
    return this._part.getValue();
  }
  public findPartNumber(PartNumber: string): Observable<any> {
    return this._receiptHeader.pipe(
      switchMap(() => of(1)),
      shareReplay()
    );
  }
}
