import{a as N}from"./chunk-SUC3P3VA.js";import"./chunk-CNRANGED.js";import{a as T}from"./chunk-XHQXBUEX.js";import"./chunk-RMIKNTFD.js";import"./chunk-D3FIXZL7.js";import"./chunk-ADHMVREX.js";import"./chunk-VJKYRYVM.js";import"./chunk-I3G2JKLN.js";import"./chunk-LCEARWCQ.js";import"./chunk-4AGTE6D3.js";import"./chunk-5GWOD35Y.js";import"./chunk-POEXBOQJ.js";import{b as R}from"./chunk-MZCJXFXF.js";import{E as y,I as C,e as p,i as k,t as B}from"./chunk-L3THJMBJ.js";import"./chunk-PLQ7TNCQ.js";import"./chunk-C55YZZU5.js";import"./chunk-YUDS3XHK.js";import"./chunk-MIXZFVL7.js";import"./chunk-FFJ3QZ3H.js";import{i as F,k as b}from"./chunk-PJEV5NXI.js";import{A as S,w as I}from"./chunk-GWV5DZOT.js";import{C as m,Da as c,Gb as r,Gc as v,Lc as g,Mc as h,Sb as f,V as s,ac as l,bc as d,nc as _,qa as u}from"./chunk-N7LPRJLK.js";var O=(()=>{let i=class i{constructor(o,e,t,a){this._router=o,this._actRoute=e,this._fb=t,this._picking=a,this.inputForm=this._fb.nonNullable.group({itn:["",[p.required,p.pattern(R)]]})}ngOnInit(){this.data$=m(!0)}onSubmit(){this.data$=this._picking.fetchItnInfo$(this.inputForm.value.itn).pipe(u(()=>{this._router.navigate(["../info"],{relativeTo:this._actRoute})}),s(o=>m({error:{message:o.message,type:"error"}})))}onBack(){this._router.navigate(["../../"],{relativeTo:this._actRoute})}};i.\u0275fac=function(e){return new(e||i)(r(b),r(F),r(y),r(N))},i.\u0275cmp=c({type:i,selectors:[["ng-component"]],standalone:!0,features:[v],decls:2,vars:5,consts:[["controlName","itn","title","ITN:",3,"data","formGroup","isvalid","formSubmit","formBack"]],template:function(e,t){e&1&&(l(0,"single-input-form",0),_("formSubmit",function(){return t.onSubmit()})("formBack",function(){return t.onBack()}),g(1,"async"),d()),e&2&&f("data",h(1,3,t.data$))("formGroup",t.inputForm)("isvalid",t.inputForm.valid)},dependencies:[S,I,C,k,B,T],encapsulation:2});let n=i;return n})();export{O as ItnComponent};
