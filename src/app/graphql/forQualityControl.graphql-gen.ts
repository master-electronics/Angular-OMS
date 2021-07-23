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
  _id?: Maybe<Scalars['Int']>;
  Type?: Maybe<Scalars['Int']>;
  Equipment?: Maybe<Scalars['Int']>;
  Barcode?: Maybe<Scalars['String']>;
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

export type ItnList = {
  __typename?: 'ITNList';
  ITNList?: Maybe<Array<Maybe<Scalars['String']>>>;
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

export type M1Tote = {
  __typename?: 'M1TOTE';
  OrderNumber?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  aggregationIn: Response;
  updateContainerList: Response;
  updateContainerLocation: Response;
  updateInventory: Response;
  updateOrderStatus: Response;
  /** For qc page */
  holdQCOrder: Response;
  updateQCOrder: Response;
  updateQCStatus: Response;
  clearTote: Response;
  insertSQLRecordsAfterQC: Response;
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

export type MutationUpdateContainerListArgs = {
  ContainerList: Array<Maybe<ContainerUpdate>>;
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

export type MutationUpdateQcStatusArgs = {
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  Status: Scalars['String'];
  User: Scalars['String'];
  UserOrStatus?: Maybe<Scalars['String']>;
};

export type MutationClearToteArgs = {
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
};

export type MutationInsertSqlRecordsAfterQcArgs = {
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
  findInventoryList?: Maybe<Array<Maybe<Inventory>>>;
  findOrder?: Maybe<Array<Maybe<Order>>>;
  /** for ag in */
  fetchInventoryInfoFromMerp?: Maybe<InventoryInfoFromMerp>;
  /** for qc */
  fetchPackInfoFromMerp?: Maybe<PackInfoFromMerp>;
  fetchProductInfoFromMerp?: Maybe<ProdunctInfoFromMerp>;
  fetchOrderLineMessage?: Maybe<GlobalMessage>;
  fetchPartMessage?: Maybe<GlobalMessage>;
  fetchM1TOTEInfo?: Maybe<M1Tote>;
  fetchITNsInOrder?: Maybe<ItnList>;
  findInventoriesByContainer?: Maybe<Array<Maybe<Inventory>>>;
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

export type QueryFindInventoryListArgs = {
  idList?: Maybe<Array<Scalars['Int']>>;
  ITNList?: Maybe<Array<Scalars['String']>>;
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

export type QueryFetchM1ToteInfoArgs = {
  DistributionCenter: Scalars['String'];
  Barcode: Scalars['String'];
};

export type QueryFetchItNsInOrderArgs = {
  DistributionCenter: Scalars['String'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
};

export type QueryFindInventoriesByContainerArgs = {
  ContainerID: Scalars['Int'];
  limit?: Maybe<Scalars['Int']>;
};

export type Response = {
  __typename?: 'Response';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type InventoryInfo = {
  __typename?: 'inventoryInfo';
  orderId: Scalars['Int'];
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
  fetchM1TOTEInfo?: Types.Maybe<
    { __typename?: 'M1TOTE' } & Pick<Types.M1Tote, 'OrderNumber'>
  >;
};

export type FindInventoryByContainerQueryVariables = Types.Exact<{
  ContainerID: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;

export type FindInventoryByContainerQuery = { __typename?: 'Query' } & {
  findInventoriesByContainer?: Types.Maybe<
    Array<
      Types.Maybe<{ __typename?: 'Inventory' } & Pick<Types.Inventory, '_id'>>
    >
  >;
};

export type FetchItNsInOrderQueryVariables = Types.Exact<{
  DistributionCenter: Types.Scalars['String'];
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
}>;

export type FetchItNsInOrderQuery = { __typename?: 'Query' } & {
  fetchITNsInOrder?: Types.Maybe<
    { __typename?: 'ITNList' } & Pick<Types.ItnList, 'ITNList'>
  >;
};

export type FindInventoryListQueryVariables = Types.Exact<{
  ITNList: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;

export type FindInventoryListQuery = { __typename?: 'Query' } & {
  findInventoryList?: Types.Maybe<
    Array<
      Types.Maybe<{ __typename?: 'Inventory' } & Pick<Types.Inventory, '_id'>>
    >
  >;
};

export type InsertSqlRecordsAfterQcMutationVariables = Types.Exact<{
  Inventory: Types.InventoryUpdate;
  Order: Types.OrderUpdate;
}>;

export type InsertSqlRecordsAfterQcMutation = { __typename?: 'Mutation' } & {
  insertSQLRecordsAfterQC: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
};

export type UpdateRecordsAfterQcLastLineMutationVariables = Types.Exact<{
  Inventory: Types.InventoryUpdate;
  Order: Types.OrderUpdate;
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
  Status: Types.Scalars['String'];
  User: Types.Scalars['String'];
  UserOrStatus?: Types.Maybe<Types.Scalars['String']>;
}>;

export type UpdateRecordsAfterQcLastLineMutation = {
  __typename?: 'Mutation';
} & {
  insertSQLRecordsAfterQC: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
  updateQCStatus: { __typename?: 'Response' } & Pick<
    Types.Response,
    'success' | 'message'
  >;
  clearTote: { __typename?: 'Response' } & Pick<
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
      Row
      Type {
        _id
      }
    }
    fetchM1TOTEInfo(
      Barcode: $Barcode
      DistributionCenter: $DistributionCenter
    ) {
      OrderNumber
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
export const FindInventoryByContainerDocument = gql`
  query findInventoryByContainer($ContainerID: Int!, $limit: Int!) {
    findInventoriesByContainer(ContainerID: $ContainerID, limit: $limit) {
      _id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FindInventoryByContainerGQL extends Apollo.Query<
  FindInventoryByContainerQuery,
  FindInventoryByContainerQueryVariables
> {
  document = FindInventoryByContainerDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchItNsInOrderDocument = gql`
  query fetchITNsINOrder(
    $DistributionCenter: String!
    $OrderNumber: String!
    $NOSINumber: String!
  ) {
    fetchITNsInOrder(
      DistributionCenter: $DistributionCenter
      OrderNumber: $OrderNumber
      NOSINumber: $NOSINumber
    ) {
      ITNList
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchItNsInOrderGQL extends Apollo.Query<
  FetchItNsInOrderQuery,
  FetchItNsInOrderQueryVariables
> {
  document = FetchItNsInOrderDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FindInventoryListDocument = gql`
  query findInventoryList($ITNList: [String!]!) {
    findInventoryList(ITNList: $ITNList) {
      _id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FindInventoryListGQL extends Apollo.Query<
  FindInventoryListQuery,
  FindInventoryListQueryVariables
> {
  document = FindInventoryListDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const InsertSqlRecordsAfterQcDocument = gql`
  mutation insertSQLRecordsAfterQC(
    $Inventory: InventoryUpdate!
    $Order: OrderUpdate!
  ) {
    insertSQLRecordsAfterQC(Inventory: $Inventory, Order: $Order) {
      success
      message
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class InsertSqlRecordsAfterQcGQL extends Apollo.Mutation<
  InsertSqlRecordsAfterQcMutation,
  InsertSqlRecordsAfterQcMutationVariables
> {
  document = InsertSqlRecordsAfterQcDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateRecordsAfterQcLastLineDocument = gql`
  mutation updateRecordsAfterQCLastLine(
    $Inventory: InventoryUpdate!
    $Order: OrderUpdate!
    $OrderNumber: String!
    $NOSINumber: String!
    $Status: String!
    $User: String!
    $UserOrStatus: String
  ) {
    insertSQLRecordsAfterQC(Inventory: $Inventory, Order: $Order) {
      success
      message
    }
    updateQCStatus(
      OrderNumber: $OrderNumber
      NOSINumber: $NOSINumber
      User: $User
      Status: $Status
      UserOrStatus: $UserOrStatus
    ) {
      success
      message
    }
    clearTote(OrderNumber: $OrderNumber, NOSINumber: $NOSINumber) {
      success
      message
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateRecordsAfterQcLastLineGQL extends Apollo.Mutation<
  UpdateRecordsAfterQcLastLineMutation,
  UpdateRecordsAfterQcLastLineMutationVariables
> {
  document = UpdateRecordsAfterQcLastLineDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
