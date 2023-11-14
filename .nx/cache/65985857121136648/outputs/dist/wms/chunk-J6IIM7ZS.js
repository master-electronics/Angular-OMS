import{f as s,h as a,i as l,j as n}from"./chunk-C55YZZU5.js";import{Aa as c,va as i}from"./chunk-N7LPRJLK.js";var d=n`
    query fetchOrderView($filter: orderViewFilter) {
  fetchOrderView(filter: $filter) {
    OrderNumber
    NOSINumber
    Status
    Priority
    ShippingMethod
    Unpicked
    Aggregated
    InProcess
  }
}
    `,O=(()=>{let e=class e extends a{constructor(r){super(r),this.document=d,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),p=n`
    query fetchOrderLineDetailforWMSCount($filter: searchINTForWMSCount) {
  fetchOrderLineDetailforWMSCount(filter: $filter) {
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
      Product {
        ProductCode {
          ProductCodeNumber
        }
        PartNumber
      }
    }
    Status {
      Name
    }
    Order {
      OrderNumber
      NOSINumber
    }
    Quantity
  }
}
    `,M=(()=>{let e=class e extends a{constructor(r){super(r),this.document=p,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),m=n`
    query fetchOrderDetailforitnView($Order: searchOrder!) {
  findOrder(Order: $Order) {
    OrderNumber
    NOSINumber
    ORDERLINEDETAILs {
      _id
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
        Product {
          ProductCode {
            ProductCodeNumber
          }
          PartNumber
        }
      }
      Status {
        Name
      }
      Quantity
    }
  }
}
    `,q=(()=>{let e=class e extends a{constructor(r){super(r),this.document=m,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),f=n`
    query fetchWMSStatusView {
  fetchWMSStatusView {
    StatusID
    Status
    ITN_Priority
    ITN_Total
    Line_Priority
    Line_Total
    Head_Priority
    Head_Total
  }
}
    `,F=(()=>{let e=class e extends a{constructor(r){super(r),this.document=f,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),I=n`
    query fetchUserInfo {
  findUserInfos {
    _id
    Name
  }
}
    `,E=(()=>{let e=class e extends a{constructor(r){super(r),this.document=I,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),N=n`
    query fetchUserEvents {
  findUserEvents {
    _id
    Module
    Event
  }
}
    `,R=(()=>{let e=class e extends a{constructor(r){super(r),this.document=N,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),h=n`
    query fetchUserEventLog($UserEventLog: searchUserEventLog!, $Modules: [Int], $startDate: String, $endDate: String, $limit: Int) {
  findUserEventLogs(
    UserEventLog: $UserEventLog
    Modules: $Modules
    startDate: $startDate
    endDate: $endDate
    limit: $limit
  ) {
    _id
    UserName
    UserEvent {
      Event
      Module
    }
    OrderNumber
    OrderLineNumber
    NOSINumber
    Message
    PartNumber
    ProductCode
    Quantity
    InventoryTrackingNumber
    DateTime
  }
}
    `,W=(()=>{let e=class e extends a{constructor(r){super(r),this.document=h,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),y=n`
    query fetchHoldOnCounter($startDate: String!, $endDate: String!) {
  fetchHoldOnCounter(startDate: $startDate, endDate: $endDate) {
    User
    detail
  }
}
    `,V=(()=>{let e=class e extends a{constructor(r){super(r),this.document=y,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),v=n`
    query fetchOrderTasktime($target: String, $limit: Int!) {
  fetchOrderTasktime(Order: $target, limit: $limit) {
    Order
    qcFirst
    qcLast
    agIn
    agOut
  }
}
    `,B=(()=>{let e=class e extends a{constructor(r){super(r),this.document=v,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),D=n`
    query findOrderByStatus($PriorityPinkPaper: Boolean, $StatusID: Int!) {
  findOrderByStatus(PriorityPinkPaper: $PriorityPinkPaper, StatusID: $StatusID) {
    OrderNumber
    NOSINumber
    Customer {
      CustomerNumber
    }
    ShipmentMethod {
      PriorityPinkPaper
      ShippingMethod
    }
  }
}
    `,H=(()=>{let e=class e extends a{constructor(r){super(r),this.document=D,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),T=n`
    query fetchITNLifecycle($startDate: String!, $endDate: String!) {
  fetchITNLifecycle(startDate: $startDate, endDate: $endDate) {
    OrderNumber
    NOSINumber
    OrderNOSI
    InventoryTrackingNumber
    after_InventoryTrackingNumber
    PartNumber
    ProductCode
    OrderLineNumber
    CustomerNumber
    CustomerTier
    ProductTier
    Zone
    WMSPriority
    Priority
    TrackingNumber
    releaseOrder
    releaseLine
    lineAllocation
    lineAllocationUser
    lineCancel
    orderCancel
    pickStart
    pickStartUser
    pickLocationScan
    pickITNScan
    pickQuantityEntered
    pickITNPrint
    pickDone
    pickDoneUser
    splitDone
    pickITNNF
    pickCartAssigned
    pickUserExit
    pickLabelCount
    pickLabelQuantity
    pickOverPick
    pickToteAssignment
    pickStatus15
    pickShortPick
    qcStart
    qcStartUser
    qcHold
    qcDone
    qcDoneUser
    qcOrderComplete
    qcStatus40
    qcStatus41
    agStart
    agStartUser
    agDone
    agDoneUser
    agRelocate
    agOrderComplete
    agInDone
    agOutStart
    pullingStart
    pullingCartSelected
    pullingDone
    pullingLocationSelected
    pullingNotFound
    dropoffStart
    dropoffLine
    dropoffUser
    dropoffDone
    dropoffCartSelected
    dropoffITNSkipped
    dropoffLocationSelected
    packStart
    packLine
    packLineUser
    packNewPackage
    packSupervisorCheck
    packReject
    packDone
    ParentITN
    Quantity
    shippingManifest
  }
}
    `,Z=(()=>{let e=class e extends a{constructor(r){super(r),this.document=T,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),S=n`
    query fetchITNLifecycleDrillDown($orderNumber: String!, $nosiNumber: String, $orderLineNumber: Int, $inventoryTrackingNumber: String) {
  fetchITNLifecycleDrillDown(
    orderNumber: $orderNumber
    nosiNumber: $nosiNumber
    orderLineNumber: $orderLineNumber
    inventoryTrackingNumber: $inventoryTrackingNumber
  ) {
    OrderNumber
    NOSINumber
    InventoryTrackingNumber
    Message
    UserName
    UserEventID
    Event
    Module
    DateTime
    PartNumber
    ProductCode
    OrderLineNumber
    CustomerNumber
    CustomerTier
    ProductTier
    Zone
    WMSPriority
    Priority
    TrackingNumber
    ParentITN
    DistributionCenter
    Quantity
    ShipmentMethod
    ShipmentMethodDescription
  }
}
    `,z=(()=>{let e=class e extends a{constructor(r){super(r),this.document=S,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),k=n`
    query fetchITNLifecycleDrillDownRows($orderNumber: String, $nosiNumber: String, $orderLineNumber: Int, $inventoryTrackingNumber: String) {
  fetchITNLifecycleDrillDownRows(
    orderNumber: $orderNumber
    nosiNumber: $nosiNumber
    orderLineNumber: $orderLineNumber
    inventoryTrackingNumber: $inventoryTrackingNumber
  ) {
    OrderNumber
    NOSINumber
    OrderNOSI
    DistributionCenter
    InventoryTrackingNumber
    after_InventoryTrackingNumber
    PartNumber
    ProductCode
    OrderLineNumber
    CustomerNumber
    CustomerTier
    ProductTier
    Zone
    WMSPriority
    Priority
    TrackingNumber
    releaseOrder
    releaseLine
    lineAllocation
    lineAllocationUser
    lineCancel
    orderCancel
    pickStart
    pickStartUser
    pickLocationScan
    pickITNScan
    pickQuantityEntered
    pickITNPrint
    pickDone
    pickDoneUser
    splitDone
    splitDoneUser
    pickITNNF
    pickCartAssigned
    pickUserExit
    pickLabelCount
    pickLabelQuantity
    pickOverPick
    pickToteAssignment
    pickStatus15
    pickShortPick
    qcStart
    qcStartUser
    qcHold
    qcDone
    qcDoneUser
    qcOrderComplete
    qcStatus40
    qcStatus41
    agStart
    agStartUser
    agDone
    agDoneUser
    agRelocate
    agOrderComplete
    agInDone
    agOutStart
    pullingStart
    pullingCartSelected
    pullingDone
    pullingLocationSelected
    pullingNotFound
    dropoffStart
    dropoffLine
    dropoffUser
    dropoffDone
    dropoffCartSelected
    dropoffITNSkipped
    dropoffLocationSelected
    packStart
    packLine
    packLineUser
    packNewPackage
    packSupervisorCheck
    packReject
    packDone
    ParentITN
    Quantity
    shippingManifest
    shipmentMethod
    shipmentMethodDescription
  }
}
    `,J=(()=>{let e=class e extends a{constructor(r){super(r),this.document=k,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),K=n`
    query fetchITNUserColumns($userId: String) {
  fetchITNUserColumns(userId: $userId) {
    _id
    SelectedColumns
    LowLevelLimit
    MediumLevelLimit
  }
}
    `;var b=n`
    query findITNTemplate($_id: Int) {
  findITNTemplate(_id: $_id) {
    _id
    UserID
    TemplateName
    SelectedColumns
    DefaultPagination
    DefaultTemplate
    ITNLEVELLIMITs {
      _id
      TemplateID
      EventName
      EventID
      LowLevelLimit
      MediumLevelLimit
    }
  }
}
    `,Q=(()=>{let e=class e extends a{constructor(r){super(r),this.document=b,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),$=n`
    query findITNTemplates($userId: Int) {
  findITNTemplates(UserID: $userId) {
    _id
    UserID
    TemplateName
    SelectedColumns
    DefaultTemplate
    ITNLEVELLIMITs {
      _id
      TemplateID
      EventName
      EventID
      LowLevelLimit
      MediumLevelLimit
    }
  }
}
    `,X=(()=>{let e=class e extends a{constructor(r){super(r),this.document=$,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),g=n`
    query findITNColumns($userId: Int) {
  findITNColumns(UserID: $userId) {
    _id
    name
    title
    dataName
    colSpan
    position
    width
    eventGroup
    eventName
    searchable
    drilldown
  }
}
    `,Y=(()=>{let e=class e extends a{constructor(r){super(r),this.document=g,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),G=n`
    mutation insert_ITNUserColumns($itnUserColumns: [insertITNUserColumnsInfo]!) {
  insertITNUserColumns(ITNUserColumns: $itnUserColumns) {
    UserID
    SelectedColumns
  }
}
    `;var _=n`
    mutation update_ITNUserColumns($itnUserColumns: [updateITNUserColumnsInfo]!, $_id: Int) {
  updateITNUserColumns(ITNUserColumns: $itnUserColumns, _id: $_id) {
    SelectedColumns
  }
}
    `;var ee=n`
    mutation insert_ITNUserLevels($itnUserLevels: [insertITNUserLevelsInfo]!) {
  insertITNUserLevels(ITNUserLevels: $itnUserLevels) {
    UserID
    LowLevelLimit
    MediumLevelLimit
  }
}
    `;var te=n`
    mutation update_ITNUserLevels($itnUserLevels: [updateITNUserLevelsInfo]!, $_id: Int) {
  updateITNUserLevels(ITNUserLevels: $itnUserLevels, _id: $_id) {
    LowLevelLimit
    MediumLevelLimit
  }
}
    `;var j=n`
    mutation update_ITNUserTemplate($_id: Int!, $templateName: String, $selectedColumns: String, $defaultPagination: Int, $defaultTemplate: Boolean) {
  updateITNUserTemplate(
    _id: $_id
    TemplateName: $templateName
    SelectedColumns: $selectedColumns
    DefaultPagination: $defaultPagination
    DefaultTemplate: $defaultTemplate
  ) {
    _id
  }
}
    `,re=(()=>{let e=class e extends l{constructor(r){super(r),this.document=j,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),L=n`
    mutation clear_ITNUserDefaultTemplate($userID: Int!) {
  clearITNUserDefaultTemplate(UserID: $userID) {
    _id
  }
}
    `,oe=(()=>{let e=class e extends l{constructor(r){super(r),this.document=L,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),x=n`
    mutation delete_ITNLevelLimit($templateID: Int!) {
  deleteITNLevelLimit(TemplateID: $templateID) {
    _id
  }
}
    `,ne=(()=>{let e=class e extends l{constructor(r){super(r),this.document=x,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),w=n`
    mutation delete_ITNUserTemplate($_id: Int!) {
  deleteITNUserTemplate(_id: $_id) {
    _id
  }
}
    `,ie=(()=>{let e=class e extends l{constructor(r){super(r),this.document=w,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),U=n`
    mutation insert_ITNLevelLimit($templateID: Int, $eventName: String, $eventID: Int, $lowLevelLimit: Int, $mediumLevelLimit: Int) {
  insertITNLevelLimit(
    TemplateID: $templateID
    EventName: $eventName
    EventID: $eventID
    LowLevelLimit: $lowLevelLimit
    MediumLevelLimit: $mediumLevelLimit
  ) {
    _id
  }
}
    `,ce=(()=>{let e=class e extends l{constructor(r){super(r),this.document=U,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})(),C=n`
    mutation insert_ITNUserTemplate($userID: Int, $templateName: String, $selectedColumns: String, $defaultTemplate: Boolean) {
  insertITNUserTemplate(
    UserID: $userID
    TemplateName: $templateName
    SelectedColumns: $selectedColumns
    DefaultTemplate: $defaultTemplate
  ) {
    _id
  }
}
    `,se=(()=>{let e=class e extends l{constructor(r){super(r),this.document=C,this.client="wmsNodejs"}};e.\u0275fac=function(o){return new(o||e)(c(s))},e.\u0275prov=i({token:e,factory:e.\u0275fac,providedIn:"root"});let t=e;return t})();export{O as a,M as b,q as c,F as d,E as e,R as f,W as g,V as h,B as i,H as j,Z as k,z as l,J as m,Q as n,X as o,Y as p,re as q,oe as r,ne as s,ie as t,ce as u,se as v};
