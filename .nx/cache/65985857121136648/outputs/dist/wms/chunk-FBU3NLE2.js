import{h as y}from"./chunk-MFWTQF6C.js";import{j as S,k as b}from"./chunk-M47XUQY5.js";import{c as N}from"./chunk-LCEARWCQ.js";import{f as a,h as p,i as d,j as s}from"./chunk-C55YZZU5.js";import{Aa as i,C as h,H as I,n as f,na as l,qa as u,va as o}from"./chunk-N7LPRJLK.js";var v=s`
    query fetchPrinterStation {
  fetchPrinterStation
}
    `,$=(()=>{let t=class t extends p{constructor(e){super(e),this.document=v,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),P=s`
    query verifyITNforQc($DistributionCenter: String!, $InventoryTrackingNumber: String!) {
  findInventory(
    Inventory: {DistributionCenter: $DistributionCenter, InventoryTrackingNumber: $InventoryTrackingNumber}
  ) {
    _id
    ParentITN
    ROHS
    DateCode
    Country {
      ISO2
    }
    ORDERLINEDETAILs {
      _id
      StatusID
      Quantity
      BinLocation
      WMSPriority
      OrderLine {
        OrderLineNumber
      }
      Order {
        _id
        DistributionCenter
        OrderNumber
        NOSINumber
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
    }
    Product {
      ProductCode {
        ProductCodeNumber
      }
      ProductTier
      PartNumber
    }
  }
}
    `,F=(()=>{let t=class t extends p{constructor(e){super(e),this.document=P,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),C=s`
    query fetchProductInfoFromMerp($ProductList: [String]!) {
  fetchProductInfoFromMerp(ProductList: $ProductList) {
    HazardMaterialLevel
    MICPartNumber
    UnitOfMeasure
  }
}
    `,q=(()=>{let t=class t extends p{constructor(e){super(e),this.document=C,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),T=s`
    query qcGlobalMessage($CustomerNumber: String!, $DistributionCenter: String!, $OrderNumber: String!, $OrderLineNumber: String!, $ProductCode: String!, $PartNumber: String!) {
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
    `,Q=(()=>{let t=class t extends p{constructor(e){super(e),this.document=T,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),j=s`
    mutation printITNLabel($InventoryTrackingNumber: String!, $Station: String!) {
  printITNLabel(
    InternalTrackingNumber: $InventoryTrackingNumber
    Station: $Station
  ) {
    success
    message
  }
}
    `,B=(()=>{let t=class t extends d{constructor(e){super(e),this.document=j,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),x=s`
    mutation holdQCOrder($OrderLineDetailID: Int!, $InventoryTrackingNumber: String!, $Status: String!, $Station: String!, $StatusID: Int!) {
  holdQCOrder(
    InternalTrackingNumber: $InventoryTrackingNumber
    Status: $Status
    Station: $Station
  ) {
    success
    message
  }
  updateOrderLineDetail(
    _id: $OrderLineDetailID
    OrderLineDetail: {StatusID: $StatusID}
  )
}
    `,H=(()=>{let t=class t extends d{constructor(e){super(e),this.document=x,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),A=s`
    mutation updateAfterQcVerify($Inventory: updateInventory!, $InventoryTrackingNumber: String!) {
  updateInventory(
    Inventory: $Inventory
    InventoryTrackingNumber: $InventoryTrackingNumber
  )
}
    `,U=(()=>{let t=class t extends d{constructor(e){super(e),this.document=A,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),V=s`
    query findNewAfterUpdateBin($InventoryTrackingNumber: String!, $DistributionCenter: String!) {
  findInventory(
    Inventory: {DistributionCenter: $DistributionCenter, InventoryTrackingNumber: $InventoryTrackingNumber}
  ) {
    _id
    ORDERLINEDETAILs {
      _id
      StatusID
      BinLocation
    }
  }
}
    `;var k=s`
    query verifyQCRepack($DistributionCenter: String!, $Barcode: String!, $OrderID: Int!) {
  findContainer(
    Container: {DistributionCenter: $DistributionCenter, Barcode: $Barcode}
  ) {
    _id
    Row
    ContainerTypeID
    INVENTORies {
      _id
      InventoryTrackingNumber
      ORDERLINEDETAILs {
        StatusID
        OrderID
      }
    }
  }
  findOrder(Order: {_id: $OrderID}) {
    _id
    ORDERLINEDETAILs {
      StatusID
      Inventory {
        InventoryTrackingNumber
        ContainerID
      }
    }
  }
}
    `,z=(()=>{let t=class t extends p{constructor(e){super(e),this.document=k,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),w=s`
    mutation updatStatusAfterRepack($OrderLineDetailID: Int!, $Status: Int!) {
  updateOrderLineDetail(
    OrderLineDetail: {StatusID: $Status}
    _id: $OrderLineDetailID
  )
}
    `,W=(()=>{let t=class t extends d{constructor(e){super(e),this.document=w,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),X=s`
    mutation cleanContainerFromPrevOrder($idList: [Int!]!, $Inventory: updateInventory!) {
  updateInventoryList(Inventory: $Inventory, idList: $idList)
}
    `;var L=s`
    mutation updateMerpAfterQcRepack($InventoryTrackingNumber: String!, $DateCode: String!, $CountryOfOrigin: String!, $ROHS: String!, $CountMethod: String!) {
  changeQCLineInfo(
    InternalTrackingNumber: $InventoryTrackingNumber
    DateCode: $DateCode
    CountryOfOrigin: $CountryOfOrigin
    ROHS: $ROHS
    CountMethod: $CountMethod
  ) {
    success
    message
  }
}
    `,J=(()=>{let t=class t extends d{constructor(e){super(e),this.document=L,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),R=s`
    mutation updateMerpForLastLineAfterQCRepack($OrderNumber: String!, $NOSINumber: String!, $Status: String!, $UserOrStatus: String) {
  updateMerpOrderStatus(
    OrderNumber: $OrderNumber
    NOSINumber: $NOSINumber
    Status: $Status
    UserOrStatus: $UserOrStatus
  ) {
    success
    message
  }
  clearMerpTote(OrderNumber: $OrderNumber, NOSINumber: $NOSINumber) {
    success
    message
  }
}
    `,K=(()=>{let t=class t extends d{constructor(e){super(e),this.document=R,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(a))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})();var tt=(()=>{let t=class t{constructor(e,n,c,m,O){this._find=e,this._itn=n,this._text=c,this._fetchPrinterStation=m,this._qrCode=O,this._printer=new f(null),this._printerStation=new f(null)}get printer$(){return this._printer.value?this._printer.asObservable():h(sessionStorage.getItem("printerName")).pipe(u(e=>{if(!e)throw new Error("Printer is not set!")}),l(e=>this._find.fetch({Name:e})),u(e=>{if(!e.data.findPrinters.length)throw new Error("Can't find a printer, Contact the help desk.")}),I(e=>{let n=e.data.findPrinters[0];return{Name:n.Name,Orientation:n.Orientation==="P"?"PORTRAIT":"LANDSCAPE",DPI:n.DPI||300,StationName:n.Orientation}}),u(e=>{this._printer.next(e)}))}setPrinter$(e){return this._printer.next(null),sessionStorage.removeItem("printerName"),this._find.fetch({Name:e}).pipe(u(n=>{if(!n.data.findPrinters.length)throw sessionStorage.removeItem("printerName"),new Error("Can't find this printer, Contact the help desk!")}),I(n=>{let c=n.data.findPrinters[0];return{Name:c.Name,Orientation:c.Orientation==="P"?"PORTRAIT":"LANDSCAPE",DPI:c.DPI||300,StationName:c.Orientation}}),u(n=>{this._printer.next(n),sessionStorage.setItem("printerName",n.Name)}))}printITN$(e,n,c){return this.printer$.pipe(l(m=>this._itn.fetch({ITN:e,PRODUCTCODE:n,PARTNUMBER:c,PRINTER:m.Name,DPI:String(m.DPI),ORIENTATION:m.Orientation},{fetchPolicy:"network-only"})))}printText$(e){return this.printer$.pipe(l(n=>this._text.fetch({PRINTER:n.Name,DPI:String(n.DPI),ORIENTATION:n.Orientation,LINE1:e[0],LINE2:e[1],LINE3:e[2],LINE4:e[3]},{fetchPolicy:"network-only"})))}printQRCode$(e){return this.printer$.pipe(l(n=>this._qrCode.fetch({PRINTER:n.Name,DPI:String(n.DPI),ORIENTATION:n.Orientation,TEXT:e},{fetchPolicy:"network-only"})))}get printerStation$(){return this._printerStation.value?this._printerStation.asObservable():this._fetchPrinterStation.fetch().pipe(I(e=>e.data.fetchPrinterStation),u(e=>{this._printerStation.next(e)}))}get printerStation(){return this._printerStation.value}};t.\u0275fac=function(n){return new(n||t)(i(N),i(S),i(b),i($),i(y))},t.\u0275prov=o({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})();export{$ as a,F as b,q as c,Q as d,B as e,H as f,U as g,z as h,W as i,J as j,K as k,tt as l};
