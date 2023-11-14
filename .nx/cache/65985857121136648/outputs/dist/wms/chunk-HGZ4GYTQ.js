import{a as Z}from"./chunk-5VGBK5M2.js";import{k as Y}from"./chunk-EDQ2XWAO.js";import{a as X}from"./chunk-QTNYEYCW.js";import{a as W}from"./chunk-GKR6SDXW.js";import{a as K}from"./chunk-XHQXBUEX.js";import"./chunk-RMIKNTFD.js";import"./chunk-D3FIXZL7.js";import"./chunk-ADHMVREX.js";import"./chunk-VJKYRYVM.js";import{j as H}from"./chunk-Y7DOXW3K.js";import"./chunk-J3DDCTFF.js";import{a as L}from"./chunk-I3G2JKLN.js";import"./chunk-LCEARWCQ.js";import{a as U}from"./chunk-4AGTE6D3.js";import"./chunk-5GWOD35Y.js";import"./chunk-POEXBOQJ.js";import{e as Q}from"./chunk-TREYRKOP.js";import{e as J}from"./chunk-MZCJXFXF.js";import{E as $,H as q,I as z,e as b,i as O,t as P}from"./chunk-L3THJMBJ.js";import"./chunk-RAQ4VAB7.js";import"./chunk-RMC6N2HF.js";import"./chunk-GJX7JKAF.js";import"./chunk-WX6KJXZ2.js";import"./chunk-EXQESRXT.js";import"./chunk-5FUULRSO.js";import{c as V}from"./chunk-V5UEWFGK.js";import{a as l}from"./chunk-PLQ7TNCQ.js";import"./chunk-C55YZZU5.js";import"./chunk-GFVCXK67.js";import"./chunk-WOYNEQEU.js";import"./chunk-XSY6ZNJP.js";import"./chunk-W3KGMJG7.js";import"./chunk-B3MPBRHZ.js";import"./chunk-YUDS3XHK.js";import"./chunk-MIXZFVL7.js";import"./chunk-FFJ3QZ3H.js";import{i as R,k as G}from"./chunk-PJEV5NXI.js";import{A as j,q as x,w as A}from"./chunk-GWV5DZOT.js";import{$b as _,Ba as T,C as p,Da as B,Fb as c,Gb as r,Gc as D,Ia as M,Ja as E,Lc as F,Mc as w,Sb as a,V as g,ac as v,bc as I,cc as S,dc as h,ec as C,gc as k,na as d,nc as y,pc as f,qa as N}from"./chunk-N7LPRJLK.js";function te(n,o){if(n&1&&(h(0),S(1,"audit-info",3),C()),n&2){let s=f();c(1),a("auditInfo",s.auditInfo)}}function ie(n,o){if(n&1){let s=k();h(0),v(1,"popup-modal",4),y("clickSubmit",function(){M(s);let e=f();return E(e.onBack())}),I(),C()}if(n&2){let s=f();c(1),a("message",s.message)}}var Ne=(()=>{let o=class o{constructor(t,e,i,m,u,ee){this._fb=t,this._actRoute=e,this._router=i,this._auditService=m,this._eventLog=u,this._findContainer=ee,this.userInfo=T(U),this.inputForm=this._fb.nonNullable.group({barcode:["",[b.required,b.pattern(J)]]})}ngOnInit(){if(sessionStorage.getItem("currentAudit")){let t=JSON.parse(sessionStorage.getItem("currentAudit"));this.auditInfo={Container:{Barcode:t.Container.Barcode},Inventory:{ITN:t.Inventory.ITN}}}this.data$=p(!0)}verifyLocation(){let t=this.inputForm.value.barcode.replace(/-/g,"").trim();this.data$=this._findContainer.fetch({Container:{DistributionCenter:l.DistributionCenter,Barcode:t}},{fetchPolicy:"network-only"}).pipe(N(e=>{if(!e.data.findContainer)throw new Error("Location not found")}),d(e=>{let i=[{UserEventID:L.Event_IM_Location_Scanned,UserName:this.userInfo.userName,DistributionCenter:l.DistributionCenter,InventoryTrackingNumber:sessionStorage.getItem("auditITN"),Message:"BinLocation: "+t}],m=[{UserName:this.userInfo.userName,EventTypeID:L.Event_IM_Location_Scanned,Log:JSON.stringify({DistributionCenter:l.DistributionCenter,InventoryTrackingNumber:sessionStorage.getItem("auditITN"),BinLocation:t})}];return this._eventLog.insertLog(i,m).pipe(d(u=>this._auditService.inventoryUpdate(this.userInfo.userName,sessionStorage.getItem("auditITN"),"Inventory Management Audit","","","","","",t)),g(u=>{throw new Error(u)}))}),d(e=>(this._router.navigate(["../../scan-itn"],{relativeTo:this._actRoute}),p(e))),g(e=>p({error:{message:e.message,type:"error"}})))}onSubmit(){this.verifyLocation()}onBack(){this._router.navigate(["../../../menu"],{relativeTo:this._actRoute})}};o.\u0275fac=function(e){return new(e||o)(r($),r(R),r(G),r(Y),r(X),r(H))},o.\u0275cmp=B({type:o,selectors:[["ng-component"]],standalone:!0,features:[D],decls:6,vars:7,consts:[[4,"ngIf"],["inputType","string","controlName","barcode","title","Scan Location:",3,"data","formGroup","isvalid","formSubmit","formBack"],[2,"height","20px"],[3,"auditInfo"],[3,"message","clickSubmit"]],template:function(e,i){e&1&&(_(0,te,2,1,"ng-container",0),v(1,"single-input-form",1),y("formSubmit",function(){return i.onSubmit()})("formBack",function(){return i.onBack()}),F(2,"async"),I(),S(3,"div",2)(4,"div",2),_(5,ie,2,1,"ng-container",0)),e&2&&(a("ngIf",i.auditInfo),c(1),a("data",w(2,5,i.data$))("formGroup",i.inputForm)("isvalid",i.inputForm.valid),c(4),a("ngIf",i.message))},dependencies:[j,x,A,K,z,O,P,W,Q,V,q,Z],encapsulation:2});let n=o;return n})();export{Ne as ScanLocation};
