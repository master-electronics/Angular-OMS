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

export type GlobalMessage = {
  __typename?: 'GlobalMessage';
  comments?: Maybe<Array<Maybe<Scalars['String']>>>;
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
  OrderID?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  aggregationIn: Response;
  updateContainerLocation: Response;
  updateInventory: Response;
  updateOrderStatus: Response;
  /** For qc page */
  holdQCOrder: Response;
  updateQCOrder: Response;
  insertRecordsAfterQC: Response;
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
  LastUpdated?: Maybe<Scalars['String']>;
  Order: OrderUpdate;
};

export type MutationHoldQcOrderArgs = {
  InternalTrackingNumber: Scalars['String'];
  User: Scalars['String'];
  Status: Scalars['String'];
  Station: Scalars['String'];
};

export type MutationUpdateQcOrderArgs = {
  InternalTrackingNumber: Scalars['String'];
  User: Scalars['String'];
  DateCode: Scalars['String'];
  CountryOfOrigin: Scalars['String'];
  ROHS: Scalars['String'];
  CountMethod: Scalars['String'];
};

export type MutationInsertRecordsAfterQcArgs = {
  Inventory: InventoryUpdate;
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
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  StatusID?: Maybe<Scalars['Int']>;
  LastUpdated?: Maybe<Scalars['String']>;
};

export type PackInfoFromMerp = {
  __typename?: 'PackInfoFromMerp';
  CustomerNumber?: Maybe<Scalars['String']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  OrderLineNumber?: Maybe<Scalars['String']>;
  ProductCode?: Maybe<Scalars['String']>;
  PartNumber?: Maybe<Scalars['String']>;
  Status?: Maybe<Scalars['String']>;
  Quantity?: Maybe<Scalars['Float']>;
  DemandQuantity?: Maybe<Scalars['Float']>;
  ParentITN?: Maybe<Scalars['String']>;
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
  /** for ag in */
  fetchInventoryInfoFromMerp?: Maybe<InventoryInfoFromMerp>;
  /** for qc */
  fetchPackInfoFromMerp?: Maybe<PackInfoFromMerp>;
  fetchProductInfoFromMerp?: Maybe<ProdunctInfoFromMerp>;
  fetchOrderLineMessage?: Maybe<GlobalMessage>;
  fetchPartMessage?: Maybe<GlobalMessage>;
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

export type QueryFetchInventoryInfoFromMerpArgs = {
  DistributionCenter: Scalars['String'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
};

export type QueryFetchPackInfoFromMerpArgs = {
  InternalTrackingNumber: Scalars['String'];
};

export type QueryFetchProductInfoFromMerpArgs = {
  PartNumber: Scalars['String'];
  ProductCode: Scalars['String'];
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

export type FetchPackInfoByItNfromMerpQueryVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
}>;

export type FetchPackInfoByItNfromMerpQuery = { __typename?: 'Query' } & {
  fetchPackInfoFromMerp?: Types.Maybe<
    { __typename?: 'PackInfoFromMerp' } & Pick<
      Types.PackInfoFromMerp,
      | 'CustomerNumber'
      | 'DistributionCenter'
      | 'OrderNumber'
      | 'OrderLineNumber'
      | 'NOSINumber'
      | 'ProductCode'
      | 'PartNumber'
      | 'Status'
      | 'Quantity'
      | 'DemandQuantity'
      | 'ParentITN'
      | 'ROHS'
      | 'DateCode'
      | 'CountryOfOrigin'
    >
  >;
};

export type FetchProductInfoFromMerpQueryVariables = Types.Exact<{
  PartNumber: Types.Scalars['String'];
  ProductCode: Types.Scalars['String'];
}>;

export type FetchProductInfoFromMerpQuery = { __typename?: 'Query' } & {
  fetchProductInfoFromMerp?: Types.Maybe<
    { __typename?: 'ProdunctInfoFromMerp' } & Pick<
      Types.ProdunctInfoFromMerp,
      'MICPartNumber' | 'HazardMaterialLevel'
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

export type HoldQcOrderMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  User: Types.Scalars['String'];
  Status: Types.Scalars['String'];
  Station: Types.Scalars['String'];
}>;

export type HoldQcOrderMutation = { __typename?: 'Mutation' } & {
  holdQCOrder: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
};

export type UpdateQcOrderMutationVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
  User: Types.Scalars['String'];
  DateCode: Types.Scalars['String'];
  CountryOfOrigin: Types.Scalars['String'];
  ROHS: Types.Scalars['String'];
  CountMethod: Types.Scalars['String'];
}>;

export type UpdateQcOrderMutation = { __typename?: 'Mutation' } & {
  updateQCOrder: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
};

export type FindContainerQueryVariables = Types.Exact<{
  Barcode: Types.Scalars['String'];
  DistributionCenter: Types.Scalars['String'];
}>;

export type FindContainerQuery = { __typename?: 'Query' } & {
  findContainer?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Container' } & Pick<Types.Container, '_id' | 'Row'> & {
            Type: { __typename?: 'ContainerType' } & Pick<
              Types.ContainerType,
              '_id'
            >;
          }
      >
    >
  >;
};

export type InsertRecordsAfterQcMutationVariables = Types.Exact<{
  Inventory: Types.InventoryUpdate;
  Order: Types.OrderUpdate;
}>;

export type InsertRecordsAfterQcMutation = { __typename?: 'Mutation' } & {
  insertRecordsAfterQC: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
};

export const FetchPackInfoByItNfromMerpDocument = gql`
  query fetchPackInfoByITNfromMerp($InternalTrackingNumber: String!) {
    fetchPackInfoFromMerp(InternalTrackingNumber: $InternalTrackingNumber) {
      CustomerNumber
      DistributionCenter
      OrderNumber
      OrderLineNumber
      NOSINumber
      ProductCode
      PartNumber
      Status
      Quantity
      DemandQuantity
      ParentITN
      ROHS
      DateCode
      CountryOfOrigin
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchPackInfoByItNfromMerpGQL extends Apollo.Query<
  FetchPackInfoByItNfromMerpQuery,
  FetchPackInfoByItNfromMerpQueryVariables
> {
  document = FetchPackInfoByItNfromMerpDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchProductInfoFromMerpDocument = gql`
  query fetchProductInfoFromMerp($PartNumber: String!, $ProductCode: String!) {
    fetchProductInfoFromMerp(
      PartNumber: $PartNumber
      ProductCode: $ProductCode
    ) {
      MICPartNumber
      HazardMaterialLevel
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
export const HoldQcOrderDocument = gql`
  mutation holdQCOrder(
    $InternalTrackingNumber: String!
    $User: String!
    $Status: String!
    $Station: String!
  ) {
    holdQCOrder(
      InternalTrackingNumber: $InternalTrackingNumber
      User: $User
      Status: $Status
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
export class HoldQcOrderGQL extends Apollo.Mutation<
  HoldQcOrderMutation,
  HoldQcOrderMutationVariables
> {
  document = HoldQcOrderDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateQcOrderDocument = gql`
  mutation updateQCOrder(
    $InternalTrackingNumber: String!
    $User: String!
    $DateCode: String!
    $CountryOfOrigin: String!
    $ROHS: String!
    $CountMethod: String!
  ) {
    updateQCOrder(
      InternalTrackingNumber: $InternalTrackingNumber
      User: $User
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
export class UpdateQcOrderGQL extends Apollo.Mutation<
  UpdateQcOrderMutation,
  UpdateQcOrderMutationVariables
> {
  document = UpdateQcOrderDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FindContainerDocument = gql`
  query findContainer($Barcode: String!, $DistributionCenter: String!) {
    findContainer(Barcode: $Barcode, DistributionCenter: $DistributionCenter) {
      _id
      Type {
        _id
      }
      Row
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FindContainerGQL extends Apollo.Query<
  FindContainerQuery,
  FindContainerQueryVariables
> {
  document = FindContainerDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const InsertRecordsAfterQcDocument = gql`
  mutation insertRecordsAfterQC(
    $Inventory: InventoryUpdate!
    $Order: OrderUpdate!
  ) {
    insertRecordsAfterQC(Inventory: $Inventory, Order: $Order) {
      success
      message
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class InsertRecordsAfterQcGQL extends Apollo.Mutation<
  InsertRecordsAfterQcMutation,
  InsertRecordsAfterQcMutationVariables
> {
  document = InsertRecordsAfterQcDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
