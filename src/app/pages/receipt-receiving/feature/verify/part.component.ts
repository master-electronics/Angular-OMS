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
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { filter, map, Observable, switchMap } from 'rxjs';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LocationStrategy } from '@angular/common';

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
      [validators]="validators"
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
  `,
})
export class PartComponent implements OnInit {
  public inputForm: FormGroup;
  public url$: Observable<any>;
  public validators = [
    {
      name: 'filter',
      message: 'Not Found part number!',
    },
  ];

  constructor(
    private _router: Router,
    private _receipt: ReceiptInfoService,
    private _ui: TabService,
    private _message: NzMessageService,
    private location: LocationStrategy,
    private _actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(0);

    // preventing back button
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });

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
          this._message.warning(`Kickout PurchaseOrder: ${url.PurchaseOrder},`);
        }
        return this._actRoute.data.pipe(
          filter((res) => res.lines?.error),
          map((res) => res.lines.error.message),
          map((res) => {
            let message = res;
            if (url.name === 'finish') {
              message = `Receipt Complete`;
            }
            if (url.name === 'kickout') {
              message = `Kickout PurchaseOrder: ${url.PurchaseOrder}\n${res}`;
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
      const isVaild = this._receipt
        .receiptInfoAfterFilter()
        .some(
          (line) =>
            line.PartNumber.trim().toLowerCase() === value.trim().toLowerCase()
        );
      return !isVaild ? { filter: true } : null;
    };
  }

  onChange = (input: string) => {
    this.inputForm.setValue({ partNumber: input });
  };

  onSubmit(): void {
    this._receipt.updatePartNumber(this.inputForm.value.partNumber.trim());
    this._router.navigate(['../part/verify'], { relativeTo: this._actRoute });
  }

  onBack(): void {
    this._router.navigate(['../receipt'], { relativeTo: this._actRoute });
  }
}
