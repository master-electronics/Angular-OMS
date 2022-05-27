import { BehaviorSubject } from 'rxjs';
import { QcGlobalMessageQuery } from 'src/app/graphql/qualityControl.graphql-gen';

export class QualityControlService {
  // Tab
  private _tabStatus = new BehaviorSubject<string[]>([
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
  private _globalMessage = new BehaviorSubject<QcGlobalMessageQuery>(null);
  public globalMessage$ = this._globalMessage.asObservable();
  public changeGlobalMessages(messages: QcGlobalMessageQuery): void {
    this._globalMessage.next(messages);
  }
  public get globalMessages(): QcGlobalMessageQuery {
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

  // item info
  private _itemInfo = new BehaviorSubject<itemParams>(null);
  public changeItemParams(item: itemParams): void {
    this._itemInfo.next(item);
  }
  public get itemInfo(): itemParams {
    return this._itemInfo.value;
  }
}

export interface itemParams {
  InventoryTrackingNumber: string;
  OrderLineDetailID: number;
  CustomerNumber: string;
  DistributionCenter: string;
  OrderID: number;
  OrderNumber: string;
  OrderLineNumber: number;
  NOSI: string;
  ProductCode: string;
  PartNumber: string;
  Quantity: number;
  ParentITN: string;
  ROHS: boolean;
  CountryOfOrigin: string;
  DateCode: string;
  CountMethod: string;
  isQCDrop: boolean;
}
