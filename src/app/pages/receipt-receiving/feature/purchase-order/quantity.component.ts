import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { FormState } from '../../data/ui-state';
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
        (submit)="onSubmit()"
        (back)="onBack()"
        [formState]="formState$ | async"
        [formGroup]="inputForm"
        controlName="quantity"
        title="Quantity"
        type="number"
      ></single-input-form>
      <div ngIf="this." class="w-32 rounded-md bg-red-500">
        <button
          nz-button
          type="button"
          (click)="kickout()"
          class="w-32"
          nzGhost
        >
          KickOut
        </button>
      </div>
      <simple-keyboard
        [inputString]="inputForm.value.quantity"
        layout="number"
        (outputString)="onChange($event)"
      ></simple-keyboard>
    </div>
  `,
})
export class QuantityComponent {
  public inputForm: FormGroup;
  public formState$: Observable<FormState>;

  constructor(private _fb: FormBuilder, private _router: Router) {
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
    this._router.navigateByUrl('receiptreceiving/purchaseorder/label');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/purchaseorder');
  }
}
