import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, of } from 'rxjs';
import { UserContainerService } from 'src/app/shared/data/user-container';

@Injectable()
export class ItnResolver implements Resolve<any> {
  constructor(private _userC: UserContainerService) {}
  resolve() {
    return this._userC.userContainerID$.pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
