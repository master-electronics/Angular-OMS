import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import { map, tap } from 'rxjs';
import {
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
    timeRange: [[]],
    events: [[]],
  });

  constructor(
    private _route: ActivatedRoute,
    private _log: FetchEventLogGQL,
    private _fb: NonNullableFormBuilder,
    private _fetchUser: FetchUserInfoGQL,
    private _fetchEvents: FetchEventTypeGQL,
    public server: EventLogService
  ) {
    this.defaultFilter.valueChanges
      .pipe(
        takeUntilDestroyed(),
        map((res) => {
          if (res.events) {
            this.formData.setJsonForm(this.server.setFilter(res.events));
          }
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

    this.data$ = this._log
      .fetch({
        Log,
        limit: 500,
        UserName: this.defaultFilter.value.user,
        eventIdList: this.defaultFilter.value.events,
        timeFrame: this.defaultFilter.value.timeRange,
      })
      .pipe(
        map((res) => {
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
        })
      );
  }

  // excel export
  public ws: XLSX.WorkSheet;
  exportexcel(): void {
    /* table id is passed over here */
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, this.ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `${this.defaultFilter.value.timeRange[0]}.xlsx`);
  }
}
