import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../../shared/services/common.service';
import {
  FetchEventLogGQL,
  FetchUserInfoGQL,
} from '../../../graphql/tableViews.graphql-gen';
import { map } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { OrderBarcodeRegex } from 'src/app/shared/dataRegex';

@Component({
  selector: 'user-event-log',
  templateUrl: './user-event-log.component.html',
})
export class UserEventLogComponent implements OnInit {
  isLoading = false;
  startDate;
  endDate;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private fetchUser: FetchUserInfoGQL,
    private fetchEventLog: FetchEventLogGQL
  ) {
    this.commonService.changeNavbar('User Event Logs');
  }

  filterForm = this.fb.group({
    user: [''],
    module: [''],
    target: ['', [Validators.pattern(OrderBarcodeRegex)]],
    timeRange: [''],
  });

  fetchUser$;
  ngOnInit(): void {
    this.fetchUser$ = this.fetchUser
      .fetch()
      .pipe(map((res) => res.data.findUserInfo));
  }

  resetForm(): void {
    this.filterForm.setValue({
      user: '',
      module: '',
      target: '',
      timeRange: '',
    });
    this.startDate = null;
    this.endDate = null;
  }

  onSubmit(): void {
    if (this.filterForm.invalid || this.isLoading) {
      return;
    }
    const eventLog = {};
    const user = this.filterForm.get('user').value;
    const module = this.filterForm.get('module').value;
    const target = this.filterForm.get('target').value;
    let limit = 200;
    if (user) {
      eventLog['UserID'] = user;
    }
    if (module) {
      eventLog['Module'] = module;
    }
    if (target) {
      eventLog['Target'] = target;
    }
    if (Object.keys(eventLog).length) {
      limit = null;
    }
    this.isLoading = true;
    this.fetchTable$ = this.fetchEventLog
      .fetch(
        {
          limit: limit,
          EventLog: eventLog,
          startDate: this.startDate,
          endDate: this.endDate,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          this.isLoading = false;
          this.tableData = res.data.findEventLog.map((log) => {
            const result = { ...log };
            const tmp = new Date(Number(log.DateTime));
            result.DateTime = tmp.toLocaleString();
            return result;
          });
        })
      );
  }

  onChange(result: Date[]): void {
    this.startDate = result[0]?.toISOString();
    this.endDate = result[1]?.toISOString();
    console.log(this.startDate);
    console.log(this.endDate);
  }

  // table setting:
  fetchTable$;
  tableData = [];
}
