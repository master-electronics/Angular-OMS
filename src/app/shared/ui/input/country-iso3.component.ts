import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { GobalValueStore } from '../../data/gobal-value';

@Component({
  selector: 'country-iso3',
  standalone: true,
  imports: [
    CommonModule,
    NzSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
  ],
  template: `
    <form [formGroup]="countryForm" (ngSubmit)="onSubmit()">
      <nz-form-label label nzRequired>Country</nz-form-label>
      <nz-select
        id="country"
        class="w-64"
        nzShowSearch
        nzSize="large"
        nzAllowClear
        nzAutoFocus="true"
        nzPlaceHolder="Select a Country"
        [formControlName]="controlName"
        #country
      >
        <div *ngFor="let country of countryList$ | async">
          <nz-option
            [nzLabel]="country.ISO3 + '-' + country.CountryName.trim()"
            [nzValue]="country._id"
          ></nz-option>
        </div>
        <nz-option nzDisabled nzCustomContent>
          <span nz-icon nzType="loading" class="loading-icon"></span>
          Loading Data...
        </nz-option>
      </nz-select>
    </form>
  `,
})
export class CountryISO3Component implements OnInit {
  public countryForm: FormGroup;
  public countryList$;
  @Input() controlName = 'country';
  @Output() formSubmit: EventEmitter<null> = new EventEmitter();

  constructor(
    private controlContainer: ControlContainer,
    private _gobalStore: GobalValueStore
  ) {}

  ngOnInit(): void {
    this.countryForm = this.controlContainer.control as FormGroup;
    if (this._gobalStore.countryList) {
      this.countryList$ = this._gobalStore.countryList$;
    } else {
      this.countryList$ = this._gobalStore.initCountryList();
    }
  }
  onSubmit() {
    //
  }
}
