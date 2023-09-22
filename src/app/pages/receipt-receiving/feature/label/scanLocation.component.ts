import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, delay, filter, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { LabelService } from '../../data/label';
import { LocationStrategy } from '@angular/common';
import { ReceiptInfoService } from '../../data/ReceiptInfo';

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
      *ngIf="this._label.ITNList as list"
      class="flex flex-col justify-center text-lg"
    >
      <h1>Scan Location Barcode:</h1>
      <h1>({{ _label.currentItnIndex() + 1 }} of {{ list.length }})</h1>
    </div>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="location"
      title="Location"
    ></single-input-form>
  `,
})
export class ScanLocationComponent implements OnInit {
  public inputForm: FormGroup;
  public data$: Observable<any>;
  public ITNList$: Observable<any>;
  public isloading = false;
  // public validator = {
  //   name: 'label',
  //   message: 'Not match the current label!',
  // };

  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _ui: TabService,
    public _label: LabelService,
    public _recipt: ReceiptInfoService,
    private location: LocationStrategy
  ) {}

  ngOnInit(): void {
    this.data$ = of(true).pipe(delay(500));
    this._ui.changeSteps(3);
    this.inputForm = new FormGroup({
      location: new FormControl('', [Validators.required]),
    });
    // preventing back button
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
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
    if (!this.inputForm.value.location.trim()) {
      return;
    }
    if (this.isloading) {
      return;
    }
    this.isloading = true;
    this.data$ = this._label
      .checkBinLocation(this.inputForm.value.location.trim())
      .pipe(
        filter(() => {
          if (this._label.ITNList?.length > this._label.currentItnIndex() + 1) {
            this._router.navigate(['receiptreceiving/label/printitn']);
            return false;
          }
          if (this._label.ITNList?.length <= this._label.currentItnIndex()) {
            this._router.navigate(['../assign'], {
              relativeTo: this._actRoute,
            });
            return false;
          }
          return true;
        }),
        map(() => {
          this._router.navigate(['../summary'], {
            relativeTo: this._actRoute,
          });
          return true;
        }),
        catchError((error) => {
          this.isloading = false;
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }
}
