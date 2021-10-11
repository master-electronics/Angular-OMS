import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'table-views',
  templateUrl: './table-views.component.html',
})
export class ManagerToolsComponent {
  tableList = [
    {
      title: 'Assign Zone',
      link: 'assignzone',
      content: 'Assign user to zone',
    },
  ];

  constructor(
    private commonService: CommonService,
    private titleService: Title
  ) {
    this.commonService.changeNavbar('Table Views');
    this.titleService.setTitle('tableviews');
  }
}
