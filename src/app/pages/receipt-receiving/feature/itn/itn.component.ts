import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReceivingService } from '../../data/receiving.server';
import { SimpleKeyboardComponent } from '../../../../shared/ui/simple-keyboard.component';
import { catchError, map, Observable, of, startWith, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, SimpleKeyboardComponent, ReactiveFormsModule],
  template: ``,
})
export class ITNComponent {
  public inputForm: FormGroup;
  public data$: Observable<any>;

  constructor(private _router: Router, private _service: ReceivingService) {
    this._service.changeTab(4);
    this.inputForm = new FormGroup({
      receipt: new FormControl('', [Validators.required]),
    });
    this.data$ = this._service.getReceiptHInfo();
  }

  public onChange = (input: string) => {
    if (input) {
      this.inputForm.get('receipt').setValue(input);
    }
  };

  public onBack(): void {
    this._router.navigate(['home']);
  }

  public onSubmit(): void {
    //
  }
}
