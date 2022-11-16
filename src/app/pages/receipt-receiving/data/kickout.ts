import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { PrintReceivingLabelGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { CreateItnGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { environment } from 'src/environments/environment';
import { ReceiptStore } from './Receipt';

interface Kickout {
  receiptLineIDs: number[];
  reason?: string;
  other?: string;
  label?: string;
  location?: string;
}

@Injectable()
export class KickoutStore {
  /**
   *
   * @param _receipt part store class
   * @param _print print receiving label end point
   */
  constructor(
    private _receipt: ReceiptStore,
    private _print: PrintReceivingLabelGQL,
    private _itn: CreateItnGQL
  ) {}

  /**
   * info for kickout process
   */
  private _kickout = new BehaviorSubject<Kickout>(null);

  /**
   * kickout$
 : Observerable<Kickout>  */
  public kickout$(): Observable<Kickout> {
    return this._kickout.asObservable();
  }

  /**
   * get kickout value
   */
  public get kickout(): Kickout {
    return this._kickout.getValue();
  }

  /**
   * initKickout: fetch receipt line IDs from the lastest value of _receiptLs
   */
  public initKickout() {
    const lines = this._receipt.receiptLs.map((res) => res._id);
    this._kickout.next({ receiptLineIDs: lines });
  }

  /**
   *
   * @param index value of the reason list
   * @param other user input ohter reason
   */
  public updateReasons(input: {
    kickoutReason: string;
    otherReason: string;
  }): void {
    const current = this._kickout.value;
    this._kickout.next({
      ...current,
      reason: input.kickoutReason,
      other: input.otherReason,
    });
  }

  /**
   * updateLocation
   */
  public updateLocation(location: string): void {
    this._kickout.next({
      ...this._kickout.value,
      location,
    });
  }

  /**
   * updateLabel
   */
  public updateLabel(label: string) {
    this._kickout.next({
      ...this._kickout.value,
      label,
    });
  }
  /**
   * resetKickout reset value at init kickout page
   */
  public resetKickout(): void {
    this._kickout.next(null);
  }

  /**
   * printReceivingLabel
   */
  public printReceivingLabel$(
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
        tap((res) => console.log(res)),
        switchMap((res) => {
          return this._print.fetch({
            PRINTER,
            ITN: res.data.createITN,
            DPI,
            ORIENTATION,
          });
        }),
        tap((res) => console.log(res))
      );
  }
}
