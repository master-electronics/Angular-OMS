import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { SortingService } from '../sorting';

@Injectable()
export class SortLocationResolver implements Resolve<any> {
  constructor(private _sort: SortingService) {}
  resolve() {
    return this._sort.suggestLocation$().pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
