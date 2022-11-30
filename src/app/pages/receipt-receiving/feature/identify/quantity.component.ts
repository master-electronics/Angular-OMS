import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
    RedButtonComponent,
  ],
  template: `
    <single-input-form
      (formBack)="onBack()"
      (formSubmit)="onSubmit()"
      [formGroup]="inputForm"
      [data]="data$ | async"
      controlName="quantity"
      title="Quantity"
      inputType="number"
    ></single-input-form>
    <div class="grid h-16 grid-cols-3 text-2xl md:mx-16 md:h-32 md:text-4xl">
      <div></div>
      <red-button
        *ngIf="showKickout"
        (buttonClick)="onKickout()"
        buttonText="Kickout"
      ></red-button>
    </div>
    <simple-keyboard
      [inputString]="inputForm.value.quantity"
      layout="number"
      (outputString)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class QuantityComponent implements OnInit {
  public inputForm: FormGroup;
  public data$;
  public showKickout = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _ui: ReceivingService,
    private _receipt: ReceiptInfoService
  ) {}

  ngOnInit(): void {
    if (!this._receipt.lineAfterPart?.length) {
      this._router.navigateByUrl('/receiptreceiving');
    }
    this._ui.changeSteps(1);
    this.data$ = this._actRoute.data;
    this.inputForm = this._fb.group({
      quantity: ['', Validators.required],
    });
  }

  onChange = (input: string) => {
    this.inputForm.get('quantity').setValue(input);
  };

  onKickout(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }

  onSubmit(): void {
    const vaild = this._receipt.lineAfterPart.some(
      (res) => res.ExpectedQuantity === Number(this.inputForm.value.quantity)
    );
    if (vaild) {
      this._receipt.filterByQuantity(Number(this.inputForm.value.quantity));
      this._router.navigateByUrl('receiptreceiving/update/country');
      return;
    }
    this.showKickout = true;
    this.data$ = of({
      error: {
        message: `Not found receipt line with this quantity!`,
        name: `warning`,
      },
    });
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part/verify');
  }
}
