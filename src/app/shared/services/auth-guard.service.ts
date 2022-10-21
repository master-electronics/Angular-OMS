import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { FindRouteGQL } from 'src/app/graphql/route.graphql-gen';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private routeSubscription = new Subscription();
  public routeAuthorized: boolean;

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    private _findRoute: FindRouteGQL
  ) {
    //
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userinfo = sessionStorage.getItem('userToken');
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

  public checkRouteAuthorized(Route: string): void {
    let authorized = false;

    this.routeSubscription.add(
      this._findRoute
        .fetch(
          {
            route: Route,
          },
          {
            fetchPolicy: 'network-only',
          }
        )
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
              this.router.navigate(['/home']);
            }
          },
        })
    );
  }
}
