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
  ],
  template: `<div *ngIf="info$ | async"></div>
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
              <th>ITN</th>
              <th>Trigger</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of auditPriority.data">
              <td>{{ data.InventoryTrackingNumber }}</td>
              <td>{{ data.Trigger }}</td>
              <td>
                <nz-select ngModel="{{ data.Priority }}">
                  <nz-option nzValue="1" nzLabel="1"></nz-option>
                  <nz-option nzValue="2" nzLabel="2"></nz-option>
                  <nz-option nzValue="3" nzLabel="3"></nz-option>
                  <nz-option nzValue="4" nzLabel="4"></nz-option>
                  <nz-option nzValue="5" nzLabel="5"></nz-option>
                  <nz-option nzValue="6" nzLabel="6"></nz-option>
                </nz-select>
              </td>
            </tr>
          </tbody>
        </nz-table>
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
  auditCount;
  message;
  priorityTableData = [];
  test = 'lucy';

  ngOnInit(): void {
    this.info$ = this.route.data.pipe(
      map((res) => {
        console.log(res);
        this.auditCount = res.InitData.auditCount.data.getAuditCount;

        res.InitData.auditPriority.data.fetchLocationAudits.forEach((audit) => {
          this.priorityTableData.push({
            _id: audit._id,
            InventoryTrackingNumber: audit.InventoryTrackingNumber,
            Priority: audit.Priority,
            Trigger: audit.Trigger,
          });
        });
      })
    );
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
