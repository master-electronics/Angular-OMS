import { DoCheck, Injectable, NgZone, OnInit } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { catchError, EMPTY, map, Observable, of, Subject, tap } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from '../services/authentication.service';
import { RouteAuthService } from '../services/route-auth.service';
import { Logger } from '../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class RouterGuard implements CanActivateChild {
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _zone: NgZone,
    private _message: NzMessageService,
    private _auth: AuthenticationService,
    private _routeAuth: RouteAuthService
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // search routAuthInfo key by the route.url, auth.userInfo.userGroups to get current group
    const userGroups = this._auth.userInfo.userGroups;
    return this._routeAuth.routeAuth$.pipe(
      map((res) => {
        let current = 0;
        let needCheck = false;
        res.some((route, index) => {
          if (route.Route === state.url) {
            needCheck = route.ADGroupProtected;
            current = index;
            return true;
          }
          return false;
        });
        if (needCheck) {
          return res[current].ROUTEGROUPs.some((group) =>
            userGroups.includes(group.ADGroup)
          );
        }
        return true;
      }),
      tap((res) => {
        if (!res) {
          this._zone.run(() => {
            this._message.warning('You are not allowed to view this page.');
          });
        }
      }),
      catchError((err) => {
        Logger.error('route-auth', 'activate', err.message);
        return EMPTY;
      })
    );
  }
}
