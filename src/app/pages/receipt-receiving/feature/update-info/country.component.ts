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
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { CountrySelectorComponent } from 'src/app/shared/ui/input/country-selector.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';
import { updateReceiptInfoService } from '../../data/updateReceipt';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SimpleKeyboardComponent,
    NzFormModule,
    NzButtonModule,
    SubmitButtonComponent,
    NormalButtonComponent,
    CountrySelectorComponent,
  ],
  template: `
    <form
      nz-form
      [formGroup]="inputForm"
      nzLayout="horizontal"
      (ngSubmit)="onSubmit()"
    >
      <div class="flex justify-center">
        <country-selector></country-selector>
      </div>
      <div class="grid h-16 grid-cols-3 text-2xl md:mx-16 md:h-32 md:text-4xl">
        <submit-button [disabled]="inputForm.invalid" (formClick)="onSubmit()">
        </submit-button>
        <div></div>
        <normal-button (formClick)="onBack()"></normal-button>
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
    private _info: updateReceiptInfoService,
    private _receipt: ReceiptInfoService,
    private _step: ReceivingService
  ) {}

  ngOnInit(): void {
    if (!this._receipt.receiptLsAfterQuantity?.length) {
      // this._router.navigateByUrl('/receiptreceiving');
    }
    this._info.initReceiptInfo();
    this._step.changeSteps(2);
  }

  onChange = (input: string) => {
    this.inputForm.get('country').setValue(input);
  };

  onSubmit(): void {
    const [iso3, id] = this.inputForm.value.country.split('|');
    this._info.updateCountry(Number(id), iso3);
    this._router.navigateByUrl('receiptreceiving/update/datecode');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part/quantity');
  }
}
