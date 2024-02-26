import { Injectable, inject, signal } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';
import {
  QcGlobalMessageGQL,
  VerifyItNforQcGQL,
} from 'src/app/graphql/qualityControl.graphql-gen';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { AutoStoreBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { EventLogService } from 'src/app/shared/data/eventLog';

interface QcItnInfo {
  InventoryTrackingNumber: string;
  InventoryID: number;
  OrderLineDetailID: number;
  OrderID: number;
  CustomerNumber: string;
  DistributionCenter: string;
  OrderNumber: string;
  NOSI: string;
  OrderLineNumber: number;
  PartNumber: string;
  ProductCode: string;
  Quantity: number;
  ParentITN: string;
  ROHS: boolean;
  DateCode: string;
  CountryISO2: string;
  CountMethod: string;
  isHold: boolean;
  CustomerTier: string;
  ProductTier: string;
  ShipmentMethod: string;
  ShipmentMethodDescription: string;
  WMSPriority: number;
  Priority: boolean;
}

@Injectable()
export class OrderService {
  private _userInfo = inject(StorageUserInfoService);
  private _verifyItn = inject(VerifyItNforQcGQL);
  private _log = inject(EventLogService);
  private _message = inject(QcGlobalMessageGQL);

  private _itnInfo = signal<QcItnInfo>(null);
  get itnInfo() {
    return this._itnInfo();
  }
  public setItnInfo(info: QcItnInfo) {
    this._itnInfo.set(info);
  }

  public verifyQcItn$(itn: string) {
    return this._verifyItn
      .fetch(
        {
          DistributionCenter: this._userInfo.distributionCenter,
          InventoryTrackingNumber: itn,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findInventory.ORDERLINEDETAILs?.length) {
            throw 'Can not find this order';
          }

          if (res.data.findInventory.ORDERLINEDETAILs?.length > 1) {
            throw 'Invalid Order Line Detail';
          }
          let error = '';
          if (
            ![
              sqlData.droppedQC_ID,
              sqlData.warehouseHold_ID,
              sqlData.qcComplete_ID,
            ].includes(res.data.findInventory.ORDERLINEDETAILs[0].StatusID) &&
            !res.data.findInventory.ORDERLINEDETAILs[0].BinLocation.trim().match(
              AutoStoreBarcodeRegex
            )
          ) {
            error += `Invalid order line status ${res.data.findInventory.ORDERLINEDETAILs[0].StatusID}. Must be 20, 30, or 60`;
          }
          if (error) {
            throw error;
          }
        }),
        tap((res) => {
          const detail = res.data.findInventory;
          const Order = res.data.findInventory.ORDERLINEDETAILs[0].Order;
          const OrderLine =
            res.data.findInventory.ORDERLINEDETAILs[0].OrderLine;
          this.setItnInfo({
            InventoryTrackingNumber: itn,
            InventoryID: detail._id,
            OrderLineDetailID: detail.ORDERLINEDETAILs[0]._id,
            OrderID: Order._id,
            CustomerNumber: Order.Customer?.CustomerNumber.trim() || '',
            DistributionCenter: Order.DistributionCenter?.trim(),
            OrderNumber: Order.OrderNumber?.trim(),
            NOSI: Order.NOSINumber?.trim(),
            OrderLineNumber: OrderLine.OrderLineNumber,
            PartNumber: detail.Product.PartNumber?.trim(),
            ProductCode: detail.Product.ProductCode.ProductCodeNumber.trim(),
            Quantity: detail.ORDERLINEDETAILs[0].Quantity,
            ParentITN: detail.ParentITN?.trim() || '',
            ROHS: detail.ROHS,
            DateCode: detail.DateCode?.trim() || '',
            CountryISO2: detail.Country?.ISO2 || '',
            CountMethod: '',
            isHold: !!detail.ORDERLINEDETAILs[0].BinLocation.toLowerCase()
              .trim()
              .match(/^hld*/gi),
            CustomerTier: Order.Customer?.CustomerTier,
            ProductTier: detail.Product?.ProductTier,
            ShipmentMethod: Order.ShipmentMethod._id,
            ShipmentMethodDescription: Order.ShipmentMethod.ShippingMethod,
            WMSPriority: detail.ORDERLINEDETAILs[0].WMSPriority,
            Priority: Order.ShipmentMethod.PriorityPinkPaper,
          });
        }),
        switchMap(() => {
          this._log.initOldLog({
            UserName: this._userInfo.userName,
            OrderNumber: this.itnInfo.OrderNumber,
            NOSINumber: this.itnInfo.NOSI,
            OrderLineNumber: this.itnInfo.OrderLineNumber,
            InventoryTrackingNumber: itn,
            UserEventID: sqlData.Event_QC_Start,
            CustomerNumber: this.itnInfo.CustomerNumber,
            CustomerTier: this.itnInfo.CustomerTier,
            DistributionCenter: this.itnInfo.DistributionCenter,
            PartNumber: this.itnInfo.PartNumber,
            ProductCode: this.itnInfo.ProductCode,
            ProductTier: this.itnInfo.ProductTier,
            Quantity: this.itnInfo.Quantity,
            ParentITN: this.itnInfo.ParentITN,
            ShipmentMethod: this.itnInfo.ShipmentMethod,
            ShipmentMethodDescription: this.itnInfo.ShipmentMethodDescription,
            WMSPriority: this.itnInfo.WMSPriority,
            Priority: this.itnInfo.Priority,
          });
          this._log.initEventLog({
            UserName: this._userInfo.userName,
            EventTypeID: sqlData.Event_QC_Start,
            Log: JSON.stringify({
              ...this.itnInfo,
            }),
          });
          return this._log.insertLogs$();
        })
      );
  }

  /**
   *
   */
  public fetchGlobalMessages$() {
    return this._message
      .fetch({
        CustomerNumber: this.itnInfo.CustomerNumber,
        DistributionCenter: this.itnInfo.DistributionCenter,
        OrderNumber: this.itnInfo.OrderNumber,
        OrderLineNumber: this.itnInfo.OrderLineNumber.toString(),
        PartNumber: this.itnInfo.PartNumber,
        ProductCode: this.itnInfo.ProductCode,
      })
      .pipe(
        tap((res) => {
          if (
            !res.data.fetchOrderLineMessage.comments.length &&
            !res.data.fetchOrderLineMessage.comments.length
          ) {
            throw new Error('No messages!');
          }
        }),
        map((res) => {
          return {
            orderLine: res.data.fetchOrderLineMessage?.comments,
            part: res.data.fetchPartMessage?.comments,
          };
        })
      );
  }
}
