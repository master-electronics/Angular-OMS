import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { updateReceiptInfoService } from '../../data/updateReceipt';
import { CountryListService } from 'src/app/shared/data/countryList';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { SearchListInputComponent } from '../../ui/search-list-input.component';
import { AuthModalComponent } from 'src/app/shared/ui/modal/auth-modal.component';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { LogService } from '../../data/eventLog';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SimpleKeyboardComponent,
    SubmitButtonComponent,
    NormalButtonComponent,
    SearchListInputComponent,
    AuthModalComponent,
    MessageBarComponent,
  ],
  template: `
    <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <div class="grid grid-cols-3">
        <div class="col-start-2 text-4xl">
          <label class="mb-0.5 block font-bold text-gray-700" for="country">
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
        class="grid h-32 grid-cols-3  gap-10 text-2xl md:mx-16 md:mt-10 md:h-64 md:text-4xl"
      >
        <submit-button [disabled]="inputForm.invalid"> </submit-button>
        <normal-button
          class="col-start-3"
          (buttonClick)="onBack()"
        ></normal-button>
        <normal-button
          buttonText="Unknown"
          (buttonClick)="this.popup = true"
        ></normal-button>
      </div>
    </form>
    <simple-keyboard
      [inputString]="inputForm.value.country"
      (outputString)="onChange($event)"
    ></simple-keyboard>
    <ng-container *ngIf="popup">
      <auth-modal
        message="Allow Empty DateCode!"
        (clickClose)="this.popup = false"
        (passAuth)="passAuth($event)"
      ></auth-modal>
    </ng-container>
    <ng-container *ngIf="data$ | async as data">
      <message-bar [message]="data.message" [name]="data.name"></message-bar>
    </ng-container>
  `,
})
export class CountryComponent implements OnInit {
  public countryList$;
  public countryInfo;
  public data$: Observable<any>;
  public popup = false;
  public inputForm = this._fb.group({
    country: ['', [Validators.required], [this.countryValidator()]],
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _info: updateReceiptInfoService,
    private _step: TabService,
    private _country: CountryListService,
    private _inserlog: Insert_UserEventLogsGQL,
    private _log: LogService
  ) {}

  ngOnInit(): void {
    this._info.initReceiptInfo();
    this.countryList$ = this.inputForm.valueChanges.pipe(
      map((res) => res.country),
      debounceTime(300),
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
    this._step.changeSteps(2);
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
          if (control.value.trim().length === 2) {
            return list.some((country) => {
              if (
                country.name.substring(0, 2).toLocaleUpperCase() ===
                control.value.trim().toLocaleUpperCase()
              ) {
                this.countryInfo = country.name;
                return true;
              }
              return false;
            });
          }
          if (control.value.trim().length === 3) {
            return list.some((country) => {
              if (
                country.name.substring(5, 8).toLocaleUpperCase() ===
                control.value.trim().toLocaleUpperCase()
              ) {
                this.countryInfo = country.name;
                return true;
              }
              return false;
            });
          }
          if (control.value.trim().length > 6) {
            return list.some(
              (country) =>
                country.name.trim().toLocaleUpperCase() ===
                control.value.trim().toLocaleUpperCase()
            );
          }
          return false;
        }),
        map((res) => (!res ? { notExist: true } : null)),
        take(1)
      );
    };
  }

  onChange(input: string) {
    this.inputForm.patchValue({ country: input });
  }

  onSubmit(): void {
    if (!this.countryInfo) {
      this.countryInfo = this.inputForm.value.country;
    }
    const [iso2, iso3, , id] = this.countryInfo.split(' - ');
    if (iso2 === 'UN') {
      this.popup = true;
      return;
    }
    this._info.updateCountry(Number(id), iso3);
    this._router.navigateByUrl('receiptreceiving/update/datecode');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part/quantity');
  }

  passAuth(Supervisor: string): void {
    this.data$ = this._inserlog
      .mutate({
        log: [
          {
            ...this._log.receivingLog,
            UserEventID: sqlData.Event_Receiving_NotApplicable,
            Message: 'Country' + Supervisor,
          },
        ],
      })
      .pipe(
        map(() => {
          // Unknown country id is 253
          this._info.updateCountry(253, 'UNK');
          this._router.navigateByUrl('receiptreceiving/update/datecode');
          return null;
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }
}
