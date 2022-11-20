import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SingleInputformComponent } from '../../ui/single-input-form.component';
import { CommonModule } from '@angular/common';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { FormState, ReceivingService } from '../../data/receivingService';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LabelService } from '../../data/label';

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
      (formBack)="onBack()"
      (formSubmit)="onSubmit()"
      [data]="data$ | async"
      [validator]="validator"
      [formGroup]="inputForm"
      controlName="partNumber"
      title="Part #"
    ></single-input-form>
    <simple-keyboard
      [inputString]="inputForm.value.partNumber"
      (outputString)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class PartComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;
  public formState$: Observable<FormState>;
  public validator = {
    name: 'filter',
    message: 'Not Found part number!',
  };

  constructor(
    private _router: Router,
    private _receipt: ReceiptInfoService,
    private _ui: ReceivingService,
    private _label: LabelService
  ) {}

  ngOnInit(): void {
    this._receipt.InitValue();
    this._label.initValue();
    this._ui.initFormState();
    this.formState$ = this._ui.formState$;
    this._ui.changeSteps(1);
    this.inputForm = new FormGroup({
      partNumber: new FormControl('', [
        Validators.required,
        this.partNumberSearch(),
      ]),
    });
    if (!this._receipt.headerID) {
      this.onBack();
    }
    this._ui.loadingOn();
    this.data$ = this._receipt.findReceiptHeader$().pipe(
      catchError((error) => {
        return of({
          loading: false,
          error: { message: error.message, type: 'error' },
        });
      })
    );
  }

  partNumberSearch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const isVaild = this._receipt.receiptHeader.RECEIPTLs.some(
        (line) =>
          line.Product.PartNumber.trim().toLowerCase() ===
          value.trim().toLowerCase()
      );
      return !isVaild ? { filter: true } : null;
    };
  }

  onChange = (input: string) => {
    this.inputForm.setValue({ partNumber: input });
  };

  onSubmit(): void {
    this._receipt.filterbyPartNumber(this.inputForm.value.partNumber);
    this._router.navigate(['receiptreceiving/part/verify']);
  }

  onBack(): void {
    this._router.navigate(['receiptreceiving/receipt']);
  }
}
