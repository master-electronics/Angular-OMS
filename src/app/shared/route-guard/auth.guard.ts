import { NgZone, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
} from '@angular/router';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { RouteAuthService } from '../services/route-auth.service';
import { StorageUserInfoService } from '../services/storage-user-info.service';

export const AuthGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const _zone = inject(NgZone);
  const _routeAuth = inject(RouteAuthService);
  const userInfo = inject(StorageUserInfoService);

  // search routAuthInfo key by the route.url, auth.userInfo.userGroups to get current group
  const userGroups = userInfo.userGroups;
  return _routeAuth.routeAuth$.pipe(
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
        _zone.run(() => {
          console.error('You are not allowed to view this page.');
        });
      }
    }),
    catchError((err) => {
      // Logger.error('route-auth', 'activate', err.message);
      return EMPTY;
    })
  );
};
