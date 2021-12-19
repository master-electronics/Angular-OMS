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

export type Update_OrderLineDetailMutationVariables = Types.Exact<{
  _id?: Types.Maybe<Types.Scalars['Int']>;
  InternalTrackingNumber?: Types.Maybe<Types.Scalars['String']>;
  OrderLineID?: Types.Maybe<Types.Scalars['Int']>;
  OrderID?: Types.Maybe<Types.Scalars['Int']>;
  ContainerID?: Types.Maybe<Types.Scalars['Int']>;
  OrderLineDetail: Types.UpdateOrderLineDetail;
}>;


export type Update_OrderLineDetailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'updateOrderLineDetail'>
);

export type Update_ContainerMutationVariables = Types.Exact<{
  _id?: Types.Maybe<Types.Scalars['Int']>;
  Barcode?: Types.Maybe<Types.Scalars['String']>;
  Container: Types.UpdateContainer;
}>;


export type Update_ContainerMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'updateContainer'>
);

export type Find_Or_Create_UserInfoMutationVariables = Types.Exact<{
  UserInfo: Types.InsertUserInfo;
}>;


export type Find_Or_Create_UserInfoMutation = (
  { __typename?: 'Mutation' }
  & { findOrCreateUserInfo?: Types.Maybe<(
    { __typename?: 'UserInfo' }
    & Pick<Types.UserInfo, '_id' | 'Name' | 'ZoneID'>
  )> }
);

export type Insert_UserEventLogsMutationVariables = Types.Exact<{
  log: Array<Types.Maybe<Types.InsertUserEventLog>> | Types.Maybe<Types.InsertUserEventLog>;
}>;


export type Insert_UserEventLogsMutation = (
  { __typename?: 'Mutation' }
  & { insertUserEventLogs?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'UserEventLog' }
    & Pick<Types.UserEventLog, '_id'>
  )>>> }
);

export type Find_OrderLineDetailQueryVariables = Types.Exact<{
  detail: Types.SearchOrderLineDetail;
}>;


export type Find_OrderLineDetailQuery = (
  { __typename?: 'Query' }
  & { findOrderLineDetail?: Types.Maybe<Array<Types.Maybe<(
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

export const Update_OrderLineDetailDocument = gql`
    mutation update_OrderLineDetail($_id: Int, $InternalTrackingNumber: String, $OrderLineID: Int, $OrderID: Int, $ContainerID: Int, $OrderLineDetail: updateOrderLineDetail!) {
  updateOrderLineDetail(
    _id: $_id
    InternalTrackingNumber: $InternalTrackingNumber
    OrderLineID: $OrderLineID
    OrderID: $OrderID
    ContainerID: $ContainerID
    OrderLineDetail: $OrderLineDetail
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Update_OrderLineDetailGQL extends Apollo.Mutation<Update_OrderLineDetailMutation, Update_OrderLineDetailMutationVariables> {
    document = Update_OrderLineDetailDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Update_ContainerDocument = gql`
    mutation update_Container($_id: Int, $Barcode: String, $Container: updateContainer!) {
  updateContainer(_id: $_id, Barcode: $Barcode, Container: $Container)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Update_ContainerGQL extends Apollo.Mutation<Update_ContainerMutation, Update_ContainerMutationVariables> {
    document = Update_ContainerDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Find_Or_Create_UserInfoDocument = gql`
    mutation find_or_create_userInfo($UserInfo: insertUserInfo!) {
  findOrCreateUserInfo(UserInfo: $UserInfo) {
    _id
    Name
    ZoneID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Find_Or_Create_UserInfoGQL extends Apollo.Mutation<Find_Or_Create_UserInfoMutation, Find_Or_Create_UserInfoMutationVariables> {
    document = Find_Or_Create_UserInfoDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Insert_UserEventLogsDocument = gql`
    mutation insert_UserEventLogs($log: [insertUserEventLog]!) {
  insertUserEventLogs(log: $log) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Insert_UserEventLogsGQL extends Apollo.Mutation<Insert_UserEventLogsMutation, Insert_UserEventLogsMutationVariables> {
    document = Insert_UserEventLogsDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const Find_OrderLineDetailDocument = gql`
    query find_OrderLineDetail($detail: searchOrderLineDetail!) {
  findOrderLineDetail(OrderLineDetail: $detail) {
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
  export class Find_OrderLineDetailGQL extends Apollo.Query<Find_OrderLineDetailQuery, Find_OrderLineDetailQueryVariables> {
    document = Find_OrderLineDetailDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }