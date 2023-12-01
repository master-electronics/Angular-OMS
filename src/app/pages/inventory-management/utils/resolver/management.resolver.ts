import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuditService } from '../../data/audit.service';
import { catchError, forkJoin, of } from 'rxjs';

@Injectable()
export class ManagementTriggerResolver {
  constructor(private _autidService: AuditService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._autidService.auditCount().pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
