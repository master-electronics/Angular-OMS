import { BehaviorSubject } from 'rxjs';

export class QualityControlService {
  private activeTabSubject = new BehaviorSubject<number>(1);
  activeTab = this.activeTabSubject.asObservable();

  constructor() {
    //
  }

  changeTab(tab: number): void {
    this.activeTabSubject.next(tab);
  }
}
