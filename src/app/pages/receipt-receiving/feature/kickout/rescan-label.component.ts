import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { KickoutStore } from '../../data/kickout';
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
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [validator]="validator"
      [formState]="formState$ | async"
      [formGroup]="inputForm"
      controlName="label"
      title="Scan the barcod again"
    ></single-input-form>
  `,
})
export class RescanLabelComponent implements OnInit {
  public inputForm: FormGroup;
  public formState$: Observable<FormState>;
  public validator = {
    name: 'filter',
    message: 'Not the same Label!',
  };

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: ReceivingStore,
    private _kickout: KickoutStore
  ) {}

  ngOnInit(): void {
    if (!this._kickout.kickout?.location) {
      this.onBack();
    }
    this.inputForm = this._fb.group({
      label: ['', [Validators.required, this.checkLabel()]],
    });
    this.formState$ = this._ui.formState$;
  }

  /**
   * @returns when the input is not equal to scaned Label, fire error.
   */
  public checkLabel(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const isVaild = this._kickout.kickout.label === value.trim();
      return !isVaild ? { filter: true } : null;
    };
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/kickout/location');
  }
}
