import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from '@angular/router';
import { OMSConfigService } from 'src/app/shared/services/oms-config.service';
import { AuditService } from '../../data/audit.service';
import { catchError, forkJoin, of } from 'rxjs';

@Injectable()
export class SubAuditResolver implements Resolve<any> {
  constructor(
    private _auditService: AuditService,
    private _configService: OMSConfigService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    {
      return forkJoin({
        imAdjustReasons: this._auditService.getIMAdjustReasons(),
        auditTimeout: this._configService.getValue('IM_Audit_Timeout'),
        alertTime: this._configService.getValue('IM_Audit_Timeout_Alert'),
      }).pipe(
        catchError((error) => {
          return of({ error });
        })
      );
    }
  }
}
