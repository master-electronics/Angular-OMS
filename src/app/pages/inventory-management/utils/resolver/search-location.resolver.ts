import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { AuditService } from '../../data/audit.service';
import { catchError, of, forkJoin } from 'rxjs';
import { OMSConfigService } from 'src/app/shared/services/oms-config.service';

@Injectable()
export class SearchLocationResolver implements Resolve<any> {
  constructor(
    private _auditService: AuditService,
    private _configService: OMSConfigService
  ) {
    //
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    {
      return forkJoin({
        auditTimeout: this._configService.getValue('IM_Audit_Timeout'),
        alertTime: this._configService.getValue('IM_Audit_Timeout_Alert'),
        location: this._auditService.searchLocations$,
      }).pipe(
        catchError((error) => {
          return of({ error });
        })
      );
    }
  }
}
