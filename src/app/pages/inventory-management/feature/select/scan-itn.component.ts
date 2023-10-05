import { Component, OnInit, inject } from '@angular/core';
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
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { OMSConfigService } from 'src/app/shared/services/oms-config.service';

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
    <div *ngIf="close$ | async"></div>
  `,
})
export class ScanITN implements OnInit {
  userInfo = inject(StorageUserInfoService);
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _auditService: AuditService,
    private _eventLog: EventLogService,
    private _configService: OMSConfigService
  ) {}

  public data$;
  public info$;
  public close$;
  public config$;
  public inputForm = this._fb.nonNullable.group({
    ITN: ['', [Validators.required]],
  });

  message;
  valid: boolean;
  audit: Audit;

  ngOnInit(): void {
    sessionStorage.removeItem('currentAudit');
    sessionStorage.removeItem('auditITN');
    sessionStorage.removeItem('searchLocations');
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

  test() {
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    this.info$ = this._auditService
      .validateAssignment$(currentAudit._id, 14)
      .pipe(
        map((res) => {
          this.valid = res.data.validateAssignment;
        })
      );
  }

  onSubmit(): void {
    const input = this.inputForm.value.ITN.trim();
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    this.info$ = this._auditService
      .validateAssignment$(currentAudit._id, this.userInfo.userId)
      .pipe(
        map((res) => {
          if (!res.data.validateAssignment) {
            this.message = 'This Audit has timed out!';
            sessionStorage.removeItem('currentAudit');
            sessionStorage.removeItem('auditITN');

            return of(true);
          } else {
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
                    UserName: this.userInfo.userName,
                    DistributionCenter: environment.DistributionCenter,
                    InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                    Message: 'ITN: ' + this.inputForm.value.ITN,
                  },
                ];

                const eventLogs = [
                  {
                    UserName: this.userInfo.userName,
                    EventTypeID: sqlData.Event_IM_ITN_Scanned,
                    Log: JSON.stringify({
                      DistributionCenter: environment.DistributionCenter,
                      InventoryTrackingNumber: this.inputForm.value.ITN,
                      ParentITN: currentAudit.Inventory.ParentITN,
                      BinLocation: currentAudit.Container.Barcode,
                      QuantityOnHand: currentAudit.Inventory.Quantity,
                      OriginalQuantity: currentAudit.Inventory.OriginalQuantity,
                      DateCode: currentAudit.Inventory.DateCode,
                      CountryOfOrigin: currentAudit.Inventory.COO,
                      ROHS: currentAudit.Inventory.ROHS,
                      NotFound: currentAudit.Inventory.NotFound,
                      Suspect: currentAudit.Inventory.Suspect,
                      LocatedInAutostore:
                        currentAudit.Inventory.LocatedInAutostore,
                      BoundForAutostore:
                        currentAudit.Inventory.BoundForAutostore,
                      PartNumber: currentAudit.Inventory.Product.PartNumber,
                      ProductCode:
                        currentAudit.Inventory.Product.ProductCode
                          .ProductCodeNumber,
                      Description: currentAudit.Inventory.Product.Description,
                      ProductTier: currentAudit.Inventory.Product.ProductTier,
                      ProductType:
                        currentAudit.Inventory.Product.ProductType.ProductType,
                      ProductTypeDescription:
                        currentAudit.Inventory.Product.ProductType.Description,
                      Velocity: currentAudit.Inventory.Product.Velocity,
                      MICPartNumber:
                        currentAudit.Inventory.Product.MICPartNumber,
                      UOM: currentAudit.Inventory.Product.UOM,
                      Autostore: currentAudit.Inventory.Product.Autostore,
                      PackType: currentAudit.Inventory.Product.PackType,
                      PackQuantity: currentAudit.Inventory.Product.PackQty,
                      Cost: currentAudit.Inventory.Product.Cost,
                    }),
                  },
                ];

                this.data$ = this._eventLog
                  .insertLog(userEventLogs, eventLogs)
                  .pipe(
                    switchMap((res) => {
                      return this._auditService
                        .nextSubAudit$(
                          this.audit.InventoryID,
                          this.userInfo.userId
                        )
                        .pipe(
                          tap((audit) => {
                            if (!audit) {
                              const closeUerEventLog = [
                                {
                                  UserEventID: sqlData.Event_IM_Audit_Completed,
                                  UserName: this.userInfo.userName,
                                  DistributionCenter:
                                    environment.DistributionCenter,
                                  InventoryTrackingNumber:
                                    this.audit.Inventory.ITN,
                                },
                              ];

                              const closeEventLog = [
                                {
                                  UserName: this.userInfo.userName,
                                  EventTypeID: sqlData.Event_IM_Audit_Completed,
                                  Log: JSON.stringify({
                                    DistributionCenter:
                                      environment.DistributionCenter,
                                    InventoryTrackingNumber:
                                      sessionStorage.getItem('auditITN'),
                                    ParentITN: currentAudit.Inventory.ParentITN,
                                    BinLocation: currentAudit.Container.Barcode,
                                    QuantityOnHand:
                                      currentAudit.Inventory.Quantity,
                                    OriginalQuantity:
                                      currentAudit.Inventory.OriginalQuantity,
                                    DateCode: currentAudit.Inventory.DateCode,
                                    CountryOfOrigin: currentAudit.Inventory.COO,
                                    ROHS: currentAudit.Inventory.ROHS,
                                    NotFound: currentAudit.Inventory.NotFound,
                                    Suspect: currentAudit.Inventory.Suspect,
                                    LocatedInAutostore:
                                      currentAudit.Inventory.LocatedInAutostore,
                                    BoundForAutostore:
                                      currentAudit.Inventory.BoundForAutostore,
                                    PartNumber:
                                      currentAudit.Inventory.Product.PartNumber,
                                    ProductCode:
                                      currentAudit.Inventory.Product.ProductCode
                                        .ProductCodeNumber,
                                    Description:
                                      currentAudit.Inventory.Product
                                        .Description,
                                    ProductTier:
                                      currentAudit.Inventory.Product
                                        .ProductTier,
                                    ProductType:
                                      currentAudit.Inventory.Product.ProductType
                                        .ProductType,
                                    ProductTypeDescription:
                                      currentAudit.Inventory.Product.ProductType
                                        .Description,
                                    Velocity:
                                      currentAudit.Inventory.Product.Velocity,
                                    MICPartNumber:
                                      currentAudit.Inventory.Product
                                        .MICPartNumber,
                                    UOM: currentAudit.Inventory.Product.UOM,
                                    Autostore:
                                      currentAudit.Inventory.Product.Autostore,
                                    PackType:
                                      currentAudit.Inventory.Product.PackType,
                                    PackQuantity:
                                      currentAudit.Inventory.Product.PackQty,
                                    Cost: currentAudit.Inventory.Product.Cost,
                                  }),
                                },
                              ];

                              this.close$ = this._eventLog
                                .insertLog(closeUerEventLog, closeEventLog)
                                .pipe(
                                  switchMap((res) => {
                                    return this._auditService
                                      .closeAudit(
                                        this.audit.InventoryID,
                                        10,
                                        this.audit.Inventory.ITN,
                                        this.userInfo.userName
                                      )
                                      .pipe(
                                        map((res) => {
                                          this._router.navigate(
                                            ['../verify/scan-location'],
                                            {
                                              relativeTo: this._actRoute,
                                            }
                                          );

                                          return res;
                                        })
                                      );
                                  })
                                );

                              return of(true);
                            } else {
                              this._router.navigate(['../' + audit.Route], {
                                relativeTo: this._actRoute,
                              });

                              return res;
                            }
                          }),
                          catchError((error) => {
                            return of({
                              error: { message: error.message, type: 'error' },
                            });
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

            return of(true);
          }
        })
      );
  }

  onBack(): void {
    this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
  }

  onNotFound(): void {
    const audit: Audit = JSON.parse(sessionStorage.getItem('currentAudit'));
    sessionStorage.setItem('searchLevel', '1');

    const userEventLog = [
      {
        UserEventID: sqlData.Event_IM_Audit_ITN_NF,
        UserName: this.userInfo.userName,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: audit.Inventory.ITN,
      },
    ];

    const eventLog = [
      {
        UserName: this.userInfo.userName,
        EventTypeID: sqlData.Event_IM_Audit_ITN_NF,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: audit.Inventory.ITN,
          ParentITN: audit.Inventory.ParentITN,
          BinLocation: audit.Container.Barcode,
          QuantityOnHand: audit.Inventory.Quantity,
          OriginalQuantity: audit.Inventory.OriginalQuantity,
          DateCode: audit.Inventory.DateCode,
          CountryOfOrigin: audit.Inventory.COO,
          ROHS: audit.Inventory.ROHS,
          NotFound: audit.Inventory.NotFound,
          Suspect: audit.Inventory.Suspect,
          LocatedInAutostore: audit.Inventory.LocatedInAutostore,
          BoundForAutostore: audit.Inventory.BoundForAutostore,
          PartNumber: audit.Inventory.Product.PartNumber,
          ProductCode: audit.Inventory.Product.ProductCode.ProductCodeNumber,
          Description: audit.Inventory.Product.Description,
          ProductTier: audit.Inventory.Product.ProductTier,
          ProductType: audit.Inventory.Product.ProductType.ProductType,
          ProductTypeDescription:
            audit.Inventory.Product.ProductType.Description,
          Velocity: audit.Inventory.Product.Velocity,
          MICPartNumber: audit.Inventory.Product.MICPartNumber,
          UOM: audit.Inventory.Product.UOM,
          Autostore: audit.Inventory.Product.Autostore,
          PackType: audit.Inventory.Product.PackType,
          PackQuantity: audit.Inventory.Product.PackQty,
          Cost: audit.Inventory.Product.Cost,
        }),
      },
    ];

    this.data$ = this._eventLog.insertLog(userEventLog, eventLog).pipe(
      map((res) => {
        this._router.navigate(['../search/scan-location'], {
          relativeTo: this._actRoute,
        });

        return res;
      })
    );
  }
}
