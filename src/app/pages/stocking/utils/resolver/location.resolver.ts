import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ItnInfoService } from '../../data/itn-info.service';
import { SuggestLocationsService } from '../../data/suggestLocations.service';

@Injectable()
export class SortLocationResolver implements Resolve<any> {
  constructor(
    private _itn: ItnInfoService,
    private _suggest: SuggestLocationsService
  ) {}
  resolve() {
    return this._suggest.suggestLocation$(this._itn.itnInfo.ProductID).pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
