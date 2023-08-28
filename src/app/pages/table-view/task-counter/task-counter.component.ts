import { Component, OnInit } from '@angular/core';
import { NavbarTitleService } from '../../../shared/services/navbar-title.service';
import { FetchTaskCounterGQL } from '../../../graphql/tableView.graphql-gen';
import { catchError, map } from 'rxjs/operators';
import {
  UntypedFormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableViewComponent } from 'src/app/shared/ui/table-view.component';
import * as XLSX from 'xlsx';

interface tableData {
  User: string;
  total: number;
  taskCounter: number[];
}

@Component({
  selector: 'task-counter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TableViewComponent],
  template: `
    <div class="container mx-auto px-4 py-4">
      <table-view
        [listOfColumn]="listOfColumn"
        [listOfData]="fetchTable$ | async"
      ></table-view>
    </div>
  `,
})
export class TaskCounterComponent implements OnInit {
  public fetchTable$;
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

  // table setting
  public listOfColumn = [
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
    if (this.filterForm.invalid) return;
    const selectedDate = this.filterForm.get('timeRange').value;
    const startDate = new Date(selectedDate.setHours(0, 0, 0, 0)).toISOString();
    this.startDate = startDate;
    const endDate = new Date(
      selectedDate.setHours(23, 59, 59, 999)
    ).toISOString();

    // prepare query data then send
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
        catchError((error) => {
          return error;
        })
      );
  }

  exportexcel(): void {
    /* table id is passed over here */
    const element = document.getElementById('table-view');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(
      wb,
      `${this.filterForm
        .get('EventType')
        .value.replace(' ', '')}${this.startDate.substring(0, 10)}.xlsx`
    );
  }
}
