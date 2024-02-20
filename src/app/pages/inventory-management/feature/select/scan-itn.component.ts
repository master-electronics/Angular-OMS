import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import {
  catchError,
  map,
  of,
  switchMap,
  tap,
  interval,
  Subscription,
} from 'rxjs';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditInfoComponent } from '../../ui/audit-info.component';
import { PageHeaderComponent } from '../../ui/page-header.component';
import { AuditService } from '../../data/audit.service';
import {
  Audit,
  AuditType,
  Inventory,
  Product,
  ProductCode,
  GlobalMessage,
} from '../../utils/interfaces';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { OMSConfigService } from 'src/app/shared/services/oms-config.service';
import { BeepBeep } from 'src/app/shared/utils/beeper';
import { ReplenishItemResolver } from 'src/app/pages/Autostore-ASN/utils/resolver/replenish-item.resolver';

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
    PageHeaderComponent,
  ],
  template: `
    <page-header headerText="Find the following ITN:"></page-header>
    <ng-container *ngIf="info$ | async as info">
      <audit-info [auditInfo]="audit"></audit-info>
    </ng-container>
    <ng-container *ngIf="errorMessage">
      <popup-modal
        (clickSubmit)="onError()"
        [message]="errorMessage"
      ></popup-modal>
    </ng-container>
    <ng-container *ngIf="this.showTimeoutAlert">
      <popup-modal
        (clickSubmit)="resetTimeout()"
        [message]="timeoutAlert"
      ></popup-modal>
    </ng-container>
    <div *ngIf="close$ | async"></div>
    <div *ngIf="config$ | async"></div>
    <div
      style="position: fixed; bottom: 0; background-color: white; width: 95%"
    >
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
      <ng-container *ngIf="message">
        <popup-modal (clickSubmit)="onBack()" [message]="message"></popup-modal>
      </ng-container>
      <div style="height: 10px;"></div>
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
      <div style="height: 10px;"></div>
    </div>
    <div style="height: 300px;"></div>
  `,
})
export class ScanITN implements OnInit {
  subscription: Subscription;
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
  errorMessage;
  showTimeoutAlert;
  timeoutAlert;
  valid: boolean;
  audit: Audit;
  alertTimeout: number;
  timeoutSeconds = 0;
  auditTimeout: number;
  alertTime: number;
  lastUpdated: number;
  inputCounter = 0;
  inputCounterIntervalID;

  ngOnInit() {
    this.inputForm.valueChanges.subscribe(() => {
      this.inputCounter = 0;
      clearInterval(this.inputCounterIntervalID);
      this.inputCounterIntervalID = setInterval(() => {
        this.inputCounter++;
      }, 1000);
    });
    sessionStorage.removeItem('currentAudit');
    sessionStorage.removeItem('auditITN');
    sessionStorage.removeItem('searchLocations');
    sessionStorage.removeItem('searching');
    this.audit = null;

    this.info$ = this._actRoute.data.pipe(
      map((res) => {
        if (!res?.Audit?.audit?.InventoryID) {
          sessionStorage.removeItem('CurrentLocation');
          this.message = 'There are no more Audits';
          return of(false);
        } else {
          this.auditTimeout =
            res?.Audit?.auditTimeout?.data?.fetchConfigValue?.Value;
          this.alertTime = res?.Audit?.alertTime?.data?.fetchConfigValue?.Value;
          this.audit = res.Audit.audit;
          sessionStorage.setItem(
            'CurrentLocation',
            this.audit.Container.Barcode.trim()
          );
          this.lastUpdated = Number(res.Audit.audit.LastUpdated);
          sessionStorage.setItem('currentAudit', JSON.stringify(this.audit));
          const timeoutTimer = interval(1000);
          this.subscription = timeoutTimer.subscribe((val) => this.timer());
          return of(true);
        }
      }),
      switchMap((res) => {
        const msgs: [GlobalMessage?] = [];
        return this._auditService
          .getGlobalMessages(this.audit.InventoryID)
          .pipe(
            map((res) => {
              res.data.fetchGlobalMessages.forEach((msg) => {
                msgs.push({
                  Message: msg.Message,
                });
              });

              this.audit.Inventory.Product.GlobalMessages = msgs;
              sessionStorage.setItem(
                'currentAudit',
                JSON.stringify(this.audit)
              );
              return of(res);
            })
          );
      })
    );
    this.data$ = of(true);
  }

  getConfig() {
    this.config$ = this._configService.getValue('IM_Audit_Timeout').pipe(
      map((res) => {
        return res.data.fetchConfigValue.Value;
      })
    );
  }

  resetTimeout() {
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    this.data$ = this._auditService
      .updateLastUpdated(
        currentAudit.InventoryID,
        10,
        new Date(Date.now()).toISOString()
      )
      .pipe(
        map(() => {
          currentAudit.LastUpdated = new Date(Date.now()).getTime().toString();
          sessionStorage.setItem('currentAudit', JSON.stringify(currentAudit));
          return of(true);
        }),
        catchError((error) => {
          return of({ error });
        })
      );

    this.timeoutSeconds = 0;
    this.showTimeoutAlert = false;
  }

  timer() {
    ++this.timeoutSeconds;
    const secondsRemaining =
      (this.lastUpdated +
        this.auditTimeout * 1000 -
        (this.timeoutSeconds * 1000 + this.lastUpdated)) /
      1000;

    if (secondsRemaining == 0) {
      this.onBack();
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

  onSubmit(): void {
    const inputMethod = this.inputCounter ? 'manual' : 'scanned';
    const input = this.inputForm.value.ITN.trim();
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    const userEventLogs = [];
    const eventLogs = [];
    let closeAudit = false;
    let route;

    this.data$ = this._auditService
      .validateAssignment$(currentAudit._id, this.userInfo.userId)
      .pipe(
        map((res) => {
          if (!res.data.validateAssignment) {
            this.message = 'This Audit has timed out!';
            sessionStorage.removeItem('currentAudit');
            sessionStorage.removeItem('auditITN');

            return of(res);
          } else {
            if (ITNBarcodeRegex.test(input)) {
              if (this.audit.Inventory.ITN != input) {
                throw new Error('Incorrect ITN!');
              }

              sessionStorage.setItem('auditITN', this.audit.Inventory.ITN);

              userEventLogs.push({
                UserEventID: sqlData.Event_IM_ITN_Scanned,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                Message: 'ITN: ' + input + ' -- InputMethod: ' + inputMethod,
              });

              eventLogs.push({
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_ITN_Scanned,
                Log: JSON.stringify({
                  DistributionCenter: environment.DistributionCenter,
                  InventoryTrackingNumber: input,
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
                  InputMethod: inputMethod,
                }),
              });

              return res;
            }

            throw new Error('Invalid ITN format!');
          }
        }),
        switchMap((res) => {
          return this._auditService.inventoryUpdate(
            this.userInfo.userName,
            input,
            'Inventory Management Audit',
            '',
            '',
            '',
            '',
            '',
            '',
            'OK'
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
          return this._auditService
            .nextSubAudit$(this.audit.InventoryID, this.userInfo.userId)
            .pipe(
              tap((audit) => {
                if (!audit) {
                  closeAudit = true;
                  route = '../verify/scan-location';
                  userEventLogs.push({
                    UserEventID: sqlData.Event_IM_Audit_Completed,
                    UserName: this.userInfo.userName,
                    DistributionCenter: environment.DistributionCenter,
                    InventoryTrackingNumber: this.audit.Inventory.ITN,
                  });

                  eventLogs.push({
                    UserName: this.userInfo.userName,
                    EventTypeID: sqlData.Event_IM_Audit_Completed,
                    Log: JSON.stringify({
                      DistributionCenter: environment.DistributionCenter,
                      InventoryTrackingNumber:
                        sessionStorage.getItem('auditITN'),
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
                  });

                  return;
                }

                route = '../' + audit.Route;
              })
            );
        }),
        switchMap((res) => {
          return this._eventLog.insertLog(userEventLogs, eventLogs);
        }),
        switchMap((res) => {
          if (closeAudit) {
            return this._auditService.closeAudit(
              this.audit.InventoryID,
              10,
              this.audit.Inventory.ITN,
              this.userInfo.userName
            );
          }

          return of(res);
        }),
        switchMap((res) => {
          this._router.navigate([route], {
            relativeTo: this._actRoute,
          });

          return of(res);
        }),
        catchError((error) => {
          return of({ error: { message: error, type: 'error' } });
        })
      );
  }

  onBack(): void {
    this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
  }

  onError(): void {
    window.location.reload();
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

    this.data$ = this._auditService
      .getPreviousLocation(
        audit.Inventory.ITN,
        sessionStorage.getItem('CurrentLocation')
      )
      .pipe(
        switchMap((res) => {
          const log = JSON.parse(eventLog[0].Log);
          log.PreviousLocation = res;
          eventLog[0].Log = JSON.stringify(log);

          return this._eventLog.insertLog(userEventLog, eventLog);
        }),
        map((res) => {
          this._router.navigate(['../search/scan-location'], {
            relativeTo: this._actRoute,
          });

          return res;
        })
      );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
