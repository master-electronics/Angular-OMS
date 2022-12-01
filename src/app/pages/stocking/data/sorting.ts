import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { VerifyItnForSortingGQL } from 'src/app/graphql/stocking.graphql-gen';
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
  productID: number;
  productCode: string;
  partNumber: string;
  QuantityOnHand: number;
  remaining: number;
  productType: string;
  velocity: string;
  zone: number;
  suggetionLocationList: SuggetionLocation[];
  OrderNumber: string;
  NOSINumber: string;
  OrderLineNumber: number;
}
@Injectable()
export class SortingService {
  constructor(
    private _verifyITN: VerifyItnForSortingGQL,
    private _insertLog: Insert_UserEventLogsGQL
  ) {}
  //
  private _sortingInfo = new BehaviorSubject<SortingInfo>(null);
  public changeSortingInfo(date: SortingInfo): void {
    this._sortingInfo.next(date);
  }
  //
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
            productID: inventory.Product._id,
            InventoryID: inventory._id,
            productCode: inventory.Product.ProductCode.ProductCodeNumber,
            partNumber: inventory.Product.PartNumber,
            QuantityOnHand: inventory.QuantityOnHand ?? null,
            remaining: null,
            productType: null,
            velocity: inventory.Product.DCPRODUCTs[0]?.Velocity ?? null,
            zone: null,
            suggetionLocationList: [],
            OrderNumber: inventory.ORDERLINEDETAILs[0].Order.OrderNumber,
            NOSINumber: inventory.ORDERLINEDETAILs[0].Order.NOSINumber,
            OrderLineNumber:
              inventory.ORDERLINEDETAILs[0].OrderLine.OrderLineNumber,
          });
          return this._insertLog.mutate({
            log: {
              UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
              UserEventID: sqlData.Event_Stocking_SortingStart,
              OrderNumber: inventory.ORDERLINEDETAILs[0].Order.OrderNumber,
              NOSINumber: inventory.ORDERLINEDETAILs[0].Order.NOSINumber,
              OrderLineNumber:
                inventory.ORDERLINEDETAILs[0].OrderLine.OrderLineNumber,
              InventoryTrackingNumber: ITN,
              Message: ``,
            },
          });
        })
        // map(() => {
        //   this.isLoading = false;
        //   this._router.navigate(['/stocking/sorting/location']);
        // }),
        // catchError((error) => {
        //   this.isLoading = false;
        //   this.alertMessage = error;
        //   this.alertType = 'error';
        //   this.ITNInput.nativeElement.select();
        //   return of(null);
        // })
      );
  }
}
