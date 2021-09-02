import { AfterViewInit, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ShortcutInput } from 'ng-keyboard-shortcuts';

import { environment } from '../../../environments/environment';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  WMSList = [
    { link: '/agin', front: 'Aggregation ', highlight: 'I', end: 'n' },
    { link: '/agout', front: 'Aggregation ', highlight: 'O', end: 'ut' },
    { link: '/qc', front: '', highlight: 'Q', end: 'uality Control' },
  ];
  toolList = [
    { link: '/orderview', front: '', highlight: 'O', end: 'rder View' },
    { link: '/printITN', front: '', highlight: 'P', end: 'rint ITN' },
    { link: '/relocate', front: '', highlight: 'R', end: 'elocate' },
    { link: '/searchbarcode', front: '', highlight: 'S', end: 'earch Barcode' },
  ];
  isMobile: boolean;
  changelogurl = environment.changelogurl;
  title = 'Master Electronics';
  shortcuts: ShortcutInput[] = [];
  constructor(
    private commonService: CommonService,
    private router: Router,
    private titleService: Title
  ) {
    this.isMobile = this.commonService.isMobile();
    this.commonService.changeTitle(this.title);
    this.titleService.setTitle('Home');
  }

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: ['w q'],
        label: 'Quick Access',
        description: 'Quality Control',
        command: () => {
          this.router.navigate(['/qc']);
        },
      },
      {
        key: ['w i'],
        label: 'Quick Access',
        description: 'Aggregation In',
        command: () => {
          this.router.navigate(['/agin']);
        },
      },
      {
        key: ['w o'],
        label: 'Quick Access',
        description: 'Aggregation Out',
        command: () => {
          this.router.navigate(['/agout']);
        },
      },
      {
        key: ['w s'],
        label: 'Quick Access',
        description: 'Search Barcode',
        command: () => {
          this.router.navigate(['/searchbarcode']);
        },
      },
      {
        key: ['w v'],
        label: 'Quick Access',
        description: 'Order View',
        command: () => {
          this.router.navigate(['/orderview']);
        },
      }
    );
  }
}
