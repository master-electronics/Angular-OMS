import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  ITNBarcodeRegex,
  ShelfBarcodeBarcodeRegex,
} from 'src/app/shared/utils/dataRegex';
import {
  Observable,
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
import { FormsModule } from '@angular/forms';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditInfoComponent } from '../../ui/audit-info.component';
import {
  Audit,
  AuditType,
  Inventory,
  Product,
  ProductCode,
} from '../../utils/interfaces';
import { FindContainerGQL } from 'src/app/graphql/pick.graphql-gen';
import { environment } from 'src/environments/environment';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { AuditService } from '../../data/audit.service';
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
  ],
  template: `
    <ng-container *ngIf="info$ | async as info">
      <audit-info [auditInfo]="auditInfo"></audit-info>
    </ng-container>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="string"
      controlName="itn"
      title="Scan ITN:"
      backButtonText="Done"
      [isvalid]="this.inputForm.valid"
    >
    </single-input-form>
    <ng-container *ngIf="this.showTimeoutAlert">
      <popup-modal
        (clickSubmit)="resetTimeout()"
        [message]="timeoutAlert"
      ></popup-modal>
    </ng-container>
    <ng-container *ngIf="message">
      <popup-modal
        (clickSubmit)="onFoundOk()"
        [message]="message"
      ></popup-modal>
    </ng-container>
    <div *ngIf="close$ | async"></div>
  `,
})
export class ScanITN implements OnInit {
  userInfo = inject(StorageUserInfoService);
  subscription: Subscription;
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _findContainer: FindContainerGQL,
    private _router: Router,
    private _eventLog: EventLogService,
    private _auditService: AuditService
  ) {}

  public data$;
  public info$;
  public close$;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  searchLocation;
  auditInfo: Audit;
  message;
  auditTimeout: number;
  alertTime: number;
  lastUpdated: number;
  timeoutSeconds = 0;
  showTimeoutAlert;
  timeoutAlert;

  ngOnInit(): void {
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    this.lastUpdated = Number(currentAudit.LastUpdated);
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
      this._router.navigate(['../../../menu'], { relativeTo: this._actRoute });
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

  onSubmit(): void {
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );
    const itn = this.inputForm.value.itn;
    let loc;
    let locs;
    let barcode;

    const userEventLogs = [
      {
        UserEventID: sqlData.Event_IM_Search_ITN_Scanned,
        UserName: this.userInfo.userName,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: itn,
        Message: '',
      },
    ];

    const eventLogs = [
      {
        UserName: this.userInfo.userName,
        EventTypeID: sqlData.Event_IM_Search_ITN_Scanned,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: itn,
        }),
      },
    ];

    const closeAuditsUserEventLogs = [];
    const closeAuditsEventLogs = [];

    this.data$ = this._auditService.checkBinlocation(itn).pipe(
      switchMap((res) => {
        locs = JSON.parse(sessionStorage.getItem('searchLocations'));
        loc = locs?.find((loc) => loc.Status == 'active');
        barcode = res.data.findInventory.Container.Barcode;

        if (loc.Barcode != barcode) {
          userEventLogs.push({
            UserEventID: sqlData.Event_IM_Search_ITN_Location_Updated,
            UserName: this.userInfo.userName,
            DistributionCenter: environment.DistributionCenter,
            InventoryTrackingNumber: itn,
            Message:
              'Original BinLocation: ' +
              barcode +
              ' --- New BinLocation: ' +
              loc.Barcode,
          });

          eventLogs.push({
            UserName: this.userInfo.userName,
            EventTypeID: sqlData.Event_IM_Search_ITN_Location_Updated,
            Log: JSON.stringify({
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber: itn,
              OriginalBinLocation: barcode,
              NewBinLocation: loc.Barcode,
            }),
          });
        }

        return this._eventLog.insertLog(userEventLogs, eventLogs);
      }),
      switchMap((res) => {
        return this._auditService.closeAudits(itn).pipe(
          map((res) => {
            res?.data.closeAudits.forEach((audit) => {
              closeAuditsUserEventLogs.push({
                UserEventID: sqlData.Event_IM_Audit_Closed_ITN_Search,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: audit.InventoryTrackingNumber,
                Message: `Audit with _id: ${audit._id} closed.  ITN: ${audit.InventoryTrackingNumber}
                  found while searching for ITN: ${currentAudit.Inventory.ITN}`,
              });

              closeAuditsEventLogs.push({
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_Audit_Closed_ITN_Search,
                Log: JSON.stringify({
                  DistributionCenter: environment.DistributionCenter,
                  AuditID: audit._id,
                  InventoryTrackingNumber: audit.InventoryTrackingNumber,
                  SearchedITN: currentAudit.Inventory.ITN,
                }),
              });
            });
          })
        );
      }),
      switchMap((res) => {
        if (closeAuditsUserEventLogs.length > 0) {
          const t = 'test';
          return this._eventLog.insertLog(
            closeAuditsUserEventLogs,
            closeAuditsEventLogs
          );
        } else {
          const t = 'test';
          return of(res);
        }
      }),
      switchMap((res) => {
        if (loc.Barcode != barcode) {
          return this._auditService.inventoryUpdate(
            this.userInfo.userName,
            itn,
            'Inventory Management Audit',
            '',
            '',
            '',
            '',
            '',
            loc.Barcode
          );
        }

        return of(res);
      }),
      switchMap((res) => {
        if (
          itn ==
          JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.ITN
        ) {
          locs.forEach((loc) => {
            loc.Status = 'done';
          });

          sessionStorage.setItem('searchLocations', JSON.stringify(locs));
          const audit: Audit = JSON.parse(
            sessionStorage.getItem('currentAudit')
          );

          audit.Container.Barcode = loc.Barcode;
          sessionStorage.setItem('currentAudit', JSON.stringify(audit));

          this.message =
            'Found ITN ' +
            JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.ITN;

          return of(res);
        }

        this._router.navigate(['../scan-itn'], {
          relativeTo: this._actRoute,
        });

        return of(res);
      }),
      catchError((error) => {
        return of({
          error: { message: error.message, type: 'error' },
        });
      })
    );
  }

  onBack(): void {
    const locs = JSON.parse(sessionStorage.getItem('searchLocations'));
    const loc = locs?.find((loc) => loc.Status == 'active');
    loc.Status = 'done';
    sessionStorage.setItem('searchLocations', JSON.stringify(locs));

    this._router.navigate(['../scan-location'], {
      relativeTo: this._actRoute,
    });
  }

  onFoundOk() {
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );
    sessionStorage.setItem('auditITN', currentAudit.Inventory.ITN);
    this.data$ = this._auditService
      .nextSubAudit$(currentAudit.InventoryID, this.userInfo.userId)
      .pipe(
        tap((audit) => {
          if (!audit) {
            const closerUserEventLog = [
              {
                UserEventID: sqlData.Event_IM_Audit_Completed,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: currentAudit.Inventory.ITN,
              },
            ];

            const closeEventLog = [
              {
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_Audit_Completed,
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
                }),
              },
            ];

            this.close$ = this._eventLog
              .insertLog(closerUserEventLog, closeEventLog)
              .pipe(
                switchMap((res) => {
                  return this._auditService
                    .closeAudit(
                      currentAudit.InventoryID,
                      10,
                      currentAudit.Inventory.ITN,
                      this.userInfo.userName
                    )
                    .pipe(
                      map((res) => {
                        this._router.navigate(['../../scan-itn'], {
                          relativeTo: this._actRoute,
                        });

                        return res;
                      })
                    );
                })
              );

            return of(true);
          } else {
            this._router.navigate(['../../' + audit.Route], {
              relativeTo: this._actRoute,
            });

            return of(true);
          }
        })
      );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
