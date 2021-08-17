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

export type CreationRes = {
  __typename?: 'CreationRes';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  _id: Scalars['Int'];
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
  Status: OrderStatus;
  Order?: Maybe<Order>;
  ALLOCATIONs?: Maybe<Array<Maybe<Allocation>>>;
  InternalTrackingNumber: Scalars['String'];
  StatusID: Scalars['Int'];
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

export type InventoryInsert = {
  ContainerID: Scalars['Int'];
  StatusID: Scalars['Int'];
  OrderID: Scalars['Int'];
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
  OrderID?: Maybe<Scalars['Int']>;
  StatusID?: Maybe<Scalars['Int']>;
};

export type M1Tote = {
  __typename?: 'M1TOTE';
  OrderNumber?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  aggregationIn: Response;
  updateContainerLocation: Response;
  updateInventoryList: Response;
  insertInventory: CreationRes;
  deleteInventory: Response;
  updateOrder: Response;
  insertOrder: CreationRes;
  deleteOrder: Response;
  /** For qc page */
  holdQCOrder: Response;
  changeQCLineInfo: Response;
  updateMerpOrderStatus: Response;
  updateMerpWMSLog: Response;
  clearMerpTote: Response;
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

export type MutationUpdateContainerLocationArgs = {
  _id: Scalars['Int'];
  Container: ContainerUpdate;
};

export type MutationUpdateInventoryListArgs = {
  idList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  ITNList?: Maybe<Array<Maybe<Scalars['String']>>>;
  Inventory: InventoryUpdate;
};

export type MutationInsertInventoryArgs = {
  Inventory: InventoryInsert;
};

export type MutationDeleteInventoryArgs = {
  _id?: Maybe<Scalars['Int']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
};

export type MutationUpdateOrderArgs = {
  _id?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  StatusID?: Maybe<Scalars['Int']>;
  LastUpdated?: Maybe<Scalars['String']>;
  Order: OrderUpdate;
};

export type MutationInsertOrderArgs = {
  Order: OrderInsert;
};

export type MutationDeleteOrderArgs = {
  _id?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
};

export type MutationHoldQcOrderArgs = {
  InternalTrackingNumber: Scalars['String'];
  Status: Scalars['String'];
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

export type OrderBarcode = {
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
};

export type OrderInsert = {
  DistributionCenter: Scalars['String'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  StatusID: Scalars['Int'];
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

export type ProductKey = {
  __typename?: 'ProductKey';
  ProductCode: Scalars['String'];
  PartNumber: Scalars['String'];
};

export type ProdunctInfoFromMerp = {
  __typename?: 'ProdunctInfoFromMerp';
  ExternalKey?: Maybe<Scalars['String']>;
  HazardMaterialLevel?: Maybe<Scalars['String']>;
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
  /** Search by list of id or DC + list of Barcode */
  findContainerList?: Maybe<Array<Maybe<Container>>>;
  /** for ag in */
  fetchInventoryInfoFromMerp?: Maybe<InventoryInfoFromMerp>;
  /** for qc */
  fetchPackInfoFromMerp?: Maybe<PackInfoFromMerp>;
  fetchProductInfoFromMerp?: Maybe<Array<Maybe<ProdunctInfoFromMerp>>>;
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
  Warehouse?: Maybe<Scalars['String']>;
  Row?: Maybe<Scalars['String']>;
  Aisle?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
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

export type QueryFindContainerListArgs = {
  idList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  BarcodeList?: Maybe<Array<Maybe<Scalars['String']>>>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Limit?: Maybe<Scalars['Int']>;
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
  NOSINumber: Scalars['String'];
  OrderLineNumber: Scalars['String'];
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

export type FetchMobileContainerInfoByBarcodeQueryVariables = Types.Exact<{
  DistributionCenter: Types.Scalars['String'];
  BarcodeList:
    | Array<Types.Maybe<Types.Scalars['String']>>
    | Types.Maybe<Types.Scalars['String']>;
}>;

export type FetchMobileContainerInfoByBarcodeQuery = {
  __typename?: 'Query';
} & {
  findContainerList?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Container' } & Pick<
          Types.Container,
          | 'Warehouse'
          | 'Row'
          | 'Aisle'
          | 'Section'
          | 'Shelf'
          | 'ShelfDetail'
          | 'Barcode'
        > & {
            INVENTORies?: Types.Maybe<
              Array<
                Types.Maybe<
                  { __typename?: 'Inventory' } & Pick<
                    Types.Inventory,
                    'InternalTrackingNumber'
                  > & {
                      Order?: Types.Maybe<
                        { __typename?: 'Order' } & Pick<
                          Types.Order,
                          'OrderNumber' | 'NOSINumber'
                        > & {
                            Status: { __typename?: 'OrderStatus' } & Pick<
                              Types.OrderStatus,
                              'Name'
                            >;
                          }
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

export type FindMobileContainerListInFixLocationQueryVariables = Types.Exact<{
  DistributionCenter: Types.Scalars['String'];
  Warehouse: Types.Scalars['String'];
  Row: Types.Scalars['String'];
  Aisle: Types.Scalars['String'];
  Section: Types.Scalars['String'];
  Shelf: Types.Scalars['String'];
  ShelfDetail: Types.Scalars['String'];
}>;

export type FindMobileContainerListInFixLocationQuery = {
  __typename?: 'Query';
} & {
  findContainer?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Container' } & Pick<Types.Container, 'Barcode'>
      >
    >
  >;
};

export type SearchBarcodeForItnQueryVariables = Types.Exact<{
  InternalTrackingNumber: Types.Scalars['String'];
}>;

export type SearchBarcodeForItnQuery = { __typename?: 'Query' } & {
  findInventory?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Inventory' } & Pick<
          Types.Inventory,
          'InternalTrackingNumber'
        > & {
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
            Order?: Types.Maybe<
              { __typename?: 'Order' } & Pick<
                Types.Order,
                'OrderNumber' | 'NOSINumber'
              > & {
                  Status: { __typename?: 'OrderStatus' } & Pick<
                    Types.OrderStatus,
                    'Name'
                  >;
                }
            >;
          }
      >
    >
  >;
};

export type SearchBarcodeForOrderNumberQueryVariables = Types.Exact<{
  DistributionCenter: Types.Scalars['String'];
  OrderNumber: Types.Scalars['String'];
  NOSINumber: Types.Scalars['String'];
}>;

export type SearchBarcodeForOrderNumberQuery = { __typename?: 'Query' } & {
  findOrder?: Types.Maybe<
    Array<
      Types.Maybe<
        { __typename?: 'Order' } & Pick<
          Types.Order,
          'OrderNumber' | 'NOSINumber'
        > & {
            Status: { __typename?: 'OrderStatus' } & Pick<
              Types.OrderStatus,
              'Name'
            >;
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

export const FetchMobileContainerInfoByBarcodeDocument = gql`
  query fetchMobileContainerInfoByBarcode(
    $DistributionCenter: String!
    $BarcodeList: [String]!
  ) {
    findContainerList(
      DistributionCenter: $DistributionCenter
      BarcodeList: $BarcodeList
    ) {
      Warehouse
      Row
      Aisle
      Section
      Shelf
      ShelfDetail
      Barcode
      INVENTORies {
        InternalTrackingNumber
        Order {
          OrderNumber
          NOSINumber
          Status {
            Name
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchMobileContainerInfoByBarcodeGQL extends Apollo.Query<
  FetchMobileContainerInfoByBarcodeQuery,
  FetchMobileContainerInfoByBarcodeQueryVariables
> {
  document = FetchMobileContainerInfoByBarcodeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FindMobileContainerListInFixLocationDocument = gql`
  query findMobileContainerListInFixLocation(
    $DistributionCenter: String!
    $Warehouse: String!
    $Row: String!
    $Aisle: String!
    $Section: String!
    $Shelf: String!
    $ShelfDetail: String!
  ) {
    findContainer(
      DistributionCenter: $DistributionCenter
      Warehouse: $Warehouse
      Row: $Row
      Aisle: $Aisle
      Section: $Section
      Shelf: $Shelf
      ShelfDetail: $ShelfDetail
    ) {
      Barcode
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FindMobileContainerListInFixLocationGQL extends Apollo.Query<
  FindMobileContainerListInFixLocationQuery,
  FindMobileContainerListInFixLocationQueryVariables
> {
  document = FindMobileContainerListInFixLocationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SearchBarcodeForItnDocument = gql`
  query SearchBarcodeForITN($InternalTrackingNumber: String!) {
    findInventory(InternalTrackingNumber: $InternalTrackingNumber) {
      InternalTrackingNumber
      Container {
        Barcode
        Warehouse
        Row
        Aisle
        Section
        Shelf
        ShelfDetail
      }
      Order {
        OrderNumber
        NOSINumber
        Status {
          Name
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SearchBarcodeForItnGQL extends Apollo.Query<
  SearchBarcodeForItnQuery,
  SearchBarcodeForItnQueryVariables
> {
  document = SearchBarcodeForItnDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SearchBarcodeForOrderNumberDocument = gql`
  query SearchBarcodeForOrderNumber(
    $DistributionCenter: String!
    $OrderNumber: String!
    $NOSINumber: String!
  ) {
    findOrder(
      DistributionCenter: $DistributionCenter
      OrderNumber: $OrderNumber
      NOSINumber: $NOSINumber
    ) {
      OrderNumber
      NOSINumber
      Status {
        Name
      }
      INVENTORies {
        InternalTrackingNumber
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
  providedIn: 'root',
})
export class SearchBarcodeForOrderNumberGQL extends Apollo.Query<
  SearchBarcodeForOrderNumberQuery,
  SearchBarcodeForOrderNumberQueryVariables
> {
  document = SearchBarcodeForOrderNumberDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
