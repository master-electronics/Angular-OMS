import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn,
} from '@angular/router';

export const PrinterGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);

  localStorage.removeItem('printerName');
  if (sessionStorage.getItem('printerName')) {
    return true;
  }
  // printerName have not set, then redirect to setting page
  router.navigate(['/printersetting'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};
