import { BehaviorSubject, Observable } from 'rxjs';
import { HttpRequestState } from 'src/app/shared/data/interface';

export class ReceivingService {
  // Tab
  private _currentTab = new BehaviorSubject<number>(0);
  public currentTab$ = this._currentTab.asObservable();
  public changeTab(tab: number): void {
    this._currentTab.next(tab);
  }

  public receiptHInfo$ = new Observable<HttpRequestState<unknown>>(null);
}
