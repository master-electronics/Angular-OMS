import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, of } from 'rxjs';
import { SortingService } from '../../data/sorting.service';
import { SuggestLocationsService } from '../../data/suggestLocations.service';

@Injectable()
export class SortLocationResolver implements Resolve<any> {
  constructor(
    private _sort: SortingService,
    private _suggest: SuggestLocationsService
  ) {}
  resolve() {
    return this._suggest
      .suggestLocation$(this._sort.sortingInfo.ProductID)
      .pipe(
        catchError((error) => {
          return of({ error });
        })
      );
  }
}
