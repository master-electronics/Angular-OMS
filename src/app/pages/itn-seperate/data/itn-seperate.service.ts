import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { VerifyItnForSeperateGQL } from 'src/app/graphql/itnSeperate.graphql-gen';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';

@Injectable()
export class ItnSeperateService {
  constructor(
    private readonly _itn: VerifyItnForSeperateGQL,
    private _insertLog: Create_EventLogsGQL,
    private _eventLog: EventLogService
  ) {
    //
  }

  private _itnQuantity = new BehaviorSubject<number>(null);
  public get itnQuantity() {
    return this._itnQuantity.value;
  }
  /**
   *
   * @param date Update itnInfo
   */
  public changeItnQuantity(date: number): void {
    this._itnQuantity.next(date);
  }

  /**
   * resetItnInfo
   */
  public resetItnQuantity(): void {
    this._itnQuantity.next(null);
  }

  public verifyItn(ITN: string) {
    return this._itn.fetch({ ITN, DC: environment.DistributionCenter }).pipe(
      tap((res) => {
        if (!res.data.findInventory?._id) {
          throw new Error("Can't find this ITN!");
        }
      }),
      switchMap((res) => {
        const oldLogs = {
          UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
          UserEventID: sqlData.Event_Stocking_SortingStart,
          InventoryTrackingNumber: ITN,
          Quantity: res.data.findInventory.QuantityOnHand,
        };
        this._eventLog.initEventLog({
          UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
          EventTypeID: sqlData.Event_Stocking_SortingStart,
          Log: JSON.stringify({
            InventoryTrackingNumber: ITN,
            QuantityOnHand: res.data.findInventory.QuantityOnHand,
          }),
        });
        return this._insertLog.mutate({
          oldLogs,
          eventLogs: this._eventLog.eventLog,
        });
      })
    );
  }
}
