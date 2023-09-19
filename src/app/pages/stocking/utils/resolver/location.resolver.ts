import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { ItnInfoService } from '../../data/itn-info.service';
import { SuggestLocationsService } from '../../data/suggestLocations.service';

export const SortLocationResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  suggest: SuggestLocationsService = inject(SuggestLocationsService),
  itn: ItnInfoService = inject(ItnInfoService)
): Observable<any> => {
  return suggest.suggestLocation$(itn.itnInfo.ProductID).pipe(
    catchError((error) => {
      return of({ error });
    })
  );
};
