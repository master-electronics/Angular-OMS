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
  fetchOrderView?: Maybe<Array<Maybe<OrderView>>>;
  fetchPartMessage?: Maybe<GlobalMessage>;
  fetchPrinterStation: Scalars['String'];
  fetchProductInfoFromMerp?: Maybe<Array<Maybe<ProdunctInfoFromMerp>>>;
  findContainer?: Maybe<Array<Maybe<Container>>>;
  findContainerList?: Maybe<Array<Maybe<Container>>>;
  findEventLog?: Maybe<Array<Maybe<EventLog>>>;
  findOrder?: Maybe<Array<Maybe<Order>>>;
  findOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  findOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findUserInfo?: Maybe<Array<Maybe<UserInfo>>>;
};


export type QueryFetchOrderLineMessageArgs = {
  CustomerNumber: Scalars['String'];
  DistributionCenter: Scalars['String'];
  OrderLineNumber: Scalars['String'];
  OrderNumber: Scalars['String'];
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

export type FindContainerForSearchBarcodeQueryVariables = Types.Exact<{
  Container: Types.SearchContainer;
}>;


export type FindContainerForSearchBarcodeQuery = (
  { __typename?: 'Query' }
  & { findContainer?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Container' }
    & Pick<Types.Container, 'Barcode'>
    & { ORDERLINEDETAILs?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'OrderLineDetail' }
      & Pick<Types.OrderLineDetail, 'InternalTrackingNumber'>
      & { Status: (
        { __typename?: 'OrderStatus' }
        & Pick<Types.OrderStatus, 'Name'>
      ), OrderLine: (
        { __typename?: 'OrderLine' }
        & Pick<Types.OrderLine, 'ProductCode' | 'PartNumber' | 'OrderLineNumber'>
      ), Order: (
        { __typename?: 'Order' }
        & Pick<Types.Order, 'OrderNumber' | 'NOSINumber'>
        & { ShipmentMethod?: Types.Maybe<(
          { __typename?: 'ShipmentMethod' }
          & Pick<Types.ShipmentMethod, 'PriorityPinkPaper'>
        )> }
      ) }
    )>>> }
  )>>> }
);

export type FindItNforSearchBarcodeQueryVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
}>;


export type FindItNforSearchBarcodeQuery = (
  { __typename?: 'Query' }
  & { findOrderLineDetail?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'OrderLineDetail' }
    & Pick<Types.OrderLineDetail, 'InternalTrackingNumber'>
    & { Status: (
      { __typename?: 'OrderStatus' }
      & Pick<Types.OrderStatus, 'Name'>
    ), Container: (
      { __typename?: 'Container' }
      & Pick<Types.Container, 'Barcode' | 'Warehouse' | 'Row' | 'Aisle' | 'Section' | 'Shelf' | 'ShelfDetail'>
    ), OrderLine: (
      { __typename?: 'OrderLine' }
      & Pick<Types.OrderLine, 'ProductCode' | 'PartNumber' | 'OrderLineNumber'>
    ), Order: (
      { __typename?: 'Order' }
      & Pick<Types.Order, 'OrderNumber' | 'NOSINumber'>
      & { ShipmentMethod?: Types.Maybe<(
        { __typename?: 'ShipmentMethod' }
        & Pick<Types.ShipmentMethod, 'PriorityPinkPaper'>
      )> }
    ) }
  )>>> }
);

export type FindOrderForSearchBarcodeQueryVariables = Types.Exact<{
  DistributionCenter: Types.Scalars['String'];
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
}>;


export type FindOrderForSearchBarcodeQuery = (
  { __typename?: 'Query' }
  & { findOrder?: Types.Maybe<Array<Types.Maybe<(
    { __typename?: 'Order' }
    & Pick<Types.Order, 'OrderNumber' | 'NOSINumber'>
    & { ShipmentMethod?: Types.Maybe<(
      { __typename?: 'ShipmentMethod' }
      & Pick<Types.ShipmentMethod, 'PriorityPinkPaper'>
    )>, ORDERLINEs?: Types.Maybe<Array<Types.Maybe<(
      { __typename?: 'OrderLine' }
      & Pick<Types.OrderLine, 'ProductCode' | 'PartNumber' | 'OrderLineNumber'>
      & { ORDERLINEDETAILs?: Types.Maybe<Array<Types.Maybe<(
        { __typename?: 'OrderLineDetail' }
        & Pick<Types.OrderLineDetail, 'InternalTrackingNumber' | 'Quantity'>
        & { Status: (
          { __typename?: 'OrderStatus' }
          & Pick<Types.OrderStatus, 'Name'>
        ), Container: (
          { __typename?: 'Container' }
          & Pick<Types.Container, 'Barcode' | 'Warehouse' | 'Row' | 'Aisle' | 'Section' | 'Shelf' | 'ShelfDetail'>
        ) }
      )>>> }
    )>>> }
  )>>> }
);

export const FindContainerForSearchBarcodeDocument = gql`
    query findContainerForSearchBarcode($Container: searchContainer!) {
  findContainer(Container: $Container) {
    Barcode
    ORDERLINEDETAILs {
      InternalTrackingNumber
      Status {
        Name
      }
      OrderLine {
        ProductCode
        PartNumber
        OrderLineNumber
      }
      Order {
        OrderNumber
        NOSINumber
        ShipmentMethod {
          PriorityPinkPaper
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindContainerForSearchBarcodeGQL extends Apollo.Query<FindContainerForSearchBarcodeQuery, FindContainerForSearchBarcodeQueryVariables> {
    document = FindContainerForSearchBarcodeDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FindItNforSearchBarcodeDocument = gql`
    query findITNforSearchBarcode($InternalTrackingNumber: String!) {
  findOrderLineDetail(
    OrderLineDetail: {InternalTrackingNumber: $InternalTrackingNumber}
  ) {
    InternalTrackingNumber
    Status {
      Name
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
    OrderLine {
      ProductCode
      PartNumber
      OrderLineNumber
    }
    Order {
      OrderNumber
      NOSINumber
      ShipmentMethod {
        PriorityPinkPaper
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindItNforSearchBarcodeGQL extends Apollo.Query<FindItNforSearchBarcodeQuery, FindItNforSearchBarcodeQueryVariables> {
    document = FindItNforSearchBarcodeDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FindOrderForSearchBarcodeDocument = gql`
    query findOrderForSearchBarcode($DistributionCenter: String!, $OrderNumber: String!, $NOSINumber: String!) {
  findOrder(
    Order: {DistributionCenter: $DistributionCenter, OrderNumber: $OrderNumber, NOSINumber: $NOSINumber}
  ) {
    OrderNumber
    NOSINumber
    ShipmentMethod {
      PriorityPinkPaper
    }
    ORDERLINEs {
      ProductCode
      PartNumber
      OrderLineNumber
      ORDERLINEDETAILs {
        InternalTrackingNumber
        Status {
          Name
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
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindOrderForSearchBarcodeGQL extends Apollo.Query<FindOrderForSearchBarcodeQuery, FindOrderForSearchBarcodeQueryVariables> {
    document = FindOrderForSearchBarcodeDocument;
    client = 'wmsNodejs';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }