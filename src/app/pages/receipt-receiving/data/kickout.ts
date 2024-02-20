import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, filter, switchMap } from 'rxjs';
import { SuspectInventoryGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { PrinterService } from 'src/app/shared/data/printer';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Injectable()
export class kickoutService {
  private _userInfo = inject(StorageUserInfoService);
  private _suspect = inject(SuspectInventoryGQL);
  private _printer = inject(PrinterService);

  private _kickoutItns = new BehaviorSubject<string[]>(null);
  get kickoutItns(): string[] {
    return this._kickoutItns.value;
  }
  updatekickoutItns(list: string[]): void {
    this._kickoutItns.next(list);
  }

  reset() {
    this._kickoutItns.next(null);
  }

  printKickOutLabel$(list: string[], reasonID: number, itn: string) {
    if (itn) {
      return this._suspect
        .mutate({
          DC: this._userInfo.distributionCenter,
          ITN: itn,
          reasonIDList: [reasonID],
        })
        .pipe(
          switchMap(() => {
            return this._printer.printText$(list);
          })
        );
    }
    return this._printer.printText$(list);
  }
}
