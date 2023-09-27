import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { AuditService } from '../../data/audit.service';
import { catchError, of } from 'rxjs';

@Injectable()
export class SearchLocationResolver implements Resolve<any> {
  constructor(private _auditService: AuditService) {
    //
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    {
      return this._auditService.searchLocations$.pipe(
        catchError((error) => {
          return of({ error });
        })
      );
    }
  }
}
