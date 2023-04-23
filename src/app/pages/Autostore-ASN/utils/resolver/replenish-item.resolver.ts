import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ASNService } from '../../data/asn.service';

@Injectable()
export class ReplenishItemResolver implements Resolve<any> {
  constructor(private _asn: ASNService) {}
  resolve() {
    return this._asn.nextReplenishmentItem$.pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
