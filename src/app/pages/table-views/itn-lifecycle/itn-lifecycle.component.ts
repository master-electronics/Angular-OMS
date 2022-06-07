import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { CommonService } from '../../../shared/services/common.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FetchItnLifecycleGQL, FetchItnUserColumnsGQL, FindItnTemplateGQL, FindItnColumnsGQL } from 'src/app/graphql/tableViews.graphql-gen';
import { catchError, filter, map } from 'rxjs/operators';
import { ColumnSelectorComponent } from './column-selector.component';
import { Column, Template, LevelLimit } from './itn-lifecycle.server';
import { Observable, Subscription } from 'rxjs';

import {
  Insert_ItnUserColumnsGQL, Update_ItnUserColumnsGQL,
  Insert_ItnUserLevelsGQL, Update_ItnUserLevelsGQL, FindItnTemplatesGQL,
  FindItnTemplateDocument
} from 'src/app/graphql/tableViews.graphql-gen';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'itn-lifecycle',
  templateUrl: './itn-lifecycle.component.html',
  styleUrls: ['./itn-lifecycle.component.css']
})
export class ITNLifecycleComponent implements OnInit {
  isLoading = false;
  startDate: string;
  userId: string;
  fetchTable$;
  tableData = [];
  tableDataDisplay = [];
  timeformat = {};
  columns: Column[];
  private subscription = new Subscription();
  private templateList = new Subscription();
  private selTempSub = new Subscription()
  private columnsSubscription = new Subscription();
  columnsVisible = [];
  columnsVisible2 = [];
  columnsVisibleId = "";
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
  limits: LevelLimit[];
  defaultPaginationValue: string;
  customPaginationValue: string;
  paging: boolean;
  paginationValues: number[];
  pageSize: number;
  screenWidth: any;
  screenHeight: any;
  searchVisible = false;
  searchActive = true;
  searchValue = "";
  filters: { filterColumn: string; filterValue: string }[];

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private _fetchITNLife: FetchItnLifecycleGQL,
    private _findITNTemplates: FindItnTemplatesGQL,
    private _findITNTemplate: FindItnTemplateGQL,
    private _findITNColumns: FindItnColumnsGQL,
    private titleService: Title
  ) {
    this.commonService.changeNavbar('ITN Lifecycle');
    this.titleService.setTitle('ITN Lifecycle');
  }

  filterForm = this.fb.group({
    timeRange: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.screenWidth = window.innerWidth+"px";
    this.screenHeight = (window.innerHeight-300)+"px";
    this.selectedTemplate = {};
    const UserInfo = sessionStorage.getItem('userInfo');
    const userId = JSON.parse(UserInfo)._id;
    this.userId = userId.toString();
    this.templateNames = [];
    this.templates = [];
    this.columns = [];
    this.paging = true;
    this.paginationValues = [100, 50, 1000, 500];
    this.paginationValues = this.paginationValues.sort((n1,n2) => n1 - n2);
    this.pageSize = 50;
    this.filters = [];

    //Set up array of avaialbe columns
    //Get columns from ITNCOLUMNS db table
    this.columnsSubscription.add(
      this._findITNColumns
        .fetch(
          {
            userId: Number(this.userId)
          }
        )
        .subscribe((res) => {
          for (let i = 0; i < res.data.findITNColumns.length; i++) {
            const column: Column =
            {
              name: res.data.findITNColumns[i].name,
              title: res.data.findITNColumns[i].title,
              dataName: res.data.findITNColumns[i].dataName,
              colSpan: res.data.findITNColumns[i].colSpan,
              position: res.data.findITNColumns[i].position,
              width: res.data.findITNColumns[i].width,
              eventGroup: res.data.findITNColumns[i].eventGroup,
              eventName: res.data.findITNColumns[i].eventName,
              searchable: res.data.findITNColumns[i].searchable,
            }

            this.columns.push(column);
          }

        },
        (error) => {
          const err = error;
        })
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
              const template: Template = { name: res.data.findITNTemplates[i].TemplateName, id: res.data.findITNTemplates[i]._id };
              this.templates.push(template);

              this.templateNames.push(res.data.findITNTemplates[i].TemplateName);
            }

            if (!this.templateId || this.templates.length < 1) {
              this.columnsVisible = [];
              this.columnsVisible2 = [];

              for (let x = 0; x < this.columns.length; x++) {
                this.columnsVisible.push(
                  { 
                      name: this.columns[x].name, 
                      title: this.columns[x].title,
                      dataName: this.columns[x].dataName,
                      width: this.columns[x].width,
                      eventGroup: this.columns[x].eventGroup,
                      eventName: this.columns[x].eventName,
                      searchVisible: false,
                      searchable: this.columns[x].searchable,
                      searchActive: false,
                      sortFn: (a: [], b: []): number => 
                      ((a[this.columns[x].dataName])?(a[this.columns[x].dataName].toString()):'').localeCompare(((b[this.columns[x].dataName])?(b[this.columns[x].dataName].toString()):'')),
                  }
                );
   
              }

              this.setColSpans();
            }
          },
          (error) => {
            const err = error;
          }
        )
    );

  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.screenWidth = window.innerWidth+"px";
    this.screenHeight = (window.innerHeight-300)+"px";
  }

  //Clear search date
  resetForm(): void {
    this.filterForm.reset({
      timeRange: '',
    });
  }

  //Get records for search date
  onSubmit(): void {
    if (this.filterForm.invalid || this.isLoading) return;
    const selectedDate = this.filterForm.get('timeRange').value;
    const startDate = new Date((selectedDate.setHours(0, 0, 0, 0))).toISOString();
    this.startDate = startDate;
    const endDate = new Date(
      selectedDate.setHours(23, 59, 59, 999)
    ).toISOString();
    // prepare query data then send
    this.isLoading = true;
    this.fetchTable$ = this._fetchITNLife
      .fetch({ startDate, endDate }, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          this.isLoading = false;
          this.tableData = res.data.fetchITNLifecycle.map((item) => {
            const result = { ...item };
            result['OrderNOSI'] = item.OrderNumber+"-"+item.NOSINumber;
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
              result["PartCode"] = item.PartNumber.trim()+"-"+item.ProductCode;
            }
            if (item.agDone && item.agStart) {
              result['agElapsed'] =
                this.elapsedFormating(Number(item.agDone) - Number(item.agStart));
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
              result['pickElapsed'] =
                this.elapsedFormating(Number(item.pickDone) - Number(item.pickStart));
              result['pickElapsedNum'] = Number(item.pickDone) - Number(item.pickStart);
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
              result['qcElapsed'] =
                this.elapsedFormating(Number(item.qcDone) - Number(item.qcStart));
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
              result['pullingElapsed'] =
                this.elapsedFormating(Number(item.pullingDone) - Number(item.pullingStart));
                result['pullingElapsedNum'] = Number(item.pullingDone) - Number(item.pullingStart);
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
              result['dropoffElapsed'] =
                this.elapsedFormating(Number(item.dropoffDone) - Number(item.dropoffStart));
                result['dropoffElapsedNum'] = Number(item.dropoffDone) - Number(item.dropoffStart); 
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
              result['packingElapsed'] =
                this.elapsedFormating(Number(item.packDone) - Number(item.packStart));
                result['packingElapsedNum'] = Number(item.packDone) - Number(item.packStart);  
            }

            return result;
          });

          this.tableDataDisplay = this.tableData;
        }),
        catchError((error) => {
          this.isLoading = false;
          return error;
        }),
                
      );

  }

  //add user entered filter info to the fitlers array
  //the array is used in the filterResults method to allow filtring on multiple columns
  setFilter(FilterColumn: [], FilterValue: string): void {
    FilterColumn["searchVisible"] = false;
    FilterColumn["searchActive"] = true;

    const index = this.filters.map(filter => filter.filterColumn).indexOf(FilterColumn["dataName"]);

    if (index > -1) {
      this.filters[index] = {
        filterColumn: FilterColumn["dataName"],
        filterValue: FilterValue
      }
    } else {
      this.filters.push({
        filterColumn: FilterColumn["dataName"],
        filterValue: FilterValue
      });
    }

    this.filterResults();

  }

  //remove user cleared filter from the filters array
  clearFilter(FilterColumn: []): void {
    FilterColumn["searchVisible"] = false;
    FilterColumn["searchActive"] = false;

    const index = this.filters.map(filter => filter.filterColumn).indexOf(FilterColumn["dataName"]);

    if (index > -1) {
      this.filters.splice(index, 1);
    }

    this.filterResults();

  }

  //apply all filters in the filters array to the dataset
  filterResults(): void {
    this.tableDataDisplay = this.tableData;

    for (let i = 0; i < this.filters.length; i++) {
      this.tableDataDisplay = this.tableDataDisplay.filter(
        item =>
          item[this.filters[i].filterColumn].toString().indexOf(this.filters[i].filterValue) !== -1
      );
    }

  }

  //When settings screen is closed refresh display
  onModalClose(): void {
    this.onTemplateChange(this.templateId.toString());
  }

  //Return class to for setting the color of event cells based on template hightlight limits
  getClass(Start, Done, EventName): string {
    let c = "none";

    if (EventName) {
      if (this.limits) {
        //find limits for current event
        const l = this.limits.find(e => e.eventName.toLocaleLowerCase() == EventName.toLocaleLowerCase());

        //if there's a start time but no end time high alert
        if (l) {
          if (Start && (!Done || Done == "")) {
            c = "high";
          } else {
            const elapsed = (Number(Done) - Number(Start));

            //if a medium level is set for the template and the elapsed time has supassed it medium alert
            if ((l.mediumLevelLimit > 0) && (elapsed > l.mediumLevelLimit)) {
              c = "medium";
              //if a low level is set for the template and the elapsed time has supassed it low alert
            } else if ((l.lowLevelLimit > 0) && (elapsed > l.lowLevelLimit)) {
              c = "low";
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
    return date.toLocaleString(navigator.language, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  //format the elapsed time into hours, minutes, and seconds
  elapsedFormating(elapsed: number): string {
    const hours = Math.floor(((elapsed) / 1000 / 60 / 60));
    const minutes = Math.floor((elapsed - (hours * 60 * 60 * 1000)) / 1000 / 60);
    const seconds = Math.floor((elapsed - (minutes * 60 * 1000)) / 1000);

    return hours.toString().substring(0, 2).padStart(2, '0') + ":" +
      minutes.toString().substring(0, 2).padStart(2, '0') + ":" +
      seconds.toString().substring(0, 2).padStart(2, '0');
  }

  //Export results to Excel
  exportexcel(): void {
    this.paging = false;
    setTimeout(() => {
          /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `${this.startDate.substring(0, 10)}.xlsx`);
    }, 2000);


    setTimeout(() => {this.paging = true}, 2000);
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
        if (this.columns[i].colSpan == "pre") {
          this.preColSpan++;
        } else if (this.columns[i].colSpan == "pick") {
          this.pickColSpan++;
        } else if (this.columns[i].colSpan == "qc") {
          this.qcColSpan++;
        } else if (this.columns[i].colSpan == "ag") {
          this.agColSpan++;
        } else if (this.columns[i].colSpan == "pulling") {
          this.pullingColSpan++;
        } else if (this.columns[i].colSpan == "dropoff") {
          this.dropoffColSpan++;
        } else if (this.columns[i].colSpan == "post") {
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
    this.templateNameValue = '';

    this.paginationValues = [100, 50, 1000, 500];
    this.paginationValues = this.paginationValues.sort((n1,n2) => n1 - n2);

    this.selTempSub.add(
      this._findITNTemplate
        .fetch(
          { _id: this.templateId },
          { fetchPolicy: 'network-only' }
        )
        .subscribe(
          (res) => {
            if (res.data.findITNTemplate.length > 0) {
              const template: Template =
              {
                name: res.data.findITNTemplate[0].TemplateName,
                id: res.data.findITNTemplate[0]._id,
                selectedColumns: res.data.findITNTemplate[0].SelectedColumns,
              }

              this.defaultPaginationValue = res.data.findITNTemplate[0].DefaultPagination.toString();

              if (this.defaultPaginationValue) {
                this.pageSize = Number(this.defaultPaginationValue);
              }

              if (!this.paginationValues.includes(Number(this.defaultPaginationValue))) {
                this.paginationValues.push(Number(this.defaultPaginationValue));

                this.paginationValues = this.paginationValues.sort((n1,n2) => n1 - n2);
              }

              if (res.data.findITNTemplate[0].ITNLEVELLIMITs.length > 0) {

                const limits = [];

                for (let i = 0; i < res.data.findITNTemplate[0].ITNLEVELLIMITs.length; i++) {
                  try {
                    const limit: LevelLimit = {
                      id: res.data.findITNTemplate[0].ITNLEVELLIMITs[i]._id,
                      templateId: res.data.findITNTemplate[0].ITNLEVELLIMITs[i].TemplateID,
                      eventName: res.data.findITNTemplate[0].ITNLEVELLIMITs[i].EventName,
                      eventId: res.data.findITNTemplate[0].ITNLEVELLIMITs[i].EventID,
                      lowLevelLimit: res.data.findITNTemplate[0].ITNLEVELLIMITs[i].LowLevelLimit,
                      mediumLevelLimit: res.data.findITNTemplate[0].ITNLEVELLIMITs[i].MediumLevelLimit
                    };

                    limits.push(limit);
                    this.limits.push(limit);

                    template["limits"] = limits;

                  }
                  catch (error) {
                    alert(error);
                  }
                }


              }

              this.selectedTemplate = template;
            }

            const templateColumns = this.selectedTemplate.selectedColumns.split(',');
            this.columnsVisible = [];

            for (let i = 0; i<templateColumns.length; i++) {
              const col = this.columns.find(c => c.name == templateColumns[i]);

              this.columnsVisible.push( 
                {
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
                  sortFn: (a: [], b: []): number => ((a[col.dataName])?(a[col.dataName].toString()):'').localeCompare((b[col.dataName])?(b[col.dataName].toString()):'')
                }
              )


            }

            this.columnsVisible2 = this.columnsVisible.sort((a, b) => {
              if (Number(a.order) > Number(b.order)) {
                return 1;
              } else {
                return -1;
              }

            });

            this.columnsVisible = this.columnsVisible2;

          }
        )
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.templateList.unsubscribe();
    this.selTempSub.unsubscribe();
    this.columnsSubscription.unsubscribe();
  }

}
