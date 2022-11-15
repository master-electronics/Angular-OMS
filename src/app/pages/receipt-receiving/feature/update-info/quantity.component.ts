import { useAnimation } from '@angular/animations';
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
import { ReceivingUIStateStore } from '../../data/ui-state';
import { updateReceiptStore } from '../../data/updateReceipt';
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
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [formGroup]="inputForm"
      controlName="quantity"
      title="Quantity"
    ></single-input-form>
    <simple-keyboard
      layout="numbers"
      [inputFromParent]="inputForm.value.quantity"
      (outputFromChild)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class ROHSComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: ReceivingUIStateStore,
    private _update: updateReceiptStore
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(3);
    this.inputForm = this._fb.group({
      quantity: [0, Validators.required],
    });
  }

  onChange = (input: string) => {
    this.inputForm.get('ROHS').setValue(input);
  };

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/verify/rohs');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/verify/country');
  }
}
