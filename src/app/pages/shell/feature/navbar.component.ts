import {
  Component,
  OnInit,
  HostListener,
  Inject,
  inject,
  signal,
  effect,
} from '@angular/core';
import { DOCUMENT, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { CommonService } from '../../../shared/services/common.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { LOCAL_STORAGE } from 'src/app/shared/utils/storage';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { MenubarItemComponent } from '../../../shared/ui/menubar-item.compenent';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavbarDropMenuComponent } from '../ui/navbar-drop-menu.component';

@Component({
  template: `
    <nav class="border-b-2 border-indigo-500 bg-gray-100">
      <div class="mx-auto px-2">
        <div class="grid h-10 grid-flow-col justify-between">
          <div class="grid grid-flow-col items-center justify-center">
            <a routerLink="/home">
              <i nz-icon nzType="home" nzTheme="outline" class="text-2xl"></i>
            </a>
            <div class="ml-2">
              <span class="text-gray-800 md:text-lg">
                {{ title }}
              </span>
            </div>
          </div>
          <div>
            <nav-drop-menu></nav-drop-menu>
          </div>
          <div class="grid grid-flow-col items-center md:ml-6">
            <div class="md:hidden">
              <button
                class="mr-4 inline-flex items-center justify-center rounded-md focus:outline-none"
                (click)="toggleFullscreen()"
              >
                <i
                  *ngIf="!isFullscreen"
                  nz-icon
                  nzType="fullscreen"
                  nzTheme="outline"
                  class="text-2xl"
                ></i>
                <i
                  *ngIf="isFullscreen"
                  nz-icon
                  nzType="fullscreen-exit"
                  nzTheme="outline"
                  class="text-2xl"
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  providers: [MenuService],
  standalone: true,
  imports: [NavbarDropMenuComponent],
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
    private commonService: CommonService,
    private mService: MenuService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.elem = document.documentElement;
    this.mService.getMenu('home');
    this.mItems = this.mService.menuItems;
  }

  userInfo = inject(StorageUserInfoService);

  ngOnInit(): void {
    //
  }

  title = '';
  router = inject(Router);
  localStorage = inject(LOCAL_STORAGE);
  logout(): void {
    this.router.navigate(['/login']);
    sessionStorage.clear();
    this.localStorage.clear();
  }
}
