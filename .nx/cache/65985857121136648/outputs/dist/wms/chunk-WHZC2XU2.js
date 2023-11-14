import{a as pe}from"./chunk-GC5SLUA7.js";import{a as Y}from"./chunk-4AGTE6D3.js";import"./chunk-5GWOD35Y.js";import{a as oe,b as ae}from"./chunk-CRZYDNRB.js";import{a as se,b as me,c as le}from"./chunk-V5UEWFGK.js";import{a as O}from"./chunk-PLQ7TNCQ.js";import{f as J,h as K,j as V}from"./chunk-C55YZZU5.js";import{a as re}from"./chunk-E6LDBMP7.js";import{a as Z,c as ee,d as te,e as ie,f as ne}from"./chunk-GFVCXK67.js";import"./chunk-WOYNEQEU.js";import"./chunk-XSY6ZNJP.js";import"./chunk-W3KGMJG7.js";import"./chunk-B3MPBRHZ.js";import"./chunk-YUDS3XHK.js";import"./chunk-MIXZFVL7.js";import"./chunk-FFJ3QZ3H.js";import{k as U,l as W,n as Q}from"./chunk-PJEV5NXI.js";import{A as B,p as C,q as y,w as q}from"./chunk-GWV5DZOT.js";import{$b as d,Aa as x,Ba as j,Da as _,Dc as R,Fb as a,Gb as v,Gc as z,H as w,Lc as A,Mc as X,O as L,P as N,Sb as p,U as P,Vc as $,X as G,ac as l,bc as s,cc as g,g as k,ja as T,pc as u,sc as I,tb as D,va as h,wc as H,xc as c,yc as f}from"./chunk-N7LPRJLK.js";var he=V`
    query fetchMenuList($pageName: String) {
  fetchMenuList(pageName: $pageName) {
    _id
    ParentID
    Route
    RouteID
    Front
    Highlight
    End
    CoverSrc
    ADGroupProtected
    Order
    Level
    Groups
    Title
  }
}
    `,ce=(()=>{let t=class t extends K{constructor(r){super(r),this.document=he,this.client="wmsNodejs"}};t.\u0275fac=function(e){return new(e||t)(x(J))},t.\u0275prov=h({token:t,factory:t.\u0275fac,providedIn:"root"});let i=t;return i})();var S=(()=>{let t=class t{constructor(r){this._fetchMenuList=r,this.userInfo=j(Y),this.menuListSubscription=new k}getRootItems(){this.rootMenuItems=this.menuItems.filter(r=>r.ParentID==null),this.menusLoaded=Promise.resolve(!0)}getMenu(r){this.tempItems=[],this.menuItems=[],this.menuListSubscription.add(this._fetchMenuList.fetch({pageName:r}).subscribe({next:e=>{e.data.fetchMenuList.map(n=>{let m=!1,E=this.userInfo.userGroups.toString().split(","),F=n.Groups?n.Groups.split(","):null;E.map(ue=>{F&&F.includes(ue)&&(m=!0)}),this.tempItems.push({_id:n._id,ParentID:n.ParentID,Route:n.Route,Front:n.Front?n.Front:"",Highlight:n.Highlight?n.Highlight:"",End:n.End?n.End:"",CoverSrc:n.CoverSrc,ADGroupProtected:n.ADGroupProtected,Order:n.Order,Level:n.Level,Expandable:!1,Expanded:!1,Children:[],Groups:n.Groups?n.Groups.split(","):[],Authorized:m,Title:n.Title})})},error:e=>{console.log(e)},complete:()=>{this.parseMenu(),this.getRootItems()}}))}parseMenu(){this.tempItems.filter(e=>e.ParentID==null).map(e=>{let n=this.tempItems.filter(m=>m.ParentID==e._id);n.map(m=>{this.parseChildren(m)}),this.menuItems.push({_id:e._id,ParentID:e.ParentID,Route:e.Route,Front:e.Front,Highlight:e.Highlight,End:e.End,CoverSrc:e.CoverSrc,ADGroupProtected:e.ADGroupProtected,Order:e.Order,Level:e.Level,Expandable:!1,Expanded:!1,Children:n,Title:e.Title})})}parseChildren(r){let e=this.tempItems.find(m=>m._id==r.ParentID),n=this.tempItems.filter(m=>m.ParentID==r._id);n.map(m=>{this.parseChildren(m)}),n.length>0&&e&&(e.Expandable=!0,r.Children=n)}ngOnDestroy(){this.menuListSubscription.unsubscribe()}};t.\u0275fac=function(e){return new(e||t)(x(ce))},t.\u0275prov=h({token:t,factory:t.\u0275fac,providedIn:"root"});let i=t;return i})();function xe(i,t){if(i&1&&g(0,"menu-item",7),i&2){let o=u(2).$implicit;p("children",o.Children)}}function _e(i,t){if(i&1&&(l(0,"div",2)(1,"a",3)(2,"span",4)(3,"span"),c(4),s(),l(5,"span",5),c(6),s(),l(7,"span"),c(8),s(),d(9,xe,1,1,"menu-item",6),s()()()),i&2){let o=u().$implicit;a(1),I("routerLink",o.Route),a(3),f(o.Front),a(2),f(o.Highlight),a(2),f(o.End),a(1),p("ngIf",o.Children)}}function ze(i,t){if(i&1&&(l(0,"div"),d(1,_e,10,5,"div",1),s()),i&2){let o=t.$implicit;a(1),p("ngIf",!o.ADGroupProtected||o.Authorized)}}var de=(()=>{let t=class t{};t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=_({type:t,selectors:[["menu-item"]],inputs:{children:"children"},standalone:!0,features:[z],decls:1,vars:1,consts:[[4,"ngFor","ngForOf"],["class","grid gap-4 text-base",4,"ngIf"],[1,"grid","gap-4","text-base"],[1,"mt-3",3,"routerLink"],[1,"mt-3"],[1,"font-bold","text-yellow-500"],[3,"children",4,"ngIf"],[3,"children"]],template:function(e,n){e&1&&d(0,ze,2,1,"div",0),e&2&&p("ngForOf",n.children)},dependencies:[t,B,C,y,Q,W],encapsulation:2});let i=t;return i})();var M=(()=>{let t=class t{constructor(){this._keydown$=L(window,"keydown").pipe(T()),this.shortCut$=this._keydown$.pipe(P(this._keydown$.pipe(G(()=>N(300)))),w(r=>r),w(r=>{let e="";return r.map(n=>e+=n.key.toLowerCase()),e}))}};t.\u0275fac=function(e){return new(e||t)},t.\u0275prov=h({token:t,factory:t.\u0275fac});let i=t;return i})();function ye(i,t){if(i&1&&(l(0,"div")(1,"h1",4),c(2," Web-based Information Management System "),s(),l(3,"p",5),c(4,"New feature documentation."),s(),l(5,"button",6)(6,"a",7),c(7," What's New"),s()()()),i&2){let o=u();a(6),p("href",o.changelogurl,D)}}function be(i,t){if(i&1&&g(0,"img",17),i&2){let o=u(2).$implicit;I("alt",o.Front+o.Highlight+o.End),I("src",o.CoverSrc,D)}}function Se(i,t){if(i&1&&d(0,be,1,2,"img",16),i&2){let o=u(3);p("ngIf",!o.isMobile)}}function Me(i,t){if(i&1&&(l(0,"div",10)(1,"nz-card",11)(2,"h1",12)(3,"span"),c(4),s(),l(5,"span",13),c(6),s(),l(7,"span"),c(8),s()(),g(9,"menu-item",14),s(),d(10,Se,1,1,"ng-template",null,15,$),s()),i&2){let o=t.$implicit,r=H(11);a(1),p("nzCover",r),a(3),f(o.Front),a(2),f(o.Highlight),a(2),f(o.End),a(1),p("children",o.Children)}}function Ee(i,t){if(i&1&&(l(0,"div",8),d(1,Me,12,5,"div",9),s()),i&2){let o=u();a(1),p("ngForOf",o.menuService.rootMenuItems)}}var et=(()=>{let t=class t{constructor(r,e,n,m){this.menuService=r,this._title=e,this._shortCut=n,this._router=m,this.changelogurl=O.changelogurl,this.title="Master Electronics",this.isMobile=!0,this._title.update(this.title),this.menuService.getMenu("home"),this._shortCut.shortCut$.pipe(pe()).subscribe(E=>this.quickLink(E))}quickLink(r){let e="/";if(r){switch(r[0]){case"w":switch(r[1]){case"i":e="/agin";break;case"o":e="/agout";break;case"Q":e="/qc";break;case"r":e="/receiptreceiving";break;case"s":e="/stocking";break}break;default:break}this._router.navigateByUrl(e)}}};t.\u0275fac=function(e){return new(e||t)(v(S),v(re),v(M),v(U))},t.\u0275cmp=_({type:t,selectors:[["app-home"]],standalone:!0,features:[R([S,M]),z],decls:5,vars:4,consts:[["nz-row","","nzJustify","center"],["nz-col","","nzXs","24","nzSm","22","nzMd","20","nzLg","20","nzXl","18","nzXXl","16"],[4,"ngIf"],["nz-row","","nzGutter","32","class","md:mt-6",4,"ngIf"],["nz-row","",1,"text-4xl","font-bold"],["nz-row","",1,"text-xl"],["nz-button","","nzType","primary",1,"text-lg","font-sans"],["target","_blank",3,"href"],["nz-row","","nzGutter","32",1,"md:mt-6"],["nz-col","","nzXs","24","nzSm","24","nzMd","12","nzLg","12","nzXl","8","nzXXl","6",4,"ngFor","ngForOf"],["nz-col","","nzXs","24","nzSm","24","nzMd","12","nzLg","12","nzXl","8","nzXXl","6"],["nzBorderless","",3,"nzCover"],[1,"text-xl","font-semibold"],[1,"text-yellow-500","font-bold"],[3,"children"],["cover",""],["style","width: 100px;",3,"alt","src",4,"ngIf"],[2,"width","100px",3,"alt","src"]],template:function(e,n){e&1&&(l(0,"div",0)(1,"div",1),d(2,ye,8,1,"div",2)(3,Ee,2,1,"div",3),A(4,"async"),s()()),e&2&&(a(2),p("ngIf",!n.isMobile),a(1),p("ngIf",X(4,2,n.menuService.menusLoaded)))},dependencies:[le,me,se,y,ne,ie,Z,ee,te,C,ae,oe,de,q],encapsulation:2});let i=t;return i})();export{et as HomeComponent};
