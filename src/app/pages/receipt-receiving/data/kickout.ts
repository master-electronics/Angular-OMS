import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Kickout {
  receiptLineID: number;
  reason: number;
  other?: string;
  label?: string;
  location?: string;
}

@Injectable()
export class KickoutStore {
  private _kickout = new BehaviorSubject<Kickout>(null);
  public get kickout$(): Observable<Kickout> {
    return this._kickout.asObservable();
  }
  public get kickout(): Kickout {
    return this._kickout.value;
  }
  public updateReasons(index: number, other?: string): void {
    const current = this._kickout.value;
    this._kickout.next({
      ...current,
      reason: index,
      other,
    });
  }
}
