import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import {} from '../../../graphql/tableViews.graphql-gen';
import { map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'task-counter',
  templateUrl: './task-counter.component.html',
})
export class TaskCounterComponent implements OnInit {
  isLoading = false;
  fetchUser$ = new Observable();
  fetchTable$ = new Observable();

  constructor(private commonService: CommonService, private fb: FormBuilder) {
    this.commonService.changeNavbar('Task Counting');
  }

  filterForm = this.fb.group({
    user: [''],
    timeRange: [''],
  });

  ngOnInit(): void {
    //
  }

  resetForm(): void {
    this.filterForm.reset({
      user: '',
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
    // this.fetchTable$ = this.fetchTaskCounter
    //   .fetch(
    //     {
    //       UserInfo: userInfo,
    //       startDate: this.startDate,
    //       endDate: this.endDate,
    //     },
    //     { fetchPolicy: 'network-only' }
    //   )
    //   .pipe(
    //     map((res) => {
    //       this.isLoading = false;
    //       return res.data.fetchTaskCounting;
    //     })
    //   );
  }
}
