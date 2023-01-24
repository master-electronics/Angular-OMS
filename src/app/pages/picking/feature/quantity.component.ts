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
    <ng-container *ngIf="data$ | async as check">
      <popup-modal
        [message]="check"
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
  public inputForm = this._fb.nonNullable.group({
    quantity: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.data$ = of({ message: null });
  }

  onSubmit(): void {
    if (Number(this.inputForm.value.quantity) === this._pick.itnInfo.Quantity) {
      return;
    }
  }
  onBack(): void {
    this._router.navigate(['../../'], { relativeTo: this._actRoute });
  }

  clickYes(): void {
    if (this.isPopup === 1) {
      this.isShort();
      return;
    }
    if (this.isPopup === 2) {
      this.isEmpty();
      return;
    }
  }

  clickNo(): void {
    //
  }

  isShort(): void {
    //
  }

  isEmpty(): void {
    //
  }
}
