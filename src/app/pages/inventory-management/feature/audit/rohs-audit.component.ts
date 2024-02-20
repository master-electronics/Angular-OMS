import { Component, OnInit, inject } from '@angular/core';
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
  Subscription,
  interval,
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
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { BeepBeep } from 'src/app/shared/utils/beeper';

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
    <ng-container *ngIf="message">
      <popup-modal (clickSubmit)="onBack()" [message]="message"></popup-modal>
    </ng-container>
    <ng-container *ngIf="this.showTimeoutAlert">
      <popup-modal
        (clickSubmit)="resetTimeout()"
        [message]="timeoutAlert"
      ></popup-modal>
    </ng-container>
    <div *ngIf="info$ | async"></div>
    <div *ngIf="close$ | async"></div>
  `,
})
export class ROHSAudit implements OnInit {
  userInfo = inject(StorageUserInfoService);
  subscription: Subscription;
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _auditService: AuditService,
    private _eventLog: EventLogService
  ) {}

  public data$;
  public close$;
  public info$;
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
  message;
  auditTimeout: number;
  alertTime: number;
  lastUpdated: number;
  timeoutSeconds = 0;
  showTimeoutAlert;
  timeoutAlert;

  ngOnInit(): void {
    if (sessionStorage.getItem('currentAudit')) {
      const currentAudit: Audit = JSON.parse(
        sessionStorage.getItem('currentAudit')
      );

      this.lastUpdated = Number(currentAudit.LastUpdated);
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

    this.info$ = this._actRoute.data.pipe(
      map((res) => {
        this.auditTimeout =
          res?.Config?.auditTimeout?.data?.fetchConfigValue?.Value;
        this.alertTime = res?.Config?.alertTime?.data?.fetchConfigValue?.Value;

        const timeoutTimer = interval(1000);
        this.subscription = timeoutTimer.subscribe((val) => this.timer());
      })
    );

    this.data$ = of(true);
  }

  timer() {
    ++this.timeoutSeconds;
    const secondsRemaining =
      (this.lastUpdated +
        this.auditTimeout * 1000 -
        (this.timeoutSeconds * 1000 + this.lastUpdated)) /
      1000;

    if (secondsRemaining == 0) {
      this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
      return;
    }

    if (secondsRemaining == this.alertTime) {
      const beep = new BeepBeep();
      beep.beep(100, 520);
      this.showTimeoutAlert = true;
    }

    let minutes = Math.floor(secondsRemaining / 60);
    let extraSeconds = secondsRemaining % 60;
    const minutesStr =
      minutes < 10 ? '0' + minutes.toString() : minutes.toString();
    const secondsStr =
      extraSeconds < 10
        ? '0' + extraSeconds.toString()
        : extraSeconds.toString();

    this.timeoutAlert =
      'Audit will timeout in ' + minutesStr + ':' + secondsStr;
  }

  resetTimeout() {
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    this.info$ = this._auditService
      .updateLastUpdated(
        currentAudit.InventoryID,
        10,
        new Date(Date.now()).toISOString()
      )
      .pipe(
        map(() => {
          currentAudit.LastUpdated = new Date(Date.now()).getTime().toString();
          sessionStorage.setItem('currentAudit', JSON.stringify(currentAudit));
        }),
        catchError((error) => {
          return of({ error });
        })
      );

    this.timeoutSeconds = 0;
    this.showTimeoutAlert = false;
  }

  async onSubmit() {
    const rohs = this.inputForm.value.rohs;
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
            const userEventLogs = [
              {
                UserEventID: sqlData.Event_IM_ROHS_Entered,
                UserName: this.userInfo.userName,
                DistributionCenter: this.userInfo.distributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                Message: 'Country of Origin: ' + rohs,
              },
            ];

            const eventLogs = [
              {
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_ROHS_Entered,
                Log: JSON.stringify({
                  DistributionCenter: this.userInfo.distributionCenter,
                  InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                  ParentITN: currentAudit.Inventory.ParentITN,
                  BinLocation: currentAudit.Container.Barcode,
                  QuantityOnHand: currentAudit.Inventory.Quantity,
                  OriginalQuantity: currentAudit.Inventory.OriginalQuantity,
                  DateCode: currentAudit.Inventory.DateCode,
                  CountryOfOrigin: currentAudit.Inventory.COO,
                  ROHS: currentAudit.Inventory.ROHS,
                  ROHSEntered: rohs,
                  NotFound: currentAudit.Inventory.NotFound,
                  Suspect: currentAudit.Inventory.Suspect,
                  LocatedInAutostore: currentAudit.Inventory.LocatedInAutostore,
                  BoundForAutostore: currentAudit.Inventory.BoundForAutostore,
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
                  MICPartNumber: currentAudit.Inventory.Product.MICPartNumber,
                  UOM: currentAudit.Inventory.Product.UOM,
                  Autostore: currentAudit.Inventory.Product.Autostore,
                  PackType: currentAudit.Inventory.Product.PackType,
                  PackQuantity: currentAudit.Inventory.Product.PackQty,
                  Cost: currentAudit.Inventory.Product.Cost,
                }),
              },
            ];

            if (
              rohs !=
              JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.ROHS
            ) {
              userEventLogs.push({
                UserEventID: sqlData.Event_IM_ROHS_Updated,
                UserName: this.userInfo.userName,
                DistributionCenter: this.userInfo.distributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                Message:
                  'Original ROHS: ' +
                  JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                    .ROHS +
                  ' --- New ROHS: ' +
                  rohs,
              });

              eventLogs.push({
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_ROHS_Updated,
                Log: JSON.stringify({
                  DistributionCenter: this.userInfo.distributionCenter,
                  InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                  ParentITN: currentAudit.Inventory.ParentITN,
                  BinLocation: currentAudit.Container.Barcode,
                  QuantityOnHand: currentAudit.Inventory.Quantity,
                  OriginalQuantity: currentAudit.Inventory.OriginalQuantity,
                  DateCode: currentAudit.Inventory.DateCode,
                  CountryOfOrigin: currentAudit.Inventory.COO,
                  ROHS: currentAudit.Inventory.ROHS,
                  NotFound: currentAudit.Inventory.NotFound,
                  Suspect: currentAudit.Inventory.Suspect,
                  LocatedInAutostore: currentAudit.Inventory.LocatedInAutostore,
                  BoundForAutostore: currentAudit.Inventory.BoundForAutostore,
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
                  MICPartNumber: currentAudit.Inventory.Product.MICPartNumber,
                  UOM: currentAudit.Inventory.Product.UOM,
                  Autostore: currentAudit.Inventory.Product.Autostore,
                  PackType: currentAudit.Inventory.Product.PackType,
                  PackQuantity: currentAudit.Inventory.Product.PackQty,
                  Cost: currentAudit.Inventory.Product.Cost,
                  NewROHS: rohs,
                }),
              });
            }

            this.data$ = this._eventLog
              .insertLog(userEventLogs, eventLogs)
              .pipe(
                switchMap(() => {
                  return this._auditService.updateLastUpdated(
                    currentAudit.InventoryID,
                    50,
                    new Date(Date.now()).toISOString()
                  );
                }),
                switchMap(() => {
                  return this._auditService.updateLastUpdated(
                    currentAudit.InventoryID,
                    10,
                    new Date(Date.now()).toISOString()
                  );
                }),
                switchMap((res) => {
                  return this._auditService.inventoryUpdate(
                    this.userInfo.userName,
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
                    JSON.parse(sessionStorage.getItem('currentAudit'))
                      .InventoryID,
                    50
                  );
                }),
                switchMap((res) => {
                  return this._auditService
                    .nextSubAudit$(
                      JSON.parse(sessionStorage.getItem('currentAudit'))
                        .InventoryID,
                      this.userInfo.userId
                    )
                    .pipe(
                      tap((res) => {
                        if (!res) {
                          const closeUserEventLog = [
                            {
                              UserEventID: sqlData.Event_IM_Audit_Completed,
                              UserName: this.userInfo.userName,
                              DistributionCenter:
                                this.userInfo.distributionCenter,
                              InventoryTrackingNumber:
                                sessionStorage.getItem('auditITN'),
                            },
                          ];

                          const closeEventLog = [
                            {
                              UserName: this.userInfo.userName,
                              EventTypeID: sqlData.Event_IM_Audit_Completed,
                              Log: JSON.stringify({
                                DistributionCenter:
                                  this.userInfo.distributionCenter,
                                InventoryTrackingNumber:
                                  sessionStorage.getItem('auditITN'),
                                ParentITN: currentAudit.Inventory.ParentITN,
                                BinLocation: currentAudit.Container.Barcode,
                                QuantityOnHand: currentAudit.Inventory.Quantity,
                                OriginalQuantity:
                                  currentAudit.Inventory.OriginalQuantity,
                                DateCode: currentAudit.Inventory.DateCode,
                                CountryOfOrigin: currentAudit.Inventory.COO,
                                ROHS: currentAudit.Inventory.ROHS,
                                ROHSEntered: rohs,
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
                                  currentAudit.Inventory.Product.Description,
                                ProductTier:
                                  currentAudit.Inventory.Product.ProductTier,
                                ProductType:
                                  currentAudit.Inventory.Product.ProductType
                                    .ProductType,
                                ProductTypeDescription:
                                  currentAudit.Inventory.Product.ProductType
                                    .Description,
                                Velocity:
                                  currentAudit.Inventory.Product.Velocity,
                                MICPartNumber:
                                  currentAudit.Inventory.Product.MICPartNumber,
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
                            .insertLog(closeUserEventLog, closeEventLog)
                            .pipe(
                              switchMap((res) => {
                                return this._auditService
                                  .closeAudit(
                                    JSON.parse(
                                      sessionStorage.getItem('currentAudit')
                                    ).InventoryID,
                                    10,
                                    JSON.parse(
                                      sessionStorage.getItem('currentAudit')
                                    ).Inventory.ITN,
                                    this.userInfo.userName
                                  )
                                  .pipe(
                                    map((res) => {
                                      this._router.navigate(
                                        ['../verify/scan-itn'],
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

            return of(true);
          }
        })
      );
  }

  onBack() {
    this._router.navigate(['../scan-itn'], { relativeTo: this._actRoute });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
