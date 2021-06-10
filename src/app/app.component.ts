import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { filter, map } from 'rxjs/operators';
import { AuthenticationService } from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isLoading = false;
  constructor(
    private router: Router,
    private gtmService: GoogleTagManagerService,
    private auth: AuthenticationService
  ) {
    this.router.events.subscribe((routerEvent: RouterEvent) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => {
          const gtmTag = {
            event: 'pageNav',
            userID: this.auth.userName,
          };
          this.gtmService.pushTag(gtmTag);
          return event;
        })
      )
      .subscribe(() => {
        //
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
