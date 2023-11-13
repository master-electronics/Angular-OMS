import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuditService } from '../../data/audit.service';
import { catchError, forkJoin, of } from 'rxjs';

@Injectable()
export class SystemTriggerResolver {
  constructor(private _auditService: AuditService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return forkJoin({
      AuditTypes: this._auditService.getAuditTypes(),
      SystemAudits: this._auditService.getSystemAuditList(false),
    }).pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
