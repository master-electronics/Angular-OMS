import { BehaviorSubject } from 'rxjs';

export class QualityControlService {
  private activeTabSubject = new BehaviorSubject<number>(1);
  activeTab = this.activeTabSubject.asObservable();

  constructor() {}

  changeTab(tab: number) {
    this.activeTabSubject.next(tab);
  }
}
