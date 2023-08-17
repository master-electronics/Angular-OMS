import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="container mx-auto px-2 py-2 text-lg md:mt-4">
      <div class="mt-5 grid justify-center gap-20 text-base">
        <a class="" [routerLink]="table.link" *ngFor="let table of tableList">{{
          table.title
        }}</a>
      </div>
    </div>
  `,
})
export class MenuComponent implements OnInit {
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

  constructor(private navBar: CommonService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('tableviews');
    this.navBar.changeNavbar('Table View');
  }
}
