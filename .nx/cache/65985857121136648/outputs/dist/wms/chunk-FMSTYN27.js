import{a as G}from"./chunk-GJX7JKAF.js";import{a as U,c as A}from"./chunk-YUDS3XHK.js";import{k as V,l as W}from"./chunk-MIXZFVL7.js";import{r as z,s as R}from"./chunk-FFJ3QZ3H.js";import{A as P,q as k,v as B}from"./chunk-GWV5DZOT.js";import{$b as h,Da as T,Ea as $,Fb as o,Gb as m,Ha as b,Ib as N,P as S,Sb as r,Ub as f,Vc as L,X as C,ac as c,ba as _,bc as d,cc as M,m as u,ma as x,n as v,na as I,o as y,oa as l,pc as g,qc as O,rc as j,w as a,wa as D,wc as E,xc as w,yc as F}from"./chunk-N7LPRJLK.js";function q(t,n){t&1&&(c(0,"span",3),M(1,"i",4)(2,"i",4)(3,"i",4)(4,"i",4),d())}function J(t,n){}function K(t,n){if(t&1&&(c(0,"div",8),w(1),d()),t&2){let i=g(2);o(1),F(i.nzTip)}}function Q(t,n){if(t&1&&(c(0,"div")(1,"div",5),h(2,J,0,0,"ng-template",6)(3,K,2,1,"div",7),d()()),t&2){let i=g(),e=E(1);o(1),f("ant-spin-rtl",i.dir==="rtl")("ant-spin-spinning",i.isLoading)("ant-spin-lg",i.nzSize==="large")("ant-spin-sm",i.nzSize==="small")("ant-spin-show-text",i.nzTip),o(1),r("ngTemplateOutlet",i.nzIndicator||e),o(1),r("ngIf",i.nzTip)}}function X(t,n){if(t&1&&(c(0,"div",9),j(1),d()),t&2){let i=g();f("ant-spin-blur",i.isLoading)}}var Y=["*"],H="spin",s=class s{constructor(n,i,e){this.nzConfigService=n,this.cdr=i,this.directionality=e,this._nzModuleName=H,this.nzIndicator=null,this.nzSize="default",this.nzTip=null,this.nzDelay=0,this.nzSimple=!1,this.nzSpinning=!0,this.destroy$=new u,this.spinning$=new v(this.nzSpinning),this.delay$=new y(1),this.isLoading=!1,this.dir="ltr"}ngOnInit(){this.delay$.pipe(x(this.nzDelay),_(),I(i=>i===0?this.spinning$:this.spinning$.pipe(C(e=>S(e?i:0)))),l(this.destroy$)).subscribe(i=>{this.isLoading=i,this.cdr.markForCheck()}),this.nzConfigService.getConfigChangeEventForComponent(H).pipe(l(this.destroy$)).subscribe(()=>this.cdr.markForCheck()),this.directionality.change?.pipe(l(this.destroy$)).subscribe(i=>{this.dir=i,this.cdr.detectChanges()}),this.dir=this.directionality.value}ngOnChanges(n){let{nzSpinning:i,nzDelay:e}=n;i&&this.spinning$.next(this.nzSpinning),e&&this.delay$.next(this.nzDelay)}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}};s.\u0275fac=function(i){return new(i||s)(m(V),m(N),m(U,8))},s.\u0275cmp=T({type:s,selectors:[["nz-spin"]],hostVars:2,hostBindings:function(i,e){i&2&&f("ant-spin-nested-loading",!e.nzSimple)},inputs:{nzIndicator:"nzIndicator",nzSize:"nzSize",nzTip:"nzTip",nzDelay:"nzDelay",nzSimple:"nzSimple",nzSpinning:"nzSpinning"},exportAs:["nzSpin"],features:[b],ngContentSelectors:Y,decls:4,vars:2,consts:[["defaultTemplate",""],[4,"ngIf"],["class","ant-spin-container",3,"ant-spin-blur",4,"ngIf"],[1,"ant-spin-dot","ant-spin-dot-spin"],[1,"ant-spin-dot-item"],[1,"ant-spin"],[3,"ngTemplateOutlet"],["class","ant-spin-text",4,"ngIf"],[1,"ant-spin-text"],[1,"ant-spin-container"]],template:function(i,e){i&1&&(O(),h(0,q,5,0,"ng-template",null,0,L)(2,Q,4,12,"div",1)(3,X,2,2,"div",2)),i&2&&(o(2),r("ngIf",e.isLoading),o(1),r("ngIf",!e.nzSimple))},dependencies:[k,B],encapsulation:2});var p=s;a([W()],p.prototype,"nzIndicator",void 0);a([R()],p.prototype,"nzDelay",void 0);a([z()],p.prototype,"nzSimple",void 0);a([z()],p.prototype,"nzSpinning",void 0);var mi=(()=>{let n=class n{};n.\u0275fac=function(Z){return new(Z||n)},n.\u0275mod=$({type:n}),n.\u0275inj=D({imports:[A,P,G]});let t=n;return t})();export{p as a,mi as b};
