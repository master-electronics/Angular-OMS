import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../../shared/services/common.service';
import {
  FetchUserEventLogGQL,
  FetchUserInfoGQL,
} from '../../../graphql/tableViews.graphql-gen';
import { map } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { ITNBarcodeRegex, OrderBarcodeRegex } from 'src/app/shared/dataRegex';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'event-log',
  templateUrl: './event-log.component.html',
})
export class EventLogComponent implements OnInit {
  isLoading = false;
  urlParams;
  startDate;
  endDate;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private fetchUser: FetchUserInfoGQL,
    private fetchEventLog: FetchUserEventLogGQL
  ) {
    this.commonService.changeNavbar('User Event Logs');
  }

  filterForm = this.fb.group({
    user: [''],
    module: [''],
    order: ['', [Validators.pattern(OrderBarcodeRegex)]],
    ITN: ['', [Validators.pattern(ITNBarcodeRegex)]],
    timeRange: [''],
  });

  fetchUser$;
  ngOnInit(): void {
    this.fetchUser$ = this.fetchUser
      .fetch()
      .pipe(map((res) => res.data.findUserInfo));
    this.urlParams = { ...this.route.snapshot.queryParams };
    if (this.urlParams.ITN) {
      this.filterForm.get('ITN').setValue(this.urlParams.ITN);
      this.onSubmit();
    }
    if (this.urlParams.UserID) {
      this.onSubmit();
    }
  }

  resetForm(): void {
    this.filterForm.reset({
      user: '',
      module: '',
      order: '',
      ITN: '',
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
    const user =
      Number(this.urlParams.UserID) || this.filterForm.get('user').value;
    const module = Number(this.filterForm.get('module').value);
    const order = this.filterForm.get('order').value.toUpperCase();
    const ITN = this.filterForm.get('ITN').value.toUpperCase();
    let limit = 200;
    if (user) {
      eventLog['UserID'] = user;
      limit = 500;
    }
    if (module) {
      limit = 500;
    }
    if (order) {
      eventLog['OrderNumber'] = order.substring(0, 6);
      eventLog['NOSINumber'] = order.substring(7, 9);
      limit = null;
    }
    if (ITN) {
      eventLog['InventoryTrackingNumber'] = ITN;
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
          UserEventLog: eventLog,
          Module: module,
          startDate: this.startDate,
          endDate: this.endDate,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          this.isLoading = false;
          this.tableData = res.data.findUserEventLogs.map((log) => {
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
