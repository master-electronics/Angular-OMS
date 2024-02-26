import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from '../../../environments/environment';
import { NavbarTitleService } from '../../shared/services/navbar-title.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import { MenuItemComponent } from '../../shared/ui/menu-item.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ShortCutService } from 'src/app/shared/services/short-cut.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div nz-row nzJustify="center">
      <!-- New feature link  -->
      <div nz-col nzXs="24" nzSm="22" nzMd="20" nzLg="20" nzXl="18" nzXXl="16">
        <div *ngIf="!isMobile">
          <h1 class="text-4xl font-bold" nz-row>
            Web-based Information Management System
          </h1>
          <p nz-row class="text-xl">New feature documentation.</p>
          <button nz-button nzType="primary" class="font-sans text-lg">
            <a [href]="changelogurl" target="_blank"> What's New</a>
          </button>
        </div>
        <div
          *ngIf="menuService.menusLoaded | async"
          nz-row
          nzGutter="32"
          class="md:mt-6"
        >
          <div
            *ngFor="let menuItem of menuService.rootMenuItems"
            nz-col
            nzXs="24"
            nzSm="24"
            nzMd="12"
            nzLg="12"
            nzXl="8"
            nzXXl="6"
          >
            <nz-card [nzCover]="cover" nzBorderless>
              <h1 class="text-xl font-semibold">
                <span>{{ menuItem.Front }}</span>
                <span class="font-bold text-yellow-500">{{
                  menuItem.Highlight
                }}</span>
                <span>{{ menuItem.End }}</span>
              </h1>
              <menu-item [children]="menuItem.Children"></menu-item>
            </nz-card>
            <ng-template #cover>
              <img
                *ngIf="!isMobile"
                style="width: 100px;"
                alt="{{ menuItem.Front + menuItem.Highlight + menuItem.End }}"
                src="{{ menuItem.CoverSrc }}"
              />
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  providers: [MenuService, ShortCutService],
  standalone: true,
  imports: [
    NzGridModule,
    NgIf,
    NzButtonModule,
    NzWaveModule,
    NgFor,
    NzCardModule,
    MenuItemComponent,
    AsyncPipe,
  ],
})
export class HomeComponent {
  isMobile: boolean;
  changelogurl = environment.changelogurl;
  title = 'Master Electronics';

  constructor(
    public menuService: MenuService,
    private _title: NavbarTitleService,
    private _shortCut: ShortCutService,
    private _router: Router
  ) {
    this.isMobile = true;
    this._title.update(this.title);
    this.menuService.getMenu('home');
    this._shortCut.shortCut$
      .pipe(takeUntilDestroyed())
      .subscribe((res) => this.quickLink(res));
  }

  quickLink(keys: string | undefined) {
    let link = '/';
    if (!keys) {
      return;
    }
    switch (keys[0]) {
      case 'w':
        switch (keys[1]) {
          case 'i':
            link = '/agin';
            break;
          case 'o':
            link = '/agout';
            break;
          case 'q':
            link = '/qc';
            break;
          case 'r':
            link = '/receiptreceiving';
            break;
          case 's':
            link = '/stocking';
            break;
        }
        break;

      default:
        break;
    }
    this._router.navigateByUrl(link);
  }
}
