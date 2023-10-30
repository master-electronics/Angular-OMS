import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { catchError, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { kickoutService } from '../../data/kickout';
import { KickoutinputComponent } from '../../ui/kickout-input.component';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { EventLogService } from 'src/app/shared/data/eventLog';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
    NzSkeletonModule,
    SubmitButtonComponent,
    NormalButtonComponent,
    MessageBarComponent,
    KickoutinputComponent,
  ],
  template: `
    <div
      class="text-4xl md:mx-16"
      *ngIf="print$ | async as print; else loading"
    >
      <p *ngIf="this._kickout.kickoutItns?.length">
        ITN: {{ this._kickout.kickoutItns[index] }} ({{ index + 1 }} of
        {{ this._kickout.kickoutItns.length }})
      </p>
      <kickout-input-form
        [formGroup]="kickoutForm"
        [isShowInput]="!this._kickout.kickoutItns?.length"
        [kickoutOptions]="kickoutOptions"
        [data]="print"
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
      ></kickout-input-form>
    </div>
    <ng-template #loading>
      <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 8 }"></nz-skeleton>
    </ng-template>
  `,
})
export class KickoutItnComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _receipt: ReceiptInfoService,
    public _kickout: kickoutService,
    private _insertLog: Create_EventLogsGQL,
    private _userInfo: StorageUserInfoService,
    private _eventLog: EventLogService
  ) {}

  public kickoutOptions = [
    { content: 'Missing/Incorrect Picture', value: 7 },
    { content: 'Missing/Incorrect Piece Kit', value: 8 },
    { content: 'Part Number Verification', value: 9 },
    { content: 'Date Code Verification', value: 10 },
    { content: 'Wrong PO/No Open PO/No Open Line', value: 11 },
    { content: 'Damaged Parts', value: 12 },
    { content: 'Over PO Quantity', value: 13 },
    { content: 'Other', value: 14 },
  ];
  public kickoutForm: FormGroup;
  public print$: Observable<any>;
  public index = 0;

  ngOnInit(): void {
    this.print$ = of(true);
    this.kickoutForm = this._fb.group({
      kickoutReason: ['', Validators.required],
      otherReason: [''],
      purchaseOrder: [''],
      productCode: [''],
      partNumber: [''],
    });
  }

  onChange = (input: string) => {
    this.kickoutForm.get('otherReason').setValue(input);
  };

  onBack(): void {
    if (this._kickout.kickoutItns) {
      this._router.navigateByUrl('receiptreceiving/itnlist');
      return;
    }
    this._router.navigateByUrl('receiptreceiving');
  }

  createLogs(reason: string) {
    if (this._receipt.receiptInfoAfterFilter()) {
      const oldLogs = this._receipt.receiptInfoAfterFilter().map((line) => {
        return {
          UserName: this._userInfo.userName,
          InventoryTrackingNumber: this._kickout.kickoutItns[this.index],
          UserEventID: sqlData.Event_Receiving_KickOut,
          ReceiptLine: line.ReceiptLineNumber,
          Quantity: line.ExpectedQuantity,
          PartNumber: line.PartNumber,
          ProductCode: line.ProductCodeNumber,
          ReceiptHeader: this._receipt.headerID(),
          PurchaseOrderNumber: line.PurchaseOrderNumber,
          PurchaseLine: line.PurchaseLineNumber,
          Message: reason,
        };
      });
      const eventLogs = this._receipt.receiptInfoAfterFilter().map((line) => {
        return {
          ...this._eventLog.eventLog,
          EventTypeID: sqlData.Event_Receiving_KickOut,
          Log: JSON.stringify({
            ...JSON.parse(this._eventLog.eventLog.Log),
            PartNumber: line.PartNumber,
            ProductCode: line.ProductCodeNumber,
            PurchaseOrderNumber: line.PurchaseOrderNumber,
            InventoryTrackingNumber: this._kickout.kickoutItns[this.index],
            ReceiptLine: line.ReceiptLineNumber,
            ExpectedQuantity: line.ExpectedQuantity,
            Reason: reason,
          }),
        };
      });
      const ITN = this._kickout.kickoutItns[this.index];
      const PurchaseOrder = oldLogs[0].PurchaseOrderNumber;
      return { oldLogs, eventLogs, ITN, PurchaseOrder };
    }
    return {
      oldLogs: [
        {
          UserName: this._userInfo.userName,
          UserEventID: sqlData.Event_Receiving_KickOut,
          PartNumber: this.kickoutForm.value.partNumber,
          ProductCode: this.kickoutForm.value.productCode,
          PurchaseOrderNumber: this.kickoutForm.value.purchaseOrder,
          Message: reason,
        },
      ],
      eventLogs: {
        UserName: this._userInfo.userName,
        EventTypeID: sqlData.Event_Receiving_KickOut,
        Log: JSON.stringify({
          PartNumber: this.kickoutForm.value.partNumber,
          ProductCode: this.kickoutForm.value.productCode,
          PurchaseOrderNumber: this.kickoutForm.value.purchaseOrder,
          Reason: reason,
        }),
      },
      ITN: '',
      PurchaseOrder: this.kickoutForm.value.purchaseOrder,
    };
  }

  onSubmit(): void {
    const { kickoutReason, otherReason } = this.kickoutForm.value;
    let kickoutText = this.kickoutOptions[kickoutReason - 7]?.content;
    let reason = this._receipt.receiptInfoAfterFilter()
      ? this._receipt.receiptInfoAfterFilter()[0].PurchaseOrderNumber.trim()
      : this.kickoutForm.value.purchaseOrder + '|';
    if (kickoutReason === 14) {
      kickoutText = kickoutText + ': ' + otherReason;
    }
    reason += kickoutText;
    const list = [];
    while (list.length < 4) {
      const tmp = reason.substring(list.length * 20, (list.length + 1) * 20);
      list.push(tmp);
    }
    const { oldLogs, eventLogs, ITN, PurchaseOrder } =
      this.createLogs(kickoutText);

    // update suspect flag and reason then print current label for current ITN.
    this.print$ = this._kickout
      .printKickOutLabel$(list, kickoutReason, ITN)
      .pipe(
        switchMap(() => {
          return this._insertLog.mutate({ oldLogs, eventLogs });
        }),
        tap(() => {
          this.index++;
          if (this._kickout.kickoutItns?.length - this.index > 0) {
            return;
          }
          this._router.navigate(['receiptreceiving'], {
            queryParams: {
              PurchaseOrder,
              name: 'kickout',
            },
          });
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        }),
        shareReplay(1)
      );
  }
}
