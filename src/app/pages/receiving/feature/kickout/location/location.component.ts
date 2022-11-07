import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard/simple-keyboard.component';
import { SingleInputformComponent } from '../../../ui/single-input-form/single-input-form.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    SimpleKeyboardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './location.component.html',
})
export class LocationComponent {
  public locationForm: FormGroup;
  public isLoading = false;
  public title = `Location`;

  constructor(private _fb: FormBuilder, private _router: Router) {
    this.locationForm = this._fb.group({
      location: ['', Validators.required],
    });
  }

  onChange = (input: string) => {
    this.locationForm.get('location').setValue(input);
  };

  onSubmit(): void {
    this._router.navigateByUrl('receiving/kickout/part');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiving/kickout');
  }
}
