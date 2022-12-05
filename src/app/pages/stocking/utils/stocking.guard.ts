import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SortingService } from '../data/sorting';

@Injectable()
export class StockingGuard implements CanActivateChild {
  public routeAuthorized: boolean;

  constructor(private router: Router, private sort: SortingService) {}

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
      case '/stocking/sorting/location':
        isActive = this.sort.sortingInfo !== null;
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
