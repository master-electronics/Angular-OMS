import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReceivingService } from '../../data/receiving.server';
import {
  Layout,
  SimpleKeyboardComponent,
} from '../../../../shared/ui/simple-keyboard/simple-keyboard.component';
import { SingleInputformComponent } from '../../ui/single-input-form/single-input-form.component';
import { catchError, map, of, startWith, tap } from 'rxjs';
import { FindReceiptHeaderForReceivingGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';

@Component({
  standalone: true,
  imports: [
    SingleInputformComponent,
    SimpleKeyboardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './receipt.component.html',
})
export class ReceiptComponent {
  public layout = Layout.numeric;
  public inputForm: FormGroup;

  constructor(
    private _router: Router,
    private _service: ReceivingService,
    private findReceiptH: FindReceiptHeaderForReceivingGQL
  ) {
    this._service.changeTab(0);
    this.inputForm = new FormGroup({
      receipt: new FormControl('', [Validators.required]),
    });
  }

  public onChange = (input: string) => {
    if (input) {
      this.inputForm.get('receipt').setValue(input);
    }
  };

  public onSubmit(): void {
    this._service.receiptHInfo$ = this.findReceiptH
      .fetch(
        {
          ReceiptHID: this.inputForm.value.receipt,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        startWith({ isLoading: true }),
        map((res) => ({ isLoading: false, value: res })),
        catchError((error) => of({ isLoading: false, error })),
        tap(() => this._router.navigateByUrl('receiving/part'))
      );
  }
}
