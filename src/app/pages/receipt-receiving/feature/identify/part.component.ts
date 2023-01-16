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
import { TabService } from '../../data/tab';
import { filter, map, Observable, switchMap } from 'rxjs';
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
    <ng-container *ngIf="url$ | async as data">
      <ng-container *ngIf="data">
        <popup-modal (clickSubmit)="onBack()" [message]="data"></popup-modal>
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
  public url$: Observable<any>;
  public validator = {
    name: 'filter',
    message: 'Not Found part number!',
  };

  constructor(
    private _router: Router,
    private _receipt: ReceiptInfoService,
    private _ui: TabService,
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
    this.url$ = this._actRoute.queryParams.pipe(
      switchMap((url) => {
        if (url.name === 'finish') {
          this._message.success(
            `Finished Receipt: ${url.receipt}, line: ${url.line}`
          );
        }
        if (url.name === 'kickout') {
          this._message.warning(
            `Kickout Receipt: ${url.receipt}, Part: ${url.part}`
          );
        }
        return this._actRoute.data.pipe(
          filter((res) => res.lines?.error),
          map((res) => res.lines.error.message),
          map((res) => {
            let message = res;
            if (url.name === 'finish') {
              message = `Finished Receipt: ${url.receipt}, line: ${url.line}\n${res}`;
            }
            if (url.name === 'kickout') {
              message = `Kickout Receipt: ${url.receipt}, Part: ${url.part}\n${res}`;
            }
            return message;
          })
        );
      })
    );
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
