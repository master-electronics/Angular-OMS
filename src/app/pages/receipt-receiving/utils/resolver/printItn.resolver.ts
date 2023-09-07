import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { LabelService } from '../../data/label';

export const PrintItnResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  label: LabelService = inject(LabelService)
): Observable<any> => {
  label.itnIndexIncrement();
  return label.printReceivingLabel$().pipe(
    catchError((error) => {
      return of({ error });
    })
  );
};
