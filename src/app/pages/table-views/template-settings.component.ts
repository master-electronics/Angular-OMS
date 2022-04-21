import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Column } from '../../column';
import { ColumnSelectorComponent } from './column-selector.component';
import { Template } from '../../template';
import { LevelLimit } from 'src/app/LevelLimit';
import { Observable, Subscription, Subject } from 'rxjs';
import {
  FindItnTemplateGQL, Update_ItnUserTemplateGQL,
  Delete_ItnLevelLimitGQL, Insert_ItnLevelLimitGQL,
  Insert_ItnUserTemplateGQL, Delete_ItnUserTemplateGQL
} from 'src/app/graphql/tableViews.graphql-gen';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'template-settings',
  template: `
        <button nz-button (click)="showModal()"><i nz-icon nzType="form" nzTheme="outline" title="Template Settings"></i></button>
        <nz-modal [(nzVisible)]="isVisible" nzTitle="Template Settings"
          [nzFooter]="footer"
          nzOkText="Save"
            (nzOnCancel)="handleCancel()"
            (nzOnOk)="handleOk()"
            (nzAfterClose)="handleClose()">            
            <ng-container *nzModalContent>
                <nz-select class="templateSelect"
                  [nzDropdownRender]="renderTemplate"
                    [(ngModel)]="selectedTemplateId"
                    [ngModelOptions]="{ standalone: true }"
                    (ngModelChange)="onTemplateChange($event)"
                    nzPlaceHolder="Select Template">
                    <nz-option *ngFor="let template of templates" nzValue="{{ template.id }},{{ template.name }}" nzLabel="{{ template.name }}"></nz-option>
                </nz-select>
                <ng-template #renderTemplate>
                  <nz-divider></nz-divider>
                  <div class="container">
                    <input type="text" nz-input #inputElement />
                    <a class="add-item" (click)="addTemplate(inputElement)">
                      <i nz-icon nzType="plus"></i>
                      Add Item
                    </a>
                  </div>
                </ng-template>
                <form [formGroup]="templateForm">
                      <input nz-input type="text" class="textBox"
                        PlaceHolder="Template Name" *ngIf="templateId" 
                        [(ngModel)]="templateNameValue"
                        value="{{ templateNameValue }}" formControlName="templateName" />
                </form>
                <button nz-button nzDanger *ngIf="templateId"
                  (click)="deleteTemplate()">
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                </button>                            
                <tabs-view
                    (checked)="onColumnSelected($event)"
                    (unchecked)="onColumnUnselected($event)"
                    (allChecked)="onAllColumnsSelected($event)"
                    (allUnchecked)="onAllColumnsUnselected($event)"
                    (levelsUpdated)="onLevelsChanged($event)"
                    [columns]="columns"
                    [selectedColumns]="selectedColumns"
                    [allColumns]="allColumns"
                    [limitsNotifier]="limitsNotifier"></tabs-view>
            </ng-container>
            <ng-template #footer>
              <span style="margin-right: 10px;">{{ message }}</span>
              <button nz-button nzType="default" (click)="handleCancel()">Cancel</button>
              <button nz-button nzType="primary" (click)="handleOk()" [disabled]="(templateId) ? 'false' : 'true'">Save</button>
            </ng-template>
        </nz-modal>
    `,
  styleUrls: ['./template-settings.component.css']
})
export class TemplateSettings {
  @Output() modalClosed: EventEmitter<any> = new EventEmitter();
  @Input('templates') templates: Template[];
  @Input('columns') columns: Column[];
  @Input('selectedColumns') selectedColumns: string[];
  @Input('templateNameValue') templateNameValue: string;

  columnSelector: ColumnSelectorComponent = new ColumnSelectorComponent();
  private selTempSub = new Subscription();
  private updateTempSub = new Subscription();
  private deleteLevelLimitSub = new Subscription();
  private insertLevelLimitSub = new Subscription();
  private insertTemplateSub = new Subscription();
  private deleteTemplateSub = new Subscription();
  templateId: number;
  selectedTemplate: Template;
  limits = [];
  tempSelectedColumns: string[];
  isVisible = false;
  tempIdStr;
  selectedTemplateId;
  levelLimits;
  limitsNotifier: Subject<any> = new Subject<any>();
  allColumns: boolean;
  message

  constructor(
    private _findITNTemplate: FindItnTemplateGQL,
    private _updateITNTemplate: Update_ItnUserTemplateGQL,
    private _deleteITNLevelLimit: Delete_ItnLevelLimitGQL,
    private _insertITNLevelLimit: Insert_ItnLevelLimitGQL,
    private _insertITNTemplate: Insert_ItnUserTemplateGQL,
    private _deleteITNTemplate: Delete_ItnUserTemplateGQL,
    private fb: FormBuilder,
    private modal: NzModalService
  ) { }

  templateForm = this.fb.group({
    templateName: []
  });

  ngOnInit(): void {
    this.selectedTemplateId = 1;
    this.columnSelector.columns = this.columns;
    this.columnSelector.selectedColumns = this.selectedColumns;
  }

  //display settings screen
  showModal(): void {
    this.setMessage("");
    if (this.templateId) {
      this.tempIdStr = this.templateId.toString();
    }

    if (this.selectedColumns) {
      this.tempSelectedColumns = this.selectedColumns;
    }

    this.isVisible = true;
  }

  //close settings screen when canceled 
  handleCancel(): void {
    this.setMessage("");
    this.isVisible = false;
  }

  //clear out setting inputs and trigger page to be redisplayed when settings screen closes
  handleClose(): void {
    this.templateId = null;
    this.selectedTemplateId = null;
    this.templateNameValue = null;
    this.selectedColumns = [];
    this.allColumns = false;
    this.modalClosed.emit();
  }

  //save user template changes when Save is clicked
  handleOk(): void {
    if (this.templateNameValue === "") {
      this.setMessage("Template Name Required");
    }
    else {
      let cols = "";
      let sep = "";
      let err = "";

      for (let i = 0; i < this.tempSelectedColumns.length; i++) {
        cols += sep + this.tempSelectedColumns[i];
        sep = ",";
      }

      this.updateTempSub.add(
        //update ITNUSERTEMPLATE record
        this._updateITNTemplate.mutate(
          {
            _id: this.templateId,
            templateName: this.templateForm.get('templateName').value,
            selectedColumns: cols
          }).subscribe((res) => {
            //delete all ITNLEVELLIMIT records for template
            this.deleteLevelLimitSub.add(
              this._deleteITNLevelLimit.mutate(
                {
                  templateID: this.templateId
                }).subscribe((res) => {
                  //add new ITNLEVELLIMIT records from settings screen
                  for (let i = 0; i < this.levelLimits.length; i++) {
                    this.insertLevelLimitSub.add(
                      this._insertITNLevelLimit.mutate(
                        {
                          templateID: this.templateId,
                          eventName: this.levelLimits[i].eventName,
                          eventID: Number(this.levelLimits[i].eventId),
                          lowLevelLimit: Number(this.levelLimits[i].lowLimit),
                          mediumLevelLimit: Number(this.levelLimits[i].mediumLimit)
                        }
                      ).subscribe((res) => {
                        this.setMessage("Template Saved");
                      },
                        (error) => {
                          err = error;
                          this.setMessage("Error Saving Template");
                        })
                    )
                  };
                },
                  (error) => {
                    err = error;
                    this.setMessage("Error Saving Template");
                  }
                )
            );
          },
            (error) => {
              err = error;
              this.setMessage("Error Saving Template");
            }
          )
      );
    }
  }

  //display message
  setMessage(msg): void {
    this.message = msg;
  }

  //add new INTUSERTEMPLATE record with all columns selected and no limits set
  addTemplate(input: HTMLInputElement): void {
    const UserInfo = sessionStorage.getItem('userInfo');
    const userId = JSON.parse(UserInfo)._id;

    let sep = "";
    let cols = "";

    for (let i = 0; i < this.columns.length; i++) {
      cols += sep + this.columns[i].name;
      sep = ",";
    }

    this.insertTemplateSub.add(
      this._insertITNTemplate.mutate(
        {
          userID: userId,
          templateName: input.value,
          selectedColumns: cols
        }
      ).subscribe((res) => {
        const templateId = res.data.insertITNUserTemplate._id
        const template: Template = { name: input.value, id: templateId };
        this.templates.push(template);

        const limits =
          [
            {
              eventName: 'Pick',
              eventID: 301
            },
            {
              eventName: 'QC',
              eventID: 200
            },
            {
              eventName: 'Ag',
              eventID: 1
            },
            {
              eventName: 'Pulling',
              eventID: 400
            },
            {
              eventName: 'DropOff',
              eventID: 500
            }
          ];

        //add a ITNLEVELLIMIT row for each event type with limits set to 0
        for (let i = 0; i < limits.length; i++) {
          this.insertLevelLimitSub.add(
            this._insertITNLevelLimit.mutate(
              {
                templateID: templateId,
                eventName: limits[i].eventName,
                eventID: Number(limits[i].eventID),
                lowLevelLimit: 0,
                mediumLevelLimit: 0
              }
            ).subscribe((res) => {
              this.setMessage("Template Added");
            },
              (error) => {
                this.setMessage("Error Adding Template");
              })
          )
        };
      },
        (error) => {
          this.setMessage("Error Adding Template");
        })
    );
  }

  //delete template by deleting ITNUSERTEMPLATE record and all associated ITNLEVELLIMIT records
  deleteTemplate(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this Template?',
      nzOnOk: () => {
        this.deleteLevelLimitSub.add(
          this._deleteITNLevelLimit.mutate(
            {
              templateID: this.templateId
            }
          ).subscribe((res) => {
            this.deleteTemplateSub.add(
              this._deleteITNTemplate.mutate(
                {
                  _id: Number(this.templateId)
                }
              ).subscribe((res) => {
                const template = this.templates.find(e => e.id == this.templateId)
                const i = this.templates.indexOf(template);

                if (i > -1) {
                  this.templates.splice(i, 1);
                }

                this.templateId = null;
                this.selectedTemplateId = null;
                this.templateNameValue = null;
                this.selectedColumns = [];

                this.limits = [
                  {
                    eventName: 'Pick',
                    eventId: 301,
                    lowLevelLimit: null,
                    mediumLevelLimit: null
                  },
                  {
                    eventName: 'QC',
                    eventId: 200,
                    lowLevelLimit: null,
                    mediumLevelLimit: null
                  },
                  {
                    eventName: 'Ag',
                    eventId: 1,
                    lowLevelLimit: null,
                    mediumLevelLimit: null
                  },
                  {
                    eventName: 'Pulling',
                    eventId: 400,
                    lowLevelLimit: null,
                    mediumLevelLimit: null
                  },
                  {
                    eventName: 'DropOff',
                    eventId: 500,
                    lowLevelLimit: null,
                    mediumLevelLimit: null
                  }
                ];
                this.limitsNotifier.next(this.limits);

                this.setMessage("Template Deleted");
              },
                (error) => {
                  console.log(error);
                  this.setMessage("Error Deleting Template");
                })
            );
          },
            (error) => {
              console.log(error);
              this.setMessage("Error Deleting Template");
            })
        )
      }
    });
  }

  //receive updated limits from the tabs-view component when any levels are changed there
  onLevelsChanged(e): void {
    this.levelLimits = e;
  }

  //receive event from tabs-view when a column is selected
  //and update temp columns list that will be used if the user saves the template
  onColumnSelected(e): void {
    const i = this.tempSelectedColumns.indexOf(e.target.name);

    if (i == -1) {
      this.tempSelectedColumns.push(e.target.name);
    }

  }

  //receive event from tabs-view when a column is unselected
  //and update temp columns list that will be used if the user saves the template
  onColumnUnselected(e): void {
    const i = this.tempSelectedColumns.indexOf(e.target.name);

    if (i > -1) {
      this.tempSelectedColumns.splice(i, 1);
    }

  }

  //receive event from tabs-view when all checkbox is selected
  //and update temp columns list that will be used if the user saves the template
  onAllColumnsSelected(e): void {
    const i = this.tempSelectedColumns.indexOf(e);

    if (i == -1) {
      this.tempSelectedColumns.push(e);
    }
  }

  //receive event from tabs-view when all checkbox is unselected
  //and update temp columns list that will be used if the user saves the template
  onAllColumnsUnselected(e): void {
    const i = this.tempSelectedColumns.indexOf(e);

    if (i > -1) {
      this.tempSelectedColumns.splice(i, 1);
    }
  }

  //handle user chaning template select value.  Set templateId and templateNameValue and load new template data
  onTemplateChange(e): void {
    this.setMessage("");
    const args = e.split(',');

    this.templateId = Number(args[0]);
    this.templateNameValue = args[1];

    this.loadTemplate();
    this.templateNameValue = args[1];

  }

  //load selected columns and level limits for selected template
  loadTemplate(): void {
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
                let limits = [];
                this.levelLimits = [];

                for (let i = 0; i < res.data.findITNTemplate[0].ITNLEVELLIMITs.length; i++) {
                  let limit: LevelLimit = {
                    id: res.data.findITNTemplate[0].ITNLEVELLIMITs[i]._id,
                    templateId: res.data.findITNTemplate[0].ITNLEVELLIMITs[i].TemplateID,
                    eventName: res.data.findITNTemplate[0].ITNLEVELLIMITs[i].EventName,
                    eventId: res.data.findITNTemplate[0].ITNLEVELLIMITs[i].EventID,
                    lowLevelLimit: res.data.findITNTemplate[0].ITNLEVELLIMITs[i].LowLevelLimit,
                    mediumLevelLimit: res.data.findITNTemplate[0].ITNLEVELLIMITs[i].MediumLevelLimit
                  };

                  limits.push(limit);
                  this.levelLimits.push(
                    {
                      eventName: limit.eventName,
                      eventId: limit.eventId,
                      lowLimit: limit.lowLevelLimit,
                      mediumLimit: limit.mediumLevelLimit
                    }
                  )
                }

                this.limits = limits;

                this.limitsNotifier.next(this.limits);
              }
              this.selectedTemplate = template;
            }
            this.selectedColumns = this.selectedTemplate.selectedColumns.split(',');
            this.tempSelectedColumns = this.selectedColumns;

            if (this.columns.length == this.selectedColumns.length) {
              this.allColumns = true;
            } else {
              this.allColumns = false;
            }
          }
        )
    )
  }

  ngOnDestroy(): void {
    this.selTempSub.unsubscribe();
    this.updateTempSub.unsubscribe();
    this.deleteLevelLimitSub.unsubscribe();
    this.insertLevelLimitSub.unsubscribe();
    this.insertTemplateSub.unsubscribe();
    this.deleteTemplateSub.unsubscribe();
    this.limitsNotifier.unsubscribe();
  }
}