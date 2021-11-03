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

export type ItnStatusView = {
  __typename?: 'ITNStatusView';
  ID?: Maybe<Scalars['Int']>;
  Number?: Maybe<Scalars['Int']>;
  Status?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeQCLineInfo: Response;
  clearMerpTote: Response;
  createEventLog: EventLog;
  deleteOrder?: Maybe<Array<Maybe<Order>>>;
  deleteOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  deleteOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  deleteOrderLineDetailByOrderNumber?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findOrCreateOrder?: Maybe<Order>;
  findOrCreateOrderLine?: Maybe<OrderLine>;
  findOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  findOrCreateUserInfo?: Maybe<UserInfo>;
  holdQCOrder: Response;
  pickOrderForAgOut?: Maybe<OrderForAgOut>;
  printITNLabel: Response;
  updateContainer?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateContainerList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateMerpOrderStatus: Response;
  updateMerpWMSLog: Response;
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
  fetchITNStatusView?: Maybe<Array<Maybe<ItnStatusView>>>;
  fetchOrderLineMessage?: Maybe<GlobalMessage>;
  fetchOrderTasktime?: Maybe<Array<Maybe<OrderTasktime>>>;
  fetchOrderView?: Maybe<Array<Maybe<OrderView>>>;
  fetchPartMessage?: Maybe<GlobalMessage>;
  fetchPrinterStation: Scalars['String'];
  fetchProductInfoFromMerp?: Maybe<Array<Maybe<ProdunctInfoFromMerp>>>;
  fetchTaskCounter?: Maybe<Array<Maybe<TaskCounter>>>;
  findContainer?: Maybe<Array<Maybe<Container>>>;
  findContainerList?: Maybe<Array<Maybe<Container>>>;
  findEventLog?: Maybe<Array<Maybe<EventLog>>>;
  findOrder?: Maybe<Array<Maybe<Order>>>;
  findOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  findOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findUserInfo?: Maybe<Array<Maybe<UserInfo>>>;
  findZone?: Maybe<Array<Maybe<Zone>>>;
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
  Module: Scalars['String'];
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

export type UserInfo = {
  __typename?: 'UserInfo';
  EVENTLOGs?: Maybe<Array<Maybe<EventLog>>>;
  Name: Scalars['String'];
  Zone?: Maybe<Zone>;
  ZoneID?: Maybe<Scalars['Int']>;
  _id: Scalars['Int'];
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
  Priority?: Maybe<Scalars['String']>;
  ShippingMethod?: Maybe<Scalars['String']>;
  Status?: Maybe<Scalars['String']>;
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
};

export type UpdateUserInfo = {
  Name?: Maybe<Scalars['String']>;
  ZoneID?: Maybe<Scalars['Int']>;
};

export type VerifyContainerForAggregationInQueryVariables = Types.Exact<{
  Container: Types.SearchContainer;
}>;


export type VerifyContainerForAggregationInQuery = (
  { __typename?: 'Query' }
  & { findContainer?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Container' }
    & Pick<Types.Container, '_id' | 'Barcode' | 'ContainerTypeID' | 'Warehouse' | 'Row' | 'Aisle' | 'Section' | 'Shelf' | 'ShelfDetail'>
    & { ContainerType: (
      { __typename?: 'ContainerType' }
      & Pick<Types.ContainerType, 'IsMobile'>
    ), ORDERLINEDETAILs?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'OrderLineDetail' }
      & Pick<Types.OrderLineDetail, '_id' | 'InternalTrackingNumber' | 'StatusID' | 'OrderID'>
      & { Order: (
        { __typename?: 'Order' }
        & Pick<Types.Order, 'OrderNumber' | 'NOSINumber'>
      ) }
    )>>> }
  )>>> }
);

export type FetchLocationAndOrderDetailForAgInQueryVariables = Types.Exact<{
  OrderLineDetail: Types.SearchOrderLineDetail;
}>;


export type FetchLocationAndOrderDetailForAgInQuery = (
  { __typename?: 'Query' }
  & { findOrderLineDetail?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'OrderLineDetail' }
    & Pick<Types.OrderLineDetail, '_id' | 'Quantity' | 'StatusID' | 'InternalTrackingNumber'>
    & { OrderLine: (
      { __typename?: 'OrderLine' }
      & Pick<Types.OrderLine, 'OrderLineNumber' | 'ProductCode' | 'PartNumber'>
    ), Order: (
      { __typename?: 'Order' }
      & Pick<Types.Order, 'OrderNumber' | 'NOSINumber' | 'CustomerNumber'>
      & { ShipmentMethod?: Types.Maybe<(
        { __typename?: 'ShipmentMethod' }
        & Pick<Types.ShipmentMethod, 'PriorityPinkPaper' | 'ShippingMethod'>
      )> }
    ), Container: (
      { __typename?: 'Container' }
      & Pick<Types.Container, 'Barcode' | 'Warehouse' | 'Row' | 'Aisle' | 'Section' | 'Shelf' | 'ShelfDetail'>
    ) }
  )>>> }
);

export type UpdateAfterAgOutMutationVariables = Types.Exact<{
  OrderID: Types.Scalars['Int'];
  OrderLineDetail: Types.UpdateOrderLineDetail;
  DistributionCenter: Types.Scalars['String'];
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
  EventLog: Types.InsertEventLog;
  MerpStatus: Types.Scalars['String'];
  UserOrStatus: Types.Scalars['String'];
  FileKeyList: Array<Types.Scalars['String']> | Types.Scalars['String'];
  ActionType: Types.Scalars['String'];
  Action: Types.Scalars['String'];
}>;


export type UpdateAfterAgOutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'updateOrderLineDetail' | 'updateOrder'>
  & { createEventLog: (
    { __typename?: 'EventLog' }
    & Pick<Types.EventLog, '_id'>
  ), updateMerpOrderStatus: (
    { __typename?: 'Response' }
    & Pick<Types.Response, 'success' | 'message'>
  ), updateMerpWMSLog: (
    { __typename?: 'Response' }
    & Pick<Types.Response, 'success' | 'message'>
  ) }
);

export type FetchHazardMaterialLevelQueryVariables = Types.Exact<{
  ProductList: Array<Types.Maybe<Types.Scalars['String']>> | Types.Maybe<Types.Scalars['String']>;
}>;


export type FetchHazardMaterialLevelQuery = (
  { __typename?: 'Query' }
  & { fetchProductInfoFromMerp?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'ProdunctInfoFromMerp' }
    & Pick<Types.ProdunctInfoFromMerp, 'HazardMaterialLevel'>
  )>>> }
);

export type UpdateSqlAfterAgInMutationVariables = Types.Exact<{
  ContainerID: Types.Scalars['Int'];
  Container: Types.UpdateContainer;
  OrderLineDetail: Types.UpdateOrderLineDetail;
  EventLog: Types.InsertEventLog;
}>;


export type UpdateSqlAfterAgInMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'updateOrderLineDetail' | 'updateContainer'>
  & { createEventLog: (
    { __typename?: 'EventLog' }
    & Pick<Types.EventLog, '_id'>
  ) }
);

export type UpdateMerpWmsLogMutationVariables = Types.Exact<{
  DistributionCenter: Types.Scalars['String'];
  FileKeyList: Array<Types.Scalars['String']> | Types.Scalars['String'];
  ActionType: Types.Scalars['String'];
  Action: Types.Scalars['String'];
}>;


export type UpdateMerpWmsLogMutation = (
  { __typename?: 'Mutation' }
  & { updateMerpWMSLog: (
    { __typename?: 'Response' }
    & Pick<Types.Response, 'success' | 'message'>
  ) }
);

export type UpdateMerpOrderStatusMutationVariables = Types.Exact<{
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
  Status: Types.Scalars['String'];
  UserOrStatus: Types.Scalars['String'];
}>;


export type UpdateMerpOrderStatusMutation = (
  { __typename?: 'Mutation' }
  & { updateMerpOrderStatus: (
    { __typename?: 'Response' }
    & Pick<Types.Response, 'success' | 'message'>
  ) }
);

export type PickOrderForAgOutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type PickOrderForAgOutMutation = (
  { __typename?: 'Mutation' }
  & { pickOrderForAgOut?: Types.Maybe<(
    { __typename?: 'OrderForAgOut' }
    & Pick<Types.OrderForAgOut, 'OrderID' | 'OrderNumber' | 'NOSINumber'>
  )> }
);

export type VerifyOrderForAgOutQueryVariables = Types.Exact<{
  DistributionCenter: Types.Scalars['String'];
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
}>;


export type VerifyOrderForAgOutQuery = (
  { __typename?: 'Query' }
  & { fetchOrderView?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'orderView' }
    & Pick<Types.OrderView, 'OrderID' | 'StatusID'>
  )>>> }
);

export type FetchContainerForAgoutPickQueryVariables = Types.Exact<{
  OrderID?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type FetchContainerForAgoutPickQuery = (
  { __typename?: 'Query' }
  & { findOrderLineDetail?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'OrderLineDetail' }
    & Pick<Types.OrderLineDetail, 'InternalTrackingNumber'>
    & { OrderLine: (
      { __typename?: 'OrderLine' }
      & Pick<Types.OrderLine, 'OrderLineNumber' | 'ProductCode' | 'PartNumber'>
    ), Order: (
      { __typename?: 'Order' }
      & Pick<Types.Order, 'OrderNumber' | 'NOSINumber'>
    ), Container: (
      { __typename?: 'Container' }
      & Pick<Types.Container, 'Barcode' | 'Warehouse' | 'Row' | 'Aisle' | 'Section' | 'Shelf' | 'ShelfDetail'>
    ) }
  )>>> }
);

export const VerifyContainerForAggregationInDocument = gql`
    query verifyContainerForAggregationIn($Container: searchContainer!) {
  findContainer(Container: $Container) {
    _id
    Barcode
    ContainerTypeID
    Warehouse
    Row
    Aisle
    Section
    Shelf
    ShelfDetail
    ContainerType {
      IsMobile
    }
    ORDERLINEDETAILs {
      _id
      InternalTrackingNumber
      StatusID
      OrderID
      Order {
        OrderNumber
        NOSINumber
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class VerifyContainerForAggregationInGQL extends Apollo.Query<VerifyContainerForAggregationInQuery, VerifyContainerForAggregationInQueryVariables> {
    document = VerifyContainerForAggregationInDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchLocationAndOrderDetailForAgInDocument = gql`
    query fetchLocationAndOrderDetailForAgIn($OrderLineDetail: searchOrderLineDetail!) {
  findOrderLineDetail(OrderLineDetail: $OrderLineDetail) {
    _id
    Quantity
    StatusID
    InternalTrackingNumber
    OrderLine {
      OrderLineNumber
      ProductCode
      PartNumber
    }
    Order {
      OrderNumber
      NOSINumber
      CustomerNumber
      ShipmentMethod {
        PriorityPinkPaper
        ShippingMethod
      }
    }
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
  export class FetchLocationAndOrderDetailForAgInGQL extends Apollo.Query<FetchLocationAndOrderDetailForAgInQuery, FetchLocationAndOrderDetailForAgInQueryVariables> {
    document = FetchLocationAndOrderDetailForAgInDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateAfterAgOutDocument = gql`
    mutation updateAfterAgOut($OrderID: Int!, $OrderLineDetail: updateOrderLineDetail!, $DistributionCenter: String!, $OrderNumber: String!, $NOSINumber: String!, $EventLog: insertEventLog!, $MerpStatus: String!, $UserOrStatus: String!, $FileKeyList: [String!]!, $ActionType: String!, $Action: String!) {
  updateOrderLineDetail(OrderID: $OrderID, OrderLineDetail: $OrderLineDetail)
  updateOrder(_id: $OrderID, Order: {isSelected: false})
  createEventLog(EventLog: $EventLog) {
    _id
  }
  updateMerpOrderStatus(
    OrderNumber: $OrderNumber
    NOSINumber: $NOSINumber
    Status: $MerpStatus
    UserOrStatus: $UserOrStatus
  ) {
    success
    message
  }
  updateMerpWMSLog(
    FileKeyList: $FileKeyList
    LocationCode: $DistributionCenter
    ActionType: $ActionType
    Action: $Action
  ) {
    success
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateAfterAgOutGQL extends Apollo.Mutation<UpdateAfterAgOutMutation, UpdateAfterAgOutMutationVariables> {
    document = UpdateAfterAgOutDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchHazardMaterialLevelDocument = gql`
    query fetchHazardMaterialLevel($ProductList: [String]!) {
  fetchProductInfoFromMerp(ProductList: $ProductList) {
    HazardMaterialLevel
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchHazardMaterialLevelGQL extends Apollo.Query<FetchHazardMaterialLevelQuery, FetchHazardMaterialLevelQueryVariables> {
    document = FetchHazardMaterialLevelDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateSqlAfterAgInDocument = gql`
    mutation updateSQLAfterAgIn($ContainerID: Int!, $Container: updateContainer!, $OrderLineDetail: updateOrderLineDetail!, $EventLog: insertEventLog!) {
  updateOrderLineDetail(
    ContainerID: $ContainerID
    OrderLineDetail: $OrderLineDetail
  )
  updateContainer(_id: $ContainerID, Container: $Container)
  createEventLog(EventLog: $EventLog) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateSqlAfterAgInGQL extends Apollo.Mutation<UpdateSqlAfterAgInMutation, UpdateSqlAfterAgInMutationVariables> {
    document = UpdateSqlAfterAgInDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateMerpWmsLogDocument = gql`
    mutation updateMerpWMSLog($DistributionCenter: String!, $FileKeyList: [String!]!, $ActionType: String!, $Action: String!) {
  updateMerpWMSLog(
    FileKeyList: $FileKeyList
    LocationCode: $DistributionCenter
    ActionType: $ActionType
    Action: $Action
  ) {
    success
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateMerpWmsLogGQL extends Apollo.Mutation<UpdateMerpWmsLogMutation, UpdateMerpWmsLogMutationVariables> {
    document = UpdateMerpWmsLogDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateMerpOrderStatusDocument = gql`
    mutation updateMerpOrderStatus($OrderNumber: String!, $NOSINumber: String!, $Status: String!, $UserOrStatus: String!) {
  updateMerpOrderStatus(
    OrderNumber: $OrderNumber
    NOSINumber: $NOSINumber
    Status: $Status
    UserOrStatus: $UserOrStatus
  ) {
    success
    message
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateMerpOrderStatusGQL extends Apollo.Mutation<UpdateMerpOrderStatusMutation, UpdateMerpOrderStatusMutationVariables> {
    document = UpdateMerpOrderStatusDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PickOrderForAgOutDocument = gql`
    mutation pickOrderForAgOut {
  pickOrderForAgOut {
    OrderID
    OrderNumber
    NOSINumber
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PickOrderForAgOutGQL extends Apollo.Mutation<PickOrderForAgOutMutation, PickOrderForAgOutMutationVariables> {
    document = PickOrderForAgOutDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const VerifyOrderForAgOutDocument = gql`
    query verifyOrderForAgOut($DistributionCenter: String!, $OrderNumber: String!, $NOSINumber: String!) {
  fetchOrderView(
    filter: {DistributionCenter: $DistributionCenter, OrderNumber: $OrderNumber, NOSINumber: $NOSINumber}
  ) {
    OrderID
    StatusID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class VerifyOrderForAgOutGQL extends Apollo.Query<VerifyOrderForAgOutQuery, VerifyOrderForAgOutQueryVariables> {
    document = VerifyOrderForAgOutDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchContainerForAgoutPickDocument = gql`
    query fetchContainerForAgoutPick($OrderID: Int) {
  findOrderLineDetail(OrderLineDetail: {OrderID: $OrderID}) {
    InternalTrackingNumber
    OrderLine {
      OrderLineNumber
      ProductCode
      PartNumber
    }
    Order {
      OrderNumber
      NOSINumber
    }
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
  export class FetchContainerForAgoutPickGQL extends Apollo.Query<FetchContainerForAgoutPickQuery, FetchContainerForAgoutPickQueryVariables> {
    document = FetchContainerForAgoutPickDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }