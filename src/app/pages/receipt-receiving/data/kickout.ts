import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PartStore } from './part';

interface Kickout {
  receiptLineIDs: number[];
  reason?: number;
  other?: string;
  label?: string;
  location?: string;
}

@Injectable()
export class KickoutStore {
  /**
   *
   * @param _part part store class
   */
  constructor(private _part: PartStore) {}

  /**
   * info for kickout process
   */
  private _kickout = new BehaviorSubject<Kickout>(null);

  /**
   * get kickout value
   */
  public get kickout(): Kickout {
    return this._kickout.value;
  }

  /**
   * initKickout: fetch receipt line IDs from the lastest value of _receiptLs
   */
  public initKickout() {
    const lines = this._part.receiptLs.map((res) => res._id);
    this._kickout.next({ receiptLineIDs: lines });
  }

  /**
   *
   * @param index value of the reason list
   * @param other user input ohter reason
   */
  public updateReasons(index: number, other?: string): void {
    const current = this._kickout.value;
    this._kickout.next({
      ...current,
      reason: index,
      other,
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
