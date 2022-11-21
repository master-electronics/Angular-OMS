import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ReceiptInfoService } from '../ReceiptInfo';

@Injectable()
export class PartResolver implements Resolve<any> {
  constructor(private _receipt: ReceiptInfoService) {}
  resolve() {
    return this._receipt.findLines$().pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
