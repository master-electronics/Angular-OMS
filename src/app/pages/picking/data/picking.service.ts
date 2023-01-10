import { Injectable } from '@angular/core';
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
import { environment } from 'src/environments/environment';

export interface ItnInfo {
  InventoryID: number;
  OrderNumber: string;
  NOSINumber: string;
  PartNumber: string;
  ProductCode: string;
  ProductType?: string;
  GlobaleMessage?: string[];
  Unit?: string;
  MIC?: string;
}

@Injectable()
export class PickingService {
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

  /**
   * fetchItnInfo$
   */
  public fetchItnInfo$(itn: string): Observable<boolean> {
    return this._fetchITNInfo
      .fetch({
        InventoryTrackingNumber: itn,
        DistributionCenter: environment.DistributionCenter,
      })
      .pipe(
        tap((res) => {
          if (!res.data.findInventory) {
            throw new Error("Can't find this ITN in Inventory!");
          }
          if (!res.data.findInventory.ORDERLINEDETAILs.length) {
            throw new Error("Can't find this ITN in OrderLineDetail!");
          }
        }),
        map((res) => res.data.findInventory),
        switchMap((res) => {
          this._itnInfo.next({
            InventoryID: res._id,
            OrderNumber: res.ORDERLINEDETAILs[0].Order.OrderNumber,
            NOSINumber: res.ORDERLINEDETAILs[0].Order.NOSINumber,
            PartNumber: res.Product.PartNumber,
            ProductCode: res.Product.ProductCode.ProductCodeNumber,
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
}