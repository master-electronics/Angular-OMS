import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  HostListener,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  isFullscreen = false;
  elem;

  toggleNavbar(): void {
    this.showMenu = !this.showMenu;
    this.showMenu ? (this.showUser = false) : 0;
  }

  @HostListener('document:fullscreenchange', []) chagne(): void {
    this.isFullscreen = !this.isFullscreen;
  }
  toggleFullscreen(): void {
    this.isFullscreen ? this.closeFullscreen() : this.openFullscreen();
  }

  openFullscreen(): void {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullscreen(): void {
    if (document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
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

  private subscription: Subscription = new Subscription();
  constructor(
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    @Inject(DOCUMENT) private document: any,
    private elementRef: ElementRef
  ) {
    this.elem = document.documentElement;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.commonService.rxjsTitle.subscribe(
        (resData) => (this.title = resData)
      )
    );
    this.subscription.add(
      this.authenticationService.rxjsUser.subscribe((user) => {
        if (user) {
          this.username = JSON.parse(user).username;
        } else {
          this.username = null;
        }
      })
    );
  }

  logout(): void {
    this.authenticationService.logout();
    this.toggleUser();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
