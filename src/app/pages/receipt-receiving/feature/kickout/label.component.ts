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
import { KickoutService } from '../../data/kickout';
import { FormState, ReceivingService } from '../../data/receivingService';
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
      [formGroup]="inputForm"
      controlName="label"
      title="Scan the barcod on the Label"
    ></single-input-form>
  `,
})
export class LabelComponent implements OnInit {
  public inputForm: FormGroup;
  public formState$: Observable<FormState>;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: ReceivingService,
    private _kickout: KickoutService
  ) {}

  ngOnInit(): void {
    if (!this._kickout.kickout) {
      this._router.navigateByUrl('receiptreceiving/kickout');
    }
    this.inputForm = this._fb.group({
      label: ['', Validators.required],
    });
    this.formState$ = this._ui.formState$;
  }

  onSubmit(): void {
    this._kickout.updateLabel(this.inputForm.value.label.trim());
    this._router.navigateByUrl('receiptreceiving/kickout/location');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }
}
