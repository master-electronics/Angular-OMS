import { Component } from '@angular/core';

import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  isMobile: boolean;
  title = 'Master Electronics';
  constructor(private commonService: CommonService) {
    this.isMobile = this.commonService.isMobile();
    this.commonService.changeTitle(this.title);
  }
}
