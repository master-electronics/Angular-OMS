import{a as Q}from"./chunk-NO23KTXW.js";import{a as G}from"./chunk-5DKNJ5MR.js";import"./chunk-W6X5OBKE.js";import"./chunk-PTORZITP.js";import"./chunk-N327C62I.js";import{a as f}from"./chunk-XHQXBUEX.js";import"./chunk-RMIKNTFD.js";import"./chunk-D3FIXZL7.js";import"./chunk-ADHMVREX.js";import{a as x}from"./chunk-IPTX4HSO.js";import"./chunk-VJKYRYVM.js";import{a as O}from"./chunk-OQTOI2SX.js";import"./chunk-KSUYRJTQ.js";import"./chunk-FBU3NLE2.js";import"./chunk-MFWTQF6C.js";import"./chunk-M47XUQY5.js";import"./chunk-YPJKXAYS.js";import"./chunk-I3G2JKLN.js";import"./chunk-LCEARWCQ.js";import"./chunk-4AGTE6D3.js";import"./chunk-5GWOD35Y.js";import"./chunk-POEXBOQJ.js";import"./chunk-MZCJXFXF.js";import{H as A,I as V,e as L,i as j,k,m as D,t as M}from"./chunk-L3THJMBJ.js";import"./chunk-PLQ7TNCQ.js";import"./chunk-C55YZZU5.js";import"./chunk-YUDS3XHK.js";import"./chunk-MIXZFVL7.js";import"./chunk-FFJ3QZ3H.js";import{i as B,k as E}from"./chunk-PJEV5NXI.js";import{A as w,f as R,q as F,w as P}from"./chunk-GWV5DZOT.js";import{$b as I,Ac as b,Da as v,Fb as u,Gb as r,Gc as g,H as h,Lc as C,Mc as T,Rc as S,Sb as m,Sc as y,Uc as N,ac as l,bc as s,nc as c,pc as _,xc as p}from"./chunk-N7LPRJLK.js";function $(a,n){if(a&1&&(l(0,"div",3)(1,"h1"),p(2,"Scan Label"),s(),l(3,"h1"),p(4),s()()),a&2){let U=n.ngIf,i=_();u(4),b("(",i.label.currentItnIndex()+1," of ",U.length,")")}}var rt=(()=>{let n=class n{constructor(i,e,t,o,q,K){this.label=i,this.receipt=e,this._router=t,this._actRoute=o,this._ui=q,this.location=K,this.scanAll=!1,this.validators=[{name:"label",message:"Not match the current label!"}],this.onChange=d=>{d&&this.inputForm.get("receipt").setValue(d)}}ngOnInit(){this._ui.changeSteps(3),this.data$=this._actRoute.data.pipe(h(i=>i.print)),this.inputForm=new k({label:new D("",[L.required,this.checKLabel()])}),history.pushState(null,null,window.location.href),this.location.onPopState(()=>{history.pushState(null,null,window.location.href)})}focusInput(){this.singleInput.inputFiled.nativeElement.focus()}checKLabel(){return i=>{let e=i.value;return e?this.label.ITNList()[this.label.currentItnIndex()].ITN===e?null:{label:!0}:null}}onBack(){this._router.navigate(["../assign"],{relativeTo:this._actRoute})}onSubmit(){this.inputForm.value.label.trim()&&(this.scanAll||(this.inputForm.setValue({label:""}),this._router.navigate(["../sacnlocation"],{relativeTo:this._actRoute})))}};n.\u0275fac=function(e){return new(e||n)(r(G),r(x),r(E),r(B),r(O),r(R))},n.\u0275cmp=v({type:n,selectors:[["ng-component"]],viewQuery:function(e,t){if(e&1&&y(f,5),e&2){let o;S(o=N())&&(t.singleInput=o.first)}},standalone:!0,features:[g],decls:4,vars:10,consts:[["class","flex flex-col justify-center text-lg",4,"ngIf"],["controlName","label","title","Label",3,"data","validators","formGroup","isvalid","formSubmit","formBack"],[1,"absolute","bottom-1","right-1","h-64","w-64",3,"ITN","PARTNUMBER","PRODUCTCODE","buttonClick"],[1,"flex","flex-col","justify-center","text-lg"]],template:function(e,t){e&1&&(I(0,$,5,2,"div",0),l(1,"single-input-form",1),c("formSubmit",function(){return t.onSubmit()})("formBack",function(){return t.onBack()}),C(2,"async"),s(),l(3,"printer-button",2),c("buttonClick",function(){return t.focusInput()}),s()),e&2&&(m("ngIf",t.label.ITNList()),u(1),m("data",T(2,8,t.data$))("validators",t.validators)("formGroup",t.inputForm)("isvalid",t.inputForm.valid),u(2),m("ITN",t.label.getItnInList(t.label.currentItnIndex())())("PARTNUMBER",t.receipt.partNumber())("PRODUCTCODE",t.receipt.productCode()))},dependencies:[w,F,P,A,j,V,M,f,Q],encapsulation:2});let a=n;return a})();export{rt as PrintITNComponent};
