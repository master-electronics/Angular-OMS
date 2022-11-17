import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from '../../ui/single-input-form.component';
import { FormState, ReceivingStore } from '../../data/receivingStore';
import { LabelStore, ITNinfo } from '../../data/label';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SingleInputformComponent,
  ],
  template: `
    <ng-container *ngIf="data$ | async"></ng-container>
    <div *ngIf="ITNList$ | async as list">
      <div class="flex-rwo flex justify-center">
        <h1>
          ITN: {{ list.slice(-1)[0]?.ITN }} ({{ list.length }} of
          {{ _label.quantityList?.length }})
        </h1>
      </div>
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [validator]="validator"
        [formState]="formState$ | async"
        [formGroup]="inputForm"
        controlName="label"
        title="Label"
      ></single-input-form>
    </div>
    <div class="flex flex-row justify-center">
      <div
        *ngIf="_label.ITNList?.length === _label.quantityList.length"
        class="mt-8 h-12 w-32 rounded-md bg-red-500"
      >
        <button
          nz-button
          nzSize="large"
          type="button"
          (click)="onConfirm()"
          class="h-12 w-32"
          nzGhost
        >
          KickOut
        </button>
      </div>
    </div>
  `,
})
export class PrintITNComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;
  public formState$: Observable<FormState>;
  public ITNList$ = new Observable<Array<ITNinfo>>();
  public validator = {
    name: 'label',
    message: 'Not match the current label!',
  };

  constructor(
    private _router: Router,
    private _ui: ReceivingStore,
    public _label: LabelStore
  ) {}

  ngOnInit(): void {
    this._label.initQuantityList([1, 3, 4, 5, 6]);
    if (!this._label.quantityList?.length) {
      this.onBack();
    }
    this.formState$ = this._ui.formState$;
    this.ITNList$ = this._label.ITNList$;
    this.inputForm = new FormGroup({
      label: new FormControl('', [Validators.required, this.checKLabel()]),
    });
    this.data$ = this.printITN(0, this._label.quantityList[0]);
  }

  public printITN(index: number, quantity: number): Observable<any> {
    this._ui.loadingOn();
    return this._label
      .printReceivingLabel$(index, quantity, 'PHLABELS139', '300', 'LANDSCAPE')
      .pipe(
        map(() => {
          this._ui.loadingOff();
        }),
        catchError((error) => {
          this._ui.updateMessage(error.message, 'error');
          this._ui.loadingOff();
          return of(error);
        })
      );
  }

  public checKLabel(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.trim();
      if (!value) {
        return null;
      }
      const isVaild = this._label.ITNList.slice(-1)[0].ITN === value;
      return !isVaild ? { label: true } : null;
    };
  }

  public onChange = (input: string) => {
    if (input) {
      this.inputForm.get('receipt').setValue(input);
    }
  };

  public onBack(): void {
    this._router.navigate(['receiptreceiving/label/assign']);
  }

  public onSubmit(): void {
    const index = this._label.ITNList.length;
    if (index === this._label.quantityList.length) {
      this.onConfirm();
      return;
    }
    this.inputForm.setValue({ label: '' });
    this.data$ = this.printITN(index, this._label.quantityList[index]);
  }
  /**
   * After create and scan all ITN wrint ITN Number to server
   */
  public onConfirm(): void {
    this._router.navigate(['receiptreceiving/part']);
  }
}
