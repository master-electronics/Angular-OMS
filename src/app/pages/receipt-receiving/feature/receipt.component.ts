import { Component, OnInit } from '@angular/core';
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
import { catchError, map, Observable, of, startWith, take, tap } from 'rxjs';
import { FindReceiptHeaderForReceivingGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { CommonModule } from '@angular/common';
import { PartStore } from '../data/part';
import { ReceivingUIStateStore } from '../data/ui-state';

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
        [data]="data$ | async"
        (submit)="onSubmit()"
        (back)="onBack()"
        [formGroup]="inputForm"
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
export class ReceiptComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;

  constructor(
    private _findReceiptH$: FindReceiptHeaderForReceivingGQL,
    private _router: Router,
    private _partStore: PartStore,
    private _ui: ReceivingUIStateStore
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(0);
    this.inputForm = new FormGroup({
      receipt: new FormControl('', [Validators.required]),
    });
    this.data$ = this._partStore.receiptHeader$;
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
          this._partStore.changereceiptH(res);
          this._router.navigate(['receiptreceiving/part']);
          return tmp;
        }),
        catchError((error) =>
          of({ isLoading: false, message: error.message, messageType: 'error' })
        ),
        startWith({ isLoading: true })
      );
  }
}
