import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, of } from 'rxjs';
import { UserContainerService } from 'src/app/shared/data/user-container';
import { UserInventoryService } from 'src/app/shared/data/user-inventory';

@Injectable()
export class LocationResolver implements Resolve<any> {
  constructor(private _userI: UserInventoryService) {}
  resolve() {
    return this._userI.userITN$.pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
