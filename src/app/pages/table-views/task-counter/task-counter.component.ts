import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import { FetchTaskCounterGQL } from '../../../graphql/tableViews.graphql-gen';
import { catchError, map, tap } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'task-counter',
  templateUrl: './task-counter.component.html',
})
export class TaskCounterComponent implements OnInit {
  isLoading = false;
  fetchTable$: Observable<any>;

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
    //
  }

  resetForm(): void {
    this.filterForm.reset({
      module: '',
      timeRanger: '',
    });
  }

  onSubmit(): void {
    if (this.filterForm.invalid || this.isLoading) return;
    const selectedDate = this.filterForm.get('timeRange').value;
    const startDate = new Date(selectedDate.setHours(0, 0, 0, 0)).toISOString();
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
          return res.data.fetchTaskCounter.map((element) => {
            const result = { ...element };
            result['total'] = element.taskCounter.reduce(
              (acc, curr) => acc + curr
            );
            return result;
          });
        }),
        catchError((error) => {
          this.isLoading = false;
          return error;
        })
      );
  }

  // table setting
}
