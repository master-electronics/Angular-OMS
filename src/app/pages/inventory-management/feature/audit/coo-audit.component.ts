import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  combineLatest,
  of,
  tap,
  map,
  catchError,
  pipe,
  forkJoin,
  switchMap,
  Observable,
  distinctUntilChanged,
  take,
  Subscription,
  interval,
} from 'rxjs';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormsModule,
  AsyncValidatorFn,
  AbstractControl,
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
import { SearchListInputComponent } from '../../ui/search-list-input.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { CountryListService } from 'src/app/shared/data/countryList';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
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
    SearchListInputComponent,
    NormalButtonComponent,
    SubmitButtonComponent,
    SimpleKeyboardComponent,
    MessageBarComponent,
  ],
  template: `
    <ng-container *ngIf="auditInfo">
      <audit-info [auditInfo]="auditInfo"></audit-info>
    </ng-container>
    <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <div class="text-base sm:text-lg md:mx-16  md:text-2xl lg:text-4xl">
        <div class="gap-2 md:grid">
          <label class="mb-0.5 font-bold text-gray-700" for="country">
            Country
          </label>
          <search-list-input
            (formSubmit)="onSubmit()"
            controlName="country"
            [dataSource]="countryList$ | async"
          ></search-list-input>
        </div>
      </div>
      <div
        class="grid h-12 w-full grid-cols-3 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
      >
        <submit-button [disabled]="inputForm.invalid"> </submit-button>
        <normal-button
          class="col-start-3"
          (buttonClick)="onBack()"
        ></normal-button>
      </div>
    </form>
    <div style="height: 200px;"></div>
    <simple-keyboard
      [inputString]="this.inputForm.value.country"
      (outputString)="onChange($event)"
    ></simple-keyboard>
    <ng-container *ngIf="data$ | async as data">
      <message-bar [message]="data.message" [name]="data.name"></message-bar>
    </ng-container>
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
export class COOAudit implements OnInit {
  userInfo = inject(StorageUserInfoService);
  subscription: Subscription;
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _auditService: AuditService,
    private _eventLog: EventLogService,
    private _country: CountryListService
  ) {}

  public data$: Observable<any>;
  public close$;
  public info$;
  public countryList$;
  private countryInfo;
  public popup = false;
  public inputForm = this._fb.nonNullable.group({
    country: ['', [Validators.required], [this.countryValidator()]],
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

    this.countryList$ = this.inputForm.valueChanges.pipe(
      map((res) => res.country),
      distinctUntilChanged(),
      switchMap((searchQuery) => {
        return this._country.countryList$.pipe(
          map((res) => {
            return res.filter((country) => {
              if (!searchQuery.length) {
                return false;
              }
              if (searchQuery.length < 3) {
                return country.ISO2.includes(searchQuery.trim().toUpperCase());
              }
              if (searchQuery.length === 3) {
                return country.ISO3.includes(searchQuery.trim().toUpperCase());
              }
              return country.CountryName.trim()
                .toLocaleUpperCase()
                .includes(searchQuery.trim().toLocaleUpperCase());
            });
          }),
          map((res) => {
            this.countryInfo = res[0];
            return res.slice(0, 5).map((country) => ({
              name:
                country.ISO2 +
                ' - ' +
                country.ISO3 +
                ' - ' +
                country.CountryName +
                ' - ' +
                country._id,
            }));
          })
        );
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
    this.inputForm.patchValue({ country: input });
  }

  onInputFocus(event) {
    this.currentInputField = this.inputForm.get(`field${event.target.id}`);
  }

  onSubmit() {
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );
    let coo;

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
            if (this.countryInfo) {
              coo = this.countryInfo.ISO2;
            } else {
              const [iso2, iso3, , id] =
                this.inputForm.value.country.split(' - ');
              coo = iso2.toUpperCase();
            }

            const userEventLogs = [
              {
                UserEventID: sqlData.Event_IM_COO_Entered,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                Message: 'Country of Origin: ' + coo,
              },
            ];

            const eventLogs = [
              {
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_COO_Entered,
                Log: JSON.stringify({
                  DistributionCenter: environment.DistributionCenter,
                  InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                  ParentITN: currentAudit.Inventory.ParentITN,
                  BinLocation: currentAudit.Container.Barcode,
                  QuantityOnHand: currentAudit.Inventory.Quantity,
                  OriginalQuantity: currentAudit.Inventory.OriginalQuantity,
                  DateCode: currentAudit.Inventory.DateCode,
                  CountryOfOrigin: currentAudit.Inventory.COO,
                  CountryOfOriginEntered: coo,
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
              coo !=
              JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.COO
            ) {
              userEventLogs.push({
                UserEventID: sqlData.Event_IM_COO_Updated,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                Message:
                  'Original COO: ' +
                  JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                    .COO +
                  ' --- New COO: ' +
                  coo,
              });

              eventLogs.push({
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_COO_Updated,
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
                  NewCOOCode: coo,
                }),
              });
            }

            this.data$ = this._eventLog
              .insertLog(userEventLogs, eventLogs)
              .pipe(
                switchMap(() => {
                  return this._auditService.updateLastUpdated(
                    currentAudit.InventoryID,
                    40,
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
                    coo
                  );
                }),
                switchMap((res) => {
                  return this._auditService.deleteAudit(
                    JSON.parse(sessionStorage.getItem('currentAudit'))
                      .InventoryID,
                    40
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
                                CountryOfOrigin: currentAudit.Inventory.COO,
                                CountryOfOriginEntered: coo,
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

  countryValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this._country.countryList$.pipe(
        map((res) => {
          return res.map((country) => ({
            name:
              country.ISO2 +
              ' - ' +
              country.ISO3 +
              ' - ' +
              country.CountryName +
              ' - ' +
              country._id,
          }));
        }),
        map((list) => {
          if (control.value.length === 2) {
            return list.some((country) => {
              if (
                country.name.substring(0, 2).toLocaleUpperCase() ===
                control.value.toLocaleUpperCase()
              ) {
                return true;
              }
              return false;
            });
          }
          if (control.value.length === 3) {
            return list.some((country) => {
              if (
                country.name.substring(5, 8).toLocaleUpperCase() ===
                control.value.trim().toLocaleUpperCase()
              ) {
                return true;
              }
              return false;
            });
          }
          if (control.value.length > 6) {
            return list.some(
              (country) =>
                country.name.toLocaleUpperCase() ===
                control.value.toLocaleUpperCase()
            );
          }
          return false;
        }),
        map((res) => (!res ? { notExist: true } : null)),
        take(1)
      );
    };
  }

  onBack() {
    this._router.navigate(['../scan-itn'], { relativeTo: this._actRoute });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
