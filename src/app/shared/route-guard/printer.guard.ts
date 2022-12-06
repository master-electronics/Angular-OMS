import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PrinterGuard implements CanActivate {
  public routeAuthorized: boolean;

  constructor(private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (localStorage.getItem('printerName')) {
      return true;
    }
    // printerName have not set, then redirect to setting page
    this.router.navigate(['/printersetting'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
