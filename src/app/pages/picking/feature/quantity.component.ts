import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { PickingService } from '../data/picking.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SingleInputformComponent,
    PopupModalComponent,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="quantity"
      title="Quantity:"
      inputType="number"
    ></single-input-form>
    <ng-container *ngIf="isPopup">
      <popup-modal
        [message]="message"
        buttonOne="Yes"
        buttonTwo="No"
        (clickSubmit)="clickYes()"
        (clickCancel)="clickNo()"
      ></popup-modal>
    </ng-container>
  `,
})
export class QuantityComponent implements OnInit {
  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _pick: PickingService
  ) {}
  public data$: Observable<any>;
  public isPopup = 0;
  public message = '';
  public inputForm = this._fb.nonNullable.group({
    quantity: [null, [Validators.required]],
  });
  private updateInfo = {
    InputQuantity: null,
    isSuspect: false,
    InventoryID: this._pick.itnInfo.InventoryID,
    OrderLineDetailID: this._pick.itnInfo.OrderLineDetailID,
  };

  ngOnInit(): void {
    this.data$ = of({ message: null });
  }

  onSubmit(): void {
    this.updateInfo.InputQuantity = Number(this.inputForm.value.quantity);
    const quantityDiff =
      this._pick.itnInfo.Quantity - Number(this.inputForm.value.quantity);
    if (quantityDiff === 0) {
      this.checkEmpty();
      return;
    }
    if (quantityDiff > 0) {
      this.message = `Confirm the quantity is short.`;
      this.isPopup = 1;
      return;
    }
    this.data$ = of({
      error: { message: `Can not pick more items.`, error: 'error' },
    });
  }
  onBack(): void {
    this._router.navigate(['../info'], { relativeTo: this._actRoute });
  }

  clickYes(): void {
    if (this.isPopup === 1) {
      this.checkEmpty();
    }
    if (this.isPopup === 2) {
      this.update();
    }
    this.isPopup = 0;
  }

  clickNo(): void {
    if (this.isPopup === 1) {
      this._router.navigate(['../info'], { relativeTo: this._actRoute });
    }
    if (this.isPopup === 2) {
      this.updateInfo.isSuspect = true;
      this.update();
    }
    this.isPopup = 0;
  }

  update(): void {
    // this.data$ = this.
  }

  checkEmpty(): void {
    if (this._pick.itnInfo.Quantity === this._pick.itnInfo.QuantityOnHand) {
      this.message = 'Confirm the ITN is empty.';
      this.isPopup = 2;
      return;
    }
    this.update();
  }

  isShort(): void {
    //
  }

  isEmpty(): void {
    //
  }
}
