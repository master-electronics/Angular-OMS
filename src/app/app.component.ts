import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <ng-container *ngIf="router$ | async"></ng-container>
    <div
      class="    
      absolute z-50 grid h-full w-full grid-cols-1 grid-rows-1 place-items-center bg-gray-900 text-white opacity-30"
      *ngIf="loading$ | async"
      #overlay
    >
      <loading-spinner></loading-spinner>
    </div>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  public loading$ = new BehaviorSubject<boolean>(false);
  public router$;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router$ = this.router.events.pipe(
      map((routerEvent: RouterEvent) => this.checkRouterEvent(routerEvent))
    );
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading$.next(true);
      return;
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.loading$.next(false);
    }
  }
  @ViewChild('overlay') spinnerDOM;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.spinnerDOM && this.spinnerDOM.nativeElement) {
      event.preventDefault();
    }
  }
}
