import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { GlobalService } from './shared/data/Global';

@Component({
  selector: 'app-root',
  template: `
    <div
      class="absolute top-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50"
      style="background-size: 100%"
      *ngIf="loading$ | async"
    >
      <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
    </div>
    <ng-container *ngIf="router$ | async"></ng-container>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  public loading$;
  public router$;
  constructor(private router: Router, private _ui: GlobalService) {}

  ngOnInit(): void {
    this.loading$ = this._ui.pageLoading$;
    this.router$ = this.router.events.pipe(
      map((routerEvent: RouterEvent) => this.checkRouterEvent(routerEvent))
    );
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this._ui.changePageLoading(true);
      return;
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this._ui.changePageLoading(false);
    }
  }
}
