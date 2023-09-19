import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
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
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { SESSION_STORAGE } from 'src/app/shared/utils/storage';

@Injectable()
export class StockingService {
  private _destroyRef = inject(DestroyRef);
  private _sessionStorage = inject(SESSION_STORAGE);

  constructor(
    private _userC: UserContainerService,
    private _move: MoveInventoryToContainerForStockingGQL,
    private _verifyBarcode: FetchItnInfoByContainerforStockingGQL,
    private _noFound: UpdateNotFoundForStockingGQL,
    private _insertLog: Create_EventLogsGQL,
    private _ItnInUser: FetchInventoryInUserContainerGQL,
    private _verifyContainer: VerifyContainerForSortingGQL,
    private _updateInventory: UpdateInventoryAfterSortingGQL,
    private _itn: ItnInfoService,
    private _userInfo: StorageUserInfoService,
    private _log: EventLogService
  ) {
    effect(() => {
      this._sessionStorage.setItem(
        'stockingItnList',
        JSON.stringify(this.ITNList())
      );
      this._sessionStorage.setItem(
        'stockingVerifiedItns',
        JSON.stringify(this.verifiedItns())
      );
    });
  }

  // State
  private _state = signal({
    ITNList: JSON.parse(this._sessionStorage.getItem('stockingItnList')),
    verifiedItns: JSON.parse(
      this._sessionStorage.getItem('stockingVerifiedItns')
    ),
  });

  // Selectors
  ITNList = computed(() => this._state().ITNList);
  verifiedItns = computed(() => this._state().verifiedItns);

  //reducers
  /**
   * verifiedItns should be a set of itn object. not dupicate elements.
   */
  public addVerifiedItns(itn: ItnInfo) {
    const tmp = this.verifiedItns();
    if (!tmp.length) {
      this._state.mutate((state) => (state.verifiedItns = [itn]));
      return;
    }
    tmp.push(itn);
    this._state.mutate((state) => (state.verifiedItns = [...new Set(tmp)]));
  }

  /**
   * ScanITNasTarget In the scantarget page, if user scan a ITN, push this ITN to the ITNList.
   */
  public ScanITNasTarget(ITN: string) {
    this._state.set({
      ITNList: [ITN],
      verifiedItns: null,
    });
  }

  /**
   * moveItnToUser: move this ITN to user container.
   */
  public moveItnToUser(ITN: string): Observable<any> {
    if (!this._userC.userContainerID) {
      throw new Error('Container not found');
    }
    return this._move
      .mutate({
        ITN: ITN,
        User: this._userInfo.userName,
        BinLocation: this._userInfo.userName,
      })
      .pipe(
        switchMap(() => {
          // init evetlog
          this._log.initEventLog({
            UserName: this._userInfo.userName,
            EventTypeID: sqlData.Event_Stocking_Stocking_MoveITNToUser,
            Log: JSON.stringify({
              InventoryTrackingNumber: ITN,
              PartNumber: this._itn.itnInfo().PartNumber,
              ProductCode: this._itn.itnInfo().ProductCode,
              QuantityOnHand: this._itn.itnInfo().QuantityOnHand,
              Velocity: this._itn.itnInfo().Velocity,
            }),
          });
          const oldLogs = {
            UserName: this._userInfo.userName,
            UserEventID: sqlData.Event_Stocking_Stocking_MoveITNToUser,
            InventoryTrackingNumber: this._itn.itnInfo().ITN,
            PartNumber: this._itn.itnInfo().PartNumber,
            ProductCode: this._itn.itnInfo().ProductCode,
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
   * Verify the location Barcode, then find all itns in this location, then remove suspect and notFound.
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
              Autostore: item.Product.Autostore,
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
          this.updateItnList(ITNList);
          // insert log
          const oldLogs = {
            UserName: this._userInfo.userName,
            UserEventID: sqlData.Event_Stocking_ScanLocation,
            Message: Barcode,
          };
          this._log.initEventLog({
            UserName: this._userInfo.userName,
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
        UserName: this._userInfo.userName,
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
      linkList.push({ InventoryID: itn.InventoryID, SuspectReasonID: 1 });
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
    return this._userC.userContainerID$.pipe(
      switchMap((id) => {
        return this._ItnInUser.fetch({ ContainerID: id });
      }),
      map((res) => res.data.findContainer.INVENTORies)
    );
  }

  public verifyITN$(ITN: string) {
    return this._itn.verifyITN$(ITN).pipe(
      switchMap((res) => {
        const oldLogs = {
          UserName: this._userInfo.userName,
          UserEventID: sqlData.Event_Stocking_ScanITN,
          InventoryTrackingNumber: ITN,
          PartNumber: this._itn.itnInfo.PartNumber,
          ProductCode: this._itn.itnInfo.ProductCode,
          Quantity: this._itn.itnInfo.QuantityOnHand,
          Message: ``,
        };
        this._log.initEventLog({
          UserName: this._userInfo.userName,
          EventTypeID: sqlData.Event_Stocking_ScanITN,
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
            User: this._userInfo.userName,
            BinLocation: Barcode,
            ITN: this._itn.itnInfo.ITN,
          });
        }),
        switchMap(() => {
          const oldLogs = {
            UserName: this._userInfo.userName,
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

  public reset(): void {
    this._state.set({
      ITNList: null,
      verifiedItns: null,
      loaded: false,
      error: null,
    });
  }
}
