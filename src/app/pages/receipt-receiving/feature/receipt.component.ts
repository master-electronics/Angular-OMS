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
import { ReceiptInfoService } from '../data/ReceiptInfo';
import { FormState, ReceivingService } from '../data/receivingService';
import { GlobalService, HttpResponse } from 'src/app/shared/data/Global';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    SimpleKeyboardComponent,
    ReactiveFormsModule,
  ],
  template: `
    <ng-container></ng-container>
    <div class="grid grid-cols-2 gap-5">
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [data]="data$ | async"
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
  public data$: Observable<HttpResponse>;

  constructor(
    private _router: Router,
    private _receipt: ReceiptInfoService,
    private _ui: ReceivingService,
    private _http: GlobalService
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(0);
    this._ui.initFormState();
    this.inputForm = new FormGroup({
      receipt: new FormControl(null, [Validators.required]),
    });
    this.data$ = this._http.httpResponse$;
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
    this.data$ = of({ loading: true });
    this.data$ = this._receipt
      .checkReceiptHeader(Number(this.inputForm.value.receipt))
      .pipe(
        tap(() => {
          this._router.navigate(['receiptreceiving/part']);
        }),
        catchError((error) => {
          return of({
            loading: false,
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }
}
