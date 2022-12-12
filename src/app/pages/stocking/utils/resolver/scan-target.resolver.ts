import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, of } from 'rxjs';
import { StockingService } from '../../data/stocking.service';

@Injectable()
export class ScanTargetResolver implements Resolve<any> {
  constructor(private _stocking: StockingService) {}
  resolve() {
    return this._stocking.containerID$.pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
