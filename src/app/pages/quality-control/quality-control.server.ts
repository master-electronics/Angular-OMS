import { BehaviorSubject } from 'rxjs';

export class QualityControlService {
  // Switch Tab
  private activeTabSubject = new BehaviorSubject<number>(1);
  public activeTab = this.activeTabSubject.asObservable();
  public changeTab(tab: number): void {
    this.activeTabSubject.next(tab);
  }

  constructor() {
    //
  }
}
