import{a as Ie,b as $e}from"./chunk-HV2M47TR.js";import{a as ge,b as he}from"./chunk-RH2D4KR5.js";import{b as De}from"./chunk-FFFUUL2B.js";import{d as xe}from"./chunk-JQV6U24N.js";import{c as ve}from"./chunk-EVXJS6DD.js";import{b as ne}from"./chunk-CRZYDNRB.js";import{b as Se}from"./chunk-55MPF5EN.js";import{f as Ve,h as Me,i as Ne,l as Ce,m as be,n as ye,o as ze,q as we}from"./chunk-KI3MUNGW.js";import"./chunk-JOHRHLSX.js";import{f as ae}from"./chunk-OXQW4PMW.js";import{c as fe,d as _e,e as Te}from"./chunk-6DLKQNDK.js";import{e as de}from"./chunk-WUHPQNSG.js";import"./chunk-YGLVR5WL.js";import{a as pe,d as me}from"./chunk-44NJU3LR.js";import"./chunk-Z347V25R.js";import{H as se,I as ue,d as re,h as le,o as ce}from"./chunk-L3THJMBJ.js";import"./chunk-RAQ4VAB7.js";import"./chunk-FMSTYN27.js";import"./chunk-QQPJAVIB.js";import"./chunk-RMC6N2HF.js";import"./chunk-GJX7JKAF.js";import"./chunk-WX6KJXZ2.js";import"./chunk-EXQESRXT.js";import"./chunk-5FUULRSO.js";import{a as oe}from"./chunk-V5UEWFGK.js";import{f as z,h as R,i as $,j as w}from"./chunk-C55YZZU5.js";import{a as Z,c as ee,e as te,f as ie}from"./chunk-GFVCXK67.js";import"./chunk-WOYNEQEU.js";import"./chunk-XSY6ZNJP.js";import"./chunk-W3KGMJG7.js";import"./chunk-B3MPBRHZ.js";import"./chunk-YUDS3XHK.js";import{m as X,n as Y}from"./chunk-MIXZFVL7.js";import"./chunk-FFJ3QZ3H.js";import{n as P}from"./chunk-PJEV5NXI.js";import{A as K,p as G,q as H}from"./chunk-GWV5DZOT.js";import{$b as V,Aa as C,Da as J,Ea as I,Fb as s,Gb as b,Ia as f,Ja as _,Sb as p,V as B,Vc as U,a as W,ac as l,bc as c,cc as S,dc as O,ec as j,g as T,gc as k,nc as d,pc as u,sc as x,va as N,wa as D,wc as A,xc as y,yc as v,zc as Q}from"./chunk-N7LPRJLK.js";var Re=w`
    query fetchValueMapView {
  fetchValueMapView {
    _id
    SourceSystemName
    SourceTableName
    SourceColumnName
    TargetSystemName
    TargetTableName
    TargetColumnName
    SourceValue
    TargetValue
  }
}
    `,Ee=(()=>{let e=class e extends R{constructor(t){super(t),this.document=Re,this.client="wmsNodejs"}};e.\u0275fac=function(i){return new(i||e)(C(z))},e.\u0275prov=N({token:e,factory:e.\u0275fac,providedIn:"root"});let a=e;return a})(),qe=w`
    query fetchEntityList($type: String) {
  fetchEntityList(type: $type) {
    SystemID
    SystemName
    TableID
    TableName
    ColumnID
    ColumnName
  }
}
    `,Le=(()=>{let e=class e extends R{constructor(t){super(t),this.document=qe,this.client="wmsNodejs"}};e.\u0275fac=function(i){return new(i||e)(C(z))},e.\u0275prov=N({token:e,factory:e.\u0275fac,providedIn:"root"});let a=e;return a})(),We=w`
    mutation insertValueMap($sourceSystemName: String, $sourceTableName: String, $sourceColumnName: String, $targetSystemName: String, $targetTableName: String, $targetColumnName: String, $sourceValue: String, $targetValue: String) {
  insertValueMap(
    SourceSystemName: $sourceSystemName
    SourceTableName: $sourceTableName
    SourceColumnName: $sourceColumnName
    TargetSystemName: $targetSystemName
    TargetTableName: $targetTableName
    TargetColumnName: $targetColumnName
    SourceValue: $sourceValue
    TargetValue: $targetValue
  ) {
    _id
    SourceSystemName
    SourceTableName
    SourceColumnName
    TargetSystemName
    TargetTableName
    TargetColumnName
    SourceValue
    TargetValue
  }
}
    `,Fe=(()=>{let e=class e extends ${constructor(t){super(t),this.document=We,this.client="wmsNodejs"}};e.\u0275fac=function(i){return new(i||e)(C(z))},e.\u0275prov=N({token:e,factory:e.\u0275fac,providedIn:"root"});let a=e;return a})(),Be=w`
    mutation updateValueMap($_id: Int!, $sourceSystemName: String, $sourceTableName: String, $sourceColumnName: String, $targetSystemName: String, $targetTableName: String, $targetColumnName: String, $sourceValue: String, $targetValue: String) {
  updateValueMap(
    _id: $_id
    SourceSystemName: $sourceSystemName
    SourceTableName: $sourceTableName
    SourceColumnName: $sourceColumnName
    TargetSystemName: $targetSystemName
    TargetTableName: $targetTableName
    TargetColumnName: $targetColumnName
    SourceValue: $sourceValue
    TargetValue: $targetValue
  ) {
    _id
    SourceSystemName
    SourceTableName
    SourceColumnName
    TargetSystemName
    TargetTableName
    TargetColumnName
    SourceValue
    TargetValue
  }
}
    `,Oe=(()=>{let e=class e extends ${constructor(t){super(t),this.document=Be,this.client="wmsNodejs"}};e.\u0275fac=function(i){return new(i||e)(C(z))},e.\u0275prov=N({token:e,factory:e.\u0275fac,providedIn:"root"});let a=e;return a})(),Je=w`
    mutation deleteValueMap($_id: Int!) {
  deleteValueMap(_id: $_id) {
    _id
  }
}
    `,je=(()=>{let e=class e extends ${constructor(t){super(t),this.document=Je,this.client="wmsNodejs"}};e.\u0275fac=function(i){return new(i||e)(C(z))},e.\u0275prov=N({token:e,factory:e.\u0275fac,providedIn:"root"});let a=e;return a})();function Ue(a,e){if(a&1&&(l(0,"th",13),y(1),c()),a&2){let r=e.$implicit;p("nzSortFn",r.compare),s(1),Q(" ",r.title," ")}}function Ge(a,e){if(a&1){let r=k();O(0),l(1,"td"),y(2),c(),l(3,"td"),y(4),c(),l(5,"td"),y(6),c(),l(7,"td"),y(8),c(),l(9,"td")(10,"button",16),d("click",function(){f(r);let i=u().$implicit,n=u();return _(n.startEdit(i.ID))}),S(11,"i",17),c(),l(12,"button",18),d("nzOnConfirm",function(){f(r);let i=u().$implicit,n=u();return _(n.deleteRow(i.ID))}),S(13,"i",19),c()(),j()}if(a&2){let r=u().$implicit;s(2),v(r.SourceData),s(2),v(r.TargetLocation),s(2),v(r.SourceValue),s(2),v(r.TargetValue)}}function He(a,e){if(a&1){let r=k();l(0,"td")(1,"nz-select",20),d("ngModelChange",function(i){f(r);let n=u().$implicit,o=u();return _(o.editCache[n.ID].data.SourceData=i)}),c()(),l(2,"td")(3,"nz-select",21),d("ngModelChange",function(i){f(r);let n=u().$implicit,o=u();return _(o.editCache[n.ID].data.TargetLocation=i)}),c()(),l(4,"td")(5,"input",22),d("ngModelChange",function(i){f(r);let n=u().$implicit,o=u();return _(o.editCache[n.ID].data.SourceValue=i)}),c()(),l(6,"td")(7,"input",22),d("ngModelChange",function(i){f(r);let n=u().$implicit,o=u();return _(o.editCache[n.ID].data.TargetValue=i)}),c()(),l(8,"td")(9,"button",23),d("click",function(){f(r);let i=u().$implicit,n=u();return _(n.saveEdit(i.ID))}),S(10,"i",24),c(),l(11,"button",10),d("click",function(){f(r);let i=u().$implicit,n=u();return _(n.cancelEdit(i.ID))}),S(12,"i",11),c()()}if(a&2){let r=u().$implicit,t=u();s(1),p("ngModel",t.editCache[r.ID].data.SourceData)("nzOptions",t.sourceOptions),s(2),p("ngModel",t.editCache[r.ID].data.TargetLocation)("nzOptions",t.targetOptions)("nzNotFoundContent","NF"),s(2),p("ngModel",t.editCache[r.ID].data.SourceValue),s(2),p("ngModel",t.editCache[r.ID].data.TargetValue)}}function Ke(a,e){if(a&1&&(l(0,"tr"),V(1,Ge,14,4,"ng-container",14)(2,He,13,7,"ng-template",null,15,U),c()),a&2){let r=e.$implicit,t=A(3),i=u();s(1),p("ngIf",!i.editCache[r.ID].edit)("ngIfElse",t)}}function Xe(a,e){if(a&1&&S(0,"nz-option",25),a&2){let r=e.$implicit;x("nzLabel",r.label),x("nzValue",r.label)}}function Ye(a,e){if(a&1&&S(0,"nz-option",25),a&2){let r=e.$implicit;x("nzLabel",r.label),x("nzValue",r.label)}}function Ze(a,e){if(a&1&&(O(0,26),S(1,"nz-alert",27),j()),a&2){let r=u();s(1),p("nzType",r.alertType==="error"?"error":r.alertType==="success"?"success":r.alertType==="info"?"info":"warning")("nzMessage",r.message)}}var E=(()=>{let e=class e{constructor(t,i,n,o,m){this.fetchValueMapView=t,this.fetchEntityList=i,this.insertValueMap=n,this.updateValueMap=o,this.deleteValueMap=m,this.editCache={},this.listOfColumn=[{title:"Source Location",compare:(g,h)=>g.SourceData.localeCompare(h.SourceData)},{title:"Target Location",compare:(g,h)=>g.TargetLocation.localeCompare(h.TargetLocation)},{title:"Source Value",compare:(g,h)=>g.SourceValue.localeCompare(h.SourceValue)},{title:"Target Value",compare:(g,h)=>g.TargetValue.localeCompare(h.TargetValue)}],this.isLoading=!1,this.valueMapViewSubscription=new T,this.sourceEntityListSubscription=new T,this.targetEntityListSubscription=new T,this.insertValueMapSubscription=new T,this.updateValueMapSubscription=new T,this.deleteValueMapSubscription=new T,this.alertType="error"}ngOnInit(){this.sourceOptions=[],this.targetOptions=[],this.sourceEntityListSubscription.add(this.fetchEntityList.fetch({type:"S"},{fetchPolicy:"network-only"}).subscribe(t=>{t.data.fetchEntityList.map(i=>{this.sourceOptions.push({label:i.SystemName+":"+i.TableName+":"+i.ColumnName,value:i.SystemName+":"+i.TableName+":"+i.ColumnName})})},t=>{console.log(t)})),this.targetEntityListSubscription.add(this.fetchEntityList.fetch({type:"T"},{fetchPolicy:"network-only"}).subscribe(t=>{t.data.fetchEntityList.map(i=>{this.targetOptions.push({label:i.SystemName+":"+i.TableName+":"+i.ColumnName,value:i.SystemName+":"+i.TableName+":"+i.ColumnName})})},t=>{console.log(t)})),this.loadView()}loadView(){this.viewData=[],this.isLoading=!0,this.valueMapViewSubscription.add(this.fetchValueMapView.fetch({},{fetchPolicy:"network-only"}).subscribe(t=>{for(let i=0;i<t.data.fetchValueMapView.length;i++){let n=t.data.fetchValueMapView.map(o=>(this.editCache[o._id.toString()]={edit:!1,data:{ID:o._id,SourceData:o.SourceSystemName+":"+o.SourceTableName+":"+o.SourceColumnName,TargetLocation:o.TargetSystemName+":"+o.TargetTableName+":"+o.TargetColumnName,SourceValue:o.SourceValue,TargetValue:o.TargetValue}},{ID:o._id,SourceData:o.SourceSystemName+":"+o.SourceTableName+":"+o.SourceColumnName,TargetLocation:o.TargetSystemName+":"+o.TargetTableName+":"+o.TargetColumnName,SourceValue:o.SourceValue,TargetValue:o.TargetValue}));this.viewData=n}},B(t=>(this.isLoading=!1,t))))}startEdit(t){this.message="",this.editCache[t].edit=!0}saveEdit(t){this.message="";let i=this.editCache[t].data.SourceData.split(":"),n=i[0],o=i[1],m=i[2],g=this.editCache[t].data.TargetLocation.split(":"),h=g[0],L=g[1],F=g[2];this.updateValueMapSubscription.add(this.updateValueMap.mutate({_id:Number(t),sourceSystemName:n,sourceTableName:o,sourceColumnName:m,targetSystemName:h,targetTableName:L,targetColumnName:F,sourceValue:this.editCache[t].data.SourceValue,targetValue:this.editCache[t].data.TargetValue}).subscribe(()=>{let M=this.viewData.findIndex(Ae=>Ae.ID===t);this.viewData[M].SourceData=this.editCache[t].data.SourceData,this.viewData[M].TargetLocation=this.editCache[t].data.TargetLocation,this.viewData[M].SourceValue=this.editCache[t].data.SourceValue,this.viewData[M].TargetValue=this.editCache[t].data.TargetValue,this.editCache[t].edit=!1},M=>{console.log(M)}))}cancelEdit(t){this.message="";let i=this.viewData.findIndex(n=>n.ID===t);this.editCache[t]={data:W({},this.viewData[i]),edit:!1}}deleteRow(t){this.message="",this.deleteValueMapSubscription.add(this.deleteValueMap.mutate({_id:Number(t)}).subscribe(()=>{this.loadView()},i=>{console.log(i)}))}addValueMap(){if(this.message="",this.newMappingSourceLocation&&this.newMappingTargetLocation&&this.newMappingSourceValue&&/\S/.test(this.newMappingSourceValue)&&this.newMappingTargetValue&&/\S/.test(this.newMappingTargetValue)){let t=this.newMappingSourceLocation.split(":"),i=t[0],n=t[1],o=t[2],m=this.newMappingTargetLocation.split(":"),g=m[0],h=m[1],L=m[2];this.insertValueMapSubscription.add(this.insertValueMap.mutate({sourceSystemName:i,sourceTableName:n,sourceColumnName:o,targetSystemName:g,targetTableName:h,targetColumnName:L,sourceValue:this.newMappingSourceValue,targetValue:this.newMappingTargetValue}).subscribe(()=>{this.loadView(),this.newMappingSourceLocation="",this.newMappingTargetLocation="",this.newMappingSourceValue="",this.newMappingTargetValue=""},F=>{console.log(F)}))}else this.message="All fields are required"}cancelAdd(){this.message="",this.newMappingSourceLocation="",this.newMappingTargetLocation="",this.newMappingSourceValue="",this.newMappingTargetValue=""}ngOnDestroy(){this.valueMapViewSubscription.unsubscribe(),this.insertValueMapSubscription.unsubscribe(),this.updateValueMapSubscription.unsubscribe(),this.deleteValueMapSubscription.unsubscribe(),this.sourceEntityListSubscription.unsubscribe(),this.targetEntityListSubscription.unsubscribe()}};e.\u0275fac=function(i){return new(i||e)(b(Ee),b(Le),b(Fe),b(Oe),b(je))},e.\u0275cmp=J({type:e,selectors:[["value-mapping"]],decls:26,vars:11,consts:[[1,"container","px-4","py-4","mx-auto"],["id","excel-table",3,"nzPageSize","nzData"],["table",""],["nzWidth","23%",3,"nzSortFn",4,"ngFor","ngForOf"],[4,"ngFor","ngForOf"],[2,"width","300px",3,"ngModel","ngModelChange"],[3,"nzLabel","nzValue",4,"ngFor","ngForOf"],["nz-input","","type","text",3,"ngModel","ngModelChange"],["nz-button","","title","Add",3,"click"],["nz-icon","","nzType","plus","nzTheme","outline"],["nz-button","","title","Cancel",3,"click"],["nz-icon","","nzType","close","nzTheme","outline"],["nz-row","","nzJustify","center",4,"ngIf"],["nzWidth","23%",3,"nzSortFn"],[4,"ngIf","ngIfElse"],["editTemplate",""],["nz-button","","title","Edit",3,"click"],["nz-icon","","nzType","edit","nzTheme","outline"],["nz-button","","nz-popconfirm","","nzPopconfirmTitle","Are you sure you want to delete this row?","title","Delete",3,"nzOnConfirm"],["nz-icon","","nzType","delete","nzTheme","outline"],[2,"width","90%",3,"ngModel","nzOptions","ngModelChange"],[2,"width","90%",3,"ngModel","nzOptions","nzNotFoundContent","ngModelChange"],["type","text","nz-input","",3,"ngModel","ngModelChange"],["nz-button","","title","Save",3,"click"],["nz-icon","","nzType","check","nzTheme","outline"],[3,"nzLabel","nzValue"],["nz-row","","nzJustify","center"],["nzShowIcon","",1,"w-full",2,"width","50%",3,"nzType","nzMessage"]],template:function(i,n){if(i&1&&(l(0,"div",0)(1,"nz-table",1,2)(3,"thead")(4,"tr"),V(5,Ue,2,2,"th",3),S(6,"th"),c()(),l(7,"tbody"),V(8,Ke,4,2,"tr",4),l(9,"tr")(10,"td")(11,"nz-select",5),d("ngModelChange",function(m){return n.newMappingSourceLocation=m}),V(12,Xe,1,2,"nz-option",6),c()(),l(13,"td")(14,"nz-select",5),d("ngModelChange",function(m){return n.newMappingTargetLocation=m}),V(15,Ye,1,2,"nz-option",6),c()(),l(16,"td")(17,"input",7),d("ngModelChange",function(m){return n.newMappingSourceValue=m}),c()(),l(18,"td")(19,"input",7),d("ngModelChange",function(m){return n.newMappingTargetValue=m}),c()(),l(20,"td")(21,"button",8),d("click",function(){return n.addValueMap()}),S(22,"i",9),c(),l(23,"button",10),d("click",function(){return n.cancelAdd()}),S(24,"i",11),c()()()()(),V(25,Ze,2,2,"ng-container",12),c()),i&2){let o=A(2);s(1),p("nzPageSize",20)("nzData",n.viewData),s(4),p("ngForOf",n.listOfColumn),s(3),p("ngForOf",o.data),s(3),p("ngModel",n.newMappingSourceLocation),s(1),p("ngForOf",n.sourceOptions),s(2),p("ngModel",n.newMappingTargetLocation),s(1),p("ngForOf",n.targetOptions),s(2),p("ngModel",n.newMappingSourceValue),s(2),p("ngModel",n.newMappingTargetValue),s(6),p("ngIf",n.message)}},dependencies:[G,H,pe,be,Me,Ve,Ne,ze,Ce,ye,te,Z,ee,oe,fe,_e,X,re,le,ce,Ie,ge],encapsulation:2});let a=e;return a})();var et=[{path:"",component:E}],ke=(()=>{let e=class e{};e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=I({type:e}),e.\u0275inj=D({imports:[P.forChild(et),P]});let a=e;return a})();var At=(()=>{let e=class e{};e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=I({type:e,bootstrap:[E]}),e.\u0275inj=D({imports:[K,ke,me,we,ie,xe,ne,ae,de,ve,Te,Se,De,Y,se,ue,$e,he]});let a=e;return a})();export{At as ValueMappingModule};
