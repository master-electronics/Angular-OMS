import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { CreateReceiptService } from '../../data/createReceipt';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SingleInputformComponent,
    RedButtonComponent,
  ],
  template: `
    <div class="flew justify-center gap-2 md:gap-6 lg:gap-12">
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [data]="data$ | async"
        [formGroup]="inputForm"
        inputType="text"
        controlName="purchaseOrder"
        title="Purchase Order"
      ></single-input-form>
      <div
        class="grid h-16  grid-cols-3 text-2xl md:mx-16 md:mt-10 md:h-32 md:text-4xl"
      >
        <red-button
          *ngIf="data$ | async"
          buttonText="Over Receipt"
          (buttonClick)="overReceipt()"
        ></red-button>
      </div>
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
    private _create: CreateReceiptService,
    private _receipt: ReceiptInfoService
  ) {}

  ngOnInit(): void {
    this._steps.changeSteps(0);
    this.data$ = of(true);
    this._create.reset();
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving');
  }

  public overReceipt(): void {
    if (!this.inputForm.value.purchaseOrder?.trim()) {
      return;
    }
    this.data$ = this._receipt
      .fetchReceiptLinesForOverReceipt$(
        this.inputForm.value.purchaseOrder.trim()
      )
      .pipe(
        tap(() => {
          if (this._receipt.receiptInfoAfterFilter().length === 1) {
            this._receipt.updateReceiptLine(
              this._receipt.receiptInfoAfterFilter()[0].ReceiptLineID
            );
            this._router.navigate(['../overreceiving'], {
              relativeTo: this._actRoute,
            });
            return;
          }
          this._router.navigate(['../alllines'], {
            relativeTo: this._actRoute,
          });
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        }),
        shareReplay(1)
      );
  }

  /**
   * onSubmit Create Receipt Line and Header based on purchase order Info.
   */
  public onSubmit() {
    this.data$ = this._create
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
        }),
        shareReplay(1)
      );
  }
}
