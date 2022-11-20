import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { FormState, ReceivingService } from '../../data/receivingService';
import { SingleInputformComponent } from '../../ui/single-input-form.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
  ],
  template: `
    <div class="grid grid-cols-2 gap-5">
      <single-input-form
        (formBack)="onBack()"
        (formSubmit)="onSubmit()"
        [formGroup]="inputForm"
        controlName="quantity"
        title="Quantity"
        type="number"
      ></single-input-form>
      <simple-keyboard
        [inputString]="inputForm.value.quantity"
        layout="number"
        (outputString)="onChange($event)"
      ></simple-keyboard>
    </div>
    <div *ngIf="showKickout" class="mt-8 h-12 w-32 rounded-md bg-red-500">
      <button
        nz-button
        nzSize="large"
        type="button"
        (click)="kickout()"
        class="h-12 w-32"
        nzGhost
      >
        KickOut
      </button>
    </div>
  `,
})
export class QuantityComponent implements OnInit {
  public inputForm: FormGroup;
  public showKickout = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: ReceivingService,
    private _receipt: ReceiptInfoService
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(1);
    this._ui.initFormState();
    if (!this._receipt.receiptLs?.length) {
      this.onBack();
    }
    this.inputForm = this._fb.group({
      quantity: ['', Validators.required],
    });
  }

  onChange = (input: string) => {
    this.inputForm.get('quantity').setValue(input);
  };

  kickout(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }

  onSubmit(): void {
    const vaild = this._receipt.receiptLs.some(
      (res) => res.ExpectedQuantity === Number(this.inputForm.value.quantity)
    );
    if (vaild) {
      this._receipt.filterByQuantity(Number(this.inputForm.value.quantity));
      this._router.navigateByUrl('receiptreceiving/update/country');
      return;
    }
    this.showKickout = true;
    this._ui.updateMessage(
      `Not found receipt line with this quantity!`,
      'warning'
    );
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part/verify');
  }
}
