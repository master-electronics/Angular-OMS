import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  catchError,
  map,
  of,
  switchMap,
  tap,
  Subscription,
  interval,
} from 'rxjs';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditInfoComponent } from '../../ui/audit-info.component';
import { PageHeaderComponent } from '../../ui/page-header.component';
import { AuditService } from '../../data/audit.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { SimpleKeyboardComponent } from '../../ui/simple-keyboard.component';
import { Audit } from '../../utils/interfaces';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
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
    NzRadioModule,
    FormsModule,
    AuditInfoComponent,
    SimpleKeyboardComponent,
    PageHeaderComponent,
    NzIconModule,
  ],
  template: `
    <page-header [headerText]="headerText"></page-header>
    <!--
    <ng-container *ngIf="auditInfo">
      <audit-info [auditInfo]="auditInfo"></audit-info>
    </ng-container>
    -->
    <div style="height: 200px;"></div>
    <!--<simple-keyboard
      *ngIf="keyBoard"
      [inputString]="this.inputForm.value.quantity"
      (outputString)="onChange($event)"
      layout="number"
      [numberOnly]="true"
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
      style="position: fixed; bottom: 5px; z-index: 1; text-align: center; width: 95%;"
    ></div>
    <div
      style="position: fixed; bottom: 0; background-color: white; width: 95%"
    >
      <single-input-form
        *ngIf="counts.length == 0"
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [data]="data$ | async"
        [formGroup]="inputForm"
        inputType="number"
        controlName="quantity"
        title="Enter Quantity:"
        [isvalid]="this.inputForm.valid"
        [maxLength]="15"
      >
      </single-input-form>
      <single-input-form
        *ngIf="counts.length == 1"
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [data]="data$ | async"
        [formGroup]="inputForm"
        inputType="number"
        controlName="quantity"
        title="Confirm Quantity:"
        [isvalid]="this.inputForm.valid"
        [maxLength]="15"
      >
      </single-input-form>
      <div style="height: 10px;"></div>
    </div>
    <div style="height: 300px;"></div>
  `,
})
export class VerifyQuantity implements OnInit {
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
    quantity: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)],
    ],
  });

  counts: number[] = [];
  auditInfo: Audit;
  message;
  auditTimeout: number;
  alertTime: number;
  lastUpdated: number;
  timeoutSeconds = 0;
  showTimeoutAlert;
  timeoutAlert;
  reasons;
  reasonsVisible: boolean;
  adjustReason: string;
  cancelText = null;
  CurrentAudit: Audit;
  Quantity;
  userEventLogs;
  eventLogs;
  keyBoard;
  headerText;
  itn;

  test() {
    this.keyBoard = !this.keyBoard;
  }

  ngOnInit(): void {
    this.itn = this._actRoute.snapshot.paramMap.get('itn');
    this.headerText = this.itn + ' needs to be recreated. Verify Quantity:';
    this.userEventLogs = [];
    this.eventLogs = [];

    this.reasons = [];
    if (!sessionStorage.getItem('auditITN')) {
      //this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
    }

    if (sessionStorage.getItem('currentAudit')) {
      const currentAudit: Audit = JSON.parse(
        sessionStorage.getItem('currentAudit')
      );

      this.CurrentAudit = currentAudit;

      this.lastUpdated = Number(currentAudit.LastUpdated);
      this.auditInfo = this.CurrentAudit;

      this.info$ = this._actRoute.data.pipe(
        map((res) => {
          res?.Config?.imAdjustReasons?.forEach((reason) => {
            this.reasons.push(reason);
          });
          this.auditTimeout =
            res?.Config?.auditTimeout?.data?.fetchConfigValue?.Value;
          this.alertTime =
            res?.Config?.alertTime?.data?.fetchConfigValue?.Value;

          const timeoutTimer = interval(1000);
          this.subscription = timeoutTimer.subscribe((val) => this.timer());
        })
      );
    }

    this.data$ = of(true);
  }

  recreateITN(ITN, Quantity, BinLocation) {
    this.data$ = this._auditService
      .recreateITN(
        this.userInfo.userName,
        ITN,
        environment.DistributionCenter,
        BinLocation,
        Quantity.toString()
      )
      .pipe(
        switchMap(() => {
          //log recreate itn
          const userEventLog = [
            {
              UserEventID: sqlData.Event_IM_Search_ITN_Recreated,
              UserName: this.userInfo.userName,
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber: ITN,
              Message:
                'BinLocation: ' + BinLocation + ' --- Quantity: ' + Quantity,
            },
          ];

          const eventLog = [
            {
              UserName: this.userInfo.userName,
              EventTypeID: sqlData.Event_IM_Search_ITN_Recreated,
              Log: JSON.stringify({
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: ITN,
                BinLocation: BinLocation,
                Quantity: Quantity,
              }),
            },
          ];

          return this._eventLog.insertLog(userEventLog, eventLog);
        }),
        switchMap(() => {
          this._router.navigate(['../../scan-itn'], {
            relativeTo: this._actRoute,
          });

          return of(true);
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }

  closeAudit(Quantity, TypeID) {
    this.data$ = this._eventLog
      .insertLog(this.userEventLogs, this.eventLogs)
      .pipe(
        switchMap(() => {
          return this._auditService.updateLastUpdated(
            this.CurrentAudit.InventoryID,
            20,
            new Date(Date.now()).toISOString()
          );
        }),
        switchMap(() => {
          return this._auditService.updateLastUpdated(
            this.CurrentAudit.InventoryID,
            10,
            new Date(Date.now()).toISOString()
          );
        }),
        switchMap((res) => {
          return this._auditService.inventoryUpdate(
            this.userInfo.userName,
            sessionStorage.getItem('auditITN'),
            'Inventory Management Audit',
            Quantity.toString()
          );
        }),
        switchMap((res) => {
          return this._auditService.deleteAudit(
            JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
            TypeID
          );
        }),
        switchMap((res) => {
          return this._auditService
            .nextSubAudit$(
              JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
              this.userInfo.userId
            )
            .pipe(
              tap((res) => {
                if (!res) {
                  const closeUserEventLog = [
                    {
                      UserEventID: sqlData.Event_IM_Audit_Completed,
                      UserName: this.userInfo.userName,
                      DistributionCenter: environment.DistributionCenter,
                      InventoryTrackingNumber:
                        sessionStorage.getItem('auditITN'),
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
                        ParentITN: this.CurrentAudit.Inventory.ParentITN,
                        BinLocation: this.CurrentAudit.Container.Barcode,
                        QuantityEntered: Quantity,
                        QuantityOnHand: this.CurrentAudit.Inventory.Quantity,
                        OriginalQuantity:
                          this.CurrentAudit.Inventory.OriginalQuantity,
                        DateCode: this.CurrentAudit.Inventory.DateCode,
                        CountryOfOrigin: this.CurrentAudit.Inventory.COO,
                        ROHS: this.CurrentAudit.Inventory.ROHS,
                        NotFound: this.CurrentAudit.Inventory.NotFound,
                        Suspect: this.CurrentAudit.Inventory.Suspect,
                        LocatedInAutostore:
                          this.CurrentAudit.Inventory.LocatedInAutostore,
                        BoundForAutostore:
                          this.CurrentAudit.Inventory.BoundForAutostore,
                        PartNumber:
                          this.CurrentAudit.Inventory.Product.PartNumber,
                        ProductCode:
                          this.CurrentAudit.Inventory.Product.ProductCode
                            .ProductCodeNumber,
                        Description:
                          this.CurrentAudit.Inventory.Product.Description,
                        ProductTier:
                          this.CurrentAudit.Inventory.Product.ProductTier,
                        ProductType:
                          this.CurrentAudit.Inventory.Product.ProductType
                            .ProductType,
                        ProductTypeDescription:
                          this.CurrentAudit.Inventory.Product.ProductType
                            .Description,
                        Velocity: this.CurrentAudit.Inventory.Product.Velocity,
                        MICPartNumber:
                          this.CurrentAudit.Inventory.Product.MICPartNumber,
                        UOM: this.CurrentAudit.Inventory.Product.UOM,
                        Autostore:
                          this.CurrentAudit.Inventory.Product.Autostore,
                        PackType: this.CurrentAudit.Inventory.Product.PackType,
                        PackQuantity:
                          this.CurrentAudit.Inventory.Product.PackQty,
                        Cost: this.CurrentAudit.Inventory.Product.Cost,
                      }),
                    },
                  ];

                  this.close$ = this._eventLog
                    .insertLog(closeUserEventLog, closeEventLog)
                    .pipe(
                      switchMap((res) => {
                        return this._auditService
                          .closeAudit(
                            JSON.parse(sessionStorage.getItem('currentAudit'))
                              .InventoryID,
                            10,
                            JSON.parse(sessionStorage.getItem('currentAudit'))
                              .Inventory.ITN,
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
    this.inputForm.patchValue({ quantity: input });
  }

  async onSubmit() {
    this.userEventLogs = [];
    this.eventLogs = [];

    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    const qty = Number(this.inputForm.value.quantity);

    if (this.counts.length == 0) {
      this.counts.push(qty);
      this.data$ = this._eventLog
        .insertLog(
          [
            {
              UserEventID: sqlData.Event_IM_Quantity_Entered,
              UserName: this.userInfo.userName,
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber: this.itn,
              Message: 'Quantity: ' + qty,
            },
          ],
          [
            {
              UserName: this.userInfo.userName,
              EventTypeID: sqlData.Event_IM_Quantity_Entered,
              Log: JSON.stringify({
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: this.itn,
                BinLocation: sessionStorage.getItem('CurrentLocation'),
                QuantityEntered: qty,
              }),
            },
          ]
        )
        .pipe(
          switchMap(() => {
            return this._auditService.updateLastUpdated(
              currentAudit.InventoryID,
              10,
              new Date(Date.now()).toISOString()
            );
          }),
          catchError((error) => {
            return of({
              error: { message: error.message, type: 'error' },
            });
          })
        );
    } else {
      if (Number(qty) == this.counts[0]) {
        const quantity = qty;
        const typeID = Number(quantity) == 0 ? null : 20;

        this.userEventLogs.push({
          UserEventID: sqlData.Event_IM_Quantity_Confirm_Entered,
          UserName: this.userInfo.userName,
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: this.itn,
          Message: 'Quantity: ' + quantity,
        });

        this.eventLogs.push({
          UserName: this.userInfo.userName,
          EventTypeID: sqlData.Event_IM_Quantity_Confirm_Entered,
          Log: JSON.stringify({
            DistributionCenter: environment.DistributionCenter,
            InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
            BinLocation: sessionStorage.getItem('CurrentLocation'),
            QuantityEntered: quantity,
          }),
        });

        this.recreateITN(
          this.itn,
          qty,
          sessionStorage.getItem('searchLocation')
        );

        return of(true);
      } else {
        this.counts = [];

        this.data$ = this._eventLog
          .insertLog(
            [
              {
                UserEventID: sqlData.Event_IM_Quantity_Confirm_Entered,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: this.itn,
                Message: 'Quantity: ' + qty.toString(),
              },
            ],
            [
              {
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_Quantity_Confirm_Entered,
                Log: JSON.stringify({
                  DistributionCenter: environment.DistributionCenter,
                  InventoryTrackingNumber: this.itn,
                  BinLocation: sessionStorage.getItem('CurrentLocation'),
                  QuantityEntered: qty,
                }),
              },
            ]
          )
          .pipe(
            switchMap(() => {
              return this._auditService.updateLastUpdated(
                currentAudit.InventoryID,
                10,
                new Date(Date.now()).toISOString()
              );
            }),
            catchError((error) => {
              return of({
                error: { message: error.message, type: 'error' },
              });
            })
          );
      }
    }

    return of(true);
  }

  onBack(): void {
    this._router.navigate(['../scan-itn'], { relativeTo: this._actRoute });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
