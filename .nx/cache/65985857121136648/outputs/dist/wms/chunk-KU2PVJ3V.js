import{f as s,h as u,i as a,j as c}from"./chunk-C55YZZU5.js";import{Aa as n,va as o}from"./chunk-N7LPRJLK.js";var l=c`
    query verifyContainerForAggregationIn($DistributionCenter: String!, $Barcode: String!) {
  findContainer(
    Container: {DistributionCenter: $DistributionCenter, Barcode: $Barcode}
  ) {
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
    INVENTORies {
      _id
      InventoryTrackingNumber
      ParentITN
      Product {
        ProductCode {
          ProductCodeNumber
        }
        PartNumber
        ProductTier
      }
      ORDERLINEDETAILs {
        _id
        StatusID
        WMSPriority
        Quantity
        OrderID
        Order {
          OrderNumber
          NOSINumber
          DistributionCenter
          ShipmentMethod {
            _id
            ShippingMethod
            PriorityPinkPaper
          }
          Customer {
            CustomerNumber
            CustomerTier
          }
        }
        OrderLine {
          OrderLineNumber
        }
      }
    }
  }
}
    `,g=(()=>{let t=class t extends u{constructor(r){super(r),this.document=l,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),p=c`
    query fetchLocationAndOrderDetailForAgIn($OrderID: Int!) {
  findOrderLineDetails(OrderLineDetail: {OrderID: $OrderID}) {
    _id
    Quantity
    StatusID
    Inventory {
      InventoryTrackingNumber
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
    `,C=(()=>{let t=class t extends u{constructor(r){super(r),this.document=p,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),m=c`
    query countOrderItnsFromMerp($LocationCode: String!, $OrderNumber: String!, $NOSINumber: String!) {
  countOrderItns(
    LocationCode: $LocationCode
    OrderNumber: $OrderNumber
    NOSINumber: $NOSINumber
  )
}
    `,L=(()=>{let t=class t extends u{constructor(r){super(r),this.document=m,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),I=c`
    query fetchHazardMaterialLevel($ProductList: [String]!) {
  fetchProductInfoFromMerp(ProductList: $ProductList) {
    HazardMaterialLevel
  }
}
    `,j=(()=>{let t=class t extends u{constructor(r){super(r),this.document=I,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),O=c`
    mutation updateAfterAgOut($OrderID: Int!, $OrderLineDetail: updateOrderLineDetail!, $DistributionCenter: String!, $OrderNumber: String!, $NOSINumber: String!, $MerpStatus: String!, $UserOrStatus: String!, $FileKeyList: [String!]!, $ActionType: String!, $Action: String!, $ITNList: [InventoryUpdateForMerp]!, $toteList: [String]!) {
  updateOrderLineDetail(OrderID: $OrderID, OrderLineDetail: $OrderLineDetail)
  updateOrder(_id: $OrderID, Order: {isSelected: 0})
  deleteAndInsertRouteTable(lpnList: $toteList)
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
  changeItnListForMerp(ITNList: $ITNList)
  updateContainerList(
    BarcodeList: $toteList
    DistributionCenter: $DistributionCenter
    Container: {Warehouse: "10", Row: "CV", Aisle: null, Section: null, Shelf: null, ShelfDetail: null}
  )
}
    `,v=(()=>{let t=class t extends a{constructor(r){super(r),this.document=O,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),f=c`
    mutation updateStatusAfterAgIn($InventoryIDList: [Int]!, $StatusID: Int!) {
  updateOrderLineDetailList(
    InventoryIDList: $InventoryIDList
    OrderLineDetail: {StatusID: $StatusID}
  )
}
    `,x=(()=>{let t=class t extends a{constructor(r){super(r),this.document=f,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),S=c`
    mutation updateLocationAfterAgIn($ContainerID: Int!, $Container: updateContainer!) {
  updateContainer(_id: $ContainerID, Container: $Container)
}
    `,M=(()=>{let t=class t extends a{constructor(r){super(r),this.document=S,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),N=c`
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
    `,w=(()=>{let t=class t extends a{constructor(r){super(r),this.document=N,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),$=c`
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
    `,F=(()=>{let t=class t extends a{constructor(r){super(r),this.document=$,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),b=c`
    mutation pickOrderForAgOut {
  pickOrderForAgOut {
    OrderID
    OrderNumber
    NOSINumber
  }
}
    `,P=(()=>{let t=class t extends a{constructor(r){super(r),this.document=b,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),h=c`
    query verifyOrderForAgOut($DistributionCenter: String!, $OrderNumber: String!, $NOSINumber: String!) {
  findOrder(
    Order: {DistributionCenter: $DistributionCenter, OrderNumber: $OrderNumber, NOSINumber: $NOSINumber}
  ) {
    _id
    ORDERLINEDETAILs {
      StatusID
    }
  }
  countOrderItns(
    LocationCode: $DistributionCenter
    OrderNumber: $OrderNumber
    NOSINumber: $NOSINumber
  )
}
    `,T=(()=>{let t=class t extends u{constructor(r){super(r),this.document=h,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),D=c`
    query fetchContainerForAgoutPick($OrderID: Int) {
  findOrderLineDetails(OrderLineDetail: {OrderID: $OrderID}) {
    WMSPriority
    Quantity
    Order {
      OrderNumber
      NOSINumber
      DistributionCenter
      ShipmentMethod {
        _id
        ShippingMethod
        PriorityPinkPaper
      }
      Customer {
        CustomerNumber
        CustomerTier
      }
    }
    OrderLine {
      OrderLineNumber
    }
    Inventory {
      InventoryTrackingNumber
      ParentITN
      Container {
        Barcode
        Warehouse
        Row
        Aisle
        Section
        Shelf
        ShelfDetail
      }
      Product {
        ProductCode {
          ProductCodeNumber
        }
        PartNumber
        ProductTier
      }
    }
  }
}
    `,k=(()=>{let t=class t extends u{constructor(r){super(r),this.document=D,this.client="wmsNodejs"}};t.\u0275fac=function(i){return new(i||t)(n(s))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();export{g as a,C as b,L as c,j as d,v as e,x as f,M as g,w as h,F as i,P as j,T as k,k as l};
