import { Component, OnInit } from '@angular/core';

import * as XLSX from 'xlsx';
import { CommonService } from '../../../shared/services/common.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FetchItnLifecycleGQL, FetchItnUserColumnsGQL, FindItnTemplateGQL } from 'src/app/graphql/tableViews.graphql-gen';
import { catchError, map } from 'rxjs/operators';
import { ColumnSelectorComponent } from '../column-selector.component';
import { Column } from '../../../column';
import { Template } from '../../../template';
import { LevelLimit } from 'src/app/LevelLimit';
import { Observable, Subscription } from 'rxjs';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/wms.graphql-gen';

import { Insert_ItnUserColumnsGQL, Update_ItnUserColumnsGQL, 
  Insert_ItnUserLevelsGQL, Update_ItnUserLevelsGQL, FindItnTemplatesGQL,
  FindItnTemplateDocument } from 'src/app/graphql/tableViews.graphql-gen';

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
  modalVisible = false;
  orderVisible;
  columns: Column[];
  columnList = [];
  private subscription = new Subscription();
  private templateList = new Subscription();
  private selTempSub = new Subscription();

  columnsVisible = [];
  test = [];
  columnsVisibleId = "";
  allColumns: boolean = false;
  preColSpan=0;
  pickColSpan=0;
  qcColSpan=0;
  agColSpan=0;
  pullingColSpan=0;
  dropoffColSpan=0;
  postColSpan=0;
  highLevel;
  mediumLevel;
  lowLevel;
  templateNames = [];
  templates: Template[];
  selectedTemplate: Template;
  templateId: number;
  templateNameValue: string;
  limits: LevelLimit[];

  temp: number;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private _fetchITNLife: FetchItnLifecycleGQL,
    private _fetchITNColumns: FetchItnUserColumnsGQL,
    private _insertITNColumns: Insert_ItnUserColumnsGQL,
    private _insertEventlog: Insert_UserEventLogsGQL,
    private _updateITNColumns: Update_ItnUserColumnsGQL,
    private _insertITNLevels: Insert_ItnUserLevelsGQL,
    private _updateITNLevels: Update_ItnUserLevelsGQL,
    private _findITNTemplates: FindItnTemplatesGQL,
    private _findITNTemplate: FindItnTemplateGQL
  ) {
    this.commonService.changeNavbar('ITN Lifecycle');
  }

  filterForm = this.fb.group({
    timeRange: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.temp = 10000;
    this.selectedTemplate = {};
    const UserInfo = sessionStorage.getItem('userInfo');
    const userId = JSON.parse(UserInfo)._id;
    this.userId = userId.toString();
    this.templateNames = [];
    this.templates = [];

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
            for (let i=0; i<res.data.findITNTemplates.length; i++) {
              const template: Template = { name: res.data.findITNTemplates[i].TemplateName, id: res.data.findITNTemplates[i]._id };
              this.templates.push(template);

              this.templateNames.push(res.data.findITNTemplates[i].TemplateName);
            }
            
            if (!this.templateId || this.templates.length < 1) {
              this.columnsVisible = [];

              for (let x=0; x<this.columns.length; x++) {
                this.columnsVisible.push(this.columns[x].name);
              }

              this.setColSpans();
            }
          },
          (error) => {
            const err = error;
          }
        )
    )

    this.columns = [
      { name: "Order", title: "Order", colSpan: "pre" },
      { name: "Line", title: "Line", colSpan: "pre" },
      { name: "ITN", title: "ITN", colSpan: "pre" },
      { name: "SplitITN", title: "Split ITN", colSpan: "pre" },
      { name: "Cust", title: "Cust", colSpan: "pre" },
      { name: "CustTier", title: "Cust Tier", colSpan: "pre" },
      { name: "Part", title: "Part", colSpan: "pre" },
      { name: "PartTier", title: "Part Tier", colSpan: "pre" },
      { name: "Zone", title: "Zone", colSpan: "pre" },
      { name: "WMSPriority", title: "WMSPriority", colSpan: "pre" },
      { name: "Priority", title: "Priority", colSpan: "pre" },
      { name: "Drop", title: "Drop", colSpan: "pre" },
      { name: "PickStart", title: "Pick Start", colSpan: "pick" },
      { name: "PickEnd", title: "Pick End", colSpan: "pick" },
      { name: "PickElapsed", title: "Pick Elapsed", colSpan: "pick" },
      { name: "QCStart", title: "QC Start", colSpan: "qc" },
      { name: "QCEnd", title: "QC End", colSpan: "qc" },
      { name: "QCElapsed", title: "QC Elapsed", colSpan: "qc" },
      { name: "AGStart", title: "Aggregation Start", colSpan: "ag" },
      { name: "AGEnd", title: "Aggregation End", colSpan: "ag" },
      { name: "AGElapsed", title: "Aggregation Elapsed", colSpan: "ag" },
      { name: "PullingStart", title: "Pulling Start", colSpan: "pulling" },
      { name: "PullingEnd", title: "Pulling End", colSpan: "pulling" },
      { name: "PullingElapsed", title: "Pulling Elapsed", colSpan: "pulling" },
      { name: "DropOffStart", title: "Drop Off Start", colSpan: "dropoff" },
      { name: "DropOffEnd", title: "Drop Off End", colSpan: "dropoff" },
      { name: "DropOffElapsed", title: "Drop Off Elapsed", colSpan: "dropoff" },
      { name: "Notes", title: "Notes", colSpan: "post" },
      { name: "TrackingNumber", title: "Tracking Number", colSpan: "post" }
    ];

  }

  resetForm(): void {
    this.filterForm.reset({
      timeRange: '',
    });
  }

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
            }

            result['pickLevel'] = this.getLevel('pick', item);
            result['qcLevel'] = this.getLevel('qc', item);
            result['agLevel'] = this.getLevel('ag', item);
            result['pullingLevel'] = this.getLevel('pulling', item);
            result['dropoffLevel'] = this.getLevel('dropoff', item);

            return result;
          });
        }),
        catchError((error) => {
          this.isLoading = false;
          return error;
        })
      );

  }

  onModalClose() {
    this.onTemplateChange(this.templateId.toString());
    
  }

  testE(e): string {
    alert(e);
    if (Number(e) > this.temp) {
      return "medium";
    } else {
      return "low";
    }
  }

  testC() {
    if (this.temp == 600000) {
      this.temp = 10000;
    } else {
      this.temp = 600000;
    }

  }

  getLevel(eventName: string, item): string {
    let level = "none";

    if (item[eventName+'Start'] && !item[eventName+'Done']) {
      level = 'high';
    } else {
      const elapsed = (Number(item[eventName+'Done']) - Number(item[eventName+'Start']));

      const l = this.limits.find(e => e.eventName.toLowerCase() == eventName.toLocaleLowerCase());

      const t = "t";

      if ((l.mediumLevelLimit > 0) && (elapsed > l.mediumLevelLimit)) {
        level = 'medium';
      } else if ((l.lowLevelLimit > 0) && (elapsed > l.lowLevelLimit)) {
        level = 'low';
      } else {
        const woot = "here";
      }

    }
    
    return level;
  }

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

  elapsedFormating(elapsed: number): string {
    const hours = Math.floor(((elapsed)/1000/60/60));
    const minutes = Math.floor((elapsed - (hours * 60 * 60 * 1000))/1000/60);
    const seconds = Math.floor((elapsed - (minutes * 60 * 1000))/1000);

    return hours.toString().substring(0,2).padStart(2, '0') + ":" +
      minutes.toString().substring(0,2).padStart(2, '0') + ":" +
      seconds.toString().substring(0,2).padStart(2, '0');
  }

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

  setColSpans(): void {
    this.preColSpan=0;
    this.pickColSpan=0;
    this.qcColSpan=0;
    this.agColSpan=0;
    this.pullingColSpan=0;
    this.dropoffColSpan=0;
    this.postColSpan=0;

    for(let i=0; i<this.columns.length; i++) {
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

    const t = "t";
  }

  onCheckboxChange(e): void {
    if (e.target.checked) {
      this.orderVisible = true;
    } else {
      this.orderVisible = false;
    }
  }

  onColumnSelected(e): void {
    const i = this.columnsVisible.indexOf(e);

    if (i == -1) {
      this.columnsVisible.push(e);
    }

    this.setColSpans();
  }

  onColumnUnselected(e): void {
    const i = this.columnsVisible.indexOf(e);

    if (i > -1) {
      this.columnsVisible.splice(i, 1);
    }

    this.setColSpans();
  }

  onTemplateChange(e): void {
    this.limits = [];
    const args = e.split(',');

    this.templateId = Number(args[0]);
    this.templateNameValue = '';

    this.selTempSub.add(
      this._findITNTemplate
        .fetch(
          { _id: this.templateId },
          { fetchPolicy: 'network-only'}
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

              if (res.data.findITNTemplate[0].ITNLEVELLIMITs.length >0) {

                let limits = []; //: LevelLimit[];

                for (let i=0; i<res.data.findITNTemplate[0].ITNLEVELLIMITs.length; i++) {
                  try {
                    let limit: LevelLimit = { 
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
                  catch(error) {
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

  onSaveTemplate(): void {

  }

  onColumnsChange(): void {
    let userColumns = [];
    let cols = "";
    let sep = "";

    for (let i=0; i<this.columnsVisible.length; i++) {
      cols+=sep+this.columnsVisible[i];
      sep=",";
    }
    
    userColumns.push({
      UserID: Number(
        JSON.parse(sessionStorage.getItem('userInfo'))._id
      ),
      SelectedColumns: cols
    });
    try {
        if (this.columnsVisibleId === "") {
          this.subscription.add(this._insertITNColumns.mutate( {
            itnUserColumns: userColumns,
          }).subscribe((res) => {
            //alert(JSON.stringify(res));
          }));
        } else {
          userColumns = [];

          userColumns.push({
            SelectedColumns: cols
          });

          this.subscription.add(this._updateITNColumns.mutate( {
            itnUserColumns: userColumns,
            _id: Number(this.columnsVisibleId)
          }).subscribe((res) => {
            //alert(JSON.stringify(res));
          }));
        }

      //);

      this.subscription.add(
        this._fetchITNColumns
          .fetch(
            {
              userId: this.userId,
            },
            { fetchPolicy: 'network-only' }
          )
          .subscribe(
            (res) => {
              if (res.data.fetchITNUserColumns.length > 0) {
                this.columnsVisibleId = res.data.fetchITNUserColumns[0]._id.toString();
                this.setColSpans();
              }
            },
            (error) => {
              const err = error;
            }
          )
      );
    } catch (error) {
      alert(error);
    }

  }

  onLevelsChange(): void {
    let userLevels = [];
    const test = this.filterForm.get('lowLevelLimit').value;
    
    userLevels.push({
      UserID: Number(
        JSON.parse(sessionStorage.getItem('userInfo'))._id
      ),
      LowLevelLimit: Number(this.filterForm.get('lowLevelLimit').value),
      MediumLevelLimit: Number(this.filterForm.get('mediumLevelLimit').value)
    })

    if (this.columnsVisibleId === "") {
      this.subscription.add(this._insertITNLevels.mutate( {
        itnUserLevels: userLevels,
      }).subscribe((res) => {

      }));
    } else {
      userLevels = [];

      userLevels.push({
        LowLevelLimit: Number(this.filterForm.get('lowLevelLimit').value),
        MediumLevelLimit: Number(this.filterForm.get('mediumLevelLimit').value)
      })
      this.subscription.add(this._updateITNLevels.mutate( {
        itnUserLevels: userLevels,
        _id: Number(this.columnsVisibleId)
      }).subscribe((res) => {

      }));
    }
    const woot = "woot";
    //this.subscription.add(
      // this._fetchITNColumns
      //   .fetch(
      //     {
      //       userId: this.userId,
      //     },
      //     { fetchPolicy: 'network-only' }
      //   )
      //   .subscribe(
      //     (res) => {
      //       if (res.data.fetchITNUserColumns.length > 0) {
      //         this.columnsVisibleId = res.data.fetchITNUserColumns[0]._id.toString();
      //         this.setColSpans();
      //       }
      //     },
      //     (error) => {
      //       const err = error;
      //     }
      //   );
    //);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.templateList.unsubscribe();
  }

}
