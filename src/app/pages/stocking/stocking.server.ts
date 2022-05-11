import { BehaviorSubject } from 'rxjs';

interface SuggetionLocation {
  Bincode: string;
  Zone: number;
  Quantity: number;
}

export interface SortingInfo {
  ITN: string;
  InventoryID: number;
  productCode: string;
  partNumber: string;
  QuantityOnHand: number;
  percent: number;
  productType: string;
  velocity: number;
  zone: number;
  suggetionLocationList: [SuggetionLocation];
}

export class StockingService {
  private _sortingInfo = new BehaviorSubject<SortingInfo>(null);
  public changeSortingInfo(date: SortingInfo): void {
    this._sortingInfo.next(date);
  }
  public get sortingInfo(): SortingInfo {
    return this._sortingInfo.value;
  }
}
