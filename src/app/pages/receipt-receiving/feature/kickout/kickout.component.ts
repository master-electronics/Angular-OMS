import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { UIStateStore } from 'src/app/shared/data/app-ui-state';
import { AlertBarComponent } from 'src/app/shared/ui/alert-bar.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { KickoutStore } from '../../data/kickout';
import { ReceiptStore } from '../../data/Receipt';
import { ReceivingStore } from '../../data/receivingStore';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzInputModule,
    NzRadioModule,
    ReactiveFormsModule,
    NzButtonModule,
    SimpleKeyboardComponent,
    AlertBarComponent,
  ],
  template: `
    <form [formGroup]="kickoutForm" (ngSubmit)="onSubmit()">
      <nz-radio-group
        id="kickoutReason"
        nzSize="large"
        formControlName="kickoutReason"
        name="kickoutReason"
        #kickoutReason
      >
        <div class="mb-4 grid grid-cols-3 justify-center gap-5">
          <div *ngFor="let option of kickoutOptions">
            <label nz-radio-button [nzValue]="option.content">{{
              option.content
            }}</label>
          </div>
          <label nz-radio-button nzValue="Other"> Other... </label>
        </div>
      </nz-radio-group>

      <textarea
        *ngIf="kickoutForm.value.kickoutReason === 'Other'"
        rows="4"
        nz-input
        name="otherReason"
        formControlName="otherReason"
        #otherReason
      ></textarea>
      <div class="mb-10 mt-10 flex">
        <button
          nz-button
          class="w-32"
          [disabled]="kickoutForm.invalid"
          nzType="primary"
          type="submit"
          nzSize="large"
        >
          kickout
        </button>
        <div class="grow"></div>
        <button
          nz-button
          type="button"
          class="w-32"
          (click)="onBack()"
          nzSize="large"
        >
          Back
        </button>
      </div>
    </form>
    <div *ngIf="print$ | async as print">
      <alert-bar
        [message]="print.message"
        [messageType]="print.messageType"
      ></alert-bar>
    </div>
    <simple-keyboard
      [inputString]="kickoutForm.value.otherReason"
      (outputString)="onChange($event)"
    ></simple-keyboard>
  `,
})
export class KickoutComponent implements OnInit {
  public kickoutOptions = [];
  public kickoutForm: FormGroup;
  public print$: Observable<any>;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _kickout: KickoutStore,
    private _receipt: ReceiptStore,
    private _step: ReceivingStore
  ) {}

  ngOnInit(): void {
    if (!this._receipt.receiptLs?.length) {
      this.onBack();
    }
    this._step.changeSteps(1);
    this._kickout.resetKickout();
    this.kickoutOptions = [
      { content: 'Missing/Incorrect Picture' },
      { content: 'Missing/Incorrect Piece Kit' },
      { content: 'Part Number Verification' },
      { content: 'Date Code Verification' },
      { content: 'Wrong PO/No Open PO/No Open Line' },
      { content: 'Damaged Parts' },
      { content: 'Over PO Quantity' },
      { content: 'Wrong Parts' },
    ];
    this.kickoutForm = this._fb.group({
      kickoutReason: ['', Validators.required],
      otherReason: [''],
    });
    this._kickout.initKickout();
  }

  onChange = (input: string) => {
    this.kickoutForm.get('otherReason').setValue(input);
  };

  onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part/verify');
  }

  onSubmit(): void {
    const { kickoutReason, otherReason } = this.kickoutForm.value;
    const line = (kickoutReason + otherReason).substring(0, 79);
    this.print$ = this._kickout
      .printTextLabel$('PHLABELS139', '300', 'LANDSCAPE', line)
      .pipe(
        map(() => {
          this._router.navigateByUrl('receiptreceiving/part');
        }),
        catchError((error) => {
          return of({ message: error.message, messageType: 'error' });
        })
      );
  }
}
