import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import {
  SeparateItnGQL,
  VerifyItnForSeperateGQL,
} from 'src/app/graphql/itnSeperate.graphql-gen';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { PrinterService } from 'src/app/shared/data/printer';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';

interface ItnInfo {
  ITN: string;
  Quantity: number;
  PartNumber: string;
  ProductCode: string;
}

@Injectable()
export class ItnSeparateService {
  constructor(
    private readonly _itn: VerifyItnForSeperateGQL,
    private readonly _separate: SeparateItnGQL,
    private readonly _printer: PrinterService,
    private _insertLog: Create_EventLogsGQL,
    private _eventLog: EventLogService
  ) {
    //
  }

  private _itnInfo = new BehaviorSubject<ItnInfo>(null);
  public get itnInfo() {
    return this._itnInfo.value;
  }
  /**
   *
   * @param date Update itnInfo
   */
  public changeitnInfo(date: ItnInfo): void {
    this._itnInfo.next(date);
  }

  private _newItnList = new BehaviorSubject<ItnInfo[]>(null);
  public get newItnList() {
    return this._newItnList.value;
  }
  /**
   *
   * @param date Update itnInfo
   */
  public changeItnList(list: ItnInfo[]): void {
    this._newItnList.next(list);
  }

  /**
   * resetItnInfo
   */
  public resetitnInfo(): void {
    this._itnInfo.next(null);
    this._newItnList.next(null);
    this._eventLog.initEventLog(null);
  }

  public verifyItn(ITN: string) {
    return this._itn.fetch({ ITN, DC: environment.DistributionCenter }).pipe(
      tap((res) => {
        if (!res.data.findInventory?._id) {
          throw new Error("Can't find this ITN!");
        }
        if (!res.data.findInventory?.QuantityOnHand) {
          throw new Error("Can't find the Quantity of ITN!");
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
        this.changeitnInfo({
          Quantity: res.data.findInventory.QuantityOnHand,
          ITN,
          PartNumber: res.data.findInventory.Product.PartNumber,
          ProductCode:
            res.data.findInventory.Product.ProductCode.ProductCodeNumber,
        });
        return this._insertLog.mutate({
          oldLogs,
          eventLogs: this._eventLog.eventLog,
        });
      })
    );
  }

  public separateITN(QuantityList: number[]) {
    console.log(QuantityList);

    // return this._printer.printer$.pipe(
    //   switchMap((res) => {
    //     return this._separate.mutate({
    //       ITN: this.itnInfo.ITN,
    //       QuantityList,
    //       Printer: res.Name,
    //       UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
    //     });
    //   }),
    //   switchMap(() => {
    //     return this._insertLog.mutate({
    //       oldLogs,
    //       eventLogs: this._eventLog.eventLog,
    //     });
    //   })
    // );
  }
}
