import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UIStateStore {
  private _loading = new BehaviorSubject<boolean>(false);

  public getLoading(): Observable<boolean> {
    return this._loading;
  }

  public getUIStateValue() {
    return this._loading.getValue();
  }

  public changeLoading(input: boolean) {
    this._loading.next(input);
  }
}
