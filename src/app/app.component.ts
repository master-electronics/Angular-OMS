import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { Observable } from 'rxjs';

import { filter } from 'rxjs/operators';
import { UIStateStore } from './shared/data/app-ui-state';

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

    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  public loading$: Observable<any>;
  constructor(private router: Router, private _ui: UIStateStore) {}

  ngOnInit(): void {
    this.loading$ = this._ui.pageLoading$;
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

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this._ui.changePageLoading(true);
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
