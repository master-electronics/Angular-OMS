import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { BehaviorSubject, map, switchMap, take } from 'rxjs';
import { ReceivingUpdateReceiptLGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { CountryListService } from 'src/app/shared/data/countryList';
import { DatecodeService } from 'src/app/shared/data/datecode';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { DefalutDateCode } from 'src/app/shared/utils/dataRegex';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { ReceiptInfoService } from './ReceiptInfo';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

interface ReceiptInfo {
  ReceiptLIDs: number[];
  DateCode: string;
  CountryID: number;
  ROHS: boolean;
  ISO3: string;
}

@Injectable()
export class updateReceiptInfoService {
  constructor(
    private _update: ReceivingUpdateReceiptLGQL,
    private _receipt: ReceiptInfoService,
    private _insertLog: Create_EventLogsGQL,
    private _eventLog: EventLogService,
    private _country: CountryListService,
    private _datecode: DatecodeService,
    private _userInfo: StorageUserInfoService
  ) {}
  /**
   * Store info for update receipt
   */
  private _receiptInfo = new BehaviorSubject<ReceiptInfo>(null);
  public get receiptInfo(): ReceiptInfo {
    return this._receiptInfo.value;
  }

  /**
   * reset
   */
  public reset() {
    this._receiptInfo.next(null);
  }

  /**
   * initReceiptInfo: After filter by Quantity. All lines are target receipt
   */
  public initReceiptInfo(): void {
    const ReceiptLIDs = this._receipt
      .receiptInfoAfterFilter()
      .map((res) => res.ReceiptLineID);
    this._receiptInfo.next({
      ReceiptLIDs,
      DateCode: '',
      CountryID: null,
      ROHS: null,
      ISO3: '',
    });
  }

  public updateDateCode(DateCode: string): void {
    this._receiptInfo.next({
      ...this._receiptInfo.value,
      DateCode,
    });
  }
  /**
   * updateCountryID
   */
  public updateCountry(CountryID: number, ISO3: string): void {
    this._receiptInfo.next({
      ...this._receiptInfo.value,
      CountryID,
      ISO3,
    });
  }
  /**
   * updateROHS
   */
  public updateROHS(ROHS: boolean) {
    this._receiptInfo.next({
      ...this._receiptInfo.value,
      ROHS,
    });
  }

  public checkDateCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      if (!DefalutDateCode.test(value)) {
        return { format: true };
      }
      if (Number(value) > this._datecode.currentDatecode) {
        return { value: true };
      }
      return null;
    };
  }

  public countryValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this._country.countryList$.pipe(
        map((res) => {
          return res.map((country) => ({
            name:
              country.ISO2 +
              ' - ' +
              country.ISO3 +
              ' - ' +
              country.CountryName +
              ' - ' +
              country._id,
          }));
        }),
        map((list) => {
          if (control.value.length === 2) {
            return list.some((country) => {
              if (
                country.name.substring(0, 2).toLocaleUpperCase() ===
                control.value.toLocaleUpperCase()
              ) {
                return true;
              }
              return false;
            });
          }
          if (control.value.length === 3) {
            return list.some((country) => {
              if (
                country.name.substring(5, 8).toLocaleUpperCase() ===
                control.value.trim().toLocaleUpperCase()
              ) {
                return true;
              }
              return false;
            });
          }
          if (control.value.length > 6) {
            return list.some(
              (country) =>
                country.name.toLocaleUpperCase() ===
                control.value.toLocaleUpperCase()
            );
          }
          return false;
        }),
        map((res) => (!res ? { notExist: true } : null)),
        take(1)
      );
    };
  }

  public passAuthForNotApplicable$(Supervisor: string, Type: string) {
    const line = this._receipt.receiptInfoAfterFilter()[0];
    const oldLogs = {
      UserName: this._userInfo.userName,
      UserEventID: sqlData.Event_Receiving_NotApplicable,
      Quantity: line.ExpectedQuantity,
      PartNumber: line.PartNumber,
      ProductCode: line.ProductCodeNumber,
      ReceiptHeader: this._receipt.headerID(),
      PurchaseOrderNumber: line.PurchaseOrderNumber,
      PurchaseLine: line.PurchaseLineNumber,
      Message: `${Type}|${Supervisor}`,
    };
    const eventLogs = {
      UserName: this._userInfo.userName,
      EventTypeID: sqlData.Event_Receiving_NotApplicable,
      Log: JSON.stringify({
        Quantity: line.ExpectedQuantity,
        PartNumber: line.PartNumber,
        ProductCode: line.ProductCodeNumber,
        ReceiptHeader: this._receipt.headerID(),
        PurchaseOrderNumber: line.PurchaseOrderNumber,
        PurchaseLine: line.PurchaseLineNumber,
        Supervisor,
        Type,
      }),
    };
    return this._insertLog.mutate({ oldLogs, eventLogs });
  }

  public updateReceiptLSQL$() {
    const update = this._update.mutate({
      idList: this.receiptInfo.ReceiptLIDs,
      DateCode: this.receiptInfo.DateCode,
      CountryID: this.receiptInfo.CountryID,
      ROHS: this.receiptInfo.ROHS,
    });
    const oldLogs = this._receipt.receiptInfoAfterFilter().map((line) => {
      return {
        UserName: this._userInfo.userName,
        UserEventID: sqlData.Event_Receiving_UpdateInfo,
        ReceiptLine: line.ReceiptLineNumber,
        Quantity: line.ExpectedQuantity,
        PartNumber: line.PartNumber,
        ProductCode: line.ProductCodeNumber,
        ReceiptHeader: this._receipt.headerID(),
        PurchaseOrderNumber: line.PurchaseOrderNumber,
        PurchaseLine: line.PurchaseLineNumber,
      };
    });
    const eventLogs = this._receipt.receiptInfoAfterFilter().map((line) => {
      return {
        ...this._eventLog.eventLog,
        EventTypeID: sqlData.Event_Receiving_UpdateInfo,
        Log: JSON.stringify({
          ...JSON.parse(this._eventLog.eventLog.Log),
          ...line,
          DateCode: this.receiptInfo.DateCode,
          ROHS: this.receiptInfo.ROHS,
          ISO3: this.receiptInfo.ISO3,
        }),
      };
    });
    this._eventLog.updateEventLog(eventLogs[0]);
    return update.pipe(
      switchMap(() => {
        return this._insertLog.mutate({ oldLogs, eventLogs });
      })
    );
  }
}
