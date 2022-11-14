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
import { PartStore } from '../../data/part';
import { ReceivingUIStateStore } from '../../data/ui-state';
import { catchError, map, of, startWith } from 'rxjs';

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
      [inputFromParent]="inputForm.value.partNumber"
      (outputFromChild)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class PartComponent implements OnInit {
  public inputForm: FormGroup;
  public data$;
  public validator = {
    name: 'filter',
    message: 'Not Found part number!',
  };

  constructor(
    private _router: Router,
    private _partStore: PartStore,
    private _ui: ReceivingUIStateStore
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(1);
    this.inputForm = new FormGroup({
      partNumber: new FormControl('', [
        Validators.required,
        this.partNumberSearch(),
      ]),
    });
    console.log(this._partStore.receiptHeader);
    if (!this._partStore.receiptHeader.RECEIPTLs) {
      this.onBack();
    }
    this.data$ = this._partStore.receiptHeader$.pipe(
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
      const isVaild = this._partStore.receiptHeader.RECEIPTLs.some(
        (res) =>
          res.Product.PartNumber.trim().toLowerCase() ===
          value.trim().toLowerCase()
      );
      return !isVaild ? { filter: true } : null;
    };
  }

  onChange = (input: string) => {
    this.inputForm.setValue({ partNumber: input });
  };

  onSubmit(): void {
    this._partStore.filterPartnumber(this.inputForm.value.partNumber);
    this._router.navigate(['receiptreceiving/part/verify']);
  }

  onBack(): void {
    this._router.navigate(['receiptreceiving/receipt']);
  }
}
