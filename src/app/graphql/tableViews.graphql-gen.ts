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
  countOrderItns: Scalars['Int'];
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


export type QueryFindOrderByStatusArgs = {
  PriorityPinkPaper?: Maybe<Scalars['Boolean']>;
  StatusID: Scalars['Int'];
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
  ContainerID?: Maybe<Scalars['Int']>;
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

export type FetchOrderViewQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.OrderViewFilter>;
}>;


export type FetchOrderViewQuery = (
  { __typename?: 'Query' }
  & { fetchOrderView?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'orderView' }
    & Pick<Types.OrderView, 'OrderNumber' | 'NOSINumber' | 'Status' | 'Priority' | 'ShippingMethod' | 'Unpicked' | 'Aggregated' | 'InProcess'>
  )>>> }
);

export type FetchOrderLineDetailforWmsCountQueryVariables = Types.Exact<{
  filter?: Types.Maybe<Types.SearchIntForWmsCount>;
}>;


export type FetchOrderLineDetailforWmsCountQuery = (
  { __typename?: 'Query' }
  & { fetchOrderLineDetailforWMSCount?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'OrderLineDetail' }
    & Pick<Types.OrderLineDetail, 'InternalTrackingNumber' | 'Quantity'>
    & { Status: (
      { __typename?: 'OrderStatus' }
      & Pick<Types.OrderStatus, 'Name'>
    ), Order: (
      { __typename?: 'Order' }
      & Pick<Types.Order, 'OrderNumber' | 'NOSINumber'>
    ), OrderLine: (
      { __typename?: 'OrderLine' }
      & Pick<Types.OrderLine, 'ProductCode' | 'PartNumber'>
    ), Container: (
      { __typename?: 'Container' }
      & Pick<Types.Container, 'Barcode' | 'Warehouse' | 'Row' | 'Aisle' | 'Section' | 'Shelf' | 'ShelfDetail'>
    ) }
  )>>> }
);

export type FetchOrderDetailforitnViewQueryVariables = Types.Exact<{
  Order: Types.SearchOrder;
}>;


export type FetchOrderDetailforitnViewQuery = (
  { __typename?: 'Query' }
  & { findOrder?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Order' }
    & Pick<Types.Order, 'OrderNumber' | 'NOSINumber'>
    & { ORDERLINEDETAILs?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'OrderLineDetail' }
      & Pick<Types.OrderLineDetail, 'InternalTrackingNumber' | 'Quantity'>
      & { Status: (
        { __typename?: 'OrderStatus' }
        & Pick<Types.OrderStatus, 'Name'>
      ), OrderLine: (
        { __typename?: 'OrderLine' }
        & Pick<Types.OrderLine, 'ProductCode' | 'PartNumber'>
      ), Container: (
        { __typename?: 'Container' }
        & Pick<Types.Container, 'Barcode' | 'Warehouse' | 'Row' | 'Aisle' | 'Section' | 'Shelf' | 'ShelfDetail'>
      ) }
    )>>> }
  )>>> }
);

export type FetchWmsStatusViewQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FetchWmsStatusViewQuery = (
  { __typename?: 'Query' }
  & { fetchWMSStatusView?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'WMSStatusView' }
    & Pick<Types.WmsStatusView, 'StatusID' | 'Status' | 'ITN_Priority' | 'ITN_Total' | 'Line_Priority' | 'Line_Total' | 'Head_Priority' | 'Head_Total'>
  )>>> }
);

export type FetchUserInfoQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FetchUserInfoQuery = (
  { __typename?: 'Query' }
  & { findUserInfo?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'UserInfo' }
    & Pick<Types.UserInfo, '_id' | 'Name'>
  )>>> }
);

export type FetchEventLogQueryVariables = Types.Exact<{
  EventLog: Types.SearchEventLog;
  startDate?: Types.Maybe<Types.Scalars['String']>;
  endDate?: Types.Maybe<Types.Scalars['String']>;
  limit?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type FetchEventLogQuery = (
  { __typename?: 'Query' }
  & { findEventLog?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'EventLog' }
    & Pick<Types.EventLog, '_id' | 'Event' | 'DateTime' | 'Module' | 'Target' | 'SubTarget'>
    & { User: (
      { __typename?: 'UserInfo' }
      & Pick<Types.UserInfo, 'Name'>
    ) }
  )>>> }
);

export type FetchUserEventLogQueryVariables = Types.Exact<{
  UserEventLog: Types.SearchUserEventLog;
  Module?: Types.Maybe<Types.Scalars['Int']>;
  startDate?: Types.Maybe<Types.Scalars['String']>;
  endDate?: Types.Maybe<Types.Scalars['String']>;
  limit?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type FetchUserEventLogQuery = (
  { __typename?: 'Query' }
  & { findUserEventLog?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'UserEventLog' }
    & Pick<Types.UserEventLog, '_id' | 'OrderNumber' | 'NOSINumber' | 'Message' | 'InternalTrackingNumber' | 'DateTime'>
    & { User: (
      { __typename?: 'UserInfo' }
      & Pick<Types.UserInfo, 'Name'>
    ), UserEvent: (
      { __typename?: 'UserEvent' }
      & Pick<Types.UserEvent, 'Event' | 'Module'>
    ) }
  )>>> }
);

export type FetchTaskCounterQueryVariables = Types.Exact<{
  Module: Types.Scalars['Int'];
  startDate: Types.Scalars['String'];
  endDate: Types.Scalars['String'];
}>;


export type FetchTaskCounterQuery = (
  { __typename?: 'Query' }
  & { fetchTaskCounter?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'taskCounter' }
    & Pick<Types.TaskCounter, 'User' | 'taskCounter'>
  )>>> }
);

export type FetchOrderTasktimeQueryVariables = Types.Exact<{
  target?: Types.Maybe<Types.Scalars['String']>;
  limit: Types.Scalars['Int'];
}>;


export type FetchOrderTasktimeQuery = (
  { __typename?: 'Query' }
  & { fetchOrderTasktime?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'orderTasktime' }
    & Pick<Types.OrderTasktime, 'Order' | 'qcFirst' | 'qcLast' | 'agIn' | 'agOut'>
  )>>> }
);

export type FindOrderByStatusQueryVariables = Types.Exact<{
  PriorityPinkPaper?: Types.Maybe<Types.Scalars['Boolean']>;
  StatusID: Types.Scalars['Int'];
}>;


export type FindOrderByStatusQuery = (
  { __typename?: 'Query' }
  & { findOrderByStatus?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Order' }
    & Pick<Types.Order, 'OrderNumber' | 'NOSINumber' | 'CustomerNumber'>
    & { ShipmentMethod?: Types.Maybe<(
      { __typename?: 'ShipmentMethod' }
      & Pick<Types.ShipmentMethod, 'PriorityPinkPaper' | 'ShippingMethod'>
    )> }
  )>>> }
);

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
    InternalTrackingNumber
    Status {
      Name
    }
    Order {
      OrderNumber
      NOSINumber
    }
    OrderLine {
      ProductCode
      PartNumber
    }
    Quantity
    Container {
      Barcode
      Warehouse
      Row
      Aisle
      Section
      Shelf
      ShelfDetail
    }
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
      InternalTrackingNumber
      Status {
        Name
      }
      OrderLine {
        ProductCode
        PartNumber
      }
      Quantity
      Container {
        Barcode
        Warehouse
        Row
        Aisle
        Section
        Shelf
        ShelfDetail
      }
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
  findUserInfo {
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
export const FetchEventLogDocument = gql`
    query fetchEventLog($EventLog: searchEventLog!, $startDate: String, $endDate: String, $limit: Int) {
  findEventLog(
    EventLog: $EventLog
    startDate: $startDate
    endDate: $endDate
    limit: $limit
  ) {
    _id
    Event
    DateTime
    User {
      Name
    }
    Module
    Target
    SubTarget
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchEventLogGQL extends Apollo.Query<FetchEventLogQuery, FetchEventLogQueryVariables> {
    document = FetchEventLogDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchUserEventLogDocument = gql`
    query fetchUserEventLog($UserEventLog: searchUserEventLog!, $Module: Int, $startDate: String, $endDate: String, $limit: Int) {
  findUserEventLog(
    UserEventLog: $UserEventLog
    Module: $Module
    startDate: $startDate
    endDate: $endDate
    limit: $limit
  ) {
    _id
    User {
      Name
    }
    UserEvent {
      Event
      Module
    }
    OrderNumber
    NOSINumber
    Message
    InternalTrackingNumber
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
export const FetchTaskCounterDocument = gql`
    query fetchTaskCounter($Module: Int!, $startDate: String!, $endDate: String!) {
  fetchTaskCounter(Module: $Module, startDate: $startDate, endDate: $endDate) {
    User
    taskCounter
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchTaskCounterGQL extends Apollo.Query<FetchTaskCounterQuery, FetchTaskCounterQueryVariables> {
    document = FetchTaskCounterDocument;
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
    CustomerNumber
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