import{f as q}from"./chunk-WX6KJXZ2.js";import{i as W,j as Z}from"./chunk-W3KGMJG7.js";import{a as R,c as U}from"./chunk-YUDS3XHK.js";import{k as G,l as b,m as L,n as P}from"./chunk-MIXZFVL7.js";import{r as x}from"./chunk-FFJ3QZ3H.js";import{A as $,q as j}from"./chunk-GWV5DZOT.js";import{$b as c,Da as E,Ea as M,Fb as i,Gb as h,Ha as O,Ia as v,Ib as k,Ja as T,Mb as B,Sb as o,Ub as F,Vc as N,ac as l,bc as s,cc as y,dc as m,ec as _,fc as V,gc as I,m as w,nc as S,oa as C,pc as r,w as z,wa as D,wc as A,xc as u,yc as g}from"./chunk-N7LPRJLK.js";function K(t,n){t&1&&V(0)}function Q(t,n){if(t&1&&(m(0),c(1,K,1,0,"ng-container",9),_()),t&2){let e=r(3);i(1),o("nzStringTemplateOutlet",e.nzIcon)}}function X(t,n){if(t&1&&y(0,"span",10),t&2){let e=r(3);o("nzType",e.nzIconType||e.inferredIconType)("nzTheme",e.iconTheme)}}function Y(t,n){if(t&1&&(l(0,"div",6),c(1,Q,2,1,"ng-container",7)(2,X,1,2,"ng-template",null,8,N),s()),t&2){let e=A(3),a=r(2);i(1),o("ngIf",a.nzIcon)("ngIfElse",e)}}function ee(t,n){if(t&1&&(m(0),u(1),_()),t&2){let e=r(4);i(1),g(e.nzMessage)}}function te(t,n){if(t&1&&(l(0,"span",14),c(1,ee,2,1,"ng-container",9),s()),t&2){let e=r(3);i(1),o("nzStringTemplateOutlet",e.nzMessage)}}function ne(t,n){if(t&1&&(m(0),u(1),_()),t&2){let e=r(4);i(1),g(e.nzDescription)}}function ie(t,n){if(t&1&&(l(0,"span",15),c(1,ne,2,1,"ng-container",9),s()),t&2){let e=r(3);i(1),o("nzStringTemplateOutlet",e.nzDescription)}}function oe(t,n){if(t&1&&(l(0,"div",11),c(1,te,2,1,"span",12)(2,ie,2,1,"span",13),s()),t&2){let e=r(2);i(1),o("ngIf",e.nzMessage),i(1),o("ngIf",e.nzDescription)}}function re(t,n){if(t&1&&(m(0),u(1),_()),t&2){let e=r(3);i(1),g(e.nzAction)}}function ae(t,n){if(t&1&&(l(0,"div",16),c(1,re,2,1,"ng-container",9),s()),t&2){let e=r(2);i(1),o("nzStringTemplateOutlet",e.nzAction)}}function ce(t,n){t&1&&y(0,"span",19)}function le(t,n){if(t&1&&(m(0),l(1,"span",20),u(2),s(),_()),t&2){let e=r(4);i(2),g(e.nzCloseText)}}function se(t,n){if(t&1&&(m(0),c(1,le,3,1,"ng-container",9),_()),t&2){let e=r(3);i(1),o("nzStringTemplateOutlet",e.nzCloseText)}}function pe(t,n){if(t&1){let e=I();l(0,"button",17),S("click",function(){v(e);let p=r(2);return T(p.closeAlert())}),c(1,ce,1,0,"ng-template",null,18,N)(3,se,2,1,"ng-container",7),s()}if(t&2){let e=A(2),a=r(2);i(3),o("ngIf",a.nzCloseText)("ngIfElse",e)}}function me(t,n){if(t&1){let e=I();l(0,"div",1),S("@slideAlertMotion.done",function(){v(e);let p=r();return T(p.onFadeAnimationDone())}),c(1,Y,4,2,"div",2)(2,oe,3,2,"div",3)(3,ae,2,1,"div",4)(4,pe,4,2,"button",5),s()}if(t&2){let e=r();F("ant-alert-rtl",e.dir==="rtl")("ant-alert-success",e.nzType==="success")("ant-alert-info",e.nzType==="info")("ant-alert-warning",e.nzType==="warning")("ant-alert-error",e.nzType==="error")("ant-alert-no-icon",!e.nzShowIcon)("ant-alert-banner",e.nzBanner)("ant-alert-closable",e.nzCloseable)("ant-alert-with-description",!!e.nzDescription),o("@.disabled",e.nzNoAnimation)("@slideAlertMotion",void 0),i(1),o("ngIf",e.nzShowIcon),i(1),o("ngIf",e.nzMessage||e.nzDescription),i(1),o("ngIf",e.nzAction),i(1),o("ngIf",e.nzCloseable||e.nzCloseText)}}var H="alert",d=class d{constructor(n,e,a){this.nzConfigService=n,this.cdr=e,this.directionality=a,this._nzModuleName=H,this.nzAction=null,this.nzCloseText=null,this.nzIconType=null,this.nzMessage=null,this.nzDescription=null,this.nzType="info",this.nzCloseable=!1,this.nzShowIcon=!1,this.nzBanner=!1,this.nzNoAnimation=!1,this.nzIcon=null,this.nzOnClose=new B,this.closed=!1,this.iconTheme="fill",this.inferredIconType="info-circle",this.dir="ltr",this.isTypeSet=!1,this.isShowIconSet=!1,this.destroy$=new w,this.nzConfigService.getConfigChangeEventForComponent(H).pipe(C(this.destroy$)).subscribe(()=>{this.cdr.markForCheck()})}ngOnInit(){this.directionality.change?.pipe(C(this.destroy$)).subscribe(n=>{this.dir=n,this.cdr.detectChanges()}),this.dir=this.directionality.value}closeAlert(){this.closed=!0}onFadeAnimationDone(){this.closed&&this.nzOnClose.emit(!0)}ngOnChanges(n){let{nzShowIcon:e,nzDescription:a,nzType:p,nzBanner:J}=n;if(e&&(this.isShowIconSet=!0),p)switch(this.isTypeSet=!0,this.nzType){case"error":this.inferredIconType="close-circle";break;case"success":this.inferredIconType="check-circle";break;case"info":this.inferredIconType="info-circle";break;case"warning":this.inferredIconType="exclamation-circle";break}a&&(this.iconTheme=this.nzDescription?"outline":"fill"),J&&(this.isTypeSet||(this.nzType="warning"),this.isShowIconSet||(this.nzShowIcon=!0))}ngOnDestroy(){this.destroy$.next(!0),this.destroy$.complete()}};d.\u0275fac=function(e){return new(e||d)(h(G),h(k),h(R,8))},d.\u0275cmp=E({type:d,selectors:[["nz-alert"]],inputs:{nzAction:"nzAction",nzCloseText:"nzCloseText",nzIconType:"nzIconType",nzMessage:"nzMessage",nzDescription:"nzDescription",nzType:"nzType",nzCloseable:"nzCloseable",nzShowIcon:"nzShowIcon",nzBanner:"nzBanner",nzNoAnimation:"nzNoAnimation",nzIcon:"nzIcon"},outputs:{nzOnClose:"nzOnClose"},exportAs:["nzAlert"],features:[O],decls:1,vars:1,consts:[["class","ant-alert",3,"ant-alert-rtl","ant-alert-success","ant-alert-info","ant-alert-warning","ant-alert-error","ant-alert-no-icon","ant-alert-banner","ant-alert-closable","ant-alert-with-description",4,"ngIf"],[1,"ant-alert"],["class","ant-alert-icon",4,"ngIf"],["class","ant-alert-content",4,"ngIf"],["class","ant-alert-action",4,"ngIf"],["type","button","tabindex","0","class","ant-alert-close-icon",3,"click",4,"ngIf"],[1,"ant-alert-icon"],[4,"ngIf","ngIfElse"],["iconDefaultTemplate",""],[4,"nzStringTemplateOutlet"],["nz-icon","",3,"nzType","nzTheme"],[1,"ant-alert-content"],["class","ant-alert-message",4,"ngIf"],["class","ant-alert-description",4,"ngIf"],[1,"ant-alert-message"],[1,"ant-alert-description"],[1,"ant-alert-action"],["type","button","tabindex","0",1,"ant-alert-close-icon",3,"click"],["closeDefaultTemplate",""],["nz-icon","","nzType","close"],[1,"ant-alert-close-text"]],template:function(e,a){e&1&&c(0,me,5,24,"div",0),e&2&&o("ngIf",!a.closed)},dependencies:[j,L,W],encapsulation:2,data:{animation:[q]},changeDetection:0});var f=d;z([b(),x()],f.prototype,"nzCloseable",void 0);z([b(),x()],f.prototype,"nzShowIcon",void 0);z([x()],f.prototype,"nzBanner",void 0);z([x()],f.prototype,"nzNoAnimation",void 0);var Fe=(()=>{let n=class n{};n.\u0275fac=function(p){return new(p||n)},n.\u0275mod=M({type:n}),n.\u0275inj=D({imports:[U,$,P,Z]});let t=n;return t})();export{f as a,Fe as b};
