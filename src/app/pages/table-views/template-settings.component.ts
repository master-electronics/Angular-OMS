import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Column } from '../../column';
import { ColumnSelectorComponent } from './column-selector.component';
import { Template } from '../../template';
import { LevelLimit } from 'src/app/LevelLimit';
import { Observable, Subscription, Subject } from 'rxjs';
import { FindItnTemplateGQL, Update_ItnUserTemplateGQL, 
  Delete_ItnLevelLimitGQL, Insert_ItnLevelLimitGQL,
  Insert_ItnUserTemplateGQL, Delete_ItnUserTemplateGQL } from 'src/app/graphql/tableViews.graphql-gen';
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
  //@Output() checked: EventEmitter<any> = new EventEmitter();
  //@Output() unchecked: EventEmitter<any> = new EventEmitter();
  //@Output() saveTemplate: EventEmitter<any> = new EventEmitter();
  @Output() modalClosed: EventEmitter<any> = new EventEmitter();
  @Input('templates') templates: Template[];
  @Input('columns') columns: Column[];
  @Input('selectedColumns') selectedColumns: string[];
  //@Input('templateId') templateId: number;
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
  //columnsVisible = [];
  tempSelectedColumns: string[];
  isVisible = false;
  tempIdStr;
  selectedTemplateId;
  levelLimits;
  //templateNameValue: string;
  //value: boolean = false;
  limitsNotifier: Subject<any> = new Subject<any>();
  //childNotifier : Subject<any> = new Subject<any>();
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
  ) {}

  templateForm = this.fb.group({
    templateName: []
  });

  ngOnInit(): void {
    this.selectedTemplateId = 1;
    this.columnSelector.columns = this.columns;
    //this.tempSelectedColumns = this.selectedColumns;
    this.columnSelector.selectedColumns = this.selectedColumns;
  }

  // notifyTest() {
  //   this.value = !this.value;
  //   this.testN.next(this.value);
  // }

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

  handleCancel(): void {
    this.setMessage("");
    this.isVisible = false;
  }

  handleClose(): void {
    this.templateId = null;
    this.selectedTemplateId = null;
    this.templateNameValue = null;
    this.selectedColumns = [];
    this.modalClosed.emit();
  }

  handleOk(): void {
    if (this.templateNameValue === "") {
      this.setMessage("Template Name Required");
    }
    else
    {
    let cols = "";
    let sep = "";
    let err = "";

    for (let i=0; i<this.tempSelectedColumns.length; i++) {
      cols+=sep+this.tempSelectedColumns[i];
      sep=",";
    }

    this.updateTempSub.add(
      this._updateITNTemplate.mutate(
        {
          _id: this.templateId,
          templateName: this.templateForm.get('templateName').value,
          selectedColumns: cols
        }).subscribe((res) => {
          //
          this.deleteLevelLimitSub.add(
            this._deleteITNLevelLimit.mutate(
            {
              templateID: this.templateId
            }).subscribe((res) => {
              for(let i = 0; i<this.levelLimits.length;i++) {
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
          //
        },
        (error) => {
          err = error;
          this.setMessage("Error Saving Template");
        }
      )
    );
    }
  }

  setMessage(msg): void {
    this.message = msg;
  }

  addTemplate(input: HTMLInputElement): void {
    const UserInfo = sessionStorage.getItem('userInfo');
    const userId = JSON.parse(UserInfo)._id;

    let sep = "";
    let cols = "";

    for (let i=0; i < this.columns.length; i++) {
      cols+=sep+this.columns[i].name;
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
            ) .subscribe((res) => 
              {
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

  onLevelsChanged(e): void {
    this.levelLimits = e;
  }

  onColumnSelected(e): void {
    //this.checked.emit(e.target.name);
    const i = this.tempSelectedColumns.indexOf(e.target.name);
 
    if (i == -1) {
      this.tempSelectedColumns.push(e.target.name);
    }
      
    //this.setColSpans();
  }
      
  onColumnUnselected(e): void {
    //this.unchecked.emit(e.target.name);
    const i = this.tempSelectedColumns.indexOf(e.target.name);
      
    if (i > -1) {
      this.tempSelectedColumns.splice(i, 1);
    }
      
    // this.setColSpans();
  }

  onAllColumnsSelected(e): void {
    const i = this.tempSelectedColumns.indexOf(e);

    if (i == -1) {
      this.tempSelectedColumns.push(e);
    }
  }

  onAllColumnsUnselected(e): void {
    const i = this.tempSelectedColumns.indexOf(e);

    if (i > -1) {
      this.tempSelectedColumns.splice(i, 1);
    }
  }

  onTemplateChange(e): void {
    this.setMessage("");
    const args = e.split(',');

    this.templateId = Number(args[0]);
    this.templateNameValue = args[1];

    this.loadTemplate();
    this.templateNameValue = args[1];

  }

  loadTemplate(): void {
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
                this.levelLimits = [];

                for (let i=0; i<res.data.findITNTemplate[0].ITNLEVELLIMITs.length; i++) {
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
    
                    //template["limits"] = limits;
                } 
                
                //template["limits"] = limits;
                this.limits = limits;
                
                //this.value = !this.value;

                //this.limits = testL;
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