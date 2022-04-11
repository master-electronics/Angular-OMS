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
  CONTAINERs?: Maybe<Array<Maybe<Container>>>;
  ContainerType: ContainerType;
  ContainerTypeID: Scalars['Int'];
  DistributionCenter: Scalars['String'];
  Equipment?: Maybe<Equipment>;
  EquipmentID?: Maybe<Scalars['Int']>;
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  ParentContainer?: Maybe<Container>;
  ParentContainerID?: Maybe<Scalars['Int']>;
  Row?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
  USERINFOs?: Maybe<Array<Maybe<UserInfo>>>;
  Warehouse?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['Int']>;
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
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  OrderNumber?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Boolean']>;
  ProductCode?: Maybe<Scalars['String']>;
  ProductTier?: Maybe<Scalars['String']>;
  TrackingNumber?: Maybe<Scalars['String']>;
  WMSPriority?: Maybe<Scalars['Int']>;
  Zone?: Maybe<Scalars['Int']>;
  agDone?: Maybe<Scalars['String']>;
  agStart?: Maybe<Scalars['String']>;
  pickDone?: Maybe<Scalars['String']>;
  pickStart?: Maybe<Scalars['String']>;
  qcDone?: Maybe<Scalars['String']>;
  qcStart?: Maybe<Scalars['String']>;
};

export type Inventory = {
  __typename?: 'Inventory';
  Container: Container;
  ContainerID: Scalars['Int'];
  CountryOfOrigin?: Maybe<Scalars['String']>;
  DateCode?: Maybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
  InventoryTrackingNumber: Scalars['String'];
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  ParentITN?: Maybe<Scalars['String']>;
  Product: Product;
  ProductID: Scalars['Int'];
  QuantityOnHand: Scalars['Float'];
  ROHS?: Maybe<Scalars['Boolean']>;
  _id: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeQCLineInfo: Response;
  clearMerpTote: Response;
  deleteAndInsertRouteTable: Scalars['Boolean'];
  deleteOrder?: Maybe<Array<Maybe<Order>>>;
  deleteOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  deleteOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  deleteOrderLineDetailByOrderNumber?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findOrCreateOrder: Order;
  findOrCreateOrderLine: OrderLine;
  findOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  findOrCreateProduct: Product;
  findOrCreateUserInfo?: Maybe<UserInfo>;
  holdQCOrder: Response;
  insertUserEventLogs?: Maybe<Array<Maybe<UserEventLog>>>;
  pickOrderForAgOut?: Maybe<OrderForAgOut>;
  printITNLabel: Response;
  updateContainer?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateContainerList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateInventory?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateMerpOrderStatus: Response;
  updateMerpQCBin: Response;
  updateMerpWMSLog: Response;
  updateOrCreateInventory?: Maybe<Inventory>;
  updateOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  updateOrCreateProduct: Product;
  updateOrder?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLine?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLineDetail?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateUserCart?: Maybe<Container>;
  updateUserInfo?: Maybe<Array<Maybe<Scalars['Int']>>>;
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


export type MutationDeleteOrderLineDetailByOrderNumberArgs = {
  BinLocation: Scalars['String'];
  DistributionCenter: Scalars['String'];
  InternalTrackingNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderLineNumber: Scalars['Int'];
  OrderNumber: Scalars['String'];
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


export type MutationFindOrCreateUserInfoArgs = {
  UserInfo: InsertUserInfo;
};


export type MutationHoldQcOrderArgs = {
  InternalTrackingNumber: Scalars['String'];
  Station: Scalars['String'];
  Status: Scalars['String'];
};


export type MutationInsertUserEventLogsArgs = {
  log: Array<InputMaybe<InsertUserEventLog>>;
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


export type MutationUpdateInventoryArgs = {
  ContainerID?: InputMaybe<Scalars['Int']>;
  Inventory: UpdateInventory;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  _id?: InputMaybe<Scalars['Int']>;
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


export type MutationUpdateOrCreateInventoryArgs = {
  Inventory: InsertInventory;
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
  InventoryID?: InputMaybe<Scalars['Int']>;
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineDetail: UpdateOrderLineDetail;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateUserCartArgs = {
  Container: SearchContainer;
  UserID: Scalars['Int'];
};


export type MutationUpdateUserInfoArgs = {
  Name?: InputMaybe<Scalars['String']>;
  UserInfo: UpdateUserInfo;
  Zone?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
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
  Product: Product;
  ProductID: Scalars['Int'];
  Quantity?: Maybe<Scalars['Float']>;
  _id: Scalars['Int'];
};

export type OrderLineDetail = {
  __typename?: 'OrderLineDetail';
  BinLocation?: Maybe<Scalars['String']>;
  Container: Container;
  ContainerID: Scalars['Int'];
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

export type Product = {
  __typename?: 'Product';
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
  ORDERLINEs?: Maybe<Array<Maybe<OrderLine>>>;
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
  fetchHoldOnCounter?: Maybe<Array<Maybe<HoldOnCounter>>>;
  fetchITNLifecycle?: Maybe<Array<Maybe<ItnLifeCycle>>>;
  fetchOrderLineDetailforWMSCount?: Maybe<Array<Maybe<OrderLineDetail>>>;
  fetchOrderLineMessage?: Maybe<GlobalMessage>;
  fetchOrderTasktime?: Maybe<Array<Maybe<OrderTasktime>>>;
  fetchOrderView?: Maybe<Array<Maybe<OrderView>>>;
  fetchPartMessage?: Maybe<GlobalMessage>;
  fetchPrinterStation: Scalars['String'];
  fetchProductInfoFromMerp?: Maybe<Array<Maybe<ProdunctInfoFromMerp>>>;
  fetchTaskCounter?: Maybe<Array<Maybe<TaskCounter>>>;
  fetchWMSStatusView?: Maybe<Array<Maybe<WmsStatusView>>>;
  findContainer?: Maybe<Array<Maybe<Container>>>;
  findContainerList?: Maybe<Array<Maybe<Container>>>;
  findInventory?: Maybe<Array<Maybe<Inventory>>>;
  findNextITNForPulling?: Maybe<ItnInfoforPulling>;
  findOrder?: Maybe<Array<Maybe<Order>>>;
  findOrderByStatus?: Maybe<Array<Maybe<Order>>>;
  findOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  findOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findUserEventLog?: Maybe<Array<Maybe<UserEventLog>>>;
  findUserInfo?: Maybe<Array<Maybe<UserInfo>>>;
};


export type QueryCountOrderItnsArgs = {
  LocationCode: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
};


export type QueryFetchHoldOnCounterArgs = {
  endDate: Scalars['String'];
  startDate: Scalars['String'];
};


export type QueryFetchItnLifecycleArgs = {
  endDate: Scalars['String'];
  startDate: Scalars['String'];
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


export type QueryFindInventoryArgs = {
  Inventory: SearchInventory;
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
  InventoryTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  OrderNumber?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Boolean']>;
  ProductCode?: Maybe<Scalars['String']>;
  ProductTier?: Maybe<Scalars['String']>;
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
  CartID?: Maybe<Scalars['Int']>;
  CartLastUpdated?: Maybe<Scalars['String']>;
  Container?: Maybe<Container>;
  Name: Scalars['String'];
  PriorityCutoff?: Maybe<Scalars['Int']>;
  StrictPriority?: Maybe<Scalars['Boolean']>;
  Zone?: Maybe<Scalars['Int']>;
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
  ContainerID: Scalars['Int'];
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
};

export type InsertUserEventLog = {
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  Message?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  UserEventID: Scalars['Int'];
  UserID: Scalars['Int'];
};

export type InsertUserInfo = {
  CartID?: InputMaybe<Scalars['Int']>;
  Name?: InputMaybe<Scalars['String']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']>;
  Zone?: InputMaybe<Scalars['Int']>;
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
  ContainerID?: InputMaybe<Scalars['Int']>;
  CountryOfOrigin?: InputMaybe<Scalars['String']>;
  DateCode?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
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
  ContainerID: Scalars['Int'];
  InventoryID?: InputMaybe<Scalars['Int']>;
  OrderID: Scalars['Int'];
  OrderLineID: Scalars['Int'];
  Quantity: Scalars['Float'];
  StatusID: Scalars['Int'];
  WMSPriority: Scalars['Int'];
  _id: Scalars['Int'];
};

export type SearchUserEventLog = {
  CustomerNumber?: InputMaybe<Scalars['String']>;
  CustomerTier?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
  Message?: InputMaybe<Scalars['String']>;
  NOSINumber?: InputMaybe<Scalars['String']>;
  OrderLineNumber?: InputMaybe<Scalars['Int']>;
  OrderNumber?: InputMaybe<Scalars['String']>;
  PartNumber?: InputMaybe<Scalars['String']>;
  Priority?: InputMaybe<Scalars['Boolean']>;
  ProductCode?: InputMaybe<Scalars['String']>;
  ProductTier?: InputMaybe<Scalars['String']>;
  TrackingNumber?: InputMaybe<Scalars['String']>;
  UserEventID?: InputMaybe<Scalars['Int']>;
  UserID?: InputMaybe<Scalars['Int']>;
  WMSPriority?: InputMaybe<Scalars['Int']>;
  Zone?: InputMaybe<Scalars['Int']>;
  _id?: InputMaybe<Scalars['Int']>;
};

export type SearchUserInfo = {
  CartID?: InputMaybe<Scalars['Int']>;
  Name?: InputMaybe<Scalars['String']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']>;
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
  ParentContainerID?: InputMaybe<Scalars['Int']>;
  Row?: InputMaybe<Scalars['String']>;
  Section?: InputMaybe<Scalars['String']>;
  Shelf?: InputMaybe<Scalars['String']>;
  ShelfDetail?: InputMaybe<Scalars['String']>;
  Warehouse?: InputMaybe<Scalars['String']>;
  Zone?: InputMaybe<Scalars['Int']>;
};

export type UpdateInventory = {
  ContainerID?: InputMaybe<Scalars['Int']>;
  CountryOfOrigin?: InputMaybe<Scalars['String']>;
  DateCode?: InputMaybe<Scalars['String']>;
  DistributionCenter?: InputMaybe<Scalars['String']>;
  InventoryTrackingNumber?: InputMaybe<Scalars['String']>;
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
  ContainerID?: InputMaybe<Scalars['Int']>;
  InventoryID?: InputMaybe<Scalars['Int']>;
  LastUpdated?: InputMaybe<Scalars['String']>;
  OrderID?: InputMaybe<Scalars['Int']>;
  OrderLineID?: InputMaybe<Scalars['Int']>;
  Quantity?: InputMaybe<Scalars['Float']>;
  StatusID?: InputMaybe<Scalars['Int']>;
  WMSPriority?: InputMaybe<Scalars['Int']>;
};

export type UpdateUserInfo = {
  CartID?: InputMaybe<Scalars['Int']>;
  Name?: InputMaybe<Scalars['String']>;
  PriorityCutoff?: InputMaybe<Scalars['Int']>;
  StrictPriority?: InputMaybe<Scalars['Boolean']>;
  Zone?: InputMaybe<Scalars['Int']>;
};

export type VerifyCartAndUpdateMutationVariables = Types.Exact<{
  Container: Types.SearchContainer;
  UserID: Types.Scalars['Int'];
}>;


export type VerifyCartAndUpdateMutation = { __typename?: 'Mutation', updateUserCart?: { __typename?: 'Container', _id: number } | null };

export type VerifyPositionBarcodeForPullingQueryVariables = Types.Exact<{
  Container: Types.SearchContainer;
}>;


export type VerifyPositionBarcodeForPullingQuery = { __typename?: 'Query', findContainer?: Array<{ __typename?: 'Container', _id: number } | null> | null };

export type FetchPickingSettingsQueryVariables = Types.Exact<{
  UserInfo: Types.SearchUserInfo;
}>;


export type FetchPickingSettingsQuery = { __typename?: 'Query', findUserInfo?: Array<{ __typename?: 'UserInfo', Zone?: number | null, StrictPriority?: boolean | null, PriorityCutoff?: number | null, CartID?: number | null } | null> | null };

export type FindNextItnForPullingQueryVariables = Types.Exact<{
  Zone: Types.Scalars['Int'];
  StrictPriority: Types.Scalars['Boolean'];
  PriorityCutoff: Types.Scalars['Int'];
  Barcode: Types.Scalars['String'];
}>;


export type FindNextItnForPullingQuery = { __typename?: 'Query', findNextITNForPulling?: { __typename?: 'ITNInfoforPulling', InventoryID?: number | null, InventoryTrackingNumber?: string | null, OrderNumber?: string | null, NOSINumber?: string | null, Barcode?: string | null } | null };

export type UpdateAfterPullingMutationVariables = Types.Exact<{
  OrderLineDetail: Types.UpdateOrderLineDetail;
  Inventory: Types.UpdateInventory;
  InventoryID: Types.Scalars['Int'];
  log: Array<Types.InputMaybe<Types.InsertUserEventLog>> | Types.InputMaybe<Types.InsertUserEventLog>;
}>;


export type UpdateAfterPullingMutation = { __typename?: 'Mutation', updateOrderLineDetail?: Array<number | null> | null, updateInventory?: Array<number | null> | null, insertUserEventLogs?: Array<{ __typename?: 'UserEventLog', _id: number } | null> | null };

export type UpdatePullingNotFoundMutationVariables = Types.Exact<{
  OrderLineDetail: Types.UpdateOrderLineDetail;
  InventoryID: Types.Scalars['Int'];
  log: Array<Types.InputMaybe<Types.InsertUserEventLog>> | Types.InputMaybe<Types.InsertUserEventLog>;
}>;


export type UpdatePullingNotFoundMutation = { __typename?: 'Mutation', updateOrderLineDetail?: Array<number | null> | null, insertUserEventLogs?: Array<{ __typename?: 'UserEventLog', _id: number } | null> | null };

export type FindItNsInCartForDropOffQueryVariables = Types.Exact<{
  Inventory: Types.SearchInventory;
}>;


export type FindItNsInCartForDropOffQuery = { __typename?: 'Query', findInventory?: Array<{ __typename?: 'Inventory', InventoryTrackingNumber: string, ORDERLINEDETAILs?: Array<{ __typename?: 'OrderLineDetail', Order: { __typename?: 'Order', OrderNumber: string, NOSINumber: string } } | null> | null } | null> | null };

export type UpdateAfterDropOffMutationVariables = Types.Exact<{
  Inventory: Types.UpdateInventory;
  ContainerID: Types.Scalars['Int'];
  UserID: Types.Scalars['Int'];
  UserInfo: Types.UpdateUserInfo;
  log: Array<Types.InputMaybe<Types.InsertUserEventLog>> | Types.InputMaybe<Types.InsertUserEventLog>;
}>;


export type UpdateAfterDropOffMutation = { __typename?: 'Mutation', updateInventory?: Array<number | null> | null, updateUserInfo?: Array<number | null> | null, insertUserEventLogs?: Array<{ __typename?: 'UserEventLog', _id: number } | null> | null };

export type FindContainerQueryVariables = Types.Exact<{
  Container: Types.SearchContainer;
}>;


export type FindContainerQuery = { __typename?: 'Query', findContainer?: Array<{ __typename?: 'Container', _id: number } | null> | null };

export const VerifyCartAndUpdateDocument = gql`
    mutation verifyCartAndUpdate($Container: searchContainer!, $UserID: Int!) {
  updateUserCart(Container: $Container, UserID: $UserID) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class VerifyCartAndUpdateGQL extends Apollo.Mutation<VerifyCartAndUpdateMutation, VerifyCartAndUpdateMutationVariables> {
    document = VerifyCartAndUpdateDocument;
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
    providedIn: 'root'
  })
  export class VerifyPositionBarcodeForPullingGQL extends Apollo.Query<VerifyPositionBarcodeForPullingQuery, VerifyPositionBarcodeForPullingQueryVariables> {
    document = VerifyPositionBarcodeForPullingDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchPickingSettingsDocument = gql`
    query fetchPickingSettings($UserInfo: searchUserInfo!) {
  findUserInfo(UserInfo: $UserInfo) {
    Zone
    StrictPriority
    PriorityCutoff
    CartID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchPickingSettingsGQL extends Apollo.Query<FetchPickingSettingsQuery, FetchPickingSettingsQueryVariables> {
    document = FetchPickingSettingsDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FindNextItnForPullingDocument = gql`
    query findNextITNForPulling($Zone: Int!, $StrictPriority: Boolean!, $PriorityCutoff: Int!, $Barcode: String!) {
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
    providedIn: 'root'
  })
  export class FindNextItnForPullingGQL extends Apollo.Query<FindNextItnForPullingQuery, FindNextItnForPullingQueryVariables> {
    document = FindNextItnForPullingDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateAfterPullingDocument = gql`
    mutation updateAfterPulling($OrderLineDetail: updateOrderLineDetail!, $Inventory: updateInventory!, $InventoryID: Int!, $log: [insertUserEventLog]!) {
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
    providedIn: 'root'
  })
  export class UpdateAfterPullingGQL extends Apollo.Mutation<UpdateAfterPullingMutation, UpdateAfterPullingMutationVariables> {
    document = UpdateAfterPullingDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdatePullingNotFoundDocument = gql`
    mutation updatePullingNotFound($OrderLineDetail: updateOrderLineDetail!, $InventoryID: Int!, $log: [insertUserEventLog]!) {
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
    providedIn: 'root'
  })
  export class UpdatePullingNotFoundGQL extends Apollo.Mutation<UpdatePullingNotFoundMutation, UpdatePullingNotFoundMutationVariables> {
    document = UpdatePullingNotFoundDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FindItNsInCartForDropOffDocument = gql`
    query findITNsInCartForDropOff($Inventory: searchInventory!) {
  findInventory(Inventory: $Inventory) {
    ORDERLINEDETAILs {
      Order {
        OrderNumber
        NOSINumber
      }
    }
    InventoryTrackingNumber
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindItNsInCartForDropOffGQL extends Apollo.Query<FindItNsInCartForDropOffQuery, FindItNsInCartForDropOffQueryVariables> {
    document = FindItNsInCartForDropOffDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateAfterDropOffDocument = gql`
    mutation updateAfterDropOff($Inventory: updateInventory!, $ContainerID: Int!, $UserID: Int!, $UserInfo: updateUserInfo!, $log: [insertUserEventLog]!) {
  updateInventory(Inventory: $Inventory, ContainerID: $ContainerID)
  updateUserInfo(UserInfo: $UserInfo, _id: $UserID)
  insertUserEventLogs(log: $log) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateAfterDropOffGQL extends Apollo.Mutation<UpdateAfterDropOffMutation, UpdateAfterDropOffMutationVariables> {
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
    providedIn: 'root'
  })
  export class FindContainerGQL extends Apollo.Query<FindContainerQuery, FindContainerQueryVariables> {
    document = FindContainerDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }