import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleKeyboardComponent } from '../../../shared/ui/simple-keyboard.component';
import { SingleInputformComponent } from '../ui/single-input-form.component';
import { catchError, map, Observable, of, startWith, take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReceiptStore } from '../data/Receipt';
import { FormState, ReceivingUIStateStore } from '../data/ui-state';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    SimpleKeyboardComponent,
    ReactiveFormsModule,
  ],
  template: `
    <ng-container *ngIf="data$ | async"></ng-container>
    <div class="grid grid-cols-2 gap-5">
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [formState]="formState$ | async"
        [formGroup]="inputForm"
        type="number"
        controlName="receipt"
        title="Receipt"
      ></single-input-form>
      <simple-keyboard
        [inputString]="inputForm.value.receipt"
        layout="number"
        (outputString)="onChange($event)"
      ></simple-keyboard>
    </div>
  `,
})
export class ReceiptComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;
  public formState$: Observable<FormState>;

  constructor(
    private _router: Router,
    private _receipt: ReceiptStore,
    private _ui: ReceivingUIStateStore
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(0);
    this.inputForm = new FormGroup({
      receipt: new FormControl(null, [Validators.required]),
    });
    this.data$ = this._receipt.receiptHeader$;
    this.formState$ = this._ui.formState$;
  }

  public onChange = (input: string) => {
    if (input) {
      this.inputForm.get('receipt').setValue(input);
    }
  };

  public onBack(): void {
    this._router.navigate(['home']);
  }

  public onSubmit(): void {
    this._ui.initFormState();
    this._ui.loadingOn();
    this.data$ = this._receipt
      .findReceiptHeader(Number(this.inputForm.value.receipt))
      .pipe(
        map(() => {
          this._ui.initFormState();
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
