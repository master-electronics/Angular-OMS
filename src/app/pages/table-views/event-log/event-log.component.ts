import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../../shared/services/common.service';
import {
  FetchUserEventLogGQL,
  FetchUserEventsGQL,
  FetchUserInfoGQL,
} from '../../../graphql/tableViews.graphql-gen';
import { last, map, tap } from 'rxjs/operators';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ITNBarcodeRegex, OrderBarcodeRegex } from 'src/app/shared/dataRegex';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'event-log',
  templateUrl: './event-log.component.html',
})
export class EventLogComponent implements OnInit {
  public isLoading = false;
  public urlParams;
  public startDate;
  public endDate;
  constructor(
    private fb: UntypedFormBuilder,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private fetchUser: FetchUserInfoGQL,
    private fetchEventLog: FetchUserEventLogGQL,
    private _fetchUserEvents: FetchUserEventsGQL
  ) {
    this.commonService.changeNavbar('User Event Logs');
  }

  filterForm = this.fb.group({
    user: [''],
    order: ['', [Validators.pattern(OrderBarcodeRegex)]],
    ITN: ['', [Validators.pattern(ITNBarcodeRegex)]],
    timeRange: [''],
    events: [[]],
  });

  public fetchUser$: Observable<{ _id: number; Name: string }[]> = null;
  public listOfEvent$: Observable<
    {
      label: string;
      value: string;
      groupLabel: string;
    }[]
  >;
  ngOnInit(): void {
    this.fetchUser$ = this.fetchUser
      .fetch()
      .pipe(map((res) => res.data.findUserInfos));
    this.urlParams = { ...this.route.snapshot.queryParams };
    if (this.urlParams.ITN) {
      this.filterForm.get('ITN').setValue(this.urlParams.ITN);
      this.onSubmit();
    }
    if (this.urlParams.UserName) {
      this.filterForm.get('user').setValue(this.urlParams.UserName);
    }

    this.listOfEvent$ = this._fetchUserEvents.fetch().pipe(
      map((res) => {
        return res.data.findUserEvents.map((res) => ({
          label: res.Module + '-' + res.Event,
          value: res._id,
          groupLabel: res.Module,
        }));
      })
    );
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

  public fetchTable$: Observable<any>;
  onSubmit(): void {
    if (this.filterForm.invalid || this.isLoading) {
      return;
    }
    const eventLog = {};
    const userName =
      this.urlParams.UserName || this.filterForm.get('user').value;
    const events = this.filterForm
      .get('events')
      .value.map((res) => Number(res));
    const order = this.filterForm.get('order').value.toUpperCase();
    const ITN = this.filterForm.get('ITN').value.toUpperCase();
    let limit = 200;
    if (userName) {
      eventLog['UserName'] = userName;
      limit = 500;
    }
    if (events) {
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
    this.fetchTable$ = this.fetchEventLog
      .fetch(
        {
          limit: limit,
          UserEventLog: eventLog,
          Modules: events,
          startDate: this.startDate,
          endDate: this.endDate,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          return res.data.findUserEventLogs.map((log) => {
            const result = {
              ...log,
              Module: log.UserEvent.Module,
              Event: log.UserEvent.Event,
            };
            result.DateTime = new Date(Number(log.DateTime)).toLocaleString();
            delete result.UserEvent;
            delete result.__typename;
            return result;
          });
        }),
        tap((res) => {
          this.ws = XLSX.utils.json_to_sheet(res);
        })
      );
  }

  onChange(result: Date[]): void {
    this.startDate = result[0]?.toISOString();
    this.endDate = result[1]?.toISOString();
  }

  // table setting:

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
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
