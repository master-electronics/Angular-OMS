import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
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
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { SearchListInputComponent } from '../../ui/search-list-input.component';
import { AuthModalComponent } from 'src/app/shared/ui/modal/auth-modal.component';
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
    <ng-container *ngIf="popup">
      <auth-modal
        message="Allow Unknown Country"
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
  private countryInfo;
  public data$: Observable<any>;
  public popup = false;
  public inputForm = this._fb.group({
    country: ['', [Validators.required], [this._update.countryValidator()]],
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _update: updateReceiptInfoService,
    private _step: TabService,
    private _country: CountryListService
  ) {}

  ngOnInit(): void {
    this._step.changeSteps(2);
    this._update.initReceiptInfo();
    this.countryList$ = this.inputForm.valueChanges.pipe(
      map((res) => res.country),
      // debounceTime(100),
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
            // save value for upate info
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

  onSubmit(): void {
    if (this.countryInfo) {
      this._update.updateCountry(this.countryInfo._id, this.countryInfo.ISO3);
    } else {
      const [iso2, iso3, , id] = this.inputForm.value.country.split(' - ');
      if (!iso3 || !id) {
        return;
      }
      this._update.updateCountry(Number(id), iso3);
    }
    // pop out auth window when UNK
    if (this._update.receiptInfo.ISO3 === 'UNK') {
      this.popup = true;
      return;
    }
    this._router.navigateByUrl('receiptreceiving/update/datecode');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part/quantity');
  }

  passAuth(Supervisor: string): void {
    this.data$ = this._update
      .passAuthForNotApplicable$(Supervisor, 'country')
      .pipe(
        map(() => {
          // Unknown country id is 253
          this._update.updateCountry(253, 'UNK');
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
