import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, filter, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SuspectInventoryGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { PrinterService } from 'src/app/shared/data/printer';

@Injectable()
export class kickoutService {
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
          DC: environment.DistributionCenter,
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
