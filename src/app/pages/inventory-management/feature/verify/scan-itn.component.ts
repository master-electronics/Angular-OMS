import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditInfoComponent } from '../../ui/audit-info.component';
import { AuditService } from '../../data/audit.service';
import {
  Audit,
  AuditType,
  Inventory,
  Product,
  ProductCode,
} from '../../utils/interfaces';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { EventLogService } from 'src/app/shared/services/eventLog.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    PopupModalComponent,
    NzModalModule,
    NzGridModule,
    FormsModule,
    AuditInfoComponent,
  ],
  template: `
    <ng-container *ngIf="auditInfo">
      <audit-info [auditInfo]="auditInfo"></audit-info>
    </ng-container>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="string"
      controlName="ITN"
      title="Scan ITN:"
      [isvalid]="this.inputForm.valid"
    >
    </single-input-form>
    <div style="height: 20px"></div>
    <div style="height: 20px"></div>
    <ng-container *ngIf="message">
      <popup-modal (clickSubmit)="onBack()" [message]="message"></popup-modal>
    </ng-container>
  `,
})
export class ScanITN implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _auditService: AuditService,
    private _eventLog: EventLogService
  ) {}

  public data$;
  public info$;
  public inputForm = this._fb.nonNullable.group({
    ITN: ['', [Validators.required]],
  });

  message;

  auditInfo: Audit;

  ngOnInit(): void {
    if (sessionStorage.getItem('currentAudit')) {
      const currentAudit: Audit = JSON.parse(
        sessionStorage.getItem('currentAudit')
      );
      this.auditInfo = {
        Container: {
          Barcode: currentAudit.Container.Barcode,
        },
        Inventory: {
          ITN: currentAudit.Inventory.ITN,
        },
      };
    }
    this.data$ = of(true);
  }

  onSubmit(): void {
    const input = this.inputForm.value.ITN.trim();

    if (ITNBarcodeRegex.test(input)) {
      if (this.auditInfo.Inventory.ITN != input) {
        this.data$ = of({
          error: { message: 'Incorrect ITN!', type: 'error' },
        });
      } else {
        const userEventLogs = [
          {
            UserEventID: sqlData.Event_IM_ITN_Scanned,
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            DistributionCenter: environment.DistributionCenter,
            InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
            Message: 'ITN: ' + this.inputForm.value.ITN,
          },
        ];

        const eventLogs = [
          {
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            EventTypeID: sqlData.Event_IM_ITN_Scanned,
            Log: JSON.stringify({
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
              ITN: this.inputForm.value.ITN,
            }),
          },
        ];

        this.data$ = this._eventLog.insertLog(userEventLogs, eventLogs).pipe(
          map((res) => {
            this._router.navigate(['../scan-location'], {
              relativeTo: this._actRoute,
            });

            return res;
          }),
          catchError((error) => {
            throw new Error(error);
          })
        );
      }
    } else {
      this.data$ = of({
        error: { message: 'Invalid ITN format', type: 'error' },
      });
    }
  }

  onBack(): void {
    this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
  }
}
