import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';

import { FindInventoryGQL } from 'src/app/graphql/itn_info.graphql-gen';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { environment } from 'src/environments/environment.dev';

interface IITN {
  _id: number;
  DistributionCenter: string;
  InventoryTrackingNumber: string;
  QuantityOnHand: number;
  DateCode?: string;
  ParentITN?: string;
  ROHS?: boolean;
  OriginalQuantity?: number;
  BinLocation?: string;
  ProductID: number;
  ContainerID: number;
  CountryOfOrigin?: string;
  CountryID?: number;
  NotFound?: boolean;
  Country?: {
    _id: number;
    CountryCode: string;
    CountryName: string;
    ISO2: string;
    ISO3: string;
  };
  Container: {
    _id: number;
    Barcode: string;
    Zone?: number;
    DistributionCenter: string;
    Warehouse?: string;
    Row?: string;
    Aisle?: string;
    Section?: string;
    Shelf?: string;
    ShelfDetail?: string;
    ContainerTypeID: number;
    ContainerType: {
      _id: number;
      Name: string;
      IsMobile: boolean;
    };
    USERINFOs?: {
      _id: number;
      Name: string;
    }[];
  };
  Product: {
    _id: number;
    ProductCodeID: number;
    PartNumber: string;
    ProductTier?: string;
    ProductCode: {
      _id: number;
      ProductCodeNumber: string;
    };
    PURCHASEORDERLs?: {
      _id: number;
      PurchaseOrderH?: {
        _id: number;
        PurchaseOrderNumber: string;
      };
    }[];
    RECEIPTLs?: {
      _id: number;
      LineNumber: number;
      ExpectedQuantity: number;
      ReceiptH: {
        _id: number;
        ExpectedArrivalDate: string;
        ReceiptNumber: string;
        Vendor: {
          _id: number;
          VendorName: string;
          VendorNumber: string;
        };
      };
      RECEIPTLDs: {
        _id: number;
        ExpectedQuantity: number;
        ReceiptStatus: {
          _id: number;
          Name: string;
        };
      }[];
    }[];
  };
  ORDERLINEDETAILs?: {
    _id: number;
    OrderID: number;
    OrderLineID: number;
    StatusID: number;
    Quantity: number;
    LastUpdated?: string;
    BinLocation?: string;
    WMSPriority: number;
    Status: {
      _id: number;
      Name: string;
    };
    OrderLine: {
      _id: number;
      OrderLineNumber: number;
      Quantity?: number;
    };
    Order: {
      _id: number;
      DistributionCenter: string;
      OrderNumber: string;
      NOSINumber: string;
      OrderStatusCode?: string;
      ShipmentMethodID?: string;
      OrderType?: string;
      isSelected: number;
      CustomerID?: number;
      ShipmentMethod?: {
        _id: string;
        ShippingMethod: string;
        PriorityPinkPaper: boolean;
      };
      Customer?: {
        _id: number;
        CustomerNumber: string;
        CustomerTier: string;
      };
    };
  }[];
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="container mx-auto py-2 px-2">
      <form
        nz-form
        focusInvalidInput
        [formGroup]="ITNForm"
        (ngSubmit)="onSubmit()"
      >
        <div nz-row nzJustify="center">
          <div
            nz-col
            nzXs="22"
            nzSm="18"
            nzMd="14"
            nzLg="12"
            nzXl="10"
            nzXXl="8"
          >
            <div nz-col [nzSpan]="16">
              <nz-form-item nz-row nzGutter="8" nzJustify="center">
                <nz-form-label nzRequired> ITN </nz-form-label>
                <nz-form-control
                  nzHasFeedback
                  nzErrorTip="The input is not valid ITN!"
                >
                  <input
                    nz-input
                    oninput="this.value = this.value.toUpperCase()"
                    placeholder="PH03869239"
                    nzSize="large"
                    type="text"
                    id="ITN"
                    name="ITN"
                    formControlName="ITN"
                    autocomplete="off"
                    #ITN
                  />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="16">
              <nz-form-item nz-row nzJustify="center">
                <div nz-col nzSpan="13">
                  <button
                    nz-button
                    type="submit"
                    nzType="primary"
                    (click)="onSubmit()"
                    [nzLoading]="isLoading"
                    nzSize="large"
                    class="w-full"
                  >
                    Submit
                  </button>
                </div>
              </nz-form-item>
            </div>

            <nz-form-item nz-row *ngIf="alertMessage" nzJustify="center">
              <nz-alert
                [nzType]="
                  alertType === 'error'
                    ? 'error'
                    : alertType === 'success'
                    ? 'success'
                    : alertType === 'info'
                    ? 'info'
                    : 'warning'
                "
                [nzMessage]="alertMessage"
                nzShowIcon
                class="w-full"
              ></nz-alert>
            </nz-form-item>
          </div>
        </div>
      </form>
      <p class="hidden">{{ itnData$ | async }}</p>
      <div nz-row nzJustify="center" *ngIf="itn">
        <div nz-col nzXs="24" nzSm="20" nzMd="16" nzLg="12" nzXl="10" nzXXl="8">
          <div class="divide-y">
            <ul style="margin-left: 0px !important;">
              <li>
                ITN:
                <a
                  [routerLink]="['/tableviews/eventlog']"
                  [queryParams]="{ ITN: itn.InventoryTrackingNumber || '' }"
                  class="text-blue-500"
                >
                  {{ itn.InventoryTrackingNumber }}
                </a>
              </li>
              <li *ngIf="itn.DistributionCenter">
                Distribution Center: {{ itn.DistributionCenter }}
              </li>
              <li *ngIf="itn.QuantityOnHand">
                Quantity on Hand: {{ itn.QuantityOnHand }}
              </li>
              <li *ngIf="itn.DateCode">Date Code: {{ itn.DateCode }}</li>
              <li *ngIf="itn.ParentITN">Parent ITN: {{ itn.ParentITN }}</li>
              <li>ROHS: {{ itn.ROHS ? 'Y' : 'N' }}</li>
              <li *ngIf="itn.OriginalQuantity">
                Original Quantity: {{ itn.OriginalQuantity }}
              </li>
              <li *ngIf="itn.BinLocation">
                Bin Location: {{ itn.BinLocation }}
              </li>
              <div *ngIf="itn.Product">
                <li *ngIf="itn.Product.PartNumber">
                  Part Number: {{ itn.Product.PartNumber }}
                </li>
                <li *ngIf="itn.Product.ProductCode.ProductCodeNumber">
                  Product Code: {{ itn.Product.ProductCode.ProductCodeNumber }}
                </li>
                <li *ngIf="itn.Product.ProductTier">
                  Product Tier: {{ itn.Product.ProductTier }}
                </li>
                <li *ngIf="itn.Product.PURCHASEORDERLs.length > 0">
                  Purchase Orders:
                  <ul
                    *ngFor="let po of itn.Product.PURCHASEORDERLs"
                    style="margin-left: 10px !important;"
                  >
                    <li
                      *ngIf="
                        po.PurchaseOrderH &&
                        po.PurchaseOrderH.PurchaseOrderNumber
                      "
                    >
                      {{ po.PurchaseOrderH.PurchaseOrderNumber }}
                    </li>
                  </ul>
                </li>
                <li *ngIf="itn.Product.RECEIPTLs.length > 0">
                  Receipts:
                  <ul
                    *ngFor="let receipt of itn.Product.RECEIPTLs"
                    style="margin-left: 10px; !important;"
                  >
                    <li
                      *ngIf="receipt.ReceiptH && receipt.ReceiptH.ReceiptNumber"
                    >
                      Receipt ID: {{ receipt.ReceiptH.ReceiptNumber }}
                    </li>
                    <li
                      *ngIf="
                        receipt.ReceiptH &&
                        receipt.ReceiptH.Vendor &&
                        receipt.ReceiptH.Vendor.VendorName
                      "
                    >
                      Vendor: {{ receipt.ReceiptH.Vendor.VendorName }}
                    </li>
                    <li
                      *ngIf="
                        receipt.ReceiptH && receipt.ReceiptH.ExpectedArrivalDate
                      "
                    >
                      Expected Arrival Date:
                      {{ receipt.ReceiptH.ExpectedArrivalDate }}
                    </li>
                    <li *ngIf="receipt.LineNumber">
                      Line Number: {{ receipt.LineNumber }}
                    </li>
                    <li *ngIf="receipt.RECEIPTLDs.length > 0">
                      Receipt Line Details:
                      <ul
                        *ngFor="let detail of receipt.RECEIPTLDs"
                        style="margin-left: 10px; !important;"
                      >
                        <li *ngIf="detail.ExpectedQuantity">
                          Quantity: {{ detail.ExpectedQuantity }}
                        </li>
                        <li
                          *ngIf="
                            detail.ReceiptStatus && detail.ReceiptStatus.Name
                          "
                        >
                          Status: {{ detail.ReceiptStatus.Name }}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </div>
              <li *ngIf="itn.CountryOfOrigin">
                COO: {{ itn.CountryOfOrigin
                }}<span *ngIf="itn.Country.CountryName">
                  - {{ itn.Country.CountryName }}</span
                >
              </li>
              <li *ngIf="itn.Container">
                Container:
                <ul style="margin-left: 10px !important;">
                  <div *ngIf="itn.Container.ContainerType">
                    <li *ngIf="itn.Container.ContainerType.Name">
                      Type: {{ itn.Container.ContainerType.Name }}
                    </li>
                    <li>
                      Is Mobile:
                      {{ itn.Container.ContainerType.IsMobile ? 'Y' : 'N' }}
                    </li>
                  </div>
                  <li *ngIf="itn.Container.Barcode">
                    Barcode: {{ itn.Container.Barcode }}
                  </li>
                  <li *ngIf="itn.Container.Zone">
                    Zone: {{ itn.Container.Zone }}
                  </li>
                  <li *ngIf="itn.Container.Warehouse">
                    Warehouse: {{ itn.Container.Warehouse }}
                  </li>
                  <li *ngIf="itn.Container.Row">
                    Row: {{ itn.Container.Row }}
                  </li>
                  <li *ngIf="itn.Container.Aisle">
                    Aisle: {{ itn.Container.Aisle }}
                  </li>
                  <li *ngIf="itn.Container.Section">
                    Section: {{ itn.Container.Section }}
                  </li>
                  <li *ngIf="itn.Container.Shelf">
                    Shelf: {{ itn.Container.Shelf }}
                  </li>
                  <li *ngIf="itn.Container.ShelfDetail">
                    Shelf Detail: {{ itn.Container.ShelfDetail }}
                  </li>
                  <li *ngIf="itn.Container.USERINFOs">
                    Users:
                    <ul style="margin-left: 10px !important;">
                      <div *ngFor="let user of itn.Container.USERINFOs">
                        <li *ngIf="user.Name">Name: {{ user.Name }}</li>
                      </div>
                    </ul>
                  </li>
                </ul>
              </li>
              <li *ngIf="itn.ORDERLINEDETAILs.length > 0">
                Order Lines:
                <ul
                  *ngFor="let order of itn.ORDERLINEDETAILs"
                  style="margin-left: 10px !important;"
                >
                  <li *ngIf="order.Order.OrderNumber">
                    Order Number: {{ order.Order.OrderNumber }}
                  </li>
                  <li *ngIf="order.Order.NOSINumber">
                    NOSI Number: {{ order.Order.NOSINumber }}
                  </li>
                  <li *ngIf="order.OrderLine.OrderLineNumber">
                    Order Line: {{ order.OrderLine.OrderLineNumber }}
                  </li>
                  <li *ngIf="order.Status.Name">
                    Status: {{ order.Status.Name }}
                  </li>
                  <li *ngIf="order.Quantity">Quantity: {{ order.Quantity }}</li>
                  <li>WMS Priority: {{ order.WMSPriority }}</li>
                  <li *ngIf="order.Order.OrderType">
                    Order Type: {{ order.Order.OrderType }}
                  </li>
                  <li>Selected: {{ order.Order.isSelected }}</li>
                  <li *ngIf="order.Order.DistributionCenter">
                    Distribution Center: {{ order.Order.DistributionCenter }}
                  </li>
                  <li *ngIf="order.LastUpdated">
                    Last Updated: {{ order.LastUpdated }}
                  </li>
                  <div *ngIf="order.Order.Customer">
                    <li>
                      Customer:
                      <ul style="margin-left: 10px !important;">
                        <li *ngIf="order.Order.Customer.CustomerNumber">
                          Customer Number:
                          {{ order.Order.Customer.CustomerNumber }}
                        </li>
                        <li *ngIf="order.Order.Customer.CustomerTier">
                          Customer Tier: {{ order.Order.Customer.CustomerTier }}
                        </li>
                      </ul>
                    </li>
                  </div>
                  <div *ngIf="order.Order.ShipmentMethod">
                    <li *ngIf="order.Order.ShipmentMethod.ShippingMethod">
                      Shippint Method:
                      {{ order.Order.ShipmentMethod.ShippingMethod }}
                    </li>
                    <li>
                      Priority Pink Paper:
                      {{
                        order.Order.ShipmentMethod.PriorityPinkPaper ? 'Y' : 'N'
                      }}
                    </li>
                  </div>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class INTInfoComponent implements OnInit {
  public itnData$: Observable<any>;
  itn: IITN;
  isLoading = false;
  alertType = 'error';
  alertMessage = '';

  constructor(
    private fb: UntypedFormBuilder,
    private _findInventory: FindInventoryGQL,
    private commonService: CommonService,
    private _title: Title
  ) {}

  @ViewChild('ITN') ITNInput!: ElementRef;
  ITNForm = this.fb.group({
    ITN: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.commonService.changeNavbar('ITN Info');
    this._title.setTitle('ITN Info');
  }

  onSubmit(): void {
    this.itnData$ = this._findInventory
      .fetch(
        {
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: this.ITNForm.get('ITN')
            .value.trim()
            .toUpperCase(),
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          const tempITN = {} as IITN;
          const itn = res.data.findInventory;
          tempITN._id = itn._id;
          tempITN.DistributionCenter = itn.DistributionCenter
            ? itn.DistributionCenter.trim()
            : null;
          tempITN.InventoryTrackingNumber = itn.InventoryTrackingNumber
            ? itn.InventoryTrackingNumber.trim()
            : null;
          tempITN.QuantityOnHand = itn.QuantityOnHand
            ? itn.QuantityOnHand
            : null;
          tempITN.DateCode = itn.DateCode ? itn.DateCode.trim() : null;
          tempITN.ParentITN = itn.ParentITN ? itn.ParentITN.trim() : null;
          tempITN.ROHS = itn.ROHS ? itn.ROHS : false;
          tempITN.OriginalQuantity = itn.OriginalQuantity
            ? itn.OriginalQuantity
            : null;
          tempITN.BinLocation = itn.BinLocation ? itn.BinLocation.trim() : null;
          tempITN.ProductID = itn.ProductID ? itn.ProductID : null;
          tempITN.ContainerID = itn.ContainerID ? itn.ContainerID : null;
          tempITN.CountryOfOrigin =
            itn.Country && itn.Country.ISO2 ? itn.Country.ISO2.trim() : null;
          tempITN.CountryID = itn.CountryID ? itn.CountryID : null;
          tempITN.NotFound = itn.NotFound ? itn.NotFound : null;

          if (itn.Country) {
            tempITN.Country = {
              _id: itn.Country._id,
              CountryCode: itn.Country.CountryCode
                ? itn.Country.CountryCode.trim()
                : null,
              CountryName: itn.Country.CountryName
                ? itn.Country.CountryName.trim()
                : null,
              ISO2: itn.Country.ISO2 ? itn.Country.ISO2.trim() : null,
              ISO3: itn.Country.ISO3 ? itn.Country.ISO3.trim() : null,
            };
          }

          let users: { _id: number; Name: string }[];
          if (itn.Container.USERINFOs) {
            users = [];
            itn.Container.USERINFOs.map((user) => {
              users.push({
                _id: user._id,
                Name: user.Name ? user.Name.trim() : null,
              });
            });
          }

          tempITN.Container = {
            _id: itn.Container._id,
            Barcode:
              itn.Container && itn.Container.Barcode
                ? itn.Container.Barcode.trim()
                : null,
            Zone:
              itn.Container && itn.Container.Zone ? itn.Container.Zone : null,
            DistributionCenter: itn.Container.DistributionCenter.trim(),
            Warehouse:
              itn.Container && itn.Container.Warehouse
                ? itn.Container.Warehouse.trim()
                : null,
            Row:
              itn.Container && itn.Container.Row
                ? itn.Container.Row.trim()
                : null,
            Aisle:
              itn.Container && itn.Container.Aisle
                ? itn.Container.Aisle.trim()
                : null,
            Section:
              itn.Container && itn.Container.Section
                ? itn.Container.Section.trim()
                : null,
            Shelf:
              itn.Container && itn.Container.Shelf
                ? itn.Container.Shelf.trim()
                : null,
            ShelfDetail:
              itn.Container && itn.Container.ShelfDetail
                ? itn.Container.ShelfDetail.trim()
                : null,
            ContainerTypeID:
              itn.Container && itn.Container.ContainerTypeID
                ? itn.Container.ContainerTypeID
                : null,
            ContainerType: {
              _id: itn.Container.ContainerType._id,
              Name: itn.Container.ContainerType.Name.trim(),
              IsMobile: itn.Container.ContainerType.IsMobile,
            },
            USERINFOs: users ? users : null,
          };

          let poList: {
            _id: number;
            PurchaseOrderH: {
              _id: number;
              PurchaseOrderNumber: string;
            };
          }[];

          let receiptDetailList: {
            _id: number;
            ExpectedQuantity: number;
            ReceiptStatus: {
              _id: number;
              Name: string;
            };
          }[];

          let receiptList: {
            _id: number;
            LineNumber: number;
            ExpectedQuantity: number;
            ReceiptH: {
              _id: number;
              ExpectedArrivalDate: string;
              ReceiptNumber: string;
              Vendor: {
                _id: number;
                VendorName: string;
                VendorNumber: string;
              };
            };
            RECEIPTLDs: {
              _id: number;
              ExpectedQuantity: number;
              ReceiptStatus: {
                _id: number;
                Name: string;
              };
            }[];
          }[];

          if (itn.Product.PURCHASEORDERLs) {
            poList = [];
            itn.Product.PURCHASEORDERLs.map((po) => {
              poList.push({
                _id: po._id,
                PurchaseOrderH: {
                  _id:
                    po.PurchaseOrderH && po.PurchaseOrderH._id
                      ? po.PurchaseOrderH._id
                      : null,
                  PurchaseOrderNumber:
                    po.PurchaseOrderH && po.PurchaseOrderH.PurchaseOrderNumber
                      ? po.PurchaseOrderH.PurchaseOrderNumber
                      : null,
                },
              });
            });
          }

          if (itn.Product.RECEIPTLs) {
            receiptList = [];
            itn.Product.RECEIPTLs.map((receipt) => {
              if (receipt.RECEIPTLDs) {
                receiptDetailList = [];
                receipt.RECEIPTLDs.map((receiptDetail) => {
                  receiptDetailList.push({
                    _id: receiptDetail._id,
                    ExpectedQuantity: receiptDetail.ExpectedQuantity
                      ? receiptDetail.ExpectedQuantity
                      : null,
                    ReceiptStatus: {
                      _id:
                        receiptDetail.ReceiptStatus &&
                        receiptDetail.ReceiptStatus._id
                          ? receiptDetail.ReceiptStatus._id
                          : null,
                      Name:
                        receiptDetail.ReceiptStatus &&
                        receiptDetail.ReceiptStatus.Name
                          ? receiptDetail.ReceiptStatus.Name
                          : null,
                    },
                  });
                });
              }

              receiptList.push({
                _id: receipt._id,
                LineNumber: receipt.LineNumber ? receipt.LineNumber : null,
                ExpectedQuantity: receipt.ExpectedQuantity
                  ? receipt.ExpectedQuantity
                  : null,
                ReceiptH: {
                  _id:
                    receipt.ReceiptH && receipt.ReceiptH._id
                      ? receipt.ReceiptH._id
                      : null,
                  ExpectedArrivalDate:
                    receipt.ReceiptH && receipt.ReceiptH.ExpectedArrivalDate
                      ? new Date(
                          Number(receipt.ReceiptH.ExpectedArrivalDate)
                        ).toLocaleDateString()
                      : null,
                  ReceiptNumber:
                    receipt.ReceiptH && receipt.ReceiptH.ReceiptNumber
                      ? receipt.ReceiptH.ReceiptNumber
                      : null,
                  Vendor: {
                    _id:
                      receipt.ReceiptH &&
                      receipt.ReceiptH.Vendor &&
                      receipt.ReceiptH.Vendor._id
                        ? receipt.ReceiptH.Vendor._id
                        : null,
                    VendorName:
                      receipt.ReceiptH &&
                      receipt.ReceiptH.Vendor &&
                      receipt.ReceiptH.Vendor.VendorName
                        ? receipt.ReceiptH.Vendor.VendorName
                        : null,
                    VendorNumber:
                      receipt.ReceiptH &&
                      receipt.ReceiptH.Vendor &&
                      receipt.ReceiptH.Vendor.VendorNumber
                        ? receipt.ReceiptH.Vendor.VendorNumber
                        : null,
                  },
                },
                RECEIPTLDs: receiptDetailList ? receiptDetailList : null,
              });
            });
          }

          tempITN.Product = {
            _id: itn.Product._id,
            ProductCodeID:
              itn.Product && itn.Product.ProductCodeID
                ? itn.Product.ProductCodeID
                : null,
            PartNumber:
              itn.Product && itn.Product.PartNumber
                ? itn.Product.PartNumber.trim()
                : null,
            ProductTier:
              itn.Product && itn.Product.ProductTier
                ? itn.Product.ProductTier.trim()
                : null,
            ProductCode: {
              _id: itn.Product.ProductCode._id,
              ProductCodeNumber:
                itn.Product &&
                itn.Product.ProductCode &&
                itn.Product.ProductCode.ProductCodeNumber
                  ? itn.Product.ProductCode.ProductCodeNumber.trim()
                  : null,
            },
            PURCHASEORDERLs: poList ? poList : null,
            RECEIPTLs: receiptList ? receiptList : null,
          };

          let orderLines: {
            _id: number;
            OrderID: number;
            OrderLineID: number;
            StatusID: number;
            Quantity: number;
            LastUpdated?: string;
            BinLocation?: string;
            WMSPriority: number;
            Status: {
              _id: number;
              Name: string;
            };
            OrderLine: {
              _id: number;
              OrderLineNumber: number;
              Quantity?: number;
            };
            Order: {
              _id: number;
              DistributionCenter: string;
              OrderNumber: string;
              NOSINumber: string;
              OrderStatusCode?: string;
              ShipmentMethodID?: string;
              OrderType?: string;
              isSelected: number;
              CustomerID?: number;
              ShipmentMethod?: {
                _id: string;
                ShippingMethod: string;
                PriorityPinkPaper: boolean;
              };
              Customer?: {
                _id: number;
                CustomerNumber: string;
                CustomerTier: string;
              };
            };
          }[];

          if (itn.ORDERLINEDETAILs) {
            orderLines = [];
            itn.ORDERLINEDETAILs.map((orderLine) => {
              orderLines.push({
                _id: orderLine._id,
                OrderID: orderLine.OrderID ? orderLine.OrderID : null,
                OrderLineID: orderLine.OrderLineID
                  ? orderLine.OrderLineID
                  : null,
                StatusID: orderLine.StatusID ? orderLine.StatusID : null,
                Quantity: orderLine.Quantity ? orderLine.Quantity : null,
                LastUpdated: orderLine.LastUpdated
                  ? new Date(Number(orderLine.LastUpdated)).toLocaleString()
                  : null,
                BinLocation: orderLine.BinLocation
                  ? orderLine.BinLocation.trim()
                  : null,
                WMSPriority: orderLine.WMSPriority
                  ? orderLine.WMSPriority
                  : null,
                Status: {
                  _id: orderLine.Status._id,
                  Name: orderLine ? orderLine.Status.Name.trim() : null,
                },
                OrderLine: {
                  _id: orderLine.OrderLine._id,
                  OrderLineNumber:
                    orderLine.OrderLine && orderLine.OrderLine.OrderLineNumber
                      ? orderLine.OrderLine.OrderLineNumber
                      : null,
                  Quantity:
                    orderLine.OrderLine && orderLine.OrderLine.Quantity
                      ? orderLine.OrderLine.Quantity
                      : null,
                },
                Order: {
                  _id: orderLine.Order._id,
                  DistributionCenter:
                    orderLine.Order && orderLine.Order.DistributionCenter
                      ? orderLine.Order.DistributionCenter.trim()
                      : null,
                  OrderNumber:
                    orderLine.Order && orderLine.Order.OrderNumber
                      ? orderLine.Order.OrderNumber.trim()
                      : null,
                  NOSINumber:
                    orderLine.Order && orderLine.Order.NOSINumber
                      ? orderLine.Order.NOSINumber.trim()
                      : null,
                  OrderStatusCode:
                    orderLine.Order && orderLine.Order.OrderStatusCode
                      ? orderLine.Order.OrderStatusCode
                      : null,
                  ShipmentMethodID:
                    orderLine.Order && orderLine.Order.ShipmentMethodID
                      ? orderLine.Order.ShipmentMethodID
                      : null,
                  OrderType:
                    orderLine.Order && orderLine.Order.OrderType
                      ? orderLine.Order.OrderType
                      : null,
                  isSelected:
                    orderLine.Order && orderLine.Order.isSelected
                      ? orderLine.Order.isSelected
                      : null,
                  CustomerID:
                    orderLine.Order && orderLine.Order.CustomerID
                      ? orderLine.Order.CustomerID
                      : null,
                  ShipmentMethod:
                    orderLine.Order && orderLine.Order.ShipmentMethod
                      ? {
                          _id: orderLine.Order.ShipmentMethod._id,
                          ShippingMethod: orderLine.Order.ShipmentMethod
                            .ShippingMethod
                            ? orderLine.Order.ShipmentMethod.ShippingMethod.trim()
                            : null,
                          PriorityPinkPaper: orderLine.Order.ShipmentMethod
                            .PriorityPinkPaper
                            ? orderLine.Order.ShipmentMethod.PriorityPinkPaper
                            : null,
                        }
                      : null,
                  Customer:
                    orderLine.Order && orderLine.Order.Customer
                      ? {
                          _id: orderLine.Order.Customer._id,
                          CustomerNumber:
                            orderLine.Order.Customer.CustomerNumber.trim(),
                          CustomerTier:
                            orderLine.Order.Customer.CustomerTier.trim(),
                        }
                      : null,
                },
              });
            });
          }

          tempITN.ORDERLINEDETAILs = orderLines ? orderLines : null;

          this.itn = tempITN;
        })
      );
  }
}
