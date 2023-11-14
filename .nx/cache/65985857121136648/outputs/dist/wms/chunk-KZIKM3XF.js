import{l as g}from"./chunk-FBU3NLE2.js";import{a as v}from"./chunk-YPJKXAYS.js";import{a as u}from"./chunk-I3G2JKLN.js";import{i as L}from"./chunk-LCEARWCQ.js";import{a as y}from"./chunk-4AGTE6D3.js";import{a as p}from"./chunk-PLQ7TNCQ.js";import{f as d,h as l,i as N,j as f}from"./chunk-C55YZZU5.js";import{Aa as r,H as h,n as s,na as c,qa as m,va as a}from"./chunk-N7LPRJLK.js";var S=f`
    query verifyITNForSeparate($ITN: String!, $DC: String!) {
  findInventory(
    Inventory: {InventoryTrackingNumber: $ITN, DistributionCenter: $DC}
  ) {
    _id
    QuantityOnHand
    ORDERLINEDETAILs {
      StatusID
    }
    Product {
      PartNumber
      ProductCode {
        ProductCodeNumber
      }
    }
  }
}
    `,T=(()=>{let n=class n extends l{constructor(t){super(t),this.document=S,this.client="wmsNodejs"}};n.\u0275fac=function(i){return new(i||n)(r(d))},n.\u0275prov=a({token:n,factory:n.\u0275fac,providedIn:"root"});let e=n;return e})(),C=f`
    mutation ITNSplitAndPrintLabels($QuantityList: [Float]!, $PRINTER: String!, $DPI: String!, $ORIENTATION: String!, $PRODUCTCODE: String!, $PARTNUMBER: String!, $ITN: String!, $User: String!) {
  ITNSplitAndPrintLabels(
    QuantityList: $QuantityList
    PRINTER: $PRINTER
    DPI: $DPI
    ORIENTATION: $ORIENTATION
    PRODUCTCODE: $PRODUCTCODE
    PARTNUMBER: $PARTNUMBER
    ITN: $ITN
    User: $User
  )
}
    `,P=(()=>{let n=class n extends N{constructor(t){super(t),this.document=C,this.client="wmsNodejs"}};n.\u0275fac=function(i){return new(i||n)(r(d))},n.\u0275prov=a({token:n,factory:n.\u0275fac,providedIn:"root"});let e=n;return e})();var q=(()=>{let n=class n{constructor(t,i,o,I,E,D){this._itn=t,this._separate=i,this._printer=o,this._insertLog=I,this._eventLog=E,this._userInfo=D,this._itnInfo=new s(null),this._quantityList=new s(null),this._newItnList=new s(null)}get itnInfo(){return this._itnInfo.value}changeitnInfo(t){this._itnInfo.next(t)}get quantityList(){return this._quantityList.value}changeQuantityList(t){this._quantityList.next(t)}get newItnList(){return this._newItnList.value}changeItnList(t){this._newItnList.next(t)}resetitnInfo(){this._itnInfo.next(null),this._newItnList.next(null),this._eventLog.initEventLog(null)}verifyItn(t){return this._itn.fetch({ITN:t,DC:p.DistributionCenter}).pipe(m(i=>{if(!i.data.findInventory?._id)throw new Error("Can't find this ITN!");if(!i.data.findInventory?.QuantityOnHand)throw new Error("Can't find the Quantity of ITN!");if(i.data.findInventory?.QuantityOnHand===1)throw new Error("This ITN only has 1 quantity on hand!");if(i.data.findInventory.ORDERLINEDETAILs.length&&i.data.findInventory.ORDERLINEDETAILs[0].StatusID!==u.pickComplete_ID)throw new Error("Can't split this ITN!")}),c(i=>{let o={UserName:this._userInfo.userName,UserEventID:u.Event_Stocking_SortingStart,InventoryTrackingNumber:t,Quantity:i.data.findInventory.QuantityOnHand};return this._eventLog.initEventLog({UserName:this._userInfo.userName,EventTypeID:u.Event_Stocking_SortingStart,Log:JSON.stringify({InventoryTrackingNumber:t,QuantityOnHand:i.data.findInventory.QuantityOnHand})}),this.changeitnInfo({Quantity:i.data.findInventory.QuantityOnHand,ITN:t,PartNumber:i.data.findInventory.Product.PartNumber,ProductCode:i.data.findInventory.Product.ProductCode.ProductCodeNumber}),this._insertLog.mutate({oldLogs:o,eventLogs:this._eventLog.eventLog})}))}separateITN$(){return this._printer.printer$.pipe(c(t=>this._separate.mutate({ITN:this.itnInfo.ITN,QuantityList:this.quantityList,PRINTER:t.Name,DPI:t.DPI.toString(),ORIENTATION:t.Orientation,PARTNUMBER:this.itnInfo.PartNumber,PRODUCTCODE:this.itnInfo.ProductCode,User:this._userInfo.userName})),h(t=>{let i=t.data.ITNSplitAndPrintLabels.map((o,I)=>({ITN:o,Quantity:this.quantityList[I],PartNumber:this.itnInfo.PartNumber,ProductCode:this.itnInfo.ProductCode}));return this._newItnList.next(i),!0}))}};n.\u0275fac=function(i){return new(i||n)(r(T),r(P),r(g),r(L),r(v),r(y))},n.\u0275prov=a({token:n,factory:n.\u0275fac});let e=n;return e})();export{q as a};
