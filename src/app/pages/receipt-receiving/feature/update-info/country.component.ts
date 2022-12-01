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
import { ReceivingService } from '../../data/receivingService';
import { updateReceiptInfoService } from '../../data/updateReceipt';
import { CountryListService } from 'src/app/shared/data/countryList';
import { debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs';
import { SearchListInputComponent } from '../../ui/search-list-input.component';

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
  ],
  template: `
    <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <div class="grid grid-cols-3">
        <div class="col-start-2 text-4xl">
          <label class="mb-0.5 block font-bold text-gray-700" for="country">
            Country
          </label>
          <search-list-input
            controlName="country"
            [dataSource]="countryList$ | async"
          ></search-list-input>
        </div>
      </div>
      <div class="grid h-16 grid-cols-3 text-2xl md:mx-16 md:h-32 md:text-4xl">
        <submit-button [disabled]="inputForm.invalid"> </submit-button>
        <normal-button
          class="col-start-3"
          (buttonClick)="onBack()"
        ></normal-button>
      </div>
    </form>
    <simple-keyboard
      [inputString]="inputForm.value.country"
      (outputString)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class CountryComponent implements OnInit {
  public countryList$;
  public countryInfo;
  public inputForm = this._fb.group({
    country: ['', [Validators.required], [this.countryValidator()]],
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _info: updateReceiptInfoService,
    private _step: ReceivingService,
    private _country: CountryListService
  ) {}

  ngOnInit(): void {
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
              if (searchQuery.length < 4) {
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
    this._info.initReceiptInfo();
    this._step.changeSteps(2);
  }

  countryValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this._country.countryList$.pipe(
        map((res) => {
          return res.map((country) => ({
            name:
              country.ISO3 + ' - ' + country.CountryName + ' - ' + country._id,
          }));
        }),
        map((list) => {
          if (control.value.trim().length === 3) {
            return list.some((country) => {
              if (
                country.name.substring(0, 3).toLocaleUpperCase() ===
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
    const [iso3, , id] = this.countryInfo.split(' - ');
    this._info.updateCountry(Number(id), iso3);
    this._router.navigateByUrl('receiptreceiving/update/datecode');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part/quantity');
  }
}
