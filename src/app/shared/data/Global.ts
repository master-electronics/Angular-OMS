import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GlobalService {
  /**
   * page loading flag
   */
  private _pageLoading = new BehaviorSubject<boolean>(false);

  public get pageLoading$(): Observable<boolean> {
    return this._pageLoading.asObservable();
  }

  public changePageLoading(input: boolean) {
    this._pageLoading.next(input);
  }
}
