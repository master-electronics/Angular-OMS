import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'table-views',
  templateUrl: './table-views.component.html',
})
export class TableViewsComponent {
  tableList = [
    {
      title: 'Order View',
      link: 'orderview',
      content: 'Order overview.',
    },
    {
      title: 'ITN-Status',
      link: 'itnstatus',
      content: 'Count how many ITNs are in each status',
    },
    {
      title: 'User Event Logs',
      link: 'usereventlog',
      content: 'View the user activity event logs on WMS',
    },
    {
      title: 'Task Counter',
      link: 'taskcounter',
      content: 'Count how many ITN was processed by each user.',
    },
    {
      title: 'Order Tasktime',
      link: 'ordertasktime',
      content:
        'Show how many time spend on single line qc and aggregation for each order',
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
