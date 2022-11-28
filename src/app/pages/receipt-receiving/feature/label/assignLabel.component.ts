import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { LabelService } from '../../data/label';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
  ],
  template: `
    <div class="flex flex-col gap-5 text-lg">
      <h1>Total: {{ total }}</h1>
      <h1>Remaining: {{ remaining$ | async }}</h1>
    </div>
    <form nz-form [formGroup]="inputForm" (ngSubmit)="submitForm()">
      <nz-form-item nzFlex> </nz-form-item>
      <nz-form-item *ngFor="let control of listOfControl; let i = index">
        <nz-form-label
          [nzXs]="24"
          [nzSm]="4"
          *ngIf="i === 0"
          [nzFor]="control.controlInstance"
        >
          Quantity
        </nz-form-label>
        <nz-form-control
          [nzXs]="24"
          [nzSm]="20"
          [nzOffset]="i === 0 ? 0 : 4"
          nzErrorTip="Please input a number!"
        >
          <input
            class="passenger-input"
            nz-input
            type="number"
            placeholder="Quantity"
            [attr.id]="control.id"
            [formControlName]="control.controlInstance"
          />
          <span
            class="dynamic-delete-button"
            nz-icon
            nzType="minus-circle-o"
            (click)="removeField(control, $event)"
          ></span>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control
          [nzXs]="{ span: 24, offset: 0 }"
          [nzSm]="{ span: 20, offset: 4 }"
        >
          <button
            nz-button
            nzType="dashed"
            class="add-button"
            (click)="addField($event)"
          >
            <span nz-icon nzType="plus"></span>
            Add Label
          </button>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control
          [nzXs]="{ span: 24, offset: 0 }"
          [nzSm]="{ span: 20, offset: 4 }"
        >
          <button
            [disabled]="validator$ | async"
            nz-button
            type="submit"
            nzType="primary"
          >
            Submit
          </button>
          <button class="ml-6" nz-button nzSize="large" (click)="onBack()">
            Back
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  styles: [
    `
      .dynamic-delete-button {
        cursor: pointer;
        position: relative;
        top: 4px;
        font-size: 24px;
        color: #999;
        transition: all 0.3s;
      }

      .dynamic-delete-button:hover {
        color: #777;
      }

      .passenger-input {
        width: 60%;
        margin-right: 8px;
      }

      [nz-form] {
        max-width: 600px;
      }

      .add-button {
        width: 60%;
      }
    `,
  ],
})
export class AssignLabelComponent implements OnInit {
  public total: number;
  public remaining$: Observable<number>;
  public validator$: Observable<boolean>;
  public inputForm: FormGroup;
  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _step: ReceivingService,
    private _receipt: ReceiptInfoService,
    private _label: LabelService
  ) {}

  ngOnInit(): void {
    if (this._receipt.selectedReceiptLine?.length !== 1) {
      this._router.navigateByUrl('/receiptreceiving');
    }
    this._label.initValue();
    this._step.changeSteps(3);
    this.total = this._receipt.selectedReceiptLine[0].ExpectedQuantity;
    this.inputForm = this._fb.group({});
    this.addField();
    this.remaining$ = this.inputForm.valueChanges.pipe(
      map((res) => {
        let sum = 0;
        Object.values(res).forEach((element) => {
          sum += Number(element);
        });
        return this.total - sum;
      }),
      shareReplay(1)
    );
    this.validator$ = this.remaining$.pipe(
      map((res) => {
        return res !== 0 || this.inputForm.invalid;
      }),
      startWith(true)
    );
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id =
      this.listOfControl.length > 0
        ? this.listOfControl[this.listOfControl.length - 1].id + 1
        : 0;

    const control = {
      id,
      controlInstance: `field${id}`,
    };
    const index = this.listOfControl.push(control);
    this.inputForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      new FormControl(0, [Validators.required, Validators.min(1)])
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.inputForm.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    if (this.inputForm.valid) {
      const list = Object.values(this.inputForm.value).map((res) =>
        Number(res)
      );
      this._label.changeQuantityList(list);
      this._router.navigateByUrl('receiptreceiving/label/printitn');
    } else {
      Object.values(this.inputForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/rhos');
  }
}
