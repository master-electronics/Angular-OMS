import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  combineLatest,
  of,
  tap,
  map,
  catchError,
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
import { PageHeaderComponent } from '../../ui/page-header.component';
import { AuditService } from '../../data/audit.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { dateCodeRegex } from 'src/app/shared/utils/dataRegex';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import {
  DeleteAuditDocument,
  InventoryUpdateDocument,
} from 'src/app/graphql/inventoryManagement.graphql-gen';
import { Audit } from '../../utils/interfaces';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { BeepBeep } from 'src/app/shared/utils/beeper';

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
    SimpleKeyboardComponent,
    PageHeaderComponent,
  ],
  template: `
    <page-header
      headerText="Verify Date Code for the following ITN:"
    ></page-header>
    <ng-container *ngIf="auditInfo">
      <audit-info [auditInfo]="auditInfo"></audit-info>
    </ng-container>
    <!--
    <simple-keyboard
      [inputString]="this.inputForm.value.dateCode"
      (outputString)="onChange($event)"
      layout="number"
    ></simple-keyboard>
    -->
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
    <div
      style="position: fixed; bottom: 0; background-color: white; width: 95%"
    >
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [data]="data$ | async"
        [formGroup]="inputForm"
        inputType="string"
        controlName="dateCode"
        title="Enter Date Code:"
        [isvalid]="this.inputForm.valid"
        [maxLength]="4"
      >
      </single-input-form>
      <div style="height: 10px;"></div>
      <div nz-row [nzGutter]="8">
        <div nz-col nzSpan="8" nzOffset="8" class="grid h-12">
          <button
            (click)="onNA()"
            class="h-full w-full rounded-lg bg-red-700 font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-red-200  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            type="button"
          >
            N/A
          </button>
        </div>
      </div>
      <div style="height: 10px;"></div>
    </div>
    <div style="height: 300px;"></div>
  `,
})
export class DateCodeAudit implements OnInit {
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
    dateCode: ['', [Validators.required, Validators.pattern(dateCodeRegex)]],
  });
  public currentInputField;
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
      this.auditInfo = currentAudit;
    }

    this.info$ = this._actRoute.data.pipe(
      map((res) => {
        this.auditTimeout =
          res?.Config?.auditTimeout?.data?.fetchConfigValue.Value;
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

  onChange(input: string) {
    this.inputForm.patchValue({ dateCode: input });
  }

  onInputFocus(event) {
    this.currentInputField = this.inputForm.get(`field${event.target.id}`);
  }

  async onSubmit() {
    const dateCode = this.inputForm.value.dateCode;
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
                UserEventID: sqlData.Event_IM_DateCode_Entered,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                Message: 'Date Code: ' + this.inputForm.value.dateCode,
              },
            ];

            const eventLogs = [
              {
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_DateCode_Entered,
                Log: JSON.stringify({
                  DistributionCenter: environment.DistributionCenter,
                  InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                  ParentITN: currentAudit.Inventory.ParentITN,
                  BinLocation: currentAudit.Container.Barcode,
                  QuantityOnHand: currentAudit.Inventory.Quantity,
                  OriginalQuantity: currentAudit.Inventory.OriginalQuantity,
                  DateCode: currentAudit.Inventory.DateCode,
                  DateCodeEntered: this.inputForm.value.dateCode,
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
                }),
              },
            ];

            if (
              dateCode !=
              JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                .DateCode
            ) {
              userEventLogs.push({
                UserEventID: sqlData.Event_IM_DateCode_Updated,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                Message:
                  'Original Date Code: ' +
                  JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                    .DateCode +
                  ' --- New Date Code: ' +
                  dateCode,
              });

              eventLogs.push({
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_DateCode_Updated,
                Log: JSON.stringify({
                  DistributionCenter: environment.DistributionCenter,
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
                  NewDateCode: dateCode,
                }),
              });
            }

            this.data$ = this._eventLog
              .insertLog(userEventLogs, eventLogs)
              .pipe(
                switchMap(() => {
                  return this._auditService.updateLastUpdated(
                    currentAudit.InventoryID,
                    30,
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
                    dateCode
                  );
                }),
                switchMap((res) => {
                  return this._auditService.deleteAudit(
                    JSON.parse(sessionStorage.getItem('currentAudit'))
                      .InventoryID,
                    30
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
                                environment.DistributionCenter,
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
                                  environment.DistributionCenter,
                                InventoryTrackingNumber:
                                  sessionStorage.getItem('auditITN'),
                                ParentITN: currentAudit.Inventory.ParentITN,
                                BinLocation: currentAudit.Container.Barcode,
                                QuantityOnHand: currentAudit.Inventory.Quantity,
                                OriginalQuantity:
                                  currentAudit.Inventory.OriginalQuantity,
                                DateCode: currentAudit.Inventory.DateCode,
                                DateCodeEntered: dateCode,
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

  onBack(): void {
    this._router.navigate(['../scan-itn'], { relativeTo: this._actRoute });
  }

  onNA() {
    const audit: Audit = JSON.parse(sessionStorage.getItem('currentAudit'));

    const userEventLogs = [
      {
        UserEventID: sqlData.Event_IM_DateCode_NA,
        UserName: this.userInfo.userName,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: audit.Inventory.ITN,
      },
    ];

    const eventLogs = [
      {
        UserName: this.userInfo.userName,
        EventTypeID: sqlData.Event_IM_DateCode_NA,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
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

    this.data$ = this._eventLog.insertLog(userEventLogs, eventLogs).pipe(
      switchMap(() => {
        return this._auditService.updateLastUpdated(
          audit.InventoryID,
          30,
          new Date(Date.now()).toISOString()
        );
      }),
      switchMap(() => {
        return this._auditService.updateLastUpdated(
          audit.InventoryID,
          10,
          new Date(Date.now()).toISOString()
        );
      }),
      switchMap(() => {
        const SuspectData = [
          {
            InventoryID: audit.InventoryID,
            Reason: 'User selected N/A for Date Code',
            Comment: `Date Code of ${audit.Inventory.DateCode} expected`,
          },
        ];

        return this._auditService.insertSuspect(SuspectData);
      }),
      switchMap(() => {
        return this._auditService.deleteAudit(audit.InventoryID, 30);
      }),
      switchMap(() => {
        return this._auditService
          .nextSubAudit$(audit.InventoryID, this.userInfo.userId)
          .pipe(
            tap((res) => {
              if (!res) {
                const closeUserEventLog = [
                  {
                    UserEventID: sqlData.Event_IM_Audit_Completed,
                    UserName: this.userInfo.userName,
                    DistributionCenter: environment.DistributionCenter,
                    InventoryTrackingNumber: audit.Inventory.ITN,
                  },
                ];

                const closeEventLog = [
                  {
                    UserName: this.userInfo.userName,
                    EventTypeID: sqlData.Event_IM_Audit_Completed,
                    Log: JSON.stringify({
                      DistributionCenter: environment.DistributionCenter,
                      InventoryTrackingNumber:
                        sessionStorage.getItem('auditITN'),
                      ParentITN: audit.Inventory.ParentITN,
                      BinLocation: audit.Container.Barcode,
                      QuantityOnHand: audit.Inventory.Quantity,
                      OriginalQuantity: audit.Inventory.OriginalQuantity,
                      DateCode: audit.Inventory.DateCode,
                      DateCodeEntered: 'N/A',
                      CountryOfOrigin: audit.Inventory.COO,
                      ROHS: audit.Inventory.ROHS,
                      NotFound: audit.Inventory.NotFound,
                      Suspect: audit.Inventory.Suspect,
                      LocatedInAutostore: audit.Inventory.LocatedInAutostore,
                      BoundForAutostore: audit.Inventory.BoundForAutostore,
                      PartNumber: audit.Inventory.Product.PartNumber,
                      ProductCode:
                        audit.Inventory.Product.ProductCode.ProductCodeNumber,
                      Description: audit.Inventory.Product.Description,
                      ProductTier: audit.Inventory.Product.ProductTier,
                      ProductType:
                        audit.Inventory.Product.ProductType.ProductType,
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

                this.close$ = this._eventLog
                  .insertLog(closeUserEventLog, closeEventLog)
                  .pipe(
                    switchMap(() => {
                      return this._auditService
                        .closeAudit(
                          audit.InventoryID,
                          10,
                          audit.Inventory.ITN,
                          this.userInfo.userName
                        )
                        .pipe(
                          map((res) => {
                            this._router.navigate(['../verify/scan-itn'], {
                              relativeTo: this._actRoute,
                            });

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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
