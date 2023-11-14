import{a as D}from"./chunk-CNRANGED.js";import{a as P}from"./chunk-I3G2JKLN.js";import{h as y}from"./chunk-LCEARWCQ.js";import{a as l}from"./chunk-PLQ7TNCQ.js";import{f as c,h as d,i as N,j as u}from"./chunk-C55YZZU5.js";import{Aa as o,H as s,I as m,a,b as f,n as I,na as h,qa as p,va as i}from"./chunk-N7LPRJLK.js";var $=u`
    query fetchInfoForPicking($InventoryTrackingNumber: String!, $DistributionCenter: String!) {
  findInventory(
    Inventory: {DistributionCenter: $DistributionCenter, InventoryTrackingNumber: $InventoryTrackingNumber}
  ) {
    _id
    QuantityOnHand
    ORDERLINEDETAILs {
      _id
      StatusID
      Quantity
      BinLocation
      WMSPriority
      Order {
        DistributionCenter
        OrderNumber
        NOSINumber
      }
    }
    Product {
      ProductCode {
        ProductCodeNumber
      }
      PartNumber
    }
  }
}
    `,b=(()=>{let t=class t extends d{constructor(r){super(r),this.document=$,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(o(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let n=t;return n})(),j=u`
    query fetchProductImgAndMessageFromMerp($ProductCode: String!, $PartNumber: String!, $ProductList: [String]!) {
  fetchProductInfoFromMerp(ProductList: $ProductList) {
    UnitOfMeasure
    MICPartNumber
  }
  fetchPartMessage(ProductCode: $ProductCode, PartNumber: $PartNumber) {
    comments
  }
}
    `,v=(()=>{let t=class t extends d{constructor(r){super(r),this.document=j,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(o(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let n=t;return n})(),M=u`
    mutation updateInventoryToUser($InventoryID: Int!, $ContainerID: Int!) {
  updateInventory(_id: $InventoryID, Inventory: {ContainerID: $ContainerID})
}
    `,g=(()=>{let t=class t extends N{constructor(r){super(r),this.document=M,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(o(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let n=t;return n})();var Q=(()=>{let t=class t{constructor(r,e,C,L,E){this._userC=r,this._fetchITNInfo=e,this._fetchProductInfo=C,this._eventLog=L,this._move=E,this._itnInfo=new I(null),this._samanageInfo=new I(null)}get itnInfo(){return this._itnInfo.value}get samanageInfo(){return this._samanageInfo.value}fetchItnInfo$(r){return this._fetchITNInfo.fetch({InventoryTrackingNumber:r,DistributionCenter:l.DistributionCenter}).pipe(p(e=>{if(!e.data.findInventory)throw new Error("Can't find this ITN in Inventory!");if(!e.data.findInventory.ORDERLINEDETAILs.length)throw new Error("Can't find this ITN in OrderLineDetail!");if(e.data.findInventory.ORDERLINEDETAILs[0].StatusID!==P.inPickQueue)throw new Error("This ITN is not in pick queue!")}),s(e=>e.data.findInventory),h(e=>(this._itnInfo.next({InventoryID:e._id,QuantityOnHand:e.QuantityOnHand,OrderLineDetailID:e.ORDERLINEDETAILs[0]._id,OrderNumber:e.ORDERLINEDETAILs[0].Order.OrderNumber,NOSINumber:e.ORDERLINEDETAILs[0].Order.NOSINumber,PartNumber:e.Product.PartNumber,ProductCode:e.Product.ProductCode.ProductCodeNumber,Quantity:e.ORDERLINEDETAILs[0].Quantity}),this._fetchProductInfo.fetch({PartNumber:this.itnInfo.PartNumber,ProductCode:this.itnInfo.ProductCode,ProductList:[`${this.itnInfo.ProductCode}${this.itnInfo.PartNumber}`]}))),s(e=>(this._itnInfo.next(f(a({},this.itnInfo),{MIC:e.data.fetchProductInfoFromMerp[0].MICPartNumber,Unit:e.data.fetchProductInfoFromMerp[0].UnitOfMeasure,GlobaleMessage:e.data.fetchPartMessage.comments})),!0)))}moveItnToUser$(){return m([this._eventLog.mutate(),this._move.mutate({ContainerID:this._userC.userContainerID,InventoryID:this.itnInfo.InventoryID})]).pipe(s(()=>!0))}updateSamanageInfo(r){this._samanageInfo.next(a(a({},this.samanageInfo),r))}sendUpdateTicketToSamanage$(){}};t.\u0275fac=function(e){return new(e||t)(o(D),o(b),o(v),o(y),o(g))},t.\u0275prov=i({token:t,factory:t.\u0275fac});let n=t;return n})();export{Q as a};
