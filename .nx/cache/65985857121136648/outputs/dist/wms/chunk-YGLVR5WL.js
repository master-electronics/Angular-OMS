import{a as ae,b as E,c as he,f as ce,g as pe}from"./chunk-QQPJAVIB.js";import{a as c,b as de}from"./chunk-RMC6N2HF.js";import{g as ve}from"./chunk-WX6KJXZ2.js";import{s as se,t as le}from"./chunk-EXQESRXT.js";import{i as ye,j as ue}from"./chunk-W3KGMJG7.js";import{a as w,c as re}from"./chunk-YUDS3XHK.js";import{j as me,k as ge}from"./chunk-MIXZFVL7.js";import{j as ie,n as ne,r as oe}from"./chunk-FFJ3QZ3H.js";import{A as te,o as Z,u as ee}from"./chunk-GWV5DZOT.js";import{$b as P,Da as L,Ea as $,Fa as y,Fb as d,Gb as s,Ha as B,Ib as T,Mb as _,Pb as D,Qc as W,Rc as G,S as v,Sb as h,Sc as J,Ub as b,Uc as X,Vc as Y,_b as O,a as u,aa as R,ac as A,b as x,ba as k,bc as N,cc as F,dc as Q,ec as K,m,nc as U,oa as g,p as V,pc as S,vb as f,w as I,wa as j,wb as C,xc as H,yb as z,yc as q}from"./chunk-N7LPRJLK.js";var Ce=["overlay"];function ze(o,n){if(o&1&&(Q(0),H(1),K()),o&2){let r=S(2);d(1),q(r.nzTitle)}}function Te(o,n){if(o&1&&(A(0,"div",2)(1,"div",3)(2,"div",4),F(3,"span",5),N(),A(4,"div",6),P(5,ze,2,1,"ng-container",7),N()()()),o&2){let r=S();b("ant-tooltip-rtl",r.dir==="rtl"),h("ngClass",r._classMap)("ngStyle",r.nzOverlayStyle)("@.disabled",!!(r.noAnimation!=null&&r.noAnimation.nzNoAnimation))("nzNoAnimation",r.noAnimation==null?null:r.noAnimation.nzNoAnimation)("@zoomBigMotion","active"),d(3),h("ngStyle",r._contentStyleMap),d(1),h("ngStyle",r._contentStyleMap),d(1),h("nzStringTemplateOutlet",r.nzTitle)("nzStringTemplateOutletContext",r.nzTitleContext)}}var _e=(()=>{let n=class n{get _title(){return this.title||this.directiveTitle||null}get _content(){return this.content||this.directiveContent||null}get _trigger(){return typeof this.trigger<"u"?this.trigger:"hover"}get _placement(){let e=this.placement;return Array.isArray(e)&&e.length>0?e:typeof e=="string"&&e?[e]:["top"]}get _visible(){return(typeof this.visible<"u"?this.visible:this.internalVisible)||!1}get _mouseEnterDelay(){return this.mouseEnterDelay||.15}get _mouseLeaveDelay(){return this.mouseLeaveDelay||.1}get _overlayClassName(){return this.overlayClassName||null}get _overlayStyle(){return this.overlayStyle||null}getProxyPropertyMap(){return{noAnimation:["noAnimation",()=>!!this.noAnimation]}}constructor(e,t,i,l,a,fe){this.elementRef=e,this.hostView=t,this.resolver=i,this.renderer=l,this.noAnimation=a,this.nzConfigService=fe,this.visibleChange=new _,this.internalVisible=!1,this.destroy$=new m,this.triggerDisposables=[]}ngOnChanges(e){let{trigger:t}=e;t&&!t.isFirstChange()&&this.registerTriggers(),this.component&&this.updatePropertiesByChanges(e)}ngAfterViewInit(){this.createComponent(),this.registerTriggers()}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete(),this.clearTogglingTimer(),this.removeTriggerListeners()}show(){this.component?.show()}hide(){this.component?.hide()}updatePosition(){this.component&&this.component.updatePosition()}createComponent(){let e=this.componentRef;this.component=e.instance,this.renderer.removeChild(this.renderer.parentNode(this.elementRef.nativeElement),e.location.nativeElement),this.component.setOverlayOrigin(this.origin||this.elementRef),this.initProperties();let t=this.component.nzVisibleChange.pipe(k());t.pipe(g(this.destroy$)).subscribe(i=>{this.internalVisible=i,this.visibleChange.emit(i)}),t.pipe(v(i=>i),R(0,V),v(()=>!!this.component?.overlay?.overlayRef),g(this.destroy$)).subscribe(()=>{this.component?.updatePosition()})}registerTriggers(){let e=this.elementRef.nativeElement,t=this.trigger;if(this.removeTriggerListeners(),t==="hover"){let i;this.triggerDisposables.push(this.renderer.listen(e,"mouseenter",()=>{this.delayEnterLeave(!0,!0,this._mouseEnterDelay)})),this.triggerDisposables.push(this.renderer.listen(e,"mouseleave",()=>{this.delayEnterLeave(!0,!1,this._mouseLeaveDelay),this.component?.overlay.overlayRef&&!i&&(i=this.component.overlay.overlayRef.overlayElement,this.triggerDisposables.push(this.renderer.listen(i,"mouseenter",()=>{this.delayEnterLeave(!1,!0,this._mouseEnterDelay)})),this.triggerDisposables.push(this.renderer.listen(i,"mouseleave",()=>{this.delayEnterLeave(!1,!1,this._mouseLeaveDelay)})))}))}else t==="focus"?(this.triggerDisposables.push(this.renderer.listen(e,"focusin",()=>this.show())),this.triggerDisposables.push(this.renderer.listen(e,"focusout",()=>this.hide()))):t==="click"&&this.triggerDisposables.push(this.renderer.listen(e,"click",i=>{i.preventDefault(),this.show()}))}updatePropertiesByChanges(e){this.updatePropertiesByKeys(Object.keys(e))}updatePropertiesByKeys(e){let t=u({title:["nzTitle",()=>this._title],directiveTitle:["nzTitle",()=>this._title],content:["nzContent",()=>this._content],directiveContent:["nzContent",()=>this._content],trigger:["nzTrigger",()=>this._trigger],placement:["nzPlacement",()=>this._placement],visible:["nzVisible",()=>this._visible],mouseEnterDelay:["nzMouseEnterDelay",()=>this._mouseEnterDelay],mouseLeaveDelay:["nzMouseLeaveDelay",()=>this._mouseLeaveDelay],overlayClassName:["nzOverlayClassName",()=>this._overlayClassName],overlayStyle:["nzOverlayStyle",()=>this._overlayStyle],arrowPointAtCenter:["nzArrowPointAtCenter",()=>this.arrowPointAtCenter]},this.getProxyPropertyMap());(e||Object.keys(t).filter(i=>!i.startsWith("directive"))).forEach(i=>{if(t[i]){let[l,a]=t[i];this.updateComponentValue(l,a())}}),this.component?.updateByDirective()}initProperties(){this.updatePropertiesByKeys()}updateComponentValue(e,t){typeof t<"u"&&(this.component[e]=t)}delayEnterLeave(e,t,i=-1){this.delayTimer?this.clearTogglingTimer():i>0?this.delayTimer=setTimeout(()=>{this.delayTimer=void 0,t?this.show():this.hide()},i*1e3):t&&e?this.show():this.hide()}removeTriggerListeners(){this.triggerDisposables.forEach(e=>e()),this.triggerDisposables.length=0}clearTogglingTimer(){this.delayTimer&&(clearTimeout(this.delayTimer),this.delayTimer=void 0)}};n.\u0275fac=function(t){return new(t||n)(s(C),s(O),s(f),s(z),s(c),s(ge))},n.\u0275dir=y({type:n,features:[B]});let o=n;return o})(),De=(()=>{let n=class n{set nzVisible(e){let t=ne(e);this._visible!==t&&(this._visible=t,this.nzVisibleChange.next(t))}get nzVisible(){return this._visible}set nzTrigger(e){this._trigger=e}get nzTrigger(){return this._trigger}set nzPlacement(e){let t=e.map(i=>ae[i]);this._positions=[...t,...E]}constructor(e,t,i){this.cdr=e,this.directionality=t,this.noAnimation=i,this.nzTitle=null,this.nzContent=null,this.nzArrowPointAtCenter=!1,this.nzOverlayStyle={},this.nzBackdrop=!1,this.nzVisibleChange=new m,this._visible=!1,this._trigger="hover",this.preferredPlacement="top",this.dir="ltr",this._classMap={},this._prefix="ant-tooltip",this._positions=[...E],this.destroy$=new m}ngOnInit(){this.directionality.change?.pipe(g(this.destroy$)).subscribe(e=>{this.dir=e,this.cdr.detectChanges()}),this.dir=this.directionality.value}ngOnDestroy(){this.nzVisibleChange.complete(),this.destroy$.next(),this.destroy$.complete()}show(){this.nzVisible||(this.isEmpty()||(this.nzVisible=!0,this.nzVisibleChange.next(!0),this.cdr.detectChanges()),this.origin&&this.overlay&&this.overlay.overlayRef&&this.overlay.overlayRef.getDirection()==="rtl"&&this.overlay.overlayRef.setDirection("ltr"))}hide(){this.nzVisible&&(this.nzVisible=!1,this.nzVisibleChange.next(!1),this.cdr.detectChanges())}updateByDirective(){this.updateStyles(),this.cdr.detectChanges(),Promise.resolve().then(()=>{this.updatePosition(),this.updateVisibilityByTitle()})}updatePosition(){this.origin&&this.overlay&&this.overlay.overlayRef&&this.overlay.overlayRef.updatePosition()}onPositionChange(e){this.preferredPlacement=he(e),this.updateStyles(),this.cdr.detectChanges()}setOverlayOrigin(e){this.origin=e,this.cdr.markForCheck()}onClickOutside(e){!this.origin.nativeElement.contains(e.target)&&this.nzTrigger!==null&&this.hide()}updateVisibilityByTitle(){this.isEmpty()&&this.hide()}updateStyles(){this._classMap={[this.nzOverlayClassName]:!0,[`${this._prefix}-placement-${this.preferredPlacement}`]:!0}}};n.\u0275fac=function(t){return new(t||n)(s(T),s(w,8),s(c))},n.\u0275dir=y({type:n,viewQuery:function(t,i){if(t&1&&J(Ce,5),t&2){let l;G(l=X())&&(i.overlay=l.first)}}});let o=n;return o})();function be(o){return o instanceof W?!1:o===""||!ie(o)}var p=class p extends _e{constructor(n,r,e,t,i){super(n,r,e,t,i),this.titleContext=null,this.trigger="hover",this.placement="top",this.visibleChange=new _,this.componentRef=this.hostView.createComponent(Oe)}getProxyPropertyMap(){return x(u({},super.getProxyPropertyMap()),{nzTooltipColor:["nzColor",()=>this.nzTooltipColor],nzTooltipTitleContext:["nzTitleContext",()=>this.titleContext]})}};p.\u0275fac=function(r){return new(r||p)(s(C),s(O),s(f),s(z),s(c,9))},p.\u0275dir=y({type:p,selectors:[["","nz-tooltip",""]],hostVars:2,hostBindings:function(r,e){r&2&&b("ant-tooltip-open",e.visible)},inputs:{title:["nzTooltipTitle","title"],titleContext:["nzTooltipTitleContext","titleContext"],directiveTitle:["nz-tooltip","directiveTitle"],trigger:["nzTooltipTrigger","trigger"],placement:["nzTooltipPlacement","placement"],origin:["nzTooltipOrigin","origin"],visible:["nzTooltipVisible","visible"],mouseEnterDelay:["nzTooltipMouseEnterDelay","mouseEnterDelay"],mouseLeaveDelay:["nzTooltipMouseLeaveDelay","mouseLeaveDelay"],overlayClassName:["nzTooltipOverlayClassName","overlayClassName"],overlayStyle:["nzTooltipOverlayStyle","overlayStyle"],arrowPointAtCenter:["nzTooltipArrowPointAtCenter","arrowPointAtCenter"],nzTooltipColor:"nzTooltipColor"},outputs:{visibleChange:"nzTooltipVisibleChange"},exportAs:["nzTooltip"],features:[D]});var M=p;I([oe()],M.prototype,"arrowPointAtCenter",void 0);var Oe=(()=>{let n=class n extends De{constructor(e,t,i){super(e,t,i),this.nzTitle=null,this.nzTitleContext=null,this._contentStyleMap={}}isEmpty(){return be(this.nzTitle)}updateStyles(){let e=this.nzColor&&me(this.nzColor);this._classMap={[this.nzOverlayClassName]:!0,[`${this._prefix}-placement-${this.preferredPlacement}`]:!0,[`${this._prefix}-${this.nzColor}`]:e},this._contentStyleMap={backgroundColor:this.nzColor&&!e?this.nzColor:null}}};n.\u0275fac=function(t){return new(t||n)(s(T),s(w,8),s(c,9))},n.\u0275cmp=L({type:n,selectors:[["nz-tooltip"]],exportAs:["nzTooltipComponent"],features:[D],decls:2,vars:5,consts:[["cdkConnectedOverlay","","nzConnectedOverlay","",3,"cdkConnectedOverlayOrigin","cdkConnectedOverlayOpen","cdkConnectedOverlayPositions","cdkConnectedOverlayPush","nzArrowPointAtCenter","overlayOutsideClick","detach","positionChange"],["overlay","cdkConnectedOverlay"],[1,"ant-tooltip",3,"ngClass","ngStyle","nzNoAnimation"],[1,"ant-tooltip-content"],[1,"ant-tooltip-arrow"],[1,"ant-tooltip-arrow-content",3,"ngStyle"],[1,"ant-tooltip-inner",3,"ngStyle"],[4,"nzStringTemplateOutlet","nzStringTemplateOutletContext"]],template:function(t,i){t&1&&(P(0,Te,6,11,"ng-template",0,1,Y),U("overlayOutsideClick",function(a){return i.onClickOutside(a)})("detach",function(){return i.hide()})("positionChange",function(a){return i.onPositionChange(a)})),t&2&&h("cdkConnectedOverlayOrigin",i.origin)("cdkConnectedOverlayOpen",i._visible)("cdkConnectedOverlayPositions",i._positions)("cdkConnectedOverlayPush",!0)("nzArrowPointAtCenter",i.nzArrowPointAtCenter)},dependencies:[Z,ee,se,ye,ce,c],encapsulation:2,data:{animation:[ve]},changeDetection:0});let o=n;return o})(),nt=(()=>{let n=class n{};n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=$({type:n}),n.\u0275inj=j({imports:[re,te,le,ue,pe,de]});let o=n;return o})();export{_e as a,M as b,Oe as c,nt as d};
