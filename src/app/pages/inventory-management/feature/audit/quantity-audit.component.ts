import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import {
  catchError,
  combineLatest,
  forkJoin,
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
import {
  Audit,
  AuditType,
  Inventory,
  Product,
  ProductCode,
} from '../../utils/interfaces';
import { sqlData } from 'src/app/shared/utils/sqlData';
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
    <page-header headerText="Count the following ITN:"></page-header>
    <ng-container *ngIf="auditInfo">
      <audit-info [auditInfo]="auditInfo" [showGblMsg]="true"></audit-info>
    </ng-container>
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
    >
      <!-- <img
        (click)="keyBoard = !keyBoard"
        style="display: inline-block;"
        src="assets/img/keyboard.svg"
        width="40"
      /> -->
    </div>
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
    <nz-modal
      [(nzVisible)]="reasonsVisible"
      [nzTitle]="adjustReasonTitleTemplate"
      (nzOnOk)="onOk()"
      [nzOkDisabled]="!adjustReason"
      [nzCancelText]="cancelText"
      nzClosable="false"
      [nzStyle]="{ top: '5px' }"
    >
      <ng-template #adjustReasonTitleTemplate>Adjust Reason</ng-template>
      <ng-container *nzModalContent>
        <nz-radio-group [(ngModel)]="adjustReason">
          <label
            *ngFor="let reason of reasons"
            nz-radio
            nzValue="{{ reason }}"
            >{{ reason }}</label
          >
        </nz-radio-group>
      </ng-container>
    </nz-modal>
    <div style="height: 300px;"></div>
  `,
})
export class QuantityAudit implements OnInit {
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

  test() {
    this.keyBoard = !this.keyBoard;
  }

  ngOnInit(): void {
    this.userEventLogs = [];
    this.eventLogs = [];

    this.reasons = [];
    if (!sessionStorage.getItem('auditITN')) {
      this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
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

  onOk() {
    this.userEventLogs.push({
      UserEventID: sqlData.Event_IM_Quantity_Updated,
      UserName: this.userInfo.userName,
      DistributionCenter: this.userInfo.distributionCenter,
      InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
      Message:
        'Original Quantity: ' +
        JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.Quantity +
        ' --- New Quantity: ' +
        this.Quantity +
        ' --- Cost: ' +
        JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.Product
          .Cost,
    });

    this.eventLogs.push({
      UserName: this.userInfo.userName,
      EventTypeID: sqlData.Event_IM_Quantity_Updated,
      Log: JSON.stringify({
        DistributionCenter: this.userInfo.distributionCenter,
        InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
        ParentITN: this.CurrentAudit.Inventory.ParentITN,
        BinLocation: this.CurrentAudit.Container.Barcode,
        QuantityOnHand: this.CurrentAudit.Inventory.Quantity,
        OriginalQuantity: this.CurrentAudit.Inventory.OriginalQuantity,
        DateCode: this.CurrentAudit.Inventory.DateCode,
        CountryOfOrigin: this.CurrentAudit.Inventory.COO,
        ROHS: this.CurrentAudit.Inventory.ROHS,
        NotFound: this.CurrentAudit.Inventory.NotFound,
        Suspect: this.CurrentAudit.Inventory.Suspect,
        LocatedInAutostore: this.CurrentAudit.Inventory.LocatedInAutostore,
        BoundForAutostore: this.CurrentAudit.Inventory.BoundForAutostore,
        PartNumber: this.CurrentAudit.Inventory.Product.PartNumber,
        ProductCode:
          this.CurrentAudit.Inventory.Product.ProductCode.ProductCodeNumber,
        Description: this.CurrentAudit.Inventory.Product.Description,
        ProductTier: this.CurrentAudit.Inventory.Product.ProductTier,
        ProductType:
          this.CurrentAudit.Inventory.Product.ProductType.ProductType,
        ProductTypeDescription:
          this.CurrentAudit.Inventory.Product.ProductType.Description,
        Velocity: this.CurrentAudit.Inventory.Product.Velocity,
        MICPartNumber: this.CurrentAudit.Inventory.Product.MICPartNumber,
        UOM: this.CurrentAudit.Inventory.Product.UOM,
        Autostore: this.CurrentAudit.Inventory.Product.Autostore,
        PackType: this.CurrentAudit.Inventory.Product.PackType,
        PackQuantity: this.CurrentAudit.Inventory.Product.PackQty,
        Cost: this.CurrentAudit.Inventory.Product.Cost,
        NewQuantity: this.Quantity,
        UpdateReason: this.adjustReason,
      }),
    });
    this.reasonsVisible = false;

    const typeID = Number(this.Quantity) == 0 ? null : 20;
    this.closeAudit(this.Quantity, typeID);
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
                      DistributionCenter: this.userInfo.distributionCenter,
                      InventoryTrackingNumber:
                        sessionStorage.getItem('auditITN'),
                    },
                  ];

                  const closeEventLog = [
                    {
                      UserName: this.userInfo.userName,
                      EventTypeID: sqlData.Event_IM_Audit_Completed,
                      Log: JSON.stringify({
                        DistributionCenter: this.userInfo.distributionCenter,
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
            if (this.counts.length == 0) {
              this.counts.push(qty);
              this.data$ = this._eventLog
                .insertLog(
                  [
                    {
                      UserEventID: sqlData.Event_IM_Quantity_Entered,
                      UserName: this.userInfo.userName,
                      DistributionCenter: this.userInfo.distributionCenter,
                      InventoryTrackingNumber:
                        sessionStorage.getItem('auditITN'),
                      Message: 'Quantity: ' + qty,
                    },
                  ],
                  [
                    {
                      UserName: this.userInfo.userName,
                      EventTypeID: sqlData.Event_IM_Quantity_Entered,
                      Log: JSON.stringify({
                        DistributionCenter: this.userInfo.distributionCenter,
                        InventoryTrackingNumber:
                          sessionStorage.getItem('auditITN'),
                        ParentITN: currentAudit.Inventory.ParentITN,
                        BinLocation: currentAudit.Container.Barcode,
                        QuantityEntered: qty,
                        QuantityOnHand: currentAudit.Inventory.Quantity,
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
                        PartNumber: currentAudit.Inventory.Product.PartNumber,
                        ProductCode:
                          currentAudit.Inventory.Product.ProductCode
                            .ProductCodeNumber,
                        Description: currentAudit.Inventory.Product.Description,
                        ProductTier: currentAudit.Inventory.Product.ProductTier,
                        ProductType:
                          currentAudit.Inventory.Product.ProductType
                            .ProductType,
                        ProductTypeDescription:
                          currentAudit.Inventory.Product.ProductType
                            .Description,
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
                  ]
                )
                .pipe(
                  switchMap(() => {
                    if (Number(qty) == currentAudit.Inventory.Quantity) {
                      this.counts = [];
                    }
                    return this._auditService.updateLastUpdated(
                      currentAudit.InventoryID,
                      20,
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
                  switchMap(() => {
                    if (Number(qty) == currentAudit.Inventory.Quantity) {
                      //setTimeout(() => {
                      this.counts = [];
                      //}, 1000);
                      //correct, don't need confirmation
                      this.userEventLogs.push({
                        UserEventID: sqlData.Event_IM_Quantity_Unchanged,
                        UserName: this.userInfo.userName,
                        DistributionCenter: environment.DistributionCenter,
                        InventoryTrackingNumber:
                          sessionStorage.getItem('auditITN'),
                        Message: 'Quantity: ' + qty,
                      });

                      this.eventLogs.push({
                        UserName: this.userInfo.userName,
                        EventTypeID: sqlData.Event_IM_Quantity_Unchanged,
                        Log: JSON.stringify({
                          DistributionCenter: environment.DistributionCenter,
                          InventoryTrackingNumber:
                            sessionStorage.getItem('auditITN'),
                          ParentITN: currentAudit.Inventory.ParentITN,
                          BinLocation: currentAudit.Container.Barcode,
                          QuantityEntered: qty,
                          QuantityOnHand: currentAudit.Inventory.Quantity,
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
                          PartNumber: currentAudit.Inventory.Product.PartNumber,
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
                          Velocity: currentAudit.Inventory.Product.Velocity,
                          MICPartNumber:
                            currentAudit.Inventory.Product.MICPartNumber,
                          UOM: currentAudit.Inventory.Product.UOM,
                          Autostore: currentAudit.Inventory.Product.Autostore,
                          PackType: currentAudit.Inventory.Product.PackType,
                          PackQuantity: currentAudit.Inventory.Product.PackQty,
                          Cost: currentAudit.Inventory.Product.Cost,
                        }),
                      });

                      //setTimeout(() => {
                      const typeID = Number(qty) == 0 ? null : 20;
                      this.closeAudit(qty, typeID);
                      //}, 5000);
                    }

                    return of(true);
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
                  DistributionCenter: this.userInfo.distributionCenter,
                  InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                  Message: 'Quantity: ' + quantity,
                });

                this.eventLogs.push({
                  UserName: this.userInfo.userName,
                  EventTypeID: sqlData.Event_IM_Quantity_Confirm_Entered,
                  Log: JSON.stringify({
                    DistributionCenter: this.userInfo.distributionCenter,
                    InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                    ParentITN: currentAudit.Inventory.ParentITN,
                    BinLocation: currentAudit.Container.Barcode,
                    QuantityEntered: quantity,
                    QuantityOnHand: currentAudit.Inventory.Quantity,
                    OriginalQuantity: currentAudit.Inventory.OriginalQuantity,
                    DateCode: currentAudit.Inventory.DateCode,
                    CountryOfOrigin: currentAudit.Inventory.COO,
                    ROHS: currentAudit.Inventory.ROHS,
                    NotFound: currentAudit.Inventory.NotFound,
                    Suspect: currentAudit.Inventory.Suspect,
                    LocatedInAutostore:
                      currentAudit.Inventory.LocatedInAutostore,
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
                });

                if (
                  Number(quantity) !=
                  Number(
                    JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                      .Quantity
                  )
                ) {
                  this.CurrentAudit = currentAudit;
                  this.Quantity = quantity;
                  this.reasonsVisible = true;
                  return of(true);
                } else {
                  this.userEventLogs.push({
                    UserEventID: sqlData.Event_IM_Quantity_Unchanged,
                    UserName: this.userInfo.userName,
                    DistributionCenter: environment.DistributionCenter,
                    InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                    Message: 'Quantity: ' + quantity,
                  });

                  this.eventLogs.push({
                    UserName: this.userInfo.userName,
                    EventTypeID: sqlData.Event_IM_Quantity_Unchanged,
                    Log: JSON.stringify({
                      DistributionCenter: environment.DistributionCenter,
                      InventoryTrackingNumber:
                        sessionStorage.getItem('auditITN'),
                      ParentITN: currentAudit.Inventory.ParentITN,
                      BinLocation: currentAudit.Container.Barcode,
                      QuantityEntered: quantity,
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
                  });
                }

                this.closeAudit(qty, typeID);
              } else {
                this.counts = [];

                this.data$ = this._eventLog
                  .insertLog(
                    [
                      {
                        UserEventID: sqlData.Event_IM_Quantity_Confirm_Entered,
                        UserName: this.userInfo.userName,
                        DistributionCenter: this.userInfo.distributionCenter,
                        InventoryTrackingNumber:
                          sessionStorage.getItem('auditITN'),
                        Message: 'Quantity: ' + qty.toString(),
                      },
                    ],
                    [
                      {
                        UserName: this.userInfo.userName,
                        EventTypeID: sqlData.Event_IM_Quantity_Confirm_Entered,
                        Log: JSON.stringify({
                          DistributionCenter: this.userInfo.distributionCenter,
                          InventoryTrackingNumber:
                            sessionStorage.getItem('auditITN'),
                          ParentITN: currentAudit.Inventory.ParentITN,
                          BinLocation: currentAudit.Container.Barcode,
                          QuantityEntered: qty,
                          QuantityOnHand: currentAudit.Inventory.Quantity,
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
                          PartNumber: currentAudit.Inventory.Product.PartNumber,
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
                    ]
                  )
                  .pipe(
                    switchMap(() => {
                      return this._auditService.updateLastUpdated(
                        currentAudit.InventoryID,
                        20,
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
        })
      );
  }

  onBack(): void {
    this._router.navigate(['../scan-itn'], { relativeTo: this._actRoute });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
