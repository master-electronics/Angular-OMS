import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { CommonService } from '../../../shared/services/common.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  showMenu = false;
  showUser = false;
  dark = false;
  user$: Observable<string>;
  title$: Observable<string>;
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

  constructor(
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    @Inject(DOCUMENT) private document: any,
    private elementRef: ElementRef
  ) {
    this.elem = document.documentElement;
  }

  ngOnInit(): void {
    this.title$ = this.commonService.navbar$;
    this.user$ = this.authenticationService.user$.pipe(
      map((res) => {
        return JSON.parse(res).username;
      })
    );
  }

  logout(): void {
    this.authenticationService.logout();
    this.toggleUser();
  }
}
