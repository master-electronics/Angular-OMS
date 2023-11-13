import * as Types from './generated/types.graphql-gen';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Asnrejectionreason = {
  __typename?: 'ASNREJECTIONREASON';
  Global?: Maybe<Scalars['Boolean']>;
  Reason?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Asnreplenishment = {
  __typename?: 'ASNREPLENISHMENT';
  InventoryID?: Maybe<Scalars['Int']>;
  Status?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Asnreplenishmentitem = {
  __typename?: 'ASNREPLENISHMENTITEM';
  Aisle?: Maybe<Scalars['String']>;
  Barcode?: Maybe<Scalars['String']>;
  InventoryID?: Maybe<Scalars['Int']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  ProductID?: Maybe<Scalars['Int']>;
  Row?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
  Status?: Maybe<Scalars['String']>;
  Warehouse?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Audit = {
  __typename?: 'AUDIT';
  Autostore?: Maybe<Scalars['Boolean']>;
  Barcode?: Maybe<Scalars['String']>;
  BoundForAutostore?: Maybe<Scalars['Boolean']>;
  COO?: Maybe<Scalars['String']>;
  Cost?: Maybe<Scalars['Float']>;
  CreatedDatetime?: Maybe<Scalars['String']>;
  DateCode?: Maybe<Scalars['String']>;
  Description?: Maybe<Scalars['String']>;
  InventoryID?: Maybe<Scalars['Int']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  LastUpdated?: Maybe<Scalars['String']>;
  LocatedInAutostore?: Maybe<Scalars['Boolean']>;
  MICPartNumber?: Maybe<Scalars['String']>;
  NotFound?: Maybe<Scalars['Boolean']>;
  Order?: Maybe<Scalars['Int']>;
  OriginalQuantity?: Maybe<Scalars['Float']>;
  PackQty?: Maybe<Scalars['Float']>;
  PackType?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Int']>;
  ProductCodeID?: Maybe<Scalars['Int']>;
  ProductCodeNumber?: Maybe<Scalars['String']>;
  ProductID?: Maybe<Scalars['Int']>;
  ProductTier?: Maybe<Scalars['String']>;
  ProductType?: Maybe<Scalars['String']>;
  ProductTypeDescription?: Maybe<Scalars['String']>;
  QuantityOnHand?: Maybe<Scalars['Float']>;
  ROHS?: Maybe<Scalars['Boolean']>;
  Suspect?: Maybe<Scalars['Boolean']>;
  Type?: Maybe<Scalars['String']>;
  TypeID?: Maybe<Scalars['Int']>;
  UOM?: Maybe<Scalars['String']>;
  UserID?: Maybe<Scalars['Int']>;
  Velocity?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Auditinventory = {
  __typename?: 'AUDITINVENTORY';
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
  oldID?: Maybe<Scalars['Int']>;
};

export type Audittype = {
  __typename?: 'AUDITTYPE';
  Order?: Maybe<Scalars['Int']>;
  Type?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Autostoreasnheader = {
  __typename?: 'AUTOSTOREASNHEADER';
  AUTOSTOREASNLINEs?: Maybe<Array<Maybe<Autostoreasnline>>>;
  Container?: Maybe<Container>;
  ContainerID?: Maybe<Scalars['Int']>;
  Status?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
  tuId?: Maybe<Scalars['String']>;
  tuType?: Maybe<Scalars['String']>;
};

export type Autostoreasnline = {
  __typename?: 'AUTOSTOREASNLINE';
  ASNID?: Maybe<Scalars['Int']>;
  Inventory?: Maybe<Inventory>;
  InventoryID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
  lineNumber?: Maybe<Scalars['Int']>;
  packagingUom?: Maybe<Scalars['String']>;
  productId?: Maybe<Scalars['String']>;
  quantityExpected?: Maybe<Scalars['Float']>;
};

export type Autostoremessage = {
  __typename?: 'AUTOSTOREMESSAGE';
  Action?: Maybe<Scalars['String']>;
  AutostoreID?: Maybe<Scalars['String']>;
  Endpoint?: Maybe<Scalars['String']>;
  ErrorCount?: Maybe<Scalars['Int']>;
  Message?: Maybe<Scalars['String']>;
  Method?: Maybe<Scalars['String']>;
  OrderLines?: Maybe<Scalars['String']>;
  Status?: Maybe<Scalars['String']>;
  Timestamp?: Maybe<Scalars['String']>;
  Type: Scalars['String'];
  TypeID?: Maybe<Scalars['Int']>;
  _id: Scalars['Int'];
};

export type Autostoremessageattempt = {
  __typename?: 'AUTOSTOREMESSAGEATTEMPT';
  MessageID: Scalars['Int'];
  Response: Scalars['String'];
  ResponseCode?: Maybe<Scalars['String']>;
  Source?: Maybe<Scalars['String']>;
  Status: Scalars['String'];
  Tiemstamp: Scalars['String'];
  _id: Scalars['Int'];
};

export type Autostoreorderheader = {
  __typename?: 'AUTOSTOREORDERHEADER';
  AutostoreOrderNumber?: Maybe<Scalars['String']>;
  OrderID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Autostoreorderline = {
  __typename?: 'AUTOSTOREORDERLINE';
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineDetailID?: Maybe<Scalars['Int']>;
  OrderLineID?: Maybe<Scalars['Int']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  Quantity?: Maybe<Scalars['Float']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Autostoreprocess = {
  __typename?: 'AUTOSTOREPROCESS';
  LastRun?: Maybe<Scalars['String']>;
  Type?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Container = {
  __typename?: 'Container';
  Aisle?: Maybe<Scalars['String']>;
  Barcode: Scalars['String'];
  CONTAINERs?: Maybe<Array<Maybe<Container>>>;
  ContainerType: ContainerType;
  ContainerTypeID: Scalars['Int'];
  DistributionCenter: Scalars['String'];
  Equipment?: Maybe<Equipment>;
  EquipmentID?: Maybe<Scalars['Int']>;
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
  ParentContainer?: Maybe<Container>;
  ParentContainerID?: Maybe<Scalars['Int']>;
  Row?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
  USERINFOs?: Maybe<Array<Maybe<UserInfo>>>;
  Warehouse?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['Int']>;
  _id: Scalars['Int'];
};

export type ContainerType = {
  __typename?: 'ContainerType';
  IsMobile: Scalars['Boolean'];
  Name: Scalars['String'];
  _id: Scalars['Int'];
};

export type Country = {
  __typename?: 'Country';
  CountryCode: Scalars['String'];
  CountryName: Scalars['String'];
  ISO2: Scalars['String'];
  ISO3: Scalars['String'];
  _id: Scalars['Int'];
};

export type Customer = {
  __typename?: 'Customer';
  CustomerNumber: Scalars['String'];
  CustomerTier: Scalars['String'];
  ORDERHEADERs?: Maybe<Array<Maybe<Order>>>;
  _id: Scalars['Int'];
};

export type DcProduct = {
  __typename?: 'DCProduct';
  DistributionCenter: Container;
  DistributionCenterID: Scalars['Int'];
  Product: Product;
  ProductID: Scalars['Int'];
  Velocity?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type DataColumn = {
  __typename?: 'DataColumn';
  CHARACTER_MAXIMUM_LENGTH?: Maybe<Scalars['Int']>;
  COLUMN_NAME?: Maybe<Scalars['String']>;
  DATA_TYPE?: Maybe<Scalars['String']>;
  IS_NULLABLE?: Maybe<Scalars['String']>;
  IS_PRIMARY_KEY?: Maybe<Scalars['String']>;
};

export type DataTable = {
  __typename?: 'DataTable';
  TABLE_NAME?: Maybe<Scalars['String']>;
};

export type DistributionCenter = {
  __typename?: 'DistributionCenter';
  DistributionCenter?: Maybe<Scalars['String']>;
};

export type Equipment = {
  __typename?: 'Equipment';
  Name: Scalars['String'];
  _id: Scalars['Int'];
};

export type EventLog = {
  __typename?: 'EventLog';
  CreateTime: Scalars['String'];
  DateTime: Scalars['String'];
  Event: Scalars['String'];
  EventTypeID: Scalars['Int'];
  Log: Scalars['String'];
  Module: Scalars['String'];
  UserName: Scalars['String'];
  _id: Scalars['Int'];
};

export type EventType = {
  __typename?: 'EventType';
  Event: Scalars['String'];
  Module: Scalars['String'];
  _id: Scalars['Int'];
};

export type GlobalMessage = {
  __typename?: 'GlobalMessage';
  comments?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type HoldOnCounter = {
  __typename?: 'HoldOnCounter';
  User: Scalars['String'];
  detail: Array<Maybe<Scalars['Int']>>;
};

export type Imadjustreason = {
  __typename?: 'IMADJUSTREASON';
  Reason?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Imtrigger = {
  __typename?: 'IMTRIGGER';
  Active?: Maybe<Scalars['Boolean']>;
  Description?: Maybe<Scalars['String']>;
  IMTrigger_AuditTypes?: Maybe<Array<Maybe<ImTrigger_AuditType>>>;
  Name?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type ImTrigger_AuditType = {
  __typename?: 'IMTrigger_AuditType';
  IMAuditType?: Maybe<Audittype>;
  IMAuditTypeID?: Maybe<Scalars['Int']>;
  IMTriggerID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type ItnAndQuantity = {
  BinLocation: Scalars['String'];
  ContainerID: Scalars['Int'];
  ISO3: Scalars['String'];
  ITN: Scalars['String'];
  countryID: Scalars['Int'];
  datecode: Scalars['String'];
  quantity: Scalars['Float'];
};

export type ItnColumn = {
  __typename?: 'ITNColumn';
  _id?: Maybe<Scalars['Int']>;
  colSpan?: Maybe<Scalars['String']>;
  dataName?: Maybe<Scalars['String']>;
  drilldown?: Maybe<Scalars['Boolean']>;
  eventGroup?: Maybe<Scalars['String']>;
  eventName?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  searchable?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['String']>;
};

export type ItnInfoforPulling = {
  __typename?: 'ITNInfoforPulling';
  Barcode?: Maybe<Scalars['String']>;
  InventoryID?: Maybe<Scalars['Int']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
  QuantityOnHand?: Maybe<Scalars['Float']>;
  StatusID?: Maybe<Scalars['Int']>;
  WMSPriority?: Maybe<Scalars['Int']>;
  Zone?: Maybe<Scalars['Int']>;
};

export type Itnlifecycleprocess = {
  __typename?: 'ITNLIFECYCLEPROCESS';
  LastProcessedID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Itnlifecycle_Report = {
  __typename?: 'ITNLIFECYCLE_Report';
  CustomerNumber?: Maybe<Scalars['String']>;
  CustomerTier?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  OrderNumber?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Boolean']>;
  ProductCode?: Maybe<Scalars['String']>;
  ProductTier?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
  TrackingNumber?: Maybe<Scalars['String']>;
  WMSPriority?: Maybe<Scalars['Int']>;
  Zone?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
  after_InventoryTrackingNumber?: Maybe<Scalars['String']>;
  agDone?: Maybe<Scalars['String']>;
  agDoneUser?: Maybe<Scalars['String']>;
  agInDone?: Maybe<Scalars['String']>;
  agOrderComplete?: Maybe<Scalars['String']>;
  agOutStart?: Maybe<Scalars['String']>;
  agRelocate?: Maybe<Scalars['String']>;
  agStart?: Maybe<Scalars['String']>;
  agStartUser?: Maybe<Scalars['String']>;
  dropoffCartSelected?: Maybe<Scalars['String']>;
  dropoffDone?: Maybe<Scalars['String']>;
  dropoffITNSkipped?: Maybe<Scalars['String']>;
  dropoffLine?: Maybe<Scalars['String']>;
  dropoffLocationSelected?: Maybe<Scalars['String']>;
  dropoffStart?: Maybe<Scalars['String']>;
  dropoffUser?: Maybe<Scalars['String']>;
  lineAllocation?: Maybe<Scalars['String']>;
  lineAllocationUser?: Maybe<Scalars['String']>;
  lineCancel?: Maybe<Scalars['String']>;
  orderCancel?: Maybe<Scalars['String']>;
  packDone?: Maybe<Scalars['String']>;
  packLine?: Maybe<Scalars['String']>;
  packLineUser?: Maybe<Scalars['String']>;
  packNewPackage?: Maybe<Scalars['String']>;
  packReject?: Maybe<Scalars['String']>;
  packStart?: Maybe<Scalars['String']>;
  packSupervisorCheck?: Maybe<Scalars['String']>;
  pickCartAssigned?: Maybe<Scalars['String']>;
  pickDone?: Maybe<Scalars['String']>;
  pickDoneUser?: Maybe<Scalars['String']>;
  pickITNNF?: Maybe<Scalars['String']>;
  pickITNPrint?: Maybe<Scalars['String']>;
  pickITNScan?: Maybe<Scalars['String']>;
  pickLabelCount?: Maybe<Scalars['String']>;
  pickLabelQuantity?: Maybe<Scalars['String']>;
  pickLocationScan?: Maybe<Scalars['String']>;
  pickOverPick?: Maybe<Scalars['String']>;
  pickQuantityEntered?: Maybe<Scalars['String']>;
  pickShortPick?: Maybe<Scalars['String']>;
  pickStart?: Maybe<Scalars['String']>;
  pickStartUser?: Maybe<Scalars['String']>;
  pickStatus15?: Maybe<Scalars['String']>;
  pickToteAssignment?: Maybe<Scalars['String']>;
  pickUserExit?: Maybe<Scalars['String']>;
  pullingCartSelected?: Maybe<Scalars['String']>;
  pullingDone?: Maybe<Scalars['String']>;
  pullingLocationSelected?: Maybe<Scalars['String']>;
  pullingNotFound?: Maybe<Scalars['String']>;
  pullingStart?: Maybe<Scalars['String']>;
  qcDone?: Maybe<Scalars['String']>;
  qcDoneUser?: Maybe<Scalars['String']>;
  qcHold?: Maybe<Scalars['String']>;
  qcOrderComplete?: Maybe<Scalars['String']>;
  qcStart?: Maybe<Scalars['String']>;
  qcStartUser?: Maybe<Scalars['String']>;
  qcStatus40?: Maybe<Scalars['String']>;
  qcStatus41?: Maybe<Scalars['String']>;
  releaseLine?: Maybe<Scalars['String']>;
  releaseOrder?: Maybe<Scalars['String']>;
  shippingManifest?: Maybe<Scalars['String']>;
  splitDone?: Maybe<Scalars['String']>;
};

export type ItnLifeCycleDrillDown = {
  __typename?: 'ITNLifeCycleDrillDown';
  CustomerNumber?: Maybe<Scalars['String']>;
  CustomerTier?: Maybe<Scalars['String']>;
  DateTime?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Event?: Maybe<Scalars['String']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  Module?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderLineNumber?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Boolean']>;
  ProductCode?: Maybe<Scalars['String']>;
  ProductTier?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
  ShipmentMethod?: Maybe<Scalars['String']>;
  ShipmentMethodDescription?: Maybe<Scalars['String']>;
  TrackingNumber?: Maybe<Scalars['String']>;
  UserEventID?: Maybe<Scalars['Int']>;
  UserName?: Maybe<Scalars['String']>;
  WMSPriority?: Maybe<Scalars['Int']>;
  Zone?: Maybe<Scalars['Int']>;
};

export type ItnLifeCycle_Report = {
  __typename?: 'ITNLifeCycle_Report';
  CustomerNumber?: Maybe<Scalars['String']>;
  CustomerTier?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  OrderNOSI?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Boolean']>;
  ProductCode?: Maybe<Scalars['String']>;
  ProductTier?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Int']>;
  TrackingNumber?: Maybe<Scalars['String']>;
  WMSPriority?: Maybe<Scalars['Int']>;
  Zone?: Maybe<Scalars['Int']>;
  after_InventoryTrackingNumber?: Maybe<Scalars['String']>;
  agDone?: Maybe<Scalars['String']>;
  agDoneUser?: Maybe<Scalars['String']>;
  agInDone?: Maybe<Scalars['String']>;
  agOrderComplete?: Maybe<Scalars['String']>;
  agOutStart?: Maybe<Scalars['String']>;
  agRelocate?: Maybe<Scalars['String']>;
  agStart?: Maybe<Scalars['String']>;
  agStartUser?: Maybe<Scalars['String']>;
  dropoffCartSelected?: Maybe<Scalars['String']>;
  dropoffDone?: Maybe<Scalars['String']>;
  dropoffITNSkipped?: Maybe<Scalars['String']>;
  dropoffLine?: Maybe<Scalars['String']>;
  dropoffLocationSelected?: Maybe<Scalars['String']>;
  dropoffStart?: Maybe<Scalars['String']>;
  dropoffUser?: Maybe<Scalars['String']>;
  lineAllocation?: Maybe<Scalars['String']>;
  lineAllocationUser?: Maybe<Scalars['String']>;
  lineCancel?: Maybe<Scalars['String']>;
  orderCancel?: Maybe<Scalars['String']>;
  packDone?: Maybe<Scalars['String']>;
  packLine?: Maybe<Scalars['String']>;
  packLineUser?: Maybe<Scalars['String']>;
  packNewPackage?: Maybe<Scalars['String']>;
  packReject?: Maybe<Scalars['String']>;
  packStart?: Maybe<Scalars['String']>;
  packSupervisorCheck?: Maybe<Scalars['String']>;
  pickCartAssigned?: Maybe<Scalars['String']>;
  pickDone?: Maybe<Scalars['String']>;
  pickDoneUser?: Maybe<Scalars['String']>;
  pickITNNF?: Maybe<Scalars['String']>;
  pickITNPrint?: Maybe<Scalars['String']>;
  pickITNScan?: Maybe<Scalars['String']>;
  pickLabelCount?: Maybe<Scalars['String']>;
  pickLabelQuantity?: Maybe<Scalars['String']>;
  pickLocationScan?: Maybe<Scalars['String']>;
  pickOverPick?: Maybe<Scalars['String']>;
  pickQuantityEntered?: Maybe<Scalars['String']>;
  pickShortPick?: Maybe<Scalars['String']>;
  pickStart?: Maybe<Scalars['String']>;
  pickStartUser?: Maybe<Scalars['String']>;
  pickStatus15?: Maybe<Scalars['String']>;
  pickToteAssignment?: Maybe<Scalars['String']>;
  pickUserExit?: Maybe<Scalars['String']>;
  pullingCartSelected?: Maybe<Scalars['String']>;
  pullingDone?: Maybe<Scalars['String']>;
  pullingLocationSelected?: Maybe<Scalars['String']>;
  pullingNotFound?: Maybe<Scalars['String']>;
  pullingStart?: Maybe<Scalars['String']>;
  qcDone?: Maybe<Scalars['String']>;
  qcDoneUser?: Maybe<Scalars['String']>;
  qcHold?: Maybe<Scalars['String']>;
  qcOrderComplete?: Maybe<Scalars['String']>;
  qcStart?: Maybe<Scalars['String']>;
  qcStartUser?: Maybe<Scalars['String']>;
  qcStatus40?: Maybe<Scalars['String']>;
  qcStatus41?: Maybe<Scalars['String']>;
  releaseLine?: Maybe<Scalars['String']>;
  releaseOrder?: Maybe<Scalars['String']>;
  shipmentMethod?: Maybe<Scalars['String']>;
  shipmentMethodDescription?: Maybe<Scalars['String']>;
  shippingManifest?: Maybe<Scalars['String']>;
  splitDone?: Maybe<Scalars['String']>;
  splitDoneUser?: Maybe<Scalars['String']>;
};

export type ItnUserColumn = {
  __typename?: 'ITNUserColumn';
  LowLevelLimit?: Maybe<Scalars['Int']>;
  MediumLevelLimit?: Maybe<Scalars['Int']>;
  SelectedColumns?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type ItnUserColumns = {
  __typename?: 'ITNUserColumns';
  SelectedColumns?: Maybe<Scalars['String']>;
  UserID?: Maybe<Scalars['Int']>;
};

export type ItnUserLevelLimit = {
  __typename?: 'ITNUserLevelLimit';
  EventID?: Maybe<Scalars['Int']>;
  EventName?: Maybe<Scalars['String']>;
  LowLevelLimit?: Maybe<Scalars['Int']>;
  MediumLevelLimit?: Maybe<Scalars['Int']>;
  TemplateID?: Maybe<Scalars['Int']>;
  _id: Scalars['Int'];
};

export type ItnUserLevels = {
  __typename?: 'ITNUserLevels';
  LowLevelLimit?: Maybe<Scalars['Int']>;
  MediumLevelLimit?: Maybe<Scalars['Int']>;
  UserID?: Maybe<Scalars['Int']>;
};

export type ItnUserTemplate = {
  __typename?: 'ITNUserTemplate';
  DefaultPagination?: Maybe<Scalars['Int']>;
  DefaultTemplate?: Maybe<Scalars['Boolean']>;
  ITNLEVELLIMITs?: Maybe<Array<Maybe<ItnUserLevelLimit>>>;
  SelectedColumns?: Maybe<Scalars['String']>;
  TemplateName?: Maybe<Scalars['String']>;
  UserID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Inventory = {
  __typename?: 'Inventory';
  BinLocation?: Maybe<Scalars['String']>;
  BoundForAutostore?: Maybe<Scalars['Boolean']>;
  Container: Container;
  ContainerID: Scalars['Int'];
  Country?: Maybe<Country>;
  CountryID?: Maybe<Scalars['Int']>;
  DateCode?: Maybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
  InventoryTrackingNumber: Scalars['String'];
  Inventory_SuspectReasons?: Maybe<Array<Maybe<Inventory_SuspectReason>>>;
  LocatedInAutostore?: Maybe<Scalars['Boolean']>;
  NotFound: Scalars['Boolean'];
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  OriginalQuantity?: Maybe<Scalars['Float']>;
  ParentITN?: Maybe<Scalars['String']>;
  Product: Product;
  ProductID: Scalars['Int'];
  QuantityOnHand: Scalars['Float'];
  ROHS?: Maybe<Scalars['Boolean']>;
  Suspect: Scalars['Boolean'];
  _id: Scalars['Int'];
};

export type InventoryForMerp = {
  CreatingProgram: Scalars['String'];
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  PurchaseOrderLine?: InputMaybe<Scalars['String']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']>;
  User: Scalars['String'];
};

export type InventoryUpdateForMerp = {
  BinLocation?: InputMaybe<Scalars['String']>;
  ITN: Scalars['String'];
  LocatedInAutostore?: InputMaybe<Scalars['String']>;
  Suspect?: InputMaybe<Scalars['String']>;
  User: Scalars['String'];
};

export type Inventory_SuspectReason = {
  __typename?: 'Inventory_SuspectReason';
  Inventory: Inventory;
  InventoryID: Scalars['Int'];
  SuspectReason: SuspectReason;
  SuspectReasonID: Scalars['Int'];
  _id: Scalars['Int'];
};

export type Menu = {
  __typename?: 'Menu';
  ADGroupProtected?: Maybe<Scalars['Boolean']>;
  CoverSrc?: Maybe<Scalars['String']>;
  End?: Maybe<Scalars['String']>;
  Front?: Maybe<Scalars['String']>;
  Groups?: Maybe<Scalars['String']>;
  Highlight?: Maybe<Scalars['String']>;
  Level?: Maybe<Scalars['Int']>;
  Order?: Maybe<Scalars['Int']>;
  ParentID?: Maybe<Scalars['Int']>;
  Route?: Maybe<Scalars['String']>;
  RouteID?: Maybe<Scalars['Int']>;
  Title?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type MenuGroup = {
  __typename?: 'MenuGroup';
  ADGroup?: Maybe<Scalars['String']>;
  MenuID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  ITNSplitAndPrintLabels: Array<Maybe<Scalars['String']>>;
  changeItnListForMerp?: Maybe<Scalars['Boolean']>;
  changeQCLineInfo: Response;
  cleanContainerFromPrevOrder?: Maybe<Scalars['Boolean']>;
  clearITNUserDefaultTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  clearMerpTote: Response;
  clearSuspectInventory: Scalars['Boolean'];
  clearTimeoutAudits?: Maybe<Audit>;
  closeAudit?: Maybe<Audit>;
  closeAudits?: Maybe<Array<Maybe<Audit>>>;
  createContainer?: Maybe<Scalars['Boolean']>;
  createITN: Scalars['String'];
  createInventoryFromOMS?: Maybe<Scalars['Boolean']>;
  deleteAndInsertRouteTable: Scalars['Boolean'];
  deleteAudit?: Maybe<Audit>;
  deleteAutostoreOrderLineHistory?: Maybe<Autostoreorderline>;
  deleteAutostoreOrderLines?: Maybe<Autostoreorderline>;
  deleteContainerFromMerp?: Maybe<Scalars['Boolean']>;
  deleteCustomerFromMerp?: Maybe<Scalars['Boolean']>;
  deleteITNLevelLimit?: Maybe<Array<Maybe<ItnUserLevelLimit>>>;
  deleteITNUserTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  deleteInventoryFromMerp?: Maybe<Scalars['Boolean']>;
  deleteInventorySuspectReason: Scalars['Int'];
  deleteInventorySuspectReasonFromMerp?: Maybe<Scalars['Boolean']>;
  deleteOrder?: Maybe<Scalars['Boolean']>;
  deleteOrderLine?: Maybe<Scalars['Boolean']>;
  deleteOrderLineDetail?: Maybe<Scalars['Boolean']>;
  deleteOrderLineDetailFromMerp?: Maybe<Scalars['Boolean']>;
  deletePrinter?: Maybe<Printer>;
  deleteProductFromMerp?: Maybe<Scalars['Boolean']>;
  deletePurchaseOrderLineFromMerp?: Maybe<Scalars['Boolean']>;
  deleteReceipt?: Maybe<Array<Maybe<ReceiptDeleteResult>>>;
  deleteReceiptLD?: Maybe<Scalars['Boolean']>;
  deleteReceiptLine?: Maybe<Array<Maybe<ReceiptL>>>;
  deleteReceiptLineDetail?: Maybe<ReceiptLd>;
  deleteReceiptLineDetails?: Maybe<Array<Maybe<ReceiptLd>>>;
  deleteTableData?: Maybe<TableData>;
  deleteUserZone?: Maybe<Zone>;
  deleteValueMap?: Maybe<ValueMap>;
  deleteVendorFromMerp?: Maybe<Scalars['Boolean']>;
  findOrCreateOrder: Order;
  findOrCreateOrderLine: OrderLine;
  findOrCreateProduct: Product;
  findOrCreateReceiptLD: ReceiptLd;
  findOrCreateUserContainer?: Maybe<Container>;
  findOrCreateUserInfo?: Maybe<UserInfo>;
  generateReceiptForReceiving?: Maybe<Scalars['Int']>;
  globalASNRejection?: Maybe<Array<Maybe<Asnreplenishmentitem>>>;
  holdQCOrder: Response;
  insertAudits?: Maybe<Array<Maybe<Audit>>>;
  insertAutostoreASN?: Maybe<Autostoreasnheader>;
  insertAutostoreASNLine?: Maybe<Autostoreasnline>;
  insertAutostoreMessage?: Maybe<Autostoremessage>;
  insertAutostoreMessageAttempt?: Maybe<Autostoremessageattempt>;
  insertAutostoreOrderHeader?: Maybe<Autostoreorderheader>;
  insertAutostoreOrderLine?: Maybe<Autostoreorderline>;
  insertAutostoreOrderLineHistory?: Maybe<Array<Maybe<Autostoreorderline>>>;
  insertEventLogs: Scalars['Boolean'];
  insertITNLevelLimit?: Maybe<ItnUserLevelLimit>;
  insertITNUserColumns?: Maybe<ItnUserColumns>;
  insertITNUserLevels?: Maybe<ItnUserLevels>;
  insertITNUserTemplate?: Maybe<ItnUserTemplate>;
  insertInventorySuspectReason?: Maybe<Scalars['Boolean']>;
  insertInventorySuspectReasonFromMerp?: Maybe<Scalars['Boolean']>;
  insertPrinter?: Maybe<Printer>;
  insertReceipt?: Maybe<ReceiptH>;
  insertReceiptLine?: Maybe<Array<Maybe<ReceiptL>>>;
  insertReceiptLineDetail?: Maybe<ReceiptLd>;
  insertReceiptLineDetails?: Maybe<Array<Maybe<ReceiptLd>>>;
  insertSuspect?: Maybe<Audit>;
  insertSystemTrigger?: Maybe<Imtrigger>;
  insertTableData?: Maybe<Array<Maybe<TableData>>>;
  insertUserEventLogs?: Maybe<Array<Maybe<UserEventLog>>>;
  insertUserZone?: Maybe<Zone>;
  insertValueMap?: Maybe<ValueMap>;
  inventoryUpdate?: Maybe<Scalars['Boolean']>;
  itnChange?: Maybe<Scalars['Boolean']>;
  itnEvent?: Maybe<Itnlifecycle_Report>;
  itnLocationChange?: Maybe<Scalars['Boolean']>;
  orderEvent?: Maybe<Itnlifecycle_Report>;
  pickOrderForAgOut?: Maybe<OrderForAgOut>;
  printITNLabel: Response;
  processSystemTrigger?: Maybe<Scalars['Boolean']>;
  rollbackAutostoreOrderLines?: Maybe<Autostoreorderline>;
  suspectInventory: Scalars['Boolean'];
  updateASNInventory?: Maybe<Scalars['Boolean']>;
  updateASNReplenishmentItem?: Maybe<Asnreplenishmentitem>;
  updateAfterReceiving?: Maybe<Scalars['Boolean']>;
  updateAutostoreASN?: Maybe<Autostoreasnheader>;
  updateAutostoreMessage?: Maybe<Autostoremessage>;
  updateAutostoreProcess?: Maybe<Autostoreprocess>;
  updateContainer?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateContainerList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateForContainerFromMerp?: Maybe<Scalars['Boolean']>;
  updateForCustomerFromMerp?: Maybe<Scalars['Boolean']>;
  updateForInventoryFromMerp?: Maybe<Scalars['Boolean']>;
  updateForOrderLineDetailFromMerp?: Maybe<Scalars['Boolean']>;
  updateForProductFromMerp?: Maybe<Scalars['Boolean']>;
  updateForPurchaseOrderLineFromMerp?: Maybe<Scalars['Boolean']>;
  updateITNLifeCycleProcess?: Maybe<Itnlifecycleprocess>;
  updateITNUserColumns?: Maybe<ItnUserColumns>;
  updateITNUserLevels?: Maybe<ItnUserLevels>;
  updateITNUserTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  updateInventory?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateInventoryList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateLastUpdated?: Maybe<Audit>;
  updateMerpOrderStatus: Response;
  updateMerpQCBin: Response;
  updateMerpWMSLog: Response;
  updateNotFoundForStocking?: Maybe<Scalars['Boolean']>;
  updateOrder?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLastSync?: Maybe<UpdatedOrder>;
  updateOrderLine?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLineDetail?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLineDetailList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updatePickingCalendarSettings: Scalars['Boolean'];
  updatePrinter?: Maybe<Printer>;
  updateProduct?: Maybe<UpdatedProduct>;
  updateProductLastSync?: Maybe<UpdatedProduct>;
  updateReceipt?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateReceiptLD?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateReceiptLine?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateReceiptLineDetail?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateReceiptLsByID?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateSystemTrigger?: Maybe<Imtrigger>;
  updateTableData?: Maybe<TableData>;
  updateUserCart?: Maybe<Container>;
  updateUserCartForDropOff?: Maybe<Container>;
  updateUserInfo?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateValueMap?: Maybe<ValueMap>;
  updateVendorFromMerp?: Maybe<Scalars['Boolean']>;
};


export type MutationItnSplitAndPrintLabelsArgs = {
  DPI: Scalars['String'];
  ITN: Scalars['String'];
  ORIENTATION: Scalars['String'];
  PARTNUMBER: Scalars['String'];
  PRINTER: Scalars['String'];
  PRODUCTCODE: Scalars['String'];
  QuantityList: Array<InputMaybe<Scalars['Float']>>;
  User: Scalars['String'];
};


export type MutationChangeItnListForMerpArgs = {
  ITNList: Array<InputMaybe<InventoryUpdateForMerp>>;
};


export type MutationChangeQcLineInfoArgs = {
  CountMethod: Scalars['String'];
  CountryOfOrigin: Scalars['String'];
  DateCode: Scalars['String'];
  InternalTrackingNumber: Scalars['String'];
  ROHS: Scalars['String'];
};


export type MutationCleanContainerFromPrevOrderArgs = {
  ContainerID: Scalars['Int'];
  Inventory: UpdateInventory;
  OrderID: Scalars['Int'];
};


export type MutationClearItnUserDefaultTemplateArgs = {
  UserID: Scalars['Int'];
};


export type MutationClearMerpToteArgs = {
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
};


export type MutationClearSuspectInventoryArgs = {
  DistributionCenter: Scalars['String'];
  InventoryTrackingNumber: Scalars['String'];
};


export type MutationClearTimeoutAuditsArgs = {
  Seconds?: InputMaybe<Scalars['Int']>;
};


export type MutationCloseAuditArgs = {
  InventoryID?: InputMaybe<Scalars['Int']>;
  TypeID?: InputMaybe<Scalars['Int']>;
};


export type MutationCloseAuditsArgs = {
  ITN?: InputMaybe<Scalars['String']>;
};


export type MutationCreateContainerArgs = {
  BinLocation: Scalars['String'];
};


export type MutationCreateItnArgs = {
  LocationCode: Scalars['String'];
};


export type MutationCreateInventoryFromOmsArgs = {
  ITNList: Array<InputMaybe<ItnAndQuantity>>;
  Inventory: UpdateInventory;
  info: InventoryForMerp;
};


export type MutationDeleteAndInsertRouteTableArgs = {
  lpnList: Array<InputMaybe<Scalars['String']>>;
};


export type MutationDeleteAuditArgs = {
  InventoryID?: InputMaybe<Scalars['Int']>;
  TypeID?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteAutostoreOrderLineHistoryArgs = {
  AutostoreOrderHID?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteAutostoreOrderLinesArgs = {
  AutostoreOrderHID?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteContainerFromMerpArgs = {
  BinLocation: Scalars['String'];
  DistributionCenter: Scalars['String'];
};


export type MutationDeleteCustomerFromMerpArgs = {
  CustomerNumber: Scalars['String'];
};


export type MutationDeleteItnLevelLimitArgs = {
  TemplateID: Scalars['Int'];
};


export type MutationDeleteItnUserTemplateArgs = {
  _id: Scalars['Int'];
};


export type MutationDeleteInventoryFromMerpArgs = {
  BinLocation: Scalars['String'];
  DistributionCenter: Scalars['String'];
  ITN: Scalars['String'];
};


export type MutationDeleteInventorySuspectReasonArgs = {
  InventorySuspect?: InputMaybe<SearchInventorySuspectReason>;
};


export type MutationDeleteInventorySuspectReasonFromMerpArgs = {
  DC: Scalars['String'];
  ITN: Scalars['String'];
  ReasonID: Scalars['Int'];
};


export type MutationDeleteOrderArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteOrderLineArgs = {
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteOrderLineDetailArgs = {
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteOrderLineDetailFromMerpArgs = {
  BinLocation: Scalars['String'];
  DistributionCenter: Scalars['String'];
  InventoryTrackingNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderLineNumber: Scalars['Int'];
  OrderNumber: Scalars['String'];
};


export type MutationDeletePrinterArgs = {
  _id: Scalars['Int'];
};


export type MutationDeleteProductFromMerpArgs = {
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
};


export type MutationDeletePurchaseOrderLineFromMerpArgs = {
  LineNumber: Scalars['Int'];
  LocationCode: Scalars['String'];
  PurchaseOrderNumber: Scalars['String'];
};


export type MutationDeleteReceiptArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  ReceiptID?: InputMaybe<Scalars['Int']>;
  ReceiptLineDeleteEventID?: InputMaybe<Scalars['Int']>;
  ReceiptLineDetailDeleteEventID?: InputMaybe<Scalars['Int']>;
  Username?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteReceiptLdArgs = {
  PurchaseOrderLID?: InputMaybe<Scalars['Int']>;
  ReceiptLID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteReceiptLineArgs = {
  ReceiptLineID?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteReceiptLineDetailArgs = {
  ReceiptLDID: Scalars['Int'];
};


export type MutationDeleteReceiptLineDetailsArgs = {
  ReceiptLineID?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteTableDataArgs = {
  DeleteQuery?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteUserZoneArgs = {
  UserID?: InputMaybe<Scalars['Int']>;
  ZoneID?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteValueMapArgs = {
  _id: Scalars['Int'];
};


export type MutationDeleteVendorFromMerpArgs = {
  VendorNumber: Scalars['String'];
};


export type MutationFindOrCreateOrderArgs = {
  Order: InsertOrder;
};


export type MutationFindOrCreateOrderLineArgs = {
  OrderLine: InsertOrderLine;
};


export type MutationFindOrCreateProductArgs = {
  Product: InsertProduct;
};


export type MutationFindOrCreateReceiptLdArgs = {
  ReceiptLD: InsertReceiptLd;
};


export type MutationFindOrCreateUserContainerArgs = {
  Container: InsertContainer;
};


export type MutationFindOrCreateUserInfoArgs = {
  UserInfo: InsertUserInfo;
};


export type MutationGenerateReceiptForReceivingArgs = {
  LineNumber: Scalars['Int'];
  OverReceipt?: InputMaybe<Scalars['Boolean']>;
  PurchaseOrderNumber: Scalars['String'];
  Quantity: Scalars['Float'];
};


export type MutationGlobalAsnRejectionArgs = {
  InventoryID?: InputMaybe<Scalars['Int']>;
};


export type MutationHoldQcOrderArgs = {
  InternalTrackingNumber: Scalars['String'];
  Station: Scalars['String'];
  Status: Scalars['String'];
};


export type MutationInsertAuditsArgs = {
  Audits?: InputMaybe<Array<InputMaybe<InputAudit>>>;
};


export type MutationInsertAutostoreAsnArgs = {
  ASN?: InputMaybe<AutostoreAsnHeader>;
};


export type MutationInsertAutostoreAsnLineArgs = {
  ASNLine?: InputMaybe<AutostoreAsnLine>;
};


export type MutationInsertAutostoreMessageArgs = {
  AutostoreMessage?: InputMaybe<AutostoreMessage>;
};


export type MutationInsertAutostoreMessageAttemptArgs = {
  AutostoreMessageAttempt?: InputMaybe<AutostoreMessageAttempt>;
};


export type MutationInsertAutostoreOrderHeaderArgs = {
  OrderHeader?: InputMaybe<AutostoreOrderHeader>;
};


export type MutationInsertAutostoreOrderLineArgs = {
  OrderLine?: InputMaybe<AutostoreOrderLine>;
};


export type MutationInsertAutostoreOrderLineHistoryArgs = {
  AutostoreOrderHID?: InputMaybe<Scalars['Int']>;
};


export type MutationInsertEventLogsArgs = {
  logs: Array<InputMaybe<InsertEventLog>>;
};


export type MutationInsertItnLevelLimitArgs = {
  EventID?: InputMaybe<Scalars['Int']>;
  EventName?: InputMaybe<Scalars['String']>;
  LowLevelLimit?: InputMaybe<Scalars['Int']>;
  MediumLevelLimit?: InputMaybe<Scalars['Int']>;
  TemplateID?: InputMaybe<Scalars['Int']>;
};


export type MutationInsertItnUserColumnsArgs = {
  ITNUserColumns: Array<InputMaybe<InsertItnUserColumnsInfo>>;
};


export type MutationInsertItnUserLevelsArgs = {
  ITNUserLevels: Array<InputMaybe<InsertItnUserLevelsInfo>>;
};


export type MutationInsertItnUserTemplateArgs = {
  DefaultTemplate?: InputMaybe<Scalars['Boolean']>;
  SelectedColumns?: InputMaybe<Scalars['String']>;
  TemplateName?: InputMaybe<Scalars['String']>;
  UserID?: InputMaybe<Scalars['Int']>;
};


export type MutationInsertInventorySuspectReasonArgs = {
  linkList?: InputMaybe<Array<InputMaybe<InsertInventorySuspectReason>>>;
};


export type MutationInsertInventorySuspectReasonFromMerpArgs = {
  DC: Scalars['String'];
  ITN: Scalars['String'];
  ReasonID: Scalars['Int'];
};


export type MutationInsertPrinterArgs = {
  Active?: InputMaybe<Scalars['Boolean']>;
  DPI?: InputMaybe<Scalars['Int']>;
  Description?: InputMaybe<Scalars['String']>;
  Name?: InputMaybe<Scalars['String']>;
  Orientation?: InputMaybe<Scalars['String']>;
  StationName?: InputMaybe<Scalars['String']>;
};


export type MutationInsertReceiptArgs = {
  Receipt?: InputMaybe<InsertReceiptH>;
};


export type MutationInsertReceiptLineArgs = {
  CountryID?: InputMaybe<Scalars['Int']>;
  DateCode?: InputMaybe<Scalars['String']>;
  ExpectedQuantity: Scalars['Int'];
  ProductID: Scalars['Int'];
  ROHS?: InputMaybe<Scalars['Boolean']>;
  ReceiptHID: Scalars['Int'];
};


export type MutationInsertReceiptLineDetailArgs = {
  ReceiptLineDetail?: InputMaybe<InsertReceiptLd>;
};


export type MutationInsertReceiptLineDetailsArgs = {
  ReceiptLineDetails?: InputMaybe<Array<InputMaybe<InsertReceiptLd>>>;
};


export type MutationInsertSuspectArgs = {
  Suspect?: InputMaybe<Array<InputMaybe<InputSuspect>>>;
};


export type MutationInsertSystemTriggerArgs = {
  AuditTypes?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  Trigger?: InputMaybe<ImTrigger>;
};


export type MutationInsertTableDataArgs = {
  InsertQuery?: InputMaybe<Scalars['String']>;
};


export type MutationInsertUserEventLogsArgs = {
  log: Array<InputMaybe<InsertUserEventLog>>;
};


export type MutationInsertUserZoneArgs = {
  UserID?: InputMaybe<Scalars['Int']>;
  ZoneID?: InputMaybe<Scalars['Int']>;
};


export type MutationInsertValueMapArgs = {
  SourceColumnName?: InputMaybe<Scalars['String']>;
  SourceSystemName?: InputMaybe<Scalars['String']>;
  SourceTableName?: InputMaybe<Scalars['String']>;
  SourceValue?: InputMaybe<Scalars['String']>;
  TargetColumnName?: InputMaybe<Scalars['String']>;
  TargetSystemName?: InputMaybe<Scalars['String']>;
  TargetTableName?: InputMaybe<Scalars['String']>;
  TargetValue?: InputMaybe<Scalars['String']>;
};


export type MutationInventoryUpdateArgs = {
  AdjustmentReason?: InputMaybe<Scalars['String']>;
  BinLocation?: InputMaybe<Scalars['String']>;
  CountryOfOrigin?: InputMaybe<Scalars['String']>;
  DateCode?: InputMaybe<Scalars['String']>;
  ITN: Scalars['String'];
  QuantityOnHand?: InputMaybe<Scalars['String']>;
  ROHSFlag?: InputMaybe<Scalars['String']>;
  Suspect?: InputMaybe<Scalars['String']>;
  User: Scalars['String'];
};


export type MutationItnChangeArgs = {
  BinLocation: Scalars['String'];
  BoundForAutostore?: InputMaybe<Scalars['String']>;
  ITN: Scalars['String'];
  Suspect?: InputMaybe<Scalars['String']>;
  User: Scalars['String'];
};


export type MutationItnEventArgs = {
  After?: InputMaybe<Scalars['Boolean']>;
  EventID?: InputMaybe<Scalars['Int']>;
  ITNLC?: InputMaybe<ItnLifeCycle>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  LogID?: InputMaybe<Scalars['Int']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
};


export type MutationItnLocationChangeArgs = {
  BinLocation: Scalars['String'];
  ITN: Scalars['String'];
  User: Scalars['String'];
};


export type MutationOrderEventArgs = {
  LogID?: InputMaybe<Scalars['Int']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  ORDERLC?: InputMaybe<ItnLifeCycle>;
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
};


export type MutationPrintItnLabelArgs = {
  InternalTrackingNumber: Scalars['String'];
  Station: Scalars['String'];
};


export type MutationProcessSystemTriggerArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  ITN?: InputMaybe<Scalars['String']>;
  Source?: InputMaybe<Scalars['String']>;
  TriggerName?: InputMaybe<Scalars['String']>;
  Username?: InputMaybe<Scalars['String']>;
};


export type MutationRollbackAutostoreOrderLinesArgs = {
  AutostoreOrderHID?: InputMaybe<Scalars['Int']>;
};


export type MutationSuspectInventoryArgs = {
  DistributionCenter: Scalars['String'];
  InventoryTrackingNumber: Scalars['String'];
  reasonIDList: Array<InputMaybe<Scalars['Int']>>;
};


export type MutationUpdateAsnInventoryArgs = {
  BoundForAutostore?: InputMaybe<Scalars['Boolean']>;
  ContainerID?: InputMaybe<Scalars['Int']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  Suspect?: InputMaybe<Scalars['Boolean']>;
  SuspectReasonID?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateAsnReplenishmentItemArgs = {
  ReplenishmentItem?: InputMaybe<AsnReplenishmentItem>;
};


export type MutationUpdateAfterReceivingArgs = {
  ITNList?: InputMaybe<Array<InputMaybe<ItnAndQuantity>>>;
  Inventory: UpdateInventory;
  ReceiptLID: Scalars['Int'];
};


export type MutationUpdateAutostoreAsnArgs = {
  ASN?: InputMaybe<AutostoreAsnHeader>;
  ASNID?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateAutostoreMessageArgs = {
  AutostoreMessage?: InputMaybe<AutostoreMessage>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateAutostoreProcessArgs = {
  AutostoreProcess?: InputMaybe<AutostoreProcess>;
  ID?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateContainerArgs = {
  Barcode?: InputMaybe<Scalars['String']>;
  Container: UpdateContainer;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateContainerListArgs = {
  BarcodeList?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  Container: UpdateContainer;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  idList?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


export type MutationUpdateForContainerFromMerpArgs = {
  BinLocation: Scalars['String'];
  DistributionCenter: Scalars['String'];
  Type: Scalars['String'];
  Velocity?: InputMaybe<Scalars['String']>;
  Zone?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateForCustomerFromMerpArgs = {
  CustomerNumber: Scalars['String'];
  CustomerTier?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateForInventoryFromMerpArgs = {
  Autostore?: InputMaybe<Scalars['Boolean']>;
  BinLocation: Scalars['String'];
  BoundForAutostore?: InputMaybe<Scalars['Boolean']>;
  CountryOfOrigin?: InputMaybe<Scalars['String']>;
  DateCode?: InputMaybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
  ITN: Scalars['String'];
  LocatedInAutostore?: InputMaybe<Scalars['Boolean']>;
  MICPartNumber?: InputMaybe<Scalars['String']>;
  OriginalQuantity?: InputMaybe<Scalars['Float']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  ProductTier?: InputMaybe<Scalars['String']>;
  QuantityOnHand: Scalars['Float'];
  ROHS?: InputMaybe<Scalars['Boolean']>;
  Suspect?: InputMaybe<Scalars['Boolean']>;
  UOM?: InputMaybe<Scalars['String']>;
  Velocity?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateForOrderLineDetailFromMerpArgs = {
  BinLocation: Scalars['String'];
  BranchID?: InputMaybe<Scalars['String']>;
  CustomerNumber?: InputMaybe<Scalars['String']>;
  CustomerTier?: InputMaybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
  ExpectedShipDate?: InputMaybe<Scalars['String']>;
  ITN: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderLineNumber: Scalars['Int'];
  OrderLineQuantity?: InputMaybe<Scalars['Float']>;
  OrderNumber: Scalars['String'];
  OrderStatusCode?: InputMaybe<Scalars['String']>;
  OrderType?: InputMaybe<Scalars['String']>;
  PartNumber?: InputMaybe<Scalars['String']>;
  ProductCode?: InputMaybe<Scalars['String']>;
  ProductTier?: InputMaybe<Scalars['String']>;
  ShipmentMethodID?: InputMaybe<Scalars['String']>;
  StatusID: Scalars['Int'];
  WMSPriority: Scalars['Int'];
  detailQuantity: Scalars['Float'];
};


export type MutationUpdateForProductFromMerpArgs = {
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  ProductTier?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateForPurchaseOrderLineFromMerpArgs = {
  DueDate?: InputMaybe<Scalars['String']>;
  LineNumber: Scalars['Int'];
  LocationCode: Scalars['String'];
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  ProductTier?: InputMaybe<Scalars['String']>;
  PurchaseOrderNumber: Scalars['String'];
  QuantityOnOrder?: InputMaybe<Scalars['Float']>;
  QuantityReceived?: InputMaybe<Scalars['Float']>;
  UnitOfMeasure?: InputMaybe<Scalars['String']>;
  VendorName: Scalars['String'];
  VendorNumber: Scalars['String'];
};


export type MutationUpdateItnLifeCycleProcessArgs = {
  _id?: InputMaybe<Scalars['Int']>;
  itnLCProcess?: InputMaybe<ItnLifecycleProcess>;
};


export type MutationUpdateItnUserColumnsArgs = {
  ITNUserColumns: Array<InputMaybe<UpdateItnUserColumnsInfo>>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateItnUserLevelsArgs = {
  ITNUserLevels: Array<InputMaybe<UpdateItnUserLevelsInfo>>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateItnUserTemplateArgs = {
  DefaultPagination?: InputMaybe<Scalars['Int']>;
  DefaultTemplate?: InputMaybe<Scalars['Boolean']>;
  SelectedColumns?: InputMaybe<Scalars['String']>;
  TemplateName?: InputMaybe<Scalars['String']>;
  _id: Scalars['Int'];
};


export type MutationUpdateInventoryArgs = {
  ContainerID?: InputMaybe<Scalars['Int']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  Inventory: UpdateInventory;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateInventoryListArgs = {
  ContainerIDList?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  ITNList?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  Inventory: UpdateInventory;
  idList?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


export type MutationUpdateLastUpdatedArgs = {
  InventoryID?: InputMaybe<Scalars['Int']>;
  LastUpdated?: InputMaybe<Scalars['String']>;
  TypeID?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateMerpOrderStatusArgs = {
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
  Status: Scalars['String'];
  UserOrStatus?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateMerpQcBinArgs = {
  ITN: Scalars['String'];
};


export type MutationUpdateMerpWmsLogArgs = {
  Action: Scalars['String'];
  ActionType: Scalars['String'];
  FileKeyList: Array<Scalars['String']>;
  LocationCode: Scalars['String'];
};


export type MutationUpdateNotFoundForStockingArgs = {
  ITNList: Array<InputMaybe<Scalars['String']>>;
};


export type MutationUpdateOrderArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  Order: UpdateOrder;
  OrderNumber?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateOrderLastSyncArgs = {
  Order?: InputMaybe<UpdateAutostoreOrder>;
};


export type MutationUpdateOrderLineArgs = {
  OrderLine: UpdateOrderLine;
};


export type MutationUpdateOrderLineDetailArgs = {
  InventoryID?: InputMaybe<Scalars['Int']>;
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineDetail: UpdateOrderLineDetail;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateOrderLineDetailListArgs = {
  InventoryIDList?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  OrderLineDetail: UpdateOrderLineDetail;
  idList?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


export type MutationUpdatePickingCalendarSettingsArgs = {
  events?: InputMaybe<Scalars['String']>;
};


export type MutationUpdatePrinterArgs = {
  Active?: InputMaybe<Scalars['Boolean']>;
  DPI?: InputMaybe<Scalars['Int']>;
  Description?: InputMaybe<Scalars['String']>;
  Name?: InputMaybe<Scalars['String']>;
  Orientation?: InputMaybe<Scalars['String']>;
  StationName?: InputMaybe<Scalars['String']>;
  _id: Scalars['Int'];
};


export type MutationUpdateProductArgs = {
  Product: UpdateProduct;
};


export type MutationUpdateProductLastSyncArgs = {
  Product?: InputMaybe<UpdateProduct>;
};


export type MutationUpdateReceiptArgs = {
  ExpectedArrivalDate?: InputMaybe<Scalars['String']>;
  SourceType?: InputMaybe<Scalars['String']>;
  VendorID: Scalars['Int'];
  _id: Scalars['Int'];
};


export type MutationUpdateReceiptLdArgs = {
  ReceiptLD: UpdateReceiptLd;
  ReceiptLID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateReceiptLineArgs = {
  CountryID?: InputMaybe<Scalars['Int']>;
  DateCode?: InputMaybe<Scalars['String']>;
  ExpectedQuantity: Scalars['Int'];
  ProductID: Scalars['Int'];
  ROHS?: InputMaybe<Scalars['Boolean']>;
  ReceiptLID: Scalars['Int'];
};


export type MutationUpdateReceiptLineDetailArgs = {
  ExpectedQuantity: Scalars['Int'];
  PurchaseOrderLID: Scalars['Int'];
  ReceiptLDID: Scalars['Int'];
};


export type MutationUpdateReceiptLsByIdArgs = {
  ReceiptL: UpdateReceiptL;
  idList: Array<InputMaybe<Scalars['Int']>>;
};


export type MutationUpdateSystemTriggerArgs = {
  AuditTypes?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  Trigger?: InputMaybe<ImTrigger>;
  TriggerID?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateTableDataArgs = {
  UpdateQuery?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateUserCartArgs = {
  Container: SearchContainer;
  UserID: Scalars['Int'];
};


export type MutationUpdateUserCartForDropOffArgs = {
  Container: SearchContainer;
  UserID: Scalars['Int'];
};


export type MutationUpdateUserInfoArgs = {
  Name?: InputMaybe<Scalars['String']>;
  UserInfo: UpdateUserInfo;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateValueMapArgs = {
  SourceColumnName?: InputMaybe<Scalars['String']>;
  SourceSystemName?: InputMaybe<Scalars['String']>;
  SourceTableName?: InputMaybe<Scalars['String']>;
  SourceValue?: InputMaybe<Scalars['String']>;
  TargetColumnName?: InputMaybe<Scalars['String']>;
  TargetSystemName?: InputMaybe<Scalars['String']>;
  TargetTableName?: InputMaybe<Scalars['String']>;
  TargetValue?: InputMaybe<Scalars['String']>;
  _id: Scalars['Int'];
};


export type MutationUpdateVendorFromMerpArgs = {
  VendorName: Scalars['String'];
  VendorNumber: Scalars['String'];
};

export type Omsconfig = {
  __typename?: 'OMSCONFIG';
  Name?: Maybe<Scalars['String']>;
  Value?: Maybe<Scalars['String']>;
};

export type Order = {
  __typename?: 'Order';
  BranchID?: Maybe<Scalars['String']>;
  Customer?: Maybe<Customer>;
  CustomerID?: Maybe<Scalars['Int']>;
  DistributionCenter: Scalars['String'];
  ExpectedShipDate?: Maybe<Scalars['String']>;
  LastUpdated?: Maybe<Scalars['String']>;
  NOSINumber: Scalars['String'];
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  ORDERLINEs?: Maybe<Array<Maybe<OrderLine>>>;
  OrderNumber: Scalars['String'];
  OrderStatusCode?: Maybe<Scalars['String']>;
  OrderType?: Maybe<Scalars['String']>;
  ShipmentMethod?: Maybe<ShipmentMethod>;
  ShipmentMethodID?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
  isSelected: Scalars['Int'];
};

export type OrderForAgOut = {
  __typename?: 'OrderForAgOut';
  NOSINumber: Scalars['String'];
  OrderID: Scalars['Int'];
  OrderNumber: Scalars['String'];
};

export type OrderLine = {
  __typename?: 'OrderLine';
  LastUpdated?: Maybe<Scalars['String']>;
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  Order: Order;
  OrderID: Scalars['Int'];
  OrderLineNumber: Scalars['Int'];
  Product: Product;
  ProductID: Scalars['Int'];
  Quantity?: Maybe<Scalars['Float']>;
  _id: Scalars['Int'];
};

export type OrderLineDetail = {
  __typename?: 'OrderLineDetail';
  BinLocation?: Maybe<Scalars['String']>;
  Inventory?: Maybe<Inventory>;
  InventoryID?: Maybe<Scalars['Int']>;
  LastUpdated?: Maybe<Scalars['String']>;
  Order: Order;
  OrderID: Scalars['Int'];
  OrderLine: OrderLine;
  OrderLineID: Scalars['Int'];
  Quantity: Scalars['Float'];
  Status: OrderStatus;
  StatusID: Scalars['Int'];
  WMSPriority: Scalars['Int'];
  _id: Scalars['Int'];
};

export type OrderStatus = {
  __typename?: 'OrderStatus';
  Name: Scalars['String'];
  _id: Scalars['Int'];
};

export type Partcode = {
  __typename?: 'PARTCODE';
  PRC?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type PoLine = {
  __typename?: 'POLine';
  DueDate?: Maybe<Scalars['String']>;
  MaxQuantity?: Maybe<Scalars['Int']>;
  PurchaseOrderNumberLine?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type Printer = {
  __typename?: 'Printer';
  Active?: Maybe<Scalars['Boolean']>;
  DPI?: Maybe<Scalars['Int']>;
  Description?: Maybe<Scalars['String']>;
  Name: Scalars['String'];
  Orientation?: Maybe<Scalars['String']>;
  StationName?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type Product = {
  __typename?: 'Product';
  Autostore?: Maybe<Scalars['Boolean']>;
  DCPRODUCTs?: Maybe<Array<Maybe<DcProduct>>>;
  Description?: Maybe<Scalars['String']>;
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
  LastAutostoreSync?: Maybe<Scalars['String']>;
  LastUpdated?: Maybe<Scalars['String']>;
  MICPartNumber?: Maybe<Scalars['String']>;
  ORDERLINEs?: Maybe<Array<Maybe<OrderLine>>>;
  PURCHASEORDERLs?: Maybe<Array<Maybe<PurchaseOrderL>>>;
  PartNumber: Scalars['String'];
  ProductCode: ProductCode;
  ProductCodeID: Scalars['Int'];
  ProductTier?: Maybe<Scalars['String']>;
  ProductType: ProductType;
  ProductTypeID: Scalars['Int'];
  RECEIPTLs?: Maybe<Array<Maybe<ReceiptL>>>;
  UOM?: Maybe<Scalars['String']>;
  Velocity?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type ProductCode = {
  __typename?: 'ProductCode';
  PRODUCTs?: Maybe<Array<Maybe<Product>>>;
  ProductCodeNumber: Scalars['String'];
  _id: Scalars['Int'];
};

export type ProductType = {
  __typename?: 'ProductType';
  Description?: Maybe<Scalars['String']>;
  PRODUCTs?: Maybe<Array<Maybe<Product>>>;
  ProductType?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type ProdunctInfoFromMerp = {
  __typename?: 'ProdunctInfoFromMerp';
  ExternalKey?: Maybe<Scalars['String']>;
  HazardMaterialLevel?: Maybe<Scalars['String']>;
  MICPartNumber?: Maybe<Scalars['String']>;
  UnitOfMeasure?: Maybe<Scalars['String']>;
};

export type PurchaseOrderH = {
  __typename?: 'PurchaseOrderH';
  DistributionCenter: Scalars['String'];
  PURCHASEORDERLs?: Maybe<Array<Maybe<PurchaseOrderL>>>;
  PurchaseOrderNumber: Scalars['String'];
  Vendor: Vendor;
  VendorID: Scalars['Int'];
  _id: Scalars['Int'];
};

export type PurchaseOrderL = {
  __typename?: 'PurchaseOrderL';
  DueDate?: Maybe<Scalars['String']>;
  LineNumber: Scalars['Int'];
  Product: Product;
  ProductID: Scalars['Int'];
  PurchaseOrderH: PurchaseOrderH;
  PurchaseOrderHID: Scalars['Int'];
  QuantityOnOrder?: Maybe<Scalars['Float']>;
  QuantityReceived?: Maybe<Scalars['Float']>;
  RECEIPTLDs?: Maybe<Array<Maybe<ReceiptLd>>>;
  UnitOfMeasure?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  countOrderItns: Scalars['Int'];
  fetchASNRejectionReasons?: Maybe<Array<Maybe<Asnrejectionreason>>>;
  fetchAllCountry?: Maybe<Array<Maybe<Country>>>;
  fetchAuditTypes?: Maybe<Array<Maybe<Audittype>>>;
  fetchAutostoreMessage?: Maybe<Array<Maybe<Autostoremessage>>>;
  fetchAutostoreMessages?: Maybe<Array<Maybe<Autostoremessage>>>;
  fetchAutostoreOrderMessages?: Maybe<Array<Maybe<Autostoremessage>>>;
  fetchCommonvariablesForLogs?: Maybe<Array<Maybe<Scalars['String']>>>;
  fetchConfigValue?: Maybe<Omsconfig>;
  fetchDataColumnList?: Maybe<Array<Maybe<DataColumn>>>;
  fetchDataTableList?: Maybe<Array<Maybe<DataTable>>>;
  fetchDistributionCenterList?: Maybe<Array<Maybe<DistributionCenter>>>;
  fetchEntityList?: Maybe<Array<Maybe<Entity>>>;
  fetchHoldOnCounter?: Maybe<Array<Maybe<HoldOnCounter>>>;
  fetchITNLifecycle?: Maybe<Array<Maybe<ItnLifeCycle_Report>>>;
  fetchITNLifecycleDrillDown?: Maybe<Array<Maybe<ItnLifeCycleDrillDown>>>;
  fetchITNLifecycleDrillDownRows?: Maybe<Array<Maybe<ItnLifeCycle_Report>>>;
  fetchITNUserColumns?: Maybe<Array<Maybe<ItnUserColumn>>>;
  fetchMenuList?: Maybe<Array<Maybe<Menu>>>;
  fetchOrderLineDetailforWMSCount?: Maybe<Array<Maybe<OrderLineDetail>>>;
  fetchOrderLineMessage?: Maybe<GlobalMessage>;
  fetchOrderTasktime?: Maybe<Array<Maybe<OrderTasktime>>>;
  fetchOrderView?: Maybe<Array<Maybe<OrderView>>>;
  fetchPartMessage?: Maybe<GlobalMessage>;
  fetchPickingCalendarSettings?: Maybe<Scalars['String']>;
  fetchPrinterList?: Maybe<Array<Maybe<Printer>>>;
  fetchPrinterStation: Scalars['String'];
  fetchProductInfoFromMerp?: Maybe<Array<Maybe<ProdunctInfoFromMerp>>>;
  fetchProductMICFromMerp?: Maybe<Scalars['String']>;
  fetchProductTypes?: Maybe<Array<Maybe<ProductType>>>;
  fetchReceiptLines?: Maybe<Array<Maybe<ReceiptL>>>;
  fetchSuggetionLocationForSorting?: Maybe<Array<Maybe<SuggetionLocation>>>;
  fetchSystemAudits?: Maybe<Array<Maybe<Imtrigger>>>;
  fetchTableData?: Maybe<Array<Maybe<TableData>>>;
  fetchTaskCounter?: Maybe<Array<Maybe<TaskCounter>>>;
  fetchUserEventLogs?: Maybe<Array<Maybe<UserEventLog>>>;
  fetchUserList?: Maybe<Array<Maybe<User>>>;
  fetchUsersForZone?: Maybe<Array<Maybe<User>>>;
  fetchValueMapView?: Maybe<Array<Maybe<ValueMap>>>;
  fetchVendorList?: Maybe<Array<Maybe<Vendor>>>;
  fetchWMSStatusView?: Maybe<Array<Maybe<WmsStatusView>>>;
  fetchZoneList?: Maybe<Array<Maybe<Zone>>>;
  fetchZonesForUser?: Maybe<Array<Maybe<Zone>>>;
  findASN?: Maybe<Autostoreasnheader>;
  findASNByITN?: Maybe<Array<Maybe<Autostoreasnheader>>>;
  findASNReplenishmentInventory?: Maybe<Array<Maybe<Asnreplenishmentitem>>>;
  findContainer?: Maybe<Container>;
  findContainers?: Maybe<Array<Maybe<Container>>>;
  findEventLogs?: Maybe<Array<Maybe<EventLog>>>;
  findEventType?: Maybe<Array<Maybe<EventType>>>;
  findIMInventories?: Maybe<Array<Maybe<Auditinventory>>>;
  findIMPRCInventories?: Maybe<Array<Maybe<Inventory>>>;
  findIMPRCPartNumberInventories?: Maybe<Array<Maybe<Inventory>>>;
  findITNColumns?: Maybe<Array<Maybe<ItnColumn>>>;
  findITNTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  findITNTemplates?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  findInventory?: Maybe<Inventory>;
  findInventoryByUser?: Maybe<Array<Maybe<Inventory>>>;
  findInventorys?: Maybe<Array<Maybe<Inventory>>>;
  findLocalErrorLogs?: Maybe<Array<Maybe<Scalars['String']>>>;
  findNextAudit?: Maybe<Array<Maybe<Audit>>>;
  findNextITNForPulling?: Maybe<ItnInfoforPulling>;
  findOrder?: Maybe<Order>;
  findOrderByStatus?: Maybe<Array<Maybe<Order>>>;
  findOrderLine?: Maybe<OrderLine>;
  findOrderLineDetail?: Maybe<OrderLineDetail>;
  findOrderLineDetails?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findOrderLines?: Maybe<Array<Maybe<OrderLine>>>;
  findOrders?: Maybe<Array<Maybe<Order>>>;
  findPOLine?: Maybe<Array<Maybe<PoLine>>>;
  findPOLines?: Maybe<Array<Maybe<PoLine>>>;
  findPOs?: Maybe<Array<Maybe<PurchaseOrderH>>>;
  findPart?: Maybe<Product>;
  findPartCodes?: Maybe<Array<Maybe<Partcode>>>;
  findPrinters?: Maybe<Array<Maybe<Printer>>>;
  findProduct?: Maybe<Product>;
  findProductCode?: Maybe<ProductCode>;
  findProducts?: Maybe<Array<Maybe<Product>>>;
  findPurchaseOrderH?: Maybe<PurchaseOrderH>;
  findPurchaseOrderHs?: Maybe<Array<Maybe<PurchaseOrderH>>>;
  findPurchaseOrderL?: Maybe<PurchaseOrderL>;
  findPurchaseOrderLs?: Maybe<Array<Maybe<PurchaseOrderL>>>;
  findReceipt?: Maybe<ReceiptH>;
  findReceiptH?: Maybe<ReceiptH>;
  findReceiptHs?: Maybe<Array<Maybe<ReceiptH>>>;
  findReceiptInfoByIdAndStatus?: Maybe<ReceiptH>;
  findReceiptInfoByPartorVendor?: Maybe<Array<Maybe<ReceiptHInfo>>>;
  findReceiptL?: Maybe<ReceiptL>;
  findReceiptLD?: Maybe<ReceiptLd>;
  findReceiptLDs?: Maybe<Array<Maybe<ReceiptLd>>>;
  findReceiptLine?: Maybe<ReceiptL>;
  findReceiptLs?: Maybe<Array<Maybe<ReceiptL>>>;
  findReceipts?: Maybe<Array<Maybe<ReceiptH>>>;
  findRoutes?: Maybe<Array<Route>>;
  findUpdatedOrderLines?: Maybe<Array<Maybe<UpdatedOrderLine>>>;
  findUpdatedOrders?: Maybe<Array<Maybe<UpdatedOrder>>>;
  findUpdatedProducts?: Maybe<Array<Maybe<UpdatedProduct>>>;
  findUser?: Maybe<User>;
  findUserEventLogs?: Maybe<Array<Maybe<UserEventLog>>>;
  findUserEvents?: Maybe<Array<Maybe<UserEvent>>>;
  findUserInfo?: Maybe<UserInfo>;
  findUserInfos?: Maybe<Array<Maybe<UserInfo>>>;
  findUsers?: Maybe<Array<Maybe<User>>>;
  findVendor?: Maybe<Vendor>;
  findVendorByPO?: Maybe<Vendor>;
  getIMAdjustReasons?: Maybe<Array<Maybe<Imadjustreason>>>;
  getNextSubAudit?: Maybe<Array<Maybe<Audit>>>;
  getSearchLocation?: Maybe<Array<Maybe<Searchlocation>>>;
  getSearchLocations?: Maybe<Array<Maybe<Searchlocation>>>;
  printQRCodeLabel?: Maybe<Scalars['Boolean']>;
  printReceivingITNLabel?: Maybe<Scalars['Boolean']>;
  printTextLabel?: Maybe<Scalars['Boolean']>;
  validateAssignment?: Maybe<Scalars['Boolean']>;
  validateFilter?: Maybe<Scalars['Boolean']>;
  verifyASNLocation?: Maybe<Array<Maybe<Inventory>>>;
  verifyASNLocationNotInProcess?: Maybe<Array<Maybe<Autostoreasnheader>>>;
  verifyASNLocationStatus?: Maybe<Array<Maybe<Autostoreasnheader>>>;
};


export type QueryCountOrderItnsArgs = {
  LocationCode: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
};


export type QueryFetchAutostoreMessageArgs = {
  Message?: InputMaybe<AutostoreMessage>;
};


export type QueryFetchAutostoreMessagesArgs = {
  MaxRetries?: InputMaybe<Scalars['Int']>;
};


export type QueryFetchAutostoreOrderMessagesArgs = {
  MaxRetries?: InputMaybe<Scalars['Int']>;
};


export type QueryFetchCommonvariablesForLogsArgs = {
  events?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};


export type QueryFetchConfigValueArgs = {
  Name?: InputMaybe<Scalars['String']>;
};


export type QueryFetchDataColumnListArgs = {
  TABLE_NAME?: InputMaybe<Scalars['String']>;
};


export type QueryFetchEntityListArgs = {
  type?: InputMaybe<Scalars['String']>;
};


export type QueryFetchHoldOnCounterArgs = {
  endDate: Scalars['String'];
  startDate: Scalars['String'];
};


export type QueryFetchItnLifecycleArgs = {
  endDate: Scalars['String'];
  startDate: Scalars['String'];
};


export type QueryFetchItnLifecycleDrillDownArgs = {
  inventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  nosiNumber?: InputMaybe<Scalars['String']>;
  orderLineNumber?: InputMaybe<Scalars['Int']>;
  orderNumber: Scalars['String'];
};


export type QueryFetchItnLifecycleDrillDownRowsArgs = {
  inventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  nosiNumber?: InputMaybe<Scalars['String']>;
  orderLineNumber?: InputMaybe<Scalars['Int']>;
  orderNumber?: InputMaybe<Scalars['String']>;
};


export type QueryFetchItnUserColumnsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryFetchMenuListArgs = {
  pageName?: InputMaybe<Scalars['String']>;
};


export type QueryFetchOrderLineDetailforWmsCountArgs = {
  filter?: InputMaybe<SearchIntForWmsCount>;
};


export type QueryFetchOrderLineMessageArgs = {
  CustomerNumber: Scalars['String'];
  DistributionCenter: Scalars['String'];
  OrderLineNumber: Scalars['String'];
  OrderNumber: Scalars['String'];
};


export type QueryFetchOrderTasktimeArgs = {
  Order?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryFetchOrderViewArgs = {
  filter?: InputMaybe<OrderViewFilter>;
};


export type QueryFetchPartMessageArgs = {
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
};


export type QueryFetchPrinterListArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']>;
};


export type QueryFetchProductInfoFromMerpArgs = {
  ProductList: Array<InputMaybe<Scalars['String']>>;
};


export type QueryFetchProductMicFromMerpArgs = {
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
};


export type QueryFetchReceiptLinesArgs = {
  ReceiptHID?: InputMaybe<Scalars['Int']>;
};


export type QueryFetchSuggetionLocationForSortingArgs = {
  ProductID: Scalars['Int'];
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFetchSystemAuditsArgs = {
  IncludeDeactivated?: InputMaybe<Scalars['Boolean']>;
};


export type QueryFetchTableDataArgs = {
  ColumnList?: InputMaybe<Scalars['String']>;
  TableName?: InputMaybe<Scalars['String']>;
  Where?: InputMaybe<Scalars['String']>;
};


export type QueryFetchTaskCounterArgs = {
  Module: Scalars['String'];
  endDate: Scalars['String'];
  startDate: Scalars['String'];
};


export type QueryFetchUserEventLogsArgs = {
  EventList?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFetchUserListArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
};


export type QueryFetchUsersForZoneArgs = {
  ZoneID?: InputMaybe<Scalars['Int']>;
};


export type QueryFetchZoneListArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
};


export type QueryFetchZonesForUserArgs = {
  UserID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindAsnArgs = {
  ASN?: InputMaybe<AutostoreAsnHeader>;
};


export type QueryFindAsnByItnArgs = {
  ITN?: InputMaybe<Scalars['String']>;
};


export type QueryFindAsnReplenishmentInventoryArgs = {
  Barcode?: InputMaybe<Scalars['String']>;
};


export type QueryFindContainerArgs = {
  Container?: InputMaybe<SearchContainer>;
};


export type QueryFindContainersArgs = {
  Container?: InputMaybe<SearchContainer>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindEventLogsArgs = {
  Log?: InputMaybe<Scalars['String']>;
  UserName?: InputMaybe<Scalars['String']>;
  eventIdList?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  timeFrame?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryFindEventTypeArgs = {
  EventType?: InputMaybe<SearchEventType>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryFindImInventoriesArgs = {
  BarcodeEnd?: InputMaybe<Scalars['String']>;
  BarcodeStart?: InputMaybe<Scalars['String']>;
  ITN?: InputMaybe<Scalars['String']>;
  PRC?: InputMaybe<Scalars['String']>;
  PartNumber?: InputMaybe<Scalars['String']>;
};


export type QueryFindImprcInventoriesArgs = {
  PRC?: InputMaybe<Scalars['String']>;
};


export type QueryFindImprcPartNumberInventoriesArgs = {
  PRC?: InputMaybe<Scalars['String']>;
  PartNumber?: InputMaybe<Scalars['String']>;
};


export type QueryFindItnColumnsArgs = {
  UserID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindItnTemplateArgs = {
  _id?: InputMaybe<Scalars['Int']>;
};


export type QueryFindItnTemplatesArgs = {
  UserID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindInventoryArgs = {
  Inventory: SearchInventory;
};


export type QueryFindInventoryByUserArgs = {
  Username?: InputMaybe<Scalars['String']>;
};


export type QueryFindInventorysArgs = {
  Inventory: SearchInventory;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindLocalErrorLogsArgs = {
  Date: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryFindNextAuditArgs = {
  UserID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindNextItnForPullingArgs = {
  Barcode?: InputMaybe<Scalars['String']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']>;
  Zone?: InputMaybe<Scalars['Int']>;
};


export type QueryFindOrderArgs = {
  Order?: InputMaybe<SearchOrder>;
};


export type QueryFindOrderByStatusArgs = {
  PriorityPinkPaper?: InputMaybe<Scalars['Boolean']>;
  StatusID: Scalars['Int'];
};


export type QueryFindOrderLineArgs = {
  OrderLine?: InputMaybe<SearchOrderLine>;
};


export type QueryFindOrderLineDetailArgs = {
  OrderLineDetail?: InputMaybe<SearchOrderLineDetail>;
};


export type QueryFindOrderLineDetailsArgs = {
  OrderLineDetail?: InputMaybe<SearchOrderLineDetail>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindOrderLinesArgs = {
  OrderLine?: InputMaybe<SearchOrderLine>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindOrdersArgs = {
  Order?: InputMaybe<SearchOrder>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindPoLineArgs = {
  PurchaseOrderLID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindPoLinesArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  ProductID?: InputMaybe<Scalars['Int']>;
  VendorID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindPOsArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindPartArgs = {
  ProductID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindPartCodesArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  SearchString?: InputMaybe<Scalars['String']>;
  VendorID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindPrintersArgs = {
  Printer?: InputMaybe<SearchPrinter>;
};


export type QueryFindProductArgs = {
  Product?: InputMaybe<SearchProduct>;
};


export type QueryFindProductCodeArgs = {
  productCode?: InputMaybe<SearchProductCode>;
};


export type QueryFindProductsArgs = {
  Product?: InputMaybe<SearchProduct>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindPurchaseOrderHArgs = {
  PurchaseOrder: SearchPurchaseOrderH;
};


export type QueryFindPurchaseOrderHsArgs = {
  PurchaseOrder: SearchPurchaseOrderH;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindPurchaseOrderLArgs = {
  PurchaseOrderL: SearchPurchaseOrderL;
};


export type QueryFindPurchaseOrderLsArgs = {
  PurchaseOrderL: SearchPurchaseOrderL;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindReceiptArgs = {
  ReceiptID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindReceiptHArgs = {
  ReceiptH: SearchReceiptH;
};


export type QueryFindReceiptHsArgs = {
  ReceiptH: SearchReceiptH;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindReceiptInfoByIdAndStatusArgs = {
  ReceiptHID: Scalars['Int'];
  statusID: Scalars['Int'];
};


export type QueryFindReceiptInfoByPartorVendorArgs = {
  PartNumber?: InputMaybe<Scalars['String']>;
  VendorNumber?: InputMaybe<Scalars['String']>;
};


export type QueryFindReceiptLArgs = {
  ReceiptL: SearchReceiptL;
};


export type QueryFindReceiptLdArgs = {
  ReceiptLD: SearchReceiptLd;
};


export type QueryFindReceiptLDsArgs = {
  ReceiptLD: SearchReceiptLd;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindReceiptLineArgs = {
  ReceiptLineID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindReceiptLsArgs = {
  ReceiptL: SearchReceiptL;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindReceiptsArgs = {
  ReceiptID?: InputMaybe<Scalars['String']>;
};


export type QueryFindRoutesArgs = {
  Route?: InputMaybe<SearchRoute>;
};


export type QueryFindUpdatedOrderLinesArgs = {
  OrderID?: InputMaybe<Scalars['Int']>;
};


export type QueryFindUserArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<SearchUser>;
};


export type QueryFindUserEventLogsArgs = {
  Modules?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  UserEventLog: SearchUserEventLog;
  endDate?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['String']>;
};


export type QueryFindUserEventsArgs = {
  UserEvent?: InputMaybe<SearchUserEvent>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryFindUserInfoArgs = {
  UserInfo?: InputMaybe<SearchUserInfo>;
};


export type QueryFindUserInfosArgs = {
  UserInfo?: InputMaybe<SearchUserInfo>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryFindUsersArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  Name?: InputMaybe<Scalars['String']>;
};


export type QueryFindVendorArgs = {
  Vendor: SearchVendor;
};


export type QueryFindVendorByPoArgs = {
  PurchaseOrder: SearchPurchaseOrderH;
};


export type QueryGetNextSubAuditArgs = {
  InventoryID?: InputMaybe<Scalars['Int']>;
  UserID?: InputMaybe<Scalars['Int']>;
};


export type QueryGetSearchLocationArgs = {
  Barcode?: InputMaybe<Scalars['String']>;
  Level?: InputMaybe<Scalars['Int']>;
};


export type QueryGetSearchLocationsArgs = {
  Barcode?: InputMaybe<Scalars['String']>;
};


export type QueryPrintQrCodeLabelArgs = {
  DPI: Scalars['String'];
  ORIENTATION: Scalars['String'];
  PRINTER: Scalars['String'];
  TEXT: Scalars['String'];
};


export type QueryPrintReceivingItnLabelArgs = {
  DPI: Scalars['String'];
  ITN: Scalars['String'];
  ORIENTATION: Scalars['String'];
  PARTNUMBER: Scalars['String'];
  PRINTER: Scalars['String'];
  PRODUCTCODE: Scalars['String'];
};


export type QueryPrintTextLabelArgs = {
  DPI: Scalars['String'];
  LINE1?: InputMaybe<Scalars['String']>;
  LINE2?: InputMaybe<Scalars['String']>;
  LINE3?: InputMaybe<Scalars['String']>;
  LINE4?: InputMaybe<Scalars['String']>;
  ORIENTATION: Scalars['String'];
  PRINTER: Scalars['String'];
};


export type QueryValidateAssignmentArgs = {
  AuditID?: InputMaybe<Scalars['Int']>;
  UserID?: InputMaybe<Scalars['Int']>;
};


export type QueryValidateFilterArgs = {
  ITN?: InputMaybe<Scalars['String']>;
  LocationEnd?: InputMaybe<Scalars['String']>;
  LocationStart?: InputMaybe<Scalars['String']>;
  PRC?: InputMaybe<Scalars['String']>;
  PartNumber?: InputMaybe<Scalars['String']>;
};


export type QueryVerifyAsnLocationArgs = {
  Barcode?: InputMaybe<Scalars['String']>;
};


export type QueryVerifyAsnLocationNotInProcessArgs = {
  Barcode?: InputMaybe<Scalars['String']>;
  StatusList?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryVerifyAsnLocationStatusArgs = {
  ASN?: InputMaybe<AutostoreAsnHeader>;
};

export type ReceiptDeleteResult = {
  __typename?: 'ReceiptDeleteResult';
  result?: Maybe<Scalars['Int']>;
};

export type ReceiptH = {
  __typename?: 'ReceiptH';
  ExpectedArrivalDate?: Maybe<Scalars['String']>;
  RECEIPTLs?: Maybe<Array<Maybe<ReceiptL>>>;
  ReceiptNumber?: Maybe<Scalars['String']>;
  SourceType?: Maybe<Scalars['String']>;
  Vendor: Vendor;
  VendorID: Scalars['Int'];
  _id: Scalars['Int'];
};

export type ReceiptHInfo = {
  __typename?: 'ReceiptHInfo';
  VendorName?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type ReceiptL = {
  __typename?: 'ReceiptL';
  Country?: Maybe<Country>;
  CountryID?: Maybe<Scalars['Int']>;
  DateCode?: Maybe<Scalars['String']>;
  ExpectedQuantity: Scalars['Float'];
  LineNumber: Scalars['Int'];
  OverReceiving: Scalars['Boolean'];
  Product: Product;
  ProductID: Scalars['Int'];
  RECEIPTLDs?: Maybe<Array<Maybe<ReceiptLd>>>;
  ROHS?: Maybe<Scalars['Boolean']>;
  ReceiptH: ReceiptH;
  ReceiptHID: Scalars['Int'];
  _id: Scalars['Int'];
};

export type ReceiptLd = {
  __typename?: 'ReceiptLD';
  ExpectedQuantity: Scalars['Float'];
  PurchaseOrderL?: Maybe<PurchaseOrderL>;
  PurchaseOrderLID?: Maybe<Scalars['Int']>;
  ReceiptL: ReceiptL;
  ReceiptLID: Scalars['Int'];
  ReceiptStatus: ReceiptStatus;
  ReceiptStatusID: Scalars['Int'];
  _id: Scalars['Int'];
};

export type ReceiptStatus = {
  __typename?: 'ReceiptStatus';
  Name: Scalars['String'];
  RECEIPTLDs?: Maybe<Array<Maybe<ReceiptLd>>>;
  _id: Scalars['Int'];
};

export type Response = {
  __typename?: 'Response';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Route = {
  __typename?: 'Route';
  ADGroupProtected?: Maybe<Scalars['Boolean']>;
  ROUTEGROUPs?: Maybe<Array<Maybe<RouteGroup>>>;
  Route: Scalars['String'];
  _id: Scalars['Int'];
};

export type RouteGroup = {
  __typename?: 'RouteGroup';
  ADGroup: Scalars['String'];
  Route: Route;
  RouteID: Scalars['Int'];
  _id: Scalars['Int'];
};

export type Searchlocation = {
  __typename?: 'SEARCHLOCATION';
  Barcode?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type ShipmentMethod = {
  __typename?: 'ShipmentMethod';
  PriorityPinkPaper: Scalars['Boolean'];
  ShippingMethod: Scalars['String'];
  _id: Scalars['String'];
};

export type SuggetionLocation = {
  __typename?: 'SuggetionLocation';
  Barcode: Scalars['String'];
  Quantity: Scalars['Float'];
  Zone?: Maybe<Scalars['String']>;
};

export type SuspectReason = {
  __typename?: 'SuspectReason';
  Inventory_SuspectReasons?: Maybe<Array<Maybe<Inventory_SuspectReason>>>;
  Reason: Scalars['String'];
  _id: Scalars['Int'];
};

export type TableData = {
  __typename?: 'TableData';
  Results?: Maybe<Scalars['String']>;
};

export type TableKey = {
  __typename?: 'TableKey';
  ID?: Maybe<Scalars['Int']>;
};

export type UpdatedOrder = {
  __typename?: 'UpdatedOrder';
  AutostoreOrderCount?: Maybe<Scalars['Int']>;
  DateCreated?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  ExpectedShipDate?: Maybe<Scalars['String']>;
  LastAutostoreSync?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type UpdatedOrderLine = {
  __typename?: 'UpdatedOrderLine';
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  OrderLineDetailID?: Maybe<Scalars['Int']>;
  OrderLineDetailQuantity?: Maybe<Scalars['Float']>;
  OrderLineID?: Maybe<Scalars['Int']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  OrderLineQuantity?: Maybe<Scalars['Float']>;
  PartNumber?: Maybe<Scalars['String']>;
  ProductCodeNumber?: Maybe<Scalars['String']>;
  UOM?: Maybe<Scalars['String']>;
  WMSPriority?: Maybe<Scalars['Int']>;
};

export type UpdatedProduct = {
  __typename?: 'UpdatedProduct';
  Description?: Maybe<Scalars['String']>;
  LastAutostoreSync?: Maybe<Scalars['String']>;
  LastUpdated?: Maybe<Scalars['String']>;
  MICPartNumber?: Maybe<Scalars['String']>;
  PartNumber: Scalars['String'];
  ProductCodeNumber: Scalars['String'];
  ProductTier?: Maybe<Scalars['String']>;
  UOM?: Maybe<Scalars['String']>;
  Velocity?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  CartID?: Maybe<Scalars['Int']>;
  CartLastUpdated?: Maybe<Scalars['String']>;
  DateCreated?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Equipment?: Maybe<Scalars['String']>;
  Name?: Maybe<Scalars['String']>;
  PriorityCutoff?: Maybe<Scalars['Int']>;
  PullerLevel?: Maybe<Scalars['Int']>;
  StrictPriority?: Maybe<Scalars['Int']>;
  ZoneCount?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type UserEvent = {
  __typename?: 'UserEvent';
  Event: Scalars['String'];
  Module: Scalars['String'];
  USEREVENTLOGs?: Maybe<Array<Maybe<UserEventLog>>>;
  _id: Scalars['Int'];
};

export type UserEventLog = {
  __typename?: 'UserEventLog';
  CustomerNumber?: Maybe<Scalars['String']>;
  CustomerTier?: Maybe<Scalars['String']>;
  DateTime?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  OrderNumber?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Boolean']>;
  ProductCode?: Maybe<Scalars['String']>;
  ProductTier?: Maybe<Scalars['String']>;
  PurchaseLine?: Maybe<Scalars['Int']>;
  PurchaseOrderNumber?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
  ReceiptHeader?: Maybe<Scalars['Int']>;
  ReceiptLine?: Maybe<Scalars['Int']>;
  ShipmentMethod?: Maybe<Scalars['String']>;
  ShipmentMethodDescription?: Maybe<Scalars['String']>;
  TrackingNumber?: Maybe<Scalars['String']>;
  UserEvent: UserEvent;
  UserEventID: Scalars['Int'];
  UserName: Scalars['String'];
  VendorName?: Maybe<Scalars['String']>;
  WMSPriority?: Maybe<Scalars['Int']>;
  Zone?: Maybe<Scalars['Int']>;
  _id: Scalars['Int'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  Cart?: Maybe<Container>;
  CartID?: Maybe<Scalars['Int']>;
  CartLastUpdated?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Name: Scalars['String'];
  PriorityCutoff?: Maybe<Scalars['Int']>;
  PullerLevel?: Maybe<Scalars['Int']>;
  StrictPriority?: Maybe<Scalars['Boolean']>;
  _id: Scalars['Int'];
};

export type Vendor = {
  __typename?: 'Vendor';
  PURCHASEORDERHs?: Maybe<Array<Maybe<PurchaseOrderH>>>;
  RECEIPTHs?: Maybe<Array<Maybe<ReceiptH>>>;
  VendorName: Scalars['String'];
  VendorNumber: Scalars['String'];
  _id: Scalars['Int'];
};

export type WmsStatusView = {
  __typename?: 'WMSStatusView';
  Head_Priority: Scalars['Int'];
  Head_Total: Scalars['Int'];
  ITN_Priority: Scalars['Int'];
  ITN_Total: Scalars['Int'];
  Line_Priority: Scalars['Int'];
  Line_Total: Scalars['Int'];
  Status: Scalars['String'];
  StatusID: Scalars['Int'];
};

export type Zone = {
  __typename?: 'Zone';
  CustAPulls?: Maybe<Scalars['Int']>;
  Description?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Equipment?: Maybe<Scalars['String']>;
  PriorityPulls?: Maybe<Scalars['Int']>;
  PullCount?: Maybe<Scalars['Int']>;
  PullsStarted?: Maybe<Scalars['Int']>;
  Type?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type AsnReplenishmentItem = {
  Status?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type AutostoreAsnHeader = {
  AUTOSTOREASNLINEs?: InputMaybe<Array<InputMaybe<AutostoreAsnLine>>>;
  ContainerID?: InputMaybe<Scalars['Int']>;
  Status?: InputMaybe<Scalars['String']>;
  tuId?: InputMaybe<Scalars['String']>;
  tuType?: InputMaybe<Scalars['String']>;
};

export type AutostoreAsnLine = {
  ASNID?: InputMaybe<Scalars['Int']>;
  DateCode?: InputMaybe<Scalars['String']>;
  InventoryID?: InputMaybe<Scalars['Int']>;
  lineNumber?: InputMaybe<Scalars['Int']>;
  packagingUom?: InputMaybe<Scalars['String']>;
  productId?: InputMaybe<Scalars['String']>;
  quantityExpected?: InputMaybe<Scalars['Float']>;
};

export type AutostoreMessage = {
  Action?: InputMaybe<Scalars['String']>;
  AutostoreID?: InputMaybe<Scalars['String']>;
  Endpoint?: InputMaybe<Scalars['String']>;
  Message?: InputMaybe<Scalars['String']>;
  Method?: InputMaybe<Scalars['String']>;
  OrderLines?: InputMaybe<Scalars['String']>;
  Status?: InputMaybe<Scalars['String']>;
  Timestamp?: InputMaybe<Scalars['String']>;
  Type?: InputMaybe<Scalars['String']>;
  TypeID?: InputMaybe<Scalars['Int']>;
};

export type AutostoreMessageAttempt = {
  MessageID: Scalars['Int'];
  Response: Scalars['String'];
  ResponseCode?: InputMaybe<Scalars['String']>;
  Source?: InputMaybe<Scalars['String']>;
  Status: Scalars['String'];
  Timestamp?: InputMaybe<Scalars['String']>;
};

export type AutostoreOrderHeader = {
  AutostoreOrderNumber: Scalars['String'];
  OrderID: Scalars['Int'];
};

export type AutostoreOrderLine = {
  AutostoreOrderHID?: InputMaybe<Scalars['Int']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineDetailID?: InputMaybe<Scalars['Int']>;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  Quantity?: InputMaybe<Scalars['Float']>;
};

export type AutostoreProcess = {
  LastRun: Scalars['String'];
  Type: Scalars['String'];
};

export type Entity = {
  __typename?: 'entity';
  ColumnID?: Maybe<Scalars['Int']>;
  ColumnName?: Maybe<Scalars['String']>;
  SystemID?: Maybe<Scalars['Int']>;
  SystemName?: Maybe<Scalars['String']>;
  TableID?: Maybe<Scalars['Int']>;
  TableName?: Maybe<Scalars['String']>;
};

export type EntityColumn = {
  __typename?: 'entityColumn';
  ColumnName?: Maybe<Scalars['String']>;
  EntityID?: Maybe<Scalars['Int']>;
  _id: Scalars['Int'];
};

export type EntityTable = {
  __typename?: 'entityTable';
  TableName?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type ImTrigger = {
  Active?: InputMaybe<Scalars['Boolean']>;
  Description?: InputMaybe<Scalars['String']>;
  Name?: InputMaybe<Scalars['String']>;
  Priority?: InputMaybe<Scalars['Int']>;
};

export type InputAudit = {
  CreatedDatetime?: InputMaybe<Scalars['String']>;
  InventoryID?: InputMaybe<Scalars['Int']>;
  LastUpdated?: InputMaybe<Scalars['String']>;
  Priority?: InputMaybe<Scalars['Int']>;
  TypeID?: InputMaybe<Scalars['Int']>;
  UserID?: InputMaybe<Scalars['Int']>;
};

export type InputSuspect = {
  Comment?: InputMaybe<Scalars['String']>;
  InventoryID?: InputMaybe<Scalars['Int']>;
  Reason?: InputMaybe<Scalars['String']>;
};

export type InsertContainer = {
  Aisle?: InputMaybe<Scalars['String']>;
  Barcode: Scalars['String'];
  ContainerTypeID: Scalars['Int'];
  DistributionCenter: Scalars['String'];
  EquipmentID?: InputMaybe<Scalars['Int']>;
  ParentContainerID?: InputMaybe<Scalars['Int']>;
  Row?: InputMaybe<Scalars['String']>;
  Section?: InputMaybe<Scalars['String']>;
  Shelf?: InputMaybe<Scalars['String']>;
  ShelfDetail?: InputMaybe<Scalars['String']>;
  Warehouse?: InputMaybe<Scalars['String']>;
  Zone?: InputMaybe<Scalars['Int']>;
};

export type InsertDcProduct = {
  DistributionCenterID: Scalars['Int'];
  ProductID: Scalars['Int'];
  Velocity?: InputMaybe<Scalars['String']>;
};

export type InsertEventLog = {
  EventTypeID: Scalars['Int'];
  Log: Scalars['String'];
  UserName: Scalars['String'];
};

export type InsertItnUserColumnsInfo = {
  SelectedColumns: Scalars['String'];
  UserID: Scalars['Int'];
};

export type InsertItnUserLevelsInfo = {
  LowLevelLimit?: InputMaybe<Scalars['Int']>;
  MediumLevelLimit?: InputMaybe<Scalars['Int']>;
  UserID: Scalars['Int'];
};

export type InsertInventory = {
  CountryOfOrigin?: InputMaybe<Scalars['String']>;
  DateCode?: InputMaybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
  InventoryTrackingNumber: Scalars['String'];
  ParentITN?: InputMaybe<Scalars['String']>;
  ProductID: Scalars['Int'];
  QuantityOnHand: Scalars['Float'];
  ROHS?: InputMaybe<Scalars['Boolean']>;
};

export type InsertInventorySuspectReason = {
  InventoryID: Scalars['Int'];
  SuspectReasonID: Scalars['Int'];
};

export type InsertOrder = {
  BranchID?: InputMaybe<Scalars['String']>;
  CustomerNumber?: InputMaybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
  ExpectedShipDate?: InputMaybe<Scalars['String']>;
  LastUpdated?: InputMaybe<Scalars['String']>;
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
  OrderStatusCode?: InputMaybe<Scalars['String']>;
  OrderType?: InputMaybe<Scalars['String']>;
  ShipmentMethodID?: InputMaybe<Scalars['String']>;
};

export type InsertOrderLine = {
  OrderID: Scalars['Int'];
  OrderLineNumber: Scalars['Int'];
  ProductID: Scalars['Int'];
  Quantity?: InputMaybe<Scalars['Float']>;
};

export type InsertOrderLineDetail = {
  BinLocation?: InputMaybe<Scalars['String']>;
  InventoryID?: InputMaybe<Scalars['Int']>;
  LastUpdated?: InputMaybe<Scalars['String']>;
  OrderID: Scalars['Int'];
  OrderLineID: Scalars['Int'];
  Quantity: Scalars['Float'];
  StatusID: Scalars['Int'];
  WMSPriority: Scalars['Int'];
};

export type InsertProduct = {
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  ProductCodeID: Scalars['Int'];
  ProductTier?: InputMaybe<Scalars['String']>;
};

export type InsertProductCode = {
  ProductCodeNumber: Scalars['String'];
  _id: Scalars['Int'];
};

export type InsertReceiptH = {
  ExpectedArrivalDate?: InputMaybe<Scalars['String']>;
  SourceType?: InputMaybe<Scalars['String']>;
  VendorID: Scalars['Int'];
};

export type InsertReceiptLd = {
  ExpectedQuantity: Scalars['Float'];
  PurchaseOrderLID?: InputMaybe<Scalars['Int']>;
  ReceiptLID: Scalars['Int'];
  ReceiptStatusID: Scalars['Int'];
};

export type InsertUserEventLog = {
  CustomerNumber?: InputMaybe<Scalars['String']>;
  CustomerTier?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  Message?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  PartNumber?: InputMaybe<Scalars['String']>;
  Priority?: InputMaybe<Scalars['Boolean']>;
  ProductCode?: InputMaybe<Scalars['String']>;
  ProductTier?: InputMaybe<Scalars['String']>;
  PurchaseLine?: InputMaybe<Scalars['Int']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']>;
  Quantity?: InputMaybe<Scalars['Float']>;
  ReceiptHeader?: InputMaybe<Scalars['Int']>;
  ReceiptLine?: InputMaybe<Scalars['Int']>;
  ShipmentMethod?: InputMaybe<Scalars['String']>;
  ShipmentMethodDescription?: InputMaybe<Scalars['String']>;
  TrackingNumber?: InputMaybe<Scalars['String']>;
  UserEventID: Scalars['Int'];
  UserName: Scalars['String'];
  VendorName?: InputMaybe<Scalars['String']>;
  WMSPriority?: InputMaybe<Scalars['Int']>;
  Zone?: InputMaybe<Scalars['Int']>;
};

export type InsertUserInfo = {
  CartID?: InputMaybe<Scalars['Int']>;
  Name?: InputMaybe<Scalars['String']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']>;
  PullerLevel?: InputMaybe<Scalars['Int']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']>;
};

export type ItnLifeCycle = {
  CustomerNumber?: InputMaybe<Scalars['String']>;
  CustomerTier?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  PartNumber?: InputMaybe<Scalars['String']>;
  Priority?: InputMaybe<Scalars['Boolean']>;
  ProductCode?: InputMaybe<Scalars['String']>;
  ProductTier?: InputMaybe<Scalars['String']>;
  Quantity?: InputMaybe<Scalars['Float']>;
  TrackingNumber?: InputMaybe<Scalars['String']>;
  WMSPriority?: InputMaybe<Scalars['Int']>;
  Zone?: InputMaybe<Scalars['Int']>;
  after_InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  agDone?: InputMaybe<Scalars['String']>;
  agDoneUser?: InputMaybe<Scalars['String']>;
  agInDone?: InputMaybe<Scalars['String']>;
  agOrderComplete?: InputMaybe<Scalars['String']>;
  agOutStart?: InputMaybe<Scalars['String']>;
  agRelocate?: InputMaybe<Scalars['String']>;
  agStart?: InputMaybe<Scalars['String']>;
  agStartUser?: InputMaybe<Scalars['String']>;
  dropoffCartSelected?: InputMaybe<Scalars['String']>;
  dropoffDone?: InputMaybe<Scalars['String']>;
  dropoffITNSkipped?: InputMaybe<Scalars['String']>;
  dropoffLine?: InputMaybe<Scalars['String']>;
  dropoffLocationSelected?: InputMaybe<Scalars['String']>;
  dropoffStart?: InputMaybe<Scalars['String']>;
  dropoffUser?: InputMaybe<Scalars['String']>;
  lineAllocation?: InputMaybe<Scalars['String']>;
  lineAllocationUser?: InputMaybe<Scalars['String']>;
  lineCancel?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
  orderCancel?: InputMaybe<Scalars['String']>;
  packDone?: InputMaybe<Scalars['String']>;
  packLine?: InputMaybe<Scalars['String']>;
  packLineUser?: InputMaybe<Scalars['String']>;
  packNewPackage?: InputMaybe<Scalars['String']>;
  packReject?: InputMaybe<Scalars['String']>;
  packStart?: InputMaybe<Scalars['String']>;
  packSupervisorCheck?: InputMaybe<Scalars['String']>;
  pickCartAssigned?: InputMaybe<Scalars['String']>;
  pickDone?: InputMaybe<Scalars['String']>;
  pickDoneUser?: InputMaybe<Scalars['String']>;
  pickITNNF?: InputMaybe<Scalars['String']>;
  pickITNPrint?: InputMaybe<Scalars['String']>;
  pickITNScan?: InputMaybe<Scalars['String']>;
  pickLabelCount?: InputMaybe<Scalars['String']>;
  pickLabelQuantity?: InputMaybe<Scalars['String']>;
  pickLocationScan?: InputMaybe<Scalars['String']>;
  pickOverPick?: InputMaybe<Scalars['String']>;
  pickQuantityEntered?: InputMaybe<Scalars['String']>;
  pickShortPick?: InputMaybe<Scalars['String']>;
  pickStart?: InputMaybe<Scalars['String']>;
  pickStartUser?: InputMaybe<Scalars['String']>;
  pickStatus15?: InputMaybe<Scalars['String']>;
  pickToteAssignment?: InputMaybe<Scalars['String']>;
  pickUserExit?: InputMaybe<Scalars['String']>;
  pullingCartSelected?: InputMaybe<Scalars['String']>;
  pullingDone?: InputMaybe<Scalars['String']>;
  pullingLocationSelected?: InputMaybe<Scalars['String']>;
  pullingNotFound?: InputMaybe<Scalars['String']>;
  pullingStart?: InputMaybe<Scalars['String']>;
  qcDone?: InputMaybe<Scalars['String']>;
  qcDoneUser?: InputMaybe<Scalars['String']>;
  qcHold?: InputMaybe<Scalars['String']>;
  qcOrderComplete?: InputMaybe<Scalars['String']>;
  qcStart?: InputMaybe<Scalars['String']>;
  qcStartUser?: InputMaybe<Scalars['String']>;
  qcStatus40?: InputMaybe<Scalars['String']>;
  qcStatus41?: InputMaybe<Scalars['String']>;
  releaseLine?: InputMaybe<Scalars['String']>;
  releaseOrder?: InputMaybe<Scalars['String']>;
  shipmentMethod?: InputMaybe<Scalars['String']>;
  shipmentMethodDescription?: InputMaybe<Scalars['String']>;
  shippingManifest?: InputMaybe<Scalars['String']>;
  splitDone?: InputMaybe<Scalars['String']>;
  splitDoneUser?: InputMaybe<Scalars['String']>;
};

export type ItnLifecycleProcess = {
  LastProcessedID?: InputMaybe<Scalars['Int']>;
};

export type OrderTasktime = {
  __typename?: 'orderTasktime';
  Order: Scalars['String'];
  agIn?: Maybe<Scalars['String']>;
  agOut?: Maybe<Scalars['String']>;
  qcFirst?: Maybe<Scalars['String']>;
  qcLast?: Maybe<Scalars['String']>;
};

export type OrderView = {
  __typename?: 'orderView';
  Aggregated?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  InProcess?: Maybe<Scalars['Int']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderID?: Maybe<Scalars['Int']>;
  OrderNumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Boolean']>;
  ShippingMethod?: Maybe<Scalars['String']>;
  Status?: Maybe<Scalars['String']>;
  StatusID?: Maybe<Scalars['Int']>;
  Unpicked?: Maybe<Scalars['Int']>;
};

export type OrderViewFilter = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  Priority?: InputMaybe<Scalars['Boolean']>;
  ShippingMethod?: InputMaybe<Scalars['String']>;
  Status?: InputMaybe<Scalars['String']>;
  StatusID?: InputMaybe<Scalars['Int']>;
};

export type Route_Table = {
  __typename?: 'route_table';
  dest: Scalars['Int'];
  dt: Scalars['String'];
  lpn: Scalars['String'];
};

export type SearchContainer = {
  Aisle?: InputMaybe<Scalars['String']>;
  Barcode?: InputMaybe<Scalars['String']>;
  ContainerTypeID?: InputMaybe<Scalars['Int']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  EquipmentID?: InputMaybe<Scalars['Int']>;
  ParentContainerID?: InputMaybe<Scalars['Int']>;
  Row?: InputMaybe<Scalars['String']>;
  Section?: InputMaybe<Scalars['String']>;
  Shelf?: InputMaybe<Scalars['String']>;
  ShelfDetail?: InputMaybe<Scalars['String']>;
  Warehouse?: InputMaybe<Scalars['String']>;
  Zone?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchEventType = {
  Event?: InputMaybe<Scalars['String']>;
  Module?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchIntForWmsCount = {
  Priority?: InputMaybe<Scalars['Boolean']>;
  StatusID: Scalars['Int'];
};

export type SearchInventory = {
  BinLocation?: InputMaybe<Scalars['String']>;
  BoundForAutostore?: InputMaybe<Scalars['Boolean']>;
  ContainerID?: InputMaybe<Scalars['Int']>;
  CountryID?: InputMaybe<Scalars['Int']>;
  DateCode?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  LocatedInAutostore?: InputMaybe<Scalars['Boolean']>;
  NotFound?: InputMaybe<Scalars['Boolean']>;
  OriginalQuantity?: InputMaybe<Scalars['Float']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  ProductID?: InputMaybe<Scalars['Int']>;
  QuantityOnHand?: InputMaybe<Scalars['Float']>;
  ROHS?: InputMaybe<Scalars['Boolean']>;
  Suspect?: InputMaybe<Scalars['Boolean']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchInventorySuspectReason = {
  InventoryID: Scalars['Int'];
  SuspectReasonID?: InputMaybe<Scalars['Int']>;
};

export type SearchOrder = {
  BranchID?: InputMaybe<Scalars['String']>;
  CustomerNumber?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  ExpectedShipDate?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  OrderStatusCode?: InputMaybe<Scalars['String']>;
  OrderType?: InputMaybe<Scalars['String']>;
  ShipmentMethodID?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
  isSelected?: InputMaybe<Scalars['Int']>;
};

export type SearchOrderLine = {
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  ProductID: Scalars['Int'];
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchOrderLineDetail = {
  BinLocation?: InputMaybe<Scalars['String']>;
  InventoryID?: InputMaybe<Scalars['Int']>;
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  Quantity?: InputMaybe<Scalars['Float']>;
  StatusID?: InputMaybe<Scalars['Int']>;
  WMSPriority?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchPrinter = {
  Active?: InputMaybe<Scalars['Boolean']>;
  DPI?: InputMaybe<Scalars['Int']>;
  Description?: InputMaybe<Scalars['String']>;
  Name?: InputMaybe<Scalars['String']>;
  Orientation?: InputMaybe<Scalars['String']>;
  StationName?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchProduct = {
  PartNumber?: InputMaybe<Scalars['String']>;
  ProductCodeID?: InputMaybe<Scalars['Int']>;
  ProductTier?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchProductCode = {
  ProductCodeNumber?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchPurchaseOrderH = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']>;
  VendorID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchPurchaseOrderL = {
  LineNumber?: InputMaybe<Scalars['Int']>;
  ProductID?: InputMaybe<Scalars['Int']>;
  PurchaseOrderHID?: InputMaybe<Scalars['Int']>;
  QuantityOnOrder?: InputMaybe<Scalars['Float']>;
  QuantityReceived?: InputMaybe<Scalars['Float']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchReceiptH = {
  ExpectedArrivalDate?: InputMaybe<Scalars['String']>;
  SourceType?: InputMaybe<Scalars['String']>;
  VendorID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchReceiptL = {
  CountryID?: InputMaybe<Scalars['Int']>;
  DateCode?: InputMaybe<Scalars['String']>;
  ExpectedQuantity?: InputMaybe<Scalars['Float']>;
  LineNumber?: InputMaybe<Scalars['Int']>;
  OverReceiving?: InputMaybe<Scalars['Boolean']>;
  ProductID?: InputMaybe<Scalars['Int']>;
  ROHS?: InputMaybe<Scalars['Boolean']>;
  ReceiptHID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchReceiptLd = {
  ExpectedQuantity?: InputMaybe<Scalars['Float']>;
  PurchaseOrderLID?: InputMaybe<Scalars['Int']>;
  ReceiptLID?: InputMaybe<Scalars['Int']>;
  ReceiptStatusID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchRoute = {
  ADGroupProtected?: InputMaybe<Scalars['Boolean']>;
  Route?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchUser = {
  Name?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchUserEvent = {
  Event?: InputMaybe<Scalars['String']>;
  Module?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchUserEventLog = {
  CustomerNumber?: InputMaybe<Scalars['String']>;
  CustomerTier?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  Message?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  PartNumber?: InputMaybe<Scalars['String']>;
  Priority?: InputMaybe<Scalars['Boolean']>;
  ProductCode?: InputMaybe<Scalars['String']>;
  ProductTier?: InputMaybe<Scalars['String']>;
  PurchaseLine?: InputMaybe<Scalars['Int']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']>;
  Quantity?: InputMaybe<Scalars['Float']>;
  ReceiptHeader?: InputMaybe<Scalars['Int']>;
  ReceiptLine?: InputMaybe<Scalars['Int']>;
  ShipmentMethod?: InputMaybe<Scalars['String']>;
  ShipmentMethodDescription?: InputMaybe<Scalars['String']>;
  TrackingNumber?: InputMaybe<Scalars['String']>;
  UserEventID?: InputMaybe<Scalars['Int']>;
  UserName?: InputMaybe<Scalars['String']>;
  VendorName?: InputMaybe<Scalars['String']>;
  WMSPriority?: InputMaybe<Scalars['Int']>;
  Zone?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchUserInfo = {
  CartID?: InputMaybe<Scalars['Int']>;
  Name?: InputMaybe<Scalars['String']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']>;
  PullerLevel?: InputMaybe<Scalars['Int']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchVendor = {
  VendorName?: InputMaybe<Scalars['String']>;
  VendorNumber?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type TaskCounter = {
  __typename?: 'taskCounter';
  User: Scalars['String'];
  taskCounter: Array<Maybe<Scalars['Int']>>;
};

export type UpdateAutostoreOrder = {
  LastAutostoreSync?: InputMaybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type UpdateContainer = {
  Aisle?: InputMaybe<Scalars['String']>;
  Barcode?: InputMaybe<Scalars['String']>;
  ContainerTypeID?: InputMaybe<Scalars['Int']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  EquipmentID?: InputMaybe<Scalars['Int']>;
  ParentContainerID?: InputMaybe<Scalars['Int']>;
  Row?: InputMaybe<Scalars['String']>;
  Section?: InputMaybe<Scalars['String']>;
  Shelf?: InputMaybe<Scalars['String']>;
  ShelfDetail?: InputMaybe<Scalars['String']>;
  Warehouse?: InputMaybe<Scalars['String']>;
  Zone?: InputMaybe<Scalars['Int']>;
};

export type UpdateItnUserColumnsInfo = {
  SelectedColumns: Scalars['String'];
};

export type UpdateItnUserLevelsInfo = {
  LowLevelLimit?: InputMaybe<Scalars['Int']>;
  MediumLevelLimit?: InputMaybe<Scalars['Int']>;
};

export type UpdateInventory = {
  BinLocation?: InputMaybe<Scalars['String']>;
  BoundForAutostore?: InputMaybe<Scalars['Boolean']>;
  ContainerID?: InputMaybe<Scalars['Int']>;
  CountryID?: InputMaybe<Scalars['Int']>;
  DateCode?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  LocatedInAutostore?: InputMaybe<Scalars['Boolean']>;
  NotFound?: InputMaybe<Scalars['Boolean']>;
  OriginalQuantity?: InputMaybe<Scalars['Float']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  ProductID?: InputMaybe<Scalars['Int']>;
  QuantityOnHand?: InputMaybe<Scalars['Float']>;
  ROHS?: InputMaybe<Scalars['Boolean']>;
  Suspect?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateOrder = {
  BranchID?: InputMaybe<Scalars['String']>;
  CustomerNumber?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  ExpectedShipDate?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  OrderStatusCode?: InputMaybe<Scalars['String']>;
  OrderType?: InputMaybe<Scalars['String']>;
  ShipmentMethodID?: InputMaybe<Scalars['String']>;
  isSelected?: InputMaybe<Scalars['Int']>;
};

export type UpdateOrderLine = {
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  ProductID?: InputMaybe<Scalars['Int']>;
  Quantity?: InputMaybe<Scalars['Float']>;
};

export type UpdateOrderLineDetail = {
  BinLocation?: InputMaybe<Scalars['String']>;
  InventoryID?: InputMaybe<Scalars['Int']>;
  LastUpdated?: InputMaybe<Scalars['String']>;
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  Quantity?: InputMaybe<Scalars['Float']>;
  StatusID?: InputMaybe<Scalars['Int']>;
  WMSPriority?: InputMaybe<Scalars['Int']>;
};

export type UpdateProduct = {
  ExcludeFromAutostore?: InputMaybe<Scalars['Boolean']>;
  LastAutostoreSync?: InputMaybe<Scalars['String']>;
  _id: Scalars['Int'];
};

export type UpdatePurchaseOrderH = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']>;
  VendorID?: InputMaybe<Scalars['Int']>;
};

export type UpdatePurchaseOrderL = {
  LineNumber?: InputMaybe<Scalars['Int']>;
  ProductID?: InputMaybe<Scalars['Int']>;
  PurchaseOrderHID?: InputMaybe<Scalars['Int']>;
  QuantityOnOrder?: InputMaybe<Scalars['Float']>;
  QuantityReceived?: InputMaybe<Scalars['Float']>;
};

export type UpdateReceiptH = {
  ExpectedArrivalDate?: InputMaybe<Scalars['String']>;
  SourceType?: InputMaybe<Scalars['String']>;
  VendorID?: InputMaybe<Scalars['Int']>;
};

export type UpdateReceiptL = {
  CountryID?: InputMaybe<Scalars['Int']>;
  DateCode?: InputMaybe<Scalars['String']>;
  ExpectedQuantity?: InputMaybe<Scalars['Float']>;
  LineNumber?: InputMaybe<Scalars['Int']>;
  OverReceiving?: InputMaybe<Scalars['Boolean']>;
  ProductID?: InputMaybe<Scalars['Int']>;
  ROHS?: InputMaybe<Scalars['Boolean']>;
  ReceiptHID?: InputMaybe<Scalars['Int']>;
};

export type UpdateReceiptLd = {
  ExpectedQuantity?: InputMaybe<Scalars['Float']>;
  PurchaseOrderLID?: InputMaybe<Scalars['Int']>;
  ReceiptLID?: InputMaybe<Scalars['Int']>;
  ReceiptStatusID?: InputMaybe<Scalars['Int']>;
};

export type UpdateUserInfo = {
  CartID?: InputMaybe<Scalars['Int']>;
  Name?: InputMaybe<Scalars['String']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']>;
  PullerLevel?: InputMaybe<Scalars['Int']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']>;
};

export type ValueMap = {
  __typename?: 'valueMap';
  SourceColumnName?: Maybe<Scalars['String']>;
  SourceSystemName?: Maybe<Scalars['String']>;
  SourceTableName?: Maybe<Scalars['String']>;
  SourceValue?: Maybe<Scalars['String']>;
  TargetColumnName?: Maybe<Scalars['String']>;
  TargetSystemName?: Maybe<Scalars['String']>;
  TargetTableName?: Maybe<Scalars['String']>;
  TargetValue?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type FetchOrderViewQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.OrderViewFilter>;
}>;


export type FetchOrderViewQuery = { __typename?: 'Query', fetchOrderView?: Array<{ __typename?: 'orderView', OrderNumber?: string | null, NOSINumber?: string | null, Status?: string | null, Priority?: boolean | null, ShippingMethod?: string | null, Unpicked?: number | null, Aggregated?: number | null, InProcess?: number | null } | null> | null };

export type FetchOrderLineDetailforWmsCountQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.SearchIntForWmsCount>;
}>;


export type FetchOrderLineDetailforWmsCountQuery = { __typename?: 'Query', fetchOrderLineDetailforWMSCount?: Array<{ __typename?: 'OrderLineDetail', Quantity: number, Inventory?: { __typename?: 'Inventory', InventoryTrackingNumber: string, Container: { __typename?: 'Container', Barcode: string, Warehouse?: string | null, Row?: string | null, Aisle?: string | null, Section?: string | null, Shelf?: string | null, ShelfDetail?: string | null }, Product: { __typename?: 'Product', PartNumber: string, ProductCode: { __typename?: 'ProductCode', ProductCodeNumber: string } } } | null, Status: { __typename?: 'OrderStatus', Name: string }, Order: { __typename?: 'Order', OrderNumber: string, NOSINumber: string } } | null> | null };

export type FetchOrderDetailforitnViewQueryVariables = Types.Exact<{
  Order: Types.SearchOrder;
}>;


export type FetchOrderDetailforitnViewQuery = { __typename?: 'Query', findOrder?: { __typename?: 'Order', OrderNumber: string, NOSINumber: string, ORDERLINEDETAILs?: Array<{ __typename?: 'OrderLineDetail', _id: number, Quantity: number, Inventory?: { __typename?: 'Inventory', InventoryTrackingNumber: string, Container: { __typename?: 'Container', Barcode: string, Warehouse?: string | null, Row?: string | null, Aisle?: string | null, Section?: string | null, Shelf?: string | null, ShelfDetail?: string | null }, Product: { __typename?: 'Product', PartNumber: string, ProductCode: { __typename?: 'ProductCode', ProductCodeNumber: string } } } | null, Status: { __typename?: 'OrderStatus', Name: string } } | null> | null } | null };

export type FetchWmsStatusViewQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FetchWmsStatusViewQuery = { __typename?: 'Query', fetchWMSStatusView?: Array<{ __typename?: 'WMSStatusView', StatusID: number, Status: string, ITN_Priority: number, ITN_Total: number, Line_Priority: number, Line_Total: number, Head_Priority: number, Head_Total: number } | null> | null };

export type FetchUserInfoQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FetchUserInfoQuery = { __typename?: 'Query', findUserInfos?: Array<{ __typename?: 'UserInfo', _id: number, Name: string } | null> | null };

export type FetchUserEventsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FetchUserEventsQuery = { __typename?: 'Query', findUserEvents?: Array<{ __typename?: 'UserEvent', _id: number, Module: string, Event: string } | null> | null };

export type FetchUserEventLogQueryVariables = Types.Exact<{
  UserEventLog: Types.SearchUserEventLog;
  Modules?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['Int']>> | Types.InputMaybe<Types.Scalars['Int']>>;
  startDate?: Types.InputMaybe<Types.Scalars['String']>;
  endDate?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type FetchUserEventLogQuery = { __typename?: 'Query', findUserEventLogs?: Array<{ __typename?: 'UserEventLog', _id: number, UserName: string, OrderNumber?: string | null, OrderLineNumber?: number | null, NOSINumber?: string | null, Message?: string | null, PartNumber?: string | null, ProductCode?: string | null, Quantity?: number | null, InventoryTrackingNumber?: string | null, DateTime?: string | null, UserEvent: { __typename?: 'UserEvent', Event: string, Module: string } } | null> | null };

export type FetchHoldOnCounterQueryVariables = Types.Exact<{
  startDate: Types.Scalars['String'];
  endDate: Types.Scalars['String'];
}>;


export type FetchHoldOnCounterQuery = { __typename?: 'Query', fetchHoldOnCounter?: Array<{ __typename?: 'HoldOnCounter', User: string, detail: Array<number | null> } | null> | null };

export type FetchOrderTasktimeQueryVariables = Types.Exact<{
  target?: Types.InputMaybe<Types.Scalars['String']>;
  limit: Types.Scalars['Int'];
}>;


export type FetchOrderTasktimeQuery = { __typename?: 'Query', fetchOrderTasktime?: Array<{ __typename?: 'orderTasktime', Order: string, qcFirst?: string | null, qcLast?: string | null, agIn?: string | null, agOut?: string | null } | null> | null };

export type FindOrderByStatusQueryVariables = Types.Exact<{
  PriorityPinkPaper?: Types.InputMaybe<Types.Scalars['Boolean']>;
  StatusID: Types.Scalars['Int'];
}>;


export type FindOrderByStatusQuery = { __typename?: 'Query', findOrderByStatus?: Array<{ __typename?: 'Order', OrderNumber: string, NOSINumber: string, Customer?: { __typename?: 'Customer', CustomerNumber: string } | null, ShipmentMethod?: { __typename?: 'ShipmentMethod', PriorityPinkPaper: boolean, ShippingMethod: string } | null } | null> | null };

export type FetchItnLifecycleQueryVariables = Types.Exact<{
  startDate: Types.Scalars['String'];
  endDate: Types.Scalars['String'];
}>;


export type FetchItnLifecycleQuery = { __typename?: 'Query', fetchITNLifecycle?: Array<{ __typename?: 'ITNLifeCycle_Report', OrderNumber?: string | null, NOSINumber?: string | null, OrderNOSI?: string | null, InventoryTrackingNumber?: string | null, after_InventoryTrackingNumber?: string | null, PartNumber?: string | null, ProductCode?: string | null, OrderLineNumber?: number | null, CustomerNumber?: string | null, CustomerTier?: string | null, ProductTier?: string | null, Zone?: number | null, WMSPriority?: number | null, Priority?: boolean | null, TrackingNumber?: string | null, releaseOrder?: string | null, releaseLine?: string | null, lineAllocation?: string | null, lineAllocationUser?: string | null, lineCancel?: string | null, orderCancel?: string | null, pickStart?: string | null, pickStartUser?: string | null, pickLocationScan?: string | null, pickITNScan?: string | null, pickQuantityEntered?: string | null, pickITNPrint?: string | null, pickDone?: string | null, pickDoneUser?: string | null, splitDone?: string | null, pickITNNF?: string | null, pickCartAssigned?: string | null, pickUserExit?: string | null, pickLabelCount?: string | null, pickLabelQuantity?: string | null, pickOverPick?: string | null, pickToteAssignment?: string | null, pickStatus15?: string | null, pickShortPick?: string | null, qcStart?: string | null, qcStartUser?: string | null, qcHold?: string | null, qcDone?: string | null, qcDoneUser?: string | null, qcOrderComplete?: string | null, qcStatus40?: string | null, qcStatus41?: string | null, agStart?: string | null, agStartUser?: string | null, agDone?: string | null, agDoneUser?: string | null, agRelocate?: string | null, agOrderComplete?: string | null, agInDone?: string | null, agOutStart?: string | null, pullingStart?: string | null, pullingCartSelected?: string | null, pullingDone?: string | null, pullingLocationSelected?: string | null, pullingNotFound?: string | null, dropoffStart?: string | null, dropoffLine?: string | null, dropoffUser?: string | null, dropoffDone?: string | null, dropoffCartSelected?: string | null, dropoffITNSkipped?: string | null, dropoffLocationSelected?: string | null, packStart?: string | null, packLine?: string | null, packLineUser?: string | null, packNewPackage?: string | null, packSupervisorCheck?: string | null, packReject?: string | null, packDone?: string | null, ParentITN?: string | null, Quantity?: number | null, shippingManifest?: string | null } | null> | null };

export type FetchItnLifecycleDrillDownQueryVariables = Types.Exact<{
  orderNumber: Types.Scalars['String'];
  nosiNumber?: Types.InputMaybe<Types.Scalars['String']>;
  orderLineNumber?: Types.InputMaybe<Types.Scalars['Int']>;
  inventoryTrackingNumber?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type FetchItnLifecycleDrillDownQuery = { __typename?: 'Query', fetchITNLifecycleDrillDown?: Array<{ __typename?: 'ITNLifeCycleDrillDown', OrderNumber?: string | null, NOSINumber?: string | null, InventoryTrackingNumber?: string | null, Message?: string | null, UserName?: string | null, UserEventID?: number | null, Event?: string | null, Module?: string | null, DateTime?: string | null, PartNumber?: string | null, ProductCode?: string | null, OrderLineNumber?: string | null, CustomerNumber?: string | null, CustomerTier?: string | null, ProductTier?: string | null, Zone?: number | null, WMSPriority?: number | null, Priority?: boolean | null, TrackingNumber?: string | null, ParentITN?: string | null, DistributionCenter?: string | null, Quantity?: number | null, ShipmentMethod?: string | null, ShipmentMethodDescription?: string | null } | null> | null };

export type FetchItnLifecycleDrillDownRowsQueryVariables = Types.Exact<{
  orderNumber?: Types.InputMaybe<Types.Scalars['String']>;
  nosiNumber?: Types.InputMaybe<Types.Scalars['String']>;
  orderLineNumber?: Types.InputMaybe<Types.Scalars['Int']>;
  inventoryTrackingNumber?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type FetchItnLifecycleDrillDownRowsQuery = { __typename?: 'Query', fetchITNLifecycleDrillDownRows?: Array<{ __typename?: 'ITNLifeCycle_Report', OrderNumber?: string | null, NOSINumber?: string | null, OrderNOSI?: string | null, DistributionCenter?: string | null, InventoryTrackingNumber?: string | null, after_InventoryTrackingNumber?: string | null, PartNumber?: string | null, ProductCode?: string | null, OrderLineNumber?: number | null, CustomerNumber?: string | null, CustomerTier?: string | null, ProductTier?: string | null, Zone?: number | null, WMSPriority?: number | null, Priority?: boolean | null, TrackingNumber?: string | null, releaseOrder?: string | null, releaseLine?: string | null, lineAllocation?: string | null, lineAllocationUser?: string | null, lineCancel?: string | null, orderCancel?: string | null, pickStart?: string | null, pickStartUser?: string | null, pickLocationScan?: string | null, pickITNScan?: string | null, pickQuantityEntered?: string | null, pickITNPrint?: string | null, pickDone?: string | null, pickDoneUser?: string | null, splitDone?: string | null, splitDoneUser?: string | null, pickITNNF?: string | null, pickCartAssigned?: string | null, pickUserExit?: string | null, pickLabelCount?: string | null, pickLabelQuantity?: string | null, pickOverPick?: string | null, pickToteAssignment?: string | null, pickStatus15?: string | null, pickShortPick?: string | null, qcStart?: string | null, qcStartUser?: string | null, qcHold?: string | null, qcDone?: string | null, qcDoneUser?: string | null, qcOrderComplete?: string | null, qcStatus40?: string | null, qcStatus41?: string | null, agStart?: string | null, agStartUser?: string | null, agDone?: string | null, agDoneUser?: string | null, agRelocate?: string | null, agOrderComplete?: string | null, agInDone?: string | null, agOutStart?: string | null, pullingStart?: string | null, pullingCartSelected?: string | null, pullingDone?: string | null, pullingLocationSelected?: string | null, pullingNotFound?: string | null, dropoffStart?: string | null, dropoffLine?: string | null, dropoffUser?: string | null, dropoffDone?: string | null, dropoffCartSelected?: string | null, dropoffITNSkipped?: string | null, dropoffLocationSelected?: string | null, packStart?: string | null, packLine?: string | null, packLineUser?: string | null, packNewPackage?: string | null, packSupervisorCheck?: string | null, packReject?: string | null, packDone?: string | null, ParentITN?: string | null, Quantity?: number | null, shippingManifest?: string | null, shipmentMethod?: string | null, shipmentMethodDescription?: string | null } | null> | null };

export type FetchItnUserColumnsQueryVariables = Types.Exact<{
  userId?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type FetchItnUserColumnsQuery = { __typename?: 'Query', fetchITNUserColumns?: Array<{ __typename?: 'ITNUserColumn', _id?: number | null, SelectedColumns?: string | null, LowLevelLimit?: number | null, MediumLevelLimit?: number | null } | null> | null };

export type FindItnTemplateQueryVariables = Types.Exact<{
  _id?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type FindItnTemplateQuery = { __typename?: 'Query', findITNTemplate?: Array<{ __typename?: 'ITNUserTemplate', _id?: number | null, UserID?: number | null, TemplateName?: string | null, SelectedColumns?: string | null, DefaultPagination?: number | null, DefaultTemplate?: boolean | null, ITNLEVELLIMITs?: Array<{ __typename?: 'ITNUserLevelLimit', _id: number, TemplateID?: number | null, EventName?: string | null, EventID?: number | null, LowLevelLimit?: number | null, MediumLevelLimit?: number | null } | null> | null } | null> | null };

export type FindItnTemplatesQueryVariables = Types.Exact<{
  userId?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type FindItnTemplatesQuery = { __typename?: 'Query', findITNTemplates?: Array<{ __typename?: 'ITNUserTemplate', _id?: number | null, UserID?: number | null, TemplateName?: string | null, SelectedColumns?: string | null, DefaultTemplate?: boolean | null, ITNLEVELLIMITs?: Array<{ __typename?: 'ITNUserLevelLimit', _id: number, TemplateID?: number | null, EventName?: string | null, EventID?: number | null, LowLevelLimit?: number | null, MediumLevelLimit?: number | null } | null> | null } | null> | null };

export type FindItnColumnsQueryVariables = Types.Exact<{
  userId?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type FindItnColumnsQuery = { __typename?: 'Query', findITNColumns?: Array<{ __typename?: 'ITNColumn', _id?: number | null, name?: string | null, title?: string | null, dataName?: string | null, colSpan?: string | null, position?: number | null, width?: string | null, eventGroup?: string | null, eventName?: string | null, searchable?: boolean | null, drilldown?: boolean | null } | null> | null };

export type Insert_ItnUserColumnsMutationVariables = Types.Exact<{
  itnUserColumns: Array<Types.InputMaybe<Types.InsertItnUserColumnsInfo>> | Types.InputMaybe<Types.InsertItnUserColumnsInfo>;
}>;


export type Insert_ItnUserColumnsMutation = { __typename?: 'Mutation', insertITNUserColumns?: { __typename?: 'ITNUserColumns', UserID?: number | null, SelectedColumns?: string | null } | null };

export type Update_ItnUserColumnsMutationVariables = Types.Exact<{
  itnUserColumns: Array<Types.InputMaybe<Types.UpdateItnUserColumnsInfo>> | Types.InputMaybe<Types.UpdateItnUserColumnsInfo>;
  _id?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type Update_ItnUserColumnsMutation = { __typename?: 'Mutation', updateITNUserColumns?: { __typename?: 'ITNUserColumns', SelectedColumns?: string | null } | null };

export type Insert_ItnUserLevelsMutationVariables = Types.Exact<{
  itnUserLevels: Array<Types.InputMaybe<Types.InsertItnUserLevelsInfo>> | Types.InputMaybe<Types.InsertItnUserLevelsInfo>;
}>;


export type Insert_ItnUserLevelsMutation = { __typename?: 'Mutation', insertITNUserLevels?: { __typename?: 'ITNUserLevels', UserID?: number | null, LowLevelLimit?: number | null, MediumLevelLimit?: number | null } | null };

export type Update_ItnUserLevelsMutationVariables = Types.Exact<{
  itnUserLevels: Array<Types.InputMaybe<Types.UpdateItnUserLevelsInfo>> | Types.InputMaybe<Types.UpdateItnUserLevelsInfo>;
  _id?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type Update_ItnUserLevelsMutation = { __typename?: 'Mutation', updateITNUserLevels?: { __typename?: 'ITNUserLevels', LowLevelLimit?: number | null, MediumLevelLimit?: number | null } | null };

export type Update_ItnUserTemplateMutationVariables = Types.Exact<{
  _id: Types.Scalars['Int'];
  templateName?: Types.InputMaybe<Types.Scalars['String']>;
  selectedColumns?: Types.InputMaybe<Types.Scalars['String']>;
  defaultPagination?: Types.InputMaybe<Types.Scalars['Int']>;
  defaultTemplate?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;


export type Update_ItnUserTemplateMutation = { __typename?: 'Mutation', updateITNUserTemplate?: Array<{ __typename?: 'ITNUserTemplate', _id?: number | null } | null> | null };

export type Clear_ItnUserDefaultTemplateMutationVariables = Types.Exact<{
  userID: Types.Scalars['Int'];
}>;


export type Clear_ItnUserDefaultTemplateMutation = { __typename?: 'Mutation', clearITNUserDefaultTemplate?: Array<{ __typename?: 'ITNUserTemplate', _id?: number | null } | null> | null };

export type Delete_ItnLevelLimitMutationVariables = Types.Exact<{
  templateID: Types.Scalars['Int'];
}>;


export type Delete_ItnLevelLimitMutation = { __typename?: 'Mutation', deleteITNLevelLimit?: Array<{ __typename?: 'ITNUserLevelLimit', _id: number } | null> | null };

export type Delete_ItnUserTemplateMutationVariables = Types.Exact<{
  _id: Types.Scalars['Int'];
}>;


export type Delete_ItnUserTemplateMutation = { __typename?: 'Mutation', deleteITNUserTemplate?: Array<{ __typename?: 'ITNUserTemplate', _id?: number | null } | null> | null };

export type Insert_ItnLevelLimitMutationVariables = Types.Exact<{
  templateID?: Types.InputMaybe<Types.Scalars['Int']>;
  eventName?: Types.InputMaybe<Types.Scalars['String']>;
  eventID?: Types.InputMaybe<Types.Scalars['Int']>;
  lowLevelLimit?: Types.InputMaybe<Types.Scalars['Int']>;
  mediumLevelLimit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type Insert_ItnLevelLimitMutation = { __typename?: 'Mutation', insertITNLevelLimit?: { __typename?: 'ITNUserLevelLimit', _id: number } | null };

export type Insert_ItnUserTemplateMutationVariables = Types.Exact<{
  userID?: Types.InputMaybe<Types.Scalars['Int']>;
  templateName?: Types.InputMaybe<Types.Scalars['String']>;
  selectedColumns?: Types.InputMaybe<Types.Scalars['String']>;
  defaultTemplate?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;


export type Insert_ItnUserTemplateMutation = { __typename?: 'Mutation', insertITNUserTemplate?: { __typename?: 'ITNUserTemplate', _id?: number | null } | null };

export const FetchOrderViewDocument = gql`
    query fetchOrderView($filter: orderViewFilter) {
  fetchOrderView(filter: $filter) {
    OrderNumber
    NOSINumber
    Status
    Priority
    ShippingMethod
    Unpicked
    Aggregated
    InProcess
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOrderViewGQL extends Apollo.Query<FetchOrderViewQuery, FetchOrderViewQueryVariables> {
    document = FetchOrderViewDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchOrderLineDetailforWmsCountDocument = gql`
    query fetchOrderLineDetailforWMSCount($filter: searchINTForWMSCount) {
  fetchOrderLineDetailforWMSCount(filter: $filter) {
    Inventory {
      InventoryTrackingNumber
      Container {
        Barcode
        Warehouse
        Row
        Aisle
        Section
        Shelf
        ShelfDetail
      }
      Product {
        ProductCode {
          ProductCodeNumber
        }
        PartNumber
      }
    }
    Status {
      Name
    }
    Order {
      OrderNumber
      NOSINumber
    }
    Quantity
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOrderLineDetailforWmsCountGQL extends Apollo.Query<FetchOrderLineDetailforWmsCountQuery, FetchOrderLineDetailforWmsCountQueryVariables> {
    document = FetchOrderLineDetailforWmsCountDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchOrderDetailforitnViewDocument = gql`
    query fetchOrderDetailforitnView($Order: searchOrder!) {
  findOrder(Order: $Order) {
    OrderNumber
    NOSINumber
    ORDERLINEDETAILs {
      _id
      Inventory {
        InventoryTrackingNumber
        Container {
          Barcode
          Warehouse
          Row
          Aisle
          Section
          Shelf
          ShelfDetail
        }
        Product {
          ProductCode {
            ProductCodeNumber
          }
          PartNumber
        }
      }
      Status {
        Name
      }
      Quantity
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOrderDetailforitnViewGQL extends Apollo.Query<FetchOrderDetailforitnViewQuery, FetchOrderDetailforitnViewQueryVariables> {
    document = FetchOrderDetailforitnViewDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchWmsStatusViewDocument = gql`
    query fetchWMSStatusView {
  fetchWMSStatusView {
    StatusID
    Status
    ITN_Priority
    ITN_Total
    Line_Priority
    Line_Total
    Head_Priority
    Head_Total
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchWmsStatusViewGQL extends Apollo.Query<FetchWmsStatusViewQuery, FetchWmsStatusViewQueryVariables> {
    document = FetchWmsStatusViewDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchUserInfoDocument = gql`
    query fetchUserInfo {
  findUserInfos {
    _id
    Name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchUserInfoGQL extends Apollo.Query<FetchUserInfoQuery, FetchUserInfoQueryVariables> {
    document = FetchUserInfoDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchUserEventsDocument = gql`
    query fetchUserEvents {
  findUserEvents {
    _id
    Module
    Event
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchUserEventsGQL extends Apollo.Query<FetchUserEventsQuery, FetchUserEventsQueryVariables> {
    document = FetchUserEventsDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchUserEventLogDocument = gql`
    query fetchUserEventLog($UserEventLog: searchUserEventLog!, $Modules: [Int], $startDate: String, $endDate: String, $limit: Int) {
  findUserEventLogs(
    UserEventLog: $UserEventLog
    Modules: $Modules
    startDate: $startDate
    endDate: $endDate
    limit: $limit
  ) {
    _id
    UserName
    UserEvent {
      Event
      Module
    }
    OrderNumber
    OrderLineNumber
    NOSINumber
    Message
    PartNumber
    ProductCode
    Quantity
    InventoryTrackingNumber
    DateTime
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchUserEventLogGQL extends Apollo.Query<FetchUserEventLogQuery, FetchUserEventLogQueryVariables> {
    document = FetchUserEventLogDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchHoldOnCounterDocument = gql`
    query fetchHoldOnCounter($startDate: String!, $endDate: String!) {
  fetchHoldOnCounter(startDate: $startDate, endDate: $endDate) {
    User
    detail
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchHoldOnCounterGQL extends Apollo.Query<FetchHoldOnCounterQuery, FetchHoldOnCounterQueryVariables> {
    document = FetchHoldOnCounterDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchOrderTasktimeDocument = gql`
    query fetchOrderTasktime($target: String, $limit: Int!) {
  fetchOrderTasktime(Order: $target, limit: $limit) {
    Order
    qcFirst
    qcLast
    agIn
    agOut
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOrderTasktimeGQL extends Apollo.Query<FetchOrderTasktimeQuery, FetchOrderTasktimeQueryVariables> {
    document = FetchOrderTasktimeDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FindOrderByStatusDocument = gql`
    query findOrderByStatus($PriorityPinkPaper: Boolean, $StatusID: Int!) {
  findOrderByStatus(PriorityPinkPaper: $PriorityPinkPaper, StatusID: $StatusID) {
    OrderNumber
    NOSINumber
    Customer {
      CustomerNumber
    }
    ShipmentMethod {
      PriorityPinkPaper
      ShippingMethod
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindOrderByStatusGQL extends Apollo.Query<FindOrderByStatusQuery, FindOrderByStatusQueryVariables> {
    document = FindOrderByStatusDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchItnLifecycleDocument = gql`
    query fetchITNLifecycle($startDate: String!, $endDate: String!) {
  fetchITNLifecycle(startDate: $startDate, endDate: $endDate) {
    OrderNumber
    NOSINumber
    OrderNOSI
    InventoryTrackingNumber
    after_InventoryTrackingNumber
    PartNumber
    ProductCode
    OrderLineNumber
    CustomerNumber
    CustomerTier
    ProductTier
    Zone
    WMSPriority
    Priority
    TrackingNumber
    releaseOrder
    releaseLine
    lineAllocation
    lineAllocationUser
    lineCancel
    orderCancel
    pickStart
    pickStartUser
    pickLocationScan
    pickITNScan
    pickQuantityEntered
    pickITNPrint
    pickDone
    pickDoneUser
    splitDone
    pickITNNF
    pickCartAssigned
    pickUserExit
    pickLabelCount
    pickLabelQuantity
    pickOverPick
    pickToteAssignment
    pickStatus15
    pickShortPick
    qcStart
    qcStartUser
    qcHold
    qcDone
    qcDoneUser
    qcOrderComplete
    qcStatus40
    qcStatus41
    agStart
    agStartUser
    agDone
    agDoneUser
    agRelocate
    agOrderComplete
    agInDone
    agOutStart
    pullingStart
    pullingCartSelected
    pullingDone
    pullingLocationSelected
    pullingNotFound
    dropoffStart
    dropoffLine
    dropoffUser
    dropoffDone
    dropoffCartSelected
    dropoffITNSkipped
    dropoffLocationSelected
    packStart
    packLine
    packLineUser
    packNewPackage
    packSupervisorCheck
    packReject
    packDone
    ParentITN
    Quantity
    shippingManifest
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchItnLifecycleGQL extends Apollo.Query<FetchItnLifecycleQuery, FetchItnLifecycleQueryVariables> {
    document = FetchItnLifecycleDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchItnLifecycleDrillDownDocument = gql`
    query fetchITNLifecycleDrillDown($orderNumber: String!, $nosiNumber: String, $orderLineNumber: Int, $inventoryTrackingNumber: String) {
  fetchITNLifecycleDrillDown(
    orderNumber: $orderNumber
    nosiNumber: $nosiNumber
    orderLineNumber: $orderLineNumber
    inventoryTrackingNumber: $inventoryTrackingNumber
  ) {
    OrderNumber
    NOSINumber
    InventoryTrackingNumber
    Message
    UserName
    UserEventID
    Event
    Module
    DateTime
    PartNumber
    ProductCode
    OrderLineNumber
    CustomerNumber
    CustomerTier
    ProductTier
    Zone
    WMSPriority
    Priority
    TrackingNumber
    ParentITN
    DistributionCenter
    Quantity
    ShipmentMethod
    ShipmentMethodDescription
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchItnLifecycleDrillDownGQL extends Apollo.Query<FetchItnLifecycleDrillDownQuery, FetchItnLifecycleDrillDownQueryVariables> {
    document = FetchItnLifecycleDrillDownDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchItnLifecycleDrillDownRowsDocument = gql`
    query fetchITNLifecycleDrillDownRows($orderNumber: String, $nosiNumber: String, $orderLineNumber: Int, $inventoryTrackingNumber: String) {
  fetchITNLifecycleDrillDownRows(
    orderNumber: $orderNumber
    nosiNumber: $nosiNumber
    orderLineNumber: $orderLineNumber
    inventoryTrackingNumber: $inventoryTrackingNumber
  ) {
    OrderNumber
    NOSINumber
    OrderNOSI
    DistributionCenter
    InventoryTrackingNumber
    after_InventoryTrackingNumber
    PartNumber
    ProductCode
    OrderLineNumber
    CustomerNumber
    CustomerTier
    ProductTier
    Zone
    WMSPriority
    Priority
    TrackingNumber
    releaseOrder
    releaseLine
    lineAllocation
    lineAllocationUser
    lineCancel
    orderCancel
    pickStart
    pickStartUser
    pickLocationScan
    pickITNScan
    pickQuantityEntered
    pickITNPrint
    pickDone
    pickDoneUser
    splitDone
    splitDoneUser
    pickITNNF
    pickCartAssigned
    pickUserExit
    pickLabelCount
    pickLabelQuantity
    pickOverPick
    pickToteAssignment
    pickStatus15
    pickShortPick
    qcStart
    qcStartUser
    qcHold
    qcDone
    qcDoneUser
    qcOrderComplete
    qcStatus40
    qcStatus41
    agStart
    agStartUser
    agDone
    agDoneUser
    agRelocate
    agOrderComplete
    agInDone
    agOutStart
    pullingStart
    pullingCartSelected
    pullingDone
    pullingLocationSelected
    pullingNotFound
    dropoffStart
    dropoffLine
    dropoffUser
    dropoffDone
    dropoffCartSelected
    dropoffITNSkipped
    dropoffLocationSelected
    packStart
    packLine
    packLineUser
    packNewPackage
    packSupervisorCheck
    packReject
    packDone
    ParentITN
    Quantity
    shippingManifest
    shipmentMethod
    shipmentMethodDescription
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchItnLifecycleDrillDownRowsGQL extends Apollo.Query<FetchItnLifecycleDrillDownRowsQuery, FetchItnLifecycleDrillDownRowsQueryVariables> {
    document = FetchItnLifecycleDrillDownRowsDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchItnUserColumnsDocument = gql`
    query fetchITNUserColumns($userId: String) {
  fetchITNUserColumns(userId: $userId) {
    _id
    SelectedColumns
    LowLevelLimit
    MediumLevelLimit
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchItnUserColumnsGQL extends Apollo.Query<FetchItnUserColumnsQuery, FetchItnUserColumnsQueryVariables> {
    document = FetchItnUserColumnsDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FindItnTemplateDocument = gql`
    query findITNTemplate($_id: Int) {
  findITNTemplate(_id: $_id) {
    _id
    UserID
    TemplateName
    SelectedColumns
    DefaultPagination
    DefaultTemplate
    ITNLEVELLIMITs {
      _id
      TemplateID
      EventName
      EventID
      LowLevelLimit
      MediumLevelLimit
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindItnTemplateGQL extends Apollo.Query<FindItnTemplateQuery, FindItnTemplateQueryVariables> {
    document = FindItnTemplateDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FindItnTemplatesDocument = gql`
    query findITNTemplates($userId: Int) {
  findITNTemplates(UserID: $userId) {
    _id
    UserID
    TemplateName
    SelectedColumns
    DefaultTemplate
    ITNLEVELLIMITs {
      _id
      TemplateID
      EventName
      EventID
      LowLevelLimit
      MediumLevelLimit
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindItnTemplatesGQL extends Apollo.Query<FindItnTemplatesQuery, FindItnTemplatesQueryVariables> {
    document = FindItnTemplatesDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FindItnColumnsDocument = gql`
    query findITNColumns($userId: Int) {
  findITNColumns(UserID: $userId) {
    _id
    name
    title
    dataName
    colSpan
    position
    width
    eventGroup
    eventName
    searchable
    drilldown
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindItnColumnsGQL extends Apollo.Query<FindItnColumnsQuery, FindItnColumnsQueryVariables> {
    document = FindItnColumnsDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Insert_ItnUserColumnsDocument = gql`
    mutation insert_ITNUserColumns($itnUserColumns: [insertITNUserColumnsInfo]!) {
  insertITNUserColumns(ITNUserColumns: $itnUserColumns) {
    UserID
    SelectedColumns
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Insert_ItnUserColumnsGQL extends Apollo.Mutation<Insert_ItnUserColumnsMutation, Insert_ItnUserColumnsMutationVariables> {
    document = Insert_ItnUserColumnsDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Update_ItnUserColumnsDocument = gql`
    mutation update_ITNUserColumns($itnUserColumns: [updateITNUserColumnsInfo]!, $_id: Int) {
  updateITNUserColumns(ITNUserColumns: $itnUserColumns, _id: $_id) {
    SelectedColumns
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Update_ItnUserColumnsGQL extends Apollo.Mutation<Update_ItnUserColumnsMutation, Update_ItnUserColumnsMutationVariables> {
    document = Update_ItnUserColumnsDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Insert_ItnUserLevelsDocument = gql`
    mutation insert_ITNUserLevels($itnUserLevels: [insertITNUserLevelsInfo]!) {
  insertITNUserLevels(ITNUserLevels: $itnUserLevels) {
    UserID
    LowLevelLimit
    MediumLevelLimit
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Insert_ItnUserLevelsGQL extends Apollo.Mutation<Insert_ItnUserLevelsMutation, Insert_ItnUserLevelsMutationVariables> {
    document = Insert_ItnUserLevelsDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Update_ItnUserLevelsDocument = gql`
    mutation update_ITNUserLevels($itnUserLevels: [updateITNUserLevelsInfo]!, $_id: Int) {
  updateITNUserLevels(ITNUserLevels: $itnUserLevels, _id: $_id) {
    LowLevelLimit
    MediumLevelLimit
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Update_ItnUserLevelsGQL extends Apollo.Mutation<Update_ItnUserLevelsMutation, Update_ItnUserLevelsMutationVariables> {
    document = Update_ItnUserLevelsDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Update_ItnUserTemplateDocument = gql`
    mutation update_ITNUserTemplate($_id: Int!, $templateName: String, $selectedColumns: String, $defaultPagination: Int, $defaultTemplate: Boolean) {
  updateITNUserTemplate(
    _id: $_id
    TemplateName: $templateName
    SelectedColumns: $selectedColumns
    DefaultPagination: $defaultPagination
    DefaultTemplate: $defaultTemplate
  ) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Update_ItnUserTemplateGQL extends Apollo.Mutation<Update_ItnUserTemplateMutation, Update_ItnUserTemplateMutationVariables> {
    document = Update_ItnUserTemplateDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Clear_ItnUserDefaultTemplateDocument = gql`
    mutation clear_ITNUserDefaultTemplate($userID: Int!) {
  clearITNUserDefaultTemplate(UserID: $userID) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Clear_ItnUserDefaultTemplateGQL extends Apollo.Mutation<Clear_ItnUserDefaultTemplateMutation, Clear_ItnUserDefaultTemplateMutationVariables> {
    document = Clear_ItnUserDefaultTemplateDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Delete_ItnLevelLimitDocument = gql`
    mutation delete_ITNLevelLimit($templateID: Int!) {
  deleteITNLevelLimit(TemplateID: $templateID) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Delete_ItnLevelLimitGQL extends Apollo.Mutation<Delete_ItnLevelLimitMutation, Delete_ItnLevelLimitMutationVariables> {
    document = Delete_ItnLevelLimitDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Delete_ItnUserTemplateDocument = gql`
    mutation delete_ITNUserTemplate($_id: Int!) {
  deleteITNUserTemplate(_id: $_id) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Delete_ItnUserTemplateGQL extends Apollo.Mutation<Delete_ItnUserTemplateMutation, Delete_ItnUserTemplateMutationVariables> {
    document = Delete_ItnUserTemplateDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Insert_ItnLevelLimitDocument = gql`
    mutation insert_ITNLevelLimit($templateID: Int, $eventName: String, $eventID: Int, $lowLevelLimit: Int, $mediumLevelLimit: Int) {
  insertITNLevelLimit(
    TemplateID: $templateID
    EventName: $eventName
    EventID: $eventID
    LowLevelLimit: $lowLevelLimit
    MediumLevelLimit: $mediumLevelLimit
  ) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Insert_ItnLevelLimitGQL extends Apollo.Mutation<Insert_ItnLevelLimitMutation, Insert_ItnLevelLimitMutationVariables> {
    document = Insert_ItnLevelLimitDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Insert_ItnUserTemplateDocument = gql`
    mutation insert_ITNUserTemplate($userID: Int, $templateName: String, $selectedColumns: String, $defaultTemplate: Boolean) {
  insertITNUserTemplate(
    UserID: $userID
    TemplateName: $templateName
    SelectedColumns: $selectedColumns
    DefaultTemplate: $defaultTemplate
  ) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Insert_ItnUserTemplateGQL extends Apollo.Mutation<Insert_ItnUserTemplateMutation, Insert_ItnUserTemplateMutationVariables> {
    document = Insert_ItnUserTemplateDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }