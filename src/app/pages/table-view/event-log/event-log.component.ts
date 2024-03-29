import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import {
  debounceTime,
  filter,
  map,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  FetchCommonvariablesForLogsGQL,
  FetchEventLogGQL,
  FetchEventTypeGQL,
} from 'src/app/graphql/tableView.graphql-gen';
import { JsonFormComponent } from 'src/app/shared/ui/input/json-form/json-form.component';
import { JsonFormService } from 'src/app/shared/ui/input/json-form/json-form.service';
import { TableViewComponent } from 'src/app/shared/ui/table-view.component';
import { SearchFilterComponent } from './search-filter.component';
import { FetchUserInfoGQL } from 'src/app/graphql/tableViews.graphql-gen';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventLogService } from '../data-access/event-logs.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TableViewComponent,
    JsonFormComponent,
    SearchFilterComponent,
  ],
  template: `
    <search-filter
      [formGroup]="defaultFilter"
      [userList]="server.filterUser()"
      [listOfEvent]="server.listOfEvent()"
      [listOfFilter]="server.listOfFilter()"
      (reset)="reset()"
      (excel)="exportexcel()"
      (addUser)="addUser($event)"
    ></search-filter>
    <app-json-form
      [jsonFormData]="this.formData.jsonForm()"
      (formSubmit)="onSubmit($event)"
    ></app-json-form>
    <div class="px-1 py-4">
      <table-view [data]="data$ | async"> </table-view>
    </div>
  `,
})
export class EventLogComponent implements OnInit {
  public data$;
  public defaultFilter = this._fb.group({
    user: [''],
    timeRange: [],
    events: [],
    filter: [],
  });

  constructor(
    private _route: ActivatedRoute,
    private _log: FetchEventLogGQL,
    private _fb: NonNullableFormBuilder,
    private _fetchUser: FetchUserInfoGQL,
    private _fetchEvents: FetchEventTypeGQL,
    private _commonVariables: FetchCommonvariablesForLogsGQL,
    public server: EventLogService
  ) {
    // Form value change.
    const formChange$ = this.defaultFilter.valueChanges.pipe(
      takeUntilDestroyed(),
      startWith(null),
      pairwise(),
      shareReplay()
    );

    // when the events input field change, insert Filter stirng to filter input
    formChange$
      .pipe(
        takeUntilDestroyed(),
        debounceTime(500),
        filter(
          (res) => res[0]?.events?.toString() !== res[1]?.events?.toString()
        ),
        switchMap((res) => {
          return this._commonVariables.fetch({ events: res[1].events });
        }),
        map((res) => {
          return res.data.fetchCommonvariablesForLogs.map((title) => ({
            label: title,
            value: title,
          }));
        }),
        map((res) => {
          this.server.setListOfFilter(res);
        })
      )
      .subscribe();

    // when the filter input change, update jsonForm input field;
    formChange$
      .pipe(
        takeUntilDestroyed(),
        filter(
          (res) => res[0]?.filter?.toString() !== res[1]?.filter?.toString()
        ),
        map((res) => {
          this.formData.setJsonForm(this.server.setFilterList(res[1].filter));
        })
      )
      .subscribe();

    this._fetchUser
      .fetch()
      .pipe(
        takeUntilDestroyed(),
        map((res) => res.data.findUserInfos),
        tap((res) => this.server.setFilterUser(res))
      )
      .subscribe();

    this._fetchEvents
      .fetch()
      .pipe(
        takeUntilDestroyed(),
        map((res) => {
          return res.data.findEventType
            .map((res) => ({
              label: `${res.Event}-${res._id}`,
              value: res._id,
              groupLabel: res.Module,
            }))
            .sort(function (a, b) {
              return a.value - b.value;
            });
        }),
        tap((res) => this.server.setListOfEvent(res))
      )
      .subscribe();
  }

  formData = inject(JsonFormService);

  ngOnInit(): void {
    const urlParams = { ...this._route.snapshot.queryParams };
    if (urlParams.UserName) {
      this.defaultFilter.get('user').setValue(urlParams.UserName);
    }
  }

  addUser(user: string): void {
    this.server.insertUserToFilterUser({ _id: -1, Name: user });
    this.defaultFilter.get('user').setValue(user);
  }

  onSubmit(output): void {
    let Log = '';
    if (Object.keys(output).length !== 0) {
      Log = JSON.stringify(output);
    }
    let timeFrame;
    if (this.defaultFilter.value.timeRange) {
      timeFrame = [
        this.defaultFilter.value.timeRange[0]
          .setUTCHours(0, 0, 0, 0)
          .toString(),
        this.defaultFilter.value.timeRange[1]
          .setUTCHours(23, 59, 59, 999)
          .toString(),
      ];
    }
    this.data$ = this._log
      .fetch({
        Log,
        limit: 500,
        UserName: this.defaultFilter.value.user,
        eventIdList: this.defaultFilter.value.events,
        timeFrame,
      })
      .pipe(
        map((res) => {
          if (!res.data.findEventLogs) {
            return null;
          }
          const keySet = new Set<string>();
          const result = res.data.findEventLogs.map((res) => {
            const log = JSON.parse(res.Log);
            Object.entries(log).map((key) => keySet.add(key[0]));
            return {
              Name: res.UserName,
              Type: res.Module + ' | ' + res.Event,
              Time: res.CreateTime,
              Log: JSON.parse(res.Log),
            };
          });
          const keyArray = [...keySet];
          return result.map((row) => {
            const log = row.Log;
            keyArray.map((key) => {
              row[key] = log[key];
            });
            delete row.Log;
            return row;
          });
        }),
        // save table date to excel
        tap((res) => {
          this.ws = XLSX.utils.json_to_sheet(res);
        })
      );
  }

  reset(): void {
    this.formData.setJsonForm(null);
  }

  // excel export
  public ws: XLSX.WorkSheet;
  exportexcel(): void {
    /* table id is passed over here */
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, this.ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `Logs.xlsx`);
  }
}
