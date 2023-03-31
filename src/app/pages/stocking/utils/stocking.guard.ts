import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ItnInfoService } from '../data/itn-info.service';

@Injectable()
export class StockingGuard implements CanActivateChild {
  public routeAuthorized: boolean;

  constructor(private router: Router, private _itn: ItnInfoService) {}

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
      case '/stocking/location':
        isActive = this._itn.itnInfo !== null;
        break;

      default:
        isActive = true;
        break;
    }
    if (!isActive) {
      this.router.navigate(['/stocking']);
    }
    return isActive;
  }
}
