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
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard/simple-keyboard.component';
import { ReceivingService } from '../../../data/receiving.server';
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
  public data$: Observable<any>;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: ReceivingService
  ) {
    this.inputForm = this._fb.group({
      part: ['', Validators.required],
    });
    this.data$ = this._service.getReceiptHInfo();
  }

  onChange = (input: string) => {
    this.inputForm.get('part').setValue(input);
  };

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiptreceiving');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/kickout/location');
  }
}
