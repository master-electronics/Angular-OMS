import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { CommonService } from '../../shared/services/common.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
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
} from 'src/app/graphql/tableViews.graphql-gen';

@Component({
  selector: 'itn-lifecycle',
  templateUrl: './itn-lifecycle.component.html',
  styleUrls: ['./itn-lifecycle.component.css'],
})
export class ITNLifecycleComponent implements OnInit {
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

  constructor(
    private commonService: CommonService,
    private fb: UntypedFormBuilder,
    private _fetchITNLife: FetchItnLifecycleGQL,
    private _fetchDrilldown: FetchItnLifecycleDrillDownGQL,
    private _findITNTemplates: FindItnTemplatesGQL,
    private _findITNTemplate: FindItnTemplateGQL,
    private _findITNColumns: FindItnColumnsGQL,
    private titleService: Title,
    private router: Router
  ) {
    this.commonService.changeNavbar('ITN Lifecycle');
    this.titleService.setTitle('ITN Lifecycle');
  }

  filterForm = this.fb.group({
    startDatePicker: ['', [Validators.required]],
    endDatePicker: ['', [Validators.required]],
  });

  ngOnInit(): void {
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
    const UserInfo = sessionStorage.getItem('userInfo');
    const userId = JSON.parse(UserInfo)._id;
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

  //On user changed Start Date update style based on valid/invalid entries
  //also set End Date to the same value and update End Date style to valid
  onStartDateChange(e): void {
    if (!e) {
      const startDateElement = <HTMLInputElement>(
        document.getElementById('startDatePicker')
      );
      const endDateElement = <HTMLInputElement>(
        document.getElementById('endDatePicker')
      );
      const startDateFormField = this.filterForm.get('startDatePicker');
      const endDateFormField = this.filterForm.get('endDatePicker');

      if (startDateFormField.invalid) {
        startDateElement.parentElement.parentElement.setAttribute(
          'notvalid',
          'true'
        );
      } else {
        startDateElement.parentElement.parentElement.setAttribute(
          'notvalid',
          'false'
        );
        endDateElement.parentElement.parentElement.setAttribute(
          'notvalid',
          'false'
        );

        setTimeout(() => {
          endDateFormField.setValue(startDateFormField.value);
        }, 100);
      }
    }
  }

  //On user changed End Date update style based on valid/invalid entries
  //also check if entry is before Start Date, if so change End Date value to Start Date value
  onEndDateChange(e): void {
    if (!e) {
      const startDateElement = <HTMLInputElement>(
        document.getElementById('startDatePicker')
      );
      const endDateElement = <HTMLInputElement>(
        document.getElementById('endDatePicker')
      );
      const startDateFormField = this.filterForm.get('startDatePicker');
      const endDateFormField = this.filterForm.get('endDatePicker');

      if (endDateFormField.invalid) {
        endDateElement.parentElement.parentElement.setAttribute(
          'notvalid',
          'true'
        );
      } else {
        if (startDateElement.value) {
          startDateElement.parentElement.parentElement.setAttribute(
            'notvalid',
            'false'
          );
        } else {
          startDateElement.parentElement.parentElement.setAttribute(
            'notvalid',
            'true'
          );
        }

        endDateElement.parentElement.parentElement.setAttribute(
          'notvalid',
          'false'
        );

        setTimeout(() => {
          const sDate = new Date(startDateElement.value);
          const eDate = new Date(endDateElement.value);

          if (eDate < sDate) {
            endDateFormField.setValue(startDateFormField.value);
          }
        });
      }
    }
  }

  //Get records for search date
  onSubmit(): void {
    //format start and end dates
    if (this.filterForm.get('startDatePicker').invalid) {
      const sDate = <HTMLInputElement>(
        document.getElementById('startDatePicker')
      );
      sDate.parentElement.parentElement.setAttribute('notvalid', 'true');
    } else {
      const sDate = <HTMLInputElement>(
        document.getElementById('startDatePicker')
      );
      sDate.parentElement.parentElement.setAttribute('notvalid', 'false');
    }

    if (this.filterForm.get('endDatePicker').invalid) {
      const eDate = <HTMLInputElement>document.getElementById('endDatePicker');
      eDate.parentElement.parentElement.setAttribute('notvalid', 'true');
    } else {
      const eDate = <HTMLInputElement>document.getElementById('endDatePicker');
      eDate.parentElement.parentElement.setAttribute('notvalid', 'false');
    }

    if (this.filterForm.invalid || this.isLoading) return;
    const startDate = new Date(
      new Date(
        this.filterForm.get('startDatePicker').value.toString()
      ).setHours(0, 0, 0, 0)
    ).toISOString();
    const endDate = new Date(
      new Date(this.filterForm.get('endDatePicker').value.toString()).setHours(
        23,
        59,
        59,
        999
      )
    ).toISOString();
    this.startDate = startDate;
    this.endDate = endDate;

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

  test(): void {
    this.pageNumber = 1;
    alert(this.pageNumber);
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

    this.drillDownSubscription.add(
      this._fetchDrilldown
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
          if (res.data.fetchITNLifecycleDrillDown.length > 0) {
            for (
              let i = 0;
              i < res.data.fetchITNLifecycleDrillDown.length;
              i++
            ) {
              const row = res.data.fetchITNLifecycleDrillDown[i];

              this.drilldownTableData2.push({
                OrderNumber: row.OrderNumber ? row.OrderNumber.trim() : '',
                NOSINumber: row.NOSINumber ? row.NOSINumber.trim() : '',
                InventoryTrackingNumber: row.InventoryTrackingNumber
                  ? row.InventoryTrackingNumber.trim()
                  : '',
                Message: row.Message ? row.Message.trim() : '',
                Name: row.UserName ? row.UserName.trim() : '',
                UserEventId: row.UserEventID ? row.UserEventID : null,
                Event: row.Event ? row.Event.trim() : '',
                Module: row.Module ? row.Module.trim() : '',
                DateTime: row.DateTime ? this.timeFormating(row.DateTime) : '',
                PartNumber: row.PartNumber ? row.PartNumber.trim() : '',
                ProductCode: row.ProductCode ? row.ProductCode.trim() : '',
                PrcNumber:
                  (row.ProductCode ? row.ProductCode.trim() : '') +
                  (row.ProductCode ? '-' : '') +
                  (row.PartNumber ? row.PartNumber.trim() : ''),
                OrderLineNumber: row.OrderLineNumber
                  ? row.OrderLineNumber.trim()
                  : '',
                CustomerNumber: row.CustomerNumber
                  ? row.CustomerNumber.trim()
                  : '',
                CustomerTier: row.CustomerTier ? row.CustomerTier.trim() : '',
                ProductTier: row.ProductTier ? row.ProductTier.trim() : '',
                Zone: row.Zone ? row.Zone : null,
                WMSPriority: row.WMSPriority ? row.WMSPriority : null,
                Priority: row.Priority ? 'Y' : 'N',
                TrackingNumber: row.TrackingNumber ? row.TrackingNumber : '',
                ParentITN: row.ParentITN ? row.ParentITN : '',
                DistributionCenter: row.DistributionCenter
                  ? row.DistributionCenter
                  : '',
                Quantity: row.Quantity ? row.Quantity : null,
                ShipmentMethod: row.ShipmentMethod ? row.ShipmentMethod : '',
                ShipmentMethodDescription: row.ShipmentMethodDescription
                  ? row.ShipmentMethodDescription
                  : '',
              });
            }
          }

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
    } catch (ex) {
      console.log('Error1: ' + ex);
    }
  }
}
