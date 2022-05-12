import { BehaviorSubject } from 'rxjs';

export interface SuggetionLocation {
  Bincode: string;
  Zone: number;
  Quantity: number;
}

export interface SortingInfo {
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
