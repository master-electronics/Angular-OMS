export interface Audit {
  _id?: number;
  TypeID?: number;
  Type?: AuditType;
  InventoryID?: number;
  Inventory?: Inventory;
  Container?: Container;
  UserID?: number;
  LastUpdated?: string;
  CreatedDatetime?: string;
  Priority?: number;
  Route?: string;
}

export interface AuditType {
  _id?: number;
  Type?: string;
  Order?: number;
}

export interface Inventory {
  _id?: number;
  ITN?: string;
  ProductID?: number;
  DateCode?: string;
  COO?: string;
  ROHS?: boolean;
  Quantity?: number;
  Product?: Product;
}

export interface Container {
  Barcode: string;
}

export interface Product {
  _id?: number;
  PartNumber?: string;
  ProductCodeID?: number;
  ProductCode?: ProductCode;
  MICPartNumber?: string;
  UOM?: string;
  PackType?: string;
  PackQty?: number;
  Cost?: number;
}

export interface ProductCode {
  _id?: number;
  ProductCodeNumber?: string;
}
