import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleRadioFormComponent } from 'src/app/shared/ui/input/single-radio-form.component';
import {
  combineLatest,
  of,
  tap,
  map,
  catchError,
  pipe,
  forkJoin,
  switchMap,
} from 'rxjs';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormsModule,
} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditInfoComponent } from '../../ui/audit-info.component';
import { AuditService } from '../../data/audit.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { Audit } from '../../utils/interfaces';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleRadioFormComponent,
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
    <single-radio-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="rohs"
      title="Select ROHS:"
      [options]="options"
      [isvalid]="this.inputForm.valid"
    >
    </single-radio-form>
    <div *ngIf="close$ | async"></div>
  `,
})
export class ROHSAudit implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _auditService: AuditService,
    private _eventLog: EventLogService
  ) {}

  public data$;
  public close$;
  public inputForm = this._fb.nonNullable.group({
    rohs: ['', [Validators.required]],
  });

  options = [
    {
      label: 'Yes',
      value: 'true',
    },
    {
      label: 'No',
      value: 'false',
    },
  ];

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
          Product: {
            PartNumber: currentAudit.Inventory.Product.PartNumber,
            ProductCode: {
              ProductCodeNumber:
                currentAudit.Inventory.Product.ProductCode.ProductCodeNumber,
            },
          },
        },
      };
    }

    this.data$ = of(true);
  }

  async onSubmit() {
    const rohs = this.inputForm.value.rohs;

    const userEventLogs = [
      {
        UserEventID: sqlData.Event_IM_ROHS_Entered,
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
        Message: 'Country of Origin: ' + this.inputForm.value.rohs,
      },
    ];

    const eventLogs = [
      {
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        EventTypeID: sqlData.Event_IM_ROHS_Entered,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
          COO: this.inputForm.value.rohs,
        }),
      },
    ];

    if (
      rohs != JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.ROHS
    ) {
      userEventLogs.push({
        UserEventID: sqlData.Event_IM_ROHS_Updated,
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
        Message:
          'Original ROHS: ' +
          JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.ROHS +
          ' --- New ROHS: ' +
          rohs,
      });

      eventLogs.push({
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        EventTypeID: sqlData.Event_IM_ROHS_Updated,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
          OriginalROHS: JSON.parse(sessionStorage.getItem('currentAudit'))
            .Inventory.ROHS,
          NewROHS: rohs,
        }),
      });
    }

    this.data$ = this._eventLog.insertLog(userEventLogs, eventLogs).pipe(
      switchMap((res) => {
        return this._auditService.inventoryUpdate(
          JSON.parse(sessionStorage.getItem('userInfo')).Name,
          sessionStorage.getItem('auditITN'),
          'Inventory Management Audit',
          '',
          '',
          '',
          rohs
        );
      }),
      switchMap((res) => {
        return this._auditService.deleteAudit(
          JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
          50
        );
      }),
      switchMap((res) => {
        return this._auditService
          .nextSubAudit$(
            JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
            Number(JSON.parse(sessionStorage.getItem('userInfo'))._id)
          )
          .pipe(
            tap((res) => {
              if (!res) {
                this.close$ = this._auditService
                  .closeAudit(
                    JSON.parse(sessionStorage.getItem('currentAudit'))
                      .InventoryID,
                    10,
                    JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                      .ITN,
                    JSON.parse(sessionStorage.getItem('userInfo')).Name
                  )
                  .pipe(
                    map((res) => {
                      this._router.navigate(['../verify/scan-itn'], {
                        relativeTo: this._actRoute,
                      });

                      return res;
                    })
                  );

                return of(true);
              } else {
                this._router.navigate(['../' + res.Route], {
                  relativeTo: this._actRoute,
                });

                return res;
              }
            })
          );
      }),
      catchError((error) => {
        return of({
          error: { message: error.message, type: 'error' },
        });
      })
    );
  }

  onBack() {
    this._router.navigate(['../scan-itn'], { relativeTo: this._actRoute });
  }
}
