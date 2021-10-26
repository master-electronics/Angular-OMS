import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../../shared/services/common.service';
import {
  FetchEventLogGQL,
  FetchUserInfoGQL,
} from '../../../graphql/tableViews.graphql-gen';
import { filter, map } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { ITNBarcodeRegex, OrderBarcodeRegex } from 'src/app/shared/dataRegex';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute,
    private fetchUser: FetchUserInfoGQL,
    private fetchEventLog: FetchEventLogGQL
  ) {
    this.commonService.changeNavbar('User Event Logs');
  }

  filterForm = this.fb.group({
    user: [''],
    module: [''],
    target: ['', [Validators.pattern(OrderBarcodeRegex)]],
    subTarget: ['', [Validators.pattern(ITNBarcodeRegex)]],
    timeRange: [''],
  });

  fetchUser$;
  ngOnInit(): void {
    this.fetchUser$ = this.fetchUser
      .fetch()
      .pipe(map((res) => res.data.findUserInfo));
    const urlParams = { ...this.route.snapshot.queryParams };
    if (urlParams.ITN) {
      this.filterForm.get('subTarget').setValue(urlParams.ITN);
      this.onSubmit();
    }
  }

  resetForm(): void {
    this.filterForm.reset({
      user: '',
      module: '',
      target: '',
      subTarget: '',
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
    const target = this.filterForm.get('target').value.toUpperCase();
    const subTarget = this.filterForm.get('subTarget').value.toUpperCase();
    let limit = 200;
    if (user) {
      eventLog['UserID'] = user;
      limit = 500;
    }
    if (module) {
      eventLog['Module'] = module;
      limit = 500;
    }
    if (target) {
      eventLog['Target'] = target;
      limit = null;
    }
    if (subTarget) {
      eventLog['SubTarget'] = subTarget;
      limit = null;
    }
    if (this.startDate) {
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
            if (log.SubTarget) {
              result['ITNList'] = log.SubTarget.split(',');
            } else {
              result['ITNList'] = '';
            }
            return result;
          });
        })
      );
  }

  onChange(result: Date[]): void {
    this.startDate = result[0]?.toISOString();
    this.endDate = result[1]?.toISOString();
  }

  // table setting:
  fetchTable$;
  tableData = [];

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
}
null;
