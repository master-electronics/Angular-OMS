import { BehaviorSubject } from 'rxjs';

export class QualityControlService {
  // Tab
  private tabStatus = new BehaviorSubject<any>([
    'process',
    'wait',
    'wait',
    'wait',
  ]);
  public tabStatus$ = this.tabStatus.asObservable();
  public changeTab(tab: string[]): void {
    this.tabStatus.next(tab);
  }

  // global messages
  private globalMessage = new BehaviorSubject<any>([]);
  public globalMessage$ = this.globalMessage.asObservable();
  public changeGlobalMessages(messages: any): void {
    this.globalMessage.next(messages!);
  }
  public get globalMessages(): string[] {
    return this.globalMessage.value;
  }

  // task start time
  private qcStartTime = new BehaviorSubject<number>(0);
  public resetQCStartTime(date: number): void {
    this.qcStartTime.next(date);
  }
  public get qcStart(): number {
    return this.qcStartTime.value;
  }
}

export interface urlParams {
  ITN: string;
  CustomerNum: string;
  DC: string;
  OrderNum: string;
  OrderLine: number;
  NOSI: string;
  PRC: string;
  PartNum: string;
  Quantity: number;
  ParentITN: string;
  ROHS: number;
  coo: string;
  DateCode: string;
}
