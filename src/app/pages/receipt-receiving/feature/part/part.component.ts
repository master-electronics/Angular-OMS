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
import { ReceiptStore } from '../../data/Receipt';
import { FormState, ReceivingStore } from '../../data/receivingStore';
import { catchError, map, Observable, of, startWith } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
  ],

  template: `
    <ng-container *ngIf="data$ | async"></ng-container>
    <single-input-form
      (formBack)="onBack()"
      (formSubmit)="onSubmit()"
      [formState]="formState$ | async"
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
    private _receipt: ReceiptStore,
    private _ui: ReceivingStore
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(1);
    this.formState$ = this._ui.formState$;
    this.inputForm = new FormGroup({
      partNumber: new FormControl('', [
        Validators.required,
        this.partNumberSearch(),
      ]),
    });
    if (!this._receipt.receiptHeader?.RECEIPTLs) {
      this.onBack();
    }
    this.data$ = this._receipt.receiptHeader$.pipe(
      startWith({ isLoading: true }),
      map((res) => ({
        ...res,
        isLoading: false,
      }))
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
