import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { ReceiptInfoService } from '../../data/ReceiptInfo';

export const OverReceivingResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  receipt: ReceiptInfoService = inject(ReceiptInfoService)
): Observable<any> => {
  return receipt.findLines$().pipe(
    catchError((error) => {
      return of({ error });
    })
  );
};
