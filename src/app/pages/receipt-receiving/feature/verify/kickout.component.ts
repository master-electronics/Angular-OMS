import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { LogService } from '../../data/eventLog';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { TabService } from '../../data/tab';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzRadioModule,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
    NzSkeletonModule,
    SubmitButtonComponent,
    NormalButtonComponent,
    MessageBarComponent,
  ],
  template: `
    <form
      *ngIf="print$ | async as print; else loading"
      [formGroup]="kickoutForm"
      (ngSubmit)="onSubmit()"
      class="text-xl md:mx-16"
    >
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
        id="otherReason"
        name="otherReason"
        formControlName="otherReason"
        #otherReason
        rows="3"
        name="message"
        id="message"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      ></textarea>
      <div class="grid h-16 grid-cols-3 text-2xl md:mt-10 md:h-32 md:text-4xl">
        <submit-button
          [disabled]="kickoutForm.invalid"
          (buttonClick)="onSubmit()"
        >
        </submit-button>
        <div></div>
        <normal-button (buttonClick)="onBack()"></normal-button>
      </div>
      <ng-container *ngIf="print.error">
        <message-bar
          [message]="print.error.message"
          [name]="print.error.type"
        ></message-bar>
      </ng-container>
    </form>
    <ng-template #loading>
      <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 8 }"></nz-skeleton>
    </ng-template>
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
    private _step: TabService,
    private _receipt: ReceiptInfoService,
    private _log: LogService
  ) {}

  ngOnInit(): void {
    this._step.changeSteps(1);
    this.print$ = of(true);
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
  }

  onChange = (input: string) => {
    this.kickoutForm.get('otherReason').setValue(input);
  };

  onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part/verify');
  }

  onSubmit(): void {
    const { kickoutReason, otherReason } = this.kickoutForm.value;
    const line1 = (kickoutReason + otherReason).substring(0, 20);
    let reason = `ID:${this._receipt.headerID};`;
    reason += kickoutReason;
    if (otherReason) {
      reason = kickoutReason + ': ' + otherReason;
    }
    const list = [];
    while (list.length < 4) {
      const tmp = reason.substring(list.length * 20, (list.length + 1) * 20);
      list.push(tmp);
    }
    this.print$ = this._receipt.printKickOutLabel$(list).pipe(
      map(() => {
        this._router.navigate(['receiptreceiving/part'], {
          queryParams: {
            receipt: this._log.receivingLog.ReceiptHeader,
            part: this._log.receivingLog.PartNumber,
            name: 'kickout',
          },
        });
      }),
      catchError((error) => {
        return of({
          error: { message: error.message, type: 'error' },
        });
      })
    );
  }
}
