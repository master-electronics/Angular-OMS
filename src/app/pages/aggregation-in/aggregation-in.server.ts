import { BehaviorSubject } from 'rxjs';

export interface outsetContainer {
  Barcode: string;
  isRelocation: boolean;
  OrderID: number;
  toteID: number;
  OrderNumber: string;
  NOSINumber: string;
  CustomerNumber: string;
  CustomerTier: string;
  ShipmentMethod: string;
  ShipmentMethodDescription: string;
  Priority: boolean;
  ITNsInTote: {
    detaileID: number;
    ITN: string;
    OrderLineNumber: number;
    InventoryID: number;
    PartNumber: string;
    ProductCode: string;
    ProductTier: string;
    WMSPriority: number;
    ParentITN: string;
    Quantity: number;
  }[];
}

export interface endContainer {
  Barcode: string;
  type: 'tote' | 'shelf';
  isLastLine: boolean;
  OrderNumber: string;
  NOSINumber: string;
  location: {
    Warehouse: string;
    Row: string;
    Aisle: string;
    Section: string;
    Shelf: string;
    ShelfDetail: string;
  };
  containerID: number;
  FileKeyListforAgIn: string[];
}

export class AggregationInService {
  // information for outset container
  private _outsetContainer = new BehaviorSubject<outsetContainer>(null);
  public outsetContainer$ = this._outsetContainer.asObservable();
  public changeOutsetContainer(info: outsetContainer): void {
    this._outsetContainer.next(info);
  }
  public get outsetContainer(): outsetContainer {
    return this._outsetContainer.value;
  }

  // information for end container
  private _endContainer = new BehaviorSubject<endContainer>(null);
  public changeEndContainer(info: endContainer): void {
    this._endContainer.next(info);
  }
  public get endContainer(): endContainer {
    return this._endContainer.value;
  }
}
