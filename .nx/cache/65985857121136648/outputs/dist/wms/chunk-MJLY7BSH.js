import{a as E}from"./chunk-SUC3P3VA.js";import"./chunk-CNRANGED.js";import{a as B}from"./chunk-E3B4WDOA.js";import{a as O}from"./chunk-OA6ZCSCG.js";import{a as N}from"./chunk-D3FIXZL7.js";import"./chunk-ADHMVREX.js";import{a as F}from"./chunk-VJKYRYVM.js";import"./chunk-I3G2JKLN.js";import"./chunk-LCEARWCQ.js";import"./chunk-4AGTE6D3.js";import"./chunk-5GWOD35Y.js";import"./chunk-PLQ7TNCQ.js";import"./chunk-C55YZZU5.js";import{i as S,k as M}from"./chunk-PJEV5NXI.js";import{A as f,G as T,p as I,x as P}from"./chunk-GWV5DZOT.js";import{$b as _,C,Da as c,Fb as l,Gb as d,Gc as s,Lc as v,Mc as y,Sb as a,ac as r,bc as o,cc as u,nc as p,xc as k,yc as h}from"./chunk-N7LPRJLK.js";function w(i,t){if(i&1&&(r(0,"div")(1,"label",2),k(2),o(),u(3,"input",3),o()),i&2){let b=t.$implicit;l(2),h(b.key),l(1),a("value",b.value)}}var D=(()=>{let t=class t{};t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=c({type:t,selectors:[["picking-info"]],inputs:{info:"info",MIC:"MIC"},standalone:!0,features:[s],decls:3,vars:4,consts:[["width","600","height","600","priority","",3,"ngSrc"],[4,"ngFor","ngForOf"],["for","ProductCode"],["type","text","name","ProductCode","id","ProductCode","disabled","",1,"block","w-full","border","border-gray-300","bg-gray-50","text-sm","text-gray-900","focus:border-blue-500","focus:ring-blue-500","dark:border-gray-600","dark:bg-gray-700","dark:text-white","dark:placeholder-gray-400","dark:focus:border-blue-500","dark:focus:ring-blue-500",3,"value"]],template:function(e,n){e&1&&(u(0,"img",0),_(1,w,4,2,"div",1),v(2,"keyvalue")),e&2&&(a("ngSrc",n.MIC),l(1),a("ngForOf",y(2,2,n.info)))},dependencies:[f,I,P,T],encapsulation:2,changeDetection:0});let i=t;return i})();var L=(()=>{let t=class t{constructor(m,e,n){this._router=m,this._actRoute=e,this._picking=n}ngOnInit(){this.data$=C(!0),this.info={Order:this._picking.itnInfo.OrderNumber+"-"+this._picking.itnInfo.NOSINumber,ProductType:this._picking.itnInfo.ProductType||"",PartNumber:this._picking.itnInfo.PartNumber,ProductCode:this._picking.itnInfo.ProductCode,Unit:this._picking.itnInfo.Unit,Message:this._picking.itnInfo.GlobaleMessage}}updatePhoto(){}updateProductType(){}onSubmit(){this._router.navigate(["../quantity"],{relativeTo:this._actRoute})}onBack(){this._router.navigate(["../itn"],{relativeTo:this._actRoute})}};t.\u0275fac=function(e){return new(e||t)(d(M),d(S),d(E))},t.\u0275cmp=c({type:t,selectors:[["ng-component"]],standalone:!0,features:[s],decls:7,vars:2,consts:[[3,"info","MIC"],[1,"grid","grid-cols-2","gap-2","md:h-48","lg:h-64"],["buttonText","Update Photo",3,"buttonClick"],["buttonText","Update Type",3,"buttonClick"],[3,"buttonClick"],["buttonText","Kickout"]],template:function(e,n){e&1&&(u(0,"picking-info",0),r(1,"div",1)(2,"green-button",2),p("buttonClick",function(){return n.updatePhoto()}),o(),r(3,"green-button",3),p("buttonClick",function(){return n.updateProductType()}),o(),r(4,"submit-button",4),p("buttonClick",function(){return n.onSubmit()}),o(),r(5,"normal-button",4),p("buttonClick",function(){return n.onBack()}),o(),u(6,"red-button",5),o()),e&2&&a("info",n.info)("MIC",n._picking.itnInfo.MIC)},dependencies:[f,D,B,N,O,F],encapsulation:2});let i=t;return i})();export{L as InfoComponent};
