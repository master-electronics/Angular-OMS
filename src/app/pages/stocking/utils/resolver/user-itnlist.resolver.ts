import { Injectable } from '@angular/core';
import { ActivatedRoute, Resolve, Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { StockingService } from '../../data/stocking.service';

@Injectable()
export class UserItnlistResolver implements Resolve<any> {
  constructor(
    private _stocking: StockingService,
    private _router: Router,
    private _actRoute: ActivatedRoute
  ) {}
  resolve() {
    return this._stocking.ItnInUserContainer$().pipe(
      catchError((error) => {
        this._router.navigate(['../stocking'], {
          relativeTo: this._actRoute,
        });
        return error;
      })
    );
  }
}
