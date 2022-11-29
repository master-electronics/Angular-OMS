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
import { CountryListService } from '../../data/countryList';

@Component({
  selector: 'country-selector',
  standalone: true,
  imports: [
    CommonModule,
    NzSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
  ],
  template: `
    <form [formGroup]="countryForm">
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
            [nzValue]="country.ISO3 + '|' + country._id"
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
export class CountrySelectorComponent implements OnInit {
  public countryForm: FormGroup;
  public countryList$;
  @Input() controlName = 'country';
  @Output() formSubmit: EventEmitter<null> = new EventEmitter();

  constructor(
    private controlContainer: ControlContainer,
    private _list: CountryListService
  ) {}

  ngOnInit(): void {
    this.countryForm = this.controlContainer.control as FormGroup;
    this.countryList$ = this._list.countryList$;
  }
}
