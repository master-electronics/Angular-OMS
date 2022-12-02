import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, filter, Observable, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { ReceivingService } from '../../data/receivingService';
import { LabelService } from '../../data/label';

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
      <h1>Scan Location Barcode:</h1>
      <h1>({{ list.length }} of {{ _label.quantityList?.length }})</h1>
    </div>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="location"
      title="Location"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
  `,
})
export class ScanLocationComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;
  public ITNList$: Observable<any>;
  // public validator = {
  //   name: 'label',
  //   message: 'Not match the current label!',
  // };

  constructor(
    private _router: Router,
    private _ui: ReceivingService,
    public _label: LabelService
  ) {}

  ngOnInit(): void {
    this.data$ = of(true);
    this._ui.changeSteps(3);
    console.log(this._label.ITNList);
    this.ITNList$ = this._label.ITNList$;
    this.inputForm = new FormGroup({
      location: new FormControl('', [Validators.required]),
    });
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
    this.data$ = this._label
      .checkBinLocation(this.inputForm.value.location.trim())
      .pipe(
        filter(() => {
          if (
            this._label.ITNList?.length !== this._label.quantityList?.length
          ) {
            this._router.navigate(['receiptreceiving/label/printitn']);
            return false;
          }
          return true;
        }),
        switchMap(() => this._label.updateAfterReceving()),
        tap(() => {
          this._router.navigate(['receiptreceiving/part']);
        }),
        catchError((error) => {
          return of(error);
        })
      );
  }
}
