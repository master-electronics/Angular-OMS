import { BehaviorSubject } from 'rxjs';

export class ReceivingService {
  // Tab
  private _currentTab = new BehaviorSubject<number>(0);
  public currentTab$ = this._currentTab.asObservable();
  public changeTab(tab: number): void {
    this._currentTab.next(tab);
  }
}
