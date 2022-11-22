import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DefalutDateCode } from 'src/app/shared/dataRegex';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceivingService } from '../../data/receivingService';
import { updateReceiptInfoService } from '../../data/updateReceipt';
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
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [validator]="validator"
        [formGroup]="inputForm"
        type="number"
        controlName="dateCode"
        title="Date Code"
      ></single-input-form>
      <simple-keyboard
        layout="number"
        [inputString]="inputForm.value.dateCode"
        (outputString)="onChange($event)"
      ></simple-keyboard>
    </div>
  `,
})
export class DateCodeComponent implements OnInit {
  public inputForm: FormGroup;
  public validator = {
    name: 'dateCode',
    message: 'Format must be YYWW(2 digit year, 2 digit week)',
  };

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: ReceivingService,
    private _update: updateReceiptInfoService
  ) {}

  ngOnInit(): void {
    if (!this._update.receiptInfo) {
      this._router.navigateByUrl('/receiptreceiving');
    }
    this._ui.changeSteps(2);
    this.inputForm = this._fb.group({
      dateCode: ['', [Validators.required, this.checkDateCode()]],
    });
  }

  public checkDateCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const isVaild = DefalutDateCode.test(value);
      return !isVaild ? { dateCode: true } : null;
    };
  }

  onChange = (input: string) => {
    this.inputForm.get('dateCode').setValue(input);
  };

  onSubmit(): void {
    this._update.updateDateCode(this.inputForm.value.dateCode);
    this._router.navigateByUrl('receiptreceiving/update/rhos');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/country');
  }
}