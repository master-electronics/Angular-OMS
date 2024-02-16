import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  Observable,
  catchError,
  combineLatest,
  forkJoin,
  lastValueFrom,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AuditService } from '../../data/audit.service';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { environment } from 'src/environments/environment';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzIconModule,
    MessageBarComponent,
    PopupModalComponent,
    NzButtonModule,
    NzTableModule,
    NzSelectModule,
    FormsModule,
    NzDropDownModule,
    NzPopconfirmModule,
  ],
  template: `<div *ngIf="info$ | async"></div>
    <div *ngIf="data$ | async"></div>
    <div nz-row>
      <div nz-col><h1>Clear Audits</h1></div>
    </div>
    <div nz-row nzJustify="start">
      <div nz-col nzSpan="1"></div>
      <div nz-col nzSpan="3">Audit Count:</div>
      <div nz-col nzSpan="1">{{ auditCount }}</div>
      <div nz-col>
        <button nz-button nzType="primary" nzSize="default" (click)="onClick()">
          <span nz-icon nzType="delete" nzTheme="outline"></span>
        </button>
      </div>
    </div>
    <div style="height: 30px"></div>
    <div nz-row>
      <div nz-col><h1>Audit Priorities</h1></div>
    </div>
    <div nz-row nzJustify="start">
      <div nz-col nzSpan="1"></div>
      <div nz-col>
        <nz-table #auditPriority [nzData]="priorityTableData">
          <thead>
            <tr>
              <th
                [nzSortOrder]="'ascend'"
                [nzSortDirections]="['ascend', 'descend']"
                [nzSortFn]="itnSortFn"
                nzCustomFilter
                nzWidth="200px"
              >
                ITN
                <nz-filter-trigger
                  [nzDropdownMenu]="itnMenu"
                  [(nzVisible)]="itnSearchVisible"
                  [nzActive]="itnSearchActive"
                >
                  <i nz-icon nzType="search"></i>
                </nz-filter-trigger>
                <nz-dropdown-menu #itnMenu="nzDropdownMenu">
                  <div class="ant-table-filter-dropdown">
                    <div class="grid grid-cols-2 gap-2 px-2 py-2">
                      <input
                        type="text"
                        nz-input
                        oninput="this.value = this.value"
                        placeholder="ITN"
                        class="col-span-2"
                        #itnSearchInput
                      />
                      <button
                        nz-button
                        nzSize="small"
                        nzType="primary"
                        (click)="itnFilter(itnSearchInput.value)"
                        class="search-button"
                      >
                        Search
                      </button>
                      <button
                        nz-button
                        nzSize="small"
                        (click)="itnSearchInput.value = ''; clearItnFilter()"
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
                [nzSortFn]="triggerSortFn"
              >
                Trigger
              </th>
              <th
                [nzSortOrder]="'ascend'"
                [nzSortDirections]="['ascend', 'descend']"
                [nzSortFn]="prioritySortFn"
              >
                Priority
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of auditPriority.data">
              <ng-container *ngIf="!data.edit; else editTemplate">
                <td>{{ data.InventoryTrackingNumber }}</td>
                <td>{{ data.Trigger }}</td>
                <td>{{ data.Priority }}</td>
                <td>
                  <button nz-button (click)="startEdit(data._id)" title="Edit">
                    <i nz-icon nzType="edit" nzTheme="outline"></i>
                  </button>
                  <button
                    nz-button
                    nz-popconfirm
                    nzPopconfirmTitle="Are you sure you want to delete this audit?"
                    (nzOnConfirm)="deleteAudit(data._id)"
                    title="Delete"
                  >
                    <i nz-icon nzType="delete" nzTheme="outline"></i>
                  </button>
                </td>
              </ng-container>
              <ng-template #editTemplate>
                <td>{{ data.InventoryTrackingNumber }}</td>
                <td>{{ data.Trigger }}</td>
                <td>
                  <nz-select
                    #editPriority
                    [(ngModel)]="data.Priority"
                    (ngModelChange)="test($event)"
                  >
                    <nz-option nzValue="1" nzLabel="1"></nz-option>
                    <nz-option nzValue="2" nzLabel="2"></nz-option>
                    <nz-option nzValue="3" nzLabel="3"></nz-option>
                    <nz-option nzValue="4" nzLabel="4"></nz-option>
                    <nz-option nzValue="5" nzLabel="5"></nz-option>
                    <nz-option nzValue="6" nzLabel="6"></nz-option>
                  </nz-select>
                </td>
                <td>
                  <button nz-button (click)="saveAudit(data._id)" title="Save">
                    <i nz-icon nzType="check" nzTheme="outline"></i>
                  </button>
                  <button
                    nz-button
                    (click)="cancelEdit(data._id)"
                    title="Cancel"
                  >
                    <i nz-icon nzType="close" nzTheme="outline"></i>
                  </button>
                </td>
              </ng-template>
            </tr>
          </tbody>
        </nz-table>
      </div>
    </div>
    <div class="flexContainer">
      <div *ngIf="error" class="alertContainer">
        <message-bar [message]="error.message" [name]="errorType"></message-bar>
      </div>
    </div>
    <ng-container *ngIf="this.message">
      <popup-modal
        (clickSubmit)="clearAudits()"
        (clickCancel)="onCancel()"
        [message]="message"
      ></popup-modal>
    </ng-container>
    <div class="flexContainer">
      <div class="buttonContainer">
        <button
          nz-button
          type="default"
          nzSize="large"
          class="backButton w-full"
          (click)="onBack()"
        >
          Back
        </button>
      </div>
    </div>
    <div *ngIf="clear$ | async"></div>`,
  styleUrls: ['./maintenance.component.css'],
})
export class Maintenance implements OnInit {
  userInfo = inject(StorageUserInfoService);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _auditService: AuditService
  ) {}

  info$;
  clear$;
  data$;
  auditCount;
  message;
  priorityTableData = [];
  priorityTableDataOrig = [];
  itnSearchVisible;
  itnSearchActive;
  error;
  errorType;

  test(value: string): void {
    console.log(value);
  }

  ngOnInit(): void {
    this.info$ = this.route.data.pipe(
      map((res) => {
        this.auditCount = res.InitData.auditCount.data.getAuditCount;

        res.InitData.auditPriority.data.fetchLocationAudits.forEach((audit) => {
          this.priorityTableData.push({
            _id: audit._id,
            InventoryTrackingNumber: audit.InventoryTrackingNumber,
            Priority: audit.Priority.toString(),
            Trigger: audit.Trigger,
          });
          this.priorityTableDataOrig.push({
            _id: audit._id,
            InventoryTrackingNumber: audit.InventoryTrackingNumber,
            Priority: audit.Priority.toString(),
            Trigger: audit.Trigger,
          });
        });
      })
    );
  }

  itnSortFn = function (a, b): number {
    if (a.InventoryTrackingNumber < b.InventoryTrackingNumber) {
      return -1;
    }

    if (a.InventoryTrackingNumber == b.InventoryTrackingNumber) {
      return 0;
    }

    return 1;
  };

  triggerSortFn = function (a, b): number {
    if (a.Trigger < b.Trigger) {
      return -1;
    }

    if (a.Trigger == b.Trigger) {
      return 0;
    }

    return 1;
  };

  prioritySortFn = function (a, b): number {
    if (a.Priority < b.Priority) {
      return -1;
    }

    if (a.Prioirty == b.Priority) {
      return 0;
    }

    return 1;
  };

  itnFilter(FilterValue: string) {
    this.itnSearchVisible = true;
    this.itnSearchActive = true;

    const audits = [];

    this.priorityTableData.forEach((audit) => {
      if (audit.InventoryTrackingNumber.indexOf(FilterValue) !== -1) {
        audits.push(audit);
      }
    });

    this.priorityTableData = audits;
  }

  clearItnFilter() {
    this.itnSearchVisible = false;
    this.itnSearchActive = false;
    this.priorityTableData = JSON.parse(
      JSON.stringify(this.priorityTableDataOrig)
    );
  }

  startEdit(id: number): void {
    const audit = this.priorityTableData.find((item) => item._id == id);

    if (audit) {
      audit.edit = true;
    }
  }

  cancelEdit(id: number): void {
    const audit = this.priorityTableData.find((item) => item._id == id);
    const origAudit = this.priorityTableDataOrig.find((item) => item._id == id);

    if (audit && origAudit) {
      audit.Priority = origAudit.Priority;
      audit.edit = false;
    }
  }

  deleteAudit(id: number) {
    this.error = null;
    this.errorType = null;

    const audits = JSON.parse(JSON.stringify(this.priorityTableData));
    const audit = audits.find((item) => item._id == id);

    if (audit) {
      const index = audits.indexOf(audit);

      if (index >= 0) {
        audits.splice(index, 1);
        this.priorityTableData = JSON.parse(JSON.stringify(audits));
        this.priorityTableDataOrig = JSON.parse(
          JSON.stringify(this.priorityTableData)
        );
      }
    }
    this.data$ = this._auditService.removeAudit(id).pipe(
      catchError((error) => {
        const msg = error.message.toString();
        this.error = { message: msg };

        return of({
          error: { message: this.error.message, type: 'error' },
        });
      })
    );
  }

  saveAudit(id: number): void {
    const audit = this.priorityTableData.find((item) => item._id == id);

    if (audit) {
      console.log(id);
      console.log(Number(audit.Priority));
      this.data$ = this._auditService.updateAudit(id, Number(audit.Priority));
    }

    audit.edit = false;
  }

  onClick() {
    this.message = 'Are you sure you want to clear all Audits?';
  }

  clearAudits() {
    this.clear$ = this._auditService
      .clearAudits(this.userInfo.userName, environment.DistributionCenter)
      .pipe(
        map((res) => {
          this.auditCount = 0;
        }),
        catchError((error) => {
          console.log(error);
          return of(false);
        })
      );

    this.message = null;
  }

  onCancel() {
    this.message = null;
  }

  onBack() {
    this.router.navigate(['../menu'], { relativeTo: this.route });
  }
}
