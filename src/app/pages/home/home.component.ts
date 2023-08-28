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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [MenuService],
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
    private _title: NavbarTitleService,
    public menuService: MenuService,
    private titleService: Title
  ) {
    this.isMobile = true;
    this._title.update(this.title);
    this.titleService.setTitle('Home');
    this.menuService.getMenu('home');
  }
}
