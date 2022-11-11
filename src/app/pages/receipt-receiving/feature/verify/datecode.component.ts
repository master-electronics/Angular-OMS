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
    <single-input-form
      (submit)="onSubmit()"
      (back)="onBack()"
      [formGroup]="inputForm"
      [state]="data$ | async"
      controlName="datecode"
      title="DateCode"
    ></single-input-form>
    <simple-keyboard
      [inputFromParent]="inputForm.value.datecode"
      (outputFromChild)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class DateCodeComponent {
  public inputForm: FormGroup;
  public data$: Observable<any>;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: ReceivingService
  ) {
    this.inputForm = this._fb.group({
      datecode: ['', Validators.required],
    });
    this.data$ = this._service.getReceiptHInfo();
  }

  onChange = (input: string) => {
    this.inputForm.get('datecode').setValue(input);
  };

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/verify/rohs');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/verify/country');
  }
}
