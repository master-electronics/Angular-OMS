import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';

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
      title: 'WMS-Status',
      link: 'wmsstatus',
      content: 'Count how many ITNs, lines or orders are in each status',
    },
    {
      title: 'Event Logs',
      link: 'eventlog',
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
        'Show how many time spend on single line qc and aggregation for each order.',
    },
    {
      title: 'Hold-on Counter',
      link: 'holdoncounter',
      content: 'Show how many lines were kicked out by Quality Control.',
    },
    {
      title: 'ITN Lifecycle',
      link: 'itnlifecycle',
      content: 'The life of every ITN worked each day',
    },
  ];

  constructor(private _title: NavbarTitleService, private titleService: Title) {
    this._title.update('Table Views');
    this.titleService.setTitle('tableviews');
  }
}
