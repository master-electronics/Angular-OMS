import { DoCheck, Injectable, NgZone, OnInit } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FindRouteGQL } from 'src/app/graphql/route.graphql-gen';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class RouterGuard implements CanActivate, OnInit, DoCheck {
  public routeSubscription = new Subscription();
  private _userGrups = new BehaviorSubject<string[]>([]);
  private _routeAuthInfo = new BehaviorSubject<any>(null);

  constructor(
    private _router: Router,
    private _findRoute: FindRouteGQL,
    private _zone: NgZone,
    private _message: NzMessageService
  ) {}

  ngOnInit(): void {
    const userGroups = JSON.parse(sessionStorage.getItem('userToken'))
      ?.userGroups?.toString()
      .split(',');
    this._userGrups.next(userGroups);
    // fetch all route and routegroup info then store JSON into _routeAuthInfo;
    this.routeSubscription.add();
  }

  ngDoCheck(): void {
    this.routeSubscription.unsubscribe();
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // search routAuthInfo key by the route link
    let result = true;
    if (state.url === '/searchbarcode') {
      result = false;
    }
    if (!result) {
      this._zone.run(() => {
        this._message.warning('You are not allowed to view this page.');
      });
    }
    return result;
  }

  public checkRouteAuthorized(Route: string): void {
    let authorized = false;
    this.routeSubscription.add(
      this._findRoute
        .fetch({
          route: Route,
        })
        .subscribe({
          next: (res) => {
            if (res.data.findRoute.length < 1) {
              authorized = true;
              return;
            }

            if (!res.data.findRoute[0].ADGroupProtected) {
              authorized = true;
              return;
            }

            const authToken = JSON.parse(sessionStorage.getItem('userToken'));
            const userGroups = authToken.userGroups.toString().split(',');
            const menuGroups = res.data.findRoute[0].Groups
              ? res.data.findRoute[0].Groups.split(',')
              : null;

            if (menuGroups) {
              userGroups.map((group) => {
                if (menuGroups.includes(group)) {
                  authorized = true;
                }
              });
            }
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            if (!authorized) {
              this._router.navigate(['/home']);
            }
          },
        })
    );
  }
}
