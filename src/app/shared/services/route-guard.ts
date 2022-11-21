import { DoCheck, Injectable, NgZone, OnInit } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RouterGuard implements CanActivate, OnInit, DoCheck {
  public destroy$: Subject<boolean> = new Subject<boolean>();
  private _routeAuthInfo = new BehaviorSubject<[]>([]);

  constructor(
    private _zone: NgZone,
    private _message: NzMessageService,
    private _auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    //
  }

  ngDoCheck(): void {
    // this.destroy$.next(true);
    // this.destroy$.unsubscribe();
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // search routAuthInfo key by the route.url, auth.userInfo.userGroups to get current group
    const result = true;
    if (!result) {
      this._zone.run(() => {
        this._message.warning('You are not allowed to view this page.');
      });
    }
    return result;
  }

  // public checkRouteAuthorized(Route: string): void {
  //   let authorized = false;
  //   this.routeSubscription.add(
  //     this._findRoute
  //       .fetch({
  //         route: Route,
  //       })
  //       .subscribe({
  //         next: (res) => {
  //           if (res.data.findRoute.length < 1) {
  //             authorized = true;
  //             return;
  //           }

  //           if (!res.data.findRoute[0].ADGroupProtected) {
  //             authorized = true;
  //             return;
  //           }

  //           const authToken = JSON.parse(sessionStorage.getItem('userToken'));
  //           const userGroups = authToken.userGroups.toString().split(',');
  //           const menuGroups = res.data.findRoute[0].Groups
  //             ? res.data.findRoute[0].Groups.split(',')
  //             : null;

  //           if (menuGroups) {
  //             userGroups.map((group) => {
  //               if (menuGroups.includes(group)) {
  //                 authorized = true;
  //               }
  //             });
  //           }
  //         },
  //         error: (error) => {
  //           console.log(error);
  //         },
  //         complete: () => {
  //           if (!authorized) {
  //             this._router.navigate(['/home']);
  //           }
  //         },
  //       })
  //   );
  // }
}
