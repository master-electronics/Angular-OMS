import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import {
  FetchInfoForPickingGQL,
  FetchProductImgAndMessageFromMerpGQL,
  UpdateInventoryToUserGQL,
} from 'src/app/graphql/picking.graphql-gen';
import { Insert_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { UserContainerService } from 'src/app/shared/data/user-container';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';

export interface ItnInfo {
  InventoryID: number;
  OrderLineDetailID: number;
  QuantityOnHand: number;
  OrderNumber: string;
  NOSINumber: string;
  PartNumber: string;
  ProductCode: string;
  Quantity: number;
  ProductType?: string;
  GlobaleMessage?: string[];
  Unit?: string;
  MIC?: string;
}

export interface SamanageInfo {
  Type?: string;
  ProductCode?: string;
  PartNumber?: string;
  Date?: string;
  User?: string;
  Comments?: string;
}

@Injectable()
export class PickingService {
  userInfo = inject(StorageUserInfoService);
  constructor(
    private _userC: UserContainerService,
    private _fetchITNInfo: FetchInfoForPickingGQL,
    private _fetchProductInfo: FetchProductImgAndMessageFromMerpGQL,
    private _eventLog: Insert_EventLogsGQL,
    private _move: UpdateInventoryToUserGQL
  ) {}

  private _itnInfo = new BehaviorSubject<ItnInfo>(null);
  public get itnInfo() {
    return this._itnInfo.value;
  }

  private _samanageInfo = new BehaviorSubject<SamanageInfo>(null);
  public get samanageInfo() {
    return this._samanageInfo.value;
  }

  /**
   * fetchItnInfo$
   */
  public fetchItnInfo$(itn: string): Observable<boolean> {
    return this._fetchITNInfo
      .fetch({
        InventoryTrackingNumber: itn,
        DistributionCenter: this.userInfo.distributionCenter,
      })
      .pipe(
        tap((res) => {
          if (!res.data.findInventory) {
            throw new Error("Can't find this ITN in Inventory!");
          }
          if (!res.data.findInventory.ORDERLINEDETAILs.length) {
            throw new Error("Can't find this ITN in OrderLineDetail!");
          }
          if (
            res.data.findInventory.ORDERLINEDETAILs[0].StatusID !==
            sqlData.inPickQueue
          ) {
            throw new Error('This ITN is not in pick queue!');
          }
        }),
        map((res) => res.data.findInventory),
        switchMap((res) => {
          this._itnInfo.next({
            InventoryID: res._id,
            QuantityOnHand: res.QuantityOnHand,
            OrderLineDetailID: res.ORDERLINEDETAILs[0]._id,
            OrderNumber: res.ORDERLINEDETAILs[0].Order.OrderNumber,
            NOSINumber: res.ORDERLINEDETAILs[0].Order.NOSINumber,
            PartNumber: res.Product.PartNumber,
            ProductCode: res.Product.ProductCode.ProductCodeNumber,
            Quantity: res.ORDERLINEDETAILs[0].Quantity,
          });
          return this._fetchProductInfo.fetch({
            PartNumber: this.itnInfo.PartNumber,
            ProductCode: this.itnInfo.ProductCode,
            ProductList: [
              `${this.itnInfo.ProductCode}${this.itnInfo.PartNumber}`,
            ],
          });
        }),
        map((res) => {
          this._itnInfo.next({
            ...this.itnInfo,
            MIC: res.data.fetchProductInfoFromMerp[0].MICPartNumber,
            Unit: res.data.fetchProductInfoFromMerp[0].UnitOfMeasure,
            GlobaleMessage: res.data.fetchPartMessage.comments,
          });
          return true;
        })
      );
  }

  /**
   * changedToUserLocation
   */
  public moveItnToUser$(): Observable<boolean> {
    return combineLatest([
      this._eventLog.mutate(),
      this._move.mutate({
        ContainerID: this._userC.userContainerID,
        InventoryID: this.itnInfo.InventoryID,
      }),
    ]).pipe(map(() => true));
  }

  /**
   * updateSamanageInfo
   */
  public updateSamanageInfo(info: SamanageInfo) {
    this._samanageInfo.next({
      ...this.samanageInfo,
      ...info,
    });
  }

  /**
   * send update ticket to Samanage
   */
  public sendUpdateTicketToSamanage$() {
    // return this._mail.mutate({ Text: ``, Subject: ``, Recipients: `` });
    // switchMap(() => {
    //   const log = {};
    //   return this._eventLog.mutate(log);
    // })
  }
}
