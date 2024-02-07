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
  ParentITN?: string;
  COO?: string;
  ROHS?: boolean;
  Quantity?: number;
  Product?: Product;
  OriginalQuantity?: number;
  NotFound?: boolean;
  Suspect?: boolean;
  LocatedInAutostore?: boolean;
  BoundForAutostore?: boolean;
}

export interface Container {
  Barcode: string;
  Status?: string;
}

export interface Product {
  _id?: number;
  PartNumber?: string;
  ProductCodeID?: number;
  ProductCode?: ProductCode;
  ProductTier?: string;
  ProductType?: ProductType;
  Description?: string;
  Velocity?: string;
  MICPartNumber?: string;
  UOM?: string;
  Autostore?: boolean;
  PackType?: string;
  PackQty?: number;
  Cost?: number;
  SLC?: string;
  MSL?: string;
  GlobalMessages?: [GlobalMessage?];
}

export interface ProductCode {
  _id?: number;
  ProductCodeNumber?: string;
}

export interface ProductType {
  _id?: number;
  ProductType?: string;
  Description?: string;
}

export interface GlobalMessage {
  Message?: string;
}
