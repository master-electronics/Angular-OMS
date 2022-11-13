import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  public routeAuthorized: boolean;

  constructor(
    private router: Router,
    private authentication: AuthenticationService
  ) {
    //
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userinfo = sessionStorage.getItem('userToken');
    if (userinfo) {
      if (
        JSON.parse(userinfo)?.username ===
        this.authentication.userInfo?.username
      ) {
        // logged in so return true
        return true;
      }
    }
    // not logged in so redirect to login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
