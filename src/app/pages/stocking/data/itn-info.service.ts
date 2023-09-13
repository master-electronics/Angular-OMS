import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { VerifyItnForSortingGQL } from 'src/app/graphql/stocking.graphql-gen';
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
  constructor(private _verifyITN: VerifyItnForSortingGQL) {}

  public get itnInfo() {
    return JSON.parse(localStorage.getItem('stockingItnInfo') || 'null');
  }
  public get itnInfo$() {
    const info = JSON.parse(localStorage.getItem('stockingItnInfo') || 'null');
    return of(info);
  }

  /**
   *
   * @param date Update itnInfo
   */
  public changeItnInfo(date: ItnInfo): void {
    localStorage.setItem('stockingItnInfo', JSON.stringify(date));
  }

  /**
   * resetItnInfo
   */
  public resetItnInfo(): void {
    localStorage.removeItem('stockingItnInfo');
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
          this.changeItnInfo({
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
