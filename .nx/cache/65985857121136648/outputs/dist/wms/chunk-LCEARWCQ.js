import{f as c,h as u,i as a,j as r}from"./chunk-C55YZZU5.js";import{Aa as s,va as i}from"./chunk-N7LPRJLK.js";var p=r`
    query findITNsByShelf($Container: searchContainer!) {
  findContainers(Container: $Container) {
    INVENTORies {
      InventoryTrackingNumber
      ORDERLINEDETAILs {
        StatusID
      }
    }
  }
}
    `,A=(()=>{let t=class t extends u{constructor(o){super(o),this.document=p,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),d=r`
    query fetchCountryList {
  fetchAllCountry {
    _id
    CountryName
    ISO2
    ISO3
  }
}
    `,w=(()=>{let t=class t extends u{constructor(o){super(o),this.document=d,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),f=r`
    query findBindedPrinter($Name: String!) {
  findPrinters(Printer: {Name: $Name}) {
    Name
    Orientation
    DPI
  }
}
    `,D=(()=>{let t=class t extends u{constructor(o){super(o),this.document=f,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),m=r`
    query findInventoryByUser($username: String) {
  findInventoryByUser(Username: $username) {
    InventoryTrackingNumber
  }
}
    `,b=(()=>{let t=class t extends u{constructor(o){super(o),this.document=m,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),I=r`
    mutation createITN($LocationCode: String!) {
  createITN(LocationCode: $LocationCode)
}
    `,F=(()=>{let t=class t extends a{constructor(o){super(o),this.document=I,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),h=r`
    mutation find_or_create_userInfo($UserInfo: insertUserInfo!) {
  findOrCreateUserInfo(UserInfo: $UserInfo) {
    _id
    Name
    DistributionCenter
  }
}
    `,T=(()=>{let t=class t extends a{constructor(o){super(o),this.document=h,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),y=r`
    mutation insert_UserEventLogs($log: [insertUserEventLog]!) {
  insertUserEventLogs(log: $log) {
    _id
  }
}
    `,U=(()=>{let t=class t extends a{constructor(o){super(o),this.document=y,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),v=r`
    mutation insert_EventLogs($logs: [insertEventLog]!) {
  insertEventLogs(logs: $logs)
}
    `,k=(()=>{let t=class t extends a{constructor(o){super(o),this.document=v,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),j=r`
    mutation create_EventLogs($oldLogs: [insertUserEventLog]!, $eventLogs: [insertEventLog]!) {
  insertUserEventLogs(log: $oldLogs) {
    _id
  }
  insertEventLogs(logs: $eventLogs)
}
    `,E=(()=>{let t=class t extends a{constructor(o){super(o),this.document=j,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),M=r`
    mutation update_Merp_QCBin($ITN: String!) {
  updateMerpQCBin(ITN: $ITN) {
    success
  }
}
    `;var x=r`
    mutation updateContainer($Container: updateContainer!, $ContainerID: Int!) {
  updateContainer(Container: $Container, _id: $ContainerID)
}
    `,L=(()=>{let t=class t extends a{constructor(o){super(o),this.document=x,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),g=r`
    mutation findorCreateUserContainer($Barcode: String!, $DistributionCenter: String!, $ContainerTypeID: Int!) {
  findOrCreateUserContainer(
    Container: {ContainerTypeID: $ContainerTypeID, Barcode: $Barcode, DistributionCenter: $DistributionCenter}
  ) {
    _id
  }
}
    `,S=(()=>{let t=class t extends a{constructor(o){super(o),this.document=g,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),C=r`
    mutation changeItnListForMerp($ITNList: [InventoryUpdateForMerp]!) {
  changeItnListForMerp(ITNList: $ITNList)
}
    `,B=(()=>{let t=class t extends a{constructor(o){super(o),this.document=C,this.client="wmsNodejs"}};t.\u0275fac=function(n){return new(n||t)(s(c))},t.\u0275prov=i({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();export{A as a,w as b,D as c,b as d,F as e,T as f,U as g,k as h,E as i,L as j,S as k,B as l};
