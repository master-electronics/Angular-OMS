import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class PickingGuard implements CanActivateChild {
  public routeAuthorized: boolean;

  constructor(private router: Router) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    let isActive: boolean;
    switch (state.url) {
      // case '/picking':
      //   isActive = false;
      //   break;

      default:
        isActive = true;
        break;
    }
    if (!isActive) {
      this.router.navigate(['/picking']);
    }
    return isActive;
  }
}
