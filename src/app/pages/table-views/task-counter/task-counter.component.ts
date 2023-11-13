import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import { NavbarTitleService } from '../../../shared/services/navbar-title.service';
import { FetchTaskCounterGQL } from '../../../graphql/tableView.graphql-gen';
import { catchError, map, tap } from 'rxjs/operators';
import {
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';

interface tableData {
  User: string;
  total: number;
  taskCounter: number[];
}

@Component({
  selector: 'task-counter',
  templateUrl: './task-counter.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzGridModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    NzWaveModule,
    NzTableModule,
    NgFor,
    RouterLink,
    AsyncPipe,
  ],
})
export class TaskCounterComponent implements OnInit {
  isLoading = false;
  fetchTable$;
  startDate: string;

  constructor(
    private _title: NavbarTitleService,
    private fb: UntypedFormBuilder,
    private fetchTaskCounter: FetchTaskCounterGQL
  ) {
    this._title.update('Task Counting');
  }

  filterForm = this.fb.group({
    module: ['', [Validators.required]],
    timeRange: ['', [Validators.required]],
  });

  ngOnInit(): void {
    for (let index = 0; index < 24; index++) {
      let title = '';
      if (index < 12) title = `${index}am`;
      if (index === 12) title = '12pm';
      if (index > 12) title = `${index - 12}pm`;
      this.listOfColumn.push({
        title,
        compare: (a: tableData, b: tableData): number =>
          a.taskCounter[index] - b.taskCounter[index],
      });
    }
  }

  resetForm(): void {
    this.filterForm.reset({
      module: '',
      timeRange: '',
    });
  }

  onSubmit(): void {
    if (this.filterForm.invalid || this.isLoading) return;
    const selectedDate = this.filterForm.get('timeRange').value;
    const startDate = new Date(selectedDate.setHours(0, 0, 0, 0)).toISOString();
    this.startDate = startDate;
    const endDate = new Date(
      selectedDate.setHours(23, 59, 59, 999)
    ).toISOString();

    // prepare query data then send
    this.isLoading = true;
    this.fetchTable$ = this.fetchTaskCounter
      .fetch(
        {
          Module: this.filterForm.get('module').value,
          startDate: startDate,
          endDate: endDate,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          this.isLoading = false;
          let totalForAll = 0;
          const taskCounterForAll = new Array(24).fill(0);
          // iterate each user record
          const tableData: tableData[] = res.data.fetchTaskCounter
            .filter((element) => element !== null)
            .map((element) => {
              const total = element.taskCounter.reduce((acc, curr, index) => {
                taskCounterForAll[index] += curr;
                return acc + curr;
              });
              totalForAll += total;
              return {
                User: element.User,
                total,
                taskCounter: element.taskCounter,
              };
            });
          // Insert Total record at the end.
          tableData.push({
            User: 'Total',
            total: totalForAll,
            taskCounter: taskCounterForAll,
          });
          return tableData;
        }),
        tap((res) => {
          const tmp = res.map((node) => ({
            User: node.User,
            total: node.total,
            '0am': node.taskCounter[0],
            '1am': node.taskCounter[1],
            '2am': node.taskCounter[2],
            '3am': node.taskCounter[3],
            '4am': node.taskCounter[4],
            '5am': node.taskCounter[5],
            '6am': node.taskCounter[6],
            '7am': node.taskCounter[7],
            '8am': node.taskCounter[8],
            '9am': node.taskCounter[9],
            '10am': node.taskCounter[10],
            '11am': node.taskCounter[11],
            '12am': node.taskCounter[12],
            '1pm': node.taskCounter[13],
            '2pm': node.taskCounter[14],
            '3pm': node.taskCounter[15],
            '4pm': node.taskCounter[16],
            '5pm': node.taskCounter[17],
            '6pm': node.taskCounter[18],
            '7pm': node.taskCounter[19],
            '8pm': node.taskCounter[20],
            '9pm': node.taskCounter[21],
            '10pm': node.taskCounter[22],
            '11pm': node.taskCounter[23],
          }));
          this.ws = XLSX.utils.json_to_sheet(tmp);
        }),
        catchError((error) => {
          this.isLoading = false;
          return error;
        })
      );
  }

  // table setting
  listOfColumn = [
    {
      title: 'User',
      compare: (a: tableData, b: tableData): number =>
        a.User.localeCompare(b.User),
    },
    {
      title: 'Total',
      compare: (a: tableData, b: tableData): number => a.total - b.total,
    },
  ];

  public ws: XLSX.WorkSheet;
  exportexcel(): void {
    /* table id is passed over here */
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, this.ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `${this.startDate?.substring(0, 10)}.xlsx`);
  }
}
