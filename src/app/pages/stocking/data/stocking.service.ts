import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  FetchInventoryInUserContainerGQL,
  FetchItnInfoByContainerforStockingGQL,
  MoveInventoryToContainerForStockingGQL,
  UpdateInventoryAfterSortingGQL,
  UpdateNotFoundForStockingGQL,
  VerifyContainerForSortingGQL,
  VerifyItnForSortingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { UserContainerService } from 'src/app/shared/data/user-container';
import { Logger } from 'src/app/shared/services/logger.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { ItnInfo, ItnInfoService } from './itn-info.service';

@Injectable()
export class StockingService {
  constructor(
    private _userC: UserContainerService,
    private _verifyITN: VerifyItnForSortingGQL,
    private _move: MoveInventoryToContainerForStockingGQL,
    private _verifyBarcode: FetchItnInfoByContainerforStockingGQL,
    private _noFound: UpdateNotFoundForStockingGQL,
    private _insertLog: Create_EventLogsGQL,
    private _ItnInUser: FetchInventoryInUserContainerGQL,
    private _verifyContainer: VerifyContainerForSortingGQL,
    private _updateInventory: UpdateInventoryAfterSortingGQL,
    private _itn: ItnInfoService,
    private _log: EventLogService
  ) {}

  private _ITNList = new BehaviorSubject<ItnInfo[]>([]);
  public get ITNList() {
    return this._ITNList.value;
  }
  public updateItnList(list: ItnInfo[]): void {
    this._ITNList.next(list);
  }

  private _verifiedItns = new BehaviorSubject<string[]>([]);
  public get verifiedItns() {
    return this._verifiedItns.value;
  }
  /**
   * verifiedItns should be a set of itn object. not dupicate elements.
   */
  public addVerifiedItns(itn: ItnInfo) {
    if (!this.verifiedItns?.length) {
      this._verifiedItns.next([itn.ITN]);
      return;
    }
    const tmp = this.verifiedItns;
    tmp.push(itn.ITN);
    const set = new Set(tmp);
    this._verifiedItns.next([...set]);
  }

  public reset(): void {
    this._itn.resetItnInfo();
    this._ITNList.next(null);
    this._verifiedItns.next(null);
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
          if (!this._userC.userContainerID) {
            throw new Error('Container not found');
          }
        }),
        switchMap((res) => {
          const inventory = res.data.findInventory;
          // update itn info
          this._itn.changeItnInfo({
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
          // init evetlog
          this._log.initEventLog({
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            EventTypeID: sqlData.Event_Stocking_Stocking_MoveITNToUser,
            Log: JSON.stringify({
              InventoryTrackingNumber: ITN,
              PartNumber: this._itn.itnInfo.PartNumber,
              ProductCode: this._itn.itnInfo.ProductCode,
              QuantityOnHand: this._itn.itnInfo.QuantityOnHand,
              Velocity: this._itn.itnInfo.Velocity,
            }),
          });
          // insert itn to list when input ITN as target.
          if (!this.ITNList) {
            this._verifiedItns.next([this._itn.itnInfo.ITN]);
            this.updateItnList([this._itn.itnInfo]);
          }
          return this._move.mutate({
            ITN: this._itn.itnInfo.ITN,
            User: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            BinLocation: JSON.parse(sessionStorage.getItem('userInfo')).Name,
          });
        }),
        switchMap(() => {
          const oldLogs = {
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            UserEventID: sqlData.Event_Stocking_Stocking_MoveITNToUser,
            InventoryTrackingNumber: this._itn.itnInfo.ITN,
            PartNumber: this._itn.itnInfo.PartNumber,
            ProductCode: this._itn.itnInfo.ProductCode,
            Message: ``,
          };

          return this._insertLog.mutate({
            oldLogs,
            eventLogs: this._log.eventLog,
          });
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
        map((res) => {
          return res.data.findContainer.INVENTORies;
        }),
        tap((res) => {
          if (!res.length) {
            throw new Error(`${Barcode} has no vaild ITN!`);
          }
        }),
        switchMap((res) => {
          const ITNList = res.map((item) => {
            Logger.devOnly(
              'stockingService',
              'findITNsInLocation',
              item.InventoryTrackingNumber
            );
            return {
              ProductCode: null,
              PartNumber: null,
              Remaining: null,
              ProductType: null,
              Velocity: null,
              ITN: item.InventoryTrackingNumber,
              InventoryID: item._id,
              ProductID: item.Product._id,
              QuantityOnHand: item.QuantityOnHand,
            };
          });
          Logger.devOnly(
            'stockingService',
            'findITNsInLocation',
            ITNList.length
          );
          this._ITNList.next(ITNList);
          // insert log
          const oldLogs = {
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            UserEventID: sqlData.Event_Stocking_ScanLocation,
            Message: Barcode,
          };
          this._log.initEventLog({
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            EventTypeID: sqlData.Event_Stocking_ScanLocation,
            Log: JSON.stringify({
              Source: Barcode,
            }),
          });
          return this._insertLog.mutate({
            oldLogs,
            eventLogs: this._log.eventLog,
          });
        })
      );
  }

  /**
   * notFound
   */
  public addNotFoundFlag$(list: { ITN: string; InventoryID: number }[]) {
    const oldLogs = [];
    const eventLogs = [];
    const ITNList = [];
    const linkList = [];
    list.forEach((itn) => {
      oldLogs.push({
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        UserEventID: sqlData.Event_Stocking_NotFound,
        InventoryTrackingNumber: itn.ITN,
        Message: ``,
      });
      eventLogs.push({
        ...this._log.eventLog,
        EventTypeID: sqlData.Event_Stocking_NotFound,
        Log: JSON.stringify({
          ...JSON.parse(this._log.eventLog.Log),
          InventoryTrackingNumber: itn.ITN,
        }),
      });
      ITNList.push(itn.ITN);
      linkList.push({ InventoryID: itn.InventoryID, SuspectReason: 1 });
    });
    return this._noFound
      .mutate({
        ITNList,
        linkList,
      })
      .pipe(switchMap(() => this._insertLog.mutate({ oldLogs, eventLogs })));
  }

  /**
   * ItnInUserContainer
   */
  public ItnInUserContainer$() {
    return this._ItnInUser
      .fetch(
        { ContainerID: this._userC.userContainerID },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => res.data.findContainer.INVENTORies),
        tap((res) => {
          if (!res.length) {
            throw new Error('Not ITN  Under User');
          }
        })
      );
  }

  public verifyITN$(ITN: string) {
    return this._itn.verifyITN$(ITN).pipe(
      switchMap((res) => {
        const oldLogs = {
          UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
          UserEventID: sqlData.Event_Stocking_SortingStart,
          InventoryTrackingNumber: ITN,
          PartNumber: this._itn.itnInfo.PartNumber,
          ProductCode: this._itn.itnInfo.ProductCode,
          Quantity: this._itn.itnInfo.QuantityOnHand,
          Message: ``,
        };
        this._log.initEventLog({
          UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
          EventTypeID: sqlData.Event_Stocking_SortingStart,
          Log: JSON.stringify({
            InventoryTrackingNumber: ITN,
            PartNumber: this._itn.itnInfo.PartNumber,
            ProductCode: this._itn.itnInfo.ProductCode,
            QuantityOnHand: this._itn.itnInfo.QuantityOnHand,
            Velocity: this._itn.itnInfo.Velocity,
          }),
        });
        return this._insertLog.mutate({
          oldLogs,
          eventLogs: this._log.eventLog,
        });
      })
    );
  }

  public putAway$(Barcode: string) {
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
        }),
        switchMap((res) => {
          return this._updateInventory.mutate({
            User: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            BinLocation: Barcode,
            ITN: this._itn.itnInfo.ITN,
          });
        }),
        switchMap(() => {
          const oldLogs = {
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            UserEventID: sqlData.Event_Stocking_StockingRelocation_Location,
            ProductCode: this._itn.itnInfo.ProductCode,
            PartNumber: this._itn.itnInfo.PartNumber,
            Quantity: this._itn.itnInfo.QuantityOnHand,
            InventoryTrackingNumber: this._itn.itnInfo.ITN,
            Message: Barcode,
          };
          const eventLogs = {
            ...this._log.eventLog,
            EventTypeID: sqlData.Event_Stocking_StockingRelocation_Location,
            Log: JSON.stringify({
              ...JSON.parse(this._log.eventLog.Log),
              Target: Barcode,
            }),
          };
          return this._insertLog.mutate({ oldLogs, eventLogs });
        })
      );
  }
}
