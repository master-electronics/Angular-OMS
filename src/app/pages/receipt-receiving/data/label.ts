import { Injectable, computed, inject, signal } from '@angular/core';
import { combineLatest, delay, map, Observable, switchMap, tap } from 'rxjs';
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
import { ReceiptInfoService } from './ReceiptInfo';
import { updateReceiptInfoService } from './updateReceipt';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { ItnCountService } from './itnCount';

export interface ITNinfo {
  quantity: number;
  ITN: string;
  BinLocation: string;
  ContainerID: number;
  datecode: string;
  countryID: number;
  ISO3: string;
}

export interface AssignLabelInfo {
  datecode: string;
  countryID: number;
  ISO3: string;
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
    private _eventLog: EventLogService,
    private _userInfo: StorageUserInfoService
  ) {}
  itnCount = inject(ItnCountService);

  /**
   * Store all Itn info in to a list
   */
  private _ITNList = signal<ITNinfo[]>([]);
  get ITNList(): ITNinfo[] {
    return this._ITNList();
  }

  // initiate the list base on user input itn count.
  initItnList() {
    const quantityList = this.itnCount.getQuantityList();
    const list: ITNinfo[] = quantityList.map((qty) => ({
      quantity: qty,
      ITN: null,
      BinLocation: null,
      ContainerID: null,
      datecode: this._partInfo.receiptInfo.DateCode,
      countryID: this._partInfo.receiptInfo.CountryID,
      ISO3: this._partInfo.receiptInfo.ISO3,
    }));
    this._ITNList.set(list);
  }

  insertNewItn() {
    this._ITNList.mutate((list) => {
      list.push({
        quantity: 0,
        ITN: null,
        BinLocation: null,
        ContainerID: null,
        datecode: this._partInfo.receiptInfo.DateCode,
        countryID: this._partInfo.receiptInfo.CountryID,
        ISO3: this._partInfo.receiptInfo.ISO3,
      });
    });
  }

  removeItn(index: number) {
    this._ITNList.mutate((list) => {
      list.splice(index, 1);
    });
  }

  updateItnListQty(Qty: number, index: number) {
    this._ITNList.mutate((list) => {
      list[index].quantity = Qty;
    });
  }

  updateItnlistInfo(info: AssignLabelInfo, index: number) {
    this._ITNList.mutate((list) => {
      list[index] = {
        ...list[index],
        datecode: info.datecode,
        ISO3: info.ISO3,
        countryID: info.countryID,
      };
    });
  }

  updateItnListITN(ITN: string, index: number) {
    this._ITNList.mutate((list) => {
      list[index].ITN = ITN;
    });
  }

  updateItnListBin(BinLocation: string, ContainerID: number, index: number) {
    this._ITNList.mutate((list) => {
      list[index].BinLocation = BinLocation;
      list[index].ContainerID = ContainerID;
    });
  }

  /**
   * Selecter
   */

  //
  remaining = computed(() => {
    let sum = 0;
    this._ITNList().map((item) => (sum += item.quantity));
    return this._receipt.ExpectQuantity() - sum;
  });

  // track current used ITN info for ITN scan and add location
  currentItnIndex = computed(() => {
    let i = -1;
    this._ITNList().map((itn, index) => {
      if (itn.ITN) {
        i = index;
        return true;
      }
      return false;
    });
    return i;
  });

  getItnInList(index: number) {
    return computed(() => this._ITNList()[index].ITN);
  }

  /**
   * printReceivingLabel And insert itn info to ITNList
   */
  public printReceivingLabel$() {
    return this._itn
      .mutate(
        { LocationCode: environment.DistributionCenter },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          // save ITN to next space.
          this.updateItnListITN(res.data.createITN, this.currentItnIndex() + 1);
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
              this._receipt.productCode(),
              this._receipt.partNumber()
            ),
            log: this._insertLog.mutate({
              oldLogs: {
                UserName: this._userInfo.userName,
                UserEventID: sqlData.Event_Receiving_GenerateITN,
                InventoryTrackingNumber: res.data.createITN,
                PartNumber: this._receipt.partNumber(),
                ProductCode: this._receipt.productCode(),
                ReceiptHeader: this._receipt.headerID(),
                ReceiptLine: this._receipt.receiptLine(),
                PurchaseOrderNumber: this._receipt.purchaseOrderNumber(),
                PurchaseLine: this._receipt.purchaseLineNumber(),
              },
              eventLogs: {
                ...this._eventLog.eventLog,
                EventTypeID: sqlData.Event_Receiving_GenerateITN,
                Log: JSON.stringify({
                  InventoryTrackingNumber: res.data.createITN,
                  ...this._receipt.receiptInfoAfterFilter()[0],
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
          this.updateItnListBin(
            res.data.findContainer.Barcode,
            res.data.findContainer._id,
            this.currentItnIndex()
          );
          return this._ITNList();
        })
      );
  }

  /**
   * updateAfterReceving
   */
  public updateAfterReceving(): Observable<any> {
    const line = this._receipt.receiptInfoAfterFilter()[0];
    const Inventory = {
      DistributionCenter: environment.DistributionCenter,
      ProductID: line.ProductID,
      ROHS: this._partInfo.receiptInfo.ROHS,
    };
    const info = {
      PartNumber: line.PartNumber,
      ProductCode: line.ProductCodeNumber,
      User: this._userInfo.userName,
      CreatingProgram: 'OMS-Receiving',
      PurchaseOrderNumber: line.PurchaseOrderNumber,
      PurchaseOrderLine: line.PurchaseLineNumber.toString(),
    };
    const ReceiptLID = line.ReceiptLineID;
    //
    const itnInfo: ITNinfo[] = this._ITNList().map((node) => {
      return {
        quantity: node.quantity,
        ITN: node.ITN,
        BinLocation: node.BinLocation,
        ContainerID: node.ContainerID,
        datecode: node.datecode,
        countryID: node.countryID,
        ISO3: node.ISO3,
      };
    });

    // generate request
    const update = this._update.mutate({
      ITNList: itnInfo,
      ReceiptLID,
      Inventory,
      info,
    });
    // collect info for log
    const oldLogs: any = itnInfo.map((itn) => {
      return {
        UserName: this._userInfo.userName,
        UserEventID: sqlData.Event_Receiving_UpdateInventory,
        InventoryTrackingNumber: itn.ITN,
        Quantity: itn.quantity,
        PartNumber: this._receipt.partNumber(),
        ProductCode: this._receipt.productCode(),
        ReceiptHeader: this._receipt.headerID(),
        ReceiptLine: this._receipt.receiptLine(),
        PurchaseOrderNumber: this._receipt.purchaseOrderNumber(),
        PurchaseLine: this._receipt.purchaseLineNumber(),
        Message: itn.BinLocation,
      };
    });
    oldLogs.push({
      UserName: this._userInfo.userName,
      UserEventID: sqlData.Event_Receiving_ReceiptLineDone,
      PartNumber: this._receipt.partNumber(),
      ProductCode: this._receipt.productCode(),
      ReceiptHeader: this._receipt.headerID(),
      ReceiptLine: this._receipt.receiptLine(),
      PurchaseOrderNumber: this._receipt.purchaseOrderNumber(),
      PurchaseLine: this._receipt.purchaseLineNumber(),
    });
    const eventLogs = itnInfo.map((itn) => {
      return {
        ...this._eventLog.eventLog,
        EventTypeID: sqlData.Event_Receiving_UpdateInventory,
        Log: JSON.stringify({
          ...this._receipt.receiptInfoAfterFilter()[0],
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

  verifyItnListBinLocation() {
    const emptyIndex = [];
    const validIndex = [];
    this._ITNList().map((itn, index) => {
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
      const tmpBin = this._ITNList()[validIndex[0]].BinLocation;
      const tmpContainerID = this._ITNList()[validIndex[0]].ContainerID;
      emptyIndex.map((i) => {
        this.updateItnListBin(tmpBin, tmpContainerID, i);
      });
    }
  }

  reset() {
    this._ITNList.set([]);
  }
}
