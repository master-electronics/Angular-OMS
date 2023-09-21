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
    <ng-container *ngIf="info$ | async as info">
      <audit-info [auditInfo]="audit"></audit-info>
    </ng-container>
    <div style="height: 20px"></div>
    <div nz-row [nzGutter]="8">
      <div nz-col nzSpan="10" nzOffset="7" class="grid h-12">
        <button
          (click)="onNotFound()"
          class="h-full w-full rounded-lg bg-red-700 font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-red-200  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          type="button"
        >
          Not Found
        </button>
      </div>
    </div>
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

  audit: Audit;

  ngOnInit(): void {
    sessionStorage.removeItem('currentAudit');
    sessionStorage.removeItem('auditITN');
    this.audit = null;

    this.info$ = this._actRoute.data.pipe(
      map((res) => {
        if (!res.Audit.InventoryID) {
          this.message = 'There are no more Audits';
          return of(false);
        } else {
          this.audit = res.Audit;
          sessionStorage.setItem('currentAudit', JSON.stringify(this.audit));
          return of(true);
        }
      })
    );
    this.data$ = of(true);
  }

  onSubmit(): void {
    const input = this.inputForm.value.ITN.trim();

    if (ITNBarcodeRegex.test(input)) {
      if (this.audit.Inventory.ITN != input) {
        this.data$ = of({
          error: { message: 'Incorrect ITN!', type: 'error' },
        });
      } else {
        sessionStorage.setItem('auditITN', this.audit.Inventory.ITN);

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
          switchMap((res) => {
            return this._auditService
              .nextSubAudit$(
                this.audit.InventoryID,
                Number(JSON.parse(sessionStorage.getItem('userInfo'))._id)
              )
              .pipe(
                tap((audit) => {
                  if (!audit) {
                    //next itn
                  }
                }),
                map((audit) => {
                  if (audit) {
                    this._router.navigate(['../' + audit.Route], {
                      relativeTo: this._actRoute,
                    });
                  } else {
                    this._router.navigate(['../../menu'], {
                      relativeTo: this._actRoute,
                    });
                  }

                  return audit;
                })
              );
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

  onNotFound(): void {
    this._router.navigate(['../search/scan-location'], {
      relativeTo: this._actRoute,
    });
  }
}
