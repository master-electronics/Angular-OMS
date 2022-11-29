import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonService } from '../../../shared/services/common.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  providers: [MenuService],
})
export class NavbarComponent implements OnInit {
  showMenu = false;
  user$: Observable<string>;
  title$: Observable<string>;
  isFullscreen = false;
  elem;
  mItems;

  closeNavBar(): void {
    this.showMenu = false;
  }

  openNavBar(): void {
    this.showMenu = true;
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

  constructor(
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private mService: MenuService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.elem = document.documentElement;
    this.mService.getMenu('home');
    this.mItems = this.mService.menuItems;
  }

  ngOnInit(): void {
    this.title$ = this.commonService.navbar$;
    this.user$ = this.authenticationService.user$.pipe(
      map((res) => {
        return res ? res.username : '';
      })
    );
  }

  logout(): void {
    this.authenticationService.logout();
  }
}
