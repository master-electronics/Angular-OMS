import{a as M}from"./chunk-G2ZMXMZ4.js";import"./chunk-D3GL3SK4.js";import"./chunk-6TITOEJA.js";import"./chunk-CNRANGED.js";import{a as j}from"./chunk-XHQXBUEX.js";import"./chunk-RMIKNTFD.js";import"./chunk-D3FIXZL7.js";import"./chunk-ADHMVREX.js";import"./chunk-VJKYRYVM.js";import"./chunk-KSUYRJTQ.js";import"./chunk-YPJKXAYS.js";import"./chunk-I3G2JKLN.js";import"./chunk-LCEARWCQ.js";import"./chunk-4AGTE6D3.js";import"./chunk-5GWOD35Y.js";import"./chunk-POEXBOQJ.js";import{b as $}from"./chunk-MZCJXFXF.js";import{E as C,I as R,e as f,i as B,t as w}from"./chunk-L3THJMBJ.js";import"./chunk-PLQ7TNCQ.js";import"./chunk-C55YZZU5.js";import"./chunk-YUDS3XHK.js";import"./chunk-MIXZFVL7.js";import"./chunk-FFJ3QZ3H.js";import{i as b,k as F,n as N}from"./chunk-PJEV5NXI.js";import{A as T,w as y}from"./chunk-GWV5DZOT.js";import{C as r,Da as l,Fb as d,Gb as n,Gc as v,H as m,Lc as k,Mc as S,Sb as h,V as c,ac as p,bc as u,nc as g,uc as _,xc as I}from"./chunk-N7LPRJLK.js";var H=(()=>{let o=class o{constructor(e,i,t,s){this._fb=e,this._actRoute=i,this._router=t,this._stock=s,this.inputForm=this._fb.nonNullable.group({itn:["",[f.required,f.pattern($)]]})}ngOnInit(){this.data$=r(!0)}onSubmit(){let e=this.inputForm.value.itn.trim(),i=this._stock.verifiedItns().find(t=>t.ITN===e);if(this._stock.checkedItns()&&this._stock.checkedItns().some(t=>t.ITN===e)){this.data$=r({error:{message:"This ITN has been put away.",name:"warning"}});return}if(i){this.data$=this._stock.verifyITN$(e).pipe(m(()=>{this._router.navigate(["../putaway"],{relativeTo:this._actRoute})}),c(t=>r({error:{message:t.message,name:"error"}})));return}this.inputForm.patchValue({itn:""}),this.data$=r(!0).pipe(m(()=>({error:{message:`${e} is not in the working location.`,name:"warning"}})),c(t=>r({error:{message:t.message,name:"error"}})))}onBack(){}};o.\u0275fac=function(i){return new(i||o)(n(C),n(b),n(F),n(M))},o.\u0275cmp=l({type:o,selectors:[["ng-component"]],standalone:!0,features:[v],decls:4,vars:6,consts:[[1,"flex","justify-center","text-xl","font-bold","lg:text-4xl"],["controlName","itn",3,"data","formGroup","title","formSubmit","formBack"]],template:function(i,t){i&1&&(p(0,"h1",0),I(1,"Put Away"),u(),p(2,"single-input-form",1),g("formSubmit",function(){return t.onSubmit()})("formBack",function(){return t.onBack()}),k(3,"async"),u()),i&2&&(d(2),_("title","Scan ITN: ",t._stock.checkedItnsLength()+1," of ",t._stock.verifiedItns().length,""),h("data",S(3,4,t.data$))("formGroup",t.inputForm))},dependencies:[T,y,N,j,R,B,w],encapsulation:2});let a=o;return a})();export{H as ScanItnComponent};
