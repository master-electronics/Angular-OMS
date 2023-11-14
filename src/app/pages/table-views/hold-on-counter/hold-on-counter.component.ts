import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import { NavbarTitleService } from '../../../shared/services/navbar-title.service';
import { catchError, map, tap } from 'rxjs/operators';
import {
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FetchHoldOnCounterGQL } from 'src/app/graphql/tableViews.graphql-gen';
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';

interface tableData {
  User: string;
  total: number;
  detail: number[];
}

@Component({
  selector: 'hold-on-counter',
  templateUrl: './hold-on-counter.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzGridModule,
    NzDatePickerModule,
    NzButtonModule,
    NzWaveModule,
    NzTableModule,
    NgFor,
    RouterLink,
    AsyncPipe,
  ],
})
export class HoldOnCounterComponent implements OnInit {
  isLoading = false;
  fetchTable$;
  startDate: string;

  constructor(
    private _title: NavbarTitleService,
    private fb: UntypedFormBuilder,
    private fetchHoldOnCounter: FetchHoldOnCounterGQL
  ) {
    this._title.update('Hold On Counting');
  }

  filterForm = this.fb.group({
    timeRange: ['', [Validators.required]],
  });

  ngOnInit(): void {
    //
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
    this.fetchTable$ = this.fetchHoldOnCounter
      .fetch(
        {
          startDate: startDate,
          endDate: endDate,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          this.isLoading = false;
          if (!res.data.fetchHoldOnCounter) return null;
          let totalForAll = 0;
          const sumForAll = new Array(9).fill(0);
          // iterate each user record
          const tableData: tableData[] = res.data.fetchHoldOnCounter
            .filter((element) => element !== null)
            .map((element) => {
              sumForAll[0] += element.detail[0];
              const total = element.detail.reduce((acc, curr, index) => {
                sumForAll[index] += curr;
                return acc + curr;
              });
              totalForAll += total;
              return {
                User: element.User,
                total,
                detail: element.detail,
              };
            });
          // Insert Total record at the end.
          tableData.push({
            User: 'Total',
            total: totalForAll,
            detail: sumForAll,
          });
          return tableData;
        }),
        tap((res) => {
          const tmp = res.map((node) => ({
            User: node.User,
            total: node.total,
            '31 Short Quantity': node.detail[0],
            '32 Damaged': node.detail[1],
            '33 Repackaging': node.detail[2],
            '34 Wrong Parts': node.detail[3],
            '35 Verify Quantity': node.detail[4],
            '36 Mixed Parts': node.detail[5],
            '37 Part Number Verification': node.detail[6],
            '38 Kit Set': node.detail[7],
            '39 Over Shipment': node.detail[8],
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
    {
      title: '31 Short Quantity',
      compare: (a: tableData, b: tableData): number => a.total - b.total,
    },
    {
      title: '32 Damaged',
      compare: (a: tableData, b: tableData): number => a.total - b.total,
    },
    {
      title: '33 Repackaging',
      compare: (a: tableData, b: tableData): number => a.total - b.total,
    },
    {
      title: '34 Wrong Parts',
      compare: (a: tableData, b: tableData): number => a.total - b.total,
    },
    {
      title: '35 Verify Quantity',
      compare: (a: tableData, b: tableData): number => a.total - b.total,
    },
    {
      title: '36 Mixed Parts',
      compare: (a: tableData, b: tableData): number => a.total - b.total,
    },
    {
      title: '37 Part Number Verification',
      compare: (a: tableData, b: tableData): number => a.total - b.total,
    },
    {
      title: '38 Kit Set',
      compare: (a: tableData, b: tableData): number => a.total - b.total,
    },
    {
      title: '39 Over Shipment',
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
