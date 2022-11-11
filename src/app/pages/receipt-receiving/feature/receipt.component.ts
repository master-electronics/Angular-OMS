import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReceivingService } from '../data/receiving.server';
import { SimpleKeyboardComponent } from '../../../shared/ui/simple-keyboard.component';
import { SingleInputformComponent } from '../ui/single-input-form.component';
import { catchError, map, Observable, of, startWith, tap } from 'rxjs';
import { FindReceiptHeaderForReceivingGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    SimpleKeyboardComponent,
    ReactiveFormsModule,
  ],
  template: `
    <div class="grid grid-cols-2 gap-5">
      <single-input-form
        (submit)="onSubmit()"
        (back)="onBack()"
        [formGroup]="inputForm"
        [state]="data$ | async"
        type="number"
        controlName="receipt"
        title="Receipt"
      ></single-input-form>
      <simple-keyboard
        [inputFromParent]="inputForm.value.receipt"
        layout="number"
        (outputFromChild)="onChange($event)"
      ></simple-keyboard>
    </div>
  `,
})
export class ReceiptComponent {
  public inputForm: FormGroup;
  public data$: Observable<any>;

  constructor(
    private _findReceiptH$: FindReceiptHeaderForReceivingGQL,
    private _router: Router,
    private _service: ReceivingService
  ) {
    this._service.changeTab(0);
    this.inputForm = new FormGroup({
      receipt: new FormControl('', [Validators.required]),
    });
    this.data$ = this._service.getReceiptHInfo();
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
    this.data$ = this._findReceiptH$
      .fetch(
        {
          ReceiptHID: Number(this.inputForm.value.receipt),
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findReceiptH) {
            throw new Error("Can't find this Receipt!");
          }
          if (!res.data.findReceiptH.RECEIPTLs.length) {
            throw new Error("Can't find this Receipt!");
          }
        }),
        map((res) => {
          const tmp = {
            isLoading: false,
            value: res.data.findReceiptH.RECEIPTLs,
          };
          this._service.changereceiptH(tmp);
          this._router.navigate(['receiptreceiving/part']);
          return tmp;
        }),
        catchError((error) =>
          of({ isLoading: false, error, messageType: 'error' })
        ),
        startWith({ isLoading: true })
      );
  }
}
