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
import { PageHeaderComponent } from '../../ui/page-header.component';
import {
  Audit,
  AuditType,
  Inventory,
  Product,
  ProductCode,
} from '../../utils/interfaces';
import { FindContainerGQL } from 'src/app/graphql/pick.graphql-gen';
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
    PageHeaderComponent,
  ],
  template: `
    <page-header headerText="Scan ITNS on shelf:"></page-header>
    <div nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
        <span class="mr-2 font-medium">Location:</span>
      </div>
      <div nz-col nzSpan="13" class="text-black md:text-lg lg:text-xl">
        <span class="justify-self-start text-blue-600">
          {{ searchLocation }}
        </span>
      </div>
    </div>
    <div nz-row [nzGutter]="8">
      <div
        class="text-base sm:text-lg md:mx-16 md:text-2xl lg:text-4xl"
        style="width: 100%"
      >
        <div class="gap-2 md:grid" style="width: 100%">
          <label class="mb-0.5 font-bold text-gray-700">Scanned:</label>
          <label
            class="mb-0.5 font-bold text-gray-700"
            style="position: relative; float: right;"
            >{{ scannedITNs ? scannedITNs?.length : 0 }} ITNs</label
          >
        </div>
      </div>
    </div>
    <ng-container *ngFor="let itn of scannedITNs">
      <div nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }">
        <div nz-col nzSpan="6" class="text-black md:text-lg lg:text-xl">
          <span class="mr-2 font-medium">{{ itn }}</span>
        </div>
      </div>
    </ng-container>
    <ng-container *ngIf="info$ | async as info">
      <audit-info [auditInfo]="auditInfo"></audit-info>
    </ng-container>

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
    <div *ngIf="test$ | async"></div>
    <div
      style="position: fixed; bottom: 0px; background-color: white; width: 95%"
    >
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
      <div style="height: 10px;"></div>
    </div>
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
  public test$;
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
  scannedITNs = [];
  isLoading = false;
  beep = new BeepBeep();

  ngOnInit(): void {
    this.scannedITNs = JSON.parse(sessionStorage.getItem('scannedITNs'));
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    this.searchLocation = sessionStorage.getItem('searchLocation');

    this.lastUpdated = Number(currentAudit.LastUpdated);
    const audits = [];

    const userEventLogs = [];
    const eventLogs = [];

    this.info$ = this._actRoute.data.pipe(
      map((res) => {
        this.auditTimeout =
          res?.Config?.auditTimeout?.data?.fetchConfigValue?.Value;
        this.alertTime = res?.Config?.alertTime?.data?.fetchConfigValue?.Value;

        const timeoutTimer = interval(1000);
        this.subscription = timeoutTimer.subscribe((val) => this.timer());
      }),
      switchMap((res) => {
        return this._auditService
          .fetchContainerInventory({
            Barcode: sessionStorage.getItem('searchLocation'),
          })
          .pipe(
            map((res) => {
              res.data.findContainer.INVENTORies.forEach((inv) => {
                audits.push({
                  TypeID: 10,
                  InventoryID: inv._id,
                  InventoryTrackingNumber: inv.InventoryTrackingNumber,
                  LastUpdated: new Date(Date.now()).toISOString(),
                  CreatedDatetime: new Date(Date.now()).toISOString(),
                  UserID: this.userInfo.userId,
                  Trigger: 'Location Search',
                  Priority: 6,
                });

                userEventLogs.push({
                  UserEventID: sqlData.Event_IM_Audit_Created,
                  UserName: this.userInfo.userName,
                  DistributionCenter: environment.DistributionCenter,
                  InventoryTrackingNumber: inv.InventoryTrackingNumber,
                  Message: 'Audit Type 10 created',
                });

                eventLogs.push({
                  UserName: this.userInfo.userName,
                  EventTypeID: sqlData.Event_IM_Audit_Created,
                  Log: JSON.stringify({
                    DistributionCenter: environment.DistributionCenter,
                    InventoryTrackingNumber: inv.InventoryTrackingNumber,
                    AuditTypeID: 10,
                    Trigger: 'ITN Location Audit Search',
                    SearchedITN: JSON.parse(
                      sessionStorage.getItem('currentAudit')
                    ).Inventory.ITN,
                    SearchLocation: sessionStorage.getItem('CurrentLocation'),
                  }),
                });
              });
            })
          );
      }),
      switchMap(() => {
        return this._auditService.insertAudits(audits);
      }),
      switchMap(() => {
        return this._eventLog.insertLog(userEventLogs, eventLogs);
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
      this.data$ = this._auditService
        .clearAuditsByTimeout(this.userInfo.userId)
        .pipe(
          switchMap((res) => {
            this._router.navigate(['../../../menu'], {
              relativeTo: this._actRoute,
            });

            return of(res);
          })
        );
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
    this.scannedITNs = sessionStorage.getItem('scannedITNs')
      ? JSON.parse(sessionStorage.getItem('scannedITNs'))
      : [];

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
        DistributionCenter: this.userInfo.distributionCenter,
        InventoryTrackingNumber: itn,
        Message: '',
      },
    ];

    const eventLogs = [
      {
        UserName: this.userInfo.userName,
        EventTypeID: sqlData.Event_IM_Search_ITN_Scanned,
        Log: JSON.stringify({
          DistributionCenter: this.userInfo.distributionCenter,
          InventoryTrackingNumber: itn,
        }),
      },
    ];

    if (!this.scannedITNs.includes(itn)) {
      this.scannedITNs.unshift(itn);
    }

    sessionStorage.setItem('scannedITNs', JSON.stringify(this.scannedITNs));
    const closeAuditsUserEventLogs = [];
    const closeAuditsEventLogs = [];
    let audits = [];

    this.data$ = this._auditService.checkBinlocation(itn).pipe(
      switchMap((res) => {
        locs = JSON.parse(sessionStorage.getItem('searchLocations'));
        loc = locs?.find((loc) => loc.Status == 'active');
        barcode = res.data.findInventory?.Container?.Barcode;

        if (loc.Barcode != barcode) {
          userEventLogs.push({
            UserEventID: sqlData.Event_IM_Search_ITN_Location_Updated,
            UserName: this.userInfo.userName,
            DistributionCenter: this.userInfo.distributionCenter,
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
              DistributionCenter: this.userInfo.distributionCenter,
              InventoryTrackingNumber: itn,
              OriginalBinLocation: barcode,
              NewBinLocation: loc.Barcode,
            }),
          });

          return this._auditService
            .inventoryUpdate(
              this.userInfo.userName,
              itn,
              'Inventory Management Audit',
              '',
              '',
              '',
              '',
              '',
              loc.Barcode,
              'OK'
            )
            .pipe(
              switchMap((res) => {
                if (res.data?.inventoryUpdate?.StatusCode == '400') {
                  this._router.navigate(['../verify-quantity', itn], {
                    relativeTo: this._actRoute,
                  });
                }
                return this._auditService.findInventory(
                  environment.DistributionCenter,
                  itn.toString()
                );
              }),
              switchMap(async (res) => {
                audits = [];

                if (res.data.findInventory?._id) {
                  audits.push({
                    TypeID: 10,
                    InventoryID: res.data.findInventory._id,
                    InventoryTrackingNumber: itn,
                    LastUpdated: new Date(Date.now()).toISOString(),
                    CreatedDatetime: new Date(Date.now()).toISOString(),
                    UserID: this.userInfo.userId,
                    Trigger: 'Location Search',
                    Priority: 6,
                  });
                }

                userEventLogs.push({
                  UserEventID: sqlData.Event_IM_Audit_Created,
                  UserName: this.userInfo.userName,
                  DistributionCenter: environment.DistributionCenter,
                  InventoryTrackingNumber: itn,
                  Message: 'Audit Type 10 created',
                });

                eventLogs.push({
                  UserName: this.userInfo.userName,
                  EventTypeID: sqlData.Event_IM_Audit_Created,
                  Log: JSON.stringify({
                    DistributionCenter: environment.DistributionCenter,
                    InventoryTrackingNumber: itn,
                    AuditTypeID: 10,
                    Trigger: 'ITN Location Audit Search',
                    SearchedITN: JSON.parse(
                      sessionStorage.getItem('currentAudit')
                    ).Inventory.ITN,
                    SearchLocation: sessionStorage.getItem('CurrentLocation'),
                  }),
                });

                return await this._auditService.insertAudits(audits);
              }),
              switchMap((res) => {
                userEventLogs.push({
                  UserEventID: sqlData.Event_IM_Audit_Closed_ITN_Search,
                  UserName: this.userInfo.userName,
                  DistributionCenter: environment.DistributionCenter,
                  InventoryTrackingNumber: itn,
                  Message: 'Binlocaton: ' + barcode,
                });

                eventLogs.push({
                  UserName: this.userInfo.userName,
                  EventTypeID: sqlData.Event_IM_Audit_Closed_ITN_Search,
                  Log: JSON.stringify({
                    DistributionCenter: environment.DistributionCenter,
                    InventoryTrackingNumber: itn,
                    AuditTypeID: 10,
                    Trigger: 'ITN Location Audit Search',
                    SearchedITN: JSON.parse(
                      sessionStorage.getItem('currentAudit')
                    ).Inventory.ITN,
                    SearchLocation: sessionStorage.getItem('CurrentLocation'),
                  }),
                });

                if (audits[0]) {
                  return this._auditService.closeSearchAudit(
                    audits[0].InventoryID,
                    10
                  );
                }

                return of(res);
              })
            );
        } else {
          return this._auditService.inventoryUpdate(
            this.userInfo.userName,
            itn,
            'Inventory Management Audit',
            '',
            '',
            '',
            '',
            '',
            '',
            'OK'
          );
        }
      }),
      switchMap((res) => {
        return this._auditService.closeAudits(itn).pipe(
          map((res) => {
            res?.data.closeAudits.forEach((audit) => {
              userEventLogs.push({
                UserEventID: sqlData.Event_IM_Audit_Closed_ITN_Search,
                UserName: this.userInfo.userName,
                DistributionCenter: this.userInfo.distributionCenter,
                InventoryTrackingNumber: audit.InventoryTrackingNumber,
                Message: `Audit with _id: ${audit._id} closed.  ITN: ${audit.InventoryTrackingNumber}
                  found while searching for ITN: ${currentAudit.Inventory.ITN}`,
              });

              eventLogs.push({
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_Audit_Closed_ITN_Search,
                Log: JSON.stringify({
                  DistributionCenter: this.userInfo.distributionCenter,
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
        return this._eventLog.insertLog(userEventLogs, eventLogs);
      }),
      switchMap((res) => {
        if (
          itn ==
          JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.ITN
        ) {
          // locs.forEach((loc) => {
          //   loc.Status = 'done';
          // });

          // sessionStorage.setItem('searchLocations', JSON.stringify(locs));
          const audit: Audit = JSON.parse(
            sessionStorage.getItem('currentAudit')
          );

          audit.Container.Barcode = loc.Barcode;
          sessionStorage.setItem('currentAudit', JSON.stringify(audit));

          const auditList = [];

          return this._auditService.replanPick(itn).pipe(
            switchMap((res) => {
              return this._auditService
                .fetchInventoryAudits(
                  Number(
                    JSON.parse(sessionStorage.getItem('currentAudit'))
                      .InventoryID
                  )
                )
                .pipe(
                  map((res) => {
                    let msg = 'You found ' + itn + '<br/>Panding Audits:<br/>';
                    res.data.fetchInventoryAudits.forEach((audit) => {
                      msg += audit.Type.Type + '<br/>';
                      auditList.push(audit);
                    });

                    this.message = msg;
                  })
                );
            })
          );
          // this._auditService
          //   .fetchInventoryAudits(
          //     Number(
          //       JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID
          //     )
          //   )
          //   .pipe(
          //     map((res) => {
          //       let msg = 'You Found ' + itn + '<br/>Pending Audits:<br/>';
          //       res.data.fetchInventoryAudits.forEach((audit) => {
          //         msg += audit.Type.Type + '<br/>';
          //         auditList.push(audit);
          //       });

          //       this.message = msg;
          //     })
          //   );
        }
        return of(res);
      }),
      switchMap((res) => {
        this.beep.processed(10, 820);

        return of(res);
      }),
      switchMap((res) => {
        this._router.navigate(['../scan-itn'], {
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

  onBack(): void {
    this.test$ = this._auditService
      .LocationSearchDone(
        sessionStorage.getItem('searchLocation'),
        JSON.parse(sessionStorage.getItem('scannedITNs')),
        Number(JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID)
      )
      .pipe(
        switchMap((res) => {
          const locs = JSON.parse(sessionStorage.getItem('searchLocations'));
          const loc = locs?.find(
            (loc) => loc.Barcode == sessionStorage.getItem('searchLocation')
          );

          if (loc) {
            loc.Status = 'done';
            sessionStorage.setItem('searchLocations', JSON.stringify(locs));
          }

          return of(res);
        }),
        switchMap((res) => {
          sessionStorage.setItem('searchLevel', '2');
          sessionStorage.removeItem('searchLocation');
          this._router.navigate(['../scan-location'], {
            relativeTo: this._actRoute,
          });

          return of(res);
        })
      );
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
                DistributionCenter: this.userInfo.distributionCenter,
                InventoryTrackingNumber: currentAudit.Inventory.ITN,
              },
            ];

            const closeEventLog = [
              {
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_Audit_Completed,
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
                }),
              },
            ];

            this.data$ = this._eventLog
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
                        this.message = null;
                        this._router.navigate(['../scan-itn'], {
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
