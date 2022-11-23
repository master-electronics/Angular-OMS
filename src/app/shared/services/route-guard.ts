import { DoCheck, Injectable, NgZone, OnInit } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Subject, tap } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from './authentication.service';
import { RouteAuthService } from './route-auth.service';

@Injectable({
  providedIn: 'root',
})
export class RouterGuard implements CanActivate {
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _zone: NgZone,
    private _message: NzMessageService,
    private _auth: AuthenticationService,
    private _routeAuth: RouteAuthService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // search routAuthInfo key by the route.url, auth.userInfo.userGroups to get current group
    const userGroups = this._auth.userInfo.userGroups;
    let result = false;
    this._routeAuth.routeAuth$
      .pipe(
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
        })
      )
      .subscribe({
        next: (res) => {
          result = res;
        },
        error: (error) => {
          console.log(error);
        },
      })
      .unsubscribe();
    return result;
  }
}
