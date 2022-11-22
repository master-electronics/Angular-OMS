import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/services/common.service';
import { MenuService } from 'src/app/shared/services/menu.service';

import { registerLocaleData } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [MenuService],
})
export class HomeComponent {
  isMobile: boolean;
  changelogurl = environment.changelogurl;
  title = 'Master Electronics';

  constructor(
    private commonService: CommonService,
    public menuService: MenuService,
    private titleService: Title,
    private router: Router
  ) {
    this.isMobile = this.commonService.isMobile();
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle('Home');
    this.menuService.getMenu('home');
  }
}
