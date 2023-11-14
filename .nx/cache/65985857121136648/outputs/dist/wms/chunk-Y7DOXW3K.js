import{f as c,h as a,i as u,j as r}from"./chunk-C55YZZU5.js";import{Aa as s,va as i}from"./chunk-N7LPRJLK.js";var l=r`
    mutation verifyCartAndUpdate($Container: searchContainer!, $UserID: Int!) {
  updateUserCart(Container: $Container, UserID: $UserID) {
    _id
  }
}
    `,j=(()=>{let t=class t extends u{constructor(n){super(n),this.document=l,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),p=r`
    mutation verifyCartAndUpdateForDropOff($Container: searchContainer!, $UserID: Int!) {
  updateUserCartForDropOff(Container: $Container, UserID: $UserID) {
    _id
  }
}
    `,g=(()=>{let t=class t extends u{constructor(n){super(n),this.document=p,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),f=r`
    query verifyPositionBarcodeForPulling($Container: searchContainer!) {
  findContainer(Container: $Container) {
    _id
  }
}
    `,A=(()=>{let t=class t extends a{constructor(n){super(n),this.document=f,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),I=r`
    query fetchPickingSettings($UserInfo: searchUserInfo!) {
  findUserInfo(UserInfo: $UserInfo) {
    StrictPriority
    PriorityCutoff
    CartID
  }
}
    `,U=(()=>{let t=class t extends a{constructor(n){super(n),this.document=I,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),y=r`
    query findNextITNForPulling($Zone: Int!, $StrictPriority: Boolean!, $PriorityCutoff: Int!, $Barcode: String!) {
  findNextITNForPulling(
    Zone: $Zone
    StrictPriority: $StrictPriority
    PriorityCutoff: $PriorityCutoff
    Barcode: $Barcode
  ) {
    InventoryID
    InventoryTrackingNumber
    OrderNumber
    NOSINumber
    Barcode
  }
}
    `,N=(()=>{let t=class t extends a{constructor(n){super(n),this.document=y,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),m=r`
    mutation updateAfterPulling($OrderLineDetail: updateOrderLineDetail!, $Inventory: updateInventory!, $InventoryID: Int!, $log: [insertUserEventLog]!) {
  updateOrderLineDetail(
    OrderLineDetail: $OrderLineDetail
    InventoryID: $InventoryID
  )
  updateInventory(_id: $InventoryID, Inventory: $Inventory)
  insertUserEventLogs(log: $log) {
    _id
  }
}
    `,w=(()=>{let t=class t extends u{constructor(n){super(n),this.document=m,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),v=r`
    mutation updatePullingNotFound($OrderLineDetail: updateOrderLineDetail!, $InventoryID: Int!, $log: [insertUserEventLog]!) {
  updateOrderLineDetail(
    OrderLineDetail: $OrderLineDetail
    InventoryID: $InventoryID
  )
  insertUserEventLogs(log: $log) {
    _id
  }
}
    `,O=(()=>{let t=class t extends u{constructor(n){super(n),this.document=v,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),h=r`
    query findITNsInCartForDropOff($ContainerID: Int!) {
  findInventorys(Inventory: {ContainerID: $ContainerID}) {
    InventoryTrackingNumber
    ORDERLINEDETAILs {
      _id
      Order {
        OrderNumber
        NOSINumber
      }
    }
  }
}
    `,b=(()=>{let t=class t extends a{constructor(n){super(n),this.document=h,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),D=r`
    mutation updateAfterDropOff($Inventory: updateInventory!, $ContainerID: Int!, $UserID: Int!, $UserInfo: updateUserInfo!, $log: [insertUserEventLog]!) {
  updateInventory(Inventory: $Inventory, ContainerID: $ContainerID)
  updateUserInfo(UserInfo: $UserInfo, _id: $UserID)
  insertUserEventLogs(log: $log) {
    _id
  }
}
    `,k=(()=>{let t=class t extends u{constructor(n){super(n),this.document=D,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),$=r`
    query findContainer($Container: searchContainer!) {
  findContainer(Container: $Container) {
    _id
  }
}
    `,F=(()=>{let t=class t extends a{constructor(n){super(n),this.document=$,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),P=r`
    query fetchPickingCalendarSettings {
  fetchPickingCalendarSettings
}
    `;var S=r`
    mutation updatePickingCalendarSettings($events: String) {
  updatePickingCalendarSettings(events: $events)
}
    `;export{j as a,g as b,A as c,U as d,N as e,w as f,O as g,b as h,k as i,F as j};
