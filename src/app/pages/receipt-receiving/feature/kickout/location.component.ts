import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
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
      controlName="location"
      title="Location"
    ></single-input-form>
    <simple-keyboard
      [inputFromParent]="inputForm.value.location"
      (outputFromChild)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class LocationComponent implements OnInit {
  public inputForm: FormGroup;

  constructor(private _fb: FormBuilder, private _router: Router) {}

  ngOnInit(): void {
    this.inputForm = this._fb.group({
      location: ['', Validators.required],
    });
  }

  onChange = (input: string) => {
    this.inputForm.get('location').setValue(input);
  };

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/kickout/part');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }
}
