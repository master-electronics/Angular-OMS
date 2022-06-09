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

export type Container = {
  __typename?: 'Container';
  Aisle?: Maybe<Scalars['String']>;
  Barcode: Scalars['String'];
  ContainerType: ContainerType;
  ContainerTypeID: Scalars['Int'];
  DistributionCenter: Scalars['String'];
  Equipment?: Maybe<Equipment>;
  EquipmentID?: Maybe<Scalars['Int']>;
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  Row?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
  Warehouse?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['String']>;
  /**
   * Related tables:
   * one to many ORDERLINEDETAILs
   */
  _id: Scalars['Int'];
};

export type ContainerType = {
  __typename?: 'ContainerType';
  IsMobile: Scalars['Boolean'];
  Name: Scalars['String'];
  _id: Scalars['Int'];
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
  ID: Scalars['Int'];
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

export type ItnLifeCycle = {
  __typename?: 'ITNLifeCycle';
  CustomerNumber?: Maybe<Scalars['String']>;
  CustomerTier?: Maybe<Scalars['String']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
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
  after_InternalTrackingNumber?: Maybe<Scalars['String']>;
  agDone?: Maybe<Scalars['String']>;
  agStart?: Maybe<Scalars['String']>;
  dropoffDone?: Maybe<Scalars['String']>;
  dropoffLine?: Maybe<Scalars['String']>;
  dropoffStart?: Maybe<Scalars['String']>;
  lineAllocation?: Maybe<Scalars['String']>;
  lineCancel?: Maybe<Scalars['String']>;
  orderCancel?: Maybe<Scalars['String']>;
  packDone?: Maybe<Scalars['String']>;
  packLine?: Maybe<Scalars['String']>;
  packReject?: Maybe<Scalars['String']>;
  packStart?: Maybe<Scalars['String']>;
  pickDone?: Maybe<Scalars['String']>;
  pickStart?: Maybe<Scalars['String']>;
  pullingDone?: Maybe<Scalars['String']>;
  pullingStart?: Maybe<Scalars['String']>;
  qcDone?: Maybe<Scalars['String']>;
  qcStart?: Maybe<Scalars['String']>;
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
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  Module?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  Name?: Maybe<Scalars['String']>;
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
  UserID?: Maybe<Scalars['Int']>;
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
  ITNLEVELLIMITs?: Maybe<Array<Maybe<ItnUserLevelLimit>>>;
  SelectedColumns?: Maybe<Scalars['String']>;
  TemplateName?: Maybe<Scalars['String']>;
  UserID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeQCLineInfo: Response;
  clearMerpTote: Response;
  deleteAndInsertRouteTable: Scalars['Boolean'];
  deleteITNLevelLimit?: Maybe<Array<Maybe<ItnUserLevelLimit>>>;
  deleteITNUserTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  deleteOrder?: Maybe<Array<Maybe<Order>>>;
  deleteOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  deleteOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  deleteOrderLineDetailByOrderNumber?: Maybe<Array<Maybe<OrderLineDetail>>>;
  deleteValueMap?: Maybe<ValueMap>;
  findOrCreateOrder?: Maybe<Order>;
  findOrCreateOrderLine?: Maybe<OrderLine>;
  findOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  findOrCreateUserInfo?: Maybe<UserInfo>;
  holdQCOrder: Response;
  insertITNLevelLimit?: Maybe<ItnUserLevelLimit>;
  insertITNUserColumns?: Maybe<ItnUserColumns>;
  insertITNUserLevels?: Maybe<ItnUserLevels>;
  insertITNUserTemplate?: Maybe<ItnUserTemplate>;
  insertUserEventLogs?: Maybe<Array<Maybe<UserEventLog>>>;
  insertValueMap?: Maybe<ValueMap>;
  pickOrderForAgOut?: Maybe<OrderForAgOut>;
  printITNLabel: Response;
  updateContainer?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateContainerList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateITNUserColumns?: Maybe<ItnUserColumns>;
  updateITNUserLevels?: Maybe<ItnUserLevels>;
  updateITNUserTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  updateMerpOrderStatus: Response;
  updateMerpQCBin: Response;
  updateMerpWMSLog: Response;
  updateOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  updateOrCreateProduct?: Maybe<Product>;
  updateOrder?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLine?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLineDetail?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateUserInfo?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateValueMap?: Maybe<ValueMap>;
};


export type MutationChangeQcLineInfoArgs = {
  CountMethod: Scalars['String'];
  CountryOfOrigin: Scalars['String'];
  DateCode: Scalars['String'];
  InternalTrackingNumber: Scalars['String'];
  ROHS: Scalars['String'];
};


export type MutationClearMerpToteArgs = {
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
};


export type MutationDeleteAndInsertRouteTableArgs = {
  lpnList: Array<InputMaybe<Scalars['String']>>;
};


export type MutationDeleteItnLevelLimitArgs = {
  TemplateID: Scalars['Int'];
};


export type MutationDeleteItnUserTemplateArgs = {
  _id: Scalars['Int'];
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
  InternalTrackingNumber?: InputMaybe<Scalars['String']>;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteOrderLineDetailByOrderNumberArgs = {
  BinLocation: Scalars['String'];
  DistributionCenter: Scalars['String'];
  InternalTrackingNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderLineNumber: Scalars['Int'];
  OrderNumber: Scalars['String'];
};


export type MutationDeleteValueMapArgs = {
  _id: Scalars['Int'];
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
  SelectedColumns?: InputMaybe<Scalars['String']>;
  TemplateName?: InputMaybe<Scalars['String']>;
  UserID?: InputMaybe<Scalars['Int']>;
};


export type MutationInsertUserEventLogsArgs = {
  log: Array<InputMaybe<InsertUserEventLog>>;
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
  SelectedColumns?: InputMaybe<Scalars['String']>;
  TemplateName?: InputMaybe<Scalars['String']>;
  _id: Scalars['Int'];
};


export type MutationUpdateMerpOrderStatusArgs = {
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
  Status: Scalars['String'];
  UserOrStatus?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateMerpQcBinArgs = {
  InternalTrackingNumber: Scalars['String'];
};


export type MutationUpdateMerpWmsLogArgs = {
  Action: Scalars['String'];
  ActionType: Scalars['String'];
  FileKeyList: Array<Scalars['String']>;
  LocationCode: Scalars['String'];
};


export type MutationUpdateOrCreateOrderLineDetailArgs = {
  OrderLineDetail: InsertOrderLineDetail;
};


export type MutationUpdateOrCreateProductArgs = {
  Product: InsertProduct;
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
  ContainerID?: InputMaybe<Scalars['Int']>;
  InternalTrackingNumber?: InputMaybe<Scalars['String']>;
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineDetail: UpdateOrderLineDetail;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateUserInfoArgs = {
  Name?: InputMaybe<Scalars['String']>;
  UserInfo: UpdateUserInfo;
  ZoneID?: InputMaybe<Scalars['Int']>;
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

export type Order = {
  __typename?: 'Order';
  BranchID?: Maybe<Scalars['String']>;
  CustomerNumber?: Maybe<Scalars['String']>;
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
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  Quantity?: Maybe<Scalars['Float']>;
  _id: Scalars['Int'];
};

export type OrderLineDetail = {
  __typename?: 'OrderLineDetail';
  BinLocation?: Maybe<Scalars['String']>;
  Container: Container;
  ContainerID: Scalars['Int'];
  CountryOfOrigin?: Maybe<Scalars['String']>;
  DateCode?: Maybe<Scalars['String']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  LastUpdated?: Maybe<Scalars['String']>;
  Order: Order;
  OrderID: Scalars['Int'];
  OrderLine: OrderLine;
  OrderLineID: Scalars['Int'];
  ParentITN?: Maybe<Scalars['String']>;
  Quantity: Scalars['Float'];
  ROHS: Scalars['Boolean'];
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

export type Product = {
  __typename?: 'Product';
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  _id: Scalars['Int'];
};

export type ProdunctInfoFromMerp = {
  __typename?: 'ProdunctInfoFromMerp';
  ExternalKey?: Maybe<Scalars['String']>;
  HazardMaterialLevel?: Maybe<Scalars['String']>;
  MICPartNumber?: Maybe<Scalars['String']>;
  UnitOfMeasure?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  countOrderItns: Scalars['Int'];
  fetchEntityList?: Maybe<Array<Maybe<Entity>>>;
  fetchHoldOnCounter?: Maybe<Array<Maybe<HoldOnCounter>>>;
  fetchITNLifecycle?: Maybe<Array<Maybe<ItnLifeCycle>>>;
  fetchITNLifecycleDrillDown?: Maybe<Array<Maybe<ItnLifeCycleDrillDown>>>;
  fetchITNUserColumns?: Maybe<Array<Maybe<ItnUserColumn>>>;
  fetchOrderLineDetailforWMSCount?: Maybe<Array<Maybe<OrderLineDetail>>>;
  fetchOrderLineMessage?: Maybe<GlobalMessage>;
  fetchOrderTasktime?: Maybe<Array<Maybe<OrderTasktime>>>;
  fetchOrderView?: Maybe<Array<Maybe<OrderView>>>;
  fetchPartMessage?: Maybe<GlobalMessage>;
  fetchPrinterStation: Scalars['String'];
  fetchProductInfoFromMerp?: Maybe<Array<Maybe<ProdunctInfoFromMerp>>>;
  fetchTaskCounter?: Maybe<Array<Maybe<TaskCounter>>>;
  fetchValueMapView?: Maybe<Array<Maybe<ValueMap>>>;
  fetchWMSStatusView?: Maybe<Array<Maybe<WmsStatusView>>>;
  findContainer?: Maybe<Array<Maybe<Container>>>;
  findContainerList?: Maybe<Array<Maybe<Container>>>;
  findITNColumns?: Maybe<Array<Maybe<ItnColumn>>>;
  findITNTemplate?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  findITNTemplates?: Maybe<Array<Maybe<ItnUserTemplate>>>;
  findOrder?: Maybe<Array<Maybe<Order>>>;
  findOrderByStatus?: Maybe<Array<Maybe<Order>>>;
  findOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  findOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findUserEventLog?: Maybe<Array<Maybe<UserEventLog>>>;
  findUserInfo?: Maybe<Array<Maybe<UserInfo>>>;
  findZone?: Maybe<Array<Maybe<Zone>>>;
};


export type QueryCountOrderItnsArgs = {
  LocationCode: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
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
  internalTrackingNumber?: InputMaybe<Scalars['String']>;
  nosiNumber?: InputMaybe<Scalars['String']>;
  orderLineNumber?: InputMaybe<Scalars['Int']>;
  orderNumber: Scalars['String'];
};


export type QueryFetchItnUserColumnsArgs = {
  userId?: InputMaybe<Scalars['String']>;
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


export type QueryFetchProductInfoFromMerpArgs = {
  ProductList: Array<InputMaybe<Scalars['String']>>;
};


export type QueryFetchTaskCounterArgs = {
  Module: Scalars['Int'];
  endDate: Scalars['String'];
  startDate: Scalars['String'];
};


export type QueryFindContainerArgs = {
  Container: SearchContainer;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryFindContainerListArgs = {
  BarcodeList?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  Limit?: InputMaybe<Scalars['Int']>;
  idList?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  offset?: InputMaybe<Scalars['Int']>;
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


export type QueryFindOrderArgs = {
  Order: SearchOrder;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryFindOrderByStatusArgs = {
  PriorityPinkPaper?: InputMaybe<Scalars['Boolean']>;
  StatusID: Scalars['Int'];
};


export type QueryFindOrderLineArgs = {
  OrderLine: SearchOrderLine;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryFindOrderLineDetailArgs = {
  OrderLineDetail: SearchOrderLineDetail;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryFindUserEventLogArgs = {
  Module?: InputMaybe<Scalars['Int']>;
  UserEventLog: SearchUserEventLog;
  endDate?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['String']>;
};


export type QueryFindUserInfoArgs = {
  UserInfo?: InputMaybe<SearchUserInfo>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryFindZoneArgs = {
  ZoneInfo?: InputMaybe<SearchZone>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type Response = {
  __typename?: 'Response';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type ShipmentMethod = {
  __typename?: 'ShipmentMethod';
  PriorityPinkPaper: Scalars['Boolean'];
  ShippingMethod: Scalars['String'];
  _id: Scalars['String'];
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
  DateTime: Scalars['String'];
  DistributionCenter?: Maybe<Scalars['String']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  NOSINumber: Scalars['String'];
  OrderLineNumber?: Maybe<Scalars['Int']>;
  OrderNumber: Scalars['String'];
  ParentITN?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Boolean']>;
  ProductCode?: Maybe<Scalars['String']>;
  ProductTier?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
  ShipmentMethod?: Maybe<Scalars['String']>;
  ShipmentMethodDescription?: Maybe<Scalars['String']>;
  TrackingNumber?: Maybe<Scalars['String']>;
  User: UserInfo;
  UserEvent: UserEvent;
  UserEventID: Scalars['Int'];
  UserID: Scalars['Int'];
  WMSPriority?: Maybe<Scalars['Int']>;
  Zone?: Maybe<Scalars['Int']>;
  _id: Scalars['Int'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  Name: Scalars['String'];
  Zone?: Maybe<Zone>;
  ZoneID?: Maybe<Scalars['Int']>;
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
  DistributionCenter: Scalars['String'];
  USERINFOs?: Maybe<Array<Maybe<UserInfo>>>;
  Zone: Scalars['Int'];
  _id: Scalars['Int'];
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

export type InsertItnUserColumnsInfo = {
  SelectedColumns: Scalars['String'];
  UserID: Scalars['Int'];
};

export type InsertItnUserLevelsInfo = {
  LowLevelLimit?: InputMaybe<Scalars['Int']>;
  MediumLevelLimit?: InputMaybe<Scalars['Int']>;
  UserID: Scalars['Int'];
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
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  Quantity?: InputMaybe<Scalars['Float']>;
};

export type InsertOrderLineDetail = {
  BinLocation: Scalars['String'];
  ContainerID?: InputMaybe<Scalars['Int']>;
  CountryOfOrigin?: InputMaybe<Scalars['String']>;
  DateCode?: InputMaybe<Scalars['String']>;
  InternalTrackingNumber?: InputMaybe<Scalars['String']>;
  OrderID: Scalars['Int'];
  OrderLineID: Scalars['Int'];
  ParentITN?: InputMaybe<Scalars['String']>;
  Quantity: Scalars['Float'];
  ROHS?: InputMaybe<Scalars['Boolean']>;
  StatusID: Scalars['Int'];
  WMSPriority?: InputMaybe<Scalars['Int']>;
};

export type InsertProduct = {
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
};

export type InsertUserEventLog = {
  CustomerNumber?: InputMaybe<Scalars['String']>;
  CustomerTier?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InternalTrackingNumber?: InputMaybe<Scalars['String']>;
  Message?: InputMaybe<Scalars['String']>;
  NOSINumber: Scalars['String'];
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  OrderNumber: Scalars['String'];
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
  UserID: Scalars['Int'];
  WMSPriority?: InputMaybe<Scalars['Int']>;
  Zone?: InputMaybe<Scalars['Int']>;
};

export type InsertUserInfo = {
  Name: Scalars['String'];
  ZoneID?: InputMaybe<Scalars['Int']>;
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
  Row?: InputMaybe<Scalars['String']>;
  Section?: InputMaybe<Scalars['String']>;
  Shelf?: InputMaybe<Scalars['String']>;
  ShelfDetail?: InputMaybe<Scalars['String']>;
  Warehouse?: InputMaybe<Scalars['String']>;
  Zone?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchIntForWmsCount = {
  Priority?: InputMaybe<Scalars['Boolean']>;
  StatusID: Scalars['Int'];
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
  PartNumber?: InputMaybe<Scalars['String']>;
  ProductCode?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchOrderLineDetail = {
  BinLocation?: InputMaybe<Scalars['String']>;
  ContainerID?: InputMaybe<Scalars['Int']>;
  CountryOfOrigin?: InputMaybe<Scalars['String']>;
  DateCode?: InputMaybe<Scalars['String']>;
  InternalTrackingNumber?: InputMaybe<Scalars['String']>;
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  Quantity?: InputMaybe<Scalars['Float']>;
  ROHS?: InputMaybe<Scalars['Boolean']>;
  StatusID?: InputMaybe<Scalars['Int']>;
  WMSPriority?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchUserEventLog = {
  CustomerNumber?: InputMaybe<Scalars['String']>;
  CustomerTier?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InternalTrackingNumber?: InputMaybe<Scalars['String']>;
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
  UserID?: InputMaybe<Scalars['Int']>;
  WMSPriority?: InputMaybe<Scalars['Int']>;
  Zone?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchUserInfo = {
  Name?: InputMaybe<Scalars['String']>;
  ZoneID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchZone = {
  DistributionCenter?: InputMaybe<Scalars['String']>;
  Zone?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type TaskCounter = {
  __typename?: 'taskCounter';
  ID: Scalars['Int'];
  User: Scalars['String'];
  taskCounter: Array<Maybe<Scalars['Int']>>;
};

export type UpdateContainer = {
  Aisle?: InputMaybe<Scalars['String']>;
  Barcode?: InputMaybe<Scalars['String']>;
  ContainerTypeID?: InputMaybe<Scalars['Int']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  EquipmentID?: InputMaybe<Scalars['Int']>;
  Row?: InputMaybe<Scalars['String']>;
  Section?: InputMaybe<Scalars['String']>;
  Shelf?: InputMaybe<Scalars['String']>;
  ShelfDetail?: InputMaybe<Scalars['String']>;
  Warehouse?: InputMaybe<Scalars['String']>;
  Zone?: InputMaybe<Scalars['String']>;
};

export type UpdateItnUserColumnsInfo = {
  SelectedColumns: Scalars['String'];
};

export type UpdateItnUserLevelsInfo = {
  LowLevelLimit?: InputMaybe<Scalars['Int']>;
  MediumLevelLimit?: InputMaybe<Scalars['Int']>;
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
  PartNumber?: InputMaybe<Scalars['String']>;
  ProductCode?: InputMaybe<Scalars['String']>;
  Quantity?: InputMaybe<Scalars['Float']>;
};

export type UpdateOrderLineDetail = {
  BinLocation?: InputMaybe<Scalars['String']>;
  ContainerID?: InputMaybe<Scalars['Int']>;
  CountryOfOrigin?: InputMaybe<Scalars['String']>;
  DateCode?: InputMaybe<Scalars['String']>;
  InternalTrackingNumber?: InputMaybe<Scalars['String']>;
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  ParentITN?: InputMaybe<Scalars['String']>;
  Quantity?: InputMaybe<Scalars['Float']>;
  ROHS?: InputMaybe<Scalars['Boolean']>;
  StatusID?: InputMaybe<Scalars['Int']>;
  WMSPriority?: InputMaybe<Scalars['Int']>;
};

export type UpdateUserInfo = {
  Name?: InputMaybe<Scalars['String']>;
  ZoneID?: InputMaybe<Scalars['Int']>;
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

export type VerifyItNforQcQueryVariables = Types.Exact<{
  OrderLineDetail: Types.SearchOrderLineDetail;
}>;


export type VerifyItNforQcQuery = { __typename?: 'Query', findOrderLineDetail?: Array<{ __typename?: 'OrderLineDetail', StatusID: number, ParentITN?: string | null, Quantity: number, ROHS: boolean, DateCode?: string | null, CountryOfOrigin?: string | null, BinLocation?: string | null, OrderLine: { __typename?: 'OrderLine', OrderLineNumber: number, ProductCode: string, PartNumber: string }, Order: { __typename?: 'Order', _id: number, DistributionCenter: string, OrderNumber: string, NOSINumber: string, CustomerNumber?: string | null } } | null> | null };

export type FetchProductInfoFromMerpQueryVariables = Types.Exact<{
  ProductList: Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>;
}>;


export type FetchProductInfoFromMerpQuery = { __typename?: 'Query', fetchProductInfoFromMerp?: Array<{ __typename?: 'ProdunctInfoFromMerp', HazardMaterialLevel?: string | null, MICPartNumber?: string | null, UnitOfMeasure?: string | null } | null> | null };

export type QcGlobalMessageQueryVariables = Types.Exact<{
  CustomerNumber: Types.Scalars['String'];
  DistributionCenter: Types.Scalars['String'];
  OrderNumber: Types.Scalars['String'];
  OrderLineNumber: Types.Scalars['String'];
  ProductCode: Types.Scalars['String'];
  PartNumber: Types.Scalars['String'];
}>;


export type QcGlobalMessageQuery = { __typename?: 'Query', fetchOrderLineMessage?: { __typename?: 'GlobalMessage', comments?: Array<string | null> | null } | null, fetchPartMessage?: { __typename?: 'GlobalMessage', comments?: Array<string | null> | null } | null };

export type FetchPrinterStationQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FetchPrinterStationQuery = { __typename?: 'Query', fetchPrinterStation: string };

export type PrintItnLabelMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  Station: Types.Scalars['String'];
}>;


export type PrintItnLabelMutation = { __typename?: 'Mutation', printITNLabel: { __typename?: 'Response', success: boolean, message?: string | null } };

export type VerifyQcRepackQueryVariables = Types.Exact<{
  Container: Types.SearchContainer;
  Order: Types.SearchOrder;
}>;


export type VerifyQcRepackQuery = { __typename?: 'Query', findContainer?: Array<{ __typename?: 'Container', _id: number, Row?: string | null, ContainerTypeID: number, ORDERLINEDETAILs?: Array<{ __typename?: 'OrderLineDetail', InternalTrackingNumber?: string | null, StatusID: number, OrderID: number } | null> | null } | null> | null, findOrder?: Array<{ __typename?: 'Order', _id: number, ORDERLINEDETAILs?: Array<{ __typename?: 'OrderLineDetail', InternalTrackingNumber?: string | null, StatusID: number, ContainerID: number } | null> | null } | null> | null };

export type HoldQcOrderMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  Status: Types.Scalars['String'];
  Station: Types.Scalars['String'];
  StatusID: Types.Scalars['Int'];
  log: Array<Types.InputMaybe<Types.InsertUserEventLog>> | Types.InputMaybe<Types.InsertUserEventLog>;
}>;


export type HoldQcOrderMutation = { __typename?: 'Mutation', updateOrderLineDetail?: Array<number | null> | null, holdQCOrder: { __typename?: 'Response', success: boolean, message?: string | null }, insertUserEventLogs?: Array<{ __typename?: 'UserEventLog', _id: number } | null> | null };

export type UpdateMerpAfterQcRepackMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  DateCode: Types.Scalars['String'];
  CountryOfOrigin: Types.Scalars['String'];
  ROHS: Types.Scalars['String'];
  CountMethod: Types.Scalars['String'];
}>;


export type UpdateMerpAfterQcRepackMutation = { __typename?: 'Mutation', changeQCLineInfo: { __typename?: 'Response', success: boolean, message?: string | null } };

export type UpdateMerpForLastLineAfterQcRepackMutationVariables = Types.Exact<{
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
  Status: Types.Scalars['String'];
  UserOrStatus?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type UpdateMerpForLastLineAfterQcRepackMutation = { __typename?: 'Mutation', updateMerpOrderStatus: { __typename?: 'Response', success: boolean, message?: string | null }, clearMerpTote: { __typename?: 'Response', success: boolean, message?: string | null } };

export type FindNewOrderLineDetailAfterUpdateBinQueryVariables = Types.Exact<{
  OrderLineDetail: Types.SearchOrderLineDetail;
}>;


export type FindNewOrderLineDetailAfterUpdateBinQuery = { __typename?: 'Query', findOrderLineDetail?: Array<{ __typename?: 'OrderLineDetail', _id: number, BinLocation?: string | null } | null> | null };

export const VerifyItNforQcDocument = gql`
    query verifyITNforQc($OrderLineDetail: searchOrderLineDetail!) {
  findOrderLineDetail(OrderLineDetail: $OrderLineDetail) {
    StatusID
    ParentITN
    Quantity
    ROHS
    DateCode
    CountryOfOrigin
    BinLocation
    OrderLine {
      OrderLineNumber
      ProductCode
      PartNumber
    }
    Order {
      _id
      DistributionCenter
      OrderNumber
      NOSINumber
      CustomerNumber
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class VerifyItNforQcGQL extends Apollo.Query<VerifyItNforQcQuery, VerifyItNforQcQueryVariables> {
    document = VerifyItNforQcDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchProductInfoFromMerpDocument = gql`
    query fetchProductInfoFromMerp($ProductList: [String]!) {
  fetchProductInfoFromMerp(ProductList: $ProductList) {
    HazardMaterialLevel
    MICPartNumber
    UnitOfMeasure
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchProductInfoFromMerpGQL extends Apollo.Query<FetchProductInfoFromMerpQuery, FetchProductInfoFromMerpQueryVariables> {
    document = FetchProductInfoFromMerpDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const QcGlobalMessageDocument = gql`
    query qcGlobalMessage($CustomerNumber: String!, $DistributionCenter: String!, $OrderNumber: String!, $OrderLineNumber: String!, $ProductCode: String!, $PartNumber: String!) {
  fetchOrderLineMessage(
    CustomerNumber: $CustomerNumber
    DistributionCenter: $DistributionCenter
    OrderNumber: $OrderNumber
    OrderLineNumber: $OrderLineNumber
  ) {
    comments
  }
  fetchPartMessage(ProductCode: $ProductCode, PartNumber: $PartNumber) {
    comments
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class QcGlobalMessageGQL extends Apollo.Query<QcGlobalMessageQuery, QcGlobalMessageQueryVariables> {
    document = QcGlobalMessageDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchPrinterStationDocument = gql`
    query fetchPrinterStation {
  fetchPrinterStation
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchPrinterStationGQL extends Apollo.Query<FetchPrinterStationQuery, FetchPrinterStationQueryVariables> {
    document = FetchPrinterStationDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PrintItnLabelDocument = gql`
    mutation printITNLabel($InternalTrackingNumber: String!, $Station: String!) {
  printITNLabel(
    InternalTrackingNumber: $InternalTrackingNumber
    Station: $Station
  ) {
    success
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PrintItnLabelGQL extends Apollo.Mutation<PrintItnLabelMutation, PrintItnLabelMutationVariables> {
    document = PrintItnLabelDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const VerifyQcRepackDocument = gql`
    query verifyQCRepack($Container: searchContainer!, $Order: searchOrder!) {
  findContainer(Container: $Container) {
    _id
    Row
    ContainerTypeID
    ORDERLINEDETAILs {
      InternalTrackingNumber
      StatusID
      OrderID
    }
  }
  findOrder(Order: $Order) {
    _id
    ORDERLINEDETAILs {
      InternalTrackingNumber
      StatusID
      ContainerID
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class VerifyQcRepackGQL extends Apollo.Query<VerifyQcRepackQuery, VerifyQcRepackQueryVariables> {
    document = VerifyQcRepackDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const HoldQcOrderDocument = gql`
    mutation holdQCOrder($InternalTrackingNumber: String!, $Status: String!, $Station: String!, $StatusID: Int!, $log: [insertUserEventLog]!) {
  holdQCOrder(
    InternalTrackingNumber: $InternalTrackingNumber
    Status: $Status
    Station: $Station
  ) {
    success
    message
  }
  updateOrderLineDetail(
    InternalTrackingNumber: $InternalTrackingNumber
    OrderLineDetail: {StatusID: $StatusID}
  )
  insertUserEventLogs(log: $log) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class HoldQcOrderGQL extends Apollo.Mutation<HoldQcOrderMutation, HoldQcOrderMutationVariables> {
    document = HoldQcOrderDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateMerpAfterQcRepackDocument = gql`
    mutation updateMerpAfterQcRepack($InternalTrackingNumber: String!, $DateCode: String!, $CountryOfOrigin: String!, $ROHS: String!, $CountMethod: String!) {
  changeQCLineInfo(
    InternalTrackingNumber: $InternalTrackingNumber
    DateCode: $DateCode
    CountryOfOrigin: $CountryOfOrigin
    ROHS: $ROHS
    CountMethod: $CountMethod
  ) {
    success
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateMerpAfterQcRepackGQL extends Apollo.Mutation<UpdateMerpAfterQcRepackMutation, UpdateMerpAfterQcRepackMutationVariables> {
    document = UpdateMerpAfterQcRepackDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateMerpForLastLineAfterQcRepackDocument = gql`
    mutation updateMerpForLastLineAfterQCRepack($OrderNumber: String!, $NOSINumber: String!, $Status: String!, $UserOrStatus: String) {
  updateMerpOrderStatus(
    OrderNumber: $OrderNumber
    NOSINumber: $NOSINumber
    Status: $Status
    UserOrStatus: $UserOrStatus
  ) {
    success
    message
  }
  clearMerpTote(OrderNumber: $OrderNumber, NOSINumber: $NOSINumber) {
    success
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateMerpForLastLineAfterQcRepackGQL extends Apollo.Mutation<UpdateMerpForLastLineAfterQcRepackMutation, UpdateMerpForLastLineAfterQcRepackMutationVariables> {
    document = UpdateMerpForLastLineAfterQcRepackDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FindNewOrderLineDetailAfterUpdateBinDocument = gql`
    query findNewOrderLineDetailAfterUpdateBin($OrderLineDetail: searchOrderLineDetail!) {
  findOrderLineDetail(OrderLineDetail: $OrderLineDetail) {
    _id
    BinLocation
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindNewOrderLineDetailAfterUpdateBinGQL extends Apollo.Query<FindNewOrderLineDetailAfterUpdateBinQuery, FindNewOrderLineDetailAfterUpdateBinQueryVariables> {
    document = FindNewOrderLineDetailAfterUpdateBinDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }