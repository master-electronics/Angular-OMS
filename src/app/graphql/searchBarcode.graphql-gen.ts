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
  BinLocation?: Maybe<Scalars['String']>;
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
  BinLocation?: Maybe<Scalars['String']>;
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
  BinLocation?: Maybe<Scalars['String']>;
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
  BinLocation?: Maybe<Scalars['String']>;
};

export type FindContainerForSearchBarcodeQueryVariables = Types.Exact<{
  Container: Types.SearchContainer;
}>;

export type FindContainerForSearchBarcodeQuery = { __typename?: 'Query' } & {
  findContainer?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Container' } & Pick<Types.Container, 'Barcode'> & {
            ORDERLINEDETAILs?: Types.Maybe<
              Array<
                Types.Maybe<
                  { __typename?: 'OrderLineDetail' } & Pick<
                    Types.OrderLineDetail,
                    'InternalTrackingNumber'
                  > & {
                      Status: { __typename?: 'OrderStatus' } & Pick<
                        Types.OrderStatus,
                        'Name'
                      >;
                      OrderLine: { __typename?: 'OrderLine' } & Pick<
                        Types.OrderLine,
                        'ProductCode' | 'PartNumber' | 'OrderLineNumber'
                      >;
                      Order: { __typename?: 'Order' } & Pick<
                        Types.Order,
                        'OrderNumber' | 'NOSINumber'
                      > & {
                          ShipmentMethod?: Types.Maybe<
                            { __typename?: 'ShipmentMethod' } & Pick<
                              Types.ShipmentMethod,
                              'PriorityPinkPaper'
                            >
                          >;
                        };
                    }
                >
              >
            >;
          }
      >
    >
  >;
};

export type FindItNforSearchBarcodeQueryVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
}>;

export type FindItNforSearchBarcodeQuery = { __typename?: 'Query' } & {
  findOrderLineDetail?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'OrderLineDetail' } & Pick<
          Types.OrderLineDetail,
          'InternalTrackingNumber'
        > & {
            Status: { __typename?: 'OrderStatus' } & Pick<
              Types.OrderStatus,
              'Name'
            >;
            Container: { __typename?: 'Container' } & Pick<
              Types.Container,
              | 'Barcode'
              | 'Warehouse'
              | 'Row'
              | 'Aisle'
              | 'Section'
              | 'Shelf'
              | 'ShelfDetail'
            >;
            OrderLine: { __typename?: 'OrderLine' } & Pick<
              Types.OrderLine,
              'ProductCode' | 'PartNumber' | 'OrderLineNumber'
            >;
            Order: { __typename?: 'Order' } & Pick<
              Types.Order,
              'OrderNumber' | 'NOSINumber'
            > & {
                ShipmentMethod?: Types.Maybe<
                  { __typename?: 'ShipmentMethod' } & Pick<
                    Types.ShipmentMethod,
                    'PriorityPinkPaper'
                  >
                >;
              };
          }
      >
    >
  >;
};

export type FindOrderForSearchBarcodeQueryVariables = Types.Exact<{
  DistributionCenter: Types.Scalars['String'];
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
}>;

export type FindOrderForSearchBarcodeQuery = { __typename?: 'Query' } & {
  findOrder?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Order' } & Pick<
          Types.Order,
          'OrderNumber' | 'NOSINumber'
        > & {
            ShipmentMethod?: Types.Maybe<
              { __typename?: 'ShipmentMethod' } & Pick<
                Types.ShipmentMethod,
                'PriorityPinkPaper'
              >
            >;
            ORDERLINEs?: Types.Maybe<
              Array<
                Types.Maybe<
                  { __typename?: 'OrderLine' } & Pick<
                    Types.OrderLine,
                    'ProductCode' | 'PartNumber' | 'OrderLineNumber'
                  > & {
                      ORDERLINEDETAILs?: Types.Maybe<
                        Array<
                          Types.Maybe<
                            { __typename?: 'OrderLineDetail' } & Pick<
                              Types.OrderLineDetail,
                              'InternalTrackingNumber' | 'Quantity'
                            > & {
                                Status: { __typename?: 'OrderStatus' } & Pick<
                                  Types.OrderStatus,
                                  'Name'
                                >;
                                Container: { __typename?: 'Container' } & Pick<
                                  Types.Container,
                                  | 'Barcode'
                                  | 'Warehouse'
                                  | 'Row'
                                  | 'Aisle'
                                  | 'Section'
                                  | 'Shelf'
                                  | 'ShelfDetail'
                                >;
                              }
                          >
                        >
                      >;
                    }
                >
              >
            >;
          }
      >
    >
  >;
};

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
  providedIn: 'root',
})
export class FindContainerForSearchBarcodeGQL extends Apollo.Query<
  FindContainerForSearchBarcodeQuery,
  FindContainerForSearchBarcodeQueryVariables
> {
  document = FindContainerForSearchBarcodeDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FindItNforSearchBarcodeDocument = gql`
  query findITNforSearchBarcode($InternalTrackingNumber: String!) {
    findOrderLineDetail(
      OrderLineDetail: { InternalTrackingNumber: $InternalTrackingNumber }
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
  providedIn: 'root',
})
export class FindItNforSearchBarcodeGQL extends Apollo.Query<
  FindItNforSearchBarcodeQuery,
  FindItNforSearchBarcodeQueryVariables
> {
  document = FindItNforSearchBarcodeDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FindOrderForSearchBarcodeDocument = gql`
  query findOrderForSearchBarcode(
    $DistributionCenter: String!
    $OrderNumber: String!
    $NOSINumber: String!
  ) {
    findOrder(
      Order: {
        DistributionCenter: $DistributionCenter
        OrderNumber: $OrderNumber
        NOSINumber: $NOSINumber
      }
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
  providedIn: 'root',
})
export class FindOrderForSearchBarcodeGQL extends Apollo.Query<
  FindOrderForSearchBarcodeQuery,
  FindOrderForSearchBarcodeQueryVariables
> {
  document = FindOrderForSearchBarcodeDocument;
  client = 'wmsNodejs';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}