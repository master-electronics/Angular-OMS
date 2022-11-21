import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <ng-container *ngIf="router$ | async"></ng-container>
    <ngx-spinner
      bdColor="rgba(91,110,142,0.8)"
      size="medium"
      color="#fff"
      type="square-loader"
      [fullScreen]="true"
      ><p style="color: white">Loading...</p></ngx-spinner
    >
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  public router$;
  constructor(private router: Router, private _spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.router$ = this.router.events.pipe(
      map((routerEvent: RouterEvent) => this.checkRouterEvent(routerEvent))
    );
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this._spinner.show();
      return;
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this._spinner.hide();
    }
  }
}
