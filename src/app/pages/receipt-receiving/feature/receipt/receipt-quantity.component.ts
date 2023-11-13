import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateReceiptService } from '../../data/createReceipt';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { AuthModalComponent } from 'src/app/shared/ui/modal/auth-modal.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    RedButtonComponent,
    AuthModalComponent,
  ],
  template: `
    <div class="flew justify-center gap-2 md:gap-6 lg:gap-12">
      <h1 class="text-4xl">Generate Receipt:</h1>
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [data]="data$ | async"
        [formGroup]="inputForm"
        inputType="number"
        controlName="quantity"
        title="Quantity"
        [isvalid]="this.inputForm.valid"
      ></single-input-form>
    </div>
    <div
      *ngIf="this._createreceipt.leftQuantity < this.inputForm.value.quantity"
      class="grid h-16  grid-cols-3 text-2xl md:mx-16 md:mt-10 md:h-36 md:text-4xl"
    >
      <red-button
        buttonText="Over Receipt"
        (buttonClick)="overReceipt()"
      ></red-button>
    </div>
    <auth-modal
      *ngIf="message"
      [message]="message"
      (clickClose)="message = ''"
      (passAuth)="generateReceipt(true, $event)"
    ></auth-modal>
  `,
})
export class ReceiptQuantityComponent implements OnInit {
  public data$: Observable<any>;
  public inputForm = new FormGroup({
    quantity: new FormControl<number>(null, [
      Validators.required,
      Validators.max(this._createreceipt.leftQuantity),
    ]),
  });

  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _steps: TabService,
    public _createreceipt: CreateReceiptService
  ) {}

  ngOnInit(): void {
    this.data$ = of(true);
    this._steps.changeSteps(0);
  }

  public onBack(): void {
    this._router.navigate(['../purchasenumber'], {
      relativeTo: this._actRoute,
    });
  }

  public onSubmit(): void {
    if (this.inputForm.value.quantity === 0) {
      this.data$ = of({
        error: { message: `Can't accept zero.`, type: 'error' },
      });
      return;
    }
    if (this.inputForm.invalid) {
      this.data$ = of({
        error: { message: `Invalid quantity!`, type: 'error' },
      });
      return;
    }
    this.generateReceipt();
  }

  message = '';
  overReceipt() {
    this.message = `Over Receipt Quantity: ${this.inputForm.value.quantity}`;
  }

  generateReceipt(overReceipt?: boolean, authName?: string) {
    this._createreceipt.updatePurchaseInfo({
      Quantity: Number(this.inputForm.value.quantity),
    });
    this.data$ = this._createreceipt
      .generateReceipt$(overReceipt, authName)
      .pipe(
        map(() => {
          this._router.navigate(['../part'], {
            relativeTo: this._actRoute,
          });
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }
}
