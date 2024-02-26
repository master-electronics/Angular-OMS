import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  ITNBarcodeRegex,
  ShelfBarcodeBarcodeRegex,
} from 'src/app/shared/utils/dataRegex';
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
  Container,
} from '../../utils/interfaces';
import { FindContainerGQL } from 'src/app/graphql/pick.graphql-gen';
import { environment } from 'src/environments/environment';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { BeepBeep } from 'src/app/shared/utils/beeper';
import { AuditService } from '../../data/audit.service';

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
    <ng-container *ngIf="info$ | async as info"> </ng-container>
    <page-header headerText="{{ headerText }}"></page-header>
    <div *ngIf="locations.length > 0">
      <div nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }">
        <div nz-col nzSpan="14" class="text-black md:text-lg lg:text-xl">
          <div
            class="justify-self-start text-blue-600"
            style="display: inline-block;"
          >
            <div *ngFor="let location of locations">
              <span *ngIf="location.Status != 'done'">{{
                location.Barcode
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ng-container *ngIf="this.showTimeoutAlert">
      <popup-modal
        (clickSubmit)="resetTimeout()"
        [message]="timeoutAlert"
      ></popup-modal>
    </ng-container>
    <ng-container *ngIf="this.adjacentMessage">
      <popup-modal
        (clickSubmit)="this.adjacentMessage = null"
        (clickCancel)="this.adjacentMessage = null"
        [cancelVisible]="showCancel"
        [message]="adjacentMessage"
      ></popup-modal>
    </ng-container>
    <div
      style="position: fixed; bottom: 0px; background-color: white; width: 95%"
    >
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [data]="data$ | async"
        [formGroup]="inputForm"
        inputType="string"
        controlName="barcode"
        title="Scan Location:"
        [isvalid]="this.inputForm.valid"
      >
      </single-input-form>
      <div style="height: 20px"></div>
      <ng-container *ngIf="showNoAdjacent">
        <div nz-row [nzGutter]="8">
          <div nz-col nzSpan="10" nzOffset="7" class="grid h-12">
            <button
              (click)="noAdjacent()"
              class="h-full w-full rounded-lg bg-red-700 font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-red-200  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              type="button"
            >
              Done Searching
            </button>
          </div>
        </div>
      </ng-container>
      <div style="height: 10px;"></div>
    </div>
  `,
})
export class ScanLocation implements OnInit {
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
  public inputForm = this._fb.nonNullable.group({
    barcode: ['', [Validators.required]],
  });

  auditInfo: Audit;
  locations: Container[];
  auditTimeout: number;
  alertTime: number;
  lastUpdated: number;
  timeoutSeconds = 0;
  showTimeoutAlert;
  timeoutAlert;
  showNoAdjacent = false;
  adjacentMessage;
  headerText;
  showCancel = false;

  ngOnInit(): void {
    sessionStorage.removeItem('searching');
    sessionStorage.removeItem('scannedITNs');
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    this.info$ = this._actRoute.data.pipe(
      map((res) => {
        if (sessionStorage.getItem('searchLevel') == '1') {
          this.headerText = 'Scan the following location:';
          this.locations = [
            {
              Barcode: sessionStorage.getItem('CurrentLocation'),
              Status: 'open',
            },
          ];
          this.data$ = of(true);
          return of(true);
        }

        if (res.Location.location.length == 0) {
          sessionStorage.removeItem('searchLocations');
        }
        const locs = JSON.parse(sessionStorage.getItem('searchLocations'));
        this.locations = [];

        if (locs) {
          locs.forEach((loc) => {
            this.locations.push({
              Barcode: loc.Barcode.toString().trim(),
              Status: loc.Status == 'done' ? loc.Status : 'open',
            });
          });

          sessionStorage.setItem(
            'searchLocations',
            JSON.stringify(this.locations)
          );

          this.lastUpdated = Number(currentAudit?.LastUpdated);
          this.auditTimeout =
            res?.Location?.auditTimeout?.data?.fetchConfigValue.Value;
          this.alertTime =
            res?.Location?.alertTime?.data?.fetchConfigValue.Value;
          this.auditInfo = {
            Container: {
              Barcode: res.Location.location[0].Barcode,
            },
          };

          const timeoutTimer = interval(1000);
          this.subscription = timeoutTimer.subscribe((val) => this.timer());

          const open = this.locations.find((item) => item.Status == 'open');
          if (!open) {
            this.headerText = 'Scan a Location to search';
            sessionStorage.removeItem('CurrentLocation');
            this.adjacentMessage =
              "No adjacent locations found. Scan a location to search. When done click 'Done Searching'";
            this.showNoAdjacent = true;
          }

          return of(true);
        }

        if (res.Location.location.length == 0) {
          this.headerText = 'Scan a Location to search';
          sessionStorage.removeItem('CurrentLocation');
          this.adjacentMessage =
            "No adjacent locations found. Scan a location to search. When done click 'Done Searching'";
          this.showNoAdjacent = true;
          return of(true);
        }
        res.Location.location.forEach((location) => {
          this.locations.push({
            Barcode: location.Barcode.toString().trim(),
            Status: 'open',
          });
        });

        this.lastUpdated = Number(currentAudit?.LastUpdated);
        this.auditTimeout =
          res?.Location?.auditTimeout?.data?.fetchConfigValue.Value;
        this.alertTime = res?.Location?.alertTime?.data?.fetchConfigValue.Value;
        this.auditInfo = {
          Container: {
            Barcode: res.Location.location[0].Barcode,
          },
        };

        const timeoutTimer = interval(1000);
        this.subscription = timeoutTimer.subscribe((val) => this.timer());

        sessionStorage.setItem(
          'searchLocations',
          JSON.stringify(this.locations)
        );
        return of(true);
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

    let minutes = Math.floor(secondsRemaining / 600);
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
    const barcode = this.inputForm.value.barcode.replace(/-/g, '').trim();

    const open = this.locations.find((item) => item.Status == 'open');
    if (!open) {
      const userEventLog = [
        {
          UserEventID: sqlData.Event_IM_Search_Location_Scanned,
          UserName: this.userInfo.userName,
          DistributionCenter: this.userInfo.distributionCenter,
          Message: 'Location: ' + barcode,
        },
      ];

      const eventLog = [
        {
          UserName: this.userInfo.userName,
          EventTypeID: sqlData.Event_IM_Search_Location_Scanned,
          Log: JSON.stringify({
            DistributionCenter: this.userInfo.distributionCenter,
            Location: barcode,
          }),
        },
      ];

      this.data$ = this._eventLog.insertLog(userEventLog, eventLog).pipe(
        switchMap((res) => {
          return this._findContainer
            .fetch(
              {
                Container: {
                  DistributionCenter: this.userInfo.distributionCenter,
                  Barcode: barcode,
                },
              },
              { fetchPolicy: 'network-only' }
            )
            .pipe(
              tap((res) => {
                if (!res.data.findContainer) {
                  throw new Error('Location not found');
                }
              }),
              map((res) => {
                const loc = {
                  Barcode: barcode,
                  Status: 'active',
                };

                let locs = JSON.parse(
                  sessionStorage.getItem('searchLocations')
                );

                if (!locs) {
                  locs = [];
                }

                locs.push(loc);
                sessionStorage.setItem('searchLocations', JSON.stringify(locs));
                sessionStorage.setItem('searchLocation', barcode);
                sessionStorage.setItem('searching', 'true');
                this._router.navigate(['../scan-itn'], {
                  relativeTo: this._actRoute,
                });
              })
            );
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
    } else {
      const t = 'test';
      const location = this.locations.find(
        (item) => item.Barcode == barcode && item.Status != 'done'
      );

      if (!location) {
        this.data$ = of({
          error: { message: 'Incorrect Location!', type: 'error' },
        });
      } else {
        const userEventLog = [
          {
            UserEventID: sqlData.Event_IM_Search_Location_Scanned,
            UserName: this.userInfo.userName,
            DistributionCenter: this.userInfo.distributionCenter,
            Message: 'Location: ' + barcode,
          },
        ];

        const eventLog = [
          {
            UserName: this.userInfo.userName,
            EventTypeID: sqlData.Event_IM_Search_Location_Scanned,
            Log: JSON.stringify({
              DistributionCenter: this.userInfo.distributionCenter,
              Location: barcode,
            }),
          },
        ];

        this.data$ = this._eventLog.insertLog(userEventLog, eventLog).pipe(
          switchMap((res) => {
            return this._findContainer
              .fetch(
                {
                  Container: {
                    DistributionCenter: this.userInfo.distributionCenter,
                    Barcode: barcode,
                  },
                },
                { fetchPolicy: 'network-only' }
              )
              .pipe(
                tap((res) => {
                  if (!res.data.findContainer) {
                    throw new Error('Location not found');
                  }
                }),
                map((res) => {
                  const loc = this.locations.find(
                    (loc) => loc.Barcode == barcode
                  );
                  loc.Status = 'active';
                  sessionStorage.setItem('searchLocation', barcode);
                  sessionStorage.removeItem('scannedITNs');
                  sessionStorage.setItem(
                    'searchLocations',
                    JSON.stringify(this.locations)
                  );
                  sessionStorage.setItem('searching', 'true');
                  this._router.navigate(['../scan-itn'], {
                    relativeTo: this._actRoute,
                  });
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
    }
  }

  onBack(): void {
    this._router.navigate(['../../scan-itn'], {
      relativeTo: this._actRoute,
    });
  }

  noAdjacent() {
    const userEventLogs = {
      UserEventID: sqlData.Event_IM_Search_Audit_Closed_NF,
      UserName: this.userInfo.userName,
      DistributionCenter: this.userInfo.distributionCenter,
      InventoryTrackingNumber: JSON.parse(
        sessionStorage.getItem('currentAudit')
      ).Inventory.ITN,
    };

    const eventLogs = {
      UserName: this.userInfo.userName,
      EventTypeID: sqlData.Event_IM_Search_Audit_Closed_NF,
      Log: JSON.stringify({
        DistributionCenter: this.userInfo.distributionCenter,
        InventoryTrackingNumber: JSON.parse(
          sessionStorage.getItem('currentAudit')
        ).Inventory.ITN,
      }),
    };

    this.data$ = this._eventLog.insertLog(userEventLogs, eventLogs).pipe(
      switchMap(() => {
        const SuspectData = [
          {
            InventoryID: JSON.parse(sessionStorage.getItem('currentAudit'))
              .InventoryID,
            Reason:
              'InventoryTrackingNumber: ' +
              JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.ITN +
              ' Not found during Audit search',
          },
        ];
        return this._auditService.insertSuspect(SuspectData);
      }),
      switchMap(() => {
        return this._auditService.inventoryUpdate(
          this.userInfo.userName,
          JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.ITN,
          'Inventory Mangement Audit',
          '0'
        );
      }),
      switchMap(() => {
        return this._auditService.deleteAudits(
          JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID
        );
      }),
      switchMap((res) => {
        this._router.navigate(['../../scan-itn'], {
          relativeTo: this._actRoute,
        });

        return of(res);
      })
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
