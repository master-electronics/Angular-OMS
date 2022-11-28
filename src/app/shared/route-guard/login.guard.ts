import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivateChild {
  public routeAuthorized: boolean;

  constructor(
    private router: Router,
    private authentication: AuthenticationService
  ) {
    //
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
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
