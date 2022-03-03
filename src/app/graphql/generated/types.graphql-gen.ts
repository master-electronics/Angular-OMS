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
  /**
   * Related tables:
   * one to many ORDERLINEDETAILs
   */
  _id: Scalars['Int'];
  ContainerTypeID: Scalars['Int'];
  Barcode: Scalars['String'];
  Zone?: Maybe<Scalars['Int']>;
  EquipmentID?: Maybe<Scalars['Int']>;
  DistributionCenter: Scalars['String'];
  Warehouse?: Maybe<Scalars['String']>;
  Row?: Maybe<Scalars['String']>;
  Aisle?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
  ParentContainerID?: Maybe<Scalars['Int']>;
  ParentContainer?: Maybe<Container>;
  CONTAINERs?: Maybe<Array<Maybe<Container>>>;
  ContainerType: ContainerType;
  Equipment?: Maybe<Equipment>;
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
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

export type HoldOnCounter = {
  __typename?: 'HoldOnCounter';
  ID: Scalars['Int'];
  User: Scalars['String'];
  detail: Array<Maybe<Scalars['Int']>>;
};

export type ItnInfoforPulling = {
  __typename?: 'ITNInfoforPulling';
  InventoryTrackingNumber: Scalars['String'];
  QuantityOnHand?: Maybe<Scalars['Float']>;
  WMSPriority?: Maybe<Scalars['Int']>;
  StatusID?: Maybe<Scalars['Int']>;
  Quantity?: Maybe<Scalars['Float']>;
  Zone?: Maybe<Scalars['Int']>;
  Barcode?: Maybe<Scalars['String']>;
};

export type Inventory = {
  __typename?: 'Inventory';
  _id: Scalars['Int'];
  DistributionCenter: Scalars['String'];
  InventoryTrackingNumber: Scalars['String'];
  QuantityOnHand: Scalars['Float'];
  CountryOfOrigin?: Maybe<Scalars['String']>;
  DateCode?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  ROHS?: Maybe<Scalars['Boolean']>;
  ProductID: Scalars['Int'];
  ContainerID: Scalars['Int'];
  Container: Container;
  Product: Product;
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  pickOrderForAgOut?: Maybe<OrderForAgOut>;
  deleteAndInsertRouteTable: Scalars['Boolean'];
  deleteOrderLineDetailByOrderNumber?: Maybe<Array<Maybe<OrderLineDetail>>>;
  updateOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  updateOrCreateProduct: Product;
  updateOrCreateInventory?: Maybe<Inventory>;
  holdQCOrder: Response;
  printITNLabel: Response;
  changeQCLineInfo: Response;
  updateMerpOrderStatus: Response;
  updateMerpWMSLog: Response;
  clearMerpTote: Response;
  updateMerpQCBin: Response;
  findOrCreateUserInfo?: Maybe<UserInfo>;
  findOrCreateOrderLineDetail?: Maybe<OrderLineDetail>;
  findOrCreateOrderLine: OrderLine;
  findOrCreateOrder: Order;
  findOrCreateProduct: Product;
  insertUserEventLogs?: Maybe<Array<Maybe<UserEventLog>>>;
  deleteOrderLineDetail?: Maybe<Array<Maybe<OrderLineDetail>>>;
  deleteOrderLine?: Maybe<Array<Maybe<OrderLine>>>;
  deleteOrder?: Maybe<Array<Maybe<Order>>>;
  updateUserInfo?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateContainer?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateContainerList?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLineDetail?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrderLine?: Maybe<Array<Maybe<Scalars['Int']>>>;
  updateOrder?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


export type MutationDeleteAndInsertRouteTableArgs = {
  lpnList: Array<Maybe<Scalars['String']>>;
};


export type MutationDeleteOrderLineDetailByOrderNumberArgs = {
  DistributionCenter: Scalars['String'];
  NOSINumber: Scalars['String'];
  OrderNumber: Scalars['String'];
  OrderLineNumber: Scalars['Int'];
  InternalTrackingNumber: Scalars['String'];
  BinLocation: Scalars['String'];
};


export type MutationUpdateOrCreateOrderLineDetailArgs = {
  OrderLineDetail: InsertOrderLineDetail;
};


export type MutationUpdateOrCreateProductArgs = {
  Product: InsertProduct;
};


export type MutationUpdateOrCreateInventoryArgs = {
  Inventory: InsertInventory;
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


export type MutationUpdateMerpQcBinArgs = {
  InternalTrackingNumber: Scalars['String'];
};


export type MutationFindOrCreateUserInfoArgs = {
  UserInfo: InsertUserInfo;
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


export type MutationFindOrCreateProductArgs = {
  Product: InsertProduct;
};


export type MutationInsertUserEventLogsArgs = {
  log: Array<Maybe<InsertUserEventLog>>;
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


export type MutationUpdateUserInfoArgs = {
  UserInfo: UpdateUserInfo;
  _id?: Maybe<Scalars['Int']>;
  Name?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['Int']>;
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
  isSelected: Scalars['Int'];
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
  Quantity?: Maybe<Scalars['Float']>;
  LastUpdated?: Maybe<Scalars['String']>;
  ProductID: Scalars['Int'];
  Product: Product;
  Order: Order;
  ORDERLINEDETAILs?: Maybe<Array<Maybe<OrderLineDetail>>>;
};

export type OrderLineDetail = {
  __typename?: 'OrderLineDetail';
  _id: Scalars['Int'];
  OrderLineID: Scalars['Int'];
  StatusID: Scalars['Int'];
  ContainerID: Scalars['Int'];
  Quantity: Scalars['Float'];
  LastUpdated?: Maybe<Scalars['String']>;
  OrderID: Scalars['Int'];
  BinLocation?: Maybe<Scalars['String']>;
  WMSPriority: Scalars['Int'];
  InventoryID?: Maybe<Scalars['Int']>;
  Inventory?: Maybe<Inventory>;
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

export type Product = {
  __typename?: 'Product';
  _id: Scalars['Int'];
  ProductCode: Scalars['String'];
  PartNumber: Scalars['String'];
  ORDERLINEs?: Maybe<Array<Maybe<OrderLine>>>;
  INVENTORies?: Maybe<Array<Maybe<Inventory>>>;
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
  countOrderItns: Scalars['Int'];
  findNextITNForPulling?: Maybe<ItnInfoforPulling>;
  fetchOrderView?: Maybe<Array<Maybe<OrderView>>>;
  fetchOrderLineDetailforWMSCount?: Maybe<Array<Maybe<OrderLineDetail>>>;
  fetchWMSStatusView?: Maybe<Array<Maybe<WmsStatusView>>>;
  fetchHoldOnCounter?: Maybe<Array<Maybe<HoldOnCounter>>>;
  fetchTaskCounter?: Maybe<Array<Maybe<TaskCounter>>>;
  fetchOrderTasktime?: Maybe<Array<Maybe<OrderTasktime>>>;
  findOrderByStatus?: Maybe<Array<Maybe<Order>>>;
  findUserEventLog?: Maybe<Array<Maybe<UserEventLog>>>;
  findUserInfo?: Maybe<Array<Maybe<UserInfo>>>;
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


export type QueryCountOrderItnsArgs = {
  LocationCode: Scalars['String'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
};


export type QueryFindNextItnForPullingArgs = {
  Zone?: Maybe<Scalars['Int']>;
  StrictPriority?: Maybe<Scalars['Boolean']>;
  PriorityCutoff?: Maybe<Scalars['Int']>;
};


export type QueryFetchOrderViewArgs = {
  filter?: Maybe<OrderViewFilter>;
};


export type QueryFetchOrderLineDetailforWmsCountArgs = {
  filter?: Maybe<SearchIntForWmsCount>;
};


export type QueryFetchHoldOnCounterArgs = {
  startDate: Scalars['String'];
  endDate: Scalars['String'];
};


export type QueryFetchTaskCounterArgs = {
  Module: Scalars['Int'];
  startDate: Scalars['String'];
  endDate: Scalars['String'];
};


export type QueryFetchOrderTasktimeArgs = {
  Order?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryFindOrderByStatusArgs = {
  PriorityPinkPaper?: Maybe<Scalars['Boolean']>;
  StatusID: Scalars['Int'];
};


export type QueryFindUserEventLogArgs = {
  UserEventLog: SearchUserEventLog;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  Module?: Maybe<Scalars['Int']>;
  endDate?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
};


export type QueryFindUserInfoArgs = {
  UserInfo?: Maybe<SearchUserInfo>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
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

export type UserEvent = {
  __typename?: 'UserEvent';
  _id: Scalars['String'];
  Event: Scalars['String'];
  Module: Scalars['String'];
  USEREVENTLOGs?: Maybe<Array<Maybe<UserEventLog>>>;
};

export type UserEventLog = {
  __typename?: 'UserEventLog';
  _id: Scalars['Int'];
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  UserID: Scalars['Int'];
  UserEventID: Scalars['Int'];
  DateTime: Scalars['String'];
  User: UserInfo;
  UserEvent: UserEvent;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  _id: Scalars['Int'];
  Name: Scalars['String'];
  Zone?: Maybe<Scalars['Int']>;
  StrictPriority?: Maybe<Scalars['Boolean']>;
  PriorityCutoff?: Maybe<Scalars['Int']>;
};

export type WmsStatusView = {
  __typename?: 'WMSStatusView';
  StatusID: Scalars['Int'];
  Status: Scalars['String'];
  ITN_Priority: Scalars['Int'];
  ITN_Total: Scalars['Int'];
  Line_Priority: Scalars['Int'];
  Line_Total: Scalars['Int'];
  Head_Priority: Scalars['Int'];
  Head_Total: Scalars['Int'];
};

export type InsertInventory = {
  DistributionCenter: Scalars['String'];
  InventoryTrackingNumber: Scalars['String'];
  QuantityOnHand: Scalars['Float'];
  CountryOfOrigin?: Maybe<Scalars['String']>;
  DateCode?: Maybe<Scalars['String']>;
  ParentITN?: Maybe<Scalars['String']>;
  ROHS?: Maybe<Scalars['Boolean']>;
  ProductID: Scalars['Int'];
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
  Quantity?: Maybe<Scalars['Float']>;
  ProductID: Scalars['Int'];
};

export type InsertOrderLineDetail = {
  OrderLineID: Scalars['Int'];
  StatusID: Scalars['Int'];
  ContainerID: Scalars['Int'];
  Quantity: Scalars['Float'];
  LastUpdated?: Maybe<Scalars['String']>;
  OrderID: Scalars['Int'];
  BinLocation?: Maybe<Scalars['String']>;
  WMSPriority: Scalars['Int'];
  InventoryID?: Maybe<Scalars['Int']>;
};

export type InsertProduct = {
  ProductCode: Scalars['String'];
  PartNumber: Scalars['String'];
};

export type InsertUserEventLog = {
  OrderNumber: Scalars['String'];
  NOSINumber: Scalars['String'];
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  UserID: Scalars['Int'];
  UserEventID: Scalars['Int'];
};

export type InsertUserInfo = {
  Name?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['Int']>;
  StrictPriority?: Maybe<Scalars['Boolean']>;
  PriorityCutoff?: Maybe<Scalars['Int']>;
};

export type OrderTasktime = {
  __typename?: 'orderTasktime';
  Order: Scalars['String'];
  qcFirst?: Maybe<Scalars['String']>;
  qcLast?: Maybe<Scalars['String']>;
  agIn?: Maybe<Scalars['String']>;
  agOut?: Maybe<Scalars['String']>;
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
  Priority?: Maybe<Scalars['Boolean']>;
  ShippingMethod?: Maybe<Scalars['String']>;
  Status?: Maybe<Scalars['String']>;
  StatusID?: Maybe<Scalars['Int']>;
};

export type Route_Table = {
  __typename?: 'route_table';
  lpn: Scalars['String'];
  dest: Scalars['Int'];
  dt: Scalars['String'];
};

export type SearchContainer = {
  _id?: Maybe<Scalars['Int']>;
  ContainerTypeID?: Maybe<Scalars['Int']>;
  Barcode?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['Int']>;
  EquipmentID?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Warehouse?: Maybe<Scalars['String']>;
  Row?: Maybe<Scalars['String']>;
  Aisle?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
  ParentContainerID?: Maybe<Scalars['Int']>;
};

export type SearchIntForWmsCount = {
  StatusID: Scalars['Int'];
  Priority?: Maybe<Scalars['Boolean']>;
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
  isSelected?: Maybe<Scalars['Int']>;
};

export type SearchOrderLine = {
  _id?: Maybe<Scalars['Int']>;
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  ProductID: Scalars['Int'];
};

export type SearchOrderLineDetail = {
  _id: Scalars['Int'];
  OrderLineID: Scalars['Int'];
  StatusID: Scalars['Int'];
  ContainerID: Scalars['Int'];
  Quantity: Scalars['Float'];
  OrderID: Scalars['Int'];
  BinLocation?: Maybe<Scalars['String']>;
  WMSPriority: Scalars['Int'];
  InventoryID?: Maybe<Scalars['Int']>;
};

export type SearchUserEventLog = {
  _id?: Maybe<Scalars['Int']>;
  OrderNumber?: Maybe<Scalars['String']>;
  NOSINumber?: Maybe<Scalars['String']>;
  InternalTrackingNumber?: Maybe<Scalars['String']>;
  Message?: Maybe<Scalars['String']>;
  UserID?: Maybe<Scalars['Int']>;
  UserEventID?: Maybe<Scalars['Int']>;
};

export type SearchUserInfo = {
  _id?: Maybe<Scalars['Int']>;
  Name?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['Int']>;
  StrictPriority?: Maybe<Scalars['Boolean']>;
  PriorityCutoff?: Maybe<Scalars['Int']>;
};

export type TaskCounter = {
  __typename?: 'taskCounter';
  ID: Scalars['Int'];
  User: Scalars['String'];
  taskCounter: Array<Maybe<Scalars['Int']>>;
};

export type UpdateContainer = {
  ContainerTypeID?: Maybe<Scalars['Int']>;
  Barcode?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['Int']>;
  EquipmentID?: Maybe<Scalars['Int']>;
  DistributionCenter?: Maybe<Scalars['String']>;
  Warehouse?: Maybe<Scalars['String']>;
  Row?: Maybe<Scalars['String']>;
  Aisle?: Maybe<Scalars['String']>;
  Section?: Maybe<Scalars['String']>;
  Shelf?: Maybe<Scalars['String']>;
  ShelfDetail?: Maybe<Scalars['String']>;
  ParentContainerID?: Maybe<Scalars['Int']>;
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
  isSelected?: Maybe<Scalars['Int']>;
};

export type UpdateOrderLine = {
  OrderID?: Maybe<Scalars['Int']>;
  OrderLineNumber?: Maybe<Scalars['Int']>;
  Quantity?: Maybe<Scalars['Float']>;
  ProductID?: Maybe<Scalars['Int']>;
};

export type UpdateOrderLineDetail = {
  OrderLineID?: Maybe<Scalars['Int']>;
  StatusID?: Maybe<Scalars['Int']>;
  ContainerID?: Maybe<Scalars['Int']>;
  Quantity?: Maybe<Scalars['Float']>;
  LastUpdated?: Maybe<Scalars['String']>;
  OrderID?: Maybe<Scalars['Int']>;
  BinLocation?: Maybe<Scalars['String']>;
  WMSPriority?: Maybe<Scalars['Int']>;
  InventoryID?: Maybe<Scalars['Int']>;
};

export type UpdateUserInfo = {
  Name?: Maybe<Scalars['String']>;
  Zone?: Maybe<Scalars['Int']>;
  StrictPriority?: Maybe<Scalars['Boolean']>;
  PriorityCutoff?: Maybe<Scalars['Int']>;
};
