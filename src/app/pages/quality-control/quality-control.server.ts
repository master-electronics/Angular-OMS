import { BehaviorSubject } from 'rxjs';

export class QualityControlService {
  // Tab
  private _tabStatus = new BehaviorSubject<any>([
    'process',
    'wait',
    'wait',
    'wait',
  ]);
  public tabStatus$ = this._tabStatus.asObservable();
  public changeTab(tab: string[]): void {
    this._tabStatus.next(tab);
  }

  // global messages
  private _globalMessage = new BehaviorSubject<any>([]);
  public globalMessage$ = this._globalMessage.asObservable();
  public changeGlobalMessages(messages: any): void {
    this._globalMessage.next(messages!);
  }
  public get globalMessages(): string[] {
    return this._globalMessage.value;
  }

  // task start time
  private _qcStartTime = new BehaviorSubject<number>(0);
  public resetQCStartTime(date: number): void {
    this._qcStartTime.next(date);
  }
  public get qcStart(): number {
    return this._qcStartTime.value;
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
