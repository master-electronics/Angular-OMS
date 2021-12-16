import * as Types from './generated/types.graphql-gen';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
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

export type EventLog = {
  __typename?: 'EventLog';
  DateTime: Scalars['String'];
  Event: Scalars['String'];
  Module?: Maybe<Scalars['String']>;
  SubTarget?: Maybe<Scalars['String']>;
  Target?: Maybe<Scalars['String']>;
  User: UserInfo;
  UserID: Scalars['Int'];
  _id: Scalars['Int'];
};

export type GlobalMessage = {
  __typename?: 'GlobalMessage';
  comments?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeQCLineInfo: Response;
  clearMerpTote: Response;
  createEventLog: EventLog;
  deleteAndInsertRouteTable: Scalars['Boolean'];
  deleteOrder?: Maybe<Array<Maybe<Order>>>;
  deleteOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  deleteOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  deleteOrderLineDetailByOrderNumber?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findOrCreateOrder?: Maybe<Order>;
  findOrCreateOrderLine?: Maybe<OrderLine>;
  findOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  findOrCreateUserInfo?: Maybe<UserInfo>;
  holdQCOrder: Response;
  insertUserEventLogs?: Maybe<Array<Maybe<UserEventLog>>>;
  pickOrderForAgOut?: Maybe<OrderForAgOut>;
  printITNLabel: Response;
  updateContainer?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateContainerList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateMerpOrderStatus: Response;
  updateMerpWMSLog: Response;
  updateOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  updateOrder?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLine?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLineDetail?: Maybe<Array<Maybe<Scalars['Int']>>>;
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


export type MutationCreateEventLogArgs = {
  EventLog: InsertEventLog;
};


export type MutationDeleteAndInsertRouteTableArgs = {
  lpnList: Array<Maybe<Scalars['String']>>;
};


export type MutationDeleteOrderArgs = {
  DistributionCenter?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};


export type MutationDeleteOrderLineArgs = {
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};


export type MutationDeleteOrderLineDetailArgs = {
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  OrderLineID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
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


export type MutationFindOrCreateUserInfoArgs = {
  UserInfo: InsertUserInfo;
};


export type MutationHoldQcOrderArgs = {
  InternalTrackingNumber: Scalars['String'];
  Station: Scalars['String'];
  Status: Scalars['String'];
};


export type MutationInsertUserEventLogsArgs = {
  log: Array<Maybe<InsertUserEventLog>>;
};


export type MutationPrintItnLabelArgs = {
  InternalTrackingNumber: Scalars['String'];
  Station: Scalars['String'];
};


export type MutationUpdateContainerArgs = {
  Barcode?: Maybe<Scalars['String']>;
  Container: UpdateContainer;
  _id?: Maybe<Scalars['Int']>;
};


export type MutationUpdateContainerListArgs = {
  BarcodeList?: Maybe<Array<Maybe<Scalars['String']>>>;
  Container: UpdateContainer;
  DistributionCenter?: Maybe<Scalars['String']>;
  idList?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


export type MutationUpdateMerpOrderStatusArgs = {
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
  Status: Scalars['String'];
  UserOrStatus?: Maybe<Scalars['String']>;
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


export type MutationUpdateOrderArgs = {
  DistributionCenter?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  Order: UpdateOrder;
  OrderNumber?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};


export type MutationUpdateOrderLineArgs = {
  OrderLine: UpdateOrderLine;
};


export type MutationUpdateOrderLineDetailArgs = {
  ContainerID?: Maybe<Scalars['Int']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineDetail: UpdateOrderLineDetail;
  OrderLineID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};


export type MutationUpdateUserInfoArgs = {
  Name?: Maybe<Scalars['String']>;
  UserInfo: UpdateUserInfo;
  ZoneID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
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
  isSelected: Scalars['Boolean'];
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

export type ProdunctInfoFromMerp = {
  __typename?: 'ProdunctInfoFromMerp';
  ExternalKey?: Maybe<Scalars['String']>;
  HazardMaterialLevel?: Maybe<Scalars['String']>;
  MICPartNumber?: Maybe<Scalars['String']>;
  UnitOfMeasure?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
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
  findEventLog?: Maybe<Array<Maybe<EventLog>>>;
  findOrder?: Maybe<Array<Maybe<Order>>>;
  findOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  findOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findUserEventLog?: Maybe<Array<Maybe<UserEventLog>>>;
  findUserInfo?: Maybe<Array<Maybe<UserInfo>>>;
  findZone?: Maybe<Array<Maybe<Zone>>>;
};


export type QueryFetchOrderLineDetailforWmsCountArgs = {
  filter?: Maybe<SearchIntForWmsCount>;
};


export type QueryFetchOrderLineMessageArgs = {
  CustomerNumber: Scalars['String'];
  DistributionCenter: Scalars['String'];
  OrderLineNumber: Scalars['String'];
  OrderNumber: Scalars['String'];
};


export type QueryFetchOrderTasktimeArgs = {
  Order?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryFetchOrderViewArgs = {
  filter?: Maybe<OrderViewFilter>;
};


export type QueryFetchPartMessageArgs = {
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
};


export type QueryFetchProductInfoFromMerpArgs = {
  ProductList: Array<Maybe<Scalars['String']>>;
};


export type QueryFetchTaskCounterArgs = {
  Module: Scalars['Int'];
  endDate: Scalars['String'];
  startDate: Scalars['String'];
};


export type QueryFindContainerArgs = {
  Container: SearchContainer;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryFindContainerListArgs = {
  BarcodeList?: Maybe<Array<Maybe<Scalars['String']>>>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Limit?: Maybe<Scalars['Int']>;
  idList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryFindEventLogArgs = {
  EventLog: SearchEventLog;
  endDate?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  startDate?: Maybe<Scalars['String']>;
};


export type QueryFindOrderArgs = {
  Order: SearchOrder;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryFindOrderLineArgs = {
  OrderLine: SearchOrderLine;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryFindOrderLineDetailArgs = {
  OrderLineDetail: SearchOrderLineDetail;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryFindUserEventLogArgs = {
  Module?: Maybe<Scalars['Int']>;
  UserEventLog: SearchUserEventLog;
  endDate?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  startDate?: Maybe<Scalars['String']>;
};


export type QueryFindUserInfoArgs = {
  UserInfo?: Maybe<SearchUserInfo>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryFindZoneArgs = {
  ZoneInfo?: Maybe<SearchZone>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
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
  DateTime: Scalars['String'];
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
  User: UserInfo;
  UserEvent: UserEvent;
  UserEventID: Scalars['Int'];
  UserID: Scalars['Int'];
  _id: Scalars['Int'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  EVENTLOGs?: Maybe<Array<Maybe<EventLog>>>;
  Name: Scalars['String'];
  USEREVENTLOGs?: Maybe<Array<Maybe<UserEventLog>>>;
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

export type InsertEventLog = {
  Event: Scalars['String'];
  Module?: Maybe<Scalars['String']>;
  SubTarget?: Maybe<Scalars['String']>;
  Target?: Maybe<Scalars['String']>;
  UserID: Scalars['Int'];
};

export type InsertOrder = {
  BranchID?: Maybe<Scalars['String']>;
  CustomerNumber?: Maybe<Scalars['String']>;
  DistributionCenter: Scalars['String'];
  LastUpdated?: Maybe<Scalars['String']>;
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
  OrderStatusCode?: Maybe<Scalars['String']>;
  OrderType?: Maybe<Scalars['String']>;
  ShipmentMethodID?: Maybe<Scalars['String']>;
};

export type InsertOrderLine = {
  OrderID: Scalars['Int'];
  OrderLineNumber: Scalars['Int'];
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  Quantity?: Maybe<Scalars['Float']>;
};

export type InsertOrderLineDetail = {
  BinLocation: Scalars['String'];
  ContainerID: Scalars['Int'];
  CountryOfOrigin?: Maybe<Scalars['String']>;
  DateCode?: Maybe<Scalars['String']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  OrderID: Scalars['Int'];
  OrderLineID: Scalars['Int'];
  ParentITN?: Maybe<Scalars['String']>;
  Quantity: Scalars['Float'];
  ROHS?: Maybe<Scalars['Boolean']>;
  StatusID: Scalars['Int'];
  WMSPriority?: Maybe<Scalars['Int']>;
};

export type InsertUserEventLog = {
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
  UserEventID: Scalars['Int'];
  UserID: Scalars['Int'];
};

export type InsertUserInfo = {
  Name: Scalars['String'];
  ZoneID?: Maybe<Scalars['Int']>;
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
  DistributionCenter?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Boolean']>;
  ShippingMethod?: Maybe<Scalars['String']>;
  Status?: Maybe<Scalars['String']>;
  StatusID?: Maybe<Scalars['Int']>;
};

export type Route_Table = {
  __typename?: 'route_table';
  dest: Scalars['Int'];
  dt: Scalars['String'];
  lpn: Scalars['String'];
};

export type SearchContainer = {
  Aisle?: Maybe<Scalars['String']>;
  Barcode?: Maybe<Scalars['String']>;
  ContainerTypeID?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  EquipmentID?: Maybe<Scalars['Int']>;
  Row?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
  Warehouse?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type SearchEventLog = {
  Event?: Maybe<Scalars['String']>;
  Module?: Maybe<Scalars['String']>;
  SubTarget?: Maybe<Scalars['String']>;
  Target?: Maybe<Scalars['String']>;
  UserID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type SearchIntForWmsCount = {
  Priority?: Maybe<Scalars['Boolean']>;
  StatusID: Scalars['Int'];
};

export type SearchOrder = {
  BranchID?: Maybe<Scalars['String']>;
  CustomerNumber?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  OrderStatusCode?: Maybe<Scalars['String']>;
  OrderType?: Maybe<Scalars['String']>;
  ShipmentMethodID?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
  isSelected?: Maybe<Scalars['Boolean']>;
};

export type SearchOrderLine = {
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  PartNumber?: Maybe<Scalars['String']>;
  ProductCode?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['Int']>;
};

export type SearchOrderLineDetail = {
  BinLocation?: Maybe<Scalars['String']>;
  ContainerID?: Maybe<Scalars['Int']>;
  CountryOfOrigin?: Maybe<Scalars['String']>;
  DateCode?: Maybe<Scalars['String']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineID?: Maybe<Scalars['Int']>;
  ParentITN?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
  ROHS?: Maybe<Scalars['Boolean']>;
  StatusID?: Maybe<Scalars['Int']>;
  WMSPriority?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type SearchUserEventLog = {
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  UserEventID?: Maybe<Scalars['Int']>;
  UserID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type SearchUserInfo = {
  Name?: Maybe<Scalars['String']>;
  ZoneID?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type SearchZone = {
  DistributionCenter?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['Int']>;
  _id?: Maybe<Scalars['Int']>;
};

export type TaskCounter = {
  __typename?: 'taskCounter';
  User: Scalars['String'];
  taskCounter: Array<Maybe<Scalars['Int']>>;
};

export type UpdateContainer = {
  Aisle?: Maybe<Scalars['String']>;
  Barcode?: Maybe<Scalars['String']>;
  ContainerTypeID?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  EquipmentID?: Maybe<Scalars['Int']>;
  Row?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
  Warehouse?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['String']>;
};

export type UpdateOrder = {
  BranchID?: Maybe<Scalars['String']>;
  CustomerNumber?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  OrderStatusCode?: Maybe<Scalars['String']>;
  OrderType?: Maybe<Scalars['String']>;
  ShipmentMethodID?: Maybe<Scalars['String']>;
  isSelected?: Maybe<Scalars['Boolean']>;
};

export type UpdateOrderLine = {
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  PartNumber?: Maybe<Scalars['String']>;
  ProductCode?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
};

export type UpdateOrderLineDetail = {
  BinLocation?: Maybe<Scalars['String']>;
  ContainerID?: Maybe<Scalars['Int']>;
  CountryOfOrigin?: Maybe<Scalars['String']>;
  DateCode?: Maybe<Scalars['String']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineID?: Maybe<Scalars['Int']>;
  ParentITN?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
  ROHS?: Maybe<Scalars['Boolean']>;
  StatusID?: Maybe<Scalars['Int']>;
  WMSPriority?: Maybe<Scalars['Int']>;
};

export type UpdateUserInfo = {
  Name?: Maybe<Scalars['String']>;
  ZoneID?: Maybe<Scalars['Int']>;
};

export type VerifyItNforQcQueryVariables = Types.Exact<{
  OrderLineDetail: Types.SearchOrderLineDetail;
}>;


export type VerifyItNforQcQuery = (
  { __typename?: 'Query' }
  & { findOrderLineDetail?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'OrderLineDetail' }
    & Pick<Types.OrderLineDetail, 'StatusID' | 'ParentITN' | 'Quantity' | 'ROHS' | 'DateCode' | 'CountryOfOrigin' | 'BinLocation'>
    & { OrderLine: (
      { __typename?: 'OrderLine' }
      & Pick<Types.OrderLine, 'OrderLineNumber' | 'ProductCode' | 'PartNumber'>
    ), Order: (
      { __typename?: 'Order' }
      & Pick<Types.Order, '_id' | 'DistributionCenter' | 'OrderNumber' | 'NOSINumber' | 'CustomerNumber'>
    ) }
  )>>> }
);

export type FetchProductInfoFromMerpQueryVariables = Types.Exact<{
  ProductList: Array<Types.Maybe<Types.Scalars['String']>> | Types.Maybe<Types.Scalars['String']>;
}>;


export type FetchProductInfoFromMerpQuery = (
  { __typename?: 'Query' }
  & { fetchProductInfoFromMerp?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'ProdunctInfoFromMerp' }
    & Pick<Types.ProdunctInfoFromMerp, 'HazardMaterialLevel' | 'MICPartNumber' | 'UnitOfMeasure'>
  )>>> }
);

export type QcGlobalMessageQueryVariables = Types.Exact<{
  CustomerNumber: Types.Scalars['String'];
  DistributionCenter: Types.Scalars['String'];
  OrderNumber: Types.Scalars['String'];
  OrderLineNumber: Types.Scalars['String'];
  ProductCode: Types.Scalars['String'];
  PartNumber: Types.Scalars['String'];
}>;


export type QcGlobalMessageQuery = (
  { __typename?: 'Query' }
  & { fetchOrderLineMessage?: Types.Maybe<(
    { __typename?: 'GlobalMessage' }
    & Pick<Types.GlobalMessage, 'comments'>
  )>, fetchPartMessage?: Types.Maybe<(
    { __typename?: 'GlobalMessage' }
    & Pick<Types.GlobalMessage, 'comments'>
  )> }
);

export type FetchPrinterStationQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FetchPrinterStationQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'fetchPrinterStation'>
);

export type PrintItnLabelMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  Station: Types.Scalars['String'];
}>;


export type PrintItnLabelMutation = (
  { __typename?: 'Mutation' }
  & { printITNLabel: (
    { __typename?: 'Response' }
    & Pick<Types.Response, 'success' | 'message'>
  ) }
);

export type VerifyQcRepackQueryVariables = Types.Exact<{
  Container: Types.SearchContainer;
  Order: Types.SearchOrder;
}>;


export type VerifyQcRepackQuery = (
  { __typename?: 'Query' }
  & { findContainer?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Container' }
    & Pick<Types.Container, '_id' | 'Row' | 'ContainerTypeID'>
    & { ORDERLINEDETAILs?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'OrderLineDetail' }
      & Pick<Types.OrderLineDetail, 'InternalTrackingNumber' | 'StatusID' | 'OrderID'>
    )>>> }
  )>>>, findOrder?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Order' }
    & Pick<Types.Order, '_id'>
    & { ORDERLINEDETAILs?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'OrderLineDetail' }
      & Pick<Types.OrderLineDetail, 'InternalTrackingNumber' | 'StatusID' | 'ContainerID'>
    )>>> }
  )>>> }
);

export type HoldQcOrderMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  Status: Types.Scalars['String'];
  Station: Types.Scalars['String'];
  StatusID: Types.Scalars['Int'];
  EventLog: Types.InsertEventLog;
  log: Array<Types.Maybe<Types.InsertUserEventLog>> | Types.Maybe<Types.InsertUserEventLog>;
}>;


export type HoldQcOrderMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'updateOrderLineDetail'>
  & { holdQCOrder: (
    { __typename?: 'Response' }
    & Pick<Types.Response, 'success' | 'message'>
  ), createEventLog: (
    { __typename?: 'EventLog' }
    & Pick<Types.EventLog, '_id'>
  ), insertUserEventLogs?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'UserEventLog' }
    & Pick<Types.UserEventLog, '_id'>
  )>>> }
);

export type UpdateMerpAfterQcRepackMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  DateCode: Types.Scalars['String'];
  CountryOfOrigin: Types.Scalars['String'];
  ROHS: Types.Scalars['String'];
  CountMethod: Types.Scalars['String'];
}>;


export type UpdateMerpAfterQcRepackMutation = (
  { __typename?: 'Mutation' }
  & { changeQCLineInfo: (
    { __typename?: 'Response' }
    & Pick<Types.Response, 'success' | 'message'>
  ) }
);

export type UpdateMerpForLastLineAfterQcRepackMutationVariables = Types.Exact<{
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
  Status: Types.Scalars['String'];
  UserOrStatus?: Types.Maybe<Types.Scalars['String']>;
}>;


export type UpdateMerpForLastLineAfterQcRepackMutation = (
  { __typename?: 'Mutation' }
  & { updateMerpOrderStatus: (
    { __typename?: 'Response' }
    & Pick<Types.Response, 'success' | 'message'>
  ), clearMerpTote: (
    { __typename?: 'Response' }
    & Pick<Types.Response, 'success' | 'message'>
  ) }
);

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
    mutation holdQCOrder($InternalTrackingNumber: String!, $Status: String!, $Station: String!, $StatusID: Int!, $EventLog: insertEventLog!, $log: [insertUserEventLog]!) {
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
  createEventLog(EventLog: $EventLog) {
    _id
  }
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