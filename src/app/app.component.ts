import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';

import { filter, map } from 'rxjs/operators';
import { AuthenticationService } from './shared/services/authentication.service';
import { AuthGuard } from './shared/services/auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isLoading = false;

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private authGuard: AuthGuard
  ) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((routerEvent: RouterEvent) => {
        this.checkRouterEvent(routerEvent);
      });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => {
          return event;
        })
      )
      .subscribe(() => {
        this.authGuard.checkRouteAuthorized(this.router.url);
      });
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.isLoading = true;
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.isLoading = false;
    }
  }
}
