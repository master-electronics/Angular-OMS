import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'country-selecter',
  template: `
    <form [formGroup]="inputForm" class="md:text-2xl lg:text-4xl">
      <label class="mb-0.5 block font-bold text-gray-700" for="country">
        Country
      </label>
      <input
        formControlName="country"
        [ngClass]="
          inputForm.get('country').invalid && inputForm.get('country').dirty
            ? 'border-red-500'
            : 'border-blue-500'
        "
        class="focus:shadow-outline h-fit w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none "
        id="country"
        placeholder="Select a country"
        #input
      />
      <div
        *ngIf="
          inputForm.get('country').invalid && inputForm.get('country').dirty;
          else NonError
        "
        class="italic text-red-500"
      >
        <div *ngIf="inputForm.get('country').errors?.['required']">
          This field is required.
        </div>
        <div *ngIf="inputForm.get('country').errors?.['country']">
          Must select a country under the list!
        </div>
      </div>
      <ng-template #NonError>
        <div class="opacity-0 ">no error</div>
      </ng-template>
      <div
        id="dropdown"
        class="fixed z-10 divide-y divide-gray-100 rounded bg-white shadow dark:bg-gray-700"
      >
        <ul
          class="py-1 text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdown-button"
          *ngFor="let country of countryList"
        >
          <li>
            <button
              type="button"
              (click)="onClick(country)"
              class="inline-flex w-full px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              {{ country.name }}
            </button>
          </li>
        </ul>
      </div>
    </form>
  `,
})
export class CountrySelecterComponent implements OnInit {
  public inputForm: FormGroup;
  @Input() countryList;

  @ViewChild('input') inputFiled!: ElementRef;
  ngAfterViewInit(): void {
    this.inputFiled.nativeElement.focus();
  }
  constructor(private controlContainer: ControlContainer) {}

  ngOnInit() {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  onClick(country) {
    this.inputForm.patchValue({ country: country.name });
  }
}
