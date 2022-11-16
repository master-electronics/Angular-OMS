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
      controlName="location"
      title="Location"
    ></single-input-form>
    <simple-keyboard
      [inputString]="inputForm.value.location"
      (outputString)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class LocationComponent implements OnInit {
  public inputForm: FormGroup;
  public formState$: Observable<FormState>;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: ReceivingUIStateStore,
    private _kickout: KickoutStore
  ) {}

  ngOnInit(): void {
    if (!this._kickout.kickout?.label) {
      this._router.navigateByUrl('receiptreceiving/kickout');
    }
    this.inputForm = this._fb.group({
      location: ['', Validators.required],
    });
    this.formState$ = this._ui.formState$;
  }

  onChange = (input: string) => {
    this.inputForm.get('location').setValue(input);
  };

  onSubmit(): void {
    this._kickout.updateLocation(this.inputForm.value.location.trim());
    this._router.navigateByUrl('receiptreceiving/kickout/rescanlabel');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }
}
