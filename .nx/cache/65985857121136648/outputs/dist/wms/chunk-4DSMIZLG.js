import{f as s,h as c,j as a}from"./chunk-C55YZZU5.js";import{Aa as i,va as n}from"./chunk-N7LPRJLK.js";var u=a`
    query fetchEventLog($limit: Int, $offset: Int, $UserName: String, $eventIdList: [Int], $timeFrame: [String], $Log: String) {
  findEventLogs(
    limit: $limit
    offset: $offset
    UserName: $UserName
    eventIdList: $eventIdList
    timeFrame: $timeFrame
    Log: $Log
  ) {
    UserName
    Event
    Module
    CreateTime
    Log
  }
}
    `,v=(()=>{let t=class t extends c{constructor(o){super(o),this.document=u,this.client="wmsNodejs"}};t.\u0275fac=function(r){return new(r||t)(i(s))},t.\u0275prov=n({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),m=a`
    query fetchCommonvariablesForLogs($events: [Int]) {
  fetchCommonvariablesForLogs(events: $events)
}
    `,$=(()=>{let t=class t extends c{constructor(o){super(o),this.document=m,this.client="wmsNodejs"}};t.\u0275fac=function(r){return new(r||t)(i(s))},t.\u0275prov=n({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),f=a`
    query fetchEventType {
  findEventType {
    _id
    Module
    Event
  }
}
    `,y=(()=>{let t=class t extends c{constructor(o){super(o),this.document=f,this.client="wmsNodejs"}};t.\u0275fac=function(r){return new(r||t)(i(s))},t.\u0275prov=n({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})(),d=a`
    query fetchTaskCounter($Module: String!, $startDate: String!, $endDate: String!) {
  fetchTaskCounter(Module: $Module, startDate: $startDate, endDate: $endDate) {
    User
    taskCounter
  }
}
    `,I=(()=>{let t=class t extends c{constructor(o){super(o),this.document=d,this.client="wmsNodejs"}};t.\u0275fac=function(r){return new(r||t)(i(s))},t.\u0275prov=n({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();export{v as a,$ as b,y as c,I as d};
