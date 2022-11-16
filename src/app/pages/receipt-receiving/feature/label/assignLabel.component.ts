import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { FormState, ReceivingStore } from '../../data/receivingStore';
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
      [formState]="formState$ | async"
      [formGroup]="inputForm"
      controlName="label"
      title="Number of Label"
    ></single-input-form>
  `,
})
export class AssignLabelComponent implements OnInit {
  public inputForm: FormGroup;
  public formState$: Observable<FormState>;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: ReceivingStore
  ) {}

  ngOnInit(): void {
    this.inputForm = this._fb.group({
      label: ['', Validators.required],
    });
    this.formState$ = this._ui.formState$;
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/itn');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/purchaseorder');
  }
}
