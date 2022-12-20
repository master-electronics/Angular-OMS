import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  FetchInventoryInUserContainerGQL,
  FetchItnInfoByContainerforStockingGQL,
  FindorCreateUserContainerForStockingGQL,
  MoveInventoryToContainerForStockingGQL,
  UpdateNotFoundForStockingGQL,
  VerifyItnForStockingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { Logger } from 'src/app/shared/services/logger.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';

export interface Tab {
  steps: { title: string; subtitle?: string; description?: string }[];
  currentStep: number;
}

export interface ITNinfo {
  _id: number;
  ITN: string;
  Quantity: number;
  productID: number;
  PartNumber?: string;
  ProductCode?: string;
}

@Injectable()
export class StockingService {
  constructor(
    private _userContainer: FindorCreateUserContainerForStockingGQL,
    private _verifyITN: VerifyItnForStockingGQL,
    private _move: MoveInventoryToContainerForStockingGQL,
    private _verifyBarcode: FetchItnInfoByContainerforStockingGQL,
    private _noFound: UpdateNotFoundForStockingGQL,
    private _insertLog: Insert_UserEventLogsGQL,
    private _ItnInUser: FetchInventoryInUserContainerGQL
  ) {}

  /**
   * User ContainerID
   */
  private _userContainerID = new BehaviorSubject<number>(null);
  public get userContainerID(): number {
    return this._userContainerID.value;
  }

  private _currentITN = new BehaviorSubject<ITNinfo>(null);
  public get currentITN() {
    return this._currentITN.value;
  }
  public get currentITN$() {
    return this._currentITN.asObservable();
  }
  public updateCurrentItn(itn: ITNinfo) {
    this._currentITN.next(itn);
  }

  private _ITNList = new BehaviorSubject<ITNinfo[]>([]);
  public get ITNList() {
    return this._ITNList.value;
  }
  public updateItnList(list: ITNinfo[]): void {
    this._ITNList.next(list);
  }

  private _verifiedItns = new BehaviorSubject<ITNinfo[]>([]);
  public get verifiedItns() {
    return this._verifiedItns.value;
  }
  /**
   * verifiedItns should be a set of itn object. not dupicate elements.
   */
  public addVerifiedItns(itn: ITNinfo) {
    const currentList = this._verifiedItns.value;
    if (!currentList?.length) {
      this._verifiedItns.next([itn]);
      return;
    }
    const set = [...new Map(currentList.map((itn) => [itn.ITN, itn])).values()];
    this._verifiedItns.next(set);
  }

  public reset(): void {
    this._currentITN.next(null);
    this._ITNList.next(null);
    this._verifiedItns.next(null);
  }

  /**
   * Fetch or create a container as user's username in Container table.
   */
  public get containerID$() {
    return this._userContainerID.asObservable().pipe(
      switchMap((res) => {
        if (res) {
          return of(res);
        }
        return this._userContainer
          .mutate({
            DistributionCenter: environment.DistributionCenter,
            Barcode: String(
              JSON.parse(sessionStorage.getItem('userInfo')).Name
            ),
            ContainerTypeID: sqlData.userType_ID,
          })
          .pipe(
            map((res) => {
              this._userContainerID.next(
                res.data.findOrCreateUserContainer._id
              );
              return this._userContainerID.value;
            })
          );
      })
    );
  }

  /**
   * moveItnToUser: Verify itn first, then move this ITN to user container.
   */
  public moveItnToUser(ITN: string): Observable<any> {
    return this._verifyITN
      .fetch(
        {
          ITN,
          DC: environment.DistributionCenter,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findInventory) {
            throw new Error('ITN not found');
          }
          if (!this._userContainerID.value) {
            throw new Error('Container not found');
          }
        }),

        switchMap((res) => {
          const inventory = res.data.findInventory;
          const ITNInfo = {
            _id: inventory._id,
            ITN,
            Quantity: inventory.QuantityOnHand,
            productID: inventory.Product._id,
            PartNumber: inventory.Product.PartNumber,
            ProductCode: inventory.Product.ProductCode.ProductCodeNumber,
          };
          this._currentITN.next(ITNInfo);
          return this._move.mutate({
            ITN: this.currentITN.ITN,
            DC: environment.DistributionCenter,
            ContainerID: this.userContainerID,
          });
        }),

        switchMap(() =>
          this._insertLog.mutate({
            log: {
              UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
              UserEventID: sqlData.Event_Stocking_Stocking_MoveITNToUser,
              InventoryTrackingNumber: this.currentITN.ITN,
              PartNumber: this.currentITN.PartNumber,
              ProductCode: this.currentITN.ProductCode,
              Message: ``,
            },
          })
        )
      );
  }

  /**
   * Verify the location Barcode, then find all itns in this location
   */
  public findITNsInLocation(Barcode: string) {
    return this._verifyBarcode
      .fetch(
        {
          Barcode,
          DC: environment.DistributionCenter,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findContainer) {
            throw new Error(`${Barcode} not found!`);
          }
          if (!res.data.findContainer.ContainerType.IsMobile) {
            throw new Error(`${Barcode} is not a mobile container!`);
          }
          if (res.data.findContainer.INVENTORies.length === 0) {
            throw new Error(`${Barcode} has no ITN!`);
          }
        }),
        map((res) => res.data.findContainer.INVENTORies),
        switchMap((res) => {
          const ITNList = res.map((item) => {
            Logger.devOnly(
              'stockingService',
              'findITNsInLocation',
              item.InventoryTrackingNumber
            );
            return {
              _id: item._id,
              ITN: item.InventoryTrackingNumber,
              Quantity: item.QuantityOnHand,
              productID: item.Product._id,
            };
          });
          const log = {
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            UserEventID: sqlData.Event_Stocking_ScanLocation,
            Message: `Barcode`,
          };
          this._ITNList.next(ITNList);
          return this._insertLog.mutate({ log });
        })
      );
  }

  /**
   * notFound
   */
  public addNotFoundFlag$(ITNList: string[]) {
    const log = ITNList.map((itn) => ({
      UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
      UserEventID: sqlData.Event_Stocking_NotFound,
      InventoryTrackingNumber: itn,
      Message: ``,
    }));
    return this._noFound
      .mutate({
        ITNList,
        DC: environment.DistributionCenter,
      })
      .pipe(switchMap(() => this._insertLog.mutate({ log })));
  }

  /**
   * ItnInUserContainer
   */
  public ItnInUserContainer$() {
    return this._ItnInUser.fetch({ ContainerID: this.userContainerID }).pipe(
      map((res) => res.data.findContainer.INVENTORies),
      tap((res) => {
        if (!res.length) {
          throw new Error('Not ITN  Under User');
        }
      })
    );
  }
}