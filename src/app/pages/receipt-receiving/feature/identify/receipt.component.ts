import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleKeyboardComponent } from '../../../../shared/ui/simple-keyboard.component';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { catchError, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    SimpleKeyboardComponent,
    ReactiveFormsModule,
    MessageBarComponent,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="number"
      controlName="receipt"
      title="Receipt"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <simple-keyboard
      layout="number"
      [inputString]="inputForm.value.receipt"
      (outputString)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class ReceiptComponent implements OnInit {
  public inputForm: FormGroup;
  public data$;

  constructor(
    private _router: Router,
    private _receipt: ReceiptInfoService,
    private _ui: ReceivingService,
    private _actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(0);
    this.inputForm = new FormGroup({
      receipt: new FormControl(null, [Validators.required]),
    });
    this.data$ = this._actRoute.queryParamMap;
  }

  public onChange = (input: string) => {
    this.inputForm.patchValue({ receipt: input });
  };

  public onBack(): void {
    this._router.navigate(['/home']);
  }

  public onSubmit(): void {
    this.data$ = this._receipt
      .checkReceiptHeader(Number(this.inputForm.value.receipt))
      .pipe(
        tap(() => {
          this._router.navigate(['../part'], { relativeTo: this._actRoute });
        }),
        catchError((error) => {
          return of({
            loading: false,
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }
}
