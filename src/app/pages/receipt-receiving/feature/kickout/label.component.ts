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
import { KickoutStore } from '../../data/kickout';
import { FormState, ReceivingUIStateStore } from '../../data/ui-state';
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
      [formState]="formState$ | async"
      [formGroup]="inputForm"
      controlName="label"
      title="Scan the Label"
    ></single-input-form>
  `,
})
export class LabelComponent implements OnInit {
  public inputForm: FormGroup;
  public formState$: Observable<FormState>;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: ReceivingUIStateStore,
    private _kickout: KickoutStore
  ) {}

  ngOnInit(): void {
    this.inputForm = this._fb.group({
      label: ['', Validators.required],
    });
    this.formState$ = this._ui.formState$;
  }

  onSubmit(): void {
    if (this._kickout.kickout.location) {
      this._router.navigateByUrl('receiptreceiving/');
    }
    this._router.navigateByUrl('receiptreceiving/kickout/location');
  }

  public onBack(): void {
    if (this._kickout.kickout.location) {
      this._router.navigateByUrl('receiptreceiving/kickout');
    }
    this._router.navigateByUrl('receiptreceiving/kickout/location');
  }
}
