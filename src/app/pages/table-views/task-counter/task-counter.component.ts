import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

import { CommonService } from '../../../shared/services/common.service';
import { FetchTaskCounterGQL } from '../../../graphql/tableViews.graphql-gen';
import { catchError, map } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';

interface tableData {
  User: string;
  total: number;
  taskCounter: number[];
}

@Component({
  selector: 'task-counter',
  templateUrl: './task-counter.component.html',
})
export class TaskCounterComponent implements OnInit {
  isLoading = false;
  fetchTable$: Observable<any>;
  startDate: string;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private fetchTaskCounter: FetchTaskCounterGQL
  ) {
    this.commonService.changeNavbar('Task Counting');
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
          Module: Number(this.filterForm.get('module').value),
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
                ID: element.ID,
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

  exportexcel(): void {
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(
      wb,
      `${this.filterForm
        .get('module')
        .value.replace(' ', '')}${this.startDate.substring(0, 10)}.xlsx`
    );
  }
}
