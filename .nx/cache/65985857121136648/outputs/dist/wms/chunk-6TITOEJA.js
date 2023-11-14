import{f as c,h as a,i as u,j as s}from"./chunk-C55YZZU5.js";import{Aa as r,va as i}from"./chunk-N7LPRJLK.js";var l=s`
    query verifyITNForSorting($ITN: String!, $DC: String!) {
  findInventory(
    Inventory: {InventoryTrackingNumber: $ITN, DistributionCenter: $DC}
  ) {
    _id
    QuantityOnHand
    Container {
      _id
      ContainerType {
        IsMobile
      }
    }
    ORDERLINEDETAILs {
      StatusID
    }
    Product {
      _id
      ProductCode {
        ProductCodeNumber
      }
      Velocity
      PartNumber
      Autostore
    }
  }
}
    `,C=(()=>{let t=class t extends a{constructor(n){super(n),this.document=l,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(r(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})(),p=s`
    query verifyContainerForSorting($Barcode: String!, $DistributionCenter: String!) {
  findContainer(
    Container: {Barcode: $Barcode, DistributionCenter: $DistributionCenter}
  ) {
    _id
    ContainerTypeID
    ContainerType {
      IsMobile
    }
  }
}
    `,v=(()=>{let t=class t extends a{constructor(n){super(n),this.document=p,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(r(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})(),I=s`
    query fetchSuggetionLocationForSorting($ProductID: Int!, $limit: Int) {
  fetchSuggetionLocationForSorting(ProductID: $ProductID, limit: $limit) {
    Quantity
    Barcode
    Zone
  }
}
    `,S=(()=>{let t=class t extends a{constructor(n){super(n),this.document=I,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(r(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})(),f=s`
    query fetchITNInfoByContainerforStocking($Barcode: String!, $DC: String!) {
  findContainer(Container: {Barcode: $Barcode, DistributionCenter: $DC}) {
    _id
    ContainerType {
      IsMobile
    }
    INVENTORies {
      _id
      InventoryTrackingNumber
      QuantityOnHand
      NotFound
      Suspect
      Product {
        _id
        Autostore
      }
    }
  }
}
    `,D=(()=>{let t=class t extends a{constructor(n){super(n),this.document=f,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(r(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})(),y=s`
    query fetchInventoryInUserContainer($ContainerID: Int!) {
  findContainer(Container: {_id: $ContainerID}) {
    INVENTORies {
      QuantityOnHand
      InventoryTrackingNumber
    }
  }
}
    `,j=(()=>{let t=class t extends a{constructor(n){super(n),this.document=y,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(r(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})(),m=s`
    mutation updateInventoryAfterSorting($User: String!, $BinLocation: String!, $ITN: String!) {
  itnLocationChange(User: $User, ITN: $ITN, BinLocation: $BinLocation)
}
    `,x=(()=>{let t=class t extends u{constructor(n){super(n),this.document=m,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(r(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})(),h=s`
    mutation moveInventoryToContainerForStocking($User: String!, $ITN: String!, $BinLocation: String!) {
  itnLocationChange(User: $User, ITN: $ITN, BinLocation: $BinLocation)
}
    `,T=(()=>{let t=class t extends u{constructor(n){super(n),this.document=h,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(r(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})(),N=s`
    mutation updateNotFoundForStocking($ITNList: [String]!, $linkList: [insertInventorySuspectReason]!) {
  updateNotFoundForStocking(ITNList: $ITNList)
  insertInventorySuspectReason(linkList: $linkList)
}
    `,b=(()=>{let t=class t extends u{constructor(n){super(n),this.document=N,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(r(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})();export{C as a,v as b,S as c,D as d,j as e,x as f,T as g,b as h};
