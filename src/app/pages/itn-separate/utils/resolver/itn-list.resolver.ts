import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ItnSeparateService } from '../../data/itn-separate.service';

@Injectable()
export class ItnListResolver implements Resolve<any> {
  constructor(private _split: ItnSeparateService) {}
  resolve() {
    return this._split.separateITN$().pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
