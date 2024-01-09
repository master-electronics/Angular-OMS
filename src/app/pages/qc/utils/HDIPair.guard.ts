import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn,
} from '@angular/router';
import { HDIService } from 'src/app/pages/qc/data-access/hdi';

export const HDIPairGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const hdi = inject(HDIService);
  if (hdi.device) {
    return true;
  }
  // printerName have not set, then redirect to setting page
  router.navigate(['/qc/pairhdi']);
  return false;
};
