import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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

  private _itnInfo = new BehaviorSubject<ItnInfo>(null);
  public get itnInfo() {
    return this._itnInfo.value;
  }
  public get itnInfo$() {
    return this._itnInfo.asObservable();
  }

  /**
   *
   * @param date Update itnInfo
   */
  public changeItnInfo(date: ItnInfo): void {
    this._itnInfo.next(date);
  }

  /**
   * resetItnInfo
   */
  public resetItnInfo(): void {
    this._itnInfo.next(null);
  }

  public verifyITN$(ITN: string): Observable<any> {
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
            ProductType: inventory.Product.ProductType.ProductType,
            Remaining: null,
          });
        })
      );
  }
}
