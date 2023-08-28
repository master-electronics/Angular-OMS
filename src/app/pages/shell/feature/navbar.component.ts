import { Component, HostListener, Inject, inject } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LOCAL_STORAGE } from 'src/app/shared/utils/storage';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { MenubarItemComponent } from '../../../shared/ui/menubar-item.compenent';
import { NavbarDropMenuComponent } from '../ui/navbar-drop-menu.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';

@Component({
  selector: 'top-navbar',
  template: `
    <nav class="border-b-2 border-indigo-500 bg-gray-100">
      <div class="mx-auto px-2">
        <div class="grid h-10 grid-flow-col justify-between">
          <!-- left: Home button and title -->
          <div class="grid grid-flow-col items-center">
            <a routerLink="/home">
              <i nz-icon nzType="home" nzTheme="outline" class="text-2xl"></i>
            </a>
            <div class="ml-2">
              <span class="text-gray-800 md:text-lg">
                {{ this.title.title() }}
              </span>
            </div>
          </div>
          <!-- right: User drop down and menu button -->
          <div class="grid grid-flow-col items-center gap-2">
            <nav-drop-menu
              [userName]="this.userInfo.userName"
              (logout)="logout()"
            ></nav-drop-menu>
            <div class="md:hidden">
              <button
                class="inline-flex items-center justify-center rounded-md focus:outline-none"
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
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NavbarDropMenuComponent,
    NzDrawerModule,
    MenubarItemComponent,
    NzIconModule,
  ],
})
export class NavbarComponent {
  showMenu = false;
  isFullscreen = false;
  elem;

  constructor(@Inject(DOCUMENT) private document: any) {
    this.elem = document.documentElement;
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

  title = inject(NavbarTitleService);
  userInfo = inject(StorageUserInfoService);

  router = inject(Router);
  localStorage = inject(LOCAL_STORAGE);
  logout(): void {
    this.router.navigate(['/login']);
    sessionStorage.clear();
  }
}
