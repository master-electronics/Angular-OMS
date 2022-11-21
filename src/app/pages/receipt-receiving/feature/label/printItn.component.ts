import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from '../../ui/single-input-form.component';
import { ReceivingService } from '../../data/receivingService';
import { LabelService, ITNinfo } from '../../data/label';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SingleInputformComponent,
  ],
  template: `
    <div
      *ngIf="ITNList$ | async as list"
      class="flex flex-col justify-center text-lg"
    >
      <h1>Scan Label</h1>
      <h1>({{ list.length }} of {{ _label.quantityList?.length }})</h1>
    </div>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [validator]="validator"
      [formGroup]="inputForm"
      controlName="label"
      title="Label"
    ></single-input-form>
  `,
})
export class PrintITNComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;
  public ITNList$ = new Observable<Array<ITNinfo>>();
  public scanAll = false;
  public validator = {
    name: 'label',
    message: 'Not match the current label!',
  };

  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _ui: ReceivingService,
    public _label: LabelService
  ) {}

  ngOnInit(): void {
    // this._label.initQuantityList([1, 2, 3]);
    if (!this._label.quantityList?.length) {
      this._router.navigate(['../../'], { relativeTo: this._actRoute });
    }
    this._ui.changeSteps(3);
    this.data$ = this._actRoute.data;
    this.ITNList$ = this._label.ITNList$;
    this.inputForm = new FormGroup({
      label: new FormControl('', [Validators.required, this.checKLabel()]),
    });
    if (this._label.scanAll) {
      this.onConfirm();
      return;
    }
    let index = 0;
    if (this._label.ITNList?.length) {
      index = this._label.ITNList.length;
    }
    this.data$ = this.printITN(this._label.quantityList[index]);
  }

  public printITN(quantity: number): Observable<any> {
    return this._label
      .printReceivingLabel$(quantity, 'PHLABELS139', '300', 'LANDSCAPE')
      .pipe(
        map(() => {
          //
        }),
        catchError((error) => {
          return of(error);
        })
      );
  }

  public checKLabel(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.trim();
      if (!value) {
        return null;
      }
      const isVaild = this._label.ITNList.slice(-1)[0].ITN === value;
      return !isVaild ? { label: true } : null;
    };
  }

  public onChange = (input: string) => {
    if (input) {
      this.inputForm.get('receipt').setValue(input);
    }
  };

  public onBack(): void {
    this._router.navigate(['receiptreceiving/label/assign']);
  }

  public onSubmit(): void {
    if (this.scanAll) {
      return;
    }
    this.inputForm.setValue({ label: '' });
    this._router.navigate(['receiptreceiving/label/sacnlocation']);
  }
  /**
   * After create and scan all ITN wrint ITN Number to server
   */
  public onConfirm(): void {
    this.data$ = this._label.updateAfterReceving().pipe(
      map(() => {
        this._label.initValue();
        this._router.navigate(['receiptreceiving/part']);
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }
}
