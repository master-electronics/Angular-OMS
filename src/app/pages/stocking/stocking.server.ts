import { BehaviorSubject } from 'rxjs';

export interface SuggetionLocation {
  Bincode: string;
  Zone: number;
  Quantity: number;
}

export interface ITNInfo {
  ITN: string;
  InventoryID: number;
  productID: number;
  productCode: string;
  partNumber: string;
  QuantityOnHand: number;
  remaining: number;
  productType: string;
  velocity: string;
  zone: number;
  suggetionLocationList: SuggetionLocation[];
  OrderNumber: string;
  NOSINumber: string;
  OrderLineNumber: number;
}

export interface ITNinfoForStocking {
  _id: number;
  ITN: string;
  Quantity: number;
  productID: number;
}

export class StockingService {
  // For Sorting page
  private _sortingInfo = new BehaviorSubject<ITNInfo>(null);
  public changeSortingInfo(date: ITNInfo): void {
    this._sortingInfo.next(date);
  }
  public get sortingInfo(): ITNInfo {
    return this._sortingInfo.value;
  }

  // For Stocking page
  private _ITNListInContainer = new BehaviorSubject<ITNinfoForStocking[]>([]);
  public changeITNListInContainer(date: ITNinfoForStocking[]): void {
    this._ITNListInContainer.next(date);
  }
  public get ITNListInContainer(): ITNinfoForStocking[] {
    return this._ITNListInContainer.value;
  }

  private _ScanedITNList = new BehaviorSubject<ITNinfoForStocking[]>([]);
  public changeScanedITNList(date: ITNinfoForStocking[]): void {
    this._ScanedITNList.next(date);
  }
  public get ScanedITNList(): ITNinfoForStocking[] {
    return this._ScanedITNList.value;
  }

  private _currentITN = new BehaviorSubject<ITNinfoForStocking>(null);
  public changeCurrentITN(date: ITNinfoForStocking): void {
    this._currentITN.next(date);
  }
  public get currentITN(): ITNinfoForStocking {
    return this._currentITN.value;
  }

  private _userContainerID = new BehaviorSubject<number>(null);
  public changeUserContainerID(date: number): void {
    this._userContainerID.next(date);
  }
  public get userContainerID(): number {
    return this._userContainerID.value;
  }
}
