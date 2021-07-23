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
