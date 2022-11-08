import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Keyboard from 'simple-keyboard';
import { ReceivingService } from '../../data/receiving.server';
import {
  Layout,
  SimpleKeyboardComponent,
} from '../../../../shared/ui/simple-keyboard/simple-keyboard.component';
import { SingleInputformComponent } from '../../ui/single-input-form/single-input-form.component';

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
  public keyboard: Keyboard;
  public isLoading = false;
  public layout = Layout.numeric;
  public title = `Receipt`;
  public controlName = 'receipt';
  public inputForm: FormGroup;
  public inputType = 'number';

  constructor(private _router: Router, private _service: ReceivingService) {
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
    this._router.navigateByUrl('receiving/part');
  }
}
