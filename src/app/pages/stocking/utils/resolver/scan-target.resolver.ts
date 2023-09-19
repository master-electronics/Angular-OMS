import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { UserContainerService } from 'src/app/shared/data/user-container';

export const ScanTargetResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  userC: UserContainerService = inject(UserContainerService)
): Observable<any> => {
  return userC.userContainerID$.pipe(
    catchError((error) => {
      return of({ error });
    })
  );
};
