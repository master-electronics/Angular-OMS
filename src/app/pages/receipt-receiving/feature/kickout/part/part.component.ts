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
  templateUrl: './part.component.html',
})
export class PartComponent {
  public inputForm: FormGroup;
  public isLoading = false;
  public title = `Location`;

  constructor(private _fb: FormBuilder, private _router: Router) {
    this.inputForm = this._fb.group({
      part: ['', Validators.required],
    });
  }

  onChange = (input: string) => {
    this.inputForm.get('part').setValue(input);
  };

  onSubmit(): void {
    this._router.navigateByUrl('receiving');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiving/kickout/location');
  }
}
