import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    private cookieService: CookieService
  ) {
    //
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userinfo = this.cookieService.get('user');
    if (userinfo) {
      if (JSON.parse(userinfo).username === this.authentication.userName) {
        // logged in so return true
        return true;
      }
    }
    // not logged in so redirect to login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
