import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import {
  CheckBinLocationGQL,
  UpdateAfterReceivingGQL,
} from 'src/app/graphql/receiptReceiving.graphql-gen';
import {
  CreateItnGQL,
  Insert_UserEventLogsGQL,
} from 'src/app/graphql/utilityTools.graphql-gen';
import { PrinterService } from 'src/app/shared/data/printer';
import { Logger } from 'src/app/shared/services/logger.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { LogService } from './eventLog';
import { ReceiptInfoService } from './ReceiptInfo';
import { updateReceiptInfoService } from './updateReceipt';

export interface ITNinfo {
  ITN: string;
  quantity: number;
  datecode: string;
  BinLocation: string;
  ContainerID: number;
}

@Injectable()
export class LabelService {
  constructor(
    private _receipt: ReceiptInfoService,
    private _partInfo: updateReceiptInfoService,
    private _container: CheckBinLocationGQL,
    private _itn: CreateItnGQL,
    private _update: UpdateAfterReceivingGQL,
    private _printer: PrinterService,
    private _insertLog: Insert_UserEventLogsGQL,
    private _log: LogService
  ) {}

  /**
   * save quantitylist after assign label
   */
  private _quantityList = new BehaviorSubject<number[]>(null);
  public get quantityList(): number[] {
    return this._quantityList.value;
  }
  public changeQuantityList(list: number[]) {
    this._quantityList.next(list);
  }

  /**
   * save datecode list after assign label
   */
  private _datecodeList = new BehaviorSubject<string[]>(null);
  public get datecodeList(): string[] {
    return this._datecodeList.value;
  }
  public changeDatecodeList(list: string[]) {
    this._datecodeList.next(list);
  }

  private _ITNList = new BehaviorSubject<ITNinfo[]>(null);
  public get ITNList$() {
    return this._ITNList.asObservable();
  }
  public get ITNList(): ITNinfo[] {
    return this._ITNList.value;
  }

  public reset(): void {
    this._quantityList.next(null);
    this._ITNList.next(null);
  }

  /**
   * insertITNList push input itn to the list;
   */
  public insertITNList(itn: ITNinfo) {
    let tmp;
    if (this._ITNList.value) {
      tmp = [...this._ITNList.value, itn];
    } else {
      tmp = [itn];
    }
    this._ITNList.next(tmp);
  }
  /**
   * updateLastITN pop the last itn of list, then insert the new ITN;
   */
  public updateLastITN(itn: ITNinfo) {
    let tmp = [...this._ITNList.value];
    if (tmp.length) {
      tmp.pop();
    } else {
      tmp = [];
    }
    tmp.push(itn);
    this._ITNList.next(tmp);
  }

  /**
   * printReceivingLabel And insert itn to list
   */
  public printReceivingLabel$() {
    return this._itn
      .fetch(
        { LocationCode: environment.DistributionCenter },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          this.insertITNList({
            quantity: this.quantityList[this.ITNList?.length | 0],
            datecode: this.datecodeList[this.ITNList?.length | 0],
            ITN: res.data.createITN,
            BinLocation: '',
            ContainerID: 0,
          });
          Logger.devOnly(
            'LabelService',
            'printReceivingLabel',
            res.data.createITN
          );
        }),
        switchMap((res) => {
          return combineLatest({
            print: this._printer.printITN$(res.data.createITN),
            log: this._insertLog.mutate({
              log: {
                ...this._log.receivingLog,
                InventoryTrackingNumber: res.data.createITN,
                Quantity: null,
                UserEventID: sqlData.Event_Receiving_GenerateITN,
              },
            }),
          });
        }),
        delay(5000)
      );
  }

  /**
   * checkBinLocation and update binlocation info to last itn.
   */
  public checkBinLocation(Barcode: string) {
    return this._container
      .fetch({
        Barcode,
        DistributionCenter: environment.DistributionCenter,
      })
      .pipe(
        tap((res) => {
          if (!res.data.findContainer?._id) {
            throw new Error('Can not find this Location!');
          }
        }),
        map((res) => {
          let itn = this.ITNList.slice(-1)[0];
          itn = {
            ...itn,
            BinLocation: res.data.findContainer.Barcode,
            ContainerID: res.data.findContainer._id,
          };
          this.updateLastITN(itn);
          return true;
        })
      );
  }

  /**
   * updateAfterReceving
   */
  public updateAfterReceving(): Observable<any> {
    const line = this._receipt.selectedReceiptLine[0];
    const userinfo = sessionStorage.getItem('userToken');
    const Inventory = {
      DistributionCenter: environment.DistributionCenter,
      ProductID: line.ProductID,
      ROHS: this._partInfo.receiptInfo.ROHS,
      CountryID: this._partInfo.receiptInfo.CountryID,
    };
    const info = {
      PartNumber: line.Product?.PartNumber || 'null',
      ProductCode: line.Product?.ProductCode.ProductCodeNumber || 'null',
      CountryOfOrigin: this._partInfo.receiptInfo.ISO3,
      User: JSON.parse(userinfo)?.username,
      CreatingProgram: 'OMS-Receiving',
      PurchaseOrderNumber:
        line.RECEIPTLDs[0]?.PurchaseOrderL?.PurchaseOrderH
          ?.PurchaseOrderNumber || 'null',
      PurchaseOrderLine:
        line.RECEIPTLDs[0].PurchaseOrderL?.LineNumber.toString() || 'null',
    };
    const ReceiptLID = line._id;
    const update = this._update.mutate({
      ITNList: this._ITNList.value,
      ReceiptLID,
      Inventory,
      info,
    });
    // collect info for log
    const log: any = this._ITNList.value.map((itn) => {
      return {
        ...this._log.receivingLog,
        UserEventID: sqlData.Event_Receiving_UpdateInventory,
        InventoryTrackingNumber: itn.ITN,
        Quantity: itn.quantity,
        Message: itn.BinLocation,
      };
    });
    log.push({
      ...this._log.receivingLog,
      UserEventID: sqlData.Event_Receiving_ReceiptLineDone,
    });
    return update.pipe(
      tap((res) => {
        if (res.data.createInventoryFromOMS !== true) {
          throw new Error("Can't update Invenotry to MERP!");
        }
      }),
      switchMap(() => {
        return this._insertLog.mutate({ log });
      })
    );
  }
}
