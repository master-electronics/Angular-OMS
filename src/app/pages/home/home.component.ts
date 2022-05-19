import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  WMSList = [
    { link: '/agin', front: 'Aggregation ', highlight: 'I', end: 'n' },
    { link: '/agout', front: 'Aggregation ', highlight: 'O', end: 'ut' },
    { link: '/qc', front: '', highlight: 'Q', end: 'uality Control' },
    // { link: '/pick', front: '', highlight: 'P', end: 'ick' },
  ];
  toolList = [
    { link: '/tableviews', front: '', highlight: 'T', end: 'able Views' },
    { link: '/searchbarcode', front: '', highlight: 'S', end: 'earch Barcode' },
    {
      link: '/shelfinventory',
      front: 'Shelf ',
      highlight: 'I',
      end: 'nventory',
    },
    { link: '/printitn', front: '', highlight: 'P', end: 'rint ITN' },
    { link: '/valuemap', front: '', highlight: 'V', end: 'alue Mapping'},
  ];
  isMobile: boolean;
  changelogurl = environment.changelogurl;
  title = 'Master Electronics';
  constructor(
    private commonService: CommonService,
    private router: Router,
    private titleService: Title
  ) {
    this.isMobile = this.commonService.isMobile();
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle('Home');
  }
}
