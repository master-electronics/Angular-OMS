import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, switchMap, tap } from 'rxjs';
import {
  CheckBinLocationGQL,
  PrintReceivingLabelGQL,
  UpdateAfterReceivingGQL,
} from 'src/app/graphql/receiptReceiving.graphql-gen';
import { CreateItnGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { environment } from 'src/environments/environment';
import { ReceiptInfoService } from './ReceiptInfo';
import { updateReceiptInfoService } from './updateReceipt';

export interface ITNinfo {
  ITN: string;
  quantity: number;
  BinLocation: string;
  ContainerID: number;
}

@Injectable()
export class LabelService {
  constructor(
    private _receipt: ReceiptInfoService,
    private _partInfo: updateReceiptInfoService,
    private _print: PrintReceivingLabelGQL,
    private _container: CheckBinLocationGQL,
    private _itn: CreateItnGQL,
    private _update: UpdateAfterReceivingGQL
  ) {}

  private _scanAll = new BehaviorSubject<boolean>(false);
  /**
   * get scanAll
   */
  public get scanAll() {
    return this._scanAll.value;
  }
  /**
   * changeScanALl
   */
  public changeScanALl(boolean: boolean) {
    this._scanAll.next(boolean);
  }
  /**
   * save quantitylist after assign label
   */
  private _quantityList = new BehaviorSubject<number[]>(null);
  public get quantityList(): number[] {
    return this._quantityList.value;
  }
  public initQuantityList(list: number[]) {
    this._quantityList.next(list);
  }
  /**
   * label and quantity assign list
   */
  private _ITNList = new BehaviorSubject<ITNinfo[]>(null);
  /**
   * get ITNList$
   */
  public get ITNList$() {
    return this._ITNList.asObservable();
  }
  /**
   * get value
   */
  public get ITNList(): ITNinfo[] {
    return this._ITNList.value;
  }
  /**
   * insertITNList
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
   * updateLastITN
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
   * resetITNList
   */
  public resetITNList() {
    this._ITNList.next(null);
  }

  /**
   * printReceivingLabel And insert itn to list
   */
  public printReceivingLabel$(
    quantity: number,
    PRINTER: string,
    DPI: string,
    ORIENTATION: string
  ) {
    return this._itn
      .fetch(
        { LocationCode: environment.DistributionCenter },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          this.insertITNList({
            quantity,
            ITN: res.data.createITN,
            BinLocation: '',
            ContainerID: 0,
          });
          console.log(res.data.createITN);
        }),
        switchMap((res) => {
          return this._print.fetch(
            {
              PRINTER,
              ITN: res.data.createITN,
              DPI,
              ORIENTATION,
            },
            { fetchPolicy: 'network-only' }
          );
        })
      );
  }

  /**
   * checkBinLocation and update info to last itn.
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
          return null;
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
      DateCode: this._partInfo.receiptInfo.DateCode,
      ROHS: this._partInfo.receiptInfo.ROHS,
      CountryID: this._partInfo.receiptInfo.CountryID,
    };
    const info = {
      PartNumber: line.Product?.PartNumber || 'null',
      ProductCode: line.Product?.ProductCode.ProductCodeNumber || 'null',
      CountryOfOrigin: this._partInfo.receiptInfo.ISO3 || 'null',
      User: JSON.parse(userinfo)?.username,
      CreatingProgram: 'OMS-Receiving',
      PurchaseOrderNumber:
        line.RECEIPTLDs[0]?.PurchaseOrderL?.PurchaseOrderH
          ?.PurchaseOrderNumber || 'null',
      PurchaseOrderLine:
        line.RECEIPTLDs[0].PurchaseOrderL?.LineNumber.toString() || 'null',
    };
    const ReceiptLID = line._id;
    return this._update.mutate({
      ITNList: this._ITNList.value,
      ReceiptLID,
      Inventory,
      info,
    });
  }

  public initValue() {
    this._ITNList.next(null);
    this._quantityList.next(null);
  }
}
