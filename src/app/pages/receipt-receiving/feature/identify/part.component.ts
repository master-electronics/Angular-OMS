import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { CommonModule } from '@angular/common';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
    PopupModalComponent,
  ],

  template: `
    <single-input-form
      (formBack)="onBack()"
      (formSubmit)="onSubmit()"
      [validator]="validator"
      [formGroup]="inputForm"
      controlName="partNumber"
      title="Part Number"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <ng-container *ngIf="initData$ | async as data">
      <ng-container *ngIf="data.checkLine">
        <popup-modal
          (clickSubmit)="onBack()"
          [message]="data.checkLine"
        ></popup-modal>
      </ng-container>
    </ng-container>
    <simple-keyboard
      [inputString]="inputForm.value.partNumber"
      (outputString)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class PartComponent implements OnInit {
  public inputForm: FormGroup;
  public initData$: Observable<any>;
  public validator = {
    name: 'filter',
    message: 'Not Found part number!',
  };

  constructor(
    private _router: Router,
    private _receipt: ReceiptInfoService,
    private _ui: ReceivingService,
    private _message: NzMessageService,
    private _actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(0);
    this.inputForm = new FormGroup({
      partNumber: new FormControl('', [
        Validators.required,
        this.partNumberSearch(),
      ]),
    });
    if (!this._receipt.headerID) {
      this.onBack();
    }
    const url$ = this._actRoute.queryParams.pipe(
      map((res) => {
        if (res.name === 'finish') {
          this._message.success(
            `Finished Receipt: ${res.receipt}, line: ${res.line}`
          );
        }
        if (res.name === 'kickout') {
          this._message.warning(
            `Kickout Receipt: ${res.receipt}, Part: ${res.part}`
          );
        }
      })
    );
    const checkLine$ = this._actRoute.data.pipe(
      map((res) => {
        if (res.lines?.error) {
          return res.lines.error.message;
        }
        return null;
      })
    );
    this.initData$ = combineLatest({ url: url$, checkLine: checkLine$ });
  }

  partNumberSearch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const isVaild = this._receipt.receiptLines?.some(
        (line) =>
          line.Product.PartNumber.trim().toLowerCase() ===
          value.trim().toLowerCase()
      );
      return !isVaild ? { filter: true } : null;
    };
  }

  onChange = (input: string) => {
    this.inputForm.setValue({ partNumber: input });
  };

  onSubmit(): void {
    this._receipt.filterbyPartNumber(this.inputForm.value.partNumber);
    this._router.navigate(['../part/verify'], { relativeTo: this._actRoute });
  }

  onBack(): void {
    this._router.navigate(['../receipt'], { relativeTo: this._actRoute });
  }
}
