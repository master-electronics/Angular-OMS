import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import { CommonService } from '../../../shared/services/common.service';
import { catchError, map } from 'rxjs/operators';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { FetchHoldOnCounterGQL } from 'src/app/graphql/tableViews.graphql-gen';

interface tableData {
  User: string;
  total: number;
  detail: number[];
}

@Component({
  selector: 'hold-on-counter',
  templateUrl: './hold-on-counter.component.html',
})
export class HoldOnCounterComponent implements OnInit {
  isLoading = false;
  fetchTable$;
  startDate: string;

  constructor(
    private commonService: CommonService,
    private fb: UntypedFormBuilder,
    private fetchHoldOnCounter: FetchHoldOnCounterGQL
  ) {
    this.commonService.changeNavbar('Hold On Counting');
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

  exportexcel(): void {
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `Hold-On${this.startDate.substring(0, 10)}.xlsx`);
  }
}
