import{B as $,I as j,d as q,f as D,h as O,i as G,p as Q,t as R,u as A}from"./chunk-L3THJMBJ.js";import{m as z,n as M}from"./chunk-MIXZFVL7.js";import{A as L,o as k,p as T,q as V}from"./chunk-GWV5DZOT.js";import{$b as p,Da as _,Fb as u,Gb as S,Gc as F,Ia as v,Ja as h,Mb as x,Rc as I,Sb as c,Sc as b,Uc as w,Vc as E,ac as r,bc as a,cc as f,gc as C,nc as d,pc as g,wc as y,xc as s,zc as N}from"./chunk-N7LPRJLK.js";var B=["input"];function H(t,i){t&1&&(r(0,"div"),s(1," This field is required. "),a())}function J(t,i){t&1&&(r(0,"div"),s(1," Must select a country! "),a())}function K(t,i){if(t&1&&(r(0,"div",10),p(1,H,2,0,"div",11)(2,J,2,0,"div",11),a()),t&2){let n=g();u(1),c("ngIf",n.inputForm.get(n.controlName).errors==null?null:n.inputForm.get(n.controlName).errors.required),u(1),c("ngIf",n.inputForm.get(n.controlName).errors==null?null:n.inputForm.get(n.controlName).errors.notExist)}}function P(t,i){t&1&&(r(0,"div",12),s(1,"no error"),a())}function U(t,i){if(t&1){let n=C();r(0,"ul",13)(1,"li")(2,"a",14),d("click",function(){let e=v(n).$implicit,l=g();return h(l.onClick(e))}),s(3),a()()()}if(t&2){let n=i.$implicit;u(3),N(" ",n.name," ")}}var me=(()=>{let i=class i{ngAfterViewInit(){this.inputFiled?.nativeElement.focus()}constructor(m){this.controlContainer=m,this.formSubmit=new x}ngOnInit(){this.inputForm=this.controlContainer.control}onClick(m){this.inputForm.get(this.controlName).setValue(m.name)}onSubmit(){this.inputForm.valid&&this.formSubmit.emit()}clean(){this.inputForm.get(this.controlName).setValue(""),this.inputFiled.nativeElement.focus()}};i.\u0275fac=function(o){return new(o||i)(S(D))},i.\u0275cmp=_({type:i,selectors:[["search-list-input"]],viewQuery:function(o,e){if(o&1&&b(B,5),o&2){let l;I(l=w())&&(e.inputFiled=l.first)}},inputs:{dataSource:"dataSource",controlName:"controlName"},outputs:{formSubmit:"formSubmit"},standalone:!0,features:[F],decls:11,vars:7,consts:[[1,"text-lg","md:text-xl","lg:text-4xl",3,"formGroup","ngSubmit"],[1,"relative"],["type","search","autocomplete","off","required","",1,"focus:shadow-outline","h-fit","w-full","appearance-none","rounded","border","px-3","py-2","text-lg","leading-tight","text-gray-700","shadow","focus:outline-none","md:text-xl","lg:text-2xl","xl:text-4xl",3,"formControlName","ngClass","id"],["input",""],[1,"absolute","right-2.5",3,"click"],["nz-icon","","nzType","close-circle","nzTheme","outline"],["class","italic text-red-500",4,"ngIf","ngIfElse"],["NonError",""],["id","dropdown",1,"fixed","z-10","w-1/3","divide-y","divide-gray-100","rounded","bg-white","shadow","dark:bg-gray-700"],["class"," text-gray-700 dark:text-gray-200",4,"ngFor","ngForOf"],[1,"italic","text-red-500"],[4,"ngIf"],[1,"opacity-0"],[1,"text-gray-700","dark:text-gray-200"],[1,"inline-flex","w-full","px-4","hover:bg-gray-100","dark:hover:bg-gray-600","dark:hover:text-white",3,"click"]],template:function(o,e){if(o&1&&(r(0,"form",0),d("ngSubmit",function(){return e.onSubmit()}),r(1,"div",1),f(2,"input",2,3),r(4,"a",4),d("click",function(){return e.clean()}),f(5,"span",5),a()(),p(6,K,3,2,"div",6)(7,P,2,0,"ng-template",null,7,E),r(9,"div",8),p(10,U,4,1,"ul",9),a()()),o&2){let l=y(8);c("formGroup",e.inputForm),u(2),c("formControlName",e.controlName)("ngClass",e.inputForm.get(e.controlName).invalid&&e.inputForm.get(e.controlName).dirty?"border-red-500":"border-blue-500")("id",e.controlName),u(4),c("ngIf",e.inputForm.get(e.controlName).invalid&&e.inputForm.get(e.controlName).dirty)("ngIfElse",l),u(4),c("ngForOf",e.dataSource)}},dependencies:[L,k,T,V,j,Q,q,O,G,$,R,A,M,z],encapsulation:2});let t=i;return t})();export{me as a};
