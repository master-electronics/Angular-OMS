import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UIStateStore {
  private _pageLoading = new BehaviorSubject<boolean>(false);

  public get pageLoading$(): Observable<boolean> {
    return this._pageLoading.asObservable();
  }

  public get pageLoading() {
    return this._pageLoading.getValue();
  }

  public changePageLoading(input: boolean) {
    this._pageLoading.next(input);
  }
}
