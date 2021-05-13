import { Component, OnDestroy, OnInit, ElementRef, HostListener } from '@angular/core';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { CommonService } from '../../../shared/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  showMenu = false;
  showUser = false;
  dark = false;
  username: string;
  title: string;
  titleSubscription: Subscription;

  toggleNavbar(): void {
    this.showMenu = !this.showMenu;
    this.showMenu ? (this.showUser = false) : 0;
  }

  toggleUser(): void {
    this.showUser = !this.showUser;
    this.showUser && (this.showMenu = false);
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showUser = false;
    }
  }

  constructor(
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private elementRef: ElementRef
  ) {
    //
  }

  ngOnInit(): void {
    this.titleSubscription = this.commonService.rxjsTitle.subscribe(
      (resData) => (this.title = resData)
    );
    this.authenticationService.rxjsUser.subscribe((user) => {
      if (user) {
        this.username = JSON.parse(user).username;
      } else {
        this.username = null;
      }
    });
    this.darkMode();
  }

  toggleDark(): void {
    this.dark = !this.dark;
    localStorage.darkMode = this.dark;
    this.darkMode();
  }

  darkMode(): void {
    this.dark
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');
  }

  logout(): void {
    this.authenticationService.logout();
    this.toggleUser();
  }

  ngOnDestroy(): void {
    this.titleSubscription.unsubscribe();
  }
}
