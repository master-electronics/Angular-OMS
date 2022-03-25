import { Component, OnInit } from '@angular/core';

import * as XLSX from 'xlsx';
import { CommonService } from '../../../shared/services/common.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FetchItnLifecycleGQL } from 'src/app/graphql/tableViews.graphql-gen';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'itn-lifecycle',
  templateUrl: './itn-lifecycle.component.html',
})
export class ITNLifecycleComponent implements OnInit {
  isLoading = false;
  startDate: string;
  fetchTable$;
  tableData = [];
  timeformat = {};

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private _fetchITNLife: FetchItnLifecycleGQL
  ) {
    this.commonService.changeNavbar('ITN Lifecycle');
  }

  filterForm = this.fb.group({
    timeRange: ['', [Validators.required]],
  });

  ngOnInit(): void {
    //
  }

  resetForm(): void {
    this.filterForm.reset({
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
    this.fetchTable$ = this._fetchITNLife
      .fetch({ startDate, endDate }, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          this.isLoading = false;
          this.tableData = res.data.fetchITNLifecycle.map((item) => {
            const result = { ...item };
            if (item.agDone && item.agStart) {
              result.agStart = this.timeFormating(item.agStart);
              result.agDone = this.timeFormating(item.agDone);
              result['agElapsed'] =
                Date.parse(item.agDone) - Date.parse(item.agStart);
            }
            if (item.pickStart && item.pickDone) {
              result['pickElapsed'] =
                Date.parse(item.pickDone) - Date.parse(item.pickStart);
            }
            if (item.qcDone && item.qcStart) {
              result['qcElapsed'] =
                Date.parse(item.qcDone) - Date.parse(item.qcStart);
            }
            return result;
          });
        }),
        catchError((error) => {
          this.isLoading = false;
          return error;
        })
      );
  }

  timeFormating(time: string): string {
    const date = new Date(Number(time));
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  exportexcel(): void {
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `${this.startDate.substring(0, 10)}.xlsx`);
  }
}
