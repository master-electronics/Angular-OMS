import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SingleInputformComponent } from '../../ui/single-input-form.component';
import { CommonModule } from '@angular/common';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { ReceivingService } from '../../data/receivingService';
import { map, tap } from 'rxjs';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
    NzModalModule,
  ],

  template: `
    <single-input-form
      (formBack)="onBack()"
      (formSubmit)="onSubmit()"
      [data]="data$ | async"
      [validator]="validator"
      [formGroup]="inputForm"
      controlName="partNumber"
      title="Part Number"
    ></single-input-form>
    <simple-keyboard
      [inputString]="inputForm.value.partNumber"
      (outputString)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class PartComponent implements OnInit {
  public inputForm: FormGroup;
  public data$;
  public validator = {
    name: 'filter',
    message: 'Not Found part number!',
  };

  constructor(
    private _router: Router,
    private _receipt: ReceiptInfoService,
    private _modal: NzModalService,
    private _ui: ReceivingService,
    private _actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(1);
    this.inputForm = new FormGroup({
      partNumber: new FormControl('', [
        Validators.required,
        this.partNumberSearch(),
      ]),
    });
    if (!this._receipt.headerID) {
      this.onBack();
    }
    this.data$ = this._actRoute.data.pipe(
      map((res) => {
        if (res.lines?.error) {
          this.showConfirm(res.lines.error);
        }
        return res.lines;
      })
    );
  }

  /**
   * showConfirm
   */
  public showConfirm(error) {
    const modal = {
      nzTitle: `<i>${error.message}</i>`,
      nzContent: '<b>Select an other receipt.</b>',
      nzOnOk: () => this.onBack(),
    };
    if (error.name === 'warning') {
      this._modal.warning(modal);
      return;
    }
    this._modal.error(modal);
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
