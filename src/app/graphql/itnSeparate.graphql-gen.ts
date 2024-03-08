import * as Types from './generated/types.graphql-gen';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type ApiResult = {
  __typename?: 'APIResult';
  StatusCode?: Maybe<Scalars['String']['output']>;
  StatusMessage?: Maybe<Scalars['String']['output']>;
};

export type Asnrejectionreason = {
  __typename?: 'ASNREJECTIONREASON';
  Global?: Maybe<Scalars['Boolean']['output']>;
  Reason?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Asnreplenishment = {
  __typename?: 'ASNREPLENISHMENT';
  InventoryID?: Maybe<Scalars['Int']['output']>;
  Status?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Asnreplenishmentitem = {
  __typename?: 'ASNREPLENISHMENTITEM';
  Aisle?: Maybe<Scalars['String']['output']>;
  Barcode?: Maybe<Scalars['String']['output']>;
  InventoryID?: Maybe<Scalars['Int']['output']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  ProductID?: Maybe<Scalars['Int']['output']>;
  Row?: Maybe<Scalars['String']['output']>;
  Section?: Maybe<Scalars['String']['output']>;
  Shelf?: Maybe<Scalars['String']['output']>;
  ShelfDetail?: Maybe<Scalars['String']['output']>;
  Status?: Maybe<Scalars['String']['output']>;
  Warehouse?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Audit = {
  __typename?: 'AUDIT';
  Autostore?: Maybe<Scalars['Boolean']['output']>;
  Barcode?: Maybe<Scalars['String']['output']>;
  BoundForAutostore?: Maybe<Scalars['Boolean']['output']>;
  COO?: Maybe<Scalars['String']['output']>;
  Cost?: Maybe<Scalars['Float']['output']>;
  CreatedDatetime?: Maybe<Scalars['String']['output']>;
  DateCode?: Maybe<Scalars['String']['output']>;
  Description?: Maybe<Scalars['String']['output']>;
  InventoryID?: Maybe<Scalars['Int']['output']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  LastUpdated?: Maybe<Scalars['String']['output']>;
  LocatedInAutostore?: Maybe<Scalars['Boolean']['output']>;
  LocationCode?: Maybe<Scalars['String']['output']>;
  MICPartNumber?: Maybe<Scalars['String']['output']>;
  NotFound?: Maybe<Scalars['Boolean']['output']>;
  Order?: Maybe<Scalars['Int']['output']>;
  OrderLineNumber?: Maybe<Scalars['String']['output']>;
  OrderNumberNOSI?: Maybe<Scalars['String']['output']>;
  OriginalQuantity?: Maybe<Scalars['Float']['output']>;
  PackQty?: Maybe<Scalars['Float']['output']>;
  PackType?: Maybe<Scalars['String']['output']>;
  ParentITN?: Maybe<Scalars['String']['output']>;
  PartNumber?: Maybe<Scalars['String']['output']>;
  Priority?: Maybe<Scalars['Int']['output']>;
  ProductCodeID?: Maybe<Scalars['Int']['output']>;
  ProductCodeNumber?: Maybe<Scalars['String']['output']>;
  ProductID?: Maybe<Scalars['Int']['output']>;
  ProductTier?: Maybe<Scalars['String']['output']>;
  ProductType?: Maybe<Scalars['String']['output']>;
  ProductTypeDescription?: Maybe<Scalars['String']['output']>;
  QuantityOnHand?: Maybe<Scalars['Float']['output']>;
  ROHS?: Maybe<Scalars['Boolean']['output']>;
  Suspect?: Maybe<Scalars['Boolean']['output']>;
  Type?: Maybe<Scalars['String']['output']>;
  TypeID?: Maybe<Scalars['Int']['output']>;
  UOM?: Maybe<Scalars['String']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
  Velocity?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Auditinventory = {
  __typename?: 'AUDITINVENTORY';
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
  oldID?: Maybe<Scalars['Int']['output']>;
};

export type Audittype = {
  __typename?: 'AUDITTYPE';
  Order?: Maybe<Scalars['Int']['output']>;
  Type?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Autostoreasnheader = {
  __typename?: 'AUTOSTOREASNHEADER';
  AUTOSTOREASNLINEs?: Maybe<Array<Maybe<Autostoreasnline>>>;
  Container?: Maybe<Container>;
  ContainerID?: Maybe<Scalars['Int']['output']>;
  Status?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
  tuId?: Maybe<Scalars['String']['output']>;
  tuType?: Maybe<Scalars['String']['output']>;
};

export type Autostoreasnline = {
  __typename?: 'AUTOSTOREASNLINE';
  ASNID?: Maybe<Scalars['Int']['output']>;
  Inventory?: Maybe<Inventory>;
  InventoryID?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
  lineNumber?: Maybe<Scalars['Int']['output']>;
  packagingUom?: Maybe<Scalars['String']['output']>;
  productId?: Maybe<Scalars['String']['output']>;
  quantityExpected?: Maybe<Scalars['Float']['output']>;
};

export type Autostoremessage = {
  __typename?: 'AUTOSTOREMESSAGE';
  Action?: Maybe<Scalars['String']['output']>;
  AutostoreID?: Maybe<Scalars['String']['output']>;
  Endpoint?: Maybe<Scalars['String']['output']>;
  ErrorCount?: Maybe<Scalars['Int']['output']>;
  Message?: Maybe<Scalars['String']['output']>;
  Method?: Maybe<Scalars['String']['output']>;
  OrderLines?: Maybe<Scalars['String']['output']>;
  Status?: Maybe<Scalars['String']['output']>;
  Timestamp?: Maybe<Scalars['String']['output']>;
  Type: Scalars['String']['output'];
  TypeID?: Maybe<Scalars['Int']['output']>;
  _id: Scalars['Int']['output'];
};

export type Autostoremessageattempt = {
  __typename?: 'AUTOSTOREMESSAGEATTEMPT';
  MessageID: Scalars['Int']['output'];
  Response: Scalars['String']['output'];
  ResponseCode?: Maybe<Scalars['String']['output']>;
  Source?: Maybe<Scalars['String']['output']>;
  Status: Scalars['String']['output'];
  Tiemstamp: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type Autostoreorderheader = {
  __typename?: 'AUTOSTOREORDERHEADER';
  AutostoreOrderNumber?: Maybe<Scalars['String']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Autostoreorderline = {
  __typename?: 'AUTOSTOREORDERLINE';
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  OrderLineDetailID?: Maybe<Scalars['Int']['output']>;
  OrderLineID?: Maybe<Scalars['Int']['output']>;
  OrderLineNumber?: Maybe<Scalars['Int']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Autostoreprocess = {
  __typename?: 'AUTOSTOREPROCESS';
  LastRun?: Maybe<Scalars['String']['output']>;
  Type?: Maybe<Scalars['String']['output']>;
  Value?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Container = {
  __typename?: 'Container';
  Aisle?: Maybe<Scalars['String']['output']>;
  Barcode: Scalars['String']['output'];
  CONTAINERs?: Maybe<Array<Maybe<Container>>>;
  ContainerType: ContainerType;
  ContainerTypeID: Scalars['Int']['output'];
  DistributionCenter: Scalars['String']['output'];
  Equipment?: Maybe<Equipment>;
  EquipmentID?: Maybe<Scalars['Int']['output']>;
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
  ParentContainer?: Maybe<Container>;
  ParentContainerID?: Maybe<Scalars['Int']['output']>;
  Row?: Maybe<Scalars['String']['output']>;
  Section?: Maybe<Scalars['String']['output']>;
  Shelf?: Maybe<Scalars['String']['output']>;
  ShelfDetail?: Maybe<Scalars['String']['output']>;
  USERINFOs?: Maybe<Array<Maybe<UserInfo>>>;
  Warehouse?: Maybe<Scalars['String']['output']>;
  Zone?: Maybe<Scalars['Int']['output']>;
  _id: Scalars['Int']['output'];
};

export type ContainerType = {
  __typename?: 'ContainerType';
  IsMobile: Scalars['Boolean']['output'];
  Name: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type Country = {
  __typename?: 'Country';
  CountryCode: Scalars['String']['output'];
  CountryName: Scalars['String']['output'];
  ISO2: Scalars['String']['output'];
  ISO3: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type Customer = {
  __typename?: 'Customer';
  CustomerNumber: Scalars['String']['output'];
  CustomerTier: Scalars['String']['output'];
  ORDERHEADERs?: Maybe<Array<Maybe<Order>>>;
  _id: Scalars['Int']['output'];
};

export type DcProduct = {
  __typename?: 'DCProduct';
  DistributionCenter: Container;
  DistributionCenterID: Scalars['Int']['output'];
  Product: Product;
  ProductID: Scalars['Int']['output'];
  Velocity?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
};

export type DataColumn = {
  __typename?: 'DataColumn';
  CHARACTER_MAXIMUM_LENGTH?: Maybe<Scalars['Int']['output']>;
  COLUMN_NAME?: Maybe<Scalars['String']['output']>;
  DATA_TYPE?: Maybe<Scalars['String']['output']>;
  IS_NULLABLE?: Maybe<Scalars['String']['output']>;
  IS_PRIMARY_KEY?: Maybe<Scalars['String']['output']>;
};

export type DataTable = {
  __typename?: 'DataTable';
  TABLE_NAME?: Maybe<Scalars['String']['output']>;
};

export type DistributionCenter = {
  __typename?: 'DistributionCenter';
  DistributionCenter?: Maybe<Scalars['String']['output']>;
};

export type Equipment = {
  __typename?: 'Equipment';
  Name: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type EventLog = {
  __typename?: 'EventLog';
  CreateTime: Scalars['String']['output'];
  DateTime: Scalars['String']['output'];
  Event: Scalars['String']['output'];
  EventTypeID: Scalars['Int']['output'];
  Log: Scalars['String']['output'];
  Module: Scalars['String']['output'];
  UserName: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type EventType = {
  __typename?: 'EventType';
  Event: Scalars['String']['output'];
  Module: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type Globalmsg = {
  __typename?: 'GLOBALMSG';
  Message?: Maybe<Scalars['String']['output']>;
};

export type GlobalMessage = {
  __typename?: 'GlobalMessage';
  comments?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type HoldOnCounter = {
  __typename?: 'HoldOnCounter';
  User: Scalars['String']['output'];
  detail: Array<Maybe<Scalars['Int']['output']>>;
};

export type Imadjustreason = {
  __typename?: 'IMADJUSTREASON';
  Reason?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Imaudit = {
  __typename?: 'IMAUDIT';
  CreatedDatetime?: Maybe<Scalars['String']['output']>;
  InventoryID?: Maybe<Scalars['Int']['output']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  LastUpdated?: Maybe<Scalars['String']['output']>;
  Priority?: Maybe<Scalars['Int']['output']>;
  Trigger?: Maybe<Scalars['String']['output']>;
  Type?: Maybe<Audittype>;
  TypeID?: Maybe<Scalars['Int']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Imtrigger = {
  __typename?: 'IMTRIGGER';
  Active?: Maybe<Scalars['Boolean']['output']>;
  Description?: Maybe<Scalars['String']['output']>;
  IMTrigger_AuditTypes?: Maybe<Array<Maybe<ImTrigger_AuditType>>>;
  Name?: Maybe<Scalars['String']['output']>;
  Priority?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type ImTrigger_AuditType = {
  __typename?: 'IMTrigger_AuditType';
  IMAuditType?: Maybe<Audittype>;
  IMAuditTypeID?: Maybe<Scalars['Int']['output']>;
  IMTriggerID?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type ItnAndQuantity = {
  BinLocation: Scalars['String']['input'];
  ContainerID: Scalars['Int']['input'];
  ISO3: Scalars['String']['input'];
  ITN: Scalars['String']['input'];
  countryID: Scalars['Int']['input'];
  datecode: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
};

export type ItnColumn = {
  __typename?: 'ITNColumn';
  _id?: Maybe<Scalars['Int']['output']>;
  colSpan?: Maybe<Scalars['String']['output']>;
  dataName?: Maybe<Scalars['String']['output']>;
  drilldown?: Maybe<Scalars['Boolean']['output']>;
  eventGroup?: Maybe<Scalars['String']['output']>;
  eventName?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['Int']['output']>;
  searchable?: Maybe<Scalars['Boolean']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['String']['output']>;
};

export type ItnInfoforPulling = {
  __typename?: 'ITNInfoforPulling';
  Barcode?: Maybe<Scalars['String']['output']>;
  InventoryID?: Maybe<Scalars['Int']['output']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  NOSINumber?: Maybe<Scalars['String']['output']>;
  OrderNumber?: Maybe<Scalars['String']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
  QuantityOnHand?: Maybe<Scalars['Float']['output']>;
  StatusID?: Maybe<Scalars['Int']['output']>;
  WMSPriority?: Maybe<Scalars['Int']['output']>;
  Zone?: Maybe<Scalars['Int']['output']>;
};

export type Itnlifecycleprocess = {
  __typename?: 'ITNLIFECYCLEPROCESS';
  LastProcessedID?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Itnlifecycle_Report = {
  __typename?: 'ITNLIFECYCLE_Report';
  CustomerNumber?: Maybe<Scalars['String']['output']>;
  CustomerTier?: Maybe<Scalars['String']['output']>;
  DistributionCenter?: Maybe<Scalars['String']['output']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  NOSINumber?: Maybe<Scalars['String']['output']>;
  OrderLineNumber?: Maybe<Scalars['Int']['output']>;
  OrderNumber?: Maybe<Scalars['String']['output']>;
  ParentITN?: Maybe<Scalars['String']['output']>;
  PartNumber?: Maybe<Scalars['String']['output']>;
  Priority?: Maybe<Scalars['Boolean']['output']>;
  ProductCode?: Maybe<Scalars['String']['output']>;
  ProductTier?: Maybe<Scalars['String']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
  TrackingNumber?: Maybe<Scalars['String']['output']>;
  WMSPriority?: Maybe<Scalars['Int']['output']>;
  Zone?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
  after_InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  agDone?: Maybe<Scalars['String']['output']>;
  agDoneUser?: Maybe<Scalars['String']['output']>;
  agInDone?: Maybe<Scalars['String']['output']>;
  agOrderComplete?: Maybe<Scalars['String']['output']>;
  agOutStart?: Maybe<Scalars['String']['output']>;
  agRelocate?: Maybe<Scalars['String']['output']>;
  agStart?: Maybe<Scalars['String']['output']>;
  agStartUser?: Maybe<Scalars['String']['output']>;
  dropoffCartSelected?: Maybe<Scalars['String']['output']>;
  dropoffDone?: Maybe<Scalars['String']['output']>;
  dropoffITNSkipped?: Maybe<Scalars['String']['output']>;
  dropoffLine?: Maybe<Scalars['String']['output']>;
  dropoffLocationSelected?: Maybe<Scalars['String']['output']>;
  dropoffStart?: Maybe<Scalars['String']['output']>;
  dropoffUser?: Maybe<Scalars['String']['output']>;
  lineAllocation?: Maybe<Scalars['String']['output']>;
  lineAllocationUser?: Maybe<Scalars['String']['output']>;
  lineCancel?: Maybe<Scalars['String']['output']>;
  orderCancel?: Maybe<Scalars['String']['output']>;
  packDone?: Maybe<Scalars['String']['output']>;
  packLine?: Maybe<Scalars['String']['output']>;
  packLineUser?: Maybe<Scalars['String']['output']>;
  packNewPackage?: Maybe<Scalars['String']['output']>;
  packReject?: Maybe<Scalars['String']['output']>;
  packStart?: Maybe<Scalars['String']['output']>;
  packSupervisorCheck?: Maybe<Scalars['String']['output']>;
  pickCartAssigned?: Maybe<Scalars['String']['output']>;
  pickDone?: Maybe<Scalars['String']['output']>;
  pickDoneUser?: Maybe<Scalars['String']['output']>;
  pickITNNF?: Maybe<Scalars['String']['output']>;
  pickITNPrint?: Maybe<Scalars['String']['output']>;
  pickITNScan?: Maybe<Scalars['String']['output']>;
  pickLabelCount?: Maybe<Scalars['String']['output']>;
  pickLabelQuantity?: Maybe<Scalars['String']['output']>;
  pickLocationScan?: Maybe<Scalars['String']['output']>;
  pickOverPick?: Maybe<Scalars['String']['output']>;
  pickQuantityEntered?: Maybe<Scalars['String']['output']>;
  pickShortPick?: Maybe<Scalars['String']['output']>;
  pickStart?: Maybe<Scalars['String']['output']>;
  pickStartUser?: Maybe<Scalars['String']['output']>;
  pickStatus15?: Maybe<Scalars['String']['output']>;
  pickToteAssignment?: Maybe<Scalars['String']['output']>;
  pickUserExit?: Maybe<Scalars['String']['output']>;
  pullingCartSelected?: Maybe<Scalars['String']['output']>;
  pullingDone?: Maybe<Scalars['String']['output']>;
  pullingLocationSelected?: Maybe<Scalars['String']['output']>;
  pullingNotFound?: Maybe<Scalars['String']['output']>;
  pullingStart?: Maybe<Scalars['String']['output']>;
  qcDone?: Maybe<Scalars['String']['output']>;
  qcDoneUser?: Maybe<Scalars['String']['output']>;
  qcHold?: Maybe<Scalars['String']['output']>;
  qcOrderComplete?: Maybe<Scalars['String']['output']>;
  qcStart?: Maybe<Scalars['String']['output']>;
  qcStartUser?: Maybe<Scalars['String']['output']>;
  qcStatus40?: Maybe<Scalars['String']['output']>;
  qcStatus41?: Maybe<Scalars['String']['output']>;
  releaseLine?: Maybe<Scalars['String']['output']>;
  releaseOrder?: Maybe<Scalars['String']['output']>;
  shippingManifest?: Maybe<Scalars['String']['output']>;
  splitDone?: Maybe<Scalars['String']['output']>;
};

export type ItnLifeCycleDrillDown = {
  __typename?: 'ITNLifeCycleDrillDown';
  CustomerNumber?: Maybe<Scalars['String']['output']>;
  CustomerTier?: Maybe<Scalars['String']['output']>;
  DateTime?: Maybe<Scalars['String']['output']>;
  DistributionCenter?: Maybe<Scalars['String']['output']>;
  Event?: Maybe<Scalars['String']['output']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  Message?: Maybe<Scalars['String']['output']>;
  Module?: Maybe<Scalars['String']['output']>;
  NOSINumber?: Maybe<Scalars['String']['output']>;
  OrderLineNumber?: Maybe<Scalars['String']['output']>;
  OrderNumber?: Maybe<Scalars['String']['output']>;
  ParentITN?: Maybe<Scalars['String']['output']>;
  PartNumber?: Maybe<Scalars['String']['output']>;
  Priority?: Maybe<Scalars['Boolean']['output']>;
  ProductCode?: Maybe<Scalars['String']['output']>;
  ProductTier?: Maybe<Scalars['String']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
  ShipmentMethod?: Maybe<Scalars['String']['output']>;
  ShipmentMethodDescription?: Maybe<Scalars['String']['output']>;
  TrackingNumber?: Maybe<Scalars['String']['output']>;
  UserEventID?: Maybe<Scalars['Int']['output']>;
  UserName?: Maybe<Scalars['String']['output']>;
  WMSPriority?: Maybe<Scalars['Int']['output']>;
  Zone?: Maybe<Scalars['Int']['output']>;
};

export type ItnLifeCycle_Report = {
  __typename?: 'ITNLifeCycle_Report';
  CustomerNumber?: Maybe<Scalars['String']['output']>;
  CustomerTier?: Maybe<Scalars['String']['output']>;
  DistributionCenter?: Maybe<Scalars['String']['output']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  NOSINumber?: Maybe<Scalars['String']['output']>;
  OrderLineNumber?: Maybe<Scalars['Int']['output']>;
  OrderNOSI?: Maybe<Scalars['String']['output']>;
  OrderNumber?: Maybe<Scalars['String']['output']>;
  ParentITN?: Maybe<Scalars['String']['output']>;
  PartNumber?: Maybe<Scalars['String']['output']>;
  Priority?: Maybe<Scalars['Boolean']['output']>;
  ProductCode?: Maybe<Scalars['String']['output']>;
  ProductTier?: Maybe<Scalars['String']['output']>;
  Quantity?: Maybe<Scalars['Int']['output']>;
  TrackingNumber?: Maybe<Scalars['String']['output']>;
  WMSPriority?: Maybe<Scalars['Int']['output']>;
  Zone?: Maybe<Scalars['Int']['output']>;
  after_InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  agDone?: Maybe<Scalars['String']['output']>;
  agDoneUser?: Maybe<Scalars['String']['output']>;
  agInDone?: Maybe<Scalars['String']['output']>;
  agOrderComplete?: Maybe<Scalars['String']['output']>;
  agOutStart?: Maybe<Scalars['String']['output']>;
  agRelocate?: Maybe<Scalars['String']['output']>;
  agStart?: Maybe<Scalars['String']['output']>;
  agStartUser?: Maybe<Scalars['String']['output']>;
  dropoffCartSelected?: Maybe<Scalars['String']['output']>;
  dropoffDone?: Maybe<Scalars['String']['output']>;
  dropoffITNSkipped?: Maybe<Scalars['String']['output']>;
  dropoffLine?: Maybe<Scalars['String']['output']>;
  dropoffLocationSelected?: Maybe<Scalars['String']['output']>;
  dropoffStart?: Maybe<Scalars['String']['output']>;
  dropoffUser?: Maybe<Scalars['String']['output']>;
  lineAllocation?: Maybe<Scalars['String']['output']>;
  lineAllocationUser?: Maybe<Scalars['String']['output']>;
  lineCancel?: Maybe<Scalars['String']['output']>;
  orderCancel?: Maybe<Scalars['String']['output']>;
  packDone?: Maybe<Scalars['String']['output']>;
  packLine?: Maybe<Scalars['String']['output']>;
  packLineUser?: Maybe<Scalars['String']['output']>;
  packNewPackage?: Maybe<Scalars['String']['output']>;
  packReject?: Maybe<Scalars['String']['output']>;
  packStart?: Maybe<Scalars['String']['output']>;
  packSupervisorCheck?: Maybe<Scalars['String']['output']>;
  pickCartAssigned?: Maybe<Scalars['String']['output']>;
  pickDone?: Maybe<Scalars['String']['output']>;
  pickDoneUser?: Maybe<Scalars['String']['output']>;
  pickITNNF?: Maybe<Scalars['String']['output']>;
  pickITNPrint?: Maybe<Scalars['String']['output']>;
  pickITNScan?: Maybe<Scalars['String']['output']>;
  pickLabelCount?: Maybe<Scalars['String']['output']>;
  pickLabelQuantity?: Maybe<Scalars['String']['output']>;
  pickLocationScan?: Maybe<Scalars['String']['output']>;
  pickOverPick?: Maybe<Scalars['String']['output']>;
  pickQuantityEntered?: Maybe<Scalars['String']['output']>;
  pickShortPick?: Maybe<Scalars['String']['output']>;
  pickStart?: Maybe<Scalars['String']['output']>;
  pickStartUser?: Maybe<Scalars['String']['output']>;
  pickStatus15?: Maybe<Scalars['String']['output']>;
  pickToteAssignment?: Maybe<Scalars['String']['output']>;
  pickUserExit?: Maybe<Scalars['String']['output']>;
  pullingCartSelected?: Maybe<Scalars['String']['output']>;
  pullingDone?: Maybe<Scalars['String']['output']>;
  pullingLocationSelected?: Maybe<Scalars['String']['output']>;
  pullingNotFound?: Maybe<Scalars['String']['output']>;
  pullingStart?: Maybe<Scalars['String']['output']>;
  qcDone?: Maybe<Scalars['String']['output']>;
  qcDoneUser?: Maybe<Scalars['String']['output']>;
  qcHold?: Maybe<Scalars['String']['output']>;
  qcOrderComplete?: Maybe<Scalars['String']['output']>;
  qcStart?: Maybe<Scalars['String']['output']>;
  qcStartUser?: Maybe<Scalars['String']['output']>;
  qcStatus40?: Maybe<Scalars['String']['output']>;
  qcStatus41?: Maybe<Scalars['String']['output']>;
  releaseLine?: Maybe<Scalars['String']['output']>;
  releaseOrder?: Maybe<Scalars['String']['output']>;
  shipmentMethod?: Maybe<Scalars['String']['output']>;
  shipmentMethodDescription?: Maybe<Scalars['String']['output']>;
  shippingManifest?: Maybe<Scalars['String']['output']>;
  splitDone?: Maybe<Scalars['String']['output']>;
  splitDoneUser?: Maybe<Scalars['String']['output']>;
};

export type ItnUserColumn = {
  __typename?: 'ITNUserColumn';
  LowLevelLimit?: Maybe<Scalars['Int']['output']>;
  MediumLevelLimit?: Maybe<Scalars['Int']['output']>;
  SelectedColumns?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type ItnUserColumns = {
  __typename?: 'ITNUserColumns';
  SelectedColumns?: Maybe<Scalars['String']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

export type ItnUserLevelLimit = {
  __typename?: 'ITNUserLevelLimit';
  EventID?: Maybe<Scalars['Int']['output']>;
  EventName?: Maybe<Scalars['String']['output']>;
  LowLevelLimit?: Maybe<Scalars['Int']['output']>;
  MediumLevelLimit?: Maybe<Scalars['Int']['output']>;
  TemplateID?: Maybe<Scalars['Int']['output']>;
  _id: Scalars['Int']['output'];
};

export type ItnUserLevels = {
  __typename?: 'ITNUserLevels';
  LowLevelLimit?: Maybe<Scalars['Int']['output']>;
  MediumLevelLimit?: Maybe<Scalars['Int']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
};

export type ItnUserTemplate = {
  __typename?: 'ITNUserTemplate';
  DefaultPagination?: Maybe<Scalars['Int']['output']>;
  DefaultTemplate?: Maybe<Scalars['Boolean']['output']>;
  ITNLEVELLIMITs?: Maybe<Array<Maybe<ItnUserLevelLimit>>>;
  SelectedColumns?: Maybe<Scalars['String']['output']>;
  TemplateName?: Maybe<Scalars['String']['output']>;
  UserID?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Inventory = {
  __typename?: 'Inventory';
  BinLocation?: Maybe<Scalars['String']['output']>;
  BoundForAutostore?: Maybe<Scalars['Boolean']['output']>;
  Container: Container;
  ContainerID: Scalars['Int']['output'];
  Country?: Maybe<Country>;
  CountryID?: Maybe<Scalars['Int']['output']>;
  DateCode?: Maybe<Scalars['String']['output']>;
  DistributionCenter: Scalars['String']['output'];
  InventoryTrackingNumber: Scalars['String']['output'];
  Inventory_SuspectReasons?: Maybe<Array<Maybe<Inventory_SuspectReason>>>;
  LocatedInAutostore?: Maybe<Scalars['Boolean']['output']>;
  NotFound: Scalars['Boolean']['output'];
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  OriginalQuantity?: Maybe<Scalars['Float']['output']>;
  ParentITN?: Maybe<Scalars['String']['output']>;
  Product: Product;
  ProductID: Scalars['Int']['output'];
  QuantityOnHand: Scalars['Float']['output'];
  ROHS?: Maybe<Scalars['Boolean']['output']>;
  Suspect: Scalars['Boolean']['output'];
  _id: Scalars['Int']['output'];
};

export type InventoryForMerp = {
  CreatingProgram: Scalars['String']['input'];
  PartNumber: Scalars['String']['input'];
  ProductCode: Scalars['String']['input'];
  PurchaseOrderLine?: InputMaybe<Scalars['String']['input']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']['input']>;
  User: Scalars['String']['input'];
};

export type InventoryUpdateForMerp = {
  BinLocation?: InputMaybe<Scalars['String']['input']>;
  ITN: Scalars['String']['input'];
  LocatedInAutostore?: InputMaybe<Scalars['String']['input']>;
  Suspect?: InputMaybe<Scalars['String']['input']>;
  User: Scalars['String']['input'];
};

export type Inventory_SuspectReason = {
  __typename?: 'Inventory_SuspectReason';
  Inventory: Inventory;
  InventoryID: Scalars['Int']['output'];
  SuspectReason: SuspectReason;
  SuspectReasonID: Scalars['Int']['output'];
  _id: Scalars['Int']['output'];
};

export type Menu = {
  __typename?: 'Menu';
  ADGroupProtected?: Maybe<Scalars['Boolean']['output']>;
  CoverSrc?: Maybe<Scalars['String']['output']>;
  End?: Maybe<Scalars['String']['output']>;
  Front?: Maybe<Scalars['String']['output']>;
  Groups?: Maybe<Scalars['String']['output']>;
  Highlight?: Maybe<Scalars['String']['output']>;
  Level?: Maybe<Scalars['Int']['output']>;
  Order?: Maybe<Scalars['Int']['output']>;
  ParentID?: Maybe<Scalars['Int']['output']>;
  Route?: Maybe<Scalars['String']['output']>;
  RouteID?: Maybe<Scalars['Int']['output']>;
  Title?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type MenuGroup = {
  __typename?: 'MenuGroup';
  ADGroup?: Maybe<Scalars['String']['output']>;
  MenuID?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  ITNSplitAndPrintLabels: Array<Maybe<Scalars['String']['output']>>;
  addWeightScale?: Maybe<Scalars['Boolean']['output']>;
  changeItnListForMerp?: Maybe<Scalars['Boolean']['output']>;
  changeQCLineInfo: Response;
  cleanContainerFromPrevOrder?: Maybe<Scalars['Boolean']['output']>;
  clearAudits?: Maybe<Array<Maybe<Audit>>>;
  clearAuditsFromTimeout?: Maybe<Array<Maybe<Audit>>>;
  clearITNUserDefaultTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  clearMerpTote: Response;
  clearSuspectInventory: Scalars['Boolean']['output'];
  clearTimeoutAudits?: Maybe<Audit>;
  closeAudit?: Maybe<Audit>;
  closeAudits?: Maybe<Array<Maybe<Audit>>>;
  createContainer?: Maybe<Scalars['Boolean']['output']>;
  createITN: Scalars['String']['output'];
  createInventoryFromOMS?: Maybe<Scalars['Boolean']['output']>;
  deleteAndInsertRouteTable: Scalars['Boolean']['output'];
  deleteAudit?: Maybe<Audit>;
  deleteAudits?: Maybe<Audit>;
  deleteAuditsList?: Maybe<Scalars['Boolean']['output']>;
  deleteAutostoreOrderLineHistory?: Maybe<Autostoreorderline>;
  deleteAutostoreOrderLines?: Maybe<Autostoreorderline>;
  deleteContainerFromMerp?: Maybe<Scalars['Boolean']['output']>;
  deleteCustomerFromMerp?: Maybe<Scalars['Boolean']['output']>;
  deleteGlobalMessageFromMerp?: Maybe<Scalars['Boolean']['output']>;
  deleteITNLevelLimit?: Maybe<Array<Maybe<ItnUserLevelLimit>>>;
  deleteITNUserTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  deleteInventoryFromMerp?: Maybe<Scalars['Boolean']['output']>;
  deleteInventorySuspectReason: Scalars['Int']['output'];
  deleteInventorySuspectReasonFromMerp?: Maybe<Scalars['Boolean']['output']>;
  deleteOrder?: Maybe<Scalars['Boolean']['output']>;
  deleteOrderLine?: Maybe<Scalars['Boolean']['output']>;
  deleteOrderLineDetail?: Maybe<Scalars['Boolean']['output']>;
  deleteOrderLineDetailFromMerp?: Maybe<Scalars['Boolean']['output']>;
  deletePrinter?: Maybe<Printer>;
  deleteProductFromMerp?: Maybe<Scalars['Boolean']['output']>;
  deletePurchaseOrderLineFromMerp?: Maybe<Scalars['Boolean']['output']>;
  deleteReceipt?: Maybe<Array<Maybe<ReceiptDeleteResult>>>;
  deleteReceiptLD?: Maybe<Scalars['Boolean']['output']>;
  deleteReceiptLine?: Maybe<Array<Maybe<ReceiptL>>>;
  deleteReceiptLineDetail?: Maybe<ReceiptLd>;
  deleteReceiptLineDetails?: Maybe<Array<Maybe<ReceiptLd>>>;
  deleteTableData?: Maybe<TableData>;
  deleteUserZone?: Maybe<Zone>;
  deleteValueMap?: Maybe<ValueMap>;
  deleteVendorFromMerp?: Maybe<Scalars['Boolean']['output']>;
  findOrCreateOrder: Order;
  findOrCreateOrderLine: OrderLine;
  findOrCreateProduct: Product;
  findOrCreateReceiptLD: ReceiptLd;
  findOrCreateUserContainer?: Maybe<Container>;
  findOrCreateUserInfo?: Maybe<UserInfo>;
  generateReceiptForReceiving?: Maybe<Scalars['Int']['output']>;
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
  insertEventLogs: Scalars['Boolean']['output'];
  insertITNLevelLimit?: Maybe<ItnUserLevelLimit>;
  insertITNUserColumns?: Maybe<ItnUserColumns>;
  insertITNUserLevels?: Maybe<ItnUserLevels>;
  insertITNUserTemplate?: Maybe<ItnUserTemplate>;
  insertInventorySuspectReason?: Maybe<Scalars['Boolean']['output']>;
  insertInventorySuspectReasonFromMerp?: Maybe<Scalars['Boolean']['output']>;
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
  inventoryUpdate?: Maybe<UpdateResult>;
  itnChange?: Maybe<Scalars['Boolean']['output']>;
  itnEvent?: Maybe<Itnlifecycle_Report>;
  itnLocationChange?: Maybe<Scalars['Boolean']['output']>;
  orderEvent?: Maybe<Itnlifecycle_Report>;
  pickOrderForAgOut?: Maybe<OrderForAgOut>;
  printITNLabel: Response;
  processSystemTrigger?: Maybe<Scalars['String']['output']>;
  recreateITN?: Maybe<UpdateResult>;
  removeAudit?: Maybe<Audit>;
  removeWeightScale?: Maybe<Scalars['Boolean']['output']>;
  replanPick?: Maybe<UpdateResult>;
  rollbackAutostoreOrderLines?: Maybe<Autostoreorderline>;
  suspectInventory: Scalars['Boolean']['output'];
  updateASNInventory?: Maybe<Scalars['Boolean']['output']>;
  updateASNReplenishmentItem?: Maybe<Asnreplenishmentitem>;
  updateAfterReceiving?: Maybe<Scalars['Boolean']['output']>;
  updateAudit?: Maybe<Array<Maybe<Audit>>>;
  updateAutostoreASN?: Maybe<Autostoreasnheader>;
  updateAutostoreMessage?: Maybe<Autostoremessage>;
  updateAutostoreProcess?: Maybe<Autostoreprocess>;
  updateContainer?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateContainerList?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateForContainerFromMerp?: Maybe<Scalars['Boolean']['output']>;
  updateForCustomerFromMerp?: Maybe<Scalars['Boolean']['output']>;
  updateForInventoryFromMerp?: Maybe<Scalars['Boolean']['output']>;
  updateForOrderLineDetailFromMerp?: Maybe<Scalars['Boolean']['output']>;
  updateForProductFromMerp?: Maybe<Scalars['Boolean']['output']>;
  updateForPurchaseOrderLineFromMerp?: Maybe<Scalars['Boolean']['output']>;
  updateGlobalMessageFromMerp?: Maybe<Scalars['Boolean']['output']>;
  updateITNLifeCycleProcess?: Maybe<Itnlifecycleprocess>;
  updateITNUserColumns?: Maybe<ItnUserColumns>;
  updateITNUserLevels?: Maybe<ItnUserLevels>;
  updateITNUserTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  updateInventory?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateInventoryList?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateLastUpdated?: Maybe<Audit>;
  updateMerpOrderStatus: Response;
  updateMerpQCBin: Response;
  updateMerpWMSLog: Response;
  updateNotFoundForStocking?: Maybe<Scalars['Boolean']['output']>;
  updateOrder?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateOrderLastSync?: Maybe<UpdatedOrder>;
  updateOrderLine?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateOrderLineDetail?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateOrderLineDetailList?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updatePickingCalendarSettings: Scalars['Boolean']['output'];
  updatePrinter?: Maybe<Printer>;
  updateProduct?: Maybe<Product>;
  updateProductLastSync?: Maybe<UpdatedProduct>;
  updateReceipt?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateReceiptLD?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateReceiptLine?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateReceiptLineDetail?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateReceiptLsByID?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateSystemTrigger?: Maybe<Imtrigger>;
  updateTableData?: Maybe<TableData>;
  updateUserCart?: Maybe<Container>;
  updateUserCartForDropOff?: Maybe<Container>;
  updateUserInfo?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateValueMap?: Maybe<ValueMap>;
  updateVendorFromMerp?: Maybe<Scalars['Boolean']['output']>;
};

export type MutationItnSplitAndPrintLabelsArgs = {
  DPI: Scalars['String']['input'];
  ITN: Scalars['String']['input'];
  ORIENTATION: Scalars['String']['input'];
  PARTNUMBER: Scalars['String']['input'];
  PRINTER: Scalars['String']['input'];
  PRODUCTCODE: Scalars['String']['input'];
  QuantityList: Array<InputMaybe<Scalars['Float']['input']>>;
  User: Scalars['String']['input'];
};

export type MutationChangeItnListForMerpArgs = {
  ITNList: Array<InputMaybe<InventoryUpdateForMerp>>;
};

export type MutationChangeQcLineInfoArgs = {
  CountMethod: Scalars['String']['input'];
  CountryOfOrigin: Scalars['String']['input'];
  DateCode: Scalars['String']['input'];
  InternalTrackingNumber: Scalars['String']['input'];
  ROHS: Scalars['String']['input'];
};

export type MutationCleanContainerFromPrevOrderArgs = {
  ContainerID: Scalars['Int']['input'];
  Inventory: UpdateInventory;
  OrderID: Scalars['Int']['input'];
};

export type MutationClearAuditsArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  Username?: InputMaybe<Scalars['String']['input']>;
};

export type MutationClearAuditsFromTimeoutArgs = {
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationClearItnUserDefaultTemplateArgs = {
  UserID: Scalars['Int']['input'];
};

export type MutationClearMerpToteArgs = {
  NOSINumber: Scalars['String']['input'];
  OrderNumber: Scalars['String']['input'];
};

export type MutationClearSuspectInventoryArgs = {
  DistributionCenter: Scalars['String']['input'];
  InventoryTrackingNumber: Scalars['String']['input'];
};

export type MutationClearTimeoutAuditsArgs = {
  Seconds?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationCloseAuditArgs = {
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  TypeID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationCloseAuditsArgs = {
  ITN?: InputMaybe<Scalars['String']['input']>;
};

export type MutationCreateContainerArgs = {
  BinLocation: Scalars['String']['input'];
};

export type MutationCreateItnArgs = {
  LocationCode: Scalars['String']['input'];
};

export type MutationCreateInventoryFromOmsArgs = {
  ITNList: Array<InputMaybe<ItnAndQuantity>>;
  Inventory: UpdateInventory;
  info: InventoryForMerp;
};

export type MutationDeleteAndInsertRouteTableArgs = {
  lpnList: Array<InputMaybe<Scalars['String']['input']>>;
};

export type MutationDeleteAuditArgs = {
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  TypeID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteAuditsArgs = {
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteAuditsListArgs = {
  InventoryIDs?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type MutationDeleteAutostoreOrderLineHistoryArgs = {
  AutostoreOrderHID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteAutostoreOrderLinesArgs = {
  AutostoreOrderHID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteContainerFromMerpArgs = {
  BinLocation: Scalars['String']['input'];
  DistributionCenter: Scalars['String']['input'];
};

export type MutationDeleteCustomerFromMerpArgs = {
  CustomerNumber: Scalars['String']['input'];
};

export type MutationDeleteGlobalMessageFromMerpArgs = {
  PartNumber?: InputMaybe<Scalars['String']['input']>;
  ProductCode?: InputMaybe<Scalars['String']['input']>;
  Sequence?: InputMaybe<Scalars['String']['input']>;
};

export type MutationDeleteItnLevelLimitArgs = {
  TemplateID: Scalars['Int']['input'];
};

export type MutationDeleteItnUserTemplateArgs = {
  _id: Scalars['Int']['input'];
};

export type MutationDeleteInventoryFromMerpArgs = {
  BinLocation: Scalars['String']['input'];
  DistributionCenter: Scalars['String']['input'];
  ITN: Scalars['String']['input'];
};

export type MutationDeleteInventorySuspectReasonArgs = {
  InventorySuspect?: InputMaybe<SearchInventorySuspectReason>;
};

export type MutationDeleteInventorySuspectReasonFromMerpArgs = {
  DC: Scalars['String']['input'];
  ITN: Scalars['String']['input'];
  ReasonID: Scalars['Int']['input'];
};

export type MutationDeleteOrderArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  NOSINumber?: InputMaybe<Scalars['String']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteOrderLineArgs = {
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteOrderLineDetailArgs = {
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  OrderLineID?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteOrderLineDetailFromMerpArgs = {
  BinLocation: Scalars['String']['input'];
  DistributionCenter: Scalars['String']['input'];
  InventoryTrackingNumber: Scalars['String']['input'];
  NOSINumber: Scalars['String']['input'];
  OrderLineNumber: Scalars['Int']['input'];
  OrderNumber: Scalars['String']['input'];
};

export type MutationDeletePrinterArgs = {
  _id: Scalars['Int']['input'];
};

export type MutationDeleteProductFromMerpArgs = {
  PartNumber: Scalars['String']['input'];
  ProductCode: Scalars['String']['input'];
};

export type MutationDeletePurchaseOrderLineFromMerpArgs = {
  LineNumber: Scalars['Int']['input'];
  LocationCode: Scalars['String']['input'];
  PurchaseOrderNumber: Scalars['String']['input'];
};

export type MutationDeleteReceiptArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  ReceiptID?: InputMaybe<Scalars['Int']['input']>;
  ReceiptLineDeleteEventID?: InputMaybe<Scalars['Int']['input']>;
  ReceiptLineDetailDeleteEventID?: InputMaybe<Scalars['Int']['input']>;
  Username?: InputMaybe<Scalars['String']['input']>;
};

export type MutationDeleteReceiptLdArgs = {
  PurchaseOrderLID?: InputMaybe<Scalars['Int']['input']>;
  ReceiptLID?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteReceiptLineArgs = {
  ReceiptLineID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteReceiptLineDetailArgs = {
  ReceiptLDID: Scalars['Int']['input'];
};

export type MutationDeleteReceiptLineDetailsArgs = {
  ReceiptLineID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteTableDataArgs = {
  DeleteQuery?: InputMaybe<Scalars['String']['input']>;
};

export type MutationDeleteUserZoneArgs = {
  UserID?: InputMaybe<Scalars['Int']['input']>;
  ZoneID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationDeleteValueMapArgs = {
  _id: Scalars['Int']['input'];
};

export type MutationDeleteVendorFromMerpArgs = {
  VendorNumber: Scalars['String']['input'];
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
  LineNumber: Scalars['Int']['input'];
  OverReceipt?: InputMaybe<Scalars['Boolean']['input']>;
  PurchaseOrderNumber: Scalars['String']['input'];
  Quantity: Scalars['Float']['input'];
};

export type MutationGlobalAsnRejectionArgs = {
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationHoldQcOrderArgs = {
  InternalTrackingNumber: Scalars['String']['input'];
  Station: Scalars['String']['input'];
  Status: Scalars['String']['input'];
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
  AutostoreOrderHID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationInsertEventLogsArgs = {
  logs: Array<InputMaybe<InsertEventLog>>;
};

export type MutationInsertItnLevelLimitArgs = {
  EventID?: InputMaybe<Scalars['Int']['input']>;
  EventName?: InputMaybe<Scalars['String']['input']>;
  LowLevelLimit?: InputMaybe<Scalars['Int']['input']>;
  MediumLevelLimit?: InputMaybe<Scalars['Int']['input']>;
  TemplateID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationInsertItnUserColumnsArgs = {
  ITNUserColumns: Array<InputMaybe<InsertItnUserColumnsInfo>>;
};

export type MutationInsertItnUserLevelsArgs = {
  ITNUserLevels: Array<InputMaybe<InsertItnUserLevelsInfo>>;
};

export type MutationInsertItnUserTemplateArgs = {
  DefaultTemplate?: InputMaybe<Scalars['Boolean']['input']>;
  SelectedColumns?: InputMaybe<Scalars['String']['input']>;
  TemplateName?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationInsertInventorySuspectReasonArgs = {
  linkList?: InputMaybe<Array<InputMaybe<InsertInventorySuspectReason>>>;
};

export type MutationInsertInventorySuspectReasonFromMerpArgs = {
  DC: Scalars['String']['input'];
  ITN: Scalars['String']['input'];
  ReasonID: Scalars['Int']['input'];
};

export type MutationInsertPrinterArgs = {
  Active?: InputMaybe<Scalars['Boolean']['input']>;
  DPI?: InputMaybe<Scalars['Int']['input']>;
  Description?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Orientation?: InputMaybe<Scalars['String']['input']>;
  StationName?: InputMaybe<Scalars['String']['input']>;
};

export type MutationInsertReceiptArgs = {
  Receipt?: InputMaybe<InsertReceiptH>;
};

export type MutationInsertReceiptLineArgs = {
  CountryID?: InputMaybe<Scalars['Int']['input']>;
  DateCode?: InputMaybe<Scalars['String']['input']>;
  ExpectedQuantity: Scalars['Int']['input'];
  ProductID: Scalars['Int']['input'];
  ROHS?: InputMaybe<Scalars['Boolean']['input']>;
  ReceiptHID: Scalars['Int']['input'];
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
  AuditTypes?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  Trigger?: InputMaybe<ImTrigger>;
};

export type MutationInsertTableDataArgs = {
  InsertQuery?: InputMaybe<Scalars['String']['input']>;
};

export type MutationInsertUserEventLogsArgs = {
  log: Array<InputMaybe<InsertUserEventLog>>;
};

export type MutationInsertUserZoneArgs = {
  UserID?: InputMaybe<Scalars['Int']['input']>;
  ZoneID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationInsertValueMapArgs = {
  SourceColumnName?: InputMaybe<Scalars['String']['input']>;
  SourceSystemName?: InputMaybe<Scalars['String']['input']>;
  SourceTableName?: InputMaybe<Scalars['String']['input']>;
  SourceValue?: InputMaybe<Scalars['String']['input']>;
  TargetColumnName?: InputMaybe<Scalars['String']['input']>;
  TargetSystemName?: InputMaybe<Scalars['String']['input']>;
  TargetTableName?: InputMaybe<Scalars['String']['input']>;
  TargetValue?: InputMaybe<Scalars['String']['input']>;
};

export type MutationInventoryUpdateArgs = {
  AdjustmentReason?: InputMaybe<Scalars['String']['input']>;
  BinLocation?: InputMaybe<Scalars['String']['input']>;
  CountryOfOrigin?: InputMaybe<Scalars['String']['input']>;
  DateCode?: InputMaybe<Scalars['String']['input']>;
  ITN: Scalars['String']['input'];
  QuantityOnHand?: InputMaybe<Scalars['String']['input']>;
  ROHSFlag?: InputMaybe<Scalars['String']['input']>;
  Suspect?: InputMaybe<Scalars['String']['input']>;
  User: Scalars['String']['input'];
  VerificationState?: InputMaybe<Scalars['String']['input']>;
};

export type MutationItnChangeArgs = {
  BinLocation: Scalars['String']['input'];
  BoundForAutostore?: InputMaybe<Scalars['String']['input']>;
  ITN: Scalars['String']['input'];
  Suspect?: InputMaybe<Scalars['String']['input']>;
  User: Scalars['String']['input'];
};

export type MutationItnEventArgs = {
  After?: InputMaybe<Scalars['Boolean']['input']>;
  EventID?: InputMaybe<Scalars['Int']['input']>;
  ITNLC?: InputMaybe<ItnLifeCycle>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  LogID?: InputMaybe<Scalars['Int']['input']>;
  NOSINumber?: InputMaybe<Scalars['String']['input']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  ParentITN?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

export type MutationItnLocationChangeArgs = {
  BinLocation: Scalars['String']['input'];
  ITN: Scalars['String']['input'];
  User: Scalars['String']['input'];
};

export type MutationOrderEventArgs = {
  LogID?: InputMaybe<Scalars['Int']['input']>;
  NOSINumber?: InputMaybe<Scalars['String']['input']>;
  ORDERLC?: InputMaybe<ItnLifeCycle>;
  OrderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

export type MutationPrintItnLabelArgs = {
  InternalTrackingNumber: Scalars['String']['input'];
  Station: Scalars['String']['input'];
};

export type MutationProcessSystemTriggerArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  ITN?: InputMaybe<Scalars['String']['input']>;
  LocationCode?: InputMaybe<Scalars['String']['input']>;
  OrderLineNumber?: InputMaybe<Scalars['String']['input']>;
  OrderNumberNOSI?: InputMaybe<Scalars['String']['input']>;
  Source?: InputMaybe<Scalars['String']['input']>;
  TriggerName?: InputMaybe<Scalars['String']['input']>;
  Username?: InputMaybe<Scalars['String']['input']>;
};

export type MutationRecreateItnArgs = {
  BINLOCATION: Scalars['String']['input'];
  ITN: Scalars['String']['input'];
  QUANTITY: Scalars['String']['input'];
  User: Scalars['String']['input'];
  WAREHOUSE: Scalars['String']['input'];
};

export type MutationRemoveAuditArgs = {
  ID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationReplanPickArgs = {
  ITN?: InputMaybe<Scalars['String']['input']>;
  LocationCode?: InputMaybe<Scalars['String']['input']>;
  OrderLineNumber?: InputMaybe<Scalars['String']['input']>;
  OrderNumberNOSI?: InputMaybe<Scalars['String']['input']>;
};

export type MutationRollbackAutostoreOrderLinesArgs = {
  AutostoreOrderHID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationSuspectInventoryArgs = {
  DistributionCenter: Scalars['String']['input'];
  InventoryTrackingNumber: Scalars['String']['input'];
  reasonIDList: Array<InputMaybe<Scalars['Int']['input']>>;
};

export type MutationUpdateAsnInventoryArgs = {
  BoundForAutostore?: InputMaybe<Scalars['Boolean']['input']>;
  ContainerID?: InputMaybe<Scalars['Int']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  Suspect?: InputMaybe<Scalars['Boolean']['input']>;
  SuspectReasonID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateAsnReplenishmentItemArgs = {
  ReplenishmentItem?: InputMaybe<AsnReplenishmentItem>;
};

export type MutationUpdateAfterReceivingArgs = {
  ITNList?: InputMaybe<Array<InputMaybe<ItnAndQuantity>>>;
  Inventory: UpdateInventory;
  ReceiptLID: Scalars['Int']['input'];
};

export type MutationUpdateAuditArgs = {
  Audit?: InputMaybe<InputAudit>;
  ID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateAutostoreAsnArgs = {
  ASN?: InputMaybe<AutostoreAsnHeader>;
  ASNID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateAutostoreMessageArgs = {
  AutostoreMessage?: InputMaybe<AutostoreMessage>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateAutostoreProcessArgs = {
  AutostoreProcess?: InputMaybe<AutostoreProcess>;
  ID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateContainerArgs = {
  Barcode?: InputMaybe<Scalars['String']['input']>;
  Container: UpdateContainer;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateContainerListArgs = {
  BarcodeList?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  Container: UpdateContainer;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  idList?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type MutationUpdateForContainerFromMerpArgs = {
  BinLocation: Scalars['String']['input'];
  DistributionCenter: Scalars['String']['input'];
  Type: Scalars['String']['input'];
  Velocity?: InputMaybe<Scalars['String']['input']>;
  Zone?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateForCustomerFromMerpArgs = {
  CustomerNumber: Scalars['String']['input'];
  CustomerTier?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateForInventoryFromMerpArgs = {
  Autostore?: InputMaybe<Scalars['Boolean']['input']>;
  BinLocation: Scalars['String']['input'];
  BoundForAutostore?: InputMaybe<Scalars['Boolean']['input']>;
  CountryOfOrigin?: InputMaybe<Scalars['String']['input']>;
  DateCode?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter: Scalars['String']['input'];
  ITN: Scalars['String']['input'];
  LocatedInAutostore?: InputMaybe<Scalars['Boolean']['input']>;
  MICPartNumber?: InputMaybe<Scalars['String']['input']>;
  OriginalQuantity?: InputMaybe<Scalars['Float']['input']>;
  PackQty?: InputMaybe<Scalars['Float']['input']>;
  PackType?: InputMaybe<Scalars['String']['input']>;
  ParentITN?: InputMaybe<Scalars['String']['input']>;
  PartNumber: Scalars['String']['input'];
  ProductCode: Scalars['String']['input'];
  ProductTier?: InputMaybe<Scalars['String']['input']>;
  QuantityOnHand: Scalars['Float']['input'];
  ROHS?: InputMaybe<Scalars['Boolean']['input']>;
  Suspect?: InputMaybe<Scalars['Boolean']['input']>;
  UOM?: InputMaybe<Scalars['String']['input']>;
  Velocity?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateForOrderLineDetailFromMerpArgs = {
  BinLocation: Scalars['String']['input'];
  BranchID?: InputMaybe<Scalars['String']['input']>;
  CustomerNumber?: InputMaybe<Scalars['String']['input']>;
  CustomerTier?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter: Scalars['String']['input'];
  ExpectedShipDate?: InputMaybe<Scalars['String']['input']>;
  ITN: Scalars['String']['input'];
  NOSINumber: Scalars['String']['input'];
  OrderLineNumber: Scalars['Int']['input'];
  OrderLineQuantity?: InputMaybe<Scalars['Float']['input']>;
  OrderNumber: Scalars['String']['input'];
  OrderStatusCode?: InputMaybe<Scalars['String']['input']>;
  OrderType?: InputMaybe<Scalars['String']['input']>;
  PartNumber?: InputMaybe<Scalars['String']['input']>;
  ProductCode?: InputMaybe<Scalars['String']['input']>;
  ProductTier?: InputMaybe<Scalars['String']['input']>;
  ShipmentMethodID?: InputMaybe<Scalars['String']['input']>;
  StatusID: Scalars['Int']['input'];
  WMSPriority: Scalars['Int']['input'];
  detailQuantity: Scalars['Float']['input'];
};

export type MutationUpdateForProductFromMerpArgs = {
  PartNumber: Scalars['String']['input'];
  ProductCode: Scalars['String']['input'];
  ProductTier?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateForPurchaseOrderLineFromMerpArgs = {
  DueDate?: InputMaybe<Scalars['String']['input']>;
  LineNumber: Scalars['Int']['input'];
  LocationCode: Scalars['String']['input'];
  PartNumber: Scalars['String']['input'];
  ProductCode: Scalars['String']['input'];
  ProductTier?: InputMaybe<Scalars['String']['input']>;
  PurchaseOrderNumber: Scalars['String']['input'];
  QuantityOnOrder?: InputMaybe<Scalars['Float']['input']>;
  QuantityReceived?: InputMaybe<Scalars['Float']['input']>;
  UnitOfMeasure?: InputMaybe<Scalars['String']['input']>;
  VendorName: Scalars['String']['input'];
  VendorNumber: Scalars['String']['input'];
};

export type MutationUpdateGlobalMessageFromMerpArgs = {
  Active?: InputMaybe<Scalars['Boolean']['input']>;
  Message?: InputMaybe<Scalars['String']['input']>;
  PackerPrint?: InputMaybe<Scalars['Boolean']['input']>;
  Packing?: InputMaybe<Scalars['Boolean']['input']>;
  PartNumber?: InputMaybe<Scalars['String']['input']>;
  Picking?: InputMaybe<Scalars['Boolean']['input']>;
  ProductCode?: InputMaybe<Scalars['String']['input']>;
  QC?: InputMaybe<Scalars['Boolean']['input']>;
  Sequence?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateItnLifeCycleProcessArgs = {
  _id?: InputMaybe<Scalars['Int']['input']>;
  itnLCProcess?: InputMaybe<ItnLifecycleProcess>;
};

export type MutationUpdateItnUserColumnsArgs = {
  ITNUserColumns: Array<InputMaybe<UpdateItnUserColumnsInfo>>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateItnUserLevelsArgs = {
  ITNUserLevels: Array<InputMaybe<UpdateItnUserLevelsInfo>>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateItnUserTemplateArgs = {
  DefaultPagination?: InputMaybe<Scalars['Int']['input']>;
  DefaultTemplate?: InputMaybe<Scalars['Boolean']['input']>;
  SelectedColumns?: InputMaybe<Scalars['String']['input']>;
  TemplateName?: InputMaybe<Scalars['String']['input']>;
  _id: Scalars['Int']['input'];
};

export type MutationUpdateInventoryArgs = {
  ContainerID?: InputMaybe<Scalars['Int']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  Inventory: UpdateInventory;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateInventoryListArgs = {
  ContainerIDList?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  ITNList?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  Inventory: UpdateInventory;
  idList?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type MutationUpdateLastUpdatedArgs = {
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  LastUpdated?: InputMaybe<Scalars['String']['input']>;
  TypeID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateMerpOrderStatusArgs = {
  NOSINumber: Scalars['String']['input'];
  OrderNumber: Scalars['String']['input'];
  Status: Scalars['String']['input'];
  UserOrStatus?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateMerpQcBinArgs = {
  ITN: Scalars['String']['input'];
};

export type MutationUpdateMerpWmsLogArgs = {
  Action: Scalars['String']['input'];
  ActionType: Scalars['String']['input'];
  FileKeyList: Array<Scalars['String']['input']>;
  LocationCode: Scalars['String']['input'];
};

export type MutationUpdateNotFoundForStockingArgs = {
  ITNList: Array<InputMaybe<Scalars['String']['input']>>;
};

export type MutationUpdateOrderArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  NOSINumber?: InputMaybe<Scalars['String']['input']>;
  Order: UpdateOrder;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateOrderLastSyncArgs = {
  Order?: InputMaybe<UpdateAutostoreOrder>;
};

export type MutationUpdateOrderLineArgs = {
  OrderLine: UpdateOrderLine;
};

export type MutationUpdateOrderLineDetailArgs = {
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderLineDetail: UpdateOrderLineDetail;
  OrderLineID?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateOrderLineDetailListArgs = {
  InventoryIDList?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  OrderLineDetail: UpdateOrderLineDetail;
  idList?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type MutationUpdatePickingCalendarSettingsArgs = {
  events?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdatePrinterArgs = {
  Active?: InputMaybe<Scalars['Boolean']['input']>;
  DPI?: InputMaybe<Scalars['Int']['input']>;
  Description?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Orientation?: InputMaybe<Scalars['String']['input']>;
  StationName?: InputMaybe<Scalars['String']['input']>;
  _id: Scalars['Int']['input'];
};

export type MutationUpdateProductArgs = {
  Product: UpdateProduct;
};

export type MutationUpdateProductLastSyncArgs = {
  Product?: InputMaybe<UpdateProduct>;
};

export type MutationUpdateReceiptArgs = {
  ExpectedArrivalDate?: InputMaybe<Scalars['String']['input']>;
  SourceType?: InputMaybe<Scalars['String']['input']>;
  VendorID: Scalars['Int']['input'];
  _id: Scalars['Int']['input'];
};

export type MutationUpdateReceiptLdArgs = {
  ReceiptLD: UpdateReceiptLd;
  ReceiptLID?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateReceiptLineArgs = {
  CountryID?: InputMaybe<Scalars['Int']['input']>;
  DateCode?: InputMaybe<Scalars['String']['input']>;
  ExpectedQuantity: Scalars['Int']['input'];
  ProductID: Scalars['Int']['input'];
  ROHS?: InputMaybe<Scalars['Boolean']['input']>;
  ReceiptLID: Scalars['Int']['input'];
};

export type MutationUpdateReceiptLineDetailArgs = {
  ExpectedQuantity: Scalars['Int']['input'];
  PurchaseOrderLID: Scalars['Int']['input'];
  ReceiptLDID: Scalars['Int']['input'];
};

export type MutationUpdateReceiptLsByIdArgs = {
  ReceiptL: UpdateReceiptL;
  idList: Array<InputMaybe<Scalars['Int']['input']>>;
};

export type MutationUpdateSystemTriggerArgs = {
  AuditTypes?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  Trigger?: InputMaybe<ImTrigger>;
  TriggerID?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateTableDataArgs = {
  UpdateQuery?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateUserCartArgs = {
  Container: SearchContainer;
  UserID: Scalars['Int']['input'];
};

export type MutationUpdateUserCartForDropOffArgs = {
  Container: SearchContainer;
  UserID: Scalars['Int']['input'];
};

export type MutationUpdateUserInfoArgs = {
  Name?: InputMaybe<Scalars['String']['input']>;
  UserInfo: UpdateUserInfo;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type MutationUpdateValueMapArgs = {
  SourceColumnName?: InputMaybe<Scalars['String']['input']>;
  SourceSystemName?: InputMaybe<Scalars['String']['input']>;
  SourceTableName?: InputMaybe<Scalars['String']['input']>;
  SourceValue?: InputMaybe<Scalars['String']['input']>;
  TargetColumnName?: InputMaybe<Scalars['String']['input']>;
  TargetSystemName?: InputMaybe<Scalars['String']['input']>;
  TargetTableName?: InputMaybe<Scalars['String']['input']>;
  TargetValue?: InputMaybe<Scalars['String']['input']>;
  _id: Scalars['Int']['input'];
};

export type MutationUpdateVendorFromMerpArgs = {
  VendorName: Scalars['String']['input'];
  VendorNumber: Scalars['String']['input'];
};

export type Omsconfig = {
  __typename?: 'OMSCONFIG';
  Name?: Maybe<Scalars['String']['output']>;
  Value?: Maybe<Scalars['String']['output']>;
};

export type Order = {
  __typename?: 'Order';
  BranchID?: Maybe<Scalars['String']['output']>;
  Customer?: Maybe<Customer>;
  CustomerID?: Maybe<Scalars['Int']['output']>;
  DistributionCenter: Scalars['String']['output'];
  ExpectedShipDate?: Maybe<Scalars['String']['output']>;
  LastUpdated?: Maybe<Scalars['String']['output']>;
  NOSINumber: Scalars['String']['output'];
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  ORDERLINEs?: Maybe<Array<Maybe<OrderLine>>>;
  OrderNumber: Scalars['String']['output'];
  OrderStatusCode?: Maybe<Scalars['String']['output']>;
  OrderType?: Maybe<Scalars['String']['output']>;
  ShipmentMethod?: Maybe<ShipmentMethod>;
  ShipmentMethodID?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
  isSelected: Scalars['Int']['output'];
};

export type OrderForAgOut = {
  __typename?: 'OrderForAgOut';
  NOSINumber: Scalars['String']['output'];
  OrderID: Scalars['Int']['output'];
  OrderNumber: Scalars['String']['output'];
};

export type OrderLine = {
  __typename?: 'OrderLine';
  LastUpdated?: Maybe<Scalars['String']['output']>;
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  Order: Order;
  OrderID: Scalars['Int']['output'];
  OrderLineNumber: Scalars['Int']['output'];
  Product: Product;
  ProductID: Scalars['Int']['output'];
  Quantity?: Maybe<Scalars['Float']['output']>;
  _id: Scalars['Int']['output'];
};

export type OrderLineDetail = {
  __typename?: 'OrderLineDetail';
  BinLocation?: Maybe<Scalars['String']['output']>;
  Inventory?: Maybe<Inventory>;
  InventoryID?: Maybe<Scalars['Int']['output']>;
  LastUpdated?: Maybe<Scalars['String']['output']>;
  Order: Order;
  OrderID: Scalars['Int']['output'];
  OrderLine: OrderLine;
  OrderLineID: Scalars['Int']['output'];
  Quantity: Scalars['Float']['output'];
  Status: OrderStatus;
  StatusID: Scalars['Int']['output'];
  WMSPriority: Scalars['Int']['output'];
  _id: Scalars['Int']['output'];
};

export type OrderStatus = {
  __typename?: 'OrderStatus';
  Name: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type Partcode = {
  __typename?: 'PARTCODE';
  PRC?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
};

export type PoLine = {
  __typename?: 'POLine';
  DueDate?: Maybe<Scalars['String']['output']>;
  MaxQuantity?: Maybe<Scalars['Int']['output']>;
  PurchaseOrderNumberLine?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
};

export type Printer = {
  __typename?: 'Printer';
  Active?: Maybe<Scalars['Boolean']['output']>;
  DPI?: Maybe<Scalars['Int']['output']>;
  Description?: Maybe<Scalars['String']['output']>;
  Name: Scalars['String']['output'];
  Orientation?: Maybe<Scalars['String']['output']>;
  StationName?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
};

export type Product = {
  __typename?: 'Product';
  Autostore?: Maybe<Scalars['Boolean']['output']>;
  DCPRODUCTs?: Maybe<Array<Maybe<DcProduct>>>;
  Description?: Maybe<Scalars['String']['output']>;
  ExcludeFromAutostore?: Maybe<Scalars['Boolean']['output']>;
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
  LastAutostoreSync?: Maybe<Scalars['String']['output']>;
  LastUpdated?: Maybe<Scalars['String']['output']>;
  MICPartNumber?: Maybe<Scalars['String']['output']>;
  ORDERLINEs?: Maybe<Array<Maybe<OrderLine>>>;
  PURCHASEORDERLs?: Maybe<Array<Maybe<PurchaseOrderL>>>;
  PackQty?: Maybe<Scalars['Float']['output']>;
  PackType?: Maybe<Scalars['String']['output']>;
  PartNumber: Scalars['String']['output'];
  ProductCode: ProductCode;
  ProductCodeID: Scalars['Int']['output'];
  ProductTier?: Maybe<Scalars['String']['output']>;
  ProductType: ProductType;
  ProductTypeID: Scalars['Int']['output'];
  RECEIPTLs?: Maybe<Array<Maybe<ReceiptL>>>;
  UOM?: Maybe<Scalars['String']['output']>;
  Velocity?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type ProductCode = {
  __typename?: 'ProductCode';
  PRODUCTs?: Maybe<Array<Maybe<Product>>>;
  ProductCodeNumber: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type ProductType = {
  __typename?: 'ProductType';
  Description?: Maybe<Scalars['String']['output']>;
  PRODUCTs?: Maybe<Array<Maybe<Product>>>;
  ProductType?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
};

export type ProdunctInfoFromMerp = {
  __typename?: 'ProdunctInfoFromMerp';
  ExternalKey?: Maybe<Scalars['String']['output']>;
  HazardMaterialLevel?: Maybe<Scalars['String']['output']>;
  MICPartNumber?: Maybe<Scalars['String']['output']>;
  UnitOfMeasure?: Maybe<Scalars['String']['output']>;
};

export type PurchaseOrderH = {
  __typename?: 'PurchaseOrderH';
  DistributionCenter: Scalars['String']['output'];
  PURCHASEORDERLs?: Maybe<Array<Maybe<PurchaseOrderL>>>;
  PurchaseOrderNumber: Scalars['String']['output'];
  Vendor: Vendor;
  VendorID: Scalars['Int']['output'];
  _id: Scalars['Int']['output'];
};

export type PurchaseOrderL = {
  __typename?: 'PurchaseOrderL';
  DueDate?: Maybe<Scalars['String']['output']>;
  LineNumber: Scalars['Int']['output'];
  Product: Product;
  ProductID: Scalars['Int']['output'];
  PurchaseOrderH: PurchaseOrderH;
  PurchaseOrderHID: Scalars['Int']['output'];
  QuantityOnOrder?: Maybe<Scalars['Float']['output']>;
  QuantityReceived?: Maybe<Scalars['Float']['output']>;
  RECEIPTLDs?: Maybe<Array<Maybe<ReceiptLd>>>;
  UnitOfMeasure?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  countOrderItns: Scalars['Int']['output'];
  fetchASNRejectionReasons?: Maybe<Array<Maybe<Asnrejectionreason>>>;
  fetchAllCountry?: Maybe<Array<Maybe<Country>>>;
  fetchAuditTypes?: Maybe<Array<Maybe<Audittype>>>;
  fetchAutostoreMessage?: Maybe<Array<Maybe<Autostoremessage>>>;
  fetchAutostoreMessages?: Maybe<Array<Maybe<Autostoremessage>>>;
  fetchAutostoreOrderMessages?: Maybe<Array<Maybe<Autostoremessage>>>;
  fetchAutostoreProcess?: Maybe<Autostoreprocess>;
  fetchCommonvariablesForLogs?: Maybe<
    Array<Maybe<Scalars['String']['output']>>
  >;
  fetchConfigValue?: Maybe<Omsconfig>;
  fetchDataColumnList?: Maybe<Array<Maybe<DataColumn>>>;
  fetchDataTableList?: Maybe<Array<Maybe<DataTable>>>;
  fetchDistributionCenterList?: Maybe<Array<Maybe<DistributionCenter>>>;
  fetchEntityList?: Maybe<Array<Maybe<Entity>>>;
  fetchGblMessages?: Maybe<Array<Maybe<Globalmsg>>>;
  fetchGlobalMessages?: Maybe<Array<Maybe<Globalmsg>>>;
  fetchHoldOnCounter?: Maybe<Array<Maybe<HoldOnCounter>>>;
  fetchITNLifecycle?: Maybe<Array<Maybe<ItnLifeCycle_Report>>>;
  fetchITNLifecycleDrillDown?: Maybe<Array<Maybe<ItnLifeCycleDrillDown>>>;
  fetchITNLifecycleDrillDownRows?: Maybe<Array<Maybe<ItnLifeCycle_Report>>>;
  fetchITNUserColumns?: Maybe<Array<Maybe<ItnUserColumn>>>;
  fetchInventory?: Maybe<Array<Maybe<Inventory>>>;
  fetchInventoryAudits?: Maybe<Array<Maybe<Imaudit>>>;
  fetchLocationAudits?: Maybe<Array<Maybe<Imaudit>>>;
  fetchMenuList?: Maybe<Array<Maybe<Menu>>>;
  fetchOrderLineDetailforWMSCount?: Maybe<Array<Maybe<OrderLineDetail>>>;
  fetchOrderLineMessage?: Maybe<GlobalMessage>;
  fetchOrderTasktime?: Maybe<Array<Maybe<OrderTasktime>>>;
  fetchOrderView?: Maybe<Array<Maybe<OrderView>>>;
  fetchPartMessage?: Maybe<GlobalMessage>;
  fetchPickingCalendarSettings?: Maybe<Scalars['String']['output']>;
  fetchPreviousLocation?: Maybe<ApiResult>;
  fetchPrinterList?: Maybe<Array<Maybe<Printer>>>;
  fetchPrinterStation: Scalars['String']['output'];
  fetchProductInfoFromMerp?: Maybe<Array<Maybe<ProdunctInfoFromMerp>>>;
  fetchProductMICFromMerp?: Maybe<Scalars['String']['output']>;
  fetchProductTypes?: Maybe<Array<Maybe<ProductType>>>;
  fetchProductVelocity?: Maybe<Scalars['String']['output']>;
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
  findHdiDevice?: Maybe<HdiDevice>;
  findIMInventories?: Maybe<Array<Maybe<Auditinventory>>>;
  findIMPRCInventories?: Maybe<Array<Maybe<Inventory>>>;
  findIMPRCPartNumberInventories?: Maybe<Array<Maybe<Inventory>>>;
  findITNColumns?: Maybe<Array<Maybe<ItnColumn>>>;
  findITNTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  findITNTemplates?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  findInventory?: Maybe<Inventory>;
  findInventoryByUser?: Maybe<Array<Maybe<Inventory>>>;
  findInventorys?: Maybe<Array<Maybe<Inventory>>>;
  findLocalErrorLogs?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
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
  getAuditCount?: Maybe<Scalars['Int']['output']>;
  getIMAdjustReasons?: Maybe<Array<Maybe<Imadjustreason>>>;
  getNextSubAudit?: Maybe<Array<Maybe<Audit>>>;
  getSearchLocation?: Maybe<Array<Maybe<Searchlocation>>>;
  getSearchLocations?: Maybe<Array<Maybe<Searchlocation>>>;
  printQRCodeLabel?: Maybe<Scalars['Boolean']['output']>;
  printReceivingITNLabel?: Maybe<Scalars['Boolean']['output']>;
  printTextLabel?: Maybe<Scalars['Boolean']['output']>;
  test?: Maybe<Array<Maybe<Inventory>>>;
  validateAssignment?: Maybe<Scalars['Boolean']['output']>;
  validateFilter?: Maybe<Scalars['Boolean']['output']>;
  verifyASNLocation?: Maybe<Array<Maybe<Inventory>>>;
  verifyASNLocationNotInProcess?: Maybe<Array<Maybe<Autostoreasnheader>>>;
  verifyASNLocationStatus?: Maybe<Array<Maybe<Autostoreasnheader>>>;
};

export type QueryCountOrderItnsArgs = {
  LocationCode: Scalars['String']['input'];
  NOSINumber: Scalars['String']['input'];
  OrderNumber: Scalars['String']['input'];
};

export type QueryFetchAutostoreMessageArgs = {
  Message?: InputMaybe<AutostoreMessage>;
};

export type QueryFetchAutostoreMessagesArgs = {
  MaxRetries?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFetchAutostoreOrderMessagesArgs = {
  MaxRetries?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFetchAutostoreProcessArgs = {
  AutostoreProcess?: InputMaybe<FindAutostoreProcess>;
};

export type QueryFetchCommonvariablesForLogsArgs = {
  events?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type QueryFetchConfigValueArgs = {
  Name?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchDataColumnListArgs = {
  TABLE_NAME?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchEntityListArgs = {
  type?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchGblMessagesArgs = {
  MessageType?: InputMaybe<Scalars['String']['input']>;
  PartNumber?: InputMaybe<Scalars['String']['input']>;
  ProductCode?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchGlobalMessagesArgs = {
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFetchHoldOnCounterArgs = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type QueryFetchItnLifecycleArgs = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type QueryFetchItnLifecycleDrillDownArgs = {
  inventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  nosiNumber?: InputMaybe<Scalars['String']['input']>;
  orderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  orderNumber: Scalars['String']['input'];
};

export type QueryFetchItnLifecycleDrillDownRowsArgs = {
  inventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  nosiNumber?: InputMaybe<Scalars['String']['input']>;
  orderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  orderNumber?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchItnUserColumnsArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchInventoryArgs = {
  InventoryIDs?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type QueryFetchInventoryAuditsArgs = {
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFetchMenuListArgs = {
  pageName?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchOrderLineDetailforWmsCountArgs = {
  filter?: InputMaybe<SearchIntForWmsCount>;
};

export type QueryFetchOrderLineMessageArgs = {
  CustomerNumber: Scalars['String']['input'];
  DistributionCenter: Scalars['String']['input'];
  OrderLineNumber: Scalars['String']['input'];
  OrderNumber: Scalars['String']['input'];
};

export type QueryFetchOrderTasktimeArgs = {
  Order?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
};

export type QueryFetchOrderViewArgs = {
  filter?: InputMaybe<OrderViewFilter>;
};

export type QueryFetchPartMessageArgs = {
  PartNumber: Scalars['String']['input'];
  ProductCode: Scalars['String']['input'];
};

export type QueryFetchPreviousLocationArgs = {
  BinLocation?: InputMaybe<Scalars['String']['input']>;
  ITN?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchPrinterListArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryFetchProductInfoFromMerpArgs = {
  ProductList: Array<InputMaybe<Scalars['String']['input']>>;
};

export type QueryFetchProductMicFromMerpArgs = {
  PartNumber: Scalars['String']['input'];
  ProductCode: Scalars['String']['input'];
};

export type QueryFetchProductVelocityArgs = {
  PartNumber: Scalars['String']['input'];
  ProductCode: Scalars['String']['input'];
};

export type QueryFetchReceiptLinesArgs = {
  ReceiptHID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFetchSuggetionLocationForSortingArgs = {
  ProductID: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFetchSystemAuditsArgs = {
  IncludeDeactivated?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryFetchTableDataArgs = {
  ColumnList?: InputMaybe<Scalars['String']['input']>;
  TableName?: InputMaybe<Scalars['String']['input']>;
  Where?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchTaskCounterArgs = {
  Module: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type QueryFetchUserEventLogsArgs = {
  EventList?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFetchUserListArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchUsersForZoneArgs = {
  ZoneID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFetchZoneListArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchZonesForUserArgs = {
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindAsnArgs = {
  ASN?: InputMaybe<AutostoreAsnHeader>;
};

export type QueryFindAsnByItnArgs = {
  ITN?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindAsnReplenishmentInventoryArgs = {
  Barcode?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindContainerArgs = {
  Container?: InputMaybe<SearchContainer>;
};

export type QueryFindContainersArgs = {
  Container?: InputMaybe<SearchContainer>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindEventLogsArgs = {
  Log?: InputMaybe<Scalars['String']['input']>;
  UserName?: InputMaybe<Scalars['String']['input']>;
  eventIdList?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  timeFrame?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryFindEventTypeArgs = {
  EventType?: InputMaybe<SearchEventType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindImInventoriesArgs = {
  BarcodeEnd?: InputMaybe<Scalars['String']['input']>;
  BarcodeStart?: InputMaybe<Scalars['String']['input']>;
  ITN?: InputMaybe<Scalars['String']['input']>;
  PRC?: InputMaybe<Scalars['String']['input']>;
  PartNumber?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindImprcInventoriesArgs = {
  PRC?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindImprcPartNumberInventoriesArgs = {
  PRC?: InputMaybe<Scalars['String']['input']>;
  PartNumber?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindItnColumnsArgs = {
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindItnTemplateArgs = {
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindItnTemplatesArgs = {
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindInventoryArgs = {
  Inventory: SearchInventory;
};

export type QueryFindInventoryByUserArgs = {
  Username?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindInventorysArgs = {
  Inventory: SearchInventory;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindLocalErrorLogsArgs = {
  Date: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindNextAuditArgs = {
  Barcode?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindNextItnForPullingArgs = {
  Barcode?: InputMaybe<Scalars['String']['input']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']['input']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']['input']>;
  Zone?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindOrderArgs = {
  Order?: InputMaybe<SearchOrder>;
};

export type QueryFindOrderByStatusArgs = {
  PriorityPinkPaper?: InputMaybe<Scalars['Boolean']['input']>;
  StatusID: Scalars['Int']['input'];
};

export type QueryFindOrderLineArgs = {
  OrderLine?: InputMaybe<SearchOrderLine>;
};

export type QueryFindOrderLineDetailArgs = {
  OrderLineDetail?: InputMaybe<SearchOrderLineDetail>;
};

export type QueryFindOrderLineDetailsArgs = {
  OrderLineDetail?: InputMaybe<SearchOrderLineDetail>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindOrderLinesArgs = {
  OrderLine?: InputMaybe<SearchOrderLine>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindOrdersArgs = {
  Order?: InputMaybe<SearchOrder>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindPoLineArgs = {
  PurchaseOrderLID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindPoLinesArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  ProductID?: InputMaybe<Scalars['Int']['input']>;
  VendorID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindPOsArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindPartArgs = {
  ProductID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindPartCodesArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  SearchString?: InputMaybe<Scalars['String']['input']>;
  VendorID?: InputMaybe<Scalars['Int']['input']>;
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
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindPurchaseOrderHArgs = {
  PurchaseOrder: SearchPurchaseOrderH;
};

export type QueryFindPurchaseOrderHsArgs = {
  PurchaseOrder: SearchPurchaseOrderH;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindPurchaseOrderLArgs = {
  PurchaseOrderL: SearchPurchaseOrderL;
};

export type QueryFindPurchaseOrderLsArgs = {
  PurchaseOrderL: SearchPurchaseOrderL;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindReceiptArgs = {
  ReceiptID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindReceiptHArgs = {
  ReceiptH: SearchReceiptH;
};

export type QueryFindReceiptHsArgs = {
  ReceiptH: SearchReceiptH;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindReceiptInfoByIdAndStatusArgs = {
  ReceiptHID: Scalars['Int']['input'];
  statusID: Scalars['Int']['input'];
};

export type QueryFindReceiptInfoByPartorVendorArgs = {
  PartNumber?: InputMaybe<Scalars['String']['input']>;
  VendorNumber?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindReceiptLArgs = {
  ReceiptL: SearchReceiptL;
};

export type QueryFindReceiptLdArgs = {
  ReceiptLD: SearchReceiptLd;
};

export type QueryFindReceiptLDsArgs = {
  ReceiptLD: SearchReceiptLd;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindReceiptLineArgs = {
  ReceiptLineID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindReceiptLsArgs = {
  ReceiptL: SearchReceiptL;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindReceiptsArgs = {
  ReceiptID?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindRoutesArgs = {
  Route?: InputMaybe<SearchRoute>;
};

export type QueryFindUpdatedOrderLinesArgs = {
  OrderID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindUserArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  User?: InputMaybe<SearchUser>;
};

export type QueryFindUserEventLogsArgs = {
  Modules?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  UserEventLog: SearchUserEventLog;
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindUserEventsArgs = {
  UserEvent?: InputMaybe<SearchUserEvent>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindUserInfoArgs = {
  UserInfo?: InputMaybe<SearchUserInfo>;
};

export type QueryFindUserInfosArgs = {
  UserInfo?: InputMaybe<SearchUserInfo>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryFindUsersArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFindVendorArgs = {
  Vendor: SearchVendor;
};

export type QueryFindVendorByPoArgs = {
  PurchaseOrder: SearchPurchaseOrderH;
};

export type QueryGetNextSubAuditArgs = {
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGetSearchLocationArgs = {
  Barcode?: InputMaybe<Scalars['String']['input']>;
  Level?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGetSearchLocationsArgs = {
  Barcode?: InputMaybe<Scalars['String']['input']>;
};

export type QueryPrintQrCodeLabelArgs = {
  DPI: Scalars['String']['input'];
  ORIENTATION: Scalars['String']['input'];
  PRINTER: Scalars['String']['input'];
  TEXT: Scalars['String']['input'];
};

export type QueryPrintReceivingItnLabelArgs = {
  DPI: Scalars['String']['input'];
  ITN: Scalars['String']['input'];
  ORIENTATION: Scalars['String']['input'];
  PARTNUMBER: Scalars['String']['input'];
  PRINTER: Scalars['String']['input'];
  PRODUCTCODE: Scalars['String']['input'];
};

export type QueryPrintTextLabelArgs = {
  DPI: Scalars['String']['input'];
  LINE1?: InputMaybe<Scalars['String']['input']>;
  LINE2?: InputMaybe<Scalars['String']['input']>;
  LINE3?: InputMaybe<Scalars['String']['input']>;
  LINE4?: InputMaybe<Scalars['String']['input']>;
  ORIENTATION: Scalars['String']['input'];
  PRINTER: Scalars['String']['input'];
};

export type QueryTestArgs = {
  ITN?: InputMaybe<Scalars['String']['input']>;
};

export type QueryValidateAssignmentArgs = {
  AuditID?: InputMaybe<Scalars['Int']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryValidateFilterArgs = {
  ITN?: InputMaybe<Scalars['String']['input']>;
  LocationEnd?: InputMaybe<Scalars['String']['input']>;
  LocationStart?: InputMaybe<Scalars['String']['input']>;
  PRC?: InputMaybe<Scalars['String']['input']>;
  PartNumber?: InputMaybe<Scalars['String']['input']>;
};

export type QueryVerifyAsnLocationArgs = {
  Barcode?: InputMaybe<Scalars['String']['input']>;
};

export type QueryVerifyAsnLocationNotInProcessArgs = {
  Barcode?: InputMaybe<Scalars['String']['input']>;
  StatusList?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type QueryVerifyAsnLocationStatusArgs = {
  ASN?: InputMaybe<AutostoreAsnHeader>;
};

export type ReceiptDeleteResult = {
  __typename?: 'ReceiptDeleteResult';
  result?: Maybe<Scalars['Int']['output']>;
};

export type ReceiptH = {
  __typename?: 'ReceiptH';
  ExpectedArrivalDate?: Maybe<Scalars['String']['output']>;
  RECEIPTLs?: Maybe<Array<Maybe<ReceiptL>>>;
  ReceiptNumber?: Maybe<Scalars['String']['output']>;
  SourceType?: Maybe<Scalars['String']['output']>;
  Vendor: Vendor;
  VendorID: Scalars['Int']['output'];
  _id: Scalars['Int']['output'];
};

export type ReceiptHInfo = {
  __typename?: 'ReceiptHInfo';
  VendorName?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
};

export type ReceiptL = {
  __typename?: 'ReceiptL';
  Country?: Maybe<Country>;
  CountryID?: Maybe<Scalars['Int']['output']>;
  DateCode?: Maybe<Scalars['String']['output']>;
  ExpectedQuantity: Scalars['Float']['output'];
  LineNumber: Scalars['Int']['output'];
  OverReceiving: Scalars['Boolean']['output'];
  Product: Product;
  ProductID: Scalars['Int']['output'];
  RECEIPTLDs?: Maybe<Array<Maybe<ReceiptLd>>>;
  ROHS?: Maybe<Scalars['Boolean']['output']>;
  ReceiptH: ReceiptH;
  ReceiptHID: Scalars['Int']['output'];
  _id: Scalars['Int']['output'];
};

export type ReceiptLd = {
  __typename?: 'ReceiptLD';
  ExpectedQuantity: Scalars['Float']['output'];
  PurchaseOrderL?: Maybe<PurchaseOrderL>;
  PurchaseOrderLID?: Maybe<Scalars['Int']['output']>;
  ReceiptL: ReceiptL;
  ReceiptLID: Scalars['Int']['output'];
  ReceiptStatus: ReceiptStatus;
  ReceiptStatusID: Scalars['Int']['output'];
  _id: Scalars['Int']['output'];
};

export type ReceiptStatus = {
  __typename?: 'ReceiptStatus';
  Name: Scalars['String']['output'];
  RECEIPTLDs?: Maybe<Array<Maybe<ReceiptLd>>>;
  _id: Scalars['Int']['output'];
};

export type Response = {
  __typename?: 'Response';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Route = {
  __typename?: 'Route';
  ADGroupProtected?: Maybe<Scalars['Boolean']['output']>;
  ROUTEGROUPs?: Maybe<Array<Maybe<RouteGroup>>>;
  Route: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type RouteGroup = {
  __typename?: 'RouteGroup';
  ADGroup: Scalars['String']['output'];
  Route: Route;
  RouteID: Scalars['Int']['output'];
  _id: Scalars['Int']['output'];
};

export type Searchlocation = {
  __typename?: 'SEARCHLOCATION';
  Barcode?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type ShipmentMethod = {
  __typename?: 'ShipmentMethod';
  PriorityPinkPaper: Scalars['Boolean']['output'];
  ShippingMethod: Scalars['String']['output'];
  _id: Scalars['String']['output'];
};

export type SuggetionLocation = {
  __typename?: 'SuggetionLocation';
  Barcode: Scalars['String']['output'];
  Quantity: Scalars['Float']['output'];
  Zone?: Maybe<Scalars['String']['output']>;
};

export type SuspectReason = {
  __typename?: 'SuspectReason';
  Inventory_SuspectReasons?: Maybe<Array<Maybe<Inventory_SuspectReason>>>;
  Reason: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type TableData = {
  __typename?: 'TableData';
  Results?: Maybe<Scalars['String']['output']>;
};

export type TableKey = {
  __typename?: 'TableKey';
  ID?: Maybe<Scalars['Int']['output']>;
};

export type UpdateResult = {
  __typename?: 'UpdateResult';
  StatusCode?: Maybe<Scalars['String']['output']>;
  StatusMessage?: Maybe<Scalars['String']['output']>;
};

export type UpdatedOrder = {
  __typename?: 'UpdatedOrder';
  AutostoreOrderCount?: Maybe<Scalars['Int']['output']>;
  DateCreated?: Maybe<Scalars['String']['output']>;
  DistributionCenter?: Maybe<Scalars['String']['output']>;
  ExpectedShipDate?: Maybe<Scalars['String']['output']>;
  LastAutostoreSync?: Maybe<Scalars['String']['output']>;
  NOSINumber?: Maybe<Scalars['String']['output']>;
  OrderNumber?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
};

export type UpdatedOrderLine = {
  __typename?: 'UpdatedOrderLine';
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  OrderLineDetailID?: Maybe<Scalars['Int']['output']>;
  OrderLineDetailQuantity?: Maybe<Scalars['Float']['output']>;
  OrderLineID?: Maybe<Scalars['Int']['output']>;
  OrderLineNumber?: Maybe<Scalars['Int']['output']>;
  OrderLineQuantity?: Maybe<Scalars['Float']['output']>;
  PackQty?: Maybe<Scalars['Int']['output']>;
  PartNumber?: Maybe<Scalars['String']['output']>;
  ProductCodeNumber?: Maybe<Scalars['String']['output']>;
  UOM?: Maybe<Scalars['String']['output']>;
  WMSPriority?: Maybe<Scalars['Int']['output']>;
};

export type UpdatedProduct = {
  __typename?: 'UpdatedProduct';
  Description?: Maybe<Scalars['String']['output']>;
  LastAutostoreSync?: Maybe<Scalars['String']['output']>;
  LastUpdated?: Maybe<Scalars['String']['output']>;
  MICPartNumber?: Maybe<Scalars['String']['output']>;
  PartNumber: Scalars['String']['output'];
  ProductCodeNumber: Scalars['String']['output'];
  ProductTier?: Maybe<Scalars['String']['output']>;
  UOM?: Maybe<Scalars['String']['output']>;
  Velocity?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  CartID?: Maybe<Scalars['Int']['output']>;
  CartLastUpdated?: Maybe<Scalars['String']['output']>;
  DateCreated?: Maybe<Scalars['String']['output']>;
  DistributionCenter?: Maybe<Scalars['String']['output']>;
  Equipment?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  PriorityCutoff?: Maybe<Scalars['Int']['output']>;
  PullerLevel?: Maybe<Scalars['Int']['output']>;
  StrictPriority?: Maybe<Scalars['Int']['output']>;
  ZoneCount?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type UserEvent = {
  __typename?: 'UserEvent';
  Event: Scalars['String']['output'];
  Module: Scalars['String']['output'];
  USEREVENTLOGs?: Maybe<Array<Maybe<UserEventLog>>>;
  _id: Scalars['Int']['output'];
};

export type UserEventLog = {
  __typename?: 'UserEventLog';
  CustomerNumber?: Maybe<Scalars['String']['output']>;
  CustomerTier?: Maybe<Scalars['String']['output']>;
  DateTime?: Maybe<Scalars['String']['output']>;
  DistributionCenter?: Maybe<Scalars['String']['output']>;
  InventoryTrackingNumber?: Maybe<Scalars['String']['output']>;
  Message?: Maybe<Scalars['String']['output']>;
  NOSINumber?: Maybe<Scalars['String']['output']>;
  OrderLineNumber?: Maybe<Scalars['Int']['output']>;
  OrderNumber?: Maybe<Scalars['String']['output']>;
  ParentITN?: Maybe<Scalars['String']['output']>;
  PartNumber?: Maybe<Scalars['String']['output']>;
  Priority?: Maybe<Scalars['Boolean']['output']>;
  ProductCode?: Maybe<Scalars['String']['output']>;
  ProductTier?: Maybe<Scalars['String']['output']>;
  PurchaseLine?: Maybe<Scalars['Int']['output']>;
  PurchaseOrderNumber?: Maybe<Scalars['String']['output']>;
  Quantity?: Maybe<Scalars['Float']['output']>;
  ReceiptHeader?: Maybe<Scalars['Int']['output']>;
  ReceiptLine?: Maybe<Scalars['Int']['output']>;
  ShipmentMethod?: Maybe<Scalars['String']['output']>;
  ShipmentMethodDescription?: Maybe<Scalars['String']['output']>;
  TrackingNumber?: Maybe<Scalars['String']['output']>;
  UserEvent: UserEvent;
  UserEventID: Scalars['Int']['output'];
  UserName: Scalars['String']['output'];
  VendorName?: Maybe<Scalars['String']['output']>;
  WMSPriority?: Maybe<Scalars['Int']['output']>;
  Zone?: Maybe<Scalars['Int']['output']>;
  _id: Scalars['Int']['output'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  Cart?: Maybe<Container>;
  CartID?: Maybe<Scalars['Int']['output']>;
  CartLastUpdated?: Maybe<Scalars['String']['output']>;
  DistributionCenter?: Maybe<Scalars['String']['output']>;
  Name: Scalars['String']['output'];
  PriorityCutoff?: Maybe<Scalars['Int']['output']>;
  PullerLevel?: Maybe<Scalars['Int']['output']>;
  StrictPriority?: Maybe<Scalars['Boolean']['output']>;
  _id: Scalars['Int']['output'];
};

export type Vendor = {
  __typename?: 'Vendor';
  PURCHASEORDERHs?: Maybe<Array<Maybe<PurchaseOrderH>>>;
  RECEIPTHs?: Maybe<Array<Maybe<ReceiptH>>>;
  VendorName: Scalars['String']['output'];
  VendorNumber: Scalars['String']['output'];
  _id: Scalars['Int']['output'];
};

export type WmsStatusView = {
  __typename?: 'WMSStatusView';
  Head_Priority: Scalars['Int']['output'];
  Head_Total: Scalars['Int']['output'];
  ITN_Priority: Scalars['Int']['output'];
  ITN_Total: Scalars['Int']['output'];
  Line_Priority: Scalars['Int']['output'];
  Line_Total: Scalars['Int']['output'];
  Status: Scalars['String']['output'];
  StatusID: Scalars['Int']['output'];
};

export type Zone = {
  __typename?: 'Zone';
  CustAPulls?: Maybe<Scalars['Int']['output']>;
  Description?: Maybe<Scalars['String']['output']>;
  DistributionCenter?: Maybe<Scalars['String']['output']>;
  Equipment?: Maybe<Scalars['String']['output']>;
  PriorityPulls?: Maybe<Scalars['Int']['output']>;
  PullCount?: Maybe<Scalars['Int']['output']>;
  PullsStarted?: Maybe<Scalars['Int']['output']>;
  Type?: Maybe<Scalars['String']['output']>;
  Zone?: Maybe<Scalars['Int']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type AsnReplenishmentItem = {
  Status?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type AutostoreAsnHeader = {
  AUTOSTOREASNLINEs?: InputMaybe<Array<InputMaybe<AutostoreAsnLine>>>;
  ContainerID?: InputMaybe<Scalars['Int']['input']>;
  Status?: InputMaybe<Scalars['String']['input']>;
  tuId?: InputMaybe<Scalars['String']['input']>;
  tuType?: InputMaybe<Scalars['String']['input']>;
};

export type AutostoreAsnLine = {
  ASNID?: InputMaybe<Scalars['Int']['input']>;
  DateCode?: InputMaybe<Scalars['String']['input']>;
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  lineNumber?: InputMaybe<Scalars['Int']['input']>;
  packagingUom?: InputMaybe<Scalars['String']['input']>;
  productId?: InputMaybe<Scalars['String']['input']>;
  quantityExpected?: InputMaybe<Scalars['Float']['input']>;
};

export type AutostoreMessage = {
  Action?: InputMaybe<Scalars['String']['input']>;
  AutostoreID?: InputMaybe<Scalars['String']['input']>;
  Endpoint?: InputMaybe<Scalars['String']['input']>;
  Message?: InputMaybe<Scalars['String']['input']>;
  Method?: InputMaybe<Scalars['String']['input']>;
  OrderLines?: InputMaybe<Scalars['String']['input']>;
  Status?: InputMaybe<Scalars['String']['input']>;
  Timestamp?: InputMaybe<Scalars['String']['input']>;
  Type?: InputMaybe<Scalars['String']['input']>;
  TypeID?: InputMaybe<Scalars['Int']['input']>;
};

export type AutostoreMessageAttempt = {
  MessageID: Scalars['Int']['input'];
  Response: Scalars['String']['input'];
  ResponseCode?: InputMaybe<Scalars['String']['input']>;
  Source?: InputMaybe<Scalars['String']['input']>;
  Status: Scalars['String']['input'];
  Timestamp?: InputMaybe<Scalars['String']['input']>;
};

export type AutostoreOrderHeader = {
  AutostoreOrderNumber: Scalars['String']['input'];
  OrderID: Scalars['Int']['input'];
};

export type AutostoreOrderLine = {
  AutostoreOrderHID?: InputMaybe<Scalars['Int']['input']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderLineDetailID?: InputMaybe<Scalars['Int']['input']>;
  OrderLineID?: InputMaybe<Scalars['Int']['input']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  Quantity?: InputMaybe<Scalars['Float']['input']>;
};

export type AutostoreProcess = {
  LastRun: Scalars['String']['input'];
  Type: Scalars['String']['input'];
  Value?: InputMaybe<Scalars['String']['input']>;
};

export type Entity = {
  __typename?: 'entity';
  ColumnID?: Maybe<Scalars['Int']['output']>;
  ColumnName?: Maybe<Scalars['String']['output']>;
  SystemID?: Maybe<Scalars['Int']['output']>;
  SystemName?: Maybe<Scalars['String']['output']>;
  TableID?: Maybe<Scalars['Int']['output']>;
  TableName?: Maybe<Scalars['String']['output']>;
};

export type EntityColumn = {
  __typename?: 'entityColumn';
  ColumnName?: Maybe<Scalars['String']['output']>;
  EntityID?: Maybe<Scalars['Int']['output']>;
  _id: Scalars['Int']['output'];
};

export type EntityTable = {
  __typename?: 'entityTable';
  TableName?: Maybe<Scalars['String']['output']>;
  _id: Scalars['Int']['output'];
};

export type FindAutostoreProcess = {
  Type?: InputMaybe<Scalars['String']['input']>;
  Value?: InputMaybe<Scalars['String']['input']>;
};

export type HdiDevice = {
  __typename?: 'hdiDevice';
  IP: Scalars['String']['output'];
  WeightScale: Scalars['Boolean']['output'];
};

export type ImTrigger = {
  Active?: InputMaybe<Scalars['Boolean']['input']>;
  Description?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Priority?: InputMaybe<Scalars['Int']['input']>;
};

export type InputAudit = {
  CreatedDatetime?: InputMaybe<Scalars['String']['input']>;
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  LastUpdated?: InputMaybe<Scalars['String']['input']>;
  Priority?: InputMaybe<Scalars['Int']['input']>;
  Trigger?: InputMaybe<Scalars['String']['input']>;
  TypeID?: InputMaybe<Scalars['Int']['input']>;
  UserID?: InputMaybe<Scalars['Int']['input']>;
};

export type InputSuspect = {
  Comment?: InputMaybe<Scalars['String']['input']>;
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  Reason?: InputMaybe<Scalars['String']['input']>;
};

export type InsertContainer = {
  Aisle?: InputMaybe<Scalars['String']['input']>;
  Barcode: Scalars['String']['input'];
  ContainerTypeID: Scalars['Int']['input'];
  DistributionCenter: Scalars['String']['input'];
  EquipmentID?: InputMaybe<Scalars['Int']['input']>;
  ParentContainerID?: InputMaybe<Scalars['Int']['input']>;
  Row?: InputMaybe<Scalars['String']['input']>;
  Section?: InputMaybe<Scalars['String']['input']>;
  Shelf?: InputMaybe<Scalars['String']['input']>;
  ShelfDetail?: InputMaybe<Scalars['String']['input']>;
  Warehouse?: InputMaybe<Scalars['String']['input']>;
  Zone?: InputMaybe<Scalars['Int']['input']>;
};

export type InsertDcProduct = {
  DistributionCenterID: Scalars['Int']['input'];
  ProductID: Scalars['Int']['input'];
  Velocity?: InputMaybe<Scalars['String']['input']>;
};

export type InsertEventLog = {
  EventTypeID: Scalars['Int']['input'];
  Log: Scalars['String']['input'];
  UserName: Scalars['String']['input'];
};

export type InsertItnUserColumnsInfo = {
  SelectedColumns: Scalars['String']['input'];
  UserID: Scalars['Int']['input'];
};

export type InsertItnUserLevelsInfo = {
  LowLevelLimit?: InputMaybe<Scalars['Int']['input']>;
  MediumLevelLimit?: InputMaybe<Scalars['Int']['input']>;
  UserID: Scalars['Int']['input'];
};

export type InsertInventory = {
  CountryOfOrigin?: InputMaybe<Scalars['String']['input']>;
  DateCode?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter: Scalars['String']['input'];
  InventoryTrackingNumber: Scalars['String']['input'];
  ParentITN?: InputMaybe<Scalars['String']['input']>;
  ProductID: Scalars['Int']['input'];
  QuantityOnHand: Scalars['Float']['input'];
  ROHS?: InputMaybe<Scalars['Boolean']['input']>;
};

export type InsertInventorySuspectReason = {
  InventoryID: Scalars['Int']['input'];
  SuspectReasonID: Scalars['Int']['input'];
};

export type InsertOrder = {
  BranchID?: InputMaybe<Scalars['String']['input']>;
  CustomerNumber?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter: Scalars['String']['input'];
  ExpectedShipDate?: InputMaybe<Scalars['String']['input']>;
  LastUpdated?: InputMaybe<Scalars['String']['input']>;
  NOSINumber: Scalars['String']['input'];
  OrderNumber: Scalars['String']['input'];
  OrderStatusCode?: InputMaybe<Scalars['String']['input']>;
  OrderType?: InputMaybe<Scalars['String']['input']>;
  ShipmentMethodID?: InputMaybe<Scalars['String']['input']>;
};

export type InsertOrderLine = {
  OrderID: Scalars['Int']['input'];
  OrderLineNumber: Scalars['Int']['input'];
  ProductID: Scalars['Int']['input'];
  Quantity?: InputMaybe<Scalars['Float']['input']>;
};

export type InsertOrderLineDetail = {
  BinLocation?: InputMaybe<Scalars['String']['input']>;
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  LastUpdated?: InputMaybe<Scalars['String']['input']>;
  OrderID: Scalars['Int']['input'];
  OrderLineID: Scalars['Int']['input'];
  Quantity: Scalars['Float']['input'];
  StatusID: Scalars['Int']['input'];
  WMSPriority: Scalars['Int']['input'];
};

export type InsertProduct = {
  PartNumber: Scalars['String']['input'];
  ProductCode: Scalars['String']['input'];
  ProductCodeID: Scalars['Int']['input'];
  ProductTier?: InputMaybe<Scalars['String']['input']>;
};

export type InsertProductCode = {
  ProductCodeNumber: Scalars['String']['input'];
  _id: Scalars['Int']['input'];
};

export type InsertReceiptH = {
  ExpectedArrivalDate?: InputMaybe<Scalars['String']['input']>;
  SourceType?: InputMaybe<Scalars['String']['input']>;
  VendorID: Scalars['Int']['input'];
};

export type InsertReceiptLd = {
  ExpectedQuantity: Scalars['Float']['input'];
  PurchaseOrderLID?: InputMaybe<Scalars['Int']['input']>;
  ReceiptLID: Scalars['Int']['input'];
  ReceiptStatusID: Scalars['Int']['input'];
};

export type InsertUserEventLog = {
  CustomerNumber?: InputMaybe<Scalars['String']['input']>;
  CustomerTier?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  Message?: InputMaybe<Scalars['String']['input']>;
  NOSINumber?: InputMaybe<Scalars['String']['input']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  ParentITN?: InputMaybe<Scalars['String']['input']>;
  PartNumber?: InputMaybe<Scalars['String']['input']>;
  Priority?: InputMaybe<Scalars['Boolean']['input']>;
  ProductCode?: InputMaybe<Scalars['String']['input']>;
  ProductTier?: InputMaybe<Scalars['String']['input']>;
  PurchaseLine?: InputMaybe<Scalars['Int']['input']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']['input']>;
  Quantity?: InputMaybe<Scalars['Float']['input']>;
  ReceiptHeader?: InputMaybe<Scalars['Int']['input']>;
  ReceiptLine?: InputMaybe<Scalars['Int']['input']>;
  ShipmentMethod?: InputMaybe<Scalars['String']['input']>;
  ShipmentMethodDescription?: InputMaybe<Scalars['String']['input']>;
  TrackingNumber?: InputMaybe<Scalars['String']['input']>;
  UserEventID: Scalars['Int']['input'];
  UserName: Scalars['String']['input'];
  VendorName?: InputMaybe<Scalars['String']['input']>;
  WMSPriority?: InputMaybe<Scalars['Int']['input']>;
  Zone?: InputMaybe<Scalars['Int']['input']>;
};

export type InsertUserInfo = {
  CartID?: InputMaybe<Scalars['Int']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']['input']>;
  PullerLevel?: InputMaybe<Scalars['Int']['input']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ItnLifeCycle = {
  CustomerNumber?: InputMaybe<Scalars['String']['input']>;
  CustomerTier?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  NOSINumber?: InputMaybe<Scalars['String']['input']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  ParentITN?: InputMaybe<Scalars['String']['input']>;
  PartNumber?: InputMaybe<Scalars['String']['input']>;
  Priority?: InputMaybe<Scalars['Boolean']['input']>;
  ProductCode?: InputMaybe<Scalars['String']['input']>;
  ProductTier?: InputMaybe<Scalars['String']['input']>;
  Quantity?: InputMaybe<Scalars['Float']['input']>;
  TrackingNumber?: InputMaybe<Scalars['String']['input']>;
  WMSPriority?: InputMaybe<Scalars['Int']['input']>;
  Zone?: InputMaybe<Scalars['Int']['input']>;
  after_InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  agDone?: InputMaybe<Scalars['String']['input']>;
  agDoneUser?: InputMaybe<Scalars['String']['input']>;
  agInDone?: InputMaybe<Scalars['String']['input']>;
  agOrderComplete?: InputMaybe<Scalars['String']['input']>;
  agOutStart?: InputMaybe<Scalars['String']['input']>;
  agRelocate?: InputMaybe<Scalars['String']['input']>;
  agStart?: InputMaybe<Scalars['String']['input']>;
  agStartUser?: InputMaybe<Scalars['String']['input']>;
  dropoffCartSelected?: InputMaybe<Scalars['String']['input']>;
  dropoffDone?: InputMaybe<Scalars['String']['input']>;
  dropoffITNSkipped?: InputMaybe<Scalars['String']['input']>;
  dropoffLine?: InputMaybe<Scalars['String']['input']>;
  dropoffLocationSelected?: InputMaybe<Scalars['String']['input']>;
  dropoffStart?: InputMaybe<Scalars['String']['input']>;
  dropoffUser?: InputMaybe<Scalars['String']['input']>;
  lineAllocation?: InputMaybe<Scalars['String']['input']>;
  lineAllocationUser?: InputMaybe<Scalars['String']['input']>;
  lineCancel?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  orderCancel?: InputMaybe<Scalars['String']['input']>;
  packDone?: InputMaybe<Scalars['String']['input']>;
  packLine?: InputMaybe<Scalars['String']['input']>;
  packLineUser?: InputMaybe<Scalars['String']['input']>;
  packNewPackage?: InputMaybe<Scalars['String']['input']>;
  packReject?: InputMaybe<Scalars['String']['input']>;
  packStart?: InputMaybe<Scalars['String']['input']>;
  packSupervisorCheck?: InputMaybe<Scalars['String']['input']>;
  pickCartAssigned?: InputMaybe<Scalars['String']['input']>;
  pickDone?: InputMaybe<Scalars['String']['input']>;
  pickDoneUser?: InputMaybe<Scalars['String']['input']>;
  pickITNNF?: InputMaybe<Scalars['String']['input']>;
  pickITNPrint?: InputMaybe<Scalars['String']['input']>;
  pickITNScan?: InputMaybe<Scalars['String']['input']>;
  pickLabelCount?: InputMaybe<Scalars['String']['input']>;
  pickLabelQuantity?: InputMaybe<Scalars['String']['input']>;
  pickLocationScan?: InputMaybe<Scalars['String']['input']>;
  pickOverPick?: InputMaybe<Scalars['String']['input']>;
  pickQuantityEntered?: InputMaybe<Scalars['String']['input']>;
  pickShortPick?: InputMaybe<Scalars['String']['input']>;
  pickStart?: InputMaybe<Scalars['String']['input']>;
  pickStartUser?: InputMaybe<Scalars['String']['input']>;
  pickStatus15?: InputMaybe<Scalars['String']['input']>;
  pickToteAssignment?: InputMaybe<Scalars['String']['input']>;
  pickUserExit?: InputMaybe<Scalars['String']['input']>;
  pullingCartSelected?: InputMaybe<Scalars['String']['input']>;
  pullingDone?: InputMaybe<Scalars['String']['input']>;
  pullingLocationSelected?: InputMaybe<Scalars['String']['input']>;
  pullingNotFound?: InputMaybe<Scalars['String']['input']>;
  pullingStart?: InputMaybe<Scalars['String']['input']>;
  qcDone?: InputMaybe<Scalars['String']['input']>;
  qcDoneUser?: InputMaybe<Scalars['String']['input']>;
  qcHold?: InputMaybe<Scalars['String']['input']>;
  qcOrderComplete?: InputMaybe<Scalars['String']['input']>;
  qcStart?: InputMaybe<Scalars['String']['input']>;
  qcStartUser?: InputMaybe<Scalars['String']['input']>;
  qcStatus40?: InputMaybe<Scalars['String']['input']>;
  qcStatus41?: InputMaybe<Scalars['String']['input']>;
  releaseLine?: InputMaybe<Scalars['String']['input']>;
  releaseOrder?: InputMaybe<Scalars['String']['input']>;
  shipmentMethod?: InputMaybe<Scalars['String']['input']>;
  shipmentMethodDescription?: InputMaybe<Scalars['String']['input']>;
  shippingManifest?: InputMaybe<Scalars['String']['input']>;
  splitDone?: InputMaybe<Scalars['String']['input']>;
  splitDoneUser?: InputMaybe<Scalars['String']['input']>;
};

export type ItnLifecycleProcess = {
  LastProcessedID?: InputMaybe<Scalars['Int']['input']>;
};

export type OrderTasktime = {
  __typename?: 'orderTasktime';
  Order: Scalars['String']['output'];
  agIn?: Maybe<Scalars['String']['output']>;
  agOut?: Maybe<Scalars['String']['output']>;
  qcFirst?: Maybe<Scalars['String']['output']>;
  qcLast?: Maybe<Scalars['String']['output']>;
};

export type OrderView = {
  __typename?: 'orderView';
  Aggregated?: Maybe<Scalars['Int']['output']>;
  DistributionCenter?: Maybe<Scalars['String']['output']>;
  InProcess?: Maybe<Scalars['Int']['output']>;
  NOSINumber?: Maybe<Scalars['String']['output']>;
  OrderID?: Maybe<Scalars['Int']['output']>;
  OrderNumber?: Maybe<Scalars['String']['output']>;
  Priority?: Maybe<Scalars['Boolean']['output']>;
  ShippingMethod?: Maybe<Scalars['String']['output']>;
  Status?: Maybe<Scalars['String']['output']>;
  StatusID?: Maybe<Scalars['Int']['output']>;
  Unpicked?: Maybe<Scalars['Int']['output']>;
};

export type OrderViewFilter = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  NOSINumber?: InputMaybe<Scalars['String']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  Priority?: InputMaybe<Scalars['Boolean']['input']>;
  ShippingMethod?: InputMaybe<Scalars['String']['input']>;
  Status?: InputMaybe<Scalars['String']['input']>;
  StatusID?: InputMaybe<Scalars['Int']['input']>;
};

export type Route_Table = {
  __typename?: 'route_table';
  dest: Scalars['Int']['output'];
  dt: Scalars['String']['output'];
  lpn: Scalars['String']['output'];
};

export type SearchContainer = {
  Aisle?: InputMaybe<Scalars['String']['input']>;
  Barcode?: InputMaybe<Scalars['String']['input']>;
  ContainerTypeID?: InputMaybe<Scalars['Int']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  EquipmentID?: InputMaybe<Scalars['Int']['input']>;
  ParentContainerID?: InputMaybe<Scalars['Int']['input']>;
  Row?: InputMaybe<Scalars['String']['input']>;
  Section?: InputMaybe<Scalars['String']['input']>;
  Shelf?: InputMaybe<Scalars['String']['input']>;
  ShelfDetail?: InputMaybe<Scalars['String']['input']>;
  Warehouse?: InputMaybe<Scalars['String']['input']>;
  Zone?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchEventType = {
  Event?: InputMaybe<Scalars['String']['input']>;
  Module?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchIntForWmsCount = {
  Priority?: InputMaybe<Scalars['Boolean']['input']>;
  StatusID: Scalars['Int']['input'];
};

export type SearchInventory = {
  BinLocation?: InputMaybe<Scalars['String']['input']>;
  BoundForAutostore?: InputMaybe<Scalars['Boolean']['input']>;
  ContainerID?: InputMaybe<Scalars['Int']['input']>;
  CountryID?: InputMaybe<Scalars['Int']['input']>;
  DateCode?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  LocatedInAutostore?: InputMaybe<Scalars['Boolean']['input']>;
  NotFound?: InputMaybe<Scalars['Boolean']['input']>;
  OriginalQuantity?: InputMaybe<Scalars['Float']['input']>;
  ParentITN?: InputMaybe<Scalars['String']['input']>;
  ProductID?: InputMaybe<Scalars['Int']['input']>;
  QuantityOnHand?: InputMaybe<Scalars['Float']['input']>;
  ROHS?: InputMaybe<Scalars['Boolean']['input']>;
  Suspect?: InputMaybe<Scalars['Boolean']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchInventorySuspectReason = {
  InventoryID: Scalars['Int']['input'];
  SuspectReasonID?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchOrder = {
  BranchID?: InputMaybe<Scalars['String']['input']>;
  CustomerNumber?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  ExpectedShipDate?: InputMaybe<Scalars['String']['input']>;
  NOSINumber?: InputMaybe<Scalars['String']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  OrderStatusCode?: InputMaybe<Scalars['String']['input']>;
  OrderType?: InputMaybe<Scalars['String']['input']>;
  ShipmentMethodID?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
  isSelected?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchOrderLine = {
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  ProductID: Scalars['Int']['input'];
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchOrderLineDetail = {
  BinLocation?: InputMaybe<Scalars['String']['input']>;
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderLineID?: InputMaybe<Scalars['Int']['input']>;
  Quantity?: InputMaybe<Scalars['Float']['input']>;
  StatusID?: InputMaybe<Scalars['Int']['input']>;
  WMSPriority?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchPrinter = {
  Active?: InputMaybe<Scalars['Boolean']['input']>;
  DPI?: InputMaybe<Scalars['Int']['input']>;
  Description?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  Orientation?: InputMaybe<Scalars['String']['input']>;
  StationName?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchProduct = {
  PartNumber?: InputMaybe<Scalars['String']['input']>;
  ProductCodeID?: InputMaybe<Scalars['Int']['input']>;
  ProductTier?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchProductCode = {
  ProductCodeNumber?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchPurchaseOrderH = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']['input']>;
  VendorID?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchPurchaseOrderL = {
  LineNumber?: InputMaybe<Scalars['Int']['input']>;
  ProductID?: InputMaybe<Scalars['Int']['input']>;
  PurchaseOrderHID?: InputMaybe<Scalars['Int']['input']>;
  QuantityOnOrder?: InputMaybe<Scalars['Float']['input']>;
  QuantityReceived?: InputMaybe<Scalars['Float']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchReceiptH = {
  ExpectedArrivalDate?: InputMaybe<Scalars['String']['input']>;
  SourceType?: InputMaybe<Scalars['String']['input']>;
  VendorID?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchReceiptL = {
  CountryID?: InputMaybe<Scalars['Int']['input']>;
  DateCode?: InputMaybe<Scalars['String']['input']>;
  ExpectedQuantity?: InputMaybe<Scalars['Float']['input']>;
  LineNumber?: InputMaybe<Scalars['Int']['input']>;
  OverReceiving?: InputMaybe<Scalars['Boolean']['input']>;
  ProductID?: InputMaybe<Scalars['Int']['input']>;
  ROHS?: InputMaybe<Scalars['Boolean']['input']>;
  ReceiptHID?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchReceiptLd = {
  ExpectedQuantity?: InputMaybe<Scalars['Float']['input']>;
  PurchaseOrderLID?: InputMaybe<Scalars['Int']['input']>;
  ReceiptLID?: InputMaybe<Scalars['Int']['input']>;
  ReceiptStatusID?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchRoute = {
  ADGroupProtected?: InputMaybe<Scalars['Boolean']['input']>;
  Route?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchUser = {
  Name?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchUserEvent = {
  Event?: InputMaybe<Scalars['String']['input']>;
  Module?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchUserEventLog = {
  CustomerNumber?: InputMaybe<Scalars['String']['input']>;
  CustomerTier?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  Message?: InputMaybe<Scalars['String']['input']>;
  NOSINumber?: InputMaybe<Scalars['String']['input']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  ParentITN?: InputMaybe<Scalars['String']['input']>;
  PartNumber?: InputMaybe<Scalars['String']['input']>;
  Priority?: InputMaybe<Scalars['Boolean']['input']>;
  ProductCode?: InputMaybe<Scalars['String']['input']>;
  ProductTier?: InputMaybe<Scalars['String']['input']>;
  PurchaseLine?: InputMaybe<Scalars['Int']['input']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']['input']>;
  Quantity?: InputMaybe<Scalars['Float']['input']>;
  ReceiptHeader?: InputMaybe<Scalars['Int']['input']>;
  ReceiptLine?: InputMaybe<Scalars['Int']['input']>;
  ShipmentMethod?: InputMaybe<Scalars['String']['input']>;
  ShipmentMethodDescription?: InputMaybe<Scalars['String']['input']>;
  TrackingNumber?: InputMaybe<Scalars['String']['input']>;
  UserEventID?: InputMaybe<Scalars['Int']['input']>;
  UserName?: InputMaybe<Scalars['String']['input']>;
  VendorName?: InputMaybe<Scalars['String']['input']>;
  WMSPriority?: InputMaybe<Scalars['Int']['input']>;
  Zone?: InputMaybe<Scalars['Int']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchUserInfo = {
  CartID?: InputMaybe<Scalars['Int']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']['input']>;
  PullerLevel?: InputMaybe<Scalars['Int']['input']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type SearchVendor = {
  VendorName?: InputMaybe<Scalars['String']['input']>;
  VendorNumber?: InputMaybe<Scalars['String']['input']>;
  _id?: InputMaybe<Scalars['Int']['input']>;
};

export type TaskCounter = {
  __typename?: 'taskCounter';
  User: Scalars['String']['output'];
  taskCounter: Array<Maybe<Scalars['Int']['output']>>;
};

export type UpdateAutostoreOrder = {
  LastAutostoreSync?: InputMaybe<Scalars['String']['input']>;
  _id: Scalars['Int']['input'];
};

export type UpdateContainer = {
  Aisle?: InputMaybe<Scalars['String']['input']>;
  Barcode?: InputMaybe<Scalars['String']['input']>;
  ContainerTypeID?: InputMaybe<Scalars['Int']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  EquipmentID?: InputMaybe<Scalars['Int']['input']>;
  ParentContainerID?: InputMaybe<Scalars['Int']['input']>;
  Row?: InputMaybe<Scalars['String']['input']>;
  Section?: InputMaybe<Scalars['String']['input']>;
  Shelf?: InputMaybe<Scalars['String']['input']>;
  ShelfDetail?: InputMaybe<Scalars['String']['input']>;
  Warehouse?: InputMaybe<Scalars['String']['input']>;
  Zone?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateItnUserColumnsInfo = {
  SelectedColumns: Scalars['String']['input'];
};

export type UpdateItnUserLevelsInfo = {
  LowLevelLimit?: InputMaybe<Scalars['Int']['input']>;
  MediumLevelLimit?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateInventory = {
  BinLocation?: InputMaybe<Scalars['String']['input']>;
  BoundForAutostore?: InputMaybe<Scalars['Boolean']['input']>;
  ContainerID?: InputMaybe<Scalars['Int']['input']>;
  CountryID?: InputMaybe<Scalars['Int']['input']>;
  DateCode?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']['input']>;
  LocatedInAutostore?: InputMaybe<Scalars['Boolean']['input']>;
  NotFound?: InputMaybe<Scalars['Boolean']['input']>;
  OriginalQuantity?: InputMaybe<Scalars['Float']['input']>;
  ParentITN?: InputMaybe<Scalars['String']['input']>;
  ProductID?: InputMaybe<Scalars['Int']['input']>;
  QuantityOnHand?: InputMaybe<Scalars['Float']['input']>;
  ROHS?: InputMaybe<Scalars['Boolean']['input']>;
  Suspect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateOrder = {
  BranchID?: InputMaybe<Scalars['String']['input']>;
  CustomerNumber?: InputMaybe<Scalars['String']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  ExpectedShipDate?: InputMaybe<Scalars['String']['input']>;
  NOSINumber?: InputMaybe<Scalars['String']['input']>;
  OrderNumber?: InputMaybe<Scalars['String']['input']>;
  OrderStatusCode?: InputMaybe<Scalars['String']['input']>;
  OrderType?: InputMaybe<Scalars['String']['input']>;
  ShipmentMethodID?: InputMaybe<Scalars['String']['input']>;
  isSelected?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateOrderLine = {
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']['input']>;
  ProductID?: InputMaybe<Scalars['Int']['input']>;
  Quantity?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateOrderLineDetail = {
  BinLocation?: InputMaybe<Scalars['String']['input']>;
  InventoryID?: InputMaybe<Scalars['Int']['input']>;
  LastUpdated?: InputMaybe<Scalars['String']['input']>;
  OrderID?: InputMaybe<Scalars['Int']['input']>;
  OrderLineID?: InputMaybe<Scalars['Int']['input']>;
  Quantity?: InputMaybe<Scalars['Float']['input']>;
  StatusID?: InputMaybe<Scalars['Int']['input']>;
  WMSPriority?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateProduct = {
  Autostore?: InputMaybe<Scalars['Boolean']['input']>;
  Description?: InputMaybe<Scalars['String']['input']>;
  ExcludeFromAutostore?: InputMaybe<Scalars['Boolean']['input']>;
  LastAutostoreSync?: InputMaybe<Scalars['String']['input']>;
  LastUpdated?: InputMaybe<Scalars['String']['input']>;
  MICPartNumber?: InputMaybe<Scalars['String']['input']>;
  PartNumber?: InputMaybe<Scalars['String']['input']>;
  ProductCodeID?: InputMaybe<Scalars['Int']['input']>;
  ProductTier?: InputMaybe<Scalars['String']['input']>;
  ProductTypeID?: InputMaybe<Scalars['Int']['input']>;
  UOM?: InputMaybe<Scalars['String']['input']>;
  Velocity?: InputMaybe<Scalars['String']['input']>;
  _id: Scalars['Int']['input'];
};

export type UpdatePurchaseOrderH = {
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  PurchaseOrderNumber?: InputMaybe<Scalars['String']['input']>;
  VendorID?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdatePurchaseOrderL = {
  LineNumber?: InputMaybe<Scalars['Int']['input']>;
  ProductID?: InputMaybe<Scalars['Int']['input']>;
  PurchaseOrderHID?: InputMaybe<Scalars['Int']['input']>;
  QuantityOnOrder?: InputMaybe<Scalars['Float']['input']>;
  QuantityReceived?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateReceiptH = {
  ExpectedArrivalDate?: InputMaybe<Scalars['String']['input']>;
  SourceType?: InputMaybe<Scalars['String']['input']>;
  VendorID?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateReceiptL = {
  CountryID?: InputMaybe<Scalars['Int']['input']>;
  DateCode?: InputMaybe<Scalars['String']['input']>;
  ExpectedQuantity?: InputMaybe<Scalars['Float']['input']>;
  LineNumber?: InputMaybe<Scalars['Int']['input']>;
  OverReceiving?: InputMaybe<Scalars['Boolean']['input']>;
  ProductID?: InputMaybe<Scalars['Int']['input']>;
  ROHS?: InputMaybe<Scalars['Boolean']['input']>;
  ReceiptHID?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateReceiptLd = {
  ExpectedQuantity?: InputMaybe<Scalars['Float']['input']>;
  PurchaseOrderLID?: InputMaybe<Scalars['Int']['input']>;
  ReceiptLID?: InputMaybe<Scalars['Int']['input']>;
  ReceiptStatusID?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUserInfo = {
  CartID?: InputMaybe<Scalars['Int']['input']>;
  DistributionCenter?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']['input']>;
  PullerLevel?: InputMaybe<Scalars['Int']['input']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ValueMap = {
  __typename?: 'valueMap';
  SourceColumnName?: Maybe<Scalars['String']['output']>;
  SourceSystemName?: Maybe<Scalars['String']['output']>;
  SourceTableName?: Maybe<Scalars['String']['output']>;
  SourceValue?: Maybe<Scalars['String']['output']>;
  TargetColumnName?: Maybe<Scalars['String']['output']>;
  TargetSystemName?: Maybe<Scalars['String']['output']>;
  TargetTableName?: Maybe<Scalars['String']['output']>;
  TargetValue?: Maybe<Scalars['String']['output']>;
  _id?: Maybe<Scalars['Int']['output']>;
};

export type VerifyItnForSeparateQueryVariables = Types.Exact<{
  ITN: Types.Scalars['String']['input'];
  DC: Types.Scalars['String']['input'];
}>;

export type VerifyItnForSeparateQuery = {
  __typename?: 'Query';
  findInventory?: {
    __typename?: 'Inventory';
    _id: number;
    QuantityOnHand: number;
    ORDERLINEDETAILs?: Array<{
      __typename?: 'OrderLineDetail';
      StatusID: number;
    } | null> | null;
    Product: {
      __typename?: 'Product';
      PartNumber: string;
      ProductCode: { __typename?: 'ProductCode'; ProductCodeNumber: string };
    };
  } | null;
};

export type ItnSplitAndPrintLabelsMutationVariables = Types.Exact<{
  QuantityList:
    | Array<Types.InputMaybe<Types.Scalars['Float']['input']>>
    | Types.InputMaybe<Types.Scalars['Float']['input']>;
  PRINTER: Types.Scalars['String']['input'];
  DPI: Types.Scalars['String']['input'];
  ORIENTATION: Types.Scalars['String']['input'];
  PRODUCTCODE: Types.Scalars['String']['input'];
  PARTNUMBER: Types.Scalars['String']['input'];
  ITN: Types.Scalars['String']['input'];
  User: Types.Scalars['String']['input'];
}>;

export type ItnSplitAndPrintLabelsMutation = {
  __typename?: 'Mutation';
  ITNSplitAndPrintLabels: Array<string | null>;
};

export const VerifyItnForSeparateDocument = gql`
  query verifyITNForSeparate($ITN: String!, $DC: String!) {
    findInventory(
      Inventory: { InventoryTrackingNumber: $ITN, DistributionCenter: $DC }
    ) {
      _id
      QuantityOnHand
      ORDERLINEDETAILs {
        StatusID
      }
      Product {
        PartNumber
        ProductCode {
          ProductCodeNumber
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VerifyItnForSeparateGQL extends Apollo.Query<
  VerifyItnForSeparateQuery,
  VerifyItnForSeparateQueryVariables
> {
  document = VerifyItnForSeparateDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ItnSplitAndPrintLabelsDocument = gql`
  mutation ITNSplitAndPrintLabels(
    $QuantityList: [Float]!
    $PRINTER: String!
    $DPI: String!
    $ORIENTATION: String!
    $PRODUCTCODE: String!
    $PARTNUMBER: String!
    $ITN: String!
    $User: String!
  ) {
    ITNSplitAndPrintLabels(
      QuantityList: $QuantityList
      PRINTER: $PRINTER
      DPI: $DPI
      ORIENTATION: $ORIENTATION
      PRODUCTCODE: $PRODUCTCODE
      PARTNUMBER: $PARTNUMBER
      ITN: $ITN
      User: $User
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ItnSplitAndPrintLabelsGQL extends Apollo.Mutation<
  ItnSplitAndPrintLabelsMutation,
  ItnSplitAndPrintLabelsMutationVariables
> {
  document = ItnSplitAndPrintLabelsDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
