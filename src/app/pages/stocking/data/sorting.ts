import { Injectable } from '@angular/core';
import { BehaviorSubject, elementAt, map, switchMap, tap } from 'rxjs';
import {
  FetchSuggetionLocationForSortingGQL,
  UpdateInventoryAfterSortingGQL,
  VerifyContainerForSortingGQL,
  VerifyItnForSortingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';

export interface SuggetionLocation {
  Bincode: string;
  Zone: number;
  Quantity: number;
}

export interface SortingInfo {
  ITN: string;
  InventoryID: number;
  ProductID: number;
  ProductCode: string;
  PartNumber: string;
  QuantityOnHand: number;
  Remaining: number;
  ProductType: string;
  Velocity: string;
}
@Injectable()
export class SortingService {
  constructor(
    private _verifyITN: VerifyItnForSortingGQL,
    private _insertLog: Insert_UserEventLogsGQL,
    private _suggetLocation: FetchSuggetionLocationForSortingGQL,
    private _verifyContainer: VerifyContainerForSortingGQL,
    private _updateInventory: UpdateInventoryAfterSortingGQL
  ) {}
  //
  private _sortingInfo = new BehaviorSubject<SortingInfo>(null);
  public get sortingInfo() {
    return this._sortingInfo.value;
  }
  public get sortingInfo$() {
    return this._sortingInfo.asObservable();
  }

  /**
   *
   * @param date Update sortingInfo
   */
  public changeSortingInfo(date: SortingInfo): void {
    this._sortingInfo.next(date);
  }

  /**
   * @param ITN User input ITN
   * @returns result of http request.
   */
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
        }),
        switchMap((res) => {
          const inventory = res.data.findInventory;
          this.changeSortingInfo({
            ITN,
            ProductID: inventory.Product._id,
            InventoryID: inventory._id,
            ProductCode: inventory.Product.ProductCode.ProductCodeNumber,
            PartNumber: inventory.Product.PartNumber,
            QuantityOnHand: inventory.QuantityOnHand,
            Velocity: inventory.Product.DCPRODUCTs[0]?.Velocity,
            Remaining: null,
            ProductType: null,
          });
          return this._insertLog.mutate({
            log: {
              UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
              UserEventID: sqlData.Event_Stocking_SortingStart,
              InventoryTrackingNumber: ITN,
              PartNumber: this.sortingInfo.PartNumber,
              ProductCode: this.sortingInfo.ProductCode,
              Quantity: this.sortingInfo.QuantityOnHand,
              Message: ``,
            },
          });
        })
      );
  }

  public suggestLocation$() {
    return this._suggetLocation
      .fetch({ ProductID: this.sortingInfo?.ProductID, limit: 5 })
      .pipe(
        map((res) => {
          return res.data.findInventorys.map((inventory) => ({
            Quantity: inventory.QuantityOnHand,
            Zone: inventory.Container.Zone,
            Bincode: inventory.Container.Barcode,
          }));
        })
      );
  }

  public moveItn$(Barcode: string) {
    return this._verifyContainer
      .fetch(
        { Barcode, DistributionCenter: environment.DistributionCenter },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findContainer._id) {
            throw new Error('Container not found!');
          }
          if (!res.data.findContainer.ContainerType.IsMobile) {
            throw new Error('This container is not a mobile container');
          }
        }),
        switchMap((res) => {
          return this._updateInventory.mutate({
            InventoryID: this.sortingInfo.InventoryID,
            ContainerID: res.data.findContainer._id,
            log: {
              UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
              UserEventID: sqlData.Event_Stocking_SortingDone,
              ProductCode: this.sortingInfo.ProductCode,
              PartNumber: this.sortingInfo.PartNumber,
              Quantity: this.sortingInfo.QuantityOnHand,
              InventoryTrackingNumber: this.sortingInfo.ITN,
              Message: Barcode,
            },
          });
        })
      );
  }
}
