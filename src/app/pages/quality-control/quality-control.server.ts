import { BehaviorSubject } from 'rxjs';

export class QualityControlService {
  // Tab
  private activeTabSubject = new BehaviorSubject<number>(1);
  public activeTab = this.activeTabSubject.asObservable();
  public changeTab(tab: number): void {
    this.activeTabSubject.next(tab);
  }

  // global messages
  private globalMessagesSubject = new BehaviorSubject<string[]>(null);
  public globalMessagesObs = this.activeTabSubject.asObservable();
  public changeGlobalMessages(messages: string[]): void {
    this.globalMessagesSubject.next(messages);
  }
  public get globalMessages(): string[] {
    return this.globalMessagesSubject.value;
  }
}
