import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { GenerateReceiptInputComponent } from '../../ui/generate-receipt-input.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { CreateReceiptService } from '../../data/createReceipt';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SingleInputformComponent],
  template: `
    <div class="flew justify-center gap-2 md:gap-6 lg:gap-12">
      <h1 class="text-4xl">Generate Receipt:</h1>
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [data]="data$ | async"
        [formGroup]="inputForm"
        inputType="text"
        controlName="purchaseOrder"
        title="Purchase Order"
      ></single-input-form>
    </div>
  `,
})
export class PurchaseNumberComponent implements OnInit {
  public data$: Observable<any>;
  public inputForm = new FormGroup({
    purchaseOrder: new FormControl('', [Validators.required]),
  });

  constructor(
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _steps: TabService,
    private _receipt: CreateReceiptService
  ) {}

  ngOnInit(): void {
    this._steps.changeSteps(0);
    this.data$ = of(true);
    this._receipt.reset();
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving');
  }

  /**
   * onSubmit Create Receipt Line and Header based on purchase order Info.
   */
  public onSubmit() {
    this.data$ = this._receipt
      .getPurchaseOrderInfo$(this.inputForm.value.purchaseOrder)
      .pipe(
        map(() => {
          this._router.navigate(['../lineselecter'], {
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
