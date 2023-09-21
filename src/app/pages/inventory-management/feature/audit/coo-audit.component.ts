import { Component, OnInit } from '@angular/core';
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
    <div *ngIf="close$ | async"></div>
  `,
})
export class COOAudit implements OnInit {
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
  public countryList$;
  private countryInfo;
  public popup = false;
  public inputForm = this._fb.nonNullable.group({
    country: ['', [Validators.required], [this.countryValidator()]],
  });
  public currentInputField;
  auditInfo: Audit;

  ngOnInit(): void {
    if (sessionStorage.getItem('currentAudit')) {
      const currentAudit: Audit = JSON.parse(
        sessionStorage.getItem('currentAudit')
      );
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

  onChange(input: string) {
    this.inputForm.patchValue({ country: input });
  }

  onInputFocus(event) {
    this.currentInputField = this.inputForm.get(`field${event.target.id}`);
  }

  onSubmit() {
    let coo;
    if (this.countryInfo) {
      coo = this.countryInfo.ISO2;
    } else {
      const [iso2, iso3, , id] = this.inputForm.value.country.split(' - ');
      coo = iso2.toUpperCase();
    }

    const userEventLogs = [
      {
        UserEventID: sqlData.Event_IM_COO_Entered,
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
        Message: 'Country of Origin: ' + coo,
      },
    ];

    const eventLogs = [
      {
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        EventTypeID: sqlData.Event_IM_COO_Entered,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
          COO: coo,
        }),
      },
    ];

    if (
      coo != JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.COO
    ) {
      userEventLogs.push({
        UserEventID: sqlData.Event_IM_COO_Updated,
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
        Message:
          'Original COO: ' +
          JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.COO +
          ' --- New COO: ' +
          coo,
      });

      eventLogs.push({
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        EventTypeID: sqlData.Event_IM_COO_Updated,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
          OriginalCOO: JSON.parse(sessionStorage.getItem('currentAudit'))
            .Inventory.COO,
          NewCOOCode: coo,
        }),
      });
    }

    this.data$ = this._eventLog.insertLog(userEventLogs, eventLogs).pipe(
      switchMap((res) => {
        return this._auditService.inventoryUpdate(
          JSON.parse(sessionStorage.getItem('userInfo')).Name,
          sessionStorage.getItem('auditITN'),
          'Inventory Management Audit',
          '',
          '',
          coo
        );
      }),
      switchMap((res) => {
        return this._auditService.deleteAudit(
          JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
          40
        );
      }),
      switchMap((res) => {
        return this._auditService
          .nextSubAudit$(
            JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
            Number(JSON.parse(sessionStorage.getItem('userInfo'))._id)
          )
          .pipe(
            tap((res) => {
              if (!res) {
                this.close$ = this._auditService
                  .closeAudit(
                    JSON.parse(sessionStorage.getItem('currentAudit'))
                      .InventoryID,
                    10,
                    JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                      .ITN,
                    JSON.parse(sessionStorage.getItem('userInfo')).Name
                  )
                  .pipe(
                    map((res) => {
                      this._router.navigate(['../verify/scan-itn'], {
                        relativeTo: this._actRoute,
                      });

                      return res;
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
}
