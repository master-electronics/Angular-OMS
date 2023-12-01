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
import { AuditService } from '../../data/audit.service';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzIconModule,
    MessageBarComponent,
    PopupModalComponent,
    NzButtonModule,
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

  ngOnInit(): void {
    this.info$ = this.route.data.pipe(
      map((res) => {
        this.auditCount = res.InitData.data.getAuditCount;
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
