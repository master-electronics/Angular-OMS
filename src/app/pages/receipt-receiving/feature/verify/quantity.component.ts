import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
    MessageBarComponent,
  ],
  template: `
    <single-input-form
      (formBack)="onBack()"
      (formSubmit)="onSubmit()"
      [formGroup]="inputForm"
      controlName="quantity"
      title="Quantity"
      inputType="number"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <div
      class="mt-6 grid h-16 grid-cols-3 text-2xl md:mx-16 md:h-32 md:text-4xl"
    >
      <ng-container *ngIf="data$ | async as error">
        <message-bar
          class="col-span-2"
          [message]="error.error.message"
          [name]="error.error.name"
        ></message-bar>
      </ng-container>
    </div>
    <!-- <simple-keyboard
      [inputString]="inputForm.value.quantity"
      layout="number"
      (outputString)="onChange($event)"
    ></simple-keyboard> -->
  `,
})
export class QuantityComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<{ error: { message: string; name: string } }>;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: TabService,
    private _receipt: ReceiptInfoService
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(1);
    this.inputForm = this._fb.group({
      quantity: ['', Validators.required],
    });
  }

  onChange = (input: string) => {
    this.inputForm.get('quantity').setValue(input);
  };

  onSubmit(): void {
    const vaild = this._receipt.lineAfterPart.some(
      (res) => res.ExpectedQuantity === Number(this.inputForm.value.quantity)
    );
    if (vaild) {
      this._receipt.filterByQuantity(Number(this.inputForm.value.quantity));
      this._router.navigateByUrl('receiptreceiving/update/country');
      return;
    }
    this.data$ = of({
      error: {
        message: `Not found receipt line with this quantity!`,
        name: `warning`,
      },
    });
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part/verify');
  }
}
