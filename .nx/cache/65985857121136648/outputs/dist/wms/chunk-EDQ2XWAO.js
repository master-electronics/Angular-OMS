import{a as T}from"./chunk-4AGTE6D3.js";import{f as u,h as p,i as m,j as a}from"./chunk-C55YZZU5.js";import{Aa as i,Ba as D,C as g,H as y,V as I,na as v,va as s}from"./chunk-N7LPRJLK.js";var X=a`
    query fetchAuditTypes {
  fetchAuditTypes {
    _id
    Type
    Order
  }
}
    `,P=(()=>{let t=class t extends p{constructor(e){super(e),this.document=X,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),Z=a`
    query fetchSystemAuditList($includedDeactivated: Boolean) {
  fetchSystemAudits(IncludeDeactivated: $includedDeactivated) {
    _id
    Name
    Description
    Priority
    Active
    IMTrigger_AuditTypes {
      _id
      IMTriggerID
      IMAuditTypeID
      IMAuditType {
        _id
        Type
        Order
      }
    }
  }
}
    `,N=(()=>{let t=class t extends p{constructor(e){super(e),this.document=Z,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),G=a`
    query verifyAuditLocation($container: searchContainer) {
  findContainer(Container: $container) {
    _id
  }
}
    `,Pt=(()=>{let t=class t extends p{constructor(e){super(e),this.document=G,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),_=a`
    query findProductCode($productCode: searchProductCode) {
  findProductCode(productCode: $productCode) {
    _id
    ProductCodeNumber
  }
}
    `,Nt=(()=>{let t=class t extends p{constructor(e){super(e),this.document=_,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),tt=a`
    query findIMProduct($product: searchProduct) {
  findProduct(Product: $product) {
    _id
    PartNumber
    ProductCodeID
  }
}
    `,bt=(()=>{let t=class t extends p{constructor(e){super(e),this.document=tt,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),et=a`
    query findIMInventory($inventory: searchInventory!) {
  findInventory(Inventory: $inventory) {
    _id
    InventoryTrackingNumber
    Product {
      PartNumber
    }
    Container {
      Barcode
    }
  }
}
    `,b=(()=>{let t=class t extends p{constructor(e){super(e),this.document=et,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),rt=a`
    query findIMInventories($itn: String, $barcodeStart: String, $barcodeEnd: String, $prc: String, $partNumber: String) {
  findIMInventories(
    ITN: $itn
    BarcodeStart: $barcodeStart
    BarcodeEnd: $barcodeEnd
    PRC: $prc
    PartNumber: $partNumber
  ) {
    _id
    InventoryTrackingNumber
    oldID
  }
}
    `,jt=(()=>{let t=class t extends p{constructor(e){super(e),this.document=rt,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),ot=a`
    query findIMPRCInventories($prc: String) {
  findIMPRCInventories(PRC: $prc) {
    _id
  }
}
    `,$t=(()=>{let t=class t extends p{constructor(e){super(e),this.document=ot,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),nt=a`
    query findIMPRCPartNumberInventories($prc: String, $partNumber: String) {
  findIMPRCPartNumberInventories(PRC: $prc, PartNumber: $partNumber) {
    _id
  }
}
    `,St=(()=>{let t=class t extends p{constructor(e){super(e),this.document=nt,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),it=a`
    query validateFilter($itn: String, $locationStart: String, $locationEnd: String, $prc: String, $partNumber: String) {
  validateFilter(
    ITN: $itn
    LocationStart: $locationStart
    LocationEnd: $locationEnd
    PRC: $prc
    PartNumber: $partNumber
  )
}
    `,xt=(()=>{let t=class t extends p{constructor(e){super(e),this.document=it,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),ct=a`
    query findNextAudit($userID: Int) {
  findNextAudit(UserID: $userID) {
    _id
    TypeID
    InventoryID
    Type
    UserID
    Order
    InventoryTrackingNumber
    ParentITN
    Barcode
    ProductID
    DateCode
    COO
    ROHS
    QuantityOnHand
    OriginalQuantity
    NotFound
    Suspect
    LocatedInAutostore
    BoundForAutostore
    PartNumber
    Description
    ProductCodeID
    ProductCodeNumber
    ProductTier
    ProductType
    ProductTypeDescription
    Velocity
    LastUpdated
    CreatedDatetime
    Priority
    MICPartNumber
    UOM
    Autostore
    PackType
    PackQty
    Cost
  }
}
    `,j=(()=>{let t=class t extends p{constructor(e){super(e),this.document=ct,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),st=a`
    query getNextSubAudit($inventoryID: Int, $userID: Int) {
  getNextSubAudit(InventoryID: $inventoryID, UserID: $userID) {
    _id
    TypeID
    InventoryID
    Type
    UserID
    Order
    InventoryTrackingNumber
    ParentITN
    Barcode
    ProductID
    DateCode
    COO
    ROHS
    QuantityOnHand
    OriginalQuantity
    NotFound
    Suspect
    LocatedInAutostore
    BoundForAutostore
    PartNumber
    Description
    ProductCodeID
    ProductCodeNumber
    ProductTier
    ProductType
    ProductTypeDescription
    Velocity
    LastUpdated
    CreatedDatetime
    Priority
    MICPartNumber
    UOM
    Autostore
    PackType
    PackQty
    Cost
  }
}
    `,$=(()=>{let t=class t extends p{constructor(e){super(e),this.document=st,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),at=a`
    query getSearchLocation($barcode: String, $level: Int) {
  getSearchLocation(Barcode: $barcode, Level: $level) {
    _id
    Barcode
  }
}
    `,S=(()=>{let t=class t extends p{constructor(e){super(e),this.document=at,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),ut=a`
    query getSearchLocations($barcode: String) {
  getSearchLocations(Barcode: $barcode) {
    _id
    Barcode
  }
}
    `,x=(()=>{let t=class t extends p{constructor(e){super(e),this.document=ut,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),dt=a`
    query validateAssignment($auditID: Int, $userID: Int) {
  validateAssignment(AuditID: $auditID, UserID: $userID)
}
    `,w=(()=>{let t=class t extends p{constructor(e){super(e),this.document=dt,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),pt=a`
    query getIMAdjustReasons {
  getIMAdjustReasons {
    _id
    Reason
  }
}
    `,C=(()=>{let t=class t extends p{constructor(e){super(e),this.document=pt,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),lt=a`
    mutation updateLastUpdated($inventoryID: Int, $typeID: Int, $lastUpdated: String) {
  updateLastUpdated(
    InventoryID: $inventoryID
    TypeID: $typeID
    LastUpdated: $lastUpdated
  ) {
    _id
  }
}
    `,k=(()=>{let t=class t extends m{constructor(e){super(e),this.document=lt,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),yt=a`
    mutation insertAudits($audits: [inputAudit]) {
  insertAudits(Audits: $audits) {
    _id
  }
}
    `,wt=(()=>{let t=class t extends m{constructor(e){super(e),this.document=yt,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),It=a`
    mutation insertSuspect($suspect: [inputSuspect]) {
  insertSuspect(Suspect: $suspect) {
    _id
  }
}
    `,O=(()=>{let t=class t extends m{constructor(e){super(e),this.document=It,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),mt=a`
    mutation inventoryUpdate($user: String!, $itn: String!, $quantity: String, $dateCode: String, $country: String, $rohs: String, $reason: String!, $suspect: String, $binlocation: String) {
  inventoryUpdate(
    User: $user
    ITN: $itn
    DateCode: $dateCode
    CountryOfOrigin: $country
    ROHSFlag: $rohs
    QuantityOnHand: $quantity
    AdjustmentReason: $reason
    Suspect: $suspect
    BinLocation: $binlocation
  )
}
    `,F=(()=>{let t=class t extends m{constructor(e){super(e),this.document=mt,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),ht=a`
    mutation deleteAudit($inventoryID: Int, $typeID: Int) {
  deleteAudit(InventoryID: $inventoryID, TypeID: $typeID) {
    _id
  }
}
    `,M=(()=>{let t=class t extends m{constructor(e){super(e),this.document=ht,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),ft=a`
    mutation closeAudit($inventoryID: Int, $typeID: Int) {
  closeAudit(InventoryID: $inventoryID, TypeID: $typeID) {
    _id
  }
}
    `,U=(()=>{let t=class t extends m{constructor(e){super(e),this.document=ft,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),At=a`
    mutation closeAudits($itn: String) {
  closeAudits(ITN: $itn) {
    _id
    InventoryTrackingNumber
  }
}
    `,L=(()=>{let t=class t extends m{constructor(e){super(e),this.document=At,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),Ct=a`
    mutation clearTimeoutAudits($seconds: Int) {
  clearTimeoutAudits(Seconds: $seconds) {
    _id
  }
}
    `;var gt=a`
    mutation updateSystemTrigger($triggerId: Int, $trigger: imTrigger, $auditTypes: [Int]) {
  updateSystemTrigger(
    TriggerID: $triggerId
    Trigger: $trigger
    AuditTypes: $auditTypes
  ) {
    _id
  }
}
    `,R=(()=>{let t=class t extends m{constructor(e){super(e),this.document=gt,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})(),vt=a`
    mutation insertSystemTrigger($trigger: imTrigger, $auditTypes: [Int]) {
  insertSystemTrigger(Trigger: $trigger, AuditTypes: $auditTypes) {
    _id
  }
}
    `,B=(()=>{let t=class t extends m{constructor(e){super(e),this.document=vt,this.client="wmsNodejs"}};t.\u0275fac=function(o){return new(o||t)(i(u))},t.\u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"});let r=t;return r})();var Ut=(()=>{let t=class t{constructor(e,o,n,d,c,l,h,f,A,Q,q,E,H,V,J,W,Y){this._findNextAudit=e,this._inventoryUpdate=o,this._deleteAudit=n,this._closeAudit=d,this._closeAudits=c,this._nextSubAudit=l,this._insertSuspect=h,this._findInventory=f,this._getSearchLocation=A,this._getSearchLocations=Q,this._validateAssignment=q,this._lastUpdated=E,this._imAdjustReasons=H,this._auditTypes=V,this._systemAuditList=J,this._updateSystemTrigger=W,this._insertSystemTrigger=Y,this.userInfo=D(T)}get nextSearchLocation$(){return this._getSearchLocation.fetch({barcode:JSON.parse(sessionStorage.getItem("currentAudit")).Container.Barcode,level:Number(sessionStorage.getItem("searchLevel"))},{fetchPolicy:"network-only"}).pipe(y(e=>({Barcode:e.data.getSearchLocation[0].Barcode})),I(e=>{throw new Error(e)}))}get searchLocations$(){return this._getSearchLocations.fetch({barcode:JSON.parse(sessionStorage.getItem("currentAudit")).Container.Barcode},{fetchPolicy:"network-only"}).pipe(y(e=>{let o=[];return e.data.getSearchLocations.forEach(n=>{o.push({Barcode:n.Barcode})}),o}),I(e=>{throw new Error(e)}))}updateLastUpdated(e,o,n){return this._lastUpdated.mutate({inventoryID:e,typeID:o,lastUpdated:n})}validateAssignment$(e,o){return this._validateAssignment.fetch({auditID:e,userID:o},{fetchPolicy:"network-only"})}get nextAudit$(){return this._findNextAudit.fetch({userID:this.userInfo.userId},{fetchPolicy:"network-only"}).pipe(y(e=>{let o;if(e.data.findNextAudit){let n=e.data.findNextAudit[0];o={_id:n._id,TypeID:n.TypeID,Type:{Type:n.Type,Order:n.Order},InventoryID:n.InventoryID,Inventory:{ITN:n.InventoryTrackingNumber,ParentITN:n.ParentITN,DateCode:n.DateCode,COO:n.COO,ROHS:n.ROHS,Quantity:n.QuantityOnHand,OriginalQuantity:n.OriginalQuantity,NotFound:n.NotFound,Suspect:n.Suspect,LocatedInAutostore:n.LocatedInAutostore,BoundForAutostore:n.BoundForAutostore,ProductID:n.ProductID,Product:{PartNumber:n.PartNumber,Description:n.Description,ProductCodeID:n.ProductCodeID,ProductCode:{ProductCodeNumber:n.ProductCodeNumber},ProductType:{ProductType:n.ProductType,Description:n.ProductTypeDescription},ProductTier:n.ProductTier,Velocity:n.Velocity,MICPartNumber:n.MICPartNumber,UOM:n.UOM,Autostore:n.Autostore,PackType:n.PackType,PackQty:n.PackQty,Cost:n.Cost}},Container:{Barcode:n.Barcode},LastUpdated:n.LastUpdated}}return o}))}inventoryUpdate(e,o,n,d,c,l,h,f,A){return this._inventoryUpdate.mutate({user:e,itn:o,quantity:d,dateCode:c,country:l,rohs:h,reason:n,suspect:f,binlocation:A})}deleteAudit(e,o){return this._deleteAudit.mutate({inventoryID:e,typeID:o})}closeAudit(e,o,n,d){return this._closeAudit.mutate({inventoryID:e,typeID:o}).pipe(v(c=>JSON.parse(sessionStorage.getItem("currentAudit")).IMSuspect!="Y"?this._inventoryUpdate.mutate({user:d,itn:n,suspect:"false",reason:"Inventory Management Audit"}):g(c)))}closeAudits(e){return this._closeAudits.mutate({itn:e})}insertSuspect(e){return this._insertSuspect.mutate({suspect:[{InventoryID:Number(e[0].InventoryID),Reason:e[0].Reason,Comment:e[0].Comment}]})}updateSystemTrigger(e,o,n){return this._updateSystemTrigger.mutate({triggerId:e,trigger:o,auditTypes:n}).pipe(I(d=>{throw new Error(d)}))}insertSystemTrigger(e,o){return this._insertSystemTrigger.mutate({trigger:e,auditTypes:o}).pipe(I(n=>{throw new Error(n)}))}checkBinlocation(e){return this._findInventory.fetch({inventory:{InventoryTrackingNumber:e}},{fetchPolicy:"network-only"}).pipe(y(o=>o),I(o=>{throw new Error(o)}))}validatePartNumber(e){return this._findInventory.fetch({inventory:{_id:Number(e[0].InventoryID)}},{fetchPolicy:"network-only"}).pipe(y(o=>o.data.findInventory.Product.PartNumber!=e[0].PartNumber?this._insertSuspect.mutate({suspect:[{InventoryID:Number(e[0].InventoryID),Reason:"Wrong Part Number"}]}).pipe(y(n=>n),I(n=>{let d=n.message;return n})):o),I(o=>{let n=o.message;return o}))}getIMAdjustReasons(){let e=[];return this._imAdjustReasons.fetch({},{fetchPolicy:"network-only"}).pipe(y(o=>(o.data.getIMAdjustReasons.forEach(n=>{e.push(n.Reason)}),e)),I(o=>o))}getAuditTypes(){let e=[];return this._auditTypes.fetch({},{fetchPolicy:"network-only"}).pipe(y(o=>(o.data.fetchAuditTypes.forEach(n=>{e.push({name:n.Type,value:n._id,disabled:n.Type=="Location,"})}),e)))}getSystemAuditList(e){let o=[];return this._systemAuditList.fetch({includedDeactivated:e},{fetchPolicy:"network-only"}).pipe(y(n=>(n.data.fetchSystemAudits.forEach(d=>{let c=[];d.IMTrigger_AuditTypes.forEach(l=>{c.push({Type:l.IMAuditType.Type,IMAuditTypeID:l.IMAuditTypeID})}),o.push({_id:d._id,Active:d.Active,Name:d.Name,Description:d.Description,Priority:d.Priority,IMTrigger_AuditTypes:c})}),o)),I(n=>n))}nextSubAudit$(e,o){return this._nextSubAudit.fetch({inventoryID:e,userID:o},{fetchPolicy:"network-only"}).pipe(y(n=>{let d;if(n.data.getNextSubAudit.length>0){let c=n.data.getNextSubAudit[0],l;switch(c.TypeID){case 10:l="scan-itn";break;case 20:l="quantity";break;case 30:l="dateCode";break;case 40:l="coo";break;case 50:l="rohs";break;case 60:l="partNumber";break;default:l="scan-itn";break}d={_id:c._id,TypeID:c.TypeID,Type:{Type:c.Type,Order:c.Order},InventoryID:c.InventoryID,Inventory:{ITN:c.InventoryTrackingNumber,ParentITN:c.ParentITN,DateCode:c.DateCode,COO:c.COO,ROHS:c.ROHS,Quantity:c.QuantityOnHand,OriginalQuantity:c.OriginalQuantity,NotFound:c.NotFound,Suspect:c.Suspect,LocatedInAutostore:c.LocatedInAutostore,BoundForAutostore:c.BoundForAutostore,ProductID:c.ProductID,Product:{PartNumber:c.PartNumber,Description:c.Description,ProductCodeID:c.ProductCodeID,ProductCode:{ProductCodeNumber:c.ProductCodeNumber},ProductType:{ProductType:c.ProductType,Description:c.ProductTypeDescription},ProductTier:c.ProductTier,Velocity:c.Velocity,MICPartNumber:c.MICPartNumber,UOM:c.UOM,Autostore:c.Autostore,PackType:c.PackType,PackQty:c.PackQty,Cost:c.Cost}},Container:{Barcode:c.Barcode},Route:l}}return d}))}};t.\u0275fac=function(o){return new(o||t)(i(j),i(F),i(M),i(U),i(L),i($),i(O),i(b),i(S),i(x),i(w),i(k),i(C),i(P),i(N),i(R),i(B))},t.\u0275prov=s({token:t,factory:t.\u0275fac});let r=t;return r})();export{P as a,Pt as b,Nt as c,bt as d,b as e,jt as f,$t as g,St as h,xt as i,wt as j,Ut as k};
