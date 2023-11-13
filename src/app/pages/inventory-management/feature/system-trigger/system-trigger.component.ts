import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { AuditService } from '../../data/audit.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    NzListModule,
    NzTableModule,
    NzDropDownModule,
    NzSwitchModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    MessageBarComponent,
    PopupModalComponent,
    NzButtonModule,
    SubmitButtonComponent,
  ],
  template: `
    <div *ngIf="info$ | async"></div>
    <div nz-row>
      <div nz-col nzSpan="12">
        <nz-table
          #triggerTable
          nzBordered
          [nzData]="auditList"
          [nzTitle]="auditListHeader"
          [nzFooter]="auditListFooter"
        >
          <thead>
            <tr>
              <th
                [nzSortOrder]="'ascend'"
                [nzSortDirections]="['ascend', 'descend']"
                [nzSortFn]="nameSortFn"
                nzCustomFilter
              >
                Name
                <nz-filter-trigger
                  [nzDropdownMenu]="nameMenu"
                  [(nzVisible)]="searchVisible"
                  [nzActive]="searchActive"
                >
                  <i nz-icon nzType="search"></i>
                </nz-filter-trigger>
                <nz-dropdown-menu #nameMenu="nzDropdownMenu">
                  <div class="ant-table-filter-dropdown">
                    <div class="grid grid-cols-2 gap-2 px-2 py-2">
                      <input
                        type="text"
                        nz-input
                        oninput="this.value = this.value"
                        placeholder="Name"
                        class="col-span-2"
                        #searchInput
                      />
                      <button
                        nz-button
                        nzSize="small"
                        nzType="primary"
                        (click)="nameFilter(searchInput.value)"
                        class="search-buton"
                      >
                        Search
                      </button>
                      <button
                        nz-button
                        nzSize="small"
                        (click)="searchInput.value = ''; clearFilter()"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </nz-dropdown-menu>
              </th>
              <th
                [nzSortOrder]="'ascend'"
                [nzSortDirections]="['ascend', 'descend']"
                [nzSortFn]="descriptionSortFn"
              >
                Description
              </th>
              <th
                [nzSortOrder]="'ascend'"
                [nzSortDirections]="['ascend', 'descend']"
                [nzSortFn]="prioritySortFn"
              >
                Priority
              </th>
              <th nzAlign="right"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of triggerTable.data">
              <td>{{ data.Name }}</td>
              <td>{{ data.Description }}</td>
              <td>{{ data.Priority }}</td>
              <td nzAlign="right">
                <a (click)="editSystemTrigger(data._id)">
                  <span
                    nz-icon
                    nzType="edit"
                    nzTheme="outline"
                    title="Edit System Trigger"
                    style="padding-right: 20px;"
                  ></span
                ></a>
                <a
                  *ngIf="data.Active"
                  (click)="deactivateSystemTrigger(data._id)"
                  ><span
                    nz-icon
                    nzType="stop"
                    nzTheme="outline"
                    title="Deactivate System Trigger"
                  ></span
                ></a>
                <a
                  *ngIf="!data.Active"
                  (click)="activateSystemTrigger(data._id)"
                  ><span
                    nz-icon
                    nzType="check"
                    nzTheme="outline"
                    title="Reactivate System Trigger"
                  ></span
                ></a>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </div>
      <div nz-col nzSpan="12">
        <div class="flexContainer">
          <div class="formArea">
            <div class="formAreaHeader">Trigger Information</div>
            <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
              <input
                nz-input
                placeholder="Name"
                nzSize="large"
                formControlName="triggerName"
              />
              <input
                nz-input
                placeholder="Description"
                nzSize="large"
                formControlName="triggerDescription"
              />
              <select formControlName="triggerPriority">
                <option [ngValue]="null" [disabled]="true">Priority</option>
                <option [ngValue]="1">1</option>
                <option [ngValue]="2">2</option>
                <option [ngValue]="3">3</option>
                <option [ngValue]="4">4</option>
                <option [ngValue]="5">5</option>
                <option [ngValue]="6">6</option>
                <option [ngValue]="7">7</option>
                <option [ngValue]="8">8</option>
                <option [ngValue]="9">9</option>
                <option [ngValue]="10">10</option>
                <option [ngValue]="11">11</option>
                <option [ngValue]="12">12</option>
                <option [ngValue]="13">13</option>
              </select>
            </form>
          </div>
          <div class="formArea">
            <div class="flexContainer">
              <div class="title">
                <div class="formAreaHeader">Select Audit Types</div>
              </div>
            </div>
            <div class="flexContainer">
              <div class="container">
                <select
                  multiple
                  [(ngModel)]="selectedTypes"
                  size="8"
                  [disabled]="formDisabled"
                >
                  <option *ngFor="let type of auditTypes" [ngValue]="type">
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div>
                <div>
                  <div>
                    <span
                      nz-icon
                      nzType="right"
                      nzTheme="outline"
                      class="button"
                      (click)="includeSelected()"
                    ></span>
                  </div>
                  <div>
                    <span
                      nz-icon
                      nzType="vertical-left"
                      nzTheme="outline"
                      class="button"
                      (click)="includeAll()"
                    ></span>
                  </div>
                  <div>
                    <span
                      nz-icon
                      nzType="left"
                      nzTheme="outline"
                      class="button"
                      (click)="removeSelected()"
                    ></span>
                  </div>
                  <div>
                    <span
                      nz-icon
                      nzType="vertical-right"
                      nzTheme="outline"
                      class="button"
                      (click)="removeAll()"
                    ></span>
                  </div>
                </div>
              </div>
              <div class="container">
                <select
                  multiple
                  [(ngModel)]="selectedRemovalTypes"
                  size="8"
                  [disabled]="formDisabled"
                >
                  <option
                    *ngFor="let type of includedAuditTypeList"
                    [ngValue]="type"
                    [disabled]="type.disabled"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="flexContainer">
          <div class="buttonContainer">
            <button
              nz-button
              type="submit"
              nzType="primary"
              nzSize="large"
              class="w-full"
              (click)="onSubmit()"
              [disabled]="formDisabled"
            >
              Save
            </button>
          </div>
          <div class="buttonContainer">
            <button
              nz-button
              type="default"
              nzSize="large"
              class="backButton w-full"
              (click)="onCancel()"
              [disabled]="formDisabled"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ng-template #auditListHeader>
        <div style="clear: both">
          <span style="font-size: 1.25em">System Triggers</span>
          <span style="display: inline-block; float: right; margin-right: 7px;">
            <span
              nz-icon
              nzType="plus"
              nzTheme="outline"
              title="New System Trigger"
              class="plusButton"
              (click)="addSystemTrigger()"
            ></span>
          </span>
        </div>
      </ng-template>
      <ng-template #auditListFooter>
        <nz-switch
          [(ngModel)]="includeDeactivated"
          (ngModelChange)="onSwitchChange()"
        ></nz-switch
        ><span style="padding-left: 10px;">Include Deactivated</span>
      </ng-template>
    </div>
    <div *ngIf="data$ | async"></div>
  `,
  styleUrls: ['./system-trigger.component.css'],
})
export class SystemTrigger implements OnInit {
  userInfo = inject(StorageUserInfoService);
  constructor(
    private _actRoute: ActivatedRoute,
    private router: Router,
    private _fb: FormBuilder,
    private _auditService: AuditService,
    private _eventLog: EventLogService
  ) {}

  inputForm: FormGroup;
  info$;
  data$;
  auditTypes = [];
  auditList;
  auditListOrig;
  selectedTypes;
  selectedRemovalTypes;
  auditTypeList = [];
  includedAuditTypeList = [
    {
      name: 'Location',
      value: 10,
      disabled: true,
    },
  ];
  formDisabled = true;
  selectedAuditID;
  searchVisible;
  searchActive;
  includeDeactivated = false;

  nameSortFn = function (a, b): number {
    if (a.Name < b.Name) {
      return -1;
    }

    if (a.Name == b.Name) {
      return 0;
    }

    return 1;
  };

  descriptionSortFn = function (a, b): number {
    if (a.Description < b.Description) {
      return -1;
    }

    if (a.Description == b.Description) {
      return 0;
    }

    return 1;
  };

  prioritySortFn = function (a, b): number {
    if (Number(a.Priority) < Number(b.Priority)) {
      return -1;
    }

    if (Number(a.Priority) == Number(b.Priority)) {
      return 0;
    }

    return 1;
  };

  ngOnInit(): void {
    this.selectedAuditID = null;
    this.auditList = [];
    this.auditListOrig = [];

    this.inputForm = this._fb.group({
      triggerName: [''],
      triggerDescription: [''],
      triggerPriority: [null],
    });

    this.inputForm.disable();

    this.info$ = this._actRoute.data.pipe(
      map((res) => {
        res.InitData.AuditTypes.forEach((type) => {
          if (type.name != 'Location') {
            this.auditTypeList.push({
              name: type.name,
              value: type.value,
              disabled: type.name == 'Location',
            });

            this.auditTypes.push({
              name: type.name,
              value: type.value,
              disabled: type.name == 'Location',
            });
          }
        });
        res.InitData.SystemAudits.forEach((audit) => {
          this.auditList.push(audit);
          this.auditListOrig.push(audit);
        });
      })
    );
  }

  onSwitchChange() {
    const audits = [];
    const auditsOrig = [];
    this.info$ = this._auditService
      .getSystemAuditList(this.includeDeactivated)
      .pipe(
        map((res) => {
          const t = 'test';
          res.forEach((audit) => {
            audits.push(audit);
            auditsOrig.push(audit);
          });

          this.auditList = JSON.parse(JSON.stringify(audits));
          this.auditListOrig = JSON.parse(JSON.stringify(auditsOrig));
        })
      );
  }

  onSubmit() {
    const name = this.inputForm.value.triggerName;
    const description = this.inputForm.value.triggerDescription;
    const priority = Number(this.inputForm.value.triggerPriority);
    const auditTypes = [];
    const auditTypeIds = [];

    this.includedAuditTypeList.forEach((type) => {
      auditTypes.push({
        Type: type.name,
        IMAuditTypeID: type.value,
        disabled: type.disabled,
      });
      auditTypeIds.push(type.value);
    });

    if (this.selectedAuditID) {
      const userEVentLogs = [
        {
          UserEventID: sqlData.Event_IM_System_Trigger_Updated,
          UserName: this.userInfo.userName,
          DistributionCenter: environment.DistributionCenter,
          Message:
            'SystemTriggerID: ' +
            this.selectedAuditID +
            ' | SystemTriggerName: ' +
            name +
            ' | SystemTriggerDescription: ' +
            description +
            ' | SystemTriggerPriority: ' +
            priority,
        },
      ];

      const eventLogs = [
        {
          UserName: this.userInfo.userName,
          EventTypeID: sqlData.Event_IM_System_Trigger_Updated,
          Log: JSON.stringify({
            DistributionCenter: environment.DistributionCenter,
            SystemTriggerID: this.selectedAuditID,
            SystemTriggerName: name,
            SystemTriggerDescription: description,
            SystemTriggerPriority: priority,
            SystemTriggerActive: true,
            AuditTypeIDs: auditTypeIds,
          }),
        },
      ];

      this.data$ = this._eventLog.insertLog(userEVentLogs, eventLogs).pipe(
        switchMap(() => {
          return this._auditService
            .updateSystemTrigger(
              Number(this.selectedAuditID),
              {
                Name: name,
                Description: description,
                Priority: priority,
              },
              auditTypeIds
            )
            .pipe(
              map(() => {
                this.inputForm.disable();
                this.formDisabled = true;
                this.inputForm.patchValue({
                  triggerName: '',
                  triggerDescription: '',
                  triggerPriority: null,
                });

                this.includedAuditTypeList.forEach((type) => {
                  if (type.name != 'Location') {
                    const exists = this.auditTypes.find((item) => item == type);

                    if (!exists) {
                      this.auditTypes.push(type);
                    }
                  }
                });

                this.auditTypes.sort((a, b) => {
                  if (Number(a.value) < Number(b.value)) {
                    return -1;
                  }

                  if (Number(a.value) == Number(b.value)) {
                    return 0;
                  }

                  return 1;
                });

                this.includedAuditTypeList.splice(
                  1,
                  this.includedAuditTypeList.length
                );

                const audit = this.auditList.find(
                  (item) => item._id == this.selectedAuditID
                );

                if (audit) {
                  audit.Name = name;
                  audit.Description = description;
                  audit.Priority = priority;
                  audit.IMTrigger_AuditTypes = auditTypes;
                }
              }),
              catchError((error) => {
                return of({ error });
              })
            );
        }),
        catchError((error) => {
          return of(error);
        })
      );
    } else {
      const userEVentLogs = [
        {
          UserEventID: sqlData.Event_IM_System_Trigger_Created,
          UserName: this.userInfo.userName,
          DistributionCenter: environment.DistributionCenter,
          Message:
            'SystemTriggerID: ' +
            this.selectedAuditID +
            ' | SystemTriggerName: ' +
            name +
            ' | SystemTriggerDescription: ' +
            description +
            ' | SystemTriggerPriority: ' +
            priority,
        },
      ];

      const eventLogs = [
        {
          UserName: this.userInfo.userName,
          EventTypeID: sqlData.Event_IM_System_Trigger_Created,
          Log: JSON.stringify({
            DistributionCenter: environment.DistributionCenter,
            SystemTriggerID: this.selectedAuditID,
            SystemTriggerName: name,
            SystemTriggerDescription: description,
            SystemTriggerPriority: priority,
            AuditTypeIDs: auditTypeIds,
          }),
        },
      ];

      this.data$ = this._eventLog.insertLog(userEVentLogs, eventLogs).pipe(
        switchMap(() => {
          return this._auditService
            .insertSystemTrigger(
              {
                Name: name,
                Description: description,
                Priority: priority,
                Active: true,
              },
              auditTypeIds
            )
            .pipe(
              map(() => {
                this.inputForm.disable();
                this.formDisabled = true;
                this.inputForm.patchValue({
                  triggerName: '',
                  triggerDescription: '',
                  triggerPriority: null,
                });

                this.includedAuditTypeList.forEach((type) => {
                  if (type.name != 'Location') {
                    const exists = this.auditTypes.find((item) => item == type);

                    if (!exists) {
                      this.auditTypes.push(type);
                    }
                  }
                });

                this.auditTypes.sort((a, b) => {
                  if (Number(a.value) < Number(b.value)) {
                    return -1;
                  }

                  if (Number(a.value) == Number(b.value)) {
                    return 0;
                  }

                  return 1;
                });

                this.includedAuditTypeList.splice(
                  1,
                  this.includedAuditTypeList.length
                );

                const audits = JSON.parse(JSON.stringify(this.auditList));

                const audit = {
                  Name: name,
                  Description: description,
                  Priority: priority,
                  Active: true,
                  IMTrigger_AuditTypes: auditTypes,
                };

                audits.push(audit);

                this.auditList = audits;
              }),
              catchError((error) => {
                return of(error);
              })
            );
        }),
        catchError((error) => {
          return of(error);
        })
      );
    }
  }

  onCancel() {
    this.inputForm.disable();
    this.formDisabled = true;
    this.inputForm.patchValue({
      triggerName: '',
      triggerDescription: '',
      triggerPriority: null,
    });

    this.includedAuditTypeList.forEach((type) => {
      if (type.name != 'Location') {
        const exists = this.auditTypes.find((item) => item == type);

        if (!exists) {
          this.auditTypes.push(type);
        }
      }
    });

    this.auditTypes.sort((a, b) => {
      if (Number(a.value) < Number(b.value)) {
        return -1;
      }

      if (Number(a.value) == Number(b.value)) {
        return 0;
      }

      return 1;
    });

    this.includedAuditTypeList.splice(1, this.includedAuditTypeList.length);
  }

  addSystemTrigger() {
    this.selectedAuditID = null;
    this.inputForm.enable();
    this.formDisabled = false;
    this.inputForm.patchValue({
      triggerName: '',
      triggerDescription: '',
      triggerPriority: null,
    });

    this.includedAuditTypeList.forEach((type) => {
      if (type.name != 'Location') {
        const exists = this.auditTypes.find((item) => item == type);

        if (!exists) {
          this.auditTypes.push(type);
        }
      }
    });

    this.auditTypes.sort((a, b) => {
      if (Number(a.value) < Number(b.value)) {
        return -1;
      }

      if (Number(a.value) == Number(b.value)) {
        return 0;
      }

      return 1;
    });

    this.includedAuditTypeList.splice(1, this.includedAuditTypeList.length);
  }

  editSystemTrigger(ID) {
    this.auditTypes = JSON.parse(JSON.stringify(this.auditTypeList));
    this.selectedAuditID = ID;
    this.inputForm.enable();
    this.formDisabled = false;
    this.includedAuditTypeList = [
      {
        name: 'Location',
        value: 10,
        disabled: true,
      },
    ];
    const selectedTrigger = this.auditList.find((item) => item._id == ID);

    if (selectedTrigger) {
      this.inputForm.patchValue({
        triggerName: selectedTrigger.Name,
        triggerDescription: selectedTrigger.Description,
        triggerPriority: selectedTrigger.Priority,
      });

      selectedTrigger.IMTrigger_AuditTypes.forEach((type) => {
        if (type.Type != 'Location') {
          this.includedAuditTypeList.push({
            name: type.Type,
            value: type.IMAuditTypeID,
            disabled: false,
          });

          const item = this.auditTypes.find(
            (item) => item.value == type.IMAuditTypeID
          );

          if (item) {
            const index = this.auditTypes.indexOf(item);
            this.auditTypes.splice(index, 1);
          }
        }
      });
    }
  }

  activateSystemTrigger(ID) {
    const auditTypes = [];
    const auditTypeIds = [];
    this.includedAuditTypeList.forEach((type) => {
      auditTypes.push({
        Type: type.name,
        IMAuditTypeID: type.value,
        disabled: type.disabled,
      });
      auditTypeIds.push(type.value);
    });

    const userEVentLogs = [
      {
        UserEventID: sqlData.Event_IM_System_Trigger_Updated,
        UserName: this.userInfo.userName,
        DistributionCenter: environment.DistributionCenter,
        Message: 'SystemTriggerID: ' + ID,
      },
    ];

    const eventLogs = [
      {
        UserName: this.userInfo.userName,
        EventTypeID: sqlData.Event_IM_System_Trigger_Updated,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          SystemTriggerID: ID,
          SystemTriggerActive: true,
        }),
      },
    ];

    this.data$ = this._eventLog.insertLog(userEVentLogs, eventLogs).pipe(
      switchMap(() => {
        return this._auditService
          .updateSystemTrigger(
            Number(ID),
            {
              Active: true,
            },
            auditTypeIds
          )
          .pipe(
            map(() => {
              const audits = JSON.parse(JSON.stringify(this.auditList));
              const audit = audits.find((item) => item._id == ID);

              if (audit) {
                if (this.includeDeactivated) {
                  audit.Active = true;
                } else {
                  const index = audits.indexOf(audit);
                  if (index !== -1) {
                    audits.splice(index, 1);
                  }
                }
              }

              this.auditList = audits;
            }),
            catchError((error) => {
              throw new Error(error);
            })
          );
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  deactivateSystemTrigger(ID) {
    const auditTypes = [];
    const auditTypeIds = [];
    this.includedAuditTypeList.forEach((type) => {
      auditTypes.push({
        Type: type.name,
        IMAuditTypeID: type.value,
        disabled: type.disabled,
      });
      auditTypeIds.push(type.value);
    });

    const userEVentLogs = [
      {
        UserEventID: sqlData.Event_IM_System_Trigger_Updated,
        UserName: this.userInfo.userName,
        DistributionCenter: environment.DistributionCenter,
        Message: 'SystemTriggerID: ' + ID,
      },
    ];

    const eventLogs = [
      {
        UserName: this.userInfo.userName,
        EventTypeID: sqlData.Event_IM_System_Trigger_Updated,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          SystemTriggerID: ID,
          SystemTriggerActive: false,
        }),
      },
    ];

    this.data$ = this._eventLog.insertLog(userEVentLogs, eventLogs).pipe(
      switchMap(() => {
        return this._auditService
          .updateSystemTrigger(
            Number(ID),
            {
              Active: false,
            },
            auditTypeIds
          )
          .pipe(
            map(() => {
              const audits = JSON.parse(JSON.stringify(this.auditList));
              const audit = audits.find((item) => item._id == ID);

              if (audit) {
                if (this.includeDeactivated) {
                  audit.Active = false;
                } else {
                  const index = audits.indexOf(audit);
                  if (index !== -1) {
                    audits.splice(index, 1);
                  }
                }
              }

              this.auditList = audits;
            }),
            catchError((error) => {
              throw new Error(error);
            })
          );
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  includeSelected(): void {
    if (!this.formDisabled) {
      this.selectedTypes?.forEach((type) => {
        const exists = this.includedAuditTypeList.find((item) => item == type);

        if (!exists) {
          this.includedAuditTypeList.push(type);
          const index = this.auditTypes.indexOf(type);
          this.auditTypes.splice(index, 1);
        }
      });

      this.includedAuditTypeList.sort((a, b) => {
        if (Number(a.value) < Number(b.value)) {
          return -1;
        }

        if (Number(a.value) == Number(b.value)) {
          return 0;
        }

        return 1;
      });
    }
  }

  includeAll(): void {
    if (!this.formDisabled) {
      this.auditTypes.forEach((type) => {
        const exists = this.includedAuditTypeList.find((item) => item == type);

        if (!exists) {
          this.includedAuditTypeList.push(type);
        }
      });

      this.includedAuditTypeList.sort((a, b) => {
        if (Number(a.value) < Number(b.value)) {
          return -1;
        }

        if (Number(a.value) == Number(b.value)) {
          return 0;
        }

        return 1;
      });

      this.auditTypes.splice(0, this.auditTypes.length);
    }
  }

  removeSelected(): void {
    if (!this.formDisabled) {
      this.selectedRemovalTypes?.forEach((type) => {
        const exists = this.auditTypes.find((item) => item == type);

        if (!exists) {
          this.auditTypes.push(type);
          const index = this.includedAuditTypeList.indexOf(type);
          this.includedAuditTypeList.splice(index, 1);
        }
      });

      this.auditTypes.sort((a, b) => {
        if (Number(a.value) < Number(b.value)) {
          return -1;
        }

        if (Number(a.value) == Number(b.value)) {
          return 0;
        }

        return 1;
      });
    }
  }

  removeAll(): void {
    if (!this.formDisabled) {
      this.includedAuditTypeList.forEach((type) => {
        if (type.name != 'Location') {
          const exists = this.auditTypes.find((item) => item == type);

          if (!exists) {
            this.auditTypes.push(type);
          }
        }
      });

      this.auditTypes.sort((a, b) => {
        if (Number(a.value) < Number(b.value)) {
          return -1;
        }

        if (Number(a.value) == Number(b.value)) {
          return 0;
        }

        return 1;
      });

      this.includedAuditTypeList.splice(1, this.includedAuditTypeList.length);
    }
  }

  nameFilter(FilterValue: string) {
    this.searchVisible = true;
    this.searchActive = true;

    const audits = [];

    this.auditList.forEach((audit) => {
      if (audit.Name.indexOf(FilterValue) !== -1) {
        audits.push(audit);
      }
    });

    this.auditList = audits;
  }

  clearFilter() {
    this.searchVisible = false;
    this.searchActive = false;

    this.auditList = JSON.parse(JSON.stringify(this.auditListOrig));
  }
}
