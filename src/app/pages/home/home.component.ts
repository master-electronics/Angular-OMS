import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/services/common.service';
import { MenuService } from 'src/app/shared/services/menu.service';

import { registerLocaleData } from '@angular/common';
import { Subscription } from 'rxjs';
import { FetchHostNameGQL } from 'src/app/graphql/login.graphql-gen';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [MenuService],
})
export class HomeComponent implements OnInit, OnDestroy {
  isMobile: boolean;
  changelogurl = environment.changelogurl;
  title = 'Master Electronics';

  private hostnameSubscription: Subscription = new Subscription();

  constructor(
    private commonService: CommonService,
    public menuService: MenuService,
    private titleService: Title,
    private router: Router,
    private fetchHostname: FetchHostNameGQL
  ) {
    this.isMobile = this.commonService.isMobile();
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle('Home');
    this.menuService.getMenu('home');
  }

  ngOnInit(): void {
    //this.getHostname();
  }

  getHostname(): void {
    this.hostnameSubscription.add(
      this.fetchHostname.fetch({}, { fetchPolicy: 'network-only' }).subscribe({
        next: (res) => {
          sessionStorage.setItem('hostname', res.data.fetchHostName);
        },
        error: (error) => {
          console.log(error);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.hostnameSubscription.unsubscribe();
  }
}
