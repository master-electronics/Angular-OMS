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
      <div class="flex flex-col justify-center text-lg">
        <h1>Scan Label</h1>
        <h1>({{ list.length }} of {{ _label.quantityList?.length }})</h1>
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
  `,
})
export class PrintITNComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;
  public formState$: Observable<FormState>;
  public ITNList$ = new Observable<Array<ITNinfo>>();
  public scanAll = false;
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
    // this._label.initQuantityList([1, 2, 3]);
    if (!this._label.quantityList?.length) {
      this.onBack();
    }
    this._ui.changeSteps(3);
    this._ui.initFormState();
    this.formState$ = this._ui.formState$;
    this.ITNList$ = this._label.ITNList$;
    this.inputForm = new FormGroup({
      label: new FormControl('', [Validators.required, this.checKLabel()]),
    });
    if (this._label.scanAll) {
      this.onConfirm();
      return;
    }
    let index = 0;
    if (this._label.ITNList?.length) {
      index = this._label.ITNList.length;
    }
    this.data$ = this.printITN(this._label.quantityList[index]);
  }

  public printITN(quantity: number): Observable<any> {
    this._ui.loadingOn();
    return this._label
      .printReceivingLabel$(quantity, 'PHLABELS139', '300', 'LANDSCAPE')
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
    if (this.scanAll) {
      return;
    }
    this.inputForm.setValue({ label: '' });
    this._router.navigate(['receiptreceiving/label/sacnlocation']);
  }
  /**
   * After create and scan all ITN wrint ITN Number to server
   */
  public onConfirm(): void {
    this._ui.loadingOn();
    this.data$ = this._label.updateAfterReceving().pipe(
      map(() => {
        this._ui.loadingOff();
        this._label.initValue();
        this._router.navigate(['receiptreceiving/part']);
      }),
      catchError((error) => {
        this._ui.updateMessage(error.message, 'error');
        this._ui.loadingOff();
        return of(error);
      })
    );
  }
}
