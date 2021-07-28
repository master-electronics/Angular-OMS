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

  // task start time
  private taskStartdate = new BehaviorSubject<Date>(null);
  public taskStartdateObs = this.activeTabSubject.asObservable();
  public changetaskStartdate(date: Date): void {
    this.taskStartdate.next(date);
  }
}

export interface urlParams {
  ITN: string;
  CustomerNum: string;
  DC: string;
  OrderNum: string;
  OrderLine: string;
  NOSI: string;
  PRC: string;
  PartNum: string;
  Quantity: number;
  ParentITN: string;
  ROHS: boolean;
  coo: string;
  DateCode: string;
}
