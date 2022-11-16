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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
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

export type GlobalMessage = {
  __typename?: 'GlobalMessage';
  comments?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type HoldOnCounter = {
  __typename?: 'HoldOnCounter';
  User: Scalars['String'];
  detail: Array<Maybe<Scalars['Int']>>;
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

export type ItnLifeCycle = {
  __typename?: 'ITNLifeCycle';
  CustomerNumber?: Maybe<Scalars['String']>;
  CustomerTier?: Maybe<Scalars['String']>;
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
  Container: Container;
  ContainerID: Scalars['Int'];
  Country?: Maybe<Country>;
  CountryID?: Maybe<Scalars['Int']>;
  CountryOfOrigin?: Maybe<Scalars['String']>;
  DateCode?: Maybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
  InventoryTrackingNumber: Scalars['String'];
  NotFound: Scalars['Boolean'];
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  OriginalQuantity?: Maybe<Scalars['Float']>;
  ParentITN?: Maybe<Scalars['String']>;
  Product: Product;
  ProductID: Scalars['Int'];
  QuantityOnHand: Scalars['Float'];
  ROHS?: Maybe<Scalars['Boolean']>;
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
  changeQCLineInfo: Response;
  cleanContainerFromPrevOrder?: Maybe<Scalars['Boolean']>;
  clearITNUserDefaultTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  clearMerpTote: Response;
  deleteAndInsertRouteTable: Scalars['Boolean'];
  deleteContainerFromMerp?: Maybe<Scalars['Boolean']>;
  deleteCustomerFromMerp?: Maybe<Scalars['Boolean']>;
  deleteITNLevelLimit?: Maybe<Array<Maybe<ItnUserLevelLimit>>>;
  deleteITNUserTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  deleteInventoryFromMerp?: Maybe<Scalars['Boolean']>;
  deleteOrder?: Maybe<Array<Maybe<Order>>>;
  deleteOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  deleteOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  deleteOrderLineDetailFromMerp?: Maybe<Scalars['Boolean']>;
  deletePrinter?: Maybe<Printer>;
  deleteProductFromMerp?: Maybe<Scalars['Boolean']>;
  deletePurchaseOrderLineFromMerp?: Maybe<Scalars['Boolean']>;
  deleteReceiptLD?: Maybe<Array<Maybe<ReceiptLd>>>;
  deleteTableData?: Maybe<TableData>;
  deleteUserZone?: Maybe<Zone>;
  deleteValueMap?: Maybe<ValueMap>;
  deleteVendorFromMerp?: Maybe<Scalars['Boolean']>;
  findOrCreateOrder: Order;
  findOrCreateOrderLine: OrderLine;
  findOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  findOrCreateProduct: Product;
  findOrCreateReceiptLD: ReceiptLd;
  findOrCreateUserContainer?: Maybe<Container>;
  findOrCreateUserInfo?: Maybe<UserInfo>;
  holdQCOrder: Response;
  insertITNLevelLimit?: Maybe<ItnUserLevelLimit>;
  insertITNUserColumns?: Maybe<ItnUserColumns>;
  insertITNUserLevels?: Maybe<ItnUserLevels>;
  insertITNUserTemplate?: Maybe<ItnUserTemplate>;
  insertPrinter?: Maybe<Printer>;
  insertTableData?: Maybe<Array<Maybe<TableData>>>;
  insertUserEventLogs?: Maybe<Array<Maybe<UserEventLog>>>;
  insertUserZone?: Maybe<Zone>;
  insertValueMap?: Maybe<ValueMap>;
  pickOrderForAgOut?: Maybe<OrderForAgOut>;
  printITNLabel: Response;
  updateContainer?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateContainerList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateForContainerFromMerp?: Maybe<Scalars['Boolean']>;
  updateForCustomerFromMerp?: Maybe<Scalars['Boolean']>;
  updateForInventoryFromMerp?: Maybe<Scalars['Boolean']>;
  updateForOrderLineDetailFromMerp?: Maybe<Scalars['Boolean']>;
  updateForProductFromMerp?: Maybe<Scalars['Boolean']>;
  updateForPurchaseOrderLineFromMerp?: Maybe<Scalars['Boolean']>;
  updateITNUserColumns?: Maybe<ItnUserColumns>;
  updateITNUserLevels?: Maybe<ItnUserLevels>;
  updateITNUserTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  updateInventory?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateInventoryList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateMerpOrderStatus: Response;
  updateMerpQCBin: Response;
  updateMerpWMSLog: Response;
  updateOrder?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLine?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLineDetail?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLineDetailList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updatePickingCalendarSettings: Scalars['Boolean'];
  updatePrinter?: Maybe<Printer>;
  updateReceiptLD?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateReceiptLsByID?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateTableData?: Maybe<TableData>;
  updateUserCart?: Maybe<Container>;
  updateUserCartForDropOff?: Maybe<Container>;
  updateUserInfo?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateValueMap?: Maybe<ValueMap>;
  updateVendorFromMerp?: Maybe<Scalars['Boolean']>;
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

export type MutationDeleteAndInsertRouteTableArgs = {
  lpnList: Array<InputMaybe<Scalars['String']>>;
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

export type MutationDeleteReceiptLdArgs = {
  PurchaseOrderLID?: InputMaybe<Scalars['Int']>;
  ReceiptLID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
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

export type MutationFindOrCreateOrderLineDetailArgs = {
  OrderLineDetail: InsertOrderLineDetail;
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

export type MutationHoldQcOrderArgs = {
  InternalTrackingNumber: Scalars['String'];
  Station: Scalars['String'];
  Status: Scalars['String'];
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

export type MutationInsertPrinterArgs = {
  Active?: InputMaybe<Scalars['Boolean']>;
  DPI?: InputMaybe<Scalars['Int']>;
  Description?: InputMaybe<Scalars['String']>;
  Name?: InputMaybe<Scalars['String']>;
  Orientation?: InputMaybe<Scalars['String']>;
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

export type MutationPrintItnLabelArgs = {
  InternalTrackingNumber: Scalars['String'];
  Station: Scalars['String'];
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
  Zone?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateForCustomerFromMerpArgs = {
  CustomerNumber: Scalars['String'];
  CustomerTier?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateForInventoryFromMerpArgs = {
  BinLocation: Scalars['String'];
  CountryOfOrigin?: InputMaybe<Scalars['String']>;
  DateCode?: InputMaybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
  ITN: Scalars['String'];
  OriginalQuantity?: InputMaybe<Scalars['Float']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  ProductTier?: InputMaybe<Scalars['String']>;
  QuantityOnHand: Scalars['Float'];
  ROHS?: InputMaybe<Scalars['Boolean']>;
};

export type MutationUpdateForOrderLineDetailFromMerpArgs = {
  BinLocation: Scalars['String'];
  BranchID?: InputMaybe<Scalars['String']>;
  CustomerNumber?: InputMaybe<Scalars['String']>;
  CustomerTier?: InputMaybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
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
  LineNumber: Scalars['Int'];
  LocationCode: Scalars['String'];
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  ProductTier?: InputMaybe<Scalars['String']>;
  PurchaseOrderNumber: Scalars['String'];
  QuantityOnOrder?: InputMaybe<Scalars['Int']>;
  QuantityReceived?: InputMaybe<Scalars['Int']>;
  VendorName: Scalars['String'];
  VendorNumber: Scalars['String'];
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

export type MutationUpdateOrderArgs = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  Order: UpdateOrder;
  OrderNumber?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
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
  _id: Scalars['Int'];
};

export type MutationUpdateReceiptLdArgs = {
  ReceiptLD: UpdateReceiptLd;
};

export type MutationUpdateReceiptLsByIdArgs = {
  ReceiptL: UpdateReceiptL;
  idList: Array<InputMaybe<Scalars['Int']>>;
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

export type Order = {
  __typename?: 'Order';
  BranchID?: Maybe<Scalars['String']>;
  Customer?: Maybe<Customer>;
  CustomerID?: Maybe<Scalars['Int']>;
  DistributionCenter: Scalars['String'];
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

export type Printer = {
  __typename?: 'Printer';
  Active?: Maybe<Scalars['Boolean']>;
  DPI?: Maybe<Scalars['Int']>;
  Description?: Maybe<Scalars['String']>;
  Name?: Maybe<Scalars['String']>;
  Orientation?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Product = {
  __typename?: 'Product';
  DCPRODUCTs?: Maybe<Array<Maybe<DcProduct>>>;
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
  ORDERLINEs?: Maybe<Array<Maybe<OrderLine>>>;
  PURCHASEORDERLs?: Maybe<Array<Maybe<PurchaseOrderL>>>;
  PartNumber: Scalars['String'];
  ProductCode: ProductCode;
  ProductCodeID: Scalars['Int'];
  ProductTier?: Maybe<Scalars['String']>;
  RECEIPTLs?: Maybe<Array<Maybe<ReceiptL>>>;
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
  ProductType?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
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
  LineNumber: Scalars['Int'];
  Product: Product;
  ProductID: Scalars['Int'];
  PurchaseOrderH: PurchaseOrderH;
  PurchaseOrderHID: Scalars['Int'];
  QuantityOnOrder: Scalars['Float'];
  QuantityReceived: Scalars['Float'];
  RECEIPTLDs?: Maybe<Array<Maybe<ReceiptLd>>>;
  _id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  countOrderItns: Scalars['Int'];
  createITN: Scalars['String'];
  fetchAllCountry?: Maybe<Array<Maybe<Country>>>;
  fetchDataColumnList?: Maybe<Array<Maybe<DataColumn>>>;
  fetchDataTableList?: Maybe<Array<Maybe<DataTable>>>;
  fetchDistributionCenterList?: Maybe<Array<Maybe<DistributionCenter>>>;
  fetchEntityList?: Maybe<Array<Maybe<Entity>>>;
  fetchHoldOnCounter?: Maybe<Array<Maybe<HoldOnCounter>>>;
  fetchITNLifecycle?: Maybe<Array<Maybe<ItnLifeCycle>>>;
  fetchITNLifecycleDrillDown?: Maybe<Array<Maybe<ItnLifeCycleDrillDown>>>;
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
  fetchTableData?: Maybe<Array<Maybe<TableData>>>;
  fetchTaskCounter?: Maybe<Array<Maybe<TaskCounter>>>;
  fetchUserList?: Maybe<Array<Maybe<User>>>;
  fetchUsersForZone?: Maybe<Array<Maybe<User>>>;
  fetchValueMapView?: Maybe<Array<Maybe<ValueMap>>>;
  fetchWMSStatusView?: Maybe<Array<Maybe<WmsStatusView>>>;
  fetchZoneList?: Maybe<Array<Maybe<Zone>>>;
  fetchZonesForUser?: Maybe<Array<Maybe<Zone>>>;
  findContainer?: Maybe<Container>;
  findContainers?: Maybe<Array<Maybe<Container>>>;
  findITNColumns?: Maybe<Array<Maybe<ItnColumn>>>;
  findITNTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  findITNTemplates?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  findInventory?: Maybe<Inventory>;
  findInventorys?: Maybe<Array<Maybe<Inventory>>>;
  findLocalErrorLogs?: Maybe<Array<Maybe<Scalars['String']>>>;
  findNextITNForPulling?: Maybe<ItnInfoforPulling>;
  findOrder?: Maybe<Order>;
  findOrderByStatus?: Maybe<Array<Maybe<Order>>>;
  findOrderLine?: Maybe<OrderLine>;
  findOrderLineDetail?: Maybe<OrderLineDetail>;
  findOrderLineDetails?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findOrderLines?: Maybe<Array<Maybe<OrderLine>>>;
  findOrders?: Maybe<Array<Maybe<Order>>>;
  findProduct?: Maybe<Product>;
  findProducts?: Maybe<Array<Maybe<Product>>>;
  findPurchaseOrderH?: Maybe<PurchaseOrderH>;
  findPurchaseOrderHs?: Maybe<Array<Maybe<PurchaseOrderH>>>;
  findPurchaseOrderL?: Maybe<PurchaseOrderL>;
  findPurchaseOrderLs?: Maybe<Array<Maybe<PurchaseOrderL>>>;
  findReceiptH?: Maybe<ReceiptH>;
  findReceiptHs?: Maybe<Array<Maybe<ReceiptH>>>;
  findReceiptL?: Maybe<ReceiptL>;
  findReceiptLD?: Maybe<ReceiptLd>;
  findReceiptLDs?: Maybe<Array<Maybe<ReceiptLd>>>;
  findReceiptLs?: Maybe<Array<Maybe<ReceiptL>>>;
  findRoute?: Maybe<Array<Maybe<Route>>>;
  findUser?: Maybe<User>;
  findUserEventLogs?: Maybe<Array<Maybe<UserEventLog>>>;
  findUserEvents?: Maybe<Array<Maybe<UserEvent>>>;
  findUserInfo?: Maybe<UserInfo>;
  findUserInfos?: Maybe<Array<Maybe<UserInfo>>>;
  findUsers?: Maybe<Array<Maybe<User>>>;
  findVendor?: Maybe<Vendor>;
  printReceivingLabel: Scalars['Boolean'];
};

export type QueryCountOrderItnsArgs = {
  LocationCode: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
};

export type QueryCreateItnArgs = {
  LocationCode: Scalars['String'];
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

export type QueryFetchTableDataArgs = {
  ColumnList?: InputMaybe<Scalars['String']>;
  TableName?: InputMaybe<Scalars['String']>;
  Where?: InputMaybe<Scalars['String']>;
};

export type QueryFetchTaskCounterArgs = {
  Module: Scalars['Int'];
  endDate: Scalars['String'];
  startDate: Scalars['String'];
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

export type QueryFindContainerArgs = {
  Container?: InputMaybe<SearchContainer>;
};

export type QueryFindContainersArgs = {
  Container?: InputMaybe<SearchContainer>;
  limit?: InputMaybe<Scalars['Int']>;
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

export type QueryFindInventorysArgs = {
  Inventory: SearchInventory;
  limit?: InputMaybe<Scalars['Int']>;
};

export type QueryFindLocalErrorLogsArgs = {
  Date: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
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

export type QueryFindProductArgs = {
  Product?: InputMaybe<SearchProduct>;
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

export type QueryFindReceiptHArgs = {
  ReceiptH: SearchReceiptH;
};

export type QueryFindReceiptHsArgs = {
  ReceiptH: SearchReceiptH;
  limit?: InputMaybe<Scalars['Int']>;
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

export type QueryFindReceiptLsArgs = {
  ReceiptL: SearchReceiptL;
  limit?: InputMaybe<Scalars['Int']>;
};

export type QueryFindRouteArgs = {
  route?: InputMaybe<Scalars['String']>;
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

export type QueryPrintReceivingLabelArgs = {
  DPI: Scalars['String'];
  ITN: Scalars['String'];
  ORIENTATION: Scalars['String'];
  PRINTER: Scalars['String'];
};

export type ReceiptH = {
  __typename?: 'ReceiptH';
  ExpectedArrivalDate?: Maybe<Scalars['String']>;
  RECEIPTLs?: Maybe<Array<Maybe<ReceiptL>>>;
  SourceType?: Maybe<Scalars['String']>;
  Vendor: Vendor;
  VendorID: Scalars['Int'];
  _id: Scalars['Int'];
};

export type ReceiptL = {
  __typename?: 'ReceiptL';
  Country?: Maybe<Country>;
  CountryID?: Maybe<Scalars['Int']>;
  DateCode?: Maybe<Scalars['String']>;
  ExpectedQuantity: Scalars['Float'];
  LineNumber: Scalars['Int'];
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
  Groups?: Maybe<Scalars['String']>;
  Route?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type ShipmentMethod = {
  __typename?: 'ShipmentMethod';
  PriorityPinkPaper: Scalars['Boolean'];
  ShippingMethod: Scalars['String'];
  _id: Scalars['String'];
};

export type TableData = {
  __typename?: 'TableData';
  Results?: Maybe<Scalars['String']>;
};

export type TableKey = {
  __typename?: 'TableKey';
  ID?: Maybe<Scalars['Int']>;
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
  _id: Scalars['String'];
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
  Quantity?: Maybe<Scalars['Float']>;
  ShipmentMethod?: Maybe<Scalars['String']>;
  ShipmentMethodDescription?: Maybe<Scalars['String']>;
  TrackingNumber?: Maybe<Scalars['String']>;
  UserEvent: UserEvent;
  UserEventID: Scalars['Int'];
  UserName: Scalars['String'];
  WMSPriority?: Maybe<Scalars['Int']>;
  Zone?: Maybe<Scalars['Int']>;
  _id: Scalars['Int'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  Cart?: Maybe<Container>;
  CartID?: Maybe<Scalars['Int']>;
  CartLastUpdated?: Maybe<Scalars['String']>;
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

export type InsertOrder = {
  BranchID?: InputMaybe<Scalars['String']>;
  CustomerNumber?: InputMaybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
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

export type InsertReceiptLd = {
  ExpectedQuantity: Scalars['Float'];
  PurchaseOrderLID?: InputMaybe<Scalars['Int']>;
  ReceiptLID: Scalars['Int'];
  StatusID: Scalars['Int'];
};

export type InsertUserEventLog = {
  CustomerNumber?: InputMaybe<Scalars['String']>;
  CustomerTier?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InternalTrackingNumber?: InputMaybe<Scalars['String']>;
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
  Quantity?: InputMaybe<Scalars['Float']>;
  ShipmentMethod?: InputMaybe<Scalars['String']>;
  ShipmentMethodDescription?: InputMaybe<Scalars['String']>;
  TrackingNumber?: InputMaybe<Scalars['String']>;
  UserEventID: Scalars['Int'];
  UserName: Scalars['String'];
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

export type SearchIntForWmsCount = {
  Priority?: InputMaybe<Scalars['Boolean']>;
  StatusID: Scalars['Int'];
};

export type SearchInventory = {
  BinLocation?: InputMaybe<Scalars['String']>;
  ContainerID?: InputMaybe<Scalars['Int']>;
  CountryID?: InputMaybe<Scalars['Int']>;
  DateCode?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  NotFound?: InputMaybe<Scalars['Boolean']>;
  OriginalQuantity?: InputMaybe<Scalars['Float']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  ProductID?: InputMaybe<Scalars['Int']>;
  QuantityOnHand?: InputMaybe<Scalars['Float']>;
  ROHS?: InputMaybe<Scalars['Boolean']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchOrder = {
  BranchID?: InputMaybe<Scalars['String']>;
  CustomerNumber?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
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

export type SearchProduct = {
  PartNumber?: InputMaybe<Scalars['String']>;
  ProductCodeID?: InputMaybe<Scalars['Int']>;
  ProductTier?: InputMaybe<Scalars['String']>;
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
  ProductID?: InputMaybe<Scalars['Int']>;
  ROHS?: InputMaybe<Scalars['Boolean']>;
  ReceiptHID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchReceiptLd = {
  ExpectedQuantity?: InputMaybe<Scalars['Float']>;
  PurchaseOrderLID?: InputMaybe<Scalars['Int']>;
  ReceiptLID?: InputMaybe<Scalars['Int']>;
  StatusID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchUser = {
  Name?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchUserEvent = {
  Event?: InputMaybe<Scalars['String']>;
  Module?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['String']>;
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
  Quantity?: InputMaybe<Scalars['Float']>;
  ShipmentMethod?: InputMaybe<Scalars['String']>;
  ShipmentMethodDescription?: InputMaybe<Scalars['String']>;
  TrackingNumber?: InputMaybe<Scalars['String']>;
  UserEventID?: InputMaybe<Scalars['Int']>;
  UserName?: InputMaybe<Scalars['String']>;
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
  ContainerID?: InputMaybe<Scalars['Int']>;
  CountryID?: InputMaybe<Scalars['Int']>;
  CountryOfOrigin?: InputMaybe<Scalars['String']>;
  DateCode?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  NotFound?: InputMaybe<Scalars['Boolean']>;
  OriginalQuantity?: InputMaybe<Scalars['Float']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  ProductID?: InputMaybe<Scalars['Int']>;
  QuantityOnHand?: InputMaybe<Scalars['Float']>;
  ROHS?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateOrder = {
  BranchID?: InputMaybe<Scalars['String']>;
  CustomerNumber?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
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
  ProductID?: InputMaybe<Scalars['Int']>;
  ROHS?: InputMaybe<Scalars['Boolean']>;
  ReceiptHID?: InputMaybe<Scalars['Int']>;
};

export type UpdateReceiptLd = {
  ExpectedQuantity?: InputMaybe<Scalars['Float']>;
  PurchaseOrderLID?: InputMaybe<Scalars['Int']>;
  ReceiptLID?: InputMaybe<Scalars['Int']>;
  StatusID?: InputMaybe<Scalars['Int']>;
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

export type VerifyCartAndUpdateMutationVariables = Types.Exact<{
  Container: Types.SearchContainer;
  UserID: Types.Scalars['Int'];
}>;

export type VerifyCartAndUpdateMutation = {
  __typename?: 'Mutation';
  updateUserCart?: { __typename?: 'Container'; _id: number } | null;
};

export type VerifyCartAndUpdateForDropOffMutationVariables = Types.Exact<{
  Container: Types.SearchContainer;
  UserID: Types.Scalars['Int'];
}>;

export type VerifyCartAndUpdateForDropOffMutation = {
  __typename?: 'Mutation';
  updateUserCartForDropOff?: { __typename?: 'Container'; _id: number } | null;
};

export type VerifyPositionBarcodeForPullingQueryVariables = Types.Exact<{
  Container: Types.SearchContainer;
}>;

export type VerifyPositionBarcodeForPullingQuery = {
  __typename?: 'Query';
  findContainer?: { __typename?: 'Container'; _id: number } | null;
};

export type FetchPickingSettingsQueryVariables = Types.Exact<{
  UserInfo: Types.SearchUserInfo;
}>;

export type FetchPickingSettingsQuery = {
  __typename?: 'Query';
  findUserInfo?: {
    __typename?: 'UserInfo';
    StrictPriority?: boolean | null;
    PriorityCutoff?: number | null;
    CartID?: number | null;
  } | null;
};

export type FindNextItnForPullingQueryVariables = Types.Exact<{
  Zone: Types.Scalars['Int'];
  StrictPriority: Types.Scalars['Boolean'];
  PriorityCutoff: Types.Scalars['Int'];
  Barcode: Types.Scalars['String'];
}>;

export type FindNextItnForPullingQuery = {
  __typename?: 'Query';
  findNextITNForPulling?: {
    __typename?: 'ITNInfoforPulling';
    InventoryID?: number | null;
    InventoryTrackingNumber?: string | null;
    OrderNumber?: string | null;
    NOSINumber?: string | null;
    Barcode?: string | null;
  } | null;
};

export type UpdateAfterPullingMutationVariables = Types.Exact<{
  OrderLineDetail: Types.UpdateOrderLineDetail;
  Inventory: Types.UpdateInventory;
  InventoryID: Types.Scalars['Int'];
  log:
    | Array<Types.InputMaybe<Types.InsertUserEventLog>>
    | Types.InputMaybe<Types.InsertUserEventLog>;
}>;

export type UpdateAfterPullingMutation = {
  __typename?: 'Mutation';
  updateOrderLineDetail?: Array<number | null> | null;
  updateInventory?: Array<number | null> | null;
  insertUserEventLogs?: Array<{
    __typename?: 'UserEventLog';
    _id: number;
  } | null> | null;
};

export type UpdatePullingNotFoundMutationVariables = Types.Exact<{
  OrderLineDetail: Types.UpdateOrderLineDetail;
  InventoryID: Types.Scalars['Int'];
  log:
    | Array<Types.InputMaybe<Types.InsertUserEventLog>>
    | Types.InputMaybe<Types.InsertUserEventLog>;
}>;

export type UpdatePullingNotFoundMutation = {
  __typename?: 'Mutation';
  updateOrderLineDetail?: Array<number | null> | null;
  insertUserEventLogs?: Array<{
    __typename?: 'UserEventLog';
    _id: number;
  } | null> | null;
};

export type FindItNsInCartForDropOffQueryVariables = Types.Exact<{
  ContainerID: Types.Scalars['Int'];
}>;

export type FindItNsInCartForDropOffQuery = {
  __typename?: 'Query';
  findInventorys?: Array<{
    __typename?: 'Inventory';
    InventoryTrackingNumber: string;
    ORDERLINEDETAILs?: Array<{
      __typename?: 'OrderLineDetail';
      _id: number;
      Order: { __typename?: 'Order'; OrderNumber: string; NOSINumber: string };
    } | null> | null;
  } | null> | null;
};

export type UpdateAfterDropOffMutationVariables = Types.Exact<{
  Inventory: Types.UpdateInventory;
  ContainerID: Types.Scalars['Int'];
  UserID: Types.Scalars['Int'];
  UserInfo: Types.UpdateUserInfo;
  log:
    | Array<Types.InputMaybe<Types.InsertUserEventLog>>
    | Types.InputMaybe<Types.InsertUserEventLog>;
}>;

export type UpdateAfterDropOffMutation = {
  __typename?: 'Mutation';
  updateInventory?: Array<number | null> | null;
  updateUserInfo?: Array<number | null> | null;
  insertUserEventLogs?: Array<{
    __typename?: 'UserEventLog';
    _id: number;
  } | null> | null;
};

export type FindContainerQueryVariables = Types.Exact<{
  Container: Types.SearchContainer;
}>;

export type FindContainerQuery = {
  __typename?: 'Query';
  findContainer?: { __typename?: 'Container'; _id: number } | null;
};

export type FetchPickingCalendarSettingsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type FetchPickingCalendarSettingsQuery = {
  __typename?: 'Query';
  fetchPickingCalendarSettings?: string | null;
};

export type UpdatePickingCalendarSettingsMutationVariables = Types.Exact<{
  events?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type UpdatePickingCalendarSettingsMutation = {
  __typename?: 'Mutation';
  updatePickingCalendarSettings: boolean;
};

export const VerifyCartAndUpdateDocument = gql`
  mutation verifyCartAndUpdate($Container: searchContainer!, $UserID: Int!) {
    updateUserCart(Container: $Container, UserID: $UserID) {
      _id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VerifyCartAndUpdateGQL extends Apollo.Mutation<
  VerifyCartAndUpdateMutation,
  VerifyCartAndUpdateMutationVariables
> {
  document = VerifyCartAndUpdateDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const VerifyCartAndUpdateForDropOffDocument = gql`
  mutation verifyCartAndUpdateForDropOff(
    $Container: searchContainer!
    $UserID: Int!
  ) {
    updateUserCartForDropOff(Container: $Container, UserID: $UserID) {
      _id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VerifyCartAndUpdateForDropOffGQL extends Apollo.Mutation<
  VerifyCartAndUpdateForDropOffMutation,
  VerifyCartAndUpdateForDropOffMutationVariables
> {
  document = VerifyCartAndUpdateForDropOffDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const VerifyPositionBarcodeForPullingDocument = gql`
  query verifyPositionBarcodeForPulling($Container: searchContainer!) {
    findContainer(Container: $Container) {
      _id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VerifyPositionBarcodeForPullingGQL extends Apollo.Query<
  VerifyPositionBarcodeForPullingQuery,
  VerifyPositionBarcodeForPullingQueryVariables
> {
  document = VerifyPositionBarcodeForPullingDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchPickingSettingsDocument = gql`
  query fetchPickingSettings($UserInfo: searchUserInfo!) {
    findUserInfo(UserInfo: $UserInfo) {
      StrictPriority
      PriorityCutoff
      CartID
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchPickingSettingsGQL extends Apollo.Query<
  FetchPickingSettingsQuery,
  FetchPickingSettingsQueryVariables
> {
  document = FetchPickingSettingsDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FindNextItnForPullingDocument = gql`
  query findNextITNForPulling(
    $Zone: Int!
    $StrictPriority: Boolean!
    $PriorityCutoff: Int!
    $Barcode: String!
  ) {
    findNextITNForPulling(
      Zone: $Zone
      StrictPriority: $StrictPriority
      PriorityCutoff: $PriorityCutoff
      Barcode: $Barcode
    ) {
      InventoryID
      InventoryTrackingNumber
      OrderNumber
      NOSINumber
      Barcode
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FindNextItnForPullingGQL extends Apollo.Query<
  FindNextItnForPullingQuery,
  FindNextItnForPullingQueryVariables
> {
  document = FindNextItnForPullingDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateAfterPullingDocument = gql`
  mutation updateAfterPulling(
    $OrderLineDetail: updateOrderLineDetail!
    $Inventory: updateInventory!
    $InventoryID: Int!
    $log: [insertUserEventLog]!
  ) {
    updateOrderLineDetail(
      OrderLineDetail: $OrderLineDetail
      InventoryID: $InventoryID
    )
    updateInventory(_id: $InventoryID, Inventory: $Inventory)
    insertUserEventLogs(log: $log) {
      _id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateAfterPullingGQL extends Apollo.Mutation<
  UpdateAfterPullingMutation,
  UpdateAfterPullingMutationVariables
> {
  document = UpdateAfterPullingDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdatePullingNotFoundDocument = gql`
  mutation updatePullingNotFound(
    $OrderLineDetail: updateOrderLineDetail!
    $InventoryID: Int!
    $log: [insertUserEventLog]!
  ) {
    updateOrderLineDetail(
      OrderLineDetail: $OrderLineDetail
      InventoryID: $InventoryID
    )
    insertUserEventLogs(log: $log) {
      _id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdatePullingNotFoundGQL extends Apollo.Mutation<
  UpdatePullingNotFoundMutation,
  UpdatePullingNotFoundMutationVariables
> {
  document = UpdatePullingNotFoundDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FindItNsInCartForDropOffDocument = gql`
  query findITNsInCartForDropOff($ContainerID: Int!) {
    findInventorys(Inventory: { ContainerID: $ContainerID }) {
      InventoryTrackingNumber
      ORDERLINEDETAILs {
        _id
        Order {
          OrderNumber
          NOSINumber
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FindItNsInCartForDropOffGQL extends Apollo.Query<
  FindItNsInCartForDropOffQuery,
  FindItNsInCartForDropOffQueryVariables
> {
  document = FindItNsInCartForDropOffDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateAfterDropOffDocument = gql`
  mutation updateAfterDropOff(
    $Inventory: updateInventory!
    $ContainerID: Int!
    $UserID: Int!
    $UserInfo: updateUserInfo!
    $log: [insertUserEventLog]!
  ) {
    updateInventory(Inventory: $Inventory, ContainerID: $ContainerID)
    updateUserInfo(UserInfo: $UserInfo, _id: $UserID)
    insertUserEventLogs(log: $log) {
      _id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateAfterDropOffGQL extends Apollo.Mutation<
  UpdateAfterDropOffMutation,
  UpdateAfterDropOffMutationVariables
> {
  document = UpdateAfterDropOffDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FindContainerDocument = gql`
  query findContainer($Container: searchContainer!) {
    findContainer(Container: $Container) {
      _id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FindContainerGQL extends Apollo.Query<
  FindContainerQuery,
  FindContainerQueryVariables
> {
  document = FindContainerDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchPickingCalendarSettingsDocument = gql`
  query fetchPickingCalendarSettings {
    fetchPickingCalendarSettings
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchPickingCalendarSettingsGQL extends Apollo.Query<
  FetchPickingCalendarSettingsQuery,
  FetchPickingCalendarSettingsQueryVariables
> {
  document = FetchPickingCalendarSettingsDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdatePickingCalendarSettingsDocument = gql`
  mutation updatePickingCalendarSettings($events: String) {
    updatePickingCalendarSettings(events: $events)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdatePickingCalendarSettingsGQL extends Apollo.Mutation<
  UpdatePickingCalendarSettingsMutation,
  UpdatePickingCalendarSettingsMutationVariables
> {
  document = UpdatePickingCalendarSettingsDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
