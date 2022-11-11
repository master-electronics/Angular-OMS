import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceivingService } from '../../data/receiving.server';
import { SingleInputformComponent } from '../../ui/single-input-form.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
  ],
  template: `
    <div class="grid grid-cols-2 gap-5">
      <single-input-form
        (submit)="onSubmit()"
        (back)="onBack()"
        [formGroup]="inputForm"
        [state]="data$ | async"
        controlName="label"
        title="Number of Label"
      ></single-input-form>
      <simple-keyboard
        [inputFromParent]="inputForm.value.label"
        layout="number"
        (outputFromChild)="onChange($event)"
      ></simple-keyboard>
    </div>
  `,
})
export class LabelComponent {
  public inputForm: FormGroup;
  public data$: Observable<any>;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: ReceivingService
  ) {
    this.inputForm = this._fb.group({
      label: ['', Validators.required],
    });
    this.data$ = this._service.getReceiptHInfo();
  }

  onChange = (input: string) => {
    this.inputForm.get('label').setValue(input);
  };

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/itn');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/purchaseorder');
  }
}
