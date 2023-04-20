import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';
import { ItnSplitAndPrintLabelsGQL } from 'src/app/graphql/itnSeparate.graphql-gen';
import { VerifyItnForSeparateGQL } from 'src/app/graphql/itnSeparate.graphql-gen';
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
    private readonly _itn: VerifyItnForSeparateGQL,
    private readonly _separate: ItnSplitAndPrintLabelsGQL,
    private readonly _printer: PrinterService,
    private _insertLog: Create_EventLogsGQL,
    private _eventLog: EventLogService
  ) {
    //
  }

  /**
   * Fetch source ITN's info
   */
  private _itnInfo = new BehaviorSubject<ItnInfo>(null);
  public get itnInfo() {
    return this._itnInfo.value;
  }
  public changeitnInfo(itn: ItnInfo): void {
    this._itnInfo.next(itn);
  }

  /**
   * Store new ITN's quantity
   */
  private _quantityList = new BehaviorSubject<number[]>(null);
  public get quantityList() {
    return this._quantityList.value;
  }
  public changeQuantityList(list: number[]): void {
    this._quantityList.next(list);
  }

  /**
   * Store new ITNs back from API
   */
  private _newItnList = new BehaviorSubject<ItnInfo[]>(null);
  public get newItnList() {
    return this._newItnList.value;
  }
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
        if (
          res.data.findInventory.ORDERLINEDETAILs.length &&
          res.data.findInventory.ORDERLINEDETAILs[0].StatusID !==
            sqlData.pickComplete_ID
        ) {
          throw new Error("Can't split this ITN!");
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

  public separateITN$() {
    return this._printer.printer$.pipe(
      switchMap((res) => {
        return this._separate.mutate({
          ITN: this.itnInfo.ITN,
          QuantityList: this.quantityList,
          PRINTER: res.Name,
          DPI: res.DPI.toString(),
          ORIENTATION: res.Orientation,
          PARTNUMBER: this.itnInfo.PartNumber,
          PRODUCTCODE: this.itnInfo.ProductCode,
          User: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        });
      }),
      map((res) => {
        const itnList = res.data.ITNSplitAndPrintLabels.map((itn, index) => {
          return {
            ITN: itn,
            Quantity: this.quantityList[index],
            PartNumber: this.itnInfo.PartNumber,
            ProductCode: this.itnInfo.ProductCode,
          };
        });
        this._newItnList.next(itnList);
        return true;
      })
      // switchMap(() => {
      //   return this._insertLog.mutate({
      //     oldLogs,
      //     eventLogs: this._eventLog.eventLog,
      //   });
      // })
    );
  }
}
