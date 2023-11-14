import{f as s,h as u,i as a,j as n}from"./chunk-C55YZZU5.js";import{Aa as c,va as i}from"./chunk-N7LPRJLK.js";var p=n`
    query checkReceiptHeader($id: Int!) {
  findReceiptH(ReceiptH: {_id: $id}) {
    _id
  }
}
    `,j=(()=>{let t=class t extends u{constructor(r){super(r),this.document=p,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),l=n`
    mutation generateReceiptForReceiving($PurchaseOrderNumber: String!, $LineNumber: Int!, $Quantity: Float!, $OverReceipt: Boolean) {
  generateReceiptForReceiving(
    PurchaseOrderNumber: $PurchaseOrderNumber
    LineNumber: $LineNumber
    Quantity: $Quantity
    OverReceipt: $OverReceipt
  )
}
    `,g=(()=>{let t=class t extends a{constructor(r){super(r),this.document=l,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),I=n`
    query findReceiptHeaderList($PartNumber: String, $VendorNumber: String) {
  findReceiptInfoByPartorVendor(
    PartNumber: $PartNumber
    VendorNumber: $VendorNumber
  ) {
    _id
    VendorName
  }
}
    `,A=(()=>{let t=class t extends u{constructor(r){super(r),this.document=I,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),m=n`
    query fetchPurchaseOrderInfo($PurchaseOrderNumber: String, $DistributionCenter: String) {
  findPurchaseOrderH(
    PurchaseOrder: {DistributionCenter: $DistributionCenter, PurchaseOrderNumber: $PurchaseOrderNumber}
  ) {
    _id
    Vendor {
      VendorName
    }
    PURCHASEORDERLs {
      LineNumber
      DueDate
      QuantityReceived
      QuantityOnOrder
      Product {
        PartNumber
        ProductCode {
          ProductCodeNumber
        }
      }
    }
  }
}
    `,E=(()=>{let t=class t extends u{constructor(r){super(r),this.document=m,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),f=n`
    query findReceiptHeaderForReceiving($ReceiptHID: Int!, $statusID: Int!) {
  findReceiptInfoByIdAndStatus(ReceiptHID: $ReceiptHID, statusID: $statusID) {
    _id
    RECEIPTLs {
      _id
      ExpectedQuantity
      DateCode
      ROHS
      LineNumber
      ProductID
      CountryID
      Country {
        ISO3
      }
      Product {
        PartNumber
        ProductCode {
          ProductCodeNumber
        }
      }
      RECEIPTLDs {
        _id
        ReceiptStatus {
          Name
        }
        PurchaseOrderL {
          LineNumber
          QuantityOnOrder
          QuantityReceived
          UnitOfMeasure
          PurchaseOrderH {
            PurchaseOrderNumber
          }
        }
      }
    }
  }
}
    `,S=(()=>{let t=class t extends u{constructor(r){super(r),this.document=f,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),N=n`
    query fetchReceiptForOverReceiving($PurchaseOrder: String!) {
  findPurchaseOrderH(PurchaseOrder: {PurchaseOrderNumber: $PurchaseOrder}) {
    _id
    PURCHASEORDERLs {
      LineNumber
      QuantityOnOrder
      QuantityReceived
      UnitOfMeasure
      RECEIPTLDs {
        _id
        ReceiptStatus {
          Name
        }
        ReceiptL {
          _id
          ReceiptHID
          ExpectedQuantity
          DateCode
          ROHS
          LineNumber
          ProductID
          CountryID
          Country {
            ISO3
          }
          Product {
            PartNumber
            ProductCode {
              ProductCodeNumber
            }
          }
        }
      }
    }
  }
}
    `,T=(()=>{let t=class t extends u{constructor(r){super(r),this.document=N,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),$=n`
    query fetchProductInfoForReceiving($ProductCode: String!, $PartNumber: String!) {
  fetchProductMICFromMerp(ProductCode: $ProductCode, PartNumber: $PartNumber)
  fetchPartMessage(ProductCode: $ProductCode, PartNumber: $PartNumber) {
    comments
  }
}
    `,L=(()=>{let t=class t extends u{constructor(r){super(r),this.document=$,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),w=n`
    query findPartForReceiving($PartNumber: String!) {
  findProducts(Product: {PartNumber: $PartNumber}) {
    _id
    PartNumber
    ProductCode {
      ProductCodeNumber
    }
  }
}
    `;var y=n`
    mutation OverReceivingUpdateReceiptL($_id: Int!, $ExpectedQuantity: Float!) {
  updateReceiptLsByID(
    ReceiptL: {ExpectedQuantity: $ExpectedQuantity, OverReceiving: true}
    idList: [$_id]
  )
}
    `,F=(()=>{let t=class t extends a{constructor(r){super(r),this.document=y,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),h=n`
    mutation ReceivingUpdateReceiptL($idList: [Int]!, $CountryID: Int!, $DateCode: String, $ROHS: Boolean!) {
  updateReceiptLsByID(
    ReceiptL: {CountryID: $CountryID, DateCode: $DateCode, ROHS: $ROHS}
    idList: $idList
  )
}
    `,k=(()=>{let t=class t extends a{constructor(r){super(r),this.document=h,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),R=n`
    query printReceivingITNLabel($PRINTER: String!, $ITN: String!, $PRODUCTCODE: String!, $PARTNUMBER: String!, $DPI: String!, $ORIENTATION: String!) {
  printReceivingITNLabel(
    PRINTER: $PRINTER
    ITN: $ITN
    DPI: $DPI
    PRODUCTCODE: $PRODUCTCODE
    PARTNUMBER: $PARTNUMBER
    ORIENTATION: $ORIENTATION
  )
}
    `,H=(()=>{let t=class t extends u{constructor(r){super(r),this.document=R,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),P=n`
    query printTextLabel($PRINTER: String!, $DPI: String!, $ORIENTATION: String!, $LINE1: String!, $LINE2: String!, $LINE3: String!, $LINE4: String!) {
  printTextLabel(
    PRINTER: $PRINTER
    DPI: $DPI
    ORIENTATION: $ORIENTATION
    LINE1: $LINE1
    LINE2: $LINE2
    LINE3: $LINE3
    LINE4: $LINE4
  )
}
    `,M=(()=>{let t=class t extends u{constructor(r){super(r),this.document=P,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),D=n`
    mutation updateAfterReceiving($ITNList: [ITNAndQuantity]!, $Inventory: updateInventory!, $info: InventoryForMerp!, $ReceiptLID: Int!) {
  updateReceiptLD(ReceiptLID: $ReceiptLID, ReceiptLD: {ReceiptStatusID: 20})
  createInventoryFromOMS(ITNList: $ITNList, Inventory: $Inventory, info: $info)
}
    `,B=(()=>{let t=class t extends a{constructor(r){super(r),this.document=D,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),b=n`
    query checkBinLocation($Barcode: String!, $DistributionCenter: String!) {
  findContainer(
    Container: {DistributionCenter: $DistributionCenter, Barcode: $Barcode}
  ) {
    _id
    Barcode
  }
}
    `,U=(()=>{let t=class t extends u{constructor(r){super(r),this.document=b,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),v=n`
    mutation suspectInventory($ITN: String!, $DC: String!, $reasonIDList: [Int]!) {
  suspectInventory(
    DistributionCenter: $DC
    InventoryTrackingNumber: $ITN
    reasonIDList: $reasonIDList
  )
}
    `,q=(()=>{let t=class t extends a{constructor(r){super(r),this.document=v,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),O=n`
    mutation clearSuspectInventory($ITN: String!, $DC: String!) {
  clearSuspectInventory(InventoryTrackingNumber: $ITN, DistributionCenter: $DC)
}
    `,Q=(()=>{let t=class t extends a{constructor(r){super(r),this.document=O,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(c(s))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();export{j as a,g as b,A as c,E as d,S as e,T as f,L as g,F as h,k as i,H as j,M as k,B as l,U as m,q as n,Q as o};
