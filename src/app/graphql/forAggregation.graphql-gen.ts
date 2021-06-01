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
  Datetime: any;
};

export type Allocation = {
  __typename?: 'Allocation';
  _id: Scalars['Int'];
  Inventory?: Maybe<Inventory>;
  DistributionCenter: Scalars['String'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderLineNumber: Scalars['String'];
  SequenceNumber: Scalars['String'];
  Quantity?: Maybe<Scalars['Float']>;
};

export type Container = {
  __typename?: 'Container';
  _id: Scalars['Int'];
  Type: ContainerType;
  Equipment?: Maybe<Equipment>;
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
  Barcode: Scalars['String'];
  DistributionCenter: Scalars['String'];
  Zone?: Maybe<Scalars['String']>;
  Warehouse?: Maybe<Scalars['String']>;
  Row?: Maybe<Scalars['String']>;
  Aisle?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
};

export type ContainerType = {
  __typename?: 'ContainerType';
  _id: Scalars['Int'];
  CONTAINERs?: Maybe<Array<Maybe<Container>>>;
  Type: Scalars['String'];
  IsMobile: Scalars['Boolean'];
};

export type ContainerUpdate = {
  DistributionCenter?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['String']>;
  Warehouse?: Maybe<Scalars['String']>;
  Row?: Maybe<Scalars['String']>;
  Aisle?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
};

export type Equipment = {
  __typename?: 'Equipment';
  _id: Scalars['Int'];
  CONTAINERs?: Maybe<Array<Maybe<Container>>>;
  Name: Scalars['String'];
};

export type Inventory = {
  __typename?: 'Inventory';
  _id: Scalars['Int'];
  Container: Container;
  Order?: Maybe<Order>;
  ALLOCATIONs?: Maybe<Array<Maybe<Allocation>>>;
  InternalTrackingNumber: Scalars['String'];
  ProductCode: Scalars['String'];
  PartNumber: Scalars['String'];
  Quantity: Scalars['Float'];
  ROHS: Scalars['Boolean'];
  Cost?: Maybe<Scalars['Float']>;
  DateCode?: Maybe<Scalars['String']>;
  CountryOfOrigin?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  ExpirationDate?: Maybe<Scalars['String']>;
  HoldCode?: Maybe<Scalars['String']>;
  CycleCountDate?: Maybe<Scalars['String']>;
  CycleCountUser?: Maybe<Scalars['String']>;
  LastUpdated?: Maybe<Scalars['String']>;
};

export type InventoryInfoFromMerp = {
  __typename?: 'InventoryInfoFromMerp';
  CustomerNumber?: Maybe<Scalars['String']>;
  PriorityPinkPaper?: Maybe<Scalars['Boolean']>;
  ShippingMethod?: Maybe<Scalars['String']>;
  ITNList?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type InventoryUpdate = {
  ContainerID?: Maybe<Scalars['Int']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  ProductCode?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
  ROHS?: Maybe<Scalars['Boolean']>;
  Cost?: Maybe<Scalars['Float']>;
  DateCode?: Maybe<Scalars['String']>;
  CountryOfOrigin?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  ExpirationDate?: Maybe<Scalars['String']>;
  HoldCode?: Maybe<Scalars['String']>;
  CycleCountDate?: Maybe<Scalars['String']>;
  CycleCountUser?: Maybe<Scalars['String']>;
  LastUpdated?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  aggregationIn: Response;
  updateContainerLocation: Response;
  updateInventory: Response;
  updateOrderStatus: Response;
};

export type MutationAggregationInArgs = {
  qcContainer: Scalars['Int'];
  ITNList: Array<Scalars['String']>;
  Barcode: Scalars['String'];
  DistributionCenter: Scalars['String'];
  newLocation: Scalars['Boolean'];
  isLastITN: Scalars['Boolean'];
  locationList?: Maybe<Array<Scalars['String']>>;
};

export type MutationUpdateContainerLocationArgs = {
  _id: Scalars['Int'];
  Container: ContainerUpdate;
};

export type MutationUpdateInventoryArgs = {
  _id: Scalars['Int'];
  Inventory: InventoryUpdate;
};

export type MutationUpdateOrderStatusArgs = {
  _id?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  StatusID?: Maybe<Scalars['Int']>;
  Order: OrderUpdate;
};

export type Order = {
  __typename?: 'Order';
  _id: Scalars['Int'];
  Status: OrderStatus;
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
  StatusID: Scalars['Int'];
  DistributionCenter: Scalars['String'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  LastUpdated?: Maybe<Scalars['String']>;
};

export type OrderStatus = {
  __typename?: 'OrderStatus';
  _id: Scalars['Int'];
  Name: Scalars['String'];
};

export type OrderUpdate = {
  StatusID?: Maybe<Scalars['Int']>;
  LastUpdated?: Maybe<Scalars['String']>;
};

export type PackInfoFromMerp = {
  __typename?: 'PackInfoFromMerp';
  ProductCode?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Status?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
  DemandQuantity?: Maybe<Scalars['Float']>;
  CountryOfOrigin?: Maybe<Scalars['String']>;
  DateCode?: Maybe<Scalars['String']>;
  ROHS?: Maybe<Scalars['Boolean']>;
};

export type ProdunctInfoFromMerp = {
  __typename?: 'ProdunctInfoFromMerp';
  HazardMaterialLevel?: Maybe<Scalars['Boolean']>;
  MICPartNumber?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** Retrun ITN and current container id for next step */
  verifyContainer: VerifyContainerResponse;
  /** Return all information that could be show in aggregation-in page */
  fetchInventoryInfo?: Maybe<InventoryInfo>;
  findContainer?: Maybe<Array<Maybe<Container>>>;
  findInventory?: Maybe<Array<Maybe<Inventory>>>;
  findOrder?: Maybe<Array<Maybe<Order>>>;
  fetchPackInfoFromMerp?: Maybe<PackInfoFromMerp>;
  fetchInventoryInfoFromMerp?: Maybe<InventoryInfoFromMerp>;
  fetchProductInfoFromMerp?: Maybe<ProdunctInfoFromMerp>;
};

export type QueryVerifyContainerArgs = {
  Barcode: Scalars['String'];
  DistributionCenter: Scalars['String'];
};

export type QueryFetchInventoryInfoArgs = {
  InternalTrackingNumber: Scalars['String'];
  DistributionCenter: Scalars['String'];
};

export type QueryFindContainerArgs = {
  _id?: Maybe<Scalars['Int']>;
  Barcode?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};

export type QueryFindInventoryArgs = {
  _id?: Maybe<Scalars['Int']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};

export type QueryFindOrderArgs = {
  _id?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  StatusID?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type QueryFetchPackInfoFromMerpArgs = {
  InternalTrackingNumber: Scalars['String'];
};

export type QueryFetchInventoryInfoFromMerpArgs = {
  DistributionCenter: Scalars['String'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
};

export type QueryFetchProductInfoFromMerpArgs = {
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
};

export type Response = {
  __typename?: 'Response';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type InventoryInfo = {
  __typename?: 'inventoryInfo';
  OrderNumber: Scalars['String'];
  ShippingMethod: Scalars['String'];
  PriorityPinkPaper: Scalars['String'];
  CustomerNumber: Scalars['String'];
  Quantity: Scalars['Int'];
  ProductCode: Scalars['String'];
  PartNumber: Scalars['String'];
  ITNCount: Scalars['Int'];
  ITNTotal: Scalars['Int'];
  Locations?: Maybe<Array<Scalars['String']>>;
};

export type VerifyContainerResponse = {
  __typename?: 'verifyContainerResponse';
  success: Scalars['Boolean'];
  isRelocation?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
  ITNList?: Maybe<Array<Scalars['String']>>;
  qcContainer?: Maybe<Scalars['Int']>;
};

export type FetchContainerForAggregationInQueryVariables = Types.Exact<{
  Barcode: Types.Scalars['String'];
  DistributionCenter: Types.Scalars['String'];
}>;

export type FetchContainerForAggregationInQuery = { __typename?: 'Query' } & {
  findContainer?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Container' } & Pick<Types.Container, '_id' | 'Row'> & {
            Type: { __typename?: 'ContainerType' } & Pick<
              Types.ContainerType,
              'IsMobile'
            >;
            INVENTORies?: Types.Maybe<
              Array<
                Types.Maybe<
                  { __typename?: 'Inventory' } & Pick<
                    Types.Inventory,
                    'InternalTrackingNumber'
                  >
                >
              >
            >;
          }
      >
    >
  >;
};

export type PickOrdersForAggregationOutQueryVariables = Types.Exact<{
  agInDone: Types.Scalars['Int'];
  agOutPresent: Types.Scalars['Int'];
  agOutPicking: Types.Scalars['Int'];
  limit?: Types.Maybe<Types.Scalars['Int']>;
}>;

export type PickOrdersForAggregationOutQuery = { __typename?: 'Query' } & {
  agInDone?: Types.Maybe<
    Array<Types.Maybe<{ __typename?: 'Order' } & OrderInfoFragment>>
  >;
  agOutPresent?: Types.Maybe<
    Array<Types.Maybe<{ __typename?: 'Order' } & OrderInfoFragment>>
  >;
  agOutPicking?: Types.Maybe<
    Array<Types.Maybe<{ __typename?: 'Order' } & OrderInfoFragment>>
  >;
};

export type OrderInfoFragment = { __typename?: 'Order' } & Pick<
  Types.Order,
  | '_id'
  | 'DistributionCenter'
  | 'OrderNumber'
  | 'NOSINumber'
  | 'StatusID'
  | 'LastUpdated'
> & {
    Status: { __typename?: 'OrderStatus' } & Pick<Types.OrderStatus, 'Name'>;
  };

export type FetchOrderStatusQueryVariables = Types.Exact<{
  _id?: Types.Maybe<Types.Scalars['Int']>;
  DistributionCenter?: Types.Maybe<Types.Scalars['String']>;
  OrderNumber?: Types.Maybe<Types.Scalars['String']>;
  NOSINumber?: Types.Maybe<Types.Scalars['String']>;
}>;

export type FetchOrderStatusQuery = { __typename?: 'Query' } & {
  findOrder?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Order' } & Pick<Types.Order, '_id' | 'StatusID'>
      >
    >
  >;
};

export type UpdateOrderStatusMutationVariables = Types.Exact<{
  _id?: Types.Maybe<Types.Scalars['Int']>;
  DistributionCenter?: Types.Maybe<Types.Scalars['String']>;
  OrderNumber?: Types.Maybe<Types.Scalars['String']>;
  NOSINumber?: Types.Maybe<Types.Scalars['String']>;
  StatusID?: Types.Maybe<Types.Scalars['Int']>;
  Order: Types.OrderUpdate;
}>;

export type UpdateOrderStatusMutation = { __typename?: 'Mutation' } & {
  updateOrderStatus: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
};

export type FetchLocationForAggregationOutQueryVariables = Types.Exact<{
  DistributionCenter?: Types.Maybe<Types.Scalars['String']>;
  OrderNumber?: Types.Maybe<Types.Scalars['String']>;
  NOSINumber?: Types.Maybe<Types.Scalars['String']>;
}>;

export type FetchLocationForAggregationOutQuery = { __typename?: 'Query' } & {
  findOrder?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Order' } & {
          INVENTORies?: Types.Maybe<
            Array<
              Types.Maybe<
                { __typename?: 'Inventory' } & Pick<
                  Types.Inventory,
                  'InternalTrackingNumber'
                > & {
                    Container: { __typename?: 'Container' } & Pick<
                      Types.Container,
                      | 'Barcode'
                      | 'DistributionCenter'
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
};

export const OrderInfoFragmentDoc = gql`
  fragment orderInfo on Order {
    _id
    DistributionCenter
    OrderNumber
    NOSINumber
    StatusID
    Status {
      Name
    }
    LastUpdated
  }
`;
export const FetchContainerForAggregationInDocument = gql`
  query fetchContainerForAggregationIn(
    $Barcode: String!
    $DistributionCenter: String!
  ) {
    findContainer(Barcode: $Barcode, DistributionCenter: $DistributionCenter) {
      _id
      Row
      Type {
        IsMobile
      }
      INVENTORies {
        InternalTrackingNumber
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchContainerForAggregationInGQL extends Apollo.Query<
  FetchContainerForAggregationInQuery,
  FetchContainerForAggregationInQueryVariables
> {
  document = FetchContainerForAggregationInDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const PickOrdersForAggregationOutDocument = gql`
  query pickOrdersForAggregationOut(
    $agInDone: Int!
    $agOutPresent: Int!
    $agOutPicking: Int!
    $limit: Int
  ) {
    agInDone: findOrder(StatusID: $agInDone, limit: $limit) {
      ...orderInfo
    }
    agOutPresent: findOrder(StatusID: $agOutPresent, limit: $limit) {
      ...orderInfo
    }
    agOutPicking: findOrder(StatusID: $agOutPicking, limit: $limit) {
      ...orderInfo
    }
  }
  ${OrderInfoFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class PickOrdersForAggregationOutGQL extends Apollo.Query<
  PickOrdersForAggregationOutQuery,
  PickOrdersForAggregationOutQueryVariables
> {
  document = PickOrdersForAggregationOutDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchOrderStatusDocument = gql`
  query fetchOrderStatus(
    $_id: Int
    $DistributionCenter: String
    $OrderNumber: String
    $NOSINumber: String
  ) {
    findOrder(
      _id: $_id
      DistributionCenter: $DistributionCenter
      OrderNumber: $OrderNumber
      NOSINumber: $NOSINumber
    ) {
      _id
      StatusID
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchOrderStatusGQL extends Apollo.Query<
  FetchOrderStatusQuery,
  FetchOrderStatusQueryVariables
> {
  document = FetchOrderStatusDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateOrderStatusDocument = gql`
  mutation updateOrderStatus(
    $_id: Int
    $DistributionCenter: String
    $OrderNumber: String
    $NOSINumber: String
    $StatusID: Int
    $Order: OrderUpdate!
  ) {
    updateOrderStatus(
      _id: $_id
      DistributionCenter: $DistributionCenter
      OrderNumber: $OrderNumber
      NOSINumber: $NOSINumber
      StatusID: $StatusID
      Order: $Order
    ) {
      success
      message
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateOrderStatusGQL extends Apollo.Mutation<
  UpdateOrderStatusMutation,
  UpdateOrderStatusMutationVariables
> {
  document = UpdateOrderStatusDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchLocationForAggregationOutDocument = gql`
  query fetchLocationForAggregationOut(
    $DistributionCenter: String
    $OrderNumber: String
    $NOSINumber: String
  ) {
    findOrder(
      DistributionCenter: $DistributionCenter
      OrderNumber: $OrderNumber
      NOSINumber: $NOSINumber
    ) {
      INVENTORies {
        Container {
          Barcode
          DistributionCenter
          Warehouse
          Row
          Aisle
          Section
          Shelf
          ShelfDetail
        }
        InternalTrackingNumber
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchLocationForAggregationOutGQL extends Apollo.Query<
  FetchLocationForAggregationOutQuery,
  FetchLocationForAggregationOutQueryVariables
> {
  document = FetchLocationForAggregationOutDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
