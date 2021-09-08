import * as Types from './generated/types.graphql-gen';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
  /**
   * Related tables:
   * one to many ORDERLINEDETAILs
   */
  _id: Scalars['Int'];
  ContainerTypeID: Scalars['Int'];
  Barcode: Scalars['String'];
  Zone?: Maybe<Scalars['String']>;
  EquipmentID?: Maybe<Scalars['Int']>;
  DistributionCenter: Scalars['String'];
  Warehouse?: Maybe<Scalars['String']>;
  Row?: Maybe<Scalars['String']>;
  Aisle?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
  ContainerType: ContainerType;
  Equipment?: Maybe<Equipment>;
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
};

export type ContainerType = {
  __typename?: 'ContainerType';
  _id: Scalars['Int'];
  Name: Scalars['String'];
  IsMobile: Scalars['Boolean'];
};

export type Equipment = {
  __typename?: 'Equipment';
  _id: Scalars['Int'];
  Name: Scalars['String'];
};

export type GlobalMessage = {
  __typename?: 'GlobalMessage';
  comments?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  pickOrderForAgOut?: Maybe<OrderForAgOut>;
  deleteOrderLineDetailByOrderNumber?: Maybe<Array<Maybe<OrderLineDetail>>>;
  holdQCOrder: Response;
  printITNLabel: Response;
  changeQCLineInfo: Response;
  updateMerpOrderStatus: Response;
  updateMerpWMSLog: Response;
  clearMerpTote: Response;
  findOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  findOrCreateOrderLine?: Maybe<OrderLine>;
  findOrCreateOrder?: Maybe<Order>;
  deleteOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  deleteOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  deleteOrder?: Maybe<Array<Maybe<Order>>>;
  updateContainer?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateContainerList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLineDetail?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLine?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrder?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type MutationDeleteOrderLineDetailByOrderNumberArgs = {
  DistributionCenter: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
  OrderLineNumber: Scalars['Int'];
  InternalTrackingNumber: Scalars['String'];
};

export type MutationHoldQcOrderArgs = {
  InternalTrackingNumber: Scalars['String'];
  Status: Scalars['String'];
  Station: Scalars['String'];
};

export type MutationPrintItnLabelArgs = {
  InternalTrackingNumber: Scalars['String'];
  Station: Scalars['String'];
};

export type MutationChangeQcLineInfoArgs = {
  InternalTrackingNumber: Scalars['String'];
  DateCode: Scalars['String'];
  CountryOfOrigin: Scalars['String'];
  ROHS: Scalars['String'];
  CountMethod: Scalars['String'];
};

export type MutationUpdateMerpOrderStatusArgs = {
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  Status: Scalars['String'];
  UserOrStatus?: Maybe<Scalars['String']>;
};

export type MutationUpdateMerpWmsLogArgs = {
  FileKeyList: Array<Scalars['String']>;
  LocationCode: Scalars['String'];
  ActionType: Scalars['String'];
  Action: Scalars['String'];
};

export type MutationClearMerpToteArgs = {
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
};

export type MutationFindOrCreateOrderLineDetailArgs = {
  OrderLineDetail: InsertOrderLineDetail;
};

export type MutationFindOrCreateOrderLineArgs = {
  OrderLine: InsertOrderLine;
};

export type MutationFindOrCreateOrderArgs = {
  Order: InsertOrder;
};

export type MutationDeleteOrderLineDetailArgs = {
  _id?: Maybe<Scalars['Int']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  OrderLineID?: Maybe<Scalars['Int']>;
};

export type MutationDeleteOrderLineArgs = {
  _id?: Maybe<Scalars['Int']>;
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
};

export type MutationDeleteOrderArgs = {
  _id?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
};

export type MutationUpdateContainerArgs = {
  Container: UpdateContainer;
  _id?: Maybe<Scalars['Int']>;
  Barcode?: Maybe<Scalars['String']>;
};

export type MutationUpdateContainerListArgs = {
  Container: UpdateContainer;
  idList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  DistributionCenter?: Maybe<Scalars['String']>;
  BarcodeList?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type MutationUpdateOrderLineDetailArgs = {
  OrderLineDetail: UpdateOrderLineDetail;
  _id?: Maybe<Scalars['Int']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  OrderLineID?: Maybe<Scalars['Int']>;
  OrderID?: Maybe<Scalars['Int']>;
  ContainerID?: Maybe<Scalars['Int']>;
};

export type MutationUpdateOrderLineArgs = {
  OrderLine: UpdateOrderLine;
};

export type MutationUpdateOrderArgs = {
  Order: UpdateOrder;
  _id?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
};

export type Order = {
  __typename?: 'Order';
  _id: Scalars['Int'];
  DistributionCenter: Scalars['String'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  LastUpdated?: Maybe<Scalars['String']>;
  CustomerNumber?: Maybe<Scalars['String']>;
  BranchID?: Maybe<Scalars['String']>;
  OrderStatusCode?: Maybe<Scalars['String']>;
  ShipmentMethodID?: Maybe<Scalars['String']>;
  OrderType?: Maybe<Scalars['String']>;
  isSelected: Scalars['Boolean'];
  ShipmentMethod?: Maybe<ShipmentMethod>;
  ORDERLINEs?: Maybe<Array<Maybe<OrderLine>>>;
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
};

export type OrderForAgOut = {
  __typename?: 'OrderForAgOut';
  OrderID: Scalars['Int'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
};

export type OrderLine = {
  __typename?: 'OrderLine';
  _id: Scalars['Int'];
  OrderID: Scalars['Int'];
  OrderLineNumber: Scalars['Int'];
  ProductCode: Scalars['String'];
  PartNumber: Scalars['String'];
  Quantity?: Maybe<Scalars['Float']>;
  LastUpdated?: Maybe<Scalars['String']>;
  Order: Order;
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
};

export type OrderLineDetail = {
  __typename?: 'OrderLineDetail';
  _id: Scalars['Int'];
  OrderLineID: Scalars['Int'];
  StatusID: Scalars['Int'];
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  ContainerID: Scalars['Int'];
  Quantity: Scalars['Float'];
  DateCode?: Maybe<Scalars['String']>;
  CountryOfOrigin?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  ROHS: Scalars['Boolean'];
  LastUpdated?: Maybe<Scalars['String']>;
  OrderID: Scalars['Int'];
  OrderLine: OrderLine;
  Status: OrderStatus;
  Container: Container;
  Order: Order;
};

export type OrderStatus = {
  __typename?: 'OrderStatus';
  _id: Scalars['Int'];
  Name: Scalars['String'];
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
  fetchProductInfoFromMerp?: Maybe<Array<Maybe<ProdunctInfoFromMerp>>>;
  fetchOrderLineMessage?: Maybe<GlobalMessage>;
  fetchPartMessage?: Maybe<GlobalMessage>;
  fetchPrinterStation: Scalars['String'];
  fetchOrderView?: Maybe<Array<Maybe<OrderView>>>;
  findContainer?: Maybe<Array<Maybe<Container>>>;
  findContainerList?: Maybe<Array<Maybe<Container>>>;
  findOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  findOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  findOrder?: Maybe<Array<Maybe<Order>>>;
};

export type QueryFetchProductInfoFromMerpArgs = {
  ProductList: Array<Maybe<Scalars['String']>>;
};

export type QueryFetchOrderLineMessageArgs = {
  CustomerNumber: Scalars['String'];
  DistributionCenter: Scalars['String'];
  OrderNumber: Scalars['String'];
  OrderLineNumber: Scalars['String'];
};

export type QueryFetchPartMessageArgs = {
  ProductCode: Scalars['String'];
  PartNumber: Scalars['String'];
};

export type QueryFetchOrderViewArgs = {
  filter?: Maybe<OrderViewFilter>;
};

export type QueryFindContainerArgs = {
  Container: SearchContainer;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type QueryFindContainerListArgs = {
  idList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  BarcodeList?: Maybe<Array<Maybe<Scalars['String']>>>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type QueryFindOrderLineDetailArgs = {
  OrderLineDetail: SearchOrderLineDetail;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type QueryFindOrderLineArgs = {
  OrderLine: SearchOrderLine;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type QueryFindOrderArgs = {
  Order: SearchOrder;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type Response = {
  __typename?: 'Response';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type ShipmentMethod = {
  __typename?: 'ShipmentMethod';
  _id: Scalars['String'];
  ShippingMethod: Scalars['String'];
  PriorityPinkPaper: Scalars['Boolean'];
};

export type InsertOrder = {
  DistributionCenter: Scalars['String'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  LastUpdated?: Maybe<Scalars['String']>;
  CustomerNumber?: Maybe<Scalars['String']>;
  BranchID?: Maybe<Scalars['String']>;
  OrderStatusCode?: Maybe<Scalars['String']>;
  ShipmentMethodID?: Maybe<Scalars['String']>;
  OrderType?: Maybe<Scalars['String']>;
};

export type InsertOrderLine = {
  OrderID: Scalars['Int'];
  OrderLineNumber: Scalars['Int'];
  ProductCode: Scalars['String'];
  PartNumber: Scalars['String'];
  Quantity?: Maybe<Scalars['Float']>;
};

export type InsertOrderLineDetail = {
  OrderLineID: Scalars['Int'];
  StatusID: Scalars['Int'];
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  ContainerID: Scalars['Int'];
  Quantity: Scalars['Float'];
  DateCode?: Maybe<Scalars['String']>;
  CountryOfOrigin?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  ROHS?: Maybe<Scalars['Boolean']>;
  OrderID: Scalars['Int'];
};

export type OrderView = {
  __typename?: 'orderView';
  OrderID?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  StatusID?: Maybe<Scalars['Int']>;
  Status?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['Boolean']>;
  ShippingMethod?: Maybe<Scalars['String']>;
  Unpicked?: Maybe<Scalars['Int']>;
  Aggregated?: Maybe<Scalars['Int']>;
  InProcess?: Maybe<Scalars['Int']>;
};

export type OrderViewFilter = {
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  Priority?: Maybe<Scalars['String']>;
  ShippingMethod?: Maybe<Scalars['String']>;
  Status?: Maybe<Scalars['String']>;
};

export type SearchContainer = {
  _id?: Maybe<Scalars['Int']>;
  ContainerTypeID?: Maybe<Scalars['Int']>;
  Barcode?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['String']>;
  EquipmentID?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Warehouse?: Maybe<Scalars['String']>;
  Row?: Maybe<Scalars['String']>;
  Aisle?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
};

export type SearchOrder = {
  _id?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  CustomerNumber?: Maybe<Scalars['String']>;
  BranchID?: Maybe<Scalars['String']>;
  OrderStatusCode?: Maybe<Scalars['String']>;
  ShipmentMethodID?: Maybe<Scalars['String']>;
  OrderType?: Maybe<Scalars['String']>;
  isSelected?: Maybe<Scalars['Boolean']>;
};

export type SearchOrderLine = {
  _id?: Maybe<Scalars['Int']>;
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  ProductCode?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
};

export type SearchOrderLineDetail = {
  _id?: Maybe<Scalars['Int']>;
  OrderLineID?: Maybe<Scalars['Int']>;
  StatusID?: Maybe<Scalars['Int']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  ContainerID?: Maybe<Scalars['Int']>;
  Quantity?: Maybe<Scalars['Float']>;
  DateCode?: Maybe<Scalars['String']>;
  CountryOfOrigin?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  ROHS?: Maybe<Scalars['Boolean']>;
  OrderID?: Maybe<Scalars['Int']>;
};

export type UpdateContainer = {
  ContainerTypeID?: Maybe<Scalars['Int']>;
  Barcode?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['String']>;
  EquipmentID?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Warehouse?: Maybe<Scalars['String']>;
  Row?: Maybe<Scalars['String']>;
  Aisle?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
};

export type UpdateOrder = {
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  CustomerNumber?: Maybe<Scalars['String']>;
  BranchID?: Maybe<Scalars['String']>;
  OrderStatusCode?: Maybe<Scalars['String']>;
  ShipmentMethodID?: Maybe<Scalars['String']>;
  OrderType?: Maybe<Scalars['String']>;
  isSelected?: Maybe<Scalars['Boolean']>;
};

export type UpdateOrderLine = {
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  ProductCode?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
};

export type UpdateOrderLineDetail = {
  OrderLineID?: Maybe<Scalars['Int']>;
  StatusID?: Maybe<Scalars['Int']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  ContainerID?: Maybe<Scalars['Int']>;
  Quantity?: Maybe<Scalars['Float']>;
  DateCode?: Maybe<Scalars['String']>;
  CountryOfOrigin?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  ROHS?: Maybe<Scalars['Boolean']>;
  OrderID?: Maybe<Scalars['Int']>;
};

export type VerifyItNforQcQueryVariables = Types.Exact<{
  OrderLineDetail: Types.SearchOrderLineDetail;
}>;

export type VerifyItNforQcQuery = { __typename?: 'Query' } & {
  findOrderLineDetail?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'OrderLineDetail' } & Pick<
          Types.OrderLineDetail,
          | 'StatusID'
          | 'ParentITN'
          | 'Quantity'
          | 'ROHS'
          | 'DateCode'
          | 'CountryOfOrigin'
        > & {
            OrderLine: { __typename?: 'OrderLine' } & Pick<
              Types.OrderLine,
              'OrderLineNumber' | 'ProductCode' | 'PartNumber'
            >;
            Order: { __typename?: 'Order' } & Pick<
              Types.Order,
              | 'DistributionCenter'
              | 'OrderNumber'
              | 'NOSINumber'
              | 'CustomerNumber'
            >;
          }
      >
    >
  >;
};

export type FetchProductInfoFromMerpQueryVariables = Types.Exact<{
  ProductList:
    | Array<Types.Maybe<Types.Scalars['String']>>
    | Types.Maybe<Types.Scalars['String']>;
}>;

export type FetchProductInfoFromMerpQuery = { __typename?: 'Query' } & {
  fetchProductInfoFromMerp?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'ProdunctInfoFromMerp' } & Pick<
          Types.ProdunctInfoFromMerp,
          'HazardMaterialLevel' | 'MICPartNumber' | 'UnitOfMeasure'
        >
      >
    >
  >;
};

export type QcGlobalMessageQueryVariables = Types.Exact<{
  CustomerNumber: Types.Scalars['String'];
  DistributionCenter: Types.Scalars['String'];
  OrderNumber: Types.Scalars['String'];
  OrderLineNumber: Types.Scalars['String'];
  ProductCode: Types.Scalars['String'];
  PartNumber: Types.Scalars['String'];
}>;

export type QcGlobalMessageQuery = { __typename?: 'Query' } & {
  fetchOrderLineMessage?: Types.Maybe<
    { __typename?: 'GlobalMessage' } & Pick<Types.GlobalMessage, 'comments'>
  >;
  fetchPartMessage?: Types.Maybe<
    { __typename?: 'GlobalMessage' } & Pick<Types.GlobalMessage, 'comments'>
  >;
};

export type FetchPrinterStationQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type FetchPrinterStationQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'fetchPrinterStation'
>;

export type PrintItnLabelMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  Station: Types.Scalars['String'];
}>;

export type PrintItnLabelMutation = { __typename?: 'Mutation' } & {
  printITNLabel: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
};

export type VerifyQcRepackQueryVariables = Types.Exact<{
  Container: Types.SearchContainer;
  Order: Types.SearchOrder;
}>;

export type VerifyQcRepackQuery = { __typename?: 'Query' } & {
  findContainer?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Container' } & Pick<
          Types.Container,
          '_id' | 'Row' | 'ContainerTypeID'
        > & {
            ORDERLINEDETAILs?: Types.Maybe<
              Array<
                Types.Maybe<
                  { __typename?: 'OrderLineDetail' } & Pick<
                    Types.OrderLineDetail,
                    'InternalTrackingNumber' | 'StatusID' | 'OrderID'
                  >
                >
              >
            >;
          }
      >
    >
  >;
  findOrder?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Order' } & Pick<Types.Order, '_id'> & {
            ORDERLINEDETAILs?: Types.Maybe<
              Array<
                Types.Maybe<
                  { __typename?: 'OrderLineDetail' } & Pick<
                    Types.OrderLineDetail,
                    'InternalTrackingNumber' | 'StatusID' | 'ContainerID'
                  >
                >
              >
            >;
          }
      >
    >
  >;
};

export type HoldQcOrderMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  Status: Types.Scalars['String'];
  Station: Types.Scalars['String'];
  StatusID: Types.Scalars['Int'];
}>;

export type HoldQcOrderMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'updateOrderLineDetail'
> & {
    holdQCOrder: { __typename?: 'Response' } & Pick<
      Types.Response,
      'success' | 'message'
    >;
  };

export type UpdateMerpAfterQcVerifyMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  DateCode: Types.Scalars['String'];
  CountryOfOrigin: Types.Scalars['String'];
  ROHS: Types.Scalars['String'];
  CountMethod: Types.Scalars['String'];
}>;

export type UpdateMerpAfterQcVerifyMutation = { __typename?: 'Mutation' } & {
  changeQCLineInfo: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
};

export type UpdateMerpForLastLineAfterQcRepackMutationVariables = Types.Exact<{
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
  Status: Types.Scalars['String'];
  UserOrStatus?: Types.Maybe<Types.Scalars['String']>;
}>;

export type UpdateMerpForLastLineAfterQcRepackMutation = {
  __typename?: 'Mutation';
} & {
  updateMerpOrderStatus: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
  clearMerpTote: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
};

export const VerifyItNforQcDocument = gql`
  query verifyITNforQc($OrderLineDetail: searchOrderLineDetail!) {
    findOrderLineDetail(OrderLineDetail: $OrderLineDetail) {
      StatusID
      ParentITN
      Quantity
      ROHS
      DateCode
      CountryOfOrigin
      OrderLine {
        OrderLineNumber
        ProductCode
        PartNumber
      }
      Order {
        DistributionCenter
        OrderNumber
        NOSINumber
        CustomerNumber
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class VerifyItNforQcGQL extends Apollo.Query<
  VerifyItNforQcQuery,
  VerifyItNforQcQueryVariables
> {
  document = VerifyItNforQcDocument;

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
  providedIn: 'root',
})
export class FetchProductInfoFromMerpGQL extends Apollo.Query<
  FetchProductInfoFromMerpQuery,
  FetchProductInfoFromMerpQueryVariables
> {
  document = FetchProductInfoFromMerpDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const QcGlobalMessageDocument = gql`
  query qcGlobalMessage(
    $CustomerNumber: String!
    $DistributionCenter: String!
    $OrderNumber: String!
    $OrderLineNumber: String!
    $ProductCode: String!
    $PartNumber: String!
  ) {
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
  providedIn: 'root',
})
export class QcGlobalMessageGQL extends Apollo.Query<
  QcGlobalMessageQuery,
  QcGlobalMessageQueryVariables
> {
  document = QcGlobalMessageDocument;

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
  providedIn: 'root',
})
export class FetchPrinterStationGQL extends Apollo.Query<
  FetchPrinterStationQuery,
  FetchPrinterStationQueryVariables
> {
  document = FetchPrinterStationDocument;

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
  providedIn: 'root',
})
export class PrintItnLabelGQL extends Apollo.Mutation<
  PrintItnLabelMutation,
  PrintItnLabelMutationVariables
> {
  document = PrintItnLabelDocument;

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
  providedIn: 'root',
})
export class VerifyQcRepackGQL extends Apollo.Query<
  VerifyQcRepackQuery,
  VerifyQcRepackQueryVariables
> {
  document = VerifyQcRepackDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const HoldQcOrderDocument = gql`
  mutation holdQCOrder(
    $InternalTrackingNumber: String!
    $Status: String!
    $Station: String!
    $StatusID: Int!
  ) {
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
      OrderLineDetail: { StatusID: $StatusID }
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class HoldQcOrderGQL extends Apollo.Mutation<
  HoldQcOrderMutation,
  HoldQcOrderMutationVariables
> {
  document = HoldQcOrderDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateMerpAfterQcVerifyDocument = gql`
  mutation updateMerpAfterQcVerify(
    $InternalTrackingNumber: String!
    $DateCode: String!
    $CountryOfOrigin: String!
    $ROHS: String!
    $CountMethod: String!
  ) {
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
  providedIn: 'root',
})
export class UpdateMerpAfterQcVerifyGQL extends Apollo.Mutation<
  UpdateMerpAfterQcVerifyMutation,
  UpdateMerpAfterQcVerifyMutationVariables
> {
  document = UpdateMerpAfterQcVerifyDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateMerpForLastLineAfterQcRepackDocument = gql`
  mutation updateMerpForLastLineAfterQCRepack(
    $OrderNumber: String!
    $NOSINumber: String!
    $Status: String!
    $UserOrStatus: String
  ) {
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
  providedIn: 'root',
})
export class UpdateMerpForLastLineAfterQcRepackGQL extends Apollo.Mutation<
  UpdateMerpForLastLineAfterQcRepackMutation,
  UpdateMerpForLastLineAfterQcRepackMutationVariables
> {
  document = UpdateMerpForLastLineAfterQcRepackDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
