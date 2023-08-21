import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import {
  CheckBinLocationGQL,
  UpdateAfterReceivingGQL,
} from 'src/app/graphql/receiptReceiving.graphql-gen';
import {
  CreateItnGQL,
  Create_EventLogsGQL,
} from 'src/app/graphql/utilityTools.graphql-gen';
import { EventLogService } from 'src/app/shared/data/eventLog';
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
  BinLocation: string;
  ContainerID: number;
  datecode: string;
  countryID: number;
  ISO3: string;
}

export interface AssignLabelInfo {
  datecode: string;
  country: {
    countryID: number;
    ISO3: string;
  };
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
    private _insertLog: Create_EventLogsGQL,
    private _log: LogService,
    private _eventLog: EventLogService
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
   * save itn info list after assign label
   */
  private _assignLabelInfo = new BehaviorSubject<AssignLabelInfo[]>(null);
  public get assignLabelInfo(): AssignLabelInfo[] {
    return this._assignLabelInfo.value;
  }
  public changeassignLabelInfo(list: AssignLabelInfo[]) {
    this._assignLabelInfo.next(list);
  }

  /**
   * insert itninfo after each itn number is created
   */
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
      .mutate(
        { LocationCode: environment.DistributionCenter },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (
            !this.assignLabelInfo[this.ITNList?.length || 0].country.countryID
          ) {
            throw new Error('Invaild country!');
          }
          this.insertITNList({
            quantity: this.quantityList[this.ITNList?.length || 0],
            datecode:
              this.assignLabelInfo[this.ITNList?.length || 0].datecode || '',
            countryID:
              this.assignLabelInfo[this.ITNList?.length || 0].country.countryID,
            ISO3: this.assignLabelInfo[this.ITNList?.length || 0].country.ISO3,
            ITN: res.data.createITN,
            BinLocation: null,
            ContainerID: null,
          });
          Logger.devOnly(
            'LabelService',
            'printReceivingLabel',
            res.data.createITN
          );
        }),
        switchMap((res) => {
          return combineLatest({
            print: this._printer.printITN$(
              res.data.createITN,
              this._receipt.receiptLsAfterQuantity[0].Product.ProductCode
                .ProductCodeNumber,
              this._receipt.receiptLsAfterQuantity[0].Product.PartNumber
            ),
            log: this._insertLog.mutate({
              oldLogs: {
                ...this._log.receivingLog,
                InventoryTrackingNumber: res.data.createITN,
                Quantity: null,
                UserEventID: sqlData.Event_Receiving_GenerateITN,
              },
              eventLogs: {
                ...this._eventLog.eventLog,
                EventTypeID: sqlData.Event_Receiving_GenerateITN,
                Log: JSON.stringify({
                  ...JSON.parse(this._eventLog.eventLog.Log),
                  InventoryTrackingNumber: res.data.createITN,
                }),
              },
            }),
          });
        }),
        delay(500)
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
          if (!Barcode.trim()) {
            throw new Error("Can't be empty location.");
          }
          if (
            !res.data.findContainer?._id ||
            !res.data.findContainer?.Barcode
          ) {
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
          return this._ITNList.value;
        }),
        tap((res) => {
          if (!res[res.length - 1].BinLocation) {
            throw new Error('BinLocation invalid!');
          }
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
    };
    const info = {
      PartNumber: line.Product?.PartNumber || 'null',
      ProductCode: line.Product?.ProductCode.ProductCodeNumber || 'null',
      User: JSON.parse(userinfo)?.username,
      CreatingProgram: 'OMS-Receiving',
      PurchaseOrderNumber:
        line.RECEIPTLDs[0]?.PurchaseOrderL?.PurchaseOrderH
          ?.PurchaseOrderNumber || 'null',
      PurchaseOrderLine:
        line.RECEIPTLDs[0].PurchaseOrderL?.LineNumber.toString() || 'null',
    };
    const ReceiptLID = line._id;
    // check if any binlocation is empty.
    const itnInfo = this.ITNList;
    const emptyIndex = [];
    const validIndex = [];
    this._ITNList.value.map((itn, index) => {
      if (!itn.BinLocation || !itn.ContainerID) {
        emptyIndex.push(index);
      } else {
        validIndex.push(index);
      }
    });
    if (!validIndex.length) {
      throw new Error('Invalid ITN information!');
    }
    if (emptyIndex.length) {
      const tmpBin = this.ITNList[validIndex[0]].BinLocation;
      const tmpContainerID = this.ITNList[validIndex[0]].ContainerID;
      emptyIndex.map((i) => {
        itnInfo[i].BinLocation = tmpBin;
        itnInfo[i].ContainerID = tmpContainerID;
      });
      this._ITNList.next(itnInfo);
    }
    // generate request
    const update = this._update.mutate({
      ITNList: itnInfo,
      ReceiptLID,
      Inventory,
      info,
    });
    // collect info for log
    const oldLogs: any = this._ITNList.value.map((itn) => {
      return {
        ...this._log.receivingLog,
        UserEventID: sqlData.Event_Receiving_UpdateInventory,
        InventoryTrackingNumber: itn.ITN,
        Quantity: itn.quantity,
        Message: itn.BinLocation,
      };
    });
    oldLogs.push({
      ...this._log.receivingLog,
      UserEventID: sqlData.Event_Receiving_ReceiptLineDone,
    });
    const eventLogs = this._ITNList.value.map((itn) => {
      return {
        ...this._eventLog.eventLog,
        EventTypeID: sqlData.Event_Receiving_UpdateInventory,
        Log: JSON.stringify({
          ...JSON.parse(this._eventLog.eventLog.Log),
          InventoryTrackingNumber: itn.ITN,
          Quantity: itn.quantity,
          BinLocation: itn.BinLocation,
        }),
      };
    });
    eventLogs.push({
      ...this._eventLog.eventLog,
      EventTypeID: sqlData.Event_Receiving_ReceiptLineDone,
    });
    return update.pipe(
      tap((res) => {
        if (res.data.createInventoryFromOMS !== true) {
          throw new Error("Can't update Invenotry to MERP!");
        }
      }),
      switchMap(() => {
        return this._insertLog.mutate({ oldLogs, eventLogs });
      })
    );
  }
}
