import{f as c,h as u,i as a,j as s}from"./chunk-C55YZZU5.js";import{Aa as i,va as r}from"./chunk-N7LPRJLK.js";var l=s`
    query verifyASNLocation($barcode: String, $container: searchContainer, $statusList: [String]) {
  findContainer(Container: $container) {
    _id
  }
  verifyASNLocationNotInProcess(Barcode: $barcode, StatusList: $statusList) {
    _id
  }
  verifyASNLocation(Barcode: $barcode) {
    InventoryTrackingNumber
  }
}
    `,B=(()=>{let t=class t extends u{constructor(o){super(o),this.document=l,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),p=s`
    query verifyITNForASN($ITN: String!, $DC: String!) {
  findInventory(
    Inventory: {InventoryTrackingNumber: $ITN, DistributionCenter: $DC}
  ) {
    _id
  }
}
    `,q=(()=>{let t=class t extends u{constructor(o){super(o),this.document=p,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),f=s`
    query fetchASNInventory($container: searchContainer) {
  findContainer(Container: $container) {
    _id
    INVENTORies {
      _id
      DistributionCenter
      InventoryTrackingNumber
      DateCode
      QuantityOnHand
      Product {
        _id
        PartNumber
        UOM
        ProductCode {
          ProductCodeNumber
        }
        LastAutostoreSync
      }
    }
  }
}
    `,O=(()=>{let t=class t extends u{constructor(o){super(o),this.document=f,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),h=s`
    query verifyASNLocationCreate($container: searchContainer) {
  findContainer(Container: $container) {
    _id
    Barcode
    ContainerType {
      IsMobile
    }
  }
}
    `,E=(()=>{let t=class t extends u{constructor(o){super(o),this.document=h,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),m=s`
    query verifyASNLocationDropOff($container: searchContainer) {
  findContainer(Container: $container) {
    _id
    Barcode
    ContainerType {
      IsMobile
    }
  }
}
    `,L=(()=>{let t=class t extends u{constructor(o){super(o),this.document=m,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),I=s`
    query verifyASNLocationStatus($asn: autostoreAsnHeader) {
  verifyASNLocationStatus(ASN: $asn) {
    _id
    tuId
  }
}
    `,U=(()=>{let t=class t extends u{constructor(o){super(o),this.document=I,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),y=s`
    query findProduct($product: searchProduct) {
  findProduct(Product: $product) {
    _id
    ProductCode {
      ProductCodeNumber
    }
    PartNumber
    LastAutostoreSync
    Description
    Velocity
    UOM
    MICPartNumber
  }
}
    `,H=(()=>{let t=class t extends u{constructor(o){super(o),this.document=y,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),A=s`
    query printQRCodeLabel($PRINTER: String!, $DPI: String!, $ORIENTATION: String!, $TEXT: String!) {
  printQRCodeLabel(
    PRINTER: $PRINTER
    DPI: $DPI
    ORIENTATION: $ORIENTATION
    TEXT: $TEXT
  )
}
    `,X=(()=>{let t=class t extends u{constructor(o){super(o),this.document=A,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),$=s`
    query fetchASNRejectionReasons {
  fetchASNRejectionReasons {
    _id
    Reason
    Global
  }
}
    `,V=(()=>{let t=class t extends u{constructor(o){super(o),this.document=$,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),N=s`
    mutation itnLocationChange($user: String!, $itn: String!, $binLocation: String!) {
  itnLocationChange(User: $user, ITN: $itn, BinLocation: $binLocation)
}
    `,W=(()=>{let t=class t extends a{constructor(o){super(o),this.document=N,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),j=s`
    mutation itnChange($user: String!, $itn: String!, $binLocation: String!, $boundForAutostore: String) {
  itnChange(
    User: $user
    ITN: $itn
    BinLocation: $binLocation
    BoundForAutostore: $boundForAutostore
  )
}
    `,z=(()=>{let t=class t extends a{constructor(o){super(o),this.document=j,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),S=s`
    mutation clearSuspect($user: String!, $itn: String!, $binLocation: String!, $suspect: String) {
  itnChange(User: $user, ITN: $itn, BinLocation: $binLocation, Suspect: $suspect)
}
    `,J=(()=>{let t=class t extends a{constructor(o){super(o),this.document=S,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),v=s`
    mutation updateProduct($product: updateProduct!) {
  updateProduct(Product: $product) {
    LastUpdated
  }
}
    `,K=(()=>{let t=class t extends a{constructor(o){super(o),this.document=v,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),x=s`
    query findASNReplenishmentInventory($barcode: String) {
  findASNReplenishmentInventory(Barcode: $barcode) {
    _id
    InventoryID
    ProductID
    Status
    Barcode
    Warehouse
    Row
    Aisle
    Section
    Shelf
    ShelfDetail
    InventoryTrackingNumber
  }
}
    `,Y=(()=>{let t=class t extends u{constructor(o){super(o),this.document=x,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),b=s`
    query findASNByITN($itn: String) {
  findASNByITN(ITN: $itn) {
    _id
  }
}
    `,Z=(()=>{let t=class t extends u{constructor(o){super(o),this.document=b,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),D=s`
    mutation insertAutostoreASN($asn: autostoreAsnHeader) {
  insertAutostoreASN(ASN: $asn) {
    _id
  }
}
    `,Q=(()=>{let t=class t extends a{constructor(o){super(o),this.document=D,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),w=s`
    mutation moveInventoryToContainerForASN($ITN: String!, $DC: String!, $ContainerID: Int!, $boundForAutostore: Boolean, $suspect: Boolean, $suspectReason: Int) {
  updateASNInventory(
    InventoryTrackingNumber: $ITN
    DistributionCenter: $DC
    ContainerID: $ContainerID
    Suspect: $suspect
    SuspectReasonID: $suspectReason
    BoundForAutostore: $boundForAutostore
  )
}
    `,G=(()=>{let t=class t extends a{constructor(o){super(o),this.document=w,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),g=s`
    mutation updateAutostoreASN($asn: autostoreAsnHeader, $asnid: Int) {
  updateAutostoreASN(ASN: $asn, ASNID: $asnid) {
    _id
  }
}
    `,_=(()=>{let t=class t extends a{constructor(o){super(o),this.document=g,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),C=s`
    mutation updateAutostoreMessage($autostoreMessage: autostoreMessage, $id: Int) {
  updateAutostoreMessage(AutostoreMessage: $autostoreMessage, _id: $id) {
    TypeID
  }
}
    `,tt=(()=>{let t=class t extends a{constructor(o){super(o),this.document=C,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),T=s`
    mutation updateProductLastSync($product: updateProduct) {
  updateProductLastSync(Product: $product) {
    LastAutostoreSync
  }
}
    `,et=(()=>{let t=class t extends a{constructor(o){super(o),this.document=T,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),F=s`
    mutation updateASNReplenishmentItem($replenishmentItem: asnReplenishmentItem) {
  updateASNReplenishmentItem(ReplenishmentItem: $replenishmentItem) {
    _id
    Status
  }
}
    `,ot=(()=>{let t=class t extends a{constructor(o){super(o),this.document=F,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),R=s`
    mutation updateASNParentContainer($container: updateContainer!, $id: Int) {
  updateContainer(Container: $container, _id: $id)
}
    `,nt=(()=>{let t=class t extends a{constructor(o){super(o),this.document=R,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),k=s`
    mutation globalASNRejection($inventoryID: Int) {
  globalASNRejection(InventoryID: $inventoryID) {
    _id
    InventoryID
    Status
    Barcode
    Warehouse
    Row
    Aisle
    Section
    Shelf
    ShelfDetail
    InventoryTrackingNumber
  }
}
    `,rt=(()=>{let t=class t extends a{constructor(o){super(o),this.document=k,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(i(c))},t.\u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();export{B as a,q as b,O as c,E as d,L as e,U as f,H as g,X as h,V as i,W as j,z as k,J as l,K as m,Y as n,Z as o,Q as p,G as q,_ as r,tt as s,et as t,ot as u,nt as v,rt as w};
