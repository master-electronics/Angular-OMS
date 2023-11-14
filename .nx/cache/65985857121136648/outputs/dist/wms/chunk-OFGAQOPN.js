import{a as xt,b as vt}from"./chunk-RH2D4KR5.js";import{b as ct}from"./chunk-MZCJXFXF.js";import{a as pt,b as It,c as st,d as ft,e as Ct}from"./chunk-WUHPQNSG.js";import"./chunk-YGLVR5WL.js";import{a as _t,d as ut}from"./chunk-44NJU3LR.js";import"./chunk-Z347V25R.js";import{G as lt,H as dt,I as mt,d as et,e as O,h as it,i as nt,p as rt,t as ot,u as at}from"./chunk-L3THJMBJ.js";import"./chunk-RAQ4VAB7.js";import"./chunk-QQPJAVIB.js";import"./chunk-RMC6N2HF.js";import"./chunk-GJX7JKAF.js";import"./chunk-WX6KJXZ2.js";import"./chunk-EXQESRXT.js";import"./chunk-5FUULRSO.js";import{a as K,b as tt}from"./chunk-V5UEWFGK.js";import{f as W,h as q,j}from"./chunk-C55YZZU5.js";import{a as Y}from"./chunk-E6LDBMP7.js";import{a as X,c as G,e as Z,f as J}from"./chunk-GFVCXK67.js";import"./chunk-WOYNEQEU.js";import"./chunk-XSY6ZNJP.js";import"./chunk-W3KGMJG7.js";import"./chunk-B3MPBRHZ.js";import"./chunk-YUDS3XHK.js";import"./chunk-MIXZFVL7.js";import"./chunk-FFJ3QZ3H.js";import{c as k,l as U,n as B}from"./chunk-PJEV5NXI.js";import{A as $,p as V,q as L,w as A}from"./chunk-GWV5DZOT.js";import{$b as p,Aa as g,Da as h,Fb as i,Gb as C,Gc as D,H as P,Hc as R,Ic as z,Lc as H,Mc as M,Rc as F,Sb as d,Sc as Q,Uc as w,ac as a,bc as l,cc as T,nc as S,pc as c,va as E,xc as m,yc as b,zc as _}from"./chunk-N7LPRJLK.js";var Nt={production:!1,apiUrl:"http://meow-aws-wdxd2:4000",graphql:"http://meow-aws-wdxd2:3000/graphql",GTM_ID:"GTM-KS8744D",changelogurl:"https://master-electronics.gitbook.io/wms/",DistributionCenter:"PH",idleTimeInMinutes:20,productImgSource:"https://www.onlinecomponents.com/images/parts/largeimages/"};var Ot=j`
    query findInventory($DistributionCenter: String!, $InventoryTrackingNumber: String!) {
  findInventory(
    Inventory: {DistributionCenter: $DistributionCenter, InventoryTrackingNumber: $InventoryTrackingNumber}
  ) {
    _id
    DistributionCenter
    InventoryTrackingNumber
    QuantityOnHand
    DateCode
    ParentITN
    ROHS
    OriginalQuantity
    BinLocation
    ProductID
    ContainerID
    CountryID
    NotFound
    Country {
      _id
      CountryCode
      CountryName
      ISO2
      ISO3
    }
    Container {
      _id
      Barcode
      Zone
      DistributionCenter
      Warehouse
      Row
      Aisle
      Section
      Shelf
      ShelfDetail
      ContainerTypeID
      ContainerType {
        _id
        Name
        IsMobile
      }
      USERINFOs {
        _id
        Name
      }
    }
    Product {
      _id
      ProductCodeID
      PartNumber
      ProductTier
      Velocity
      ProductCode {
        _id
        ProductCodeNumber
      }
      PURCHASEORDERLs {
        _id
        PurchaseOrderH {
          _id
          PurchaseOrderNumber
        }
      }
      RECEIPTLs {
        _id
        LineNumber
        ExpectedQuantity
        ReceiptH {
          _id
          ExpectedArrivalDate
          ReceiptNumber
          Vendor {
            _id
            VendorName
            VendorNumber
          }
        }
        RECEIPTLDs {
          _id
          ExpectedQuantity
          ReceiptStatus {
            _id
            Name
          }
        }
      }
    }
    ORDERLINEDETAILs {
      _id
      OrderID
      OrderLineID
      StatusID
      Quantity
      LastUpdated
      BinLocation
      WMSPriority
      Status {
        _id
        Name
      }
      OrderLine {
        _id
        OrderLineNumber
        Quantity
      }
      Order {
        _id
        DistributionCenter
        OrderNumber
        NOSINumber
        OrderStatusCode
        ShipmentMethodID
        OrderType
        isSelected
        CustomerID
        ShipmentMethod {
          _id
          ShippingMethod
          PriorityPinkPaper
        }
        Customer {
          _id
          CustomerNumber
          CustomerTier
        }
      }
    }
  }
}
    `,yt=(()=>{let o=class o extends q{constructor(s){super(s),this.document=Ot,this.client="wmsNodejs"}};o.\u0275fac=function(u){return new(u||o)(g(W))},o.\u0275prov=E({token:o,factory:o.\u0275fac,providedIn:"root"});let t=o;return t})();var Et=["ITN"];function gt(t,o){if(t&1&&(a(0,"nz-form-item",2),T(1,"nz-alert",15),l()),t&2){let e=c();i(1),d("nzType",e.alertType==="error"?"error":e.alertType==="success"?"success":e.alertType==="info"?"info":"warning")("nzMessage",e.alertMessage)}}function ht(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(2);i(1),_(" Distribution Center: ",e.itn.DistributionCenter," ")}}function bt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(2);i(1),_(" Quantity on Hand: ",e.itn.QuantityOnHand," ")}}function Dt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(2);i(1),_("Date Code: ",e.itn.DateCode,"")}}function Rt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(2);i(1),_("Parent ITN: ",e.itn.ParentITN,"")}}function zt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(2);i(1),_(" Original Quantity: ",e.itn.OriginalQuantity," ")}}function Ht(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(2);i(1),_(" Bin Location: ",e.itn.BinLocation," ")}}function Mt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Part Number: ",e.itn.Product.PartNumber," ")}}function Ft(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Velocity: ",e.itn.Product.Velocity," ")}}function Qt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Product Code: ",e.itn.Product.ProductCode.ProductCodeNumber," ")}}function wt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Product Tier: ",e.itn.Product.ProductTier," ")}}function Vt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" ",e.PurchaseOrderH.PurchaseOrderNumber," ")}}function Lt(t,o){if(t&1&&(a(0,"ul",22),p(1,Vt,2,1,"li",20),l()),t&2){let e=o.$implicit;i(1),d("ngIf",e.PurchaseOrderH&&e.PurchaseOrderH.PurchaseOrderNumber)}}function At(t,o){if(t&1&&(a(0,"li"),m(1," Purchase Orders: "),p(2,Lt,2,1,"ul",21),l()),t&2){let e=c(3);i(2),d("ngForOf",e.itn.Product.PURCHASEORDERLs)}}function $t(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Receipt ID: ",e.ReceiptH.ReceiptNumber," ")}}function kt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Vendor: ",e.ReceiptH.Vendor.VendorName," ")}}function Ut(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Expected Arrival Date: ",e.ReceiptH.ExpectedArrivalDate," ")}}function Bt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Line Number: ",e.LineNumber," ")}}function Wt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Quantity: ",e.ExpectedQuantity," ")}}function qt(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Status: ",e.ReceiptStatus.Name," ")}}function jt(t,o){if(t&1&&(a(0,"ul",24),p(1,Wt,2,1,"li",20)(2,qt,2,1,"li",20),l()),t&2){let e=o.$implicit;i(1),d("ngIf",e.ExpectedQuantity),i(1),d("ngIf",e.ReceiptStatus&&e.ReceiptStatus.Name)}}function Xt(t,o){if(t&1&&(a(0,"li"),m(1," Receipt Line Details: "),p(2,jt,3,2,"ul",23),l()),t&2){let e=c().$implicit;i(2),d("ngForOf",e.RECEIPTLDs)}}function Gt(t,o){if(t&1&&(a(0,"ul",24),p(1,$t,2,1,"li",20)(2,kt,2,1,"li",20)(3,Ut,2,1,"li",20)(4,Bt,2,1,"li",20)(5,Xt,3,1,"li",20),l()),t&2){let e=o.$implicit;i(1),d("ngIf",e.ReceiptH&&e.ReceiptH.ReceiptNumber),i(1),d("ngIf",e.ReceiptH&&e.ReceiptH.Vendor&&e.ReceiptH.Vendor.VendorName),i(1),d("ngIf",e.ReceiptH&&e.ReceiptH.ExpectedArrivalDate),i(1),d("ngIf",e.LineNumber),i(1),d("ngIf",e.RECEIPTLDs.length>0)}}function Zt(t,o){if(t&1&&(a(0,"li"),m(1," Receipts: "),p(2,Gt,6,5,"ul",23),l()),t&2){let e=c(3);i(2),d("ngForOf",e.itn.Product.RECEIPTLs)}}function Jt(t,o){if(t&1&&(a(0,"div"),p(1,Mt,2,1,"li",20)(2,Ft,2,1,"li",20)(3,Qt,2,1,"li",20)(4,wt,2,1,"li",20)(5,At,3,1,"li",20)(6,Zt,3,1,"li",20),l()),t&2){let e=c(2);i(1),d("ngIf",e.itn.Product.PartNumber),i(1),d("ngIf",e.itn.Product.Velocity),i(1),d("ngIf",e.itn.Product.ProductCode.ProductCodeNumber),i(1),d("ngIf",e.itn.Product.ProductTier),i(1),d("ngIf",e.itn.Product.PURCHASEORDERLs.length>0),i(1),d("ngIf",e.itn.Product.RECEIPTLs.length>0)}}function Yt(t,o){if(t&1&&(a(0,"span"),m(1),l()),t&2){let e=c(3);i(1),_(" - ",e.itn.Country.CountryName,"")}}function Kt(t,o){if(t&1&&(a(0,"li"),m(1),p(2,Yt,2,1,"span",20),l()),t&2){let e=c(2);i(1),_(" COO: ",e.itn.CountryOfOrigin,""),i(1),d("ngIf",e.itn.Country.CountryName)}}function te(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(4);i(1),_(" Type: ",e.itn.Container.ContainerType.Name," ")}}function ee(t,o){if(t&1&&(a(0,"div"),p(1,te,2,1,"li",20),a(2,"li"),m(3),l()()),t&2){let e=c(3);i(1),d("ngIf",e.itn.Container.ContainerType.Name),i(2),_(" Is Mobile: ",e.itn.Container.ContainerType.IsMobile?"Y":"N"," ")}}function ie(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Barcode: ",e.itn.Container.Barcode," ")}}function ne(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Zone: ",e.itn.Container.Zone," ")}}function re(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Warehouse: ",e.itn.Container.Warehouse," ")}}function oe(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Row: ",e.itn.Container.Row," ")}}function ae(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Aisle: ",e.itn.Container.Aisle," ")}}function le(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Section: ",e.itn.Container.Section," ")}}function de(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Shelf: ",e.itn.Container.Shelf," ")}}function me(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(3);i(1),_(" Shelf Detail: ",e.itn.Container.ShelfDetail," ")}}function ce(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_("Name: ",e.Name,"")}}function _e(t,o){if(t&1&&(a(0,"div"),p(1,ce,2,1,"li",20),l()),t&2){let e=o.$implicit;i(1),d("ngIf",e.Name)}}function ue(t,o){if(t&1&&(a(0,"li"),m(1," Users: "),a(2,"ul",22),p(3,_e,2,1,"div",25),l()()),t&2){let e=c(3);i(3),d("ngForOf",e.itn.Container.USERINFOs)}}function pe(t,o){if(t&1&&(a(0,"li"),m(1," Container: "),a(2,"ul",22),p(3,ee,4,2,"div",20)(4,ie,2,1,"li",20)(5,ne,2,1,"li",20)(6,re,2,1,"li",20)(7,oe,2,1,"li",20)(8,ae,2,1,"li",20)(9,le,2,1,"li",20)(10,de,2,1,"li",20)(11,me,2,1,"li",20)(12,ue,4,1,"li",20),l()()),t&2){let e=c(2);i(3),d("ngIf",e.itn.Container.ContainerType),i(1),d("ngIf",e.itn.Container.Barcode),i(1),d("ngIf",e.itn.Container.Zone),i(1),d("ngIf",e.itn.Container.Warehouse),i(1),d("ngIf",e.itn.Container.Row),i(1),d("ngIf",e.itn.Container.Aisle),i(1),d("ngIf",e.itn.Container.Section),i(1),d("ngIf",e.itn.Container.Shelf),i(1),d("ngIf",e.itn.Container.ShelfDetail),i(1),d("ngIf",e.itn.Container.USERINFOs)}}function Ie(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Order Number: ",e.Order.OrderNumber," ")}}function se(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" NOSI Number: ",e.Order.NOSINumber," ")}}function fe(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Order Line: ",e.OrderLine.OrderLineNumber," ")}}function Ce(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Status: ",e.Status.Name," ")}}function xe(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_("Quantity: ",e.Quantity,"")}}function ve(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Order Type: ",e.Order.OrderType," ")}}function Ne(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Distribution Center: ",e.Order.DistributionCenter," ")}}function ye(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c().$implicit;i(1),_(" Last Updated: ",e.LastUpdated," ")}}function Te(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(2).$implicit;i(1),_(" Customer Number: ",e.Order.Customer.CustomerNumber," ")}}function Se(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(2).$implicit;i(1),_(" Customer Tier: ",e.Order.Customer.CustomerTier," ")}}function Oe(t,o){if(t&1&&(a(0,"div")(1,"li"),m(2," Customer: "),a(3,"ul",22),p(4,Te,2,1,"li",20)(5,Se,2,1,"li",20),l()()()),t&2){let e=c().$implicit;i(4),d("ngIf",e.Order.Customer.CustomerNumber),i(1),d("ngIf",e.Order.Customer.CustomerTier)}}function Pe(t,o){if(t&1&&(a(0,"li"),m(1),l()),t&2){let e=c(2).$implicit;i(1),_(" Shippint Method: ",e.Order.ShipmentMethod.ShippingMethod," ")}}function Ee(t,o){if(t&1&&(a(0,"div"),p(1,Pe,2,1,"li",20),a(2,"li"),m(3),l()()),t&2){let e=c().$implicit;i(1),d("ngIf",e.Order.ShipmentMethod.ShippingMethod),i(2),_(" Priority Pink Paper: ",e.Order.ShipmentMethod.PriorityPinkPaper?"Y":"N"," ")}}function ge(t,o){if(t&1&&(a(0,"ul",22),p(1,Ie,2,1,"li",20)(2,se,2,1,"li",20)(3,fe,2,1,"li",20)(4,Ce,2,1,"li",20)(5,xe,2,1,"li",20),a(6,"li"),m(7),l(),p(8,ve,2,1,"li",20),a(9,"li"),m(10),l(),p(11,Ne,2,1,"li",20)(12,ye,2,1,"li",20)(13,Oe,6,2,"div",20)(14,Ee,4,2,"div",20),l()),t&2){let e=o.$implicit;i(1),d("ngIf",e.Order.OrderNumber),i(1),d("ngIf",e.Order.NOSINumber),i(1),d("ngIf",e.OrderLine.OrderLineNumber),i(1),d("ngIf",e.Status.Name),i(1),d("ngIf",e.Quantity),i(2),_("WMS Priority: ",e.WMSPriority,""),i(1),d("ngIf",e.Order.OrderType),i(2),_("Selected: ",e.Order.isSelected,""),i(1),d("ngIf",e.Order.DistributionCenter),i(1),d("ngIf",e.LastUpdated),i(1),d("ngIf",e.Order.Customer),i(1),d("ngIf",e.Order.ShipmentMethod)}}function he(t,o){if(t&1&&(a(0,"li"),m(1," Order Lines: "),p(2,ge,15,12,"ul",21),l()),t&2){let e=c(2);i(2),d("ngForOf",e.itn.ORDERLINEDETAILs)}}var be=()=>["/tableviews/eventlog"],De=t=>({ITN:t});function Re(t,o){if(t&1&&(a(0,"div",2)(1,"div",16)(2,"div",17)(3,"ul",18)(4,"li"),m(5," ITN: "),a(6,"a",19),m(7),l()(),p(8,ht,2,1,"li",20)(9,bt,2,1,"li",20)(10,Dt,2,1,"li",20)(11,Rt,2,1,"li",20),a(12,"li"),m(13),l(),p(14,zt,2,1,"li",20)(15,Ht,2,1,"li",20)(16,Jt,7,6,"div",20)(17,Kt,3,2,"li",20)(18,pe,13,10,"li",20)(19,he,3,1,"li",20),l()()()()),t&2){let e=c();i(6),d("routerLink",R(14,be))("queryParams",z(15,De,e.itn.InventoryTrackingNumber||"")),i(1),_(" ",e.itn.InventoryTrackingNumber," "),i(1),d("ngIf",e.itn.DistributionCenter),i(1),d("ngIf",e.itn.QuantityOnHand),i(1),d("ngIf",e.itn.DateCode),i(1),d("ngIf",e.itn.ParentITN),i(2),_("ROHS: ",e.itn.ROHS?"Y":"N",""),i(1),d("ngIf",e.itn.OriginalQuantity),i(1),d("ngIf",e.itn.BinLocation),i(1),d("ngIf",e.itn.Product),i(1),d("ngIf",e.itn.CountryOfOrigin),i(1),d("ngIf",e.itn.Container),i(1),d("ngIf",e.itn.ORDERLINEDETAILs.length>0)}}var ii=(()=>{let o=class o{constructor(s,u,n,I){this.fb=s,this._findInventory=u,this._nav=n,this._title=I,this.isLoading=!1,this.alertType="error",this.alertMessage="",this.ITNForm=this.fb.group({ITN:["",[O.required,O.pattern(ct)]]})}ngOnInit(){this._nav.update("ITN Info"),this._title.setTitle("ITN Info")}onSubmit(){this.itnData$=this._findInventory.fetch({DistributionCenter:Nt.DistributionCenter,InventoryTrackingNumber:this.ITNForm.get("ITN").value.trim().toUpperCase()},{fetchPolicy:"network-only"}).pipe(P(s=>{let u={},n=s.data.findInventory;u._id=n._id,u.DistributionCenter=n.DistributionCenter?n.DistributionCenter.trim():null,u.InventoryTrackingNumber=n.InventoryTrackingNumber?n.InventoryTrackingNumber.trim():null,u.QuantityOnHand=n.QuantityOnHand?n.QuantityOnHand:null,u.DateCode=n.DateCode?n.DateCode.trim():null,u.ParentITN=n.ParentITN?n.ParentITN.trim():null,u.ROHS=n.ROHS?n.ROHS:!1,u.OriginalQuantity=n.OriginalQuantity?n.OriginalQuantity:null,u.BinLocation=n.BinLocation?n.BinLocation.trim():null,u.ProductID=n.ProductID?n.ProductID:null,u.ContainerID=n.ContainerID?n.ContainerID:null,u.CountryOfOrigin=n.Country&&n.Country.ISO2?n.Country.ISO2.trim():null,u.CountryID=n.CountryID?n.CountryID:null,u.NotFound=n.NotFound?n.NotFound:null,n.Country&&(u.Country={_id:n.Country._id,CountryCode:n.Country.CountryCode?n.Country.CountryCode.trim():null,CountryName:n.Country.CountryName?n.Country.CountryName.trim():null,ISO2:n.Country.ISO2?n.Country.ISO2.trim():null,ISO3:n.Country.ISO3?n.Country.ISO3.trim():null});let I;n.Container.USERINFOs&&(I=[],n.Container.USERINFOs.map(r=>{I.push({_id:r._id,Name:r.Name?r.Name.trim():null})})),u.Container={_id:n.Container._id,Barcode:n.Container&&n.Container.Barcode?n.Container.Barcode.trim():null,Zone:n.Container&&n.Container.Zone?n.Container.Zone:null,DistributionCenter:n.Container.DistributionCenter.trim(),Warehouse:n.Container&&n.Container.Warehouse?n.Container.Warehouse.trim():null,Row:n.Container&&n.Container.Row?n.Container.Row.trim():null,Aisle:n.Container&&n.Container.Aisle?n.Container.Aisle.trim():null,Section:n.Container&&n.Container.Section?n.Container.Section.trim():null,Shelf:n.Container&&n.Container.Shelf?n.Container.Shelf.trim():null,ShelfDetail:n.Container&&n.Container.ShelfDetail?n.Container.ShelfDetail.trim():null,ContainerTypeID:n.Container&&n.Container.ContainerTypeID?n.Container.ContainerTypeID:null,ContainerType:{_id:n.Container.ContainerType._id,Name:n.Container.ContainerType.Name.trim(),IsMobile:n.Container.ContainerType.IsMobile},USERINFOs:I||null};let x,v,N;n.Product.PURCHASEORDERLs&&(x=[],n.Product.PURCHASEORDERLs.map(r=>{x.push({_id:r._id,PurchaseOrderH:{_id:r.PurchaseOrderH&&r.PurchaseOrderH._id?r.PurchaseOrderH._id:null,PurchaseOrderNumber:r.PurchaseOrderH&&r.PurchaseOrderH.PurchaseOrderNumber?r.PurchaseOrderH.PurchaseOrderNumber:null}})})),n.Product.RECEIPTLs&&(N=[],n.Product.RECEIPTLs.map(r=>{r.RECEIPTLDs&&(v=[],r.RECEIPTLDs.map(f=>{v.push({_id:f._id,ExpectedQuantity:f.ExpectedQuantity?f.ExpectedQuantity:null,ReceiptStatus:{_id:f.ReceiptStatus&&f.ReceiptStatus._id?f.ReceiptStatus._id:null,Name:f.ReceiptStatus&&f.ReceiptStatus.Name?f.ReceiptStatus.Name:null}})})),N.push({_id:r._id,LineNumber:r.LineNumber?r.LineNumber:null,ExpectedQuantity:r.ExpectedQuantity?r.ExpectedQuantity:null,ReceiptH:{_id:r.ReceiptH&&r.ReceiptH._id?r.ReceiptH._id:null,ExpectedArrivalDate:r.ReceiptH&&r.ReceiptH.ExpectedArrivalDate?new Date(Number(r.ReceiptH.ExpectedArrivalDate)).toLocaleDateString():null,ReceiptNumber:r.ReceiptH&&r.ReceiptH.ReceiptNumber?r.ReceiptH.ReceiptNumber:null,Vendor:{_id:r.ReceiptH&&r.ReceiptH.Vendor&&r.ReceiptH.Vendor._id?r.ReceiptH.Vendor._id:null,VendorName:r.ReceiptH&&r.ReceiptH.Vendor&&r.ReceiptH.Vendor.VendorName?r.ReceiptH.Vendor.VendorName:null,VendorNumber:r.ReceiptH&&r.ReceiptH.Vendor&&r.ReceiptH.Vendor.VendorNumber?r.ReceiptH.Vendor.VendorNumber:null}},RECEIPTLDs:v||null})})),u.Product={_id:n.Product._id,ProductCodeID:n.Product&&n.Product.ProductCodeID?n.Product.ProductCodeID:null,PartNumber:n.Product&&n.Product.PartNumber?n.Product.PartNumber.trim():null,Velocity:n.Product.Velocity,ProductTier:n.Product&&n.Product.ProductTier?n.Product.ProductTier.trim():null,ProductCode:{_id:n.Product.ProductCode._id,ProductCodeNumber:n.Product&&n.Product.ProductCode&&n.Product.ProductCode.ProductCodeNumber?n.Product.ProductCode.ProductCodeNumber.trim():null},PURCHASEORDERLs:x||null,RECEIPTLs:N||null};let y;n.ORDERLINEDETAILs&&(y=[],n.ORDERLINEDETAILs.map(r=>{y.push({_id:r._id,OrderID:r.OrderID?r.OrderID:null,OrderLineID:r.OrderLineID?r.OrderLineID:null,StatusID:r.StatusID?r.StatusID:null,Quantity:r.Quantity?r.Quantity:null,LastUpdated:r.LastUpdated?new Date(Number(r.LastUpdated)).toLocaleString():null,BinLocation:r.BinLocation?r.BinLocation.trim():null,WMSPriority:r.WMSPriority?r.WMSPriority:null,Status:{_id:r.Status._id,Name:r?r.Status.Name.trim():null},OrderLine:{_id:r.OrderLine._id,OrderLineNumber:r.OrderLine&&r.OrderLine.OrderLineNumber?r.OrderLine.OrderLineNumber:null,Quantity:r.OrderLine&&r.OrderLine.Quantity?r.OrderLine.Quantity:null},Order:{_id:r.Order._id,DistributionCenter:r.Order&&r.Order.DistributionCenter?r.Order.DistributionCenter.trim():null,OrderNumber:r.Order&&r.Order.OrderNumber?r.Order.OrderNumber.trim():null,NOSINumber:r.Order&&r.Order.NOSINumber?r.Order.NOSINumber.trim():null,OrderStatusCode:r.Order&&r.Order.OrderStatusCode?r.Order.OrderStatusCode:null,ShipmentMethodID:r.Order&&r.Order.ShipmentMethodID?r.Order.ShipmentMethodID:null,OrderType:r.Order&&r.Order.OrderType?r.Order.OrderType:null,isSelected:r.Order&&r.Order.isSelected?r.Order.isSelected:null,CustomerID:r.Order&&r.Order.CustomerID?r.Order.CustomerID:null,ShipmentMethod:r.Order&&r.Order.ShipmentMethod?{_id:r.Order.ShipmentMethod._id,ShippingMethod:r.Order.ShipmentMethod.ShippingMethod?r.Order.ShipmentMethod.ShippingMethod.trim():null,PriorityPinkPaper:r.Order.ShipmentMethod.PriorityPinkPaper?r.Order.ShipmentMethod.PriorityPinkPaper:null}:null,Customer:r.Order&&r.Order.Customer?{_id:r.Order.Customer._id,CustomerNumber:r.Order.Customer.CustomerNumber.trim(),CustomerTier:r.Order.Customer.CustomerTier.trim()}:null}})})),u.ORDERLINEDETAILs=y||null,this.itn=u}))}};o.\u0275fac=function(u){return new(u||o)(C(lt),C(yt),C(Y),C(k))},o.\u0275cmp=h({type:o,selectors:[["ng-component"]],viewQuery:function(u,n){if(u&1&&Q(Et,5),u&2){let I;F(I=w())&&(n.ITNInput=I.first)}},standalone:!0,features:[D],decls:21,vars:8,consts:[[1,"container","mx-auto","px-2","py-2"],["nz-form","","focusInvalidInput","",3,"formGroup","ngSubmit"],["nz-row","","nzJustify","center"],["nz-col","","nzXs","22","nzSm","18","nzMd","14","nzLg","12","nzXl","10","nzXXl","8"],["nz-col","",3,"nzSpan"],["nz-row","","nzGutter","8","nzJustify","center"],["nzRequired",""],["nzHasFeedback","","nzErrorTip","The input is not valid ITN!"],["nz-input","","oninput","this.value = this.value.toUpperCase()","placeholder","PH03869239","nzSize","large","type","text","id","ITN","name","ITN","formControlName","ITN","autocomplete","off"],["ITN",""],["nz-col","","nzSpan","16"],["nz-col","","nzSpan","13"],["nz-button","","type","submit","nzType","primary","nzSize","large",1,"w-full",3,"nzLoading","click"],["nz-row","","nzJustify","center",4,"ngIf"],[1,"hidden"],["nzShowIcon","",1,"w-full",3,"nzType","nzMessage"],["nz-col","","nzXs","24","nzSm","20","nzMd","16","nzLg","12","nzXl","10","nzXXl","8"],[1,"divide-y"],[2,"margin-left","0px !important"],[1,"text-blue-500",3,"routerLink","queryParams"],[4,"ngIf"],["style","margin-left: 10px !important;",4,"ngFor","ngForOf"],[2,"margin-left","10px !important"],["style","margin-left: 10px; !important;",4,"ngFor","ngForOf"],[2,"margin-left","10px"],[4,"ngFor","ngForOf"]],template:function(u,n){u&1&&(a(0,"div",0)(1,"form",1),S("ngSubmit",function(){return n.onSubmit()}),a(2,"div",2)(3,"div",3)(4,"div",4)(5,"nz-form-item",5)(6,"nz-form-label",6),m(7," ITN "),l(),a(8,"nz-form-control",7),T(9,"input",8,9),l()()(),a(11,"div",10)(12,"nz-form-item",2)(13,"div",11)(14,"button",12),S("click",function(){return n.onSubmit()}),m(15," Submit "),l()()()(),p(16,gt,2,2,"nz-form-item",13),l()()(),a(17,"p",14),m(18),H(19,"async"),l(),p(20,Re,20,17,"div",13),l()),u&2&&(i(1),d("formGroup",n.ITNForm),i(3),d("nzSpan",16),i(10),d("nzLoading",n.isLoading),i(2),d("ngIf",n.alertMessage),i(2),b(M(19,6,n.itnData$)),i(2),d("ngIf",n.itn))},dependencies:[$,V,L,A,B,U,Ct,tt,K,It,pt,ft,st,ut,_t,J,Z,X,G,vt,xt,dt,rt,et,it,nt,mt,ot,at],encapsulation:2});let t=o;return t})();export{ii as INTInfoComponent};
