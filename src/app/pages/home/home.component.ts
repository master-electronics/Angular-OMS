import { AfterViewInit, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ShortcutInput } from 'ng-keyboard-shortcuts';

import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  isMobile: boolean;
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
        key: ['t s'],
        label: 'Quick Access',
        description: 'Serverless Sql',
        command: () => {
          this.router.navigate(['/test']);
        },
      }
    );
  }
}
