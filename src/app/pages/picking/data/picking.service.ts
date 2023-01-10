import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { FetchInfoForPickingGQL } from 'src/app/graphql/picking.graphql-gen';
import { UserContainerService } from 'src/app/shared/data/user-container';
import { environment } from 'src/environments/environment';

export interface ItnInfo {
  OrderNumber: string;
  NOSINumber: string;
  PartNumber: string;
  ProductCode: string;
  ProductType?: string;
  GlobaleMessage?: string;
  Unit?: string;
}

@Injectable()
export class PickingService {
  constructor(
    private _userC: UserContainerService,
    private _fetchInfo: FetchInfoForPickingGQL
  ) {}

  private _itnInfo = new BehaviorSubject<ItnInfo>(null);
  public get itnInfo() {
    return this._itnInfo.value;
  }

  /**
   * fetchItnInfo$
   */
  public fetchItnInfo$(itn: string): Observable<boolean> {
    return this._fetchInfo
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
        map((res) => {
          this._itnInfo.next({
            OrderNumber: res.ORDERLINEDETAILs[0].Order.OrderNumber,
            NOSINumber: res.ORDERLINEDETAILs[0].Order.NOSINumber,
            PartNumber: res.Product.PartNumber,
            ProductCode: res.Product.ProductCode.ProductCodeNumber,
          });
          return true;
        })
      );
  }
}
