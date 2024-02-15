import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuditService } from '../../data/audit.service';
import { catchError, forkJoin, of } from 'rxjs';

@Injectable()
export class ManagementTriggerResolver {
  constructor(private _auditService: AuditService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return forkJoin({
      auditCount: this._auditService.auditCount(),
      auditPriority: this._auditService.fetchLocationAudits(),
    }).pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
