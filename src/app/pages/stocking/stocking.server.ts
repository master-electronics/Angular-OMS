import { BehaviorSubject } from 'rxjs';

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
