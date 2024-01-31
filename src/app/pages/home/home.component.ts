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
  templateUrl: './home.component.html',
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
