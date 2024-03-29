import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { AuthModalComponent } from 'src/app/shared/ui/modal/auth-modal.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
    MessageBarComponent,
    RedButtonComponent,
    AuthModalComponent,
  ],
  template: `
    <!-- Receipt Line infomation -->
    <div class="grid grid-cols-3 text-2xl">
      <h1>
        Status:
        {{ receipt.receiptInfoAfterFilter()[0].Status }}
      </h1>
      <h1>
        Quantity: {{ receipt.receiptInfoAfterFilter()[0].ExpectedQuantity }}
      </h1>
      <h1>UOM: {{ receipt.receiptInfoAfterFilter()[0].UnitOfMeasure }}</h1>
      <h1>
        PurchaseNumber:
        {{ receipt.receiptInfoAfterFilter()[0].PurchaseOrderNumber }}
      </h1>
      <h1>
        PurchaseLine:
        {{ receipt.receiptInfoAfterFilter()[0].PurchaseLineNumber }}
      </h1>
      <h1>
        Part:
        {{ receipt.receiptInfoAfterFilter()[0].PartNumber }}
      </h1>
    </div>
    <!-- Quantity input form -->
    <single-input-form
      [data]="update$ | async"
      (formBack)="onBack()"
      (formSubmit)="onSubmit()"
      [formGroup]="inputForm"
      controlName="quantity"
      title="Over Receiving Quantity"
      inputType="number"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <ng-container *ngIf="authWindow">
      <auth-modal
        [message]="message"
        (clickClose)="authWindow = false"
        (passAuth)="nextPage($event)"
      ></auth-modal>
    </ng-container>
  `,
})
export class OverReceivingComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: TabService
  ) {}
  receipt = inject(ReceiptInfoService);
  public inputForm = this._fb.group({
    quantity: [null, Validators.required],
  });
  public update$: Observable<any>;
  authWindow = false;
  message = '';

  ngOnInit(): void {
    this._ui.changeSteps(1);
    this.update$ = of(true);
  }

  onSubmit() {
    this.authWindow = true;
    this.message = `Over Receipt Quantity: ${this.inputForm.value.quantity}`;
  }

  nextPage(name): void {
    this.authWindow = false;
    const quantity = Number(this.message.split(': ')[1]);
    this.update$ = this.receipt
      .updateQuanityForOverReceiving$(quantity, name)
      .pipe(
        map(() => {
          this._router.navigateByUrl('receiptreceiving/update/country');
        })
      );
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving');
  }
}
