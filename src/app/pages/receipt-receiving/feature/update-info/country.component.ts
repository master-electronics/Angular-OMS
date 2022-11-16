import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CountryISO3Component } from 'src/app/shared/ui/input/country-iso3.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceiptStore } from '../../data/Receipt';
import { ReceivingStore } from '../../data/receivingStore';
import { updateReceiptStore } from '../../data/updateReceipt';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SimpleKeyboardComponent,
    NzFormModule,
    NzButtonModule,
    CountryISO3Component,
  ],
  template: `
    <form
      nz-form
      [formGroup]="inputForm"
      nzLayout="horizontal"
      (ngSubmit)="onSubmit()"
    >
      <div class="flex justify-center">
        <country-iso3></country-iso3>
      </div>
      <div class="mb-6 mt-6 flex justify-center">
        <button
          nz-button
          type="submit"
          nzSize="large"
          nzType="primary"
          [disabled]="inputForm.invalid"
          class="mr-20 w-32"
        >
          Submit
        </button>
        <button nz-button nzSize="large" type="button" (click)="onBack()">
          Back
        </button>
      </div>
    </form>
  `,
})
export class CountryComponent implements OnInit {
  public inputForm = this._fb.group({
    country: ['', Validators.required],
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _info: updateReceiptStore,
    private _receipt: ReceiptStore
  ) {}

  ngOnInit(): void {
    if (!this._receipt.receiptLsAfterQuantity?.length) {
      this.onBack();
    }
    this._info.initReceiptInfo();
  }

  onChange = (input: string) => {
    this.inputForm.get('country').setValue(input);
  };

  onSubmit(): void {
    this._info.updateCountryID(Number(this.inputForm.value.country));
    this._router.navigateByUrl('receiptreceiving/update/datecode');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part/quantity');
  }
}
