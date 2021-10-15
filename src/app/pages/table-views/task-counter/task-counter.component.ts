import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import {
  FetchTaskCounterGQL,
  FetchUserInfoGQL,
} from '../../../graphql/tableViews.graphql-gen';
import { map } from 'rxjs/operators';
import { NzTableFilterFn, NzTableFilterList } from 'ng-zorro-antd/table';
import { FormBuilder } from '@angular/forms';

interface DataItem {
  User: string;
  AgIn: number;
  AgOut: number;
  QC: number;
}

interface ColumnItem {
  name: string;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<DataItem> | null;
}

@Component({
  selector: 'task-counter',
  templateUrl: './task-counter.component.html',
})
export class TaskCounterComponent implements OnInit {
  isLoading = false;
  fetchUser$: Observable<any>;
  fetchTable$: Observable<any>;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private fetchUser: FetchUserInfoGQL,
    private fetchTaskCounter: FetchTaskCounterGQL
  ) {
    this.commonService.changeNavbar('Task Counting');
  }

  filterForm = this.fb.group({
    module: [''],
    timeRange: [''],
  });

  ngOnInit(): void {
    this.fetchUser$ = this.fetchUser
      .fetch()
      .pipe(map((res) => res.data.findUserInfo));
  }

  resetForm(): void {
    this.filterForm.reset({
      module: '',
      timeRanger: '',
    });
    this.startDate = '';
    this.endDate = '';
  }

  private startDate;
  private endDate;
  onChange(result: Date[]): void {
    this.startDate = result[0]?.toISOString();
    this.endDate = result[1]?.toISOString();
    console.log(this.startDate);
    console.log(this.endDate);
  }

  onSubmit(): void {
    if (this.filterForm.invalid || this.isLoading) {
      return;
    }
    // prepare query data then send
    const userInfo = {};
    const user = this.filterForm.get('user').value;
    if (user) userInfo['_id'] = user;
    this.isLoading = true;
    this.fetchTable$ = this.fetchTaskCounter
      .fetch(
        {
          UserInfo: userInfo,
          startDate: this.startDate,
          endDate: this.endDate,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          this.isLoading = false;
          return res.data.fetchTaskCounting;
        })
      );
  }
}
