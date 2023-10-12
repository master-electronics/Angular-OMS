import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';
import { DefaultCardComponent } from 'src/app/shared/ui/card/default-card.component';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, DefaultCardComponent],
  template: `
    <div class="container mx-auto px-2 py-2 text-lg md:mt-4">
      <div class="grid grid-cols-3 gap-8 md:grid-cols-4">
        <default-card
          *ngFor="let table of tableList"
          [link]="table.link"
          [title]="table.title"
          [discription]="table.discription"
        ></default-card>
      </div>
    </div>
  `,
})
export class MenuComponent implements OnInit {
  tableList = [
    {
      title: 'Order View',
      link: 'orderview',
      discription: 'Order overview.',
    },
    {
      title: 'WMS-Status',
      link: 'wmsstatus',
      discription: 'Count how many ITNs, lines or orders are in each status',
    },
    {
      title: 'Event Logs',
      link: 'tableview/eventlog',
      discription: 'View the user activity event logs on WMS',
    },
    {
      title: 'Task Counter',
      link: 'tableview/taskcounter',
      discription: 'Count how many ITN was processed by each user.',
    },
    {
      title: 'Order Tasktime',
      link: 'ordertasktime',
      discription:
        'Show how many time spend on single line qc and aggregation for each order.',
    },
    {
      title: 'Hold-on Counter',
      link: 'holdoncounter',
      discription: 'Show how many lines were kicked out by Quality Control.',
    },
    {
      title: 'ITN Lifecycle',
      link: 'itnlifecycle',
      discription: 'The life of every ITN worked each day',
    },
    {
      title: 'Adjustment View',
      link: 'adjustmentview',
      discription: 'Show all of audit quantity.',
    },
  ];

  constructor(
    private _title: NavbarTitleService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('tableviews');
    this._title.update('Table View');
  }
}
