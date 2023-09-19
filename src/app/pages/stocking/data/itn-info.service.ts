import { Injectable, effect, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { VerifyItnForSortingGQL } from 'src/app/graphql/stocking.graphql-gen';
import { SESSION_STORAGE } from 'src/app/shared/utils/storage';
import { environment } from 'src/environments/environment';

export interface ItnInfo {
  ITN: string;
  InventoryID: number;
  ProductID: number;
  ProductCode: string;
  PartNumber: string;
  QuantityOnHand: number;
  Remaining: number;
  ProductType: string;
  Velocity: string;
  Autostore: boolean;
}

@Injectable()
export class ItnInfoService {
  private _sessionStorage = inject(SESSION_STORAGE);
  constructor(private _verifyITN: VerifyItnForSortingGQL) {
    effect(() => {
      this._sessionStorage.setItem(
        'stockingItnInfo',
        JSON.stringify(this.itnInfo())
      );
    });
  }

  itnInfo = signal<ItnInfo>(
    JSON.parse(this._sessionStorage.getItem('stockingItnInfo'))
  );

  /**
   * resetItnInfo
   */
  public reset(): void {
    this.itnInfo.set(null);
  }

  public verifyITN$(ITN: string) {
    return this._verifyITN
      .fetch(
        { ITN, DC: environment.DistributionCenter },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findInventory._id) {
            throw new Error('ITN not found');
          }
          if (!res.data.findInventory.Container.ContainerType.IsMobile) {
            throw new Error('Must be in a mobile container');
          }
          if (
            res.data.findInventory.ORDERLINEDETAILs.length &&
            res.data.findInventory.ORDERLINEDETAILs[0].StatusID
          ) {
            throw new Error("Can't move this ITN after picking.");
          }
          const inventory = res.data.findInventory;
          this.itnInfo.set({
            ITN,
            ProductID: inventory.Product._id,
            InventoryID: inventory._id,
            ProductCode: inventory.Product.ProductCode.ProductCodeNumber,
            PartNumber: inventory.Product.PartNumber,
            QuantityOnHand: inventory.QuantityOnHand,
            Velocity: inventory.Product.Velocity,
            Autostore: inventory.Product.Autostore,
            ProductType: 'STANDARD',
            Remaining: null,
          });
        })
      );
  }
}
