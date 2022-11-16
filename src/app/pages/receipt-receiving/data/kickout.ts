import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
   */
  constructor(private _receipt: ReceiptStore) {}

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

  public resetKickout(): void {
    this._kickout.next(null);
  }
}
