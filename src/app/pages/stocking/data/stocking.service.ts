import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  FetchItnInfoByContainerforStockingGQL,
  FindorCreateUserContainerForStockingGQL,
  MoveInventoryToContainerForStockingGQL,
  VerifyItnForStockingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
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
}

@Injectable()
export class StockingService {
  constructor(
    private _userContainer: FindorCreateUserContainerForStockingGQL,
    private _verifyITN: VerifyItnForStockingGQL,
    private _move: MoveInventoryToContainerForStockingGQL,
    private _verifyBarcode: FetchItnInfoByContainerforStockingGQL,
    private _insertLog: Insert_UserEventLogsGQL
  ) {}

  /**
   * Store user container id
   */
  private _containerID = new BehaviorSubject<number>(null);
  public get containerID(): number {
    return this._containerID.value;
  }
  private _currentITN = new BehaviorSubject<ITNinfo>(null);
  private _ITNList = new BehaviorSubject<ITNinfo[]>(null);
  /**
   * Fetch or create a container as user's username in Container table.
   */
  public get containerID$() {
    return this._containerID.asObservable().pipe(
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
              this._containerID.next(res.data.findOrCreateUserContainer._id);
              return this._containerID.value;
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
          if (!this._containerID.value) {
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
          };
          // If user scan a itn, store info, then do a single itn stocking in next page.
          this._ITNList.next([ITNInfo]);
          this._currentITN.next(ITNInfo);
          const log = this._insertLog.mutate({
            log: {
              UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
              UserEventID: sqlData.Event_Stocking_ScanITN,
              InventoryTrackingNumber: ITN,
              PartNumber: inventory.Product.PartNumber,
              ProductCode: inventory.Product.ProductCode.ProductCodeNumber,
            },
          });
          const moveToUser = this._move.mutate({
            ContainerID: this.containerID,
            ITN,
            DC: environment.DistributionCenter,
          });
          return forkJoin({ log, moveToUser });
        })
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
          if (!res.data.findContainer._id) {
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
          const ITNList = res.map((item) => ({
            _id: item._id,
            ITN: item.InventoryTrackingNumber,
            Quantity: item.QuantityOnHand,
            productID: item.Product._id,
          }));
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
}
