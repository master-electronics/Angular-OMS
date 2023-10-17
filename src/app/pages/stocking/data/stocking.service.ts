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
      this._sessionStorage.setItem(
        'stockingCheckedItns',
        JSON.stringify(this.checkedItns())
      );
    });
  }

  // State
  private _state = signal({
    ITNList: JSON.parse(this._sessionStorage.getItem('stockingItnList')),
    verifiedItns: JSON.parse(
      this._sessionStorage.getItem('stockingVerifiedItns')
    ),
    checkedItns: JSON.parse(
      this._sessionStorage.getItem('stockingCheckedItns')
    ),
  });

  // Selectors
  ITNList = computed(() => this._state().ITNList);
  verifiedItns = computed(() => this._state().verifiedItns);
  checkedItns = computed(() => this._state().checkedItns);
  checkedItnsLength = computed(() => {
    return this._state().checkedItns ? this._state().checkedItns.length : 0;
  });

  //reducers
  /**
   * ScanITNasTarget In the scantarget page, if user scan a ITN, push this ITN to the ITNList.
   */
  public ScanItnAsTarget(ITN: ItnInfo) {
    this._state.set({
      ITNList: [ITN],
      verifiedItns: [ITN],
      checkedItns: null,
    });
  }

  /**
   * resetVerifiedAndChecked
   */
  public resetVerifiedAndChecked() {
    this._state.set({
      ITNList: JSON.parse(this._sessionStorage.getItem('stockingItnList')),
      verifiedItns: null,
      checkedItns: null,
    });
  }

  /**
   * moveItnToUser: If user scan ITN, move this ITN to user container.
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
   * If user scan a location, verify the location Barcode, then find all itns in this location
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
        // Update State based on return ITN list.
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
          // update the ITNList in state.
          this._state.update((state) => ({
            ...state,
            ITNList,
          }));
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
   * countMatch If count ITN match, move all stockingITnList to stocking verifiedItns.
   */
  public countMatch() {
    this._state.update((state) => ({
      ...state,
      verifiedItns: state.ITNList,
    }));
  }

  /**
   * verifiedItns should be a set of itn object. not dupicate elements.
   */
  public addVerifiedItns(itn: ItnInfo) {
    if (!this.verifiedItns()?.length) {
      this._state.update((state) => ({
        ...state,
        verifiedItns: [itn],
      }));
      return;
    }
    if (this.verifiedItns().some((info) => info.ITN === itn.ITN)) {
      return;
    }
    this._state.update((state) => ({
      ...state,
      verifiedItns: [...this.verifiedItns(), itn],
    }));
  }

  /**
   * checkedItns should be a set of itn object. not dupicate elements.
   */
  public addCheckedItns(itn: ItnInfo) {
    if (!this.checkedItns()?.length) {
      this._state.update((state) => ({
        ...state,
        checkedItns: [itn],
      }));
      return;
    }
    if (this.checkedItns().some((info) => info.ITN === itn.ITN)) {
      return;
    }
    this._state.update((state) => ({
      ...state,
      checkedItns: [...this.checkedItns(), itn],
    }));
  }

  /**
   * notFound
   */
  public addNotFoundFlag$(list: ItnInfo[]) {
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
      linkList.push({
        InventoryID: itn.InventoryID,
        SuspectReasonID: sqlData.SuspectReason_Location,
      });
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
      switchMap(() => {
        const oldLogs = {
          UserName: this._userInfo.userName,
          UserEventID: sqlData.Event_Stocking_ScanITN,
          InventoryTrackingNumber: ITN,
          PartNumber: this._itn.itnInfo().PartNumber,
          ProductCode: this._itn.itnInfo().ProductCode,
          Quantity: this._itn.itnInfo().QuantityOnHand,
          Message: ``,
        };
        this._log.initEventLog({
          UserName: this._userInfo.userName,
          EventTypeID: sqlData.Event_Stocking_ScanITN,
          Log: JSON.stringify({
            InventoryTrackingNumber: ITN,
            PartNumber: this._itn.itnInfo().PartNumber,
            ProductCode: this._itn.itnInfo().ProductCode,
            QuantityOnHand: this._itn.itnInfo().QuantityOnHand,
            Velocity: this._itn.itnInfo().Velocity,
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
   *
   * @param Barcode destination barcode
   * @returns
   */
  public putAway$() {
    return this._updateInventory
      .mutate({
        User: this._userInfo.userName,
        BinLocation: this._itn.itnInfo().BinLocation,
        ITN: this._itn.itnInfo().ITN,
      })
      .pipe(
        tap(() => {
          this.addCheckedItns(this._itn.itnInfo());
        }),
        switchMap(() => {
          const oldLogs = {
            UserName: this._userInfo.userName,
            UserEventID: sqlData.Event_Stocking_StockingRelocation_Location,
            ProductCode: this._itn.itnInfo().ProductCode,
            PartNumber: this._itn.itnInfo().PartNumber,
            Quantity: this._itn.itnInfo().QuantityOnHand,
            InventoryTrackingNumber: this._itn.itnInfo().ITN,
            Message: this._itn.itnInfo().BinLocation,
          };
          const eventLogs = {
            ...this._log.eventLog,
            EventTypeID: sqlData.Event_Stocking_StockingRelocation_Location,
            Log: JSON.stringify({
              ...JSON.parse(this._log.eventLog.Log),
              Target: this._itn.itnInfo().BinLocation,
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
      checkedItns: null,
    });
  }
}
