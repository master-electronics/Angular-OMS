import { Injectable } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import {
  UpdateInventoryAfterSortingGQL,
  VerifyContainerForSortingGQL,
  VerifyItnForSortingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { ItnInfoService } from './itn-info.service';

@Injectable()
export class SortingService {
  constructor(
    private _verifyITN: VerifyItnForSortingGQL,
    private _insertLog: Create_EventLogsGQL,
    private _verifyContainer: VerifyContainerForSortingGQL,
    private _updateInventory: UpdateInventoryAfterSortingGQL,
    private _itn: ItnInfoService,
    private _eventLog: EventLogService
  ) {}
  //
  /**
   * @param ITN User input ITN
   * @returns observable of http request.
   */
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
        this._eventLog.initEventLog({
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
          eventLogs: this._eventLog.eventLog,
        });
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
            User: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            ITN: this._itn.itnInfo.ITN,
            BinLocation: Barcode,
          });
        }),
        switchMap(() => {
          const oldLogs = {
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            UserEventID: sqlData.Event_Stocking_SortingDone,
            ProductCode: this._itn.itnInfo.ProductCode,
            PartNumber: this._itn.itnInfo.PartNumber,
            Quantity: this._itn.itnInfo.QuantityOnHand,
            InventoryTrackingNumber: this._itn.itnInfo.ITN,
            Message: Barcode,
          };
          const eventLogs = {
            ...this._eventLog.eventLog,
            EventTypeID: sqlData.Event_Stocking_SortingDone,
            Log: JSON.stringify({
              ...JSON.parse(this._eventLog.eventLog.Log),
              Location: Barcode,
            }),
          };
          return this._insertLog.mutate({ oldLogs, eventLogs });
        })
      );
  }
}
