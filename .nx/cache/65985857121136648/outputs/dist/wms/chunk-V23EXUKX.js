import{b as C}from"./chunk-CHDKWY6V.js";import"./chunk-CNRANGED.js";import{a as R}from"./chunk-XHQXBUEX.js";import"./chunk-RMIKNTFD.js";import"./chunk-D3FIXZL7.js";import"./chunk-ADHMVREX.js";import"./chunk-VJKYRYVM.js";import{l as F}from"./chunk-FBU3NLE2.js";import"./chunk-MFWTQF6C.js";import"./chunk-M47XUQY5.js";import"./chunk-I3G2JKLN.js";import"./chunk-LCEARWCQ.js";import"./chunk-4AGTE6D3.js";import"./chunk-5GWOD35Y.js";import"./chunk-POEXBOQJ.js";import{b as A}from"./chunk-MZCJXFXF.js";import{E as B,I as b,e as g,i as T,t as y}from"./chunk-L3THJMBJ.js";import"./chunk-PLQ7TNCQ.js";import"./chunk-C55YZZU5.js";import"./chunk-YUDS3XHK.js";import"./chunk-MIXZFVL7.js";import"./chunk-FFJ3QZ3H.js";import{i as N,k as v}from"./chunk-PJEV5NXI.js";import{A as I,w as S}from"./chunk-GWV5DZOT.js";import{C as n,Da as p,Gb as o,Gc as l,Lc as _,Mc as h,Sb as u,ac as c,bc as f,na as s,nc as d}from"./chunk-N7LPRJLK.js";var Q=(()=>{let e=class e{constructor(r,t,i,m,$){this._fb=r,this._asn=t,this._actRoute=i,this._router=m,this._printer=$,this.inputForm=this._fb.nonNullable.group({ITN:["",[g.required]]})}ngOnInit(){this.data$=n(!0)}onSubmit(){let r=this.inputForm.value.ITN.trim();A.test(r)?this.data$=this._asn.fetchASN(r).pipe(s(t=>{if(t.data.findASNByITN.length==0)return this.data$=n({error:{message:"An ASN for this ITN was not found!"}}),n(!1);let i=t.data.findASNByITN[0]._id;return this._printer.printQRCode$(i.toString())})):this.data$=n({error:{message:"Invalid ITN format",type:"error"}})}onBack(){this._router.navigate(["../menu"],{relativeTo:this._actRoute})}};e.\u0275fac=function(t){return new(t||e)(o(B),o(C),o(N),o(v),o(F))},e.\u0275cmp=p({type:e,selectors:[["ng-component"]],standalone:!0,features:[l],decls:2,vars:4,consts:[["inputTyep","string","controlName","ITN","title","Scan ITN to print ASN Label:",3,"data","formGroup","formSubmit","formBack"]],template:function(t,i){t&1&&(c(0,"single-input-form",0),d("formSubmit",function(){return i.onSubmit()})("formBack",function(){return i.onBack()}),_(1,"async"),f()),t&2&&u("data",h(1,2,i.data$))("formGroup",i.inputForm)},dependencies:[I,S,R,b,T,y],encapsulation:2});let a=e;return a})();export{Q as ScanITN};
