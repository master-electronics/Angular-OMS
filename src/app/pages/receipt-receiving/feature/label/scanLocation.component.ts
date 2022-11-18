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
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from '../../ui/single-input-form.component';
import { FormState, ReceivingStore } from '../../data/receivingStore';
import { LabelStore, ITNinfo } from '../../data/label';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SingleInputformComponent,
  ],
  template: `
    <ng-container *ngIf="data$ | async"></ng-container>
    <div *ngIf="ITNList$ | async as list">
      <div class="flex flex-col justify-center text-lg">
        <h1>Scan Location Barcode:</h1>
        <h1>({{ list.length }} of {{ _label.quantityList?.length }})</h1>
      </div>
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [formState]="formState$ | async"
        [formGroup]="inputForm"
        controlName="location"
        title="Location"
      ></single-input-form>
    </div>
  `,
})
export class ScanLocationComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;
  public formState$: Observable<FormState>;
  public ITNList$: Observable<any>;
  // public validator = {
  //   name: 'label',
  //   message: 'Not match the current label!',
  // };

  constructor(
    private _router: Router,
    private _ui: ReceivingStore,
    public _label: LabelStore
  ) {}

  ngOnInit(): void {
    if (!this._label.ITNList?.length) {
      this.onBack();
    }
    this._ui.initFormState();
    this._ui.changeSteps(3);
    this.formState$ = this._ui.formState$;
    console.log(this._label.ITNList);
    this.ITNList$ = this._label.ITNList$;
    this.inputForm = new FormGroup({
      location: new FormControl('', [Validators.required]),
    });
    this._ui.loadingOn();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._ui.loadingOff();
    }, 3000);
  }

  public onChange = (input: string) => {
    if (input) {
      this.inputForm.get('location').setValue(input);
    }
  };

  public onBack(): void {
    this._router.navigate(['receiptreceiving/label/assign']);
  }

  public onSubmit(): void {
    this._ui.loadingOn();
    this.data$ = this._label
      .checkBinLocation(this.inputForm.value.location.trim())
      .pipe(
        map(() => {
          this._ui.loadingOff();
          if (
            this._label.ITNList?.length === this._label.quantityList?.length
          ) {
            this._label.changeScanALl(true);
          }
          this._router.navigate(['receiptreceiving/label/printitn']);
        }),
        catchError((error) => {
          this._ui.updateMessage(error.message, 'error');
          this._ui.loadingOff();
          return of(error);
        })
      );
  }
}
