import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, of } from 'rxjs';
import { LabelService } from '../../data/label';

@Injectable()
export class PrintItnResolver implements Resolve<any> {
  constructor(private _label: LabelService) {}
  10;
  resolve() {
    return this._label.printReceivingLabel$().pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
