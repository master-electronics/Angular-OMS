import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { CommonService } from '../../../shared/services/common.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FetchItnLifecycleGQL, FetchItnUserColumnsGQL, FindItnTemplateGQL, FindItnColumnsGQL } from 'src/app/graphql/tableViews.graphql-gen';
import { catchError, map } from 'rxjs/operators';
import { ColumnSelectorComponent } from './column-selector.component';
import { Column } from '../../../column';
import { Template } from '../../../template';
import { LevelLimit } from 'src/app/LevelLimit';
import { Observable, Subscription } from 'rxjs';

import {
  Insert_ItnUserColumnsGQL, Update_ItnUserColumnsGQL,
  Insert_ItnUserLevelsGQL, Update_ItnUserLevelsGQL, FindItnTemplatesGQL,
  FindItnTemplateDocument
} from 'src/app/graphql/tableViews.graphql-gen';

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
  timeformat = {};
  columns: Column[];
  private subscription = new Subscription();
  private templateList = new Subscription();
  private selTempSub = new Subscription()
  private columnsSubscription = new Subscription();
  columnsVisible = [];
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
    this.selectedTemplate = {};
    const UserInfo = sessionStorage.getItem('userInfo');
    const userId = JSON.parse(UserInfo)._id;
    this.userId = userId.toString();
    this.templateNames = [];
    this.templates = [];
    this.columns = [];

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
              colSpan: res.data.findITNColumns[i].colSpan,
              position: res.data.findITNColumns[i].position
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

              for (let x = 0; x < this.columns.length; x++) {
                this.columnsVisible.push(this.columns[x].name);
              }

              this.setColSpans();
            }
          },
          (error) => {
            const err = error;
          }
        )
    );



    //Set up array of available columns
    // this.columns = [
    //   { name: "Order", title: "Order", colSpan: "pre", position: 1 },
    //   { name: "Line", title: "Line", colSpan: "pre", position: 2 },
    //   { name: "ITN", title: "ITN", colSpan: "pre", position: 3 },
    //   { name: "SplitITN", title: "Split ITN", colSpan: "pre", position: 4 },
    //   { name: "Cust", title: "Cust", colSpan: "pre", position: 5 },
    //   { name: "CustTier", title: "Cust Tier", colSpan: "pre", position: 6 },
    //   { name: "Part", title: "Part", colSpan: "pre", position: 7 },
    //   { name: "PartTier", title: "Part Tier", colSpan: "pre", position: 8 },
    //   { name: "Zone", title: "Zone", colSpan: "pre", position: 9 },
    //   { name: "WMSPriority", title: "WMSPriority", colSpan: "pre", position: 10 },
    //   { name: "Priority", title: "Priority", colSpan: "pre", position: 11 },
    //   { name: "Drop", title: "Drop", colSpan: "pre", position: 12 },
    //   { name: "PickStart", title: "Pick Start", colSpan: "pick", position: 13 },
    //   { name: "PickEnd", title: "Pick End", colSpan: "pick", position: 14 },
    //   { name: "PickElapsed", title: "Pick Elapsed", colSpan: "pick", position: 15 },
    //   { name: "QCStart", title: "QC Start", colSpan: "qc", position: 16 },
    //   { name: "QCEnd", title: "QC End", colSpan: "qc", position: 17 },
    //   { name: "QCElapsed", title: "QC Elapsed", colSpan: "qc", position: 18 },
    //   { name: "AGStart", title: "Aggregation Start", colSpan: "ag", position: 19 },
    //   { name: "AGEnd", title: "Aggregation End", colSpan: "ag", position: 20 },
    //   { name: "AGElapsed", title: "Aggregation Elapsed", colSpan: "ag", position: 21 },
    //   { name: "PullingStart", title: "Pulling Start", colSpan: "pulling", position: 22 },
    //   { name: "PullingEnd", title: "Pulling End", colSpan: "pulling", position: 23 },
    //   { name: "PullingElapsed", title: "Pulling Elapsed", colSpan: "pulling", position: 24 },
    //   { name: "DropOffStart", title: "Drop Off Start", colSpan: "dropoff", position: 25 },
    //   { name: "DropOffEnd", title: "Drop Off End", colSpan: "dropoff", position: 26 },
    //   { name: "DropOffElapsed", title: "Drop Off Elapsed", colSpan: "dropoff", position: 27 },
    //   { name: "Notes", title: "Notes", colSpan: "post", position: 28 },
    //   { name: "TrackingNumber", title: "Tracking Number", colSpan: "post", position: 29 }
    // ];

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
            if (item.release) {
              result.release = this.timeFormating(item.release);
            }
            if (item.agStart) {
              result.agStart = this.timeFormating(item.agStart);
            }
            if (item.agDone) {
              result.agDone = this.timeFormating(item.agDone);
            }
            if (item.agDone && item.agStart) {
              result['agElapsed'] =
                this.elapsedFormating(Number(item.agDone) - Number(item.agStart));
              result['agStartNum'] = Number(item.agStart);
              result['agDoneNum'] = Number(item.agDone);
            }
            if (item.pickStart) {
              result.pickStart = this.timeFormating(item.pickStart);
            }
            if (item.pickDone) {
              result.pickDone = this.timeFormating(item.pickDone);
            }
            if (item.pickStart && item.pickDone) {
              result['pickElapsed'] =
                this.elapsedFormating(Number(item.pickDone) - Number(item.pickStart));
              result['pickElapsedNum'] = Number(item.pickDone) - Number(item.pickStart);
              result['pickStartNum'] = Number(item.pickStart);
              result['pickDoneNum'] = Number(item.pickDone);
            }
            if (item.qcStart) {
              result.qcStart = this.timeFormating(item.qcStart);
            }
            if (item.qcDone) {
              result.qcDone = this.timeFormating(item.qcDone);
            }
            if (item.qcDone && item.qcStart) {
              result['qcElapsed'] =
                this.elapsedFormating(Number(item.qcDone) - Number(item.qcStart));
              result['qcStartNum'] = Number(item.qcStart);
              result['qcDoneNum'] = Number(item.qcDone);
            }

            return result;
          });
        }),
        catchError((error) => {
          this.isLoading = false;
          return error;
        })
      );

  }

  //When settings screen is closed refresh display
  onModalClose() {
    this.onTemplateChange(this.templateId.toString());
  }

  //Return class to for setting the color of event cells based on template hightlight limits
  getClass(Start, Done, EventName): string {
    let c = "none";

    if (this.limits) {
      //find limits for current event
      const l = this.limits.find(e => e.eventName.toLocaleLowerCase() == EventName.toLocaleLowerCase());

      //if there's a start time but no end time high alert
      if (l) {
              if (Start != "" && (!Done || Done == "")) {
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
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `${this.startDate.substring(0, 10)}.xlsx`);
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

            this.columnsVisible = this.selectedTemplate.selectedColumns.split(',');
            this.setColSpans();
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
