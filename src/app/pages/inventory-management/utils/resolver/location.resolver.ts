import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { AuditService } from '../../data/audit.service';
import { catchError, of } from 'rxjs';

@Injectable()
export class LocationResolver implements Resolve<any> {
  constructor(private _auditService: AuditService) {
    //
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    {
      return this._auditService.nextAudit$.pipe(
        catchError((error) => {
          return of({ error });
        })
      );
    }
  }
}