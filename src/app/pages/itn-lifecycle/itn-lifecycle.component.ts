import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { NavbarTitleService } from '../../shared/services/navbar-title.service';
import {
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  FetchItnLifecycleGQL,
  FindItnTemplateGQL,
  FindItnColumnsGQL,
} from 'src/app/graphql/tableViews.graphql-gen';
import { catchError, map } from 'rxjs/operators';
import { Column, Template, LevelLimit } from './itn-lifecycle.server';
import { Subscription } from 'rxjs';

import {
  FindItnTemplatesGQL,
  FetchItnLifecycleDrillDownGQL,
  FetchItnLifecycleDrillDownRowsGQL,
} from 'src/app/graphql/tableViews.graphql-gen';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TemplateSettings } from './template-settings.component';
import { NgFor, NgIf, NgClass, AsyncPipe } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Component({
  selector: 'itn-lifecycle',
  templateUrl: './itn-lifecycle.component.html',
  styleUrls: ['./itn-lifecycle.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzGridModule,
    NzDatePickerModule,
    NzSelectModule,
    NgFor,
    TemplateSettings,
    NzButtonModule,
    NzWaveModule,
    NgIf,
    NzIconModule,
    NzSpinModule,
    NzTableModule,
    NzDropDownModule,
    NzInputModule,
    NgClass,
    NzModalModule,
    AsyncPipe,
  ],
})
export class ITNLifecycleComponent implements OnInit {
  calendarStartDate: Date;
  calendarEndDate: Date;
  defaultDate: Date[];
  isLoading = false;
  dateRange: [];
  startDate: string;
  endDate: string;
  userId: string;
  fetchTable$;
  tableData = [];
  tableDataDisplay = [];
  drilldownTableData = [];
  drilldownTableData2 = [];
  timeformat = {};
  columns: Column[];
  private subscription = new Subscription();
  private templateList = new Subscription();
  private selTempSub = new Subscription();
  private columnsSubscription = new Subscription();
  private drillDownSubscription = new Subscription();
  private drillDownRowsSubscription = new Subscription();
  columnsVisible = [];
  columnsVisible2 = [];
  drillDownColumns = [];
  columnsVisibleId = '';
  preColSpan = 0;
  pickColSpan = 0;
  qcColSpan = 0;
  agColSpan = 0;
  pullingColSpan = 0;
  dropoffColSpan = 0;
  postColSpan = 0;
  templateNames = [];
  templates: Template[];
  selectedTemplate: Template;
  templateId: number;
  templateNameValue: string;
  templateIdName: string;
  limits: LevelLimit[];
  defaultPaginationValue: string;
  customPaginationValue: string;
  paging: boolean;
  paginationValues: number[];
  pageSize: number;
  pageNumber: number;
  screenWidth: any;
  screenHeight: any;
  drilldownHeight: any;
  searchVisible = false;
  searchActive = true;
  searchValue = '';
  filters: { filterColumn: string; filterValue: string }[];
  drilldownVisible: boolean;
  drilldownTitle: string;
  drilldownBodyStyle;
  singleDate;
  testValue;

  disabledDate = (endValue: Date): boolean => {
    if (!this.calendarStartDate && !this.calendarEndDate) {
      return false;
    }

    if (!this.calendarEndDate) {
      return (
        endValue.getTime() <
          this.adjustDate(this.calendarStartDate, -7).getTime() ||
        endValue.getTime() >
          this.adjustDate(this.calendarStartDate, 6).getTime()
      );
    }

    return (
      endValue.getTime() <
        this.adjustDate(this.calendarEndDate, -7).getTime() ||
      endValue.getTime() > this.adjustDate(this.calendarStartDate, 6).getTime()
    );
  };

  adjustDate(date, days) {
    const nDate = new Date(date.getTime());
    nDate.setDate(nDate.getDate() + days);
    return nDate;
  }

  onDatePickerOpen(open: boolean): void {
    if (!open) {
      this.calendarStartDate = null;
      this.calendarEndDate = null;
    } else {
      const range: Date[] = this.filterForm.get('testDateRange').value;
      if (range) {
        if (range.length >= 1) {
          this.calendarStartDate = range[0];
        }

        if (range.length == 2) {
          this.calendarEndDate = range[1];
        }
      }
    }
  }

  constructor(
    private _title: NavbarTitleService,
    private fb: UntypedFormBuilder,
    private _fetchITNLife: FetchItnLifecycleGQL,
    private _fetchDrilldown: FetchItnLifecycleDrillDownGQL,
    private _fetchDrillDownRows: FetchItnLifecycleDrillDownRowsGQL,
    private _findITNTemplates: FindItnTemplatesGQL,
    private _findITNTemplate: FindItnTemplateGQL,
    private _findITNColumns: FindItnColumnsGQL,
    private titleService: Title,
    private _userInfo: StorageUserInfoService
  ) {
    this._title.update('ITN Lifecycle');
    this.titleService.setTitle('ITN Lifecycle');
  }

  filterForm = this.fb.group({
    dateRangePicker: ['', [Validators.required]],
  });

  onCalendarChange(result: Array<Date | null>) {
    if (result) {
      if (result.length >= 1) {
        this.calendarStartDate = result[0];
        this.calendarEndDate = null;
      }

      if (result.length == 2) {
        this.calendarEndDate = result[1];
      }
    }
  }

  ngOnInit(): void {
    const sDate: Date = new Date(Date.now());
    const eDate: Date = new Date(Date.now());
    sDate.setDate(eDate.getDate() - 7);
    this.defaultDate = [];
    this.defaultDate.push(sDate);
    this.defaultDate.push(eDate);

    this.dateRange = [];
    this.drillDownColumns = [
      {
        name: 'Order',
        dataName: 'OrderNumber',
        width: '200px',
      },
      {
        name: 'NOSI',
        dataName: 'NOSINumber',
        width: '100px',
      },
      {
        name: 'Line',
        dataName: 'OrderLineNumber',
        width: '100px',
      },
      {
        name: 'ITN',
        dataName: 'InventoryTrackingNumber',
        width: '200px',
      },
      {
        name: 'Parent ITN',
        dataName: 'ParentITN',
        width: '200px',
      },
      {
        name: 'Event',
        dataName: 'Event',
        width: '200px',
      },
      {
        name: 'Module',
        dataName: 'Module',
        width: '100px',
      },
      {
        name: 'Date/Time',
        dataName: 'DateTime',
        width: '200px',
      },
      {
        name: 'User',
        dataName: 'Name',
        width: '200px',
      },
      {
        name: 'DC',
        dataName: 'DistributionCenter',
        width: '100px',
      },
      {
        name: 'Quantity',
        dataName: 'Quantity',
        width: '100px',
      },
      {
        name: 'Cust',
        dataName: 'CustomerNumber',
        width: '100px',
      },
      {
        name: 'Cust Tier',
        dataName: 'CustomerTier',
        width: '120px',
      },
      {
        name: 'Part',
        dataName: 'PrcNumber',
        width: '225px',
      },
      {
        name: 'Part Tier',
        dataName: 'ProductTier',
        width: '120px',
      },
      {
        name: 'Zone',
        dataName: 'Zone',
        width: '100px',
      },
      {
        name: 'WMSPriority',
        dataName: 'WMSPriority',
        width: '150px',
      },
      {
        name: 'Priority',
        dataName: 'Priority',
        width: '110px',
      },
      {
        name: 'Notes',
        dataName: 'Message',
        width: '300px',
      },
      {
        name: 'Shipment Method',
        dataName: 'ShipmentMethod',
        width: '200px',
      },
      {
        name: 'Shipment Description',
        dataName: 'ShipmentMethodDescription',
        width: '300px',
      },
      {
        name: 'Tracking #',
        dataName: 'TrackingNumber',
        width: '200px',
      },
    ];

    this.screenWidth = window.innerWidth + 'px';
    this.screenHeight = window.innerHeight - 300 + 'px';
    this.drilldownHeight = window.innerHeight - 300 - 100 + 'px';
    this.selectedTemplate = {};
    const userId = this._userInfo.idToken;
    this.userId = userId.toString();
    this.templateNames = [];
    this.templates = [];
    this.columns = [];
    this.paging = true;
    this.paginationValues = [100, 50, 1000, 500];
    this.paginationValues = this.paginationValues.sort((n1, n2) => n1 - n2);
    this.pageSize = 50;
    this.pageNumber = 1;
    this.filters = [];

    this.drilldownBodyStyle = { height: this.screenHeight };

    //Set up array of avaialbe columns
    //Get columns from ITNCOLUMNS db table
    this.columnsSubscription.add(
      this._findITNColumns
        .fetch({
          userId: Number(this.userId),
        })
        .subscribe(
          (res) => {
            for (let i = 0; i < res.data.findITNColumns.length; i++) {
              const column: Column = {
                name: res.data.findITNColumns[i].name,
                title: res.data.findITNColumns[i].title,
                dataName: res.data.findITNColumns[i].dataName,
                colSpan: res.data.findITNColumns[i].colSpan,
                position: res.data.findITNColumns[i].position,
                width: res.data.findITNColumns[i].width,
                eventGroup: res.data.findITNColumns[i].eventGroup,
                eventName: res.data.findITNColumns[i].eventName,
                searchable: res.data.findITNColumns[i].searchable,
                drilldown: res.data.findITNColumns[i].drilldown,
              };

              this.columns.push(column);
            }
          },
          (error) => {
            const err = error;
            console.log(err);
          }
        )
    );

    //Get templates for user
    this.templateList.add(
      this._findITNTemplates
        .fetch(
          {
            userId: Number(this.userId),
          },
          { fetchPolicy: 'network-only' }
        )
        .subscribe(
          (res) => {
            for (let i = 0; i < res.data.findITNTemplates.length; i++) {
              const template: Template = {
                name: res.data.findITNTemplates[i].TemplateName,
                id: res.data.findITNTemplates[i]._id,
              };
              this.templates.push(template);

              this.templateNames.push(
                res.data.findITNTemplates[i].TemplateName
              );

              if (res.data.findITNTemplates[i].DefaultTemplate) {
                this.templateIdName =
                  res.data.findITNTemplates[i]._id.toString() +
                  ',' +
                  res.data.findITNTemplates[i].TemplateName;
                this.templateId = res.data.findITNTemplates[i]._id;
                this.templateNameValue =
                  res.data.findITNTemplates[i].TemplateName;
                this.onTemplateChange(
                  this.templateId.toString() + ',' + this.templateNameValue
                );
              }
            }

            if (!this.templateId || this.templates.length < 1) {
              this.columnsVisible = [];
              this.columnsVisible2 = [];

              for (let x = 0; x < this.columns.length; x++) {
                this.columnsVisible.push({
                  name: this.columns[x].name,
                  title: this.columns[x].title,
                  dataName: this.columns[x].dataName,
                  width: this.columns[x].width,
                  eventGroup: this.columns[x].eventGroup,
                  eventName: this.columns[x].eventName,
                  searchVisible: false,
                  searchable: this.columns[x].searchable,
                  searchActive: false,
                  drilldown: this.columns[x].drilldown,
                  sortFn: (a: [], b: []): number =>
                    (a[this.columns[x].dataName]
                      ? a[this.columns[x].dataName].toString()
                      : ''
                    ).localeCompare(
                      b[this.columns[x].dataName]
                        ? b[this.columns[x].dataName].toString()
                        : ''
                    ),
                });
              }

              this.setColSpans();
            }
          },
          (error) => {
            const err = error;
            console.log(err);
          }
        )
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth + 'px';
    this.screenHeight = window.innerHeight - 300 + 'px';
    this.drilldownHeight = window.innerHeight - 300 - 100 + 'px';
  }

  //Clear search date
  resetForm(): void {
    this.filterForm.reset({
      dateRange: '',
    });
  }

  //Get records for search date
  onSubmit(): void {
    if (this.filterForm.invalid || this.isLoading) return;

    const startDate = new Date(
      new Date(
        this.filterForm.get('dateRangePicker').value[0].toString()
      ).setHours(0, 0, 0, 0)
    ).toISOString();

    const endDate = new Date(
      new Date(
        this.filterForm.get('dateRangePicker').value[1].toString()
      ).setHours(23, 59, 59, 999)
    ).toISOString();

    this.startDate = startDate;

    // prepare query data then send
    this.isLoading = true;
    this.fetchTable$ = this._fetchITNLife
      .fetch({ startDate, endDate }, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          this.isLoading = false;
          this.tableData = res.data.fetchITNLifecycle.map((item) => {
            const result = { ...item };
            result['PriorityDisplay'] = result.Priority ? 'Y' : 'N';
            result.ProductTier = result.ProductTier
              ? result.ProductTier.trim().toUpperCase()
              : '';
            result['OrderNOSI'] =
              (item.OrderNumber
                ? item.OrderNumber.trim().toUpperCase() + '-'
                : '') +
              (item.NOSINumber ? item.NOSINumber.trim().toUpperCase() : '');
            result.InventoryTrackingNumber = result.InventoryTrackingNumber
              ? result.InventoryTrackingNumber.trim().toUpperCase()
              : '';
            result.after_InventoryTrackingNumber =
              result.after_InventoryTrackingNumber
                ? result.after_InventoryTrackingNumber.trim().toUpperCase()
                : '';
            result.CustomerNumber = result.CustomerNumber
              ? result.CustomerNumber.trim().toUpperCase()
              : '';
            result.CustomerTier = result.CustomerTier
              ? result.CustomerTier.trim().toUpperCase()
              : '';
            result.TrackingNumber = result.TrackingNumber
              ? result.TrackingNumber.trim().toUpperCase()
              : '';
            result.ParentITN = result.ParentITN
              ? result.ParentITN.trim().toUpperCase()
              : '';
            result.PartNumber = result.PartNumber
              ? result.PartNumber.trim().toUpperCase()
              : '';
            result.ProductCode = result.ProductCode
              ? result.ProductCode.trim().toUpperCase()
              : '';
            result.lineAllocationUser = result.lineAllocationUser
              ? result.lineAllocationUser.trim()
              : '';
            result.pickStartUser = result.pickStartUser
              ? result.pickStartUser.trim()
              : '';
            result.pickDoneUser = result.pickDoneUser
              ? result.pickDoneUser.trim()
              : '';
            result.dropoffUser = result.dropoffUser
              ? result.dropoffUser.trim()
              : '';
            result.qcStartUser = result.qcStartUser
              ? result.qcStartUser.trim()
              : '';
            result.qcDoneUser = result.qcDoneUser
              ? result.qcDoneUser.trim()
              : '';
            result.agStartUser = result.agStartUser
              ? result.agStartUser.trim()
              : '';
            result.agDoneUser = result.agDoneUser
              ? result.agDoneUser.trim()
              : '';
            result.packLineUser = result.packLineUser
              ? result.packLineUser.trim()
              : '';

            if (item.lineAllocation) {
              result.lineAllocation = this.timeFormating(item.lineAllocation);
            }
            if (item.agStart) {
              result.agStart = this.timeFormating(item.agStart);
              result['agStartNum'] = Number(item.agStart);
            }
            if (item.agDone) {
              result.agDone = this.timeFormating(item.agDone);
              result['agDoneNum'] = Number(item.agDone);
            }
            if (item.PartNumber && item.ProductCode) {
              result['PartCode'] =
                item.PartNumber.trim().toUpperCase() +
                '-' +
                item.ProductCode.trim().toUpperCase();
            }
            if (item.agDone && item.agStart) {
              result['agElapsed'] = this.elapsedFormating(
                Number(item.agDone) - Number(item.agStart)
              );
            }
            if (item.pickStart) {
              result.pickStart = this.timeFormating(item.pickStart);
              result['pickStartNum'] = Number(item.pickStart);
            }
            if (item.pickDone) {
              result.pickDone = this.timeFormating(item.pickDone);
              result['pickDoneNum'] = Number(item.pickDone);
            }
            if (item.pickStart && item.pickDone) {
              result['pickElapsed'] = this.elapsedFormating(
                Number(item.pickDone) - Number(item.pickStart)
              );
              result['pickElapsedNum'] =
                Number(item.pickDone) - Number(item.pickStart);
            }
            if (item.qcStart) {
              result.qcStart = this.timeFormating(item.qcStart);
              result['qcStartNum'] = Number(item.qcStart);
            }
            if (item.qcDone) {
              result.qcDone = this.timeFormating(item.qcDone);
              result['qcDoneNum'] = Number(item.qcDone);
            }
            if (item.qcDone && item.qcStart) {
              result['qcElapsed'] = this.elapsedFormating(
                Number(item.qcDone) - Number(item.qcStart)
              );
            }
            if (item.pullingStart) {
              result.pullingStart = this.timeFormating(item.pullingStart);
              result['pullingStartNum'] = Number(item.pullingStart);
            }
            if (item.pullingDone) {
              result.pullingDone = this.timeFormating(item.pullingDone);
              result['pullingDoneNum'] = Number(item.pullingDone);
            }
            if (item.pullingStart && item.pullingDone) {
              result['pullingElapsed'] = this.elapsedFormating(
                Number(item.pullingDone) - Number(item.pullingStart)
              );
              result['pullingElapsedNum'] =
                Number(item.pullingDone) - Number(item.pullingStart);
            }
            if (item.pickStatus15) {
              result.pickStatus15 = this.timeFormating(item.pickStatus15);
            }
            if (item.qcStatus40) {
              result.qcStatus40 = this.timeFormating(item.qcStatus40);
            }
            if (item.qcStatus41) {
              result.qcStatus41 = this.timeFormating(item.qcStatus41);
            }
            if (item.dropoffLine) {
              result.dropoffLine = this.timeFormating(item.dropoffLine);
            }
            if (item.dropoffStart) {
              result.dropoffStart = this.timeFormating(item.dropoffStart);
              result['dropoffStartNum'] = Number(item.dropoffStart);
            }
            if (item.dropoffDone) {
              result.dropoffDone = this.timeFormating(item.dropoffDone);
              result['dropoffDoneNum'] = Number(item.dropoffDone);
            }
            if (item.dropoffStart && item.dropoffDone) {
              result['dropoffElapsed'] = this.elapsedFormating(
                Number(item.dropoffDone) - Number(item.dropoffStart)
              );
              result['dropoffElapsedNum'] =
                Number(item.dropoffDone) - Number(item.dropoffStart);
            }
            if (item.packStart) {
              result.packStart = this.timeFormating(item.packStart);
              result['packingStartNum'] = Number(item.packStart);
            }
            if (item.packLine) {
              result.packLine = this.timeFormating(item.packLine);
            }
            if (item.packReject) {
              result.packReject = this.timeFormating(item.packReject);
            }
            if (item.packDone) {
              result.packDone = this.timeFormating(item.packDone);
              result['packingDoneNum'] = Number(item.packDone);
            }
            if (item.packStart && item.packDone) {
              result['packingElapsed'] = this.elapsedFormating(
                Number(item.packDone) - Number(item.packStart)
              );
              result['packingElapsedNum'] =
                Number(item.packDone) - Number(item.packStart);
            }
            result['expand'] = false;
            result['OrderExpand'] = false;
            result['LineExpand'] = false;
            result['ITNExpand'] = false;

            return result;
          });

          this.tableDataDisplay = this.tableData;
          this.pageNumber = 1;
        }),
        catchError((error) => {
          this.isLoading = false;
          return error;
        })
      );
  }

  //add user entered filter info to the fitlers array
  //the array is used in the filterResults method to allow filtring on multiple columns
  setFilter(FilterColumn: [], FilterValue: string): void {
    FilterColumn['searchVisible'] = false;
    FilterColumn['searchActive'] = true;

    const index = this.filters
      .map((filter) => filter.filterColumn)
      .indexOf(FilterColumn['dataName']);

    if (index > -1) {
      this.filters[index] = {
        filterColumn: FilterColumn['dataName'],
        filterValue: FilterValue,
      };
    } else {
      this.filters.push({
        filterColumn: FilterColumn['dataName'],
        filterValue: FilterValue,
      });
    }

    this.filterResults();
    this.pageNumber = 1;
  }

  //remove user cleared filter from the filters array
  clearFilter(FilterColumn: []): void {
    FilterColumn['searchVisible'] = false;
    FilterColumn['searchActive'] = false;

    const index = this.filters
      .map((filter) => filter.filterColumn)
      .indexOf(FilterColumn['dataName']);

    if (index > -1) {
      this.filters.splice(index, 1);
    }

    this.filterResults();
    this.pageNumber = 1;
  }

  //apply all filters in the filters array to the dataset
  filterResults(): void {
    this.tableDataDisplay = this.tableData;

    for (let i = 0; i < this.filters.length; i++) {
      this.tableDataDisplay = this.tableDataDisplay.filter(
        (item) =>
          item[this.filters[i].filterColumn]
            .toString()
            .toUpperCase()
            .indexOf(this.filters[i].filterValue.toUpperCase()) !== -1
      );
    }
  }

  //handle when user open or closes a drilldown
  // expandChange(DataRow: [], column: string, checked: boolean): void {

  //   //close any open drilldowns
  //   for (let i = 0; i<this.tableDataDisplay.length; i++) {
  //     this.tableDataDisplay[i].expand = false;
  //     this.tableDataDisplay[i].OrderExpand = false;
  //     this.tableDataDisplay[i].LineExpand = false;
  //     this.tableDataDisplay[i].ITNExpand = false;
  //   }

  //   this.drilldownTableData = [];

  //   //if the user is opening a drilldown load data else clear data from arrays
  //   if (checked) {
  //     if (column == "Order") {
  //       this.loadDrillDown(DataRow["OrderNumber"], DataRow["NOSINumber"]);
  //     } else if (column == "Line") {
  //         this.loadDrillDown(DataRow["OrderNumber"], DataRow["NOSINumber"], Number(DataRow["OrderLineNumber"]));
  //     } else if (column == "ITN") {
  //         this.loadDrillDown(DataRow["OrderNumber"], DataRow["NOSINumber"], Number(DataRow["OrderLineNumber"]), DataRow["InventoryTrackingNumber"]);
  //     }

  //   } else {
  //     this.drilldownTableData = [];
  //     this.drilldownTableData2 = [];
  //   }

  //   DataRow["expand"] = checked;
  //   DataRow[column+"Expand"] = checked;
  // }

  onDrilldown(DataRow: [], column: string): void {
    this.drilldownTitle;
    this.drilldownTableData = [];
    this.drilldownTableData2 = [];

    if (column == 'Order') {
      this.drilldownTitle = 'Order ' + DataRow['OrderNOSI'];
      this.loadDrillDown(DataRow['OrderNumber'], DataRow['NOSINumber']);
    } else if (column == 'Line') {
      this.drilldownTitle =
        'Order ' +
        DataRow['OrderNOSI'] +
        ', Line ' +
        DataRow['OrderLineNumber'];
      this.loadDrillDown(
        DataRow['OrderNumber'],
        DataRow['NOSINumber'],
        Number(DataRow['OrderLineNumber'])
      );
    } else if (column == 'ITN') {
      this.drilldownTitle =
        'Order ' +
        DataRow['OrderNOSI'] +
        ', Line ' +
        DataRow['OrderLineNumber'] +
        ', ITN ' +
        DataRow['InventoryTrackingNumber'];
      this.loadDrillDown(
        DataRow['OrderNumber'],
        DataRow['NOSINumber'],
        Number(DataRow['OrderLineNumber']),
        DataRow['InventoryTrackingNumber']
      );
    }

    this.drilldownVisible = true;
  }

  //When settings screen is closed refresh display
  onModalClose(): void {
    if (this.templateId) {
      this.onTemplateChange(
        this.templateId.toString() + ',' + this.templateNameValue
      );
    }
  }

  //Return class to for setting the color of event cells based on template hightlight limits
  getClass(Start, Done, EventName): string {
    let c = 'none';

    if (EventName) {
      if (this.limits) {
        //find limits for current event
        const l = this.limits.find(
          (e) =>
            e.eventName.toLocaleLowerCase() == EventName.toLocaleLowerCase()
        );

        //if there's a start time but no end time and time between
        //start time and now is greater than the medium limit then set as High
        if (l) {
          if (Start && (!Done || Done == '')) {
            if (l.mediumLevelLimit > 0) {
              if (
                Math.round(Date.now()) - Number(Start) >
                Number(l.mediumLevelLimit)
              ) {
                c = 'high';
              }
            }
          } else {
            const elapsed = Number(Done) - Number(Start);

            //if a medium level is set for the template and the elapsed time has supassed it medium alert
            if (l.mediumLevelLimit > 0 && elapsed > l.mediumLevelLimit) {
              c = 'medium';
              //if a low level is set for the template and the elapsed time has supassed it low alert
            } else if (l.lowLevelLimit > 0 && elapsed > l.lowLevelLimit) {
              c = 'low';
            }
          }
        }
      }
    }

    return c;
  }

  //format the time to be user readable
  timeFormating(time: string): string {
    const date = new Date(Number(time));

    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = '' + date.getFullYear();
    let hours = '' + date.getHours();
    let minutes = '' + date.getMinutes();
    let seconds = '' + date.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;

    const formattedDate =
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds;

    return formattedDate;
  }

  //format the elapsed time into hours, minutes, and seconds
  elapsedFormating(elapsed: number): string {
    const hours = Math.floor(elapsed / 1000 / 60 / 60);
    const minutes = Math.floor((elapsed - hours * 60 * 60 * 1000) / 1000 / 60);
    const seconds = Math.floor((elapsed - minutes * 60 * 1000) / 1000);

    return (
      hours.toString().substring(0, 2).padStart(2, '0') +
      ':' +
      minutes.toString().substring(0, 2).padStart(2, '0') +
      ':' +
      seconds.toString().substring(0, 2).padStart(2, '0')
    );
  }

  //Export results to Excel
  exportexcel(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.paging = false;
    }, 1000);
    setTimeout(() => {
      /* table id is passed over here */
      const element = document.getElementById('excel-table');

      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      const date = new Date();
      const hours = '' + date.getHours();
      const minutes = '' + date.getMinutes();
      const seconds = '' + date.getSeconds();
      const timeStamp = hours + ':' + minutes + ':' + seconds;
      XLSX.writeFile(
        wb,
        `${this.startDate.substring(0, 10)}-${timeStamp}.xlsx`
      );
    }, 2000);

    setTimeout(() => {
      this.paging = true;
      this.isLoading = false;
    }, 2000);
  }

  //scroll data table to the top when changing pages
  scrollToTop(): void {
    const element = document.getElementById('excel-table');
    element.children[0].children[0].children[0].children[0].children[1].scrollTop = 0;
  }

  //Export drilldown results to Excel
  exportDrilldown(): void {
    this.isLoading = true;

    setTimeout(() => {
      //table element used as data source
      const element = document.getElementById('excel-drilldown-table');

      //Create worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      //Generate workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      //Save to file
      const date = new Date();
      const hours = '' + date.getHours();
      const minutes = '' + date.getMinutes();
      const seconds = '' + date.getSeconds();
      const timeStamp = hours + ':' + minutes + ':' + seconds;
      XLSX.writeFile(
        wb,
        `${this.startDate.substring(0, 10)}-${timeStamp}.xlsx`
      );
    }, 2000);

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  //Because the event name headers are in a separate row col spans need to be
  //dynamically adjusted based on which columns are selected for viewing
  setColSpans(): void {
    this.preColSpan = 0;
    this.pickColSpan = 0;
    this.qcColSpan = 0;
    this.agColSpan = 0;
    this.pullingColSpan = 0;
    this.dropoffColSpan = 0;
    this.postColSpan = 0;

    for (let i = 0; i < this.columns.length; i++) {
      if (this.columnsVisible.includes(this.columns[i].name)) {
        if (this.columns[i].colSpan == 'pre') {
          this.preColSpan++;
        } else if (this.columns[i].colSpan == 'pick') {
          this.pickColSpan++;
        } else if (this.columns[i].colSpan == 'qc') {
          this.qcColSpan++;
        } else if (this.columns[i].colSpan == 'ag') {
          this.agColSpan++;
        } else if (this.columns[i].colSpan == 'pulling') {
          this.pullingColSpan++;
        } else if (this.columns[i].colSpan == 'dropoff') {
          this.dropoffColSpan++;
        } else if (this.columns[i].colSpan == 'post') {
          this.postColSpan++;
        }
      }
    }
  }

  //Update columns and limit highlights when a new template is selected
  onTemplateChange(e): void {
    this.limits = [];
    const args = e.split(',');

    this.templateId = Number(args[0]);
    this.templateNameValue = args[1];

    this.templateIdName =
      this.templateId.toString() + ',' + this.templateNameValue;
    this.paginationValues = [100, 50, 1000, 500];
    this.paginationValues = this.paginationValues.sort((n1, n2) => n1 - n2);

    this.selTempSub.add(
      this._findITNTemplate
        .fetch({ _id: this.templateId }, { fetchPolicy: 'network-only' })
        .subscribe((res) => {
          if (res.data.findITNTemplate.length > 0) {
            const template: Template = {
              name: res.data.findITNTemplate[0].TemplateName,
              id: res.data.findITNTemplate[0]._id,
              selectedColumns: res.data.findITNTemplate[0].SelectedColumns,
            };

            this.defaultPaginationValue = res.data.findITNTemplate[0]
              .DefaultPagination
              ? res.data.findITNTemplate[0].DefaultPagination.toString()
              : '50';

            if (this.defaultPaginationValue) {
              this.pageSize = Number(this.defaultPaginationValue);
            }

            if (
              !this.paginationValues.includes(
                Number(this.defaultPaginationValue)
              )
            ) {
              this.paginationValues.push(Number(this.defaultPaginationValue));

              this.paginationValues = this.paginationValues.sort(
                (n1, n2) => n1 - n2
              );
            }

            if (res.data.findITNTemplate[0].ITNLEVELLIMITs.length > 0) {
              const limits = [];

              for (
                let i = 0;
                i < res.data.findITNTemplate[0].ITNLEVELLIMITs.length;
                i++
              ) {
                try {
                  const limit: LevelLimit = {
                    id: res.data.findITNTemplate[0].ITNLEVELLIMITs[i]._id,
                    templateId:
                      res.data.findITNTemplate[0].ITNLEVELLIMITs[i].TemplateID,
                    eventName:
                      res.data.findITNTemplate[0].ITNLEVELLIMITs[i].EventName,
                    eventId:
                      res.data.findITNTemplate[0].ITNLEVELLIMITs[i].EventID,
                    lowLevelLimit:
                      res.data.findITNTemplate[0].ITNLEVELLIMITs[i]
                        .LowLevelLimit,
                    mediumLevelLimit:
                      res.data.findITNTemplate[0].ITNLEVELLIMITs[i]
                        .MediumLevelLimit,
                  };

                  limits.push(limit);
                  this.limits.push(limit);

                  template['limits'] = limits;
                } catch (error) {
                  alert(error);
                }
              }
            }

            this.selectedTemplate = template;
          }

          const templateColumns =
            this.selectedTemplate.selectedColumns.split(',');
          this.columnsVisible = [];

          for (let i = 0; i < templateColumns.length; i++) {
            const col = this.columns.find((c) => c.name == templateColumns[i]);

            if (col) {
              this.columnsVisible.push({
                name: col.name,
                title: col.title,
                dataName: col.dataName,
                width: col.width,
                eventGroup: col.eventGroup,
                eventName: col.eventName,
                order: col.position,
                searchVisible: false,
                searchable: col.searchable,
                searchActive: false,
                drilldown: col.drilldown,
                sortFn: (a: [], b: []): number =>
                  (a[col.dataName]
                    ? a[col.dataName].toString()
                    : ''
                  ).localeCompare(
                    b[col.dataName] ? b[col.dataName].toString() : ''
                  ),
              });
            }

            const test = 'test';
          }

          this.columnsVisible2 = this.columnsVisible.sort((a, b) => {
            if (Number(a.order) > Number(b.order)) {
              return 1;
            } else {
              return -1;
            }
          });

          this.columnsVisible = this.columnsVisible2;
        })
    );
  }

  //pull drilldown data from db and load into arrays
  loadDrillDown(
    orderNumber?: string,
    nosiNumber?: string,
    orderLineNumber?: number,
    inventoryTrackingNumber?: string
  ): void {
    this.isLoading = true;
    this.drilldownTableData2 = [];

    this.drillDownRowsSubscription.add(
      this._fetchDrillDownRows
        .fetch(
          {
            orderNumber: orderNumber,
            nosiNumber: nosiNumber,
            orderLineNumber: orderLineNumber,
            inventoryTrackingNumber: inventoryTrackingNumber,
          },
          {
            fetchPolicy: 'network-only',
          }
        )
        .subscribe((res) => {
          res.data.fetchITNLifecycleDrillDownRows.forEach((row) => {
            const drillDownData = [];

            //drillDownData.push({

            const drillDownBase = {
              OrderNumber: row.OrderNumber ? row.OrderNumber.trim() : '',
              NOSINumber: row.NOSINumber ? row.NOSINumber.trim() : '',
              InventoryTrackingNumber: row.after_InventoryTrackingNumber
                ? row.after_InventoryTrackingNumber.trim()
                : '',
              DistributionCenter: row.DistributionCenter
                ? row.DistributionCenter.trim()
                : '',
              Name: null,
              Event: null,
              Module: null,
              DateTime: null,
              Ticks: null,
              PartNumber: row.PartNumber ? row.PartNumber.trim() : '',
              ProductCode: row.ProductCode ? row.ProductCode.trim() : '',
              PrcNumber:
                (row.ProductCode ? row.ProductCode.trim() : '') +
                (row.ProductCode ? '-' : '') +
                (row.PartNumber ? row.PartNumber.trim() : ''),
              OrderLineNumber: row.OrderLineNumber ? row.OrderLineNumber : null,
              CustomerNumber: row.CustomerNumber
                ? row.CustomerNumber.trim()
                : '',
              CustomerTier: row.CustomerTier ? row.CustomerTier.trim() : '',
              ProductTier: row.ProductTier ? row.ProductTier.trim() : '',
              Zone: row.Zone ? row.Zone : null,
              WMSPriority: row.WMSPriority ? row.WMSPriority : null,
              Priority: row.Priority ? 'Y' : 'N',
              TrackingNumber: row.TrackingNumber
                ? row.TrackingNumber.trim()
                : '',
              ParentITN: row.InventoryTrackingNumber
                ? row.InventoryTrackingNumber.trim()
                : '',
              Quantity: row.Quantity ? row.Quantity : null,
              ShipmentMethod: row.shipmentMethod ? row.shipmentMethod : null,
              ShipmentMethodDescription: row.shipmentMethodDescription
                ? row.shipmentMethodDescription
                : null,
            };

            if (row.splitDone) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = row.splitDoneUser
                ? row.splitDoneUser.trim()
                : '';
              drillDownItem.Event = 'ITN Split';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.splitDone);
              drillDownItem.Ticks = row.splitDone;
              drillDownData.push(drillDownItem);
            }

            if (row.lineAllocation) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = row.lineAllocationUser
                ? row.lineAllocationUser.trim()
                : '';
              drillDownItem.Event = 'Line Allocation';
              drillDownItem.Module = 'Release';
              drillDownItem.DateTime = this.timeFormating(row.lineAllocation);
              drillDownItem.Ticks = row.lineAllocation;
              drillDownData.push(drillDownItem);
            }

            if (row.releaseOrder) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Order';
              drillDownItem.Module = 'Release';
              drillDownItem.DateTime = this.timeFormating(row.releaseOrder);
              drillDownItem.Ticks = row.releaseOrder;
              drillDownData.push(drillDownItem);
            }

            if (row.releaseLine) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Line';
              drillDownItem.Module = 'Release';
              drillDownItem.DateTime = this.timeFormating(row.releaseLine);
              drillDownItem.Ticks = row.releaseLine;
              drillDownData.push(drillDownItem);
            }

            if (row.lineCancel) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Line Canceled';
              drillDownItem.Module = 'Release';
              drillDownItem.DateTime = this.timeFormating(row.lineCancel);
              drillDownItem.Ticks = row.lineCancel;
              drillDownData.push(drillDownItem);
            }

            if (row.orderCancel) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Order Canceled';
              drillDownItem.Module = 'Release';
              drillDownItem.DateTime = this.timeFormating(row.orderCancel);
              drillDownItem.Ticks = row.orderCancel;
              drillDownData.push(drillDownItem);
            }

            if (row.pickStart) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = row.pickStart
                ? row.pickStartUser.trim()
                : '';
              drillDownItem.Event = 'Pick Start';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickStart);
              drillDownItem.Ticks = row.pickStart;
              drillDownData.push(drillDownItem);
            }

            if (row.pickLocationScan) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Location Scan';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickLocationScan);
              drillDownItem.Ticks = row.pickLocationScan;
              drillDownData.push(drillDownItem);
            }

            if (row.pickITNScan) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'ITN Scan';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickITNScan);
              drillDownItem.Ticks = row.pickITNScan;
              drillDownData.push(drillDownItem);
            }

            if (row.pickQuantityEntered) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Quantity Entered';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(
                row.pickQuantityEntered
              );
              drillDownItem.Ticks = row.pickQuantityEntered;
              drillDownData.push(drillDownItem);
            }

            if (row.pickITNPrint) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'ITN Print';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickITNPrint);
              drillDownItem.Ticks = row.pickITNPrint;
              drillDownData.push(drillDownItem);
            }

            if (row.pickITNNF) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'ITN NF';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickITNNF);
              drillDownItem.Ticks = row.pickITNNF;
              drillDownData.push(drillDownItem);
            }

            if (row.pickCartAssigned) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Cart Assigned';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickCartAssigned);
              drillDownItem.Ticks = row.pickCartAssigned;
              drillDownData.push(drillDownItem);
            }

            if (row.pickUserExit) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'User Exit';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickUserExit);
              drillDownItem.Ticks = row.pickUserExit;
              drillDownData.push(drillDownItem);
            }

            if (row.pickLabelCount) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Label Count';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickLabelCount);
              drillDownItem.Ticks = row.pickLabelCount;
              drillDownData.push(drillDownItem);
            }

            if (row.pickLabelQuantity) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Label Quantity';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(
                row.pickLabelQuantity
              );
              drillDownItem.Ticks = row.pickLabelQuantity;
              drillDownData.push(drillDownItem);
            }

            if (row.pickOverPick) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Over Pick';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickOverPick);
              drillDownItem.Ticks = row.pickOverPick;
              drillDownData.push(drillDownItem);
            }

            if (row.pickToteAssignment) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Tote Assignment';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(
                row.pickToteAssignment
              );
              drillDownItem.Ticks = row.pickToteAssignment;
              drillDownData.push(drillDownItem);
            }

            if (row.pickShortPick) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Short Pick';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickShortPick);
              drillDownItem.Ticks = row.pickShortPick;
              drillDownData.push(drillDownItem);
            }

            if (row.pickDone) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = row.pickDoneUser
                ? row.pickDoneUser.trim()
                : '';
              drillDownItem.Event = 'Pick Done';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickDone);
              drillDownItem.Ticks = row.pickDone;
              drillDownData.push(drillDownItem);
            }

            if (row.pickStatus15) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Status 15';
              drillDownItem.Module = 'Picking';
              drillDownItem.DateTime = this.timeFormating(row.pickStatus15);
              drillDownItem.Ticks = row.pickStatus15;
              drillDownData.push(drillDownItem);
            }

            if (row.qcStart) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = row.qcStartUser
                ? row.qcStartUser.trim()
                : '';
              drillDownItem.Event = 'Start';
              drillDownItem.Module = 'QC';
              drillDownItem.DateTime = this.timeFormating(row.qcStart);
              drillDownItem.Ticks = row.qcStart;
              drillDownData.push(drillDownItem);
            }

            if (row.qcDone) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = row.qcDoneUser ? row.qcDoneUser.trim() : '';
              drillDownItem.Event = 'Done';
              drillDownItem.Module = 'QC';
              drillDownItem.DateTime = this.timeFormating(row.qcDone);
              drillDownItem.Ticks = row.qcDone;
              drillDownData.push(drillDownItem);
            }

            if (row.qcStatus40) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Status 40';
              drillDownItem.Module = 'QC';
              drillDownItem.DateTime = this.timeFormating(row.qcStatus40);
              drillDownItem.Ticks = row.qcStatus40;
              drillDownData.push(drillDownItem);
            }

            if (row.qcStatus41) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Status 41';
              drillDownItem.Module = 'QC';
              drillDownItem.DateTime = this.timeFormating(row.qcStatus41);
              drillDownItem.Ticks = row.qcStatus41;
              drillDownData.push(drillDownItem);
            }

            if (row.agStart) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = row.agStartUser
                ? row.agStartUser.trim()
                : '';
              drillDownItem.Event = 'Start';
              drillDownItem.Module = 'Ag In';
              drillDownItem.DateTime = this.timeFormating(row.agStart);
              drillDownItem.Ticks = row.agStart;
              drillDownData.push(drillDownItem);
            }

            if (row.agOutStart) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Start';
              drillDownItem.Module = 'Ag Out';
              drillDownItem.DateTime = this.timeFormating(row.agOutStart);
              drillDownItem.Ticks = row.agOutStart;
              drillDownData.push(drillDownItem);
            }

            if (row.qcHold) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Hold';
              drillDownItem.Module = 'QC';
              drillDownItem.DateTime = this.timeFormating(row.qcHold);
              drillDownItem.Ticks = row.qcHold;
              drillDownData.push(drillDownItem);
            }

            if (row.qcOrderComplete) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Order Complete';
              drillDownItem.Module = 'QC';
              drillDownItem.DateTime = this.timeFormating(row.qcOrderComplete);
              drillDownItem.Ticks = row.qcOrderComplete;
              drillDownData.push(drillDownItem);
            }

            if (row.agDone) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = row.agDoneUser ? row.agDoneUser.trim() : '';
              drillDownItem.Event = 'Done';
              drillDownItem.Module = 'Ag Out';
              drillDownItem.DateTime = this.timeFormating(row.agDone);
              drillDownItem.Ticks = row.agDone;
              drillDownData.push(drillDownItem);
            }

            if (row.agRelocate) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Relocate';
              drillDownItem.Module = 'Ag In';
              drillDownItem.DateTime = this.timeFormating(row.agRelocate);
              drillDownItem.Ticks = row.agRelocate;
              drillDownData.push(drillDownItem);
            }

            if (row.agOrderComplete) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Order Complete';
              drillDownItem.Module = 'Ag In';
              drillDownItem.DateTime = this.timeFormating(row.agOrderComplete);
              drillDownItem.Ticks = row.agOrderComplete;
              drillDownData.push(drillDownItem);
            }

            if (row.agInDone) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Done';
              drillDownItem.Module = 'Ag In';
              drillDownItem.DateTime = this.timeFormating(row.agInDone);
              drillDownItem.Ticks = row.agInDone;
              drillDownData.push(drillDownItem);
            }

            if (row.pullingStart) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Start';
              drillDownItem.Module = 'Pulling';
              drillDownItem.DateTime = this.timeFormating(row.pullingStart);
              drillDownItem.Ticks = row.pullingStart;
              drillDownData.push(drillDownItem);
            }

            if (row.pullingCartSelected) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Cart Selected';
              drillDownItem.Module = 'Pulling';
              drillDownItem.DateTime = this.timeFormating(
                row.pullingCartSelected
              );
              drillDownItem.Ticks = row.pullingCartSelected;
              drillDownData.push(drillDownItem);
            }

            if (row.pullingLocationSelected) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Location Selected';
              drillDownItem.Module = 'Pulling';
              drillDownItem.DateTime = this.timeFormating(
                row.pullingLocationSelected
              );
              drillDownItem.Ticks = row.pullingLocationSelected;
              drillDownData.push(drillDownItem);
            }

            if (row.pullingNotFound) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Not Found';
              drillDownItem.Module = 'Pulling';
              drillDownItem.DateTime = this.timeFormating(row.pullingNotFound);
              drillDownItem.Ticks = row.pullingNotFound;
              drillDownData.push(drillDownItem);
            }

            if (row.pullingDone) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Done';
              drillDownItem.Module = 'Pulling';
              drillDownItem.DateTime = this.timeFormating(row.pullingDone);
              drillDownItem.Ticks = row.pullingDone;
              drillDownData.push(drillDownItem);
            }

            if (row.dropoffStart) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = row.dropoffUser
                ? row.dropoffUser.trim()
                : '';
              drillDownItem.Event = 'Start';
              drillDownItem.Module = 'Drop Off';
              drillDownItem.DateTime = this.timeFormating(row.dropoffStart);
              drillDownItem.Ticks = row.dropoffStart;
              drillDownData.push(drillDownItem);
            }

            if (row.dropoffLine) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Line';
              drillDownItem.Module = 'Drop Off';
              drillDownItem.DateTime = this.timeFormating(row.dropoffLine);
              drillDownItem.Ticks = row.dropoffLine;
              drillDownData.push(drillDownItem);
            }

            if (row.dropoffDone) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Done';
              drillDownItem.Module = 'Drop Off';
              drillDownItem.DateTime = this.timeFormating(row.dropoffDone);
              drillDownItem.Ticks = row.dropoffDone;
              drillDownData.push(drillDownItem);
            }

            if (row.dropoffCartSelected) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Cart Selected';
              drillDownItem.Module = 'Drop Off';
              drillDownItem.DateTime = this.timeFormating(
                row.dropoffCartSelected
              );
              drillDownItem.Ticks = row.dropoffCartSelected;
              drillDownData.push(drillDownItem);
            }

            if (row.dropoffITNSkipped) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'ITN Skipped';
              drillDownItem.Module = 'Drop Off';
              drillDownItem.DateTime = this.timeFormating(
                row.dropoffITNSkipped
              );
              drillDownItem.Ticks = row.dropoffITNSkipped;
              drillDownData.push(drillDownItem);
            }

            if (row.dropoffLocationSelected) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Location Selected';
              drillDownItem.Module = 'Drop Off';
              drillDownItem.DateTime = this.timeFormating(
                row.dropoffLocationSelected
              );
              drillDownItem.Ticks = row.dropoffLocationSelected;
              drillDownData.push(drillDownItem);
            }

            if (row.packStart) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Start';
              drillDownItem.Module = 'Packing';
              drillDownItem.DateTime = this.timeFormating(row.packStart);
              drillDownItem.Ticks = row.packStart;
              drillDownData.push(drillDownItem);
            }

            if (row.packLine) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = row.packLineUser
                ? row.packLineUser.trim()
                : '';
              drillDownItem.Event = 'Line';
              drillDownItem.Module = 'Packing';
              drillDownItem.DateTime = this.timeFormating(row.packLine);
              drillDownItem.Ticks = row.packLine;
              drillDownData.push(drillDownItem);
            }

            if (row.packReject) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Reject';
              drillDownItem.Module = 'Packing';
              drillDownItem.DateTime = this.timeFormating(row.packReject);
              drillDownItem.Ticks = row.packReject;
              drillDownData.push(drillDownItem);
            }

            if (row.packDone) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Done';
              drillDownItem.Module = 'Packing';
              drillDownItem.DateTime = this.timeFormating(row.packDone);
              drillDownItem.Ticks = row.packDone;
              drillDownData.push(drillDownItem);
            }

            if (row.packNewPackage) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'New Package';
              drillDownItem.Module = 'Packing';
              drillDownItem.DateTime = this.timeFormating(row.packNewPackage);
              drillDownItem.Ticks = row.packNewPackage;
              drillDownData.push(drillDownItem);
            }

            if (row.packSupervisorCheck) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Supervisor Check';
              drillDownItem.Module = 'Packing';
              drillDownItem.DateTime = this.timeFormating(
                row.packSupervisorCheck
              );
              drillDownItem.Ticks = row.packSupervisorCheck;
              drillDownData.push(drillDownItem);
            }

            if (row.shippingManifest) {
              const drillDownItem = JSON.parse(JSON.stringify(drillDownBase));
              drillDownItem.Name = null;
              drillDownItem.Event = 'Shipping Manifest';
              drillDownItem.Module = 'Packing';
              drillDownItem.DateTime = this.timeFormating(row.shippingManifest);
              drillDownItem.Ticks = row.shippingManifest;
              drillDownData.push(drillDownItem);
            }

            drillDownData.sort((a, b) => {
              if (Number(a.Ticks) < Number(b.Ticks)) {
                return -1;
              }

              if (Number(a.Ticks) == Number(b.Ticks)) {
                return 0;
              }

              return 1;
            });

            drillDownData.forEach((dataRow) => {
              this.drilldownTableData2.push(dataRow);
            });
          });

          this.isLoading = false;
          this.drilldownTableData = this.drilldownTableData2;
        })
    );
  }

  ngOnDestroy(): void {
    try {
      this.subscription.unsubscribe();
      this.templateList.unsubscribe();
      this.selTempSub.unsubscribe();
      this.columnsSubscription.unsubscribe();
      this.drillDownSubscription.unsubscribe();
      this.drillDownRowsSubscription.unsubscribe();
    } catch (ex) {
      console.log('Error1: ' + ex);
    }
  }
}
