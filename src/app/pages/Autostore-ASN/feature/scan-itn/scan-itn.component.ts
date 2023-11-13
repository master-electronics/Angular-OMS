import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { ASNService } from '../../data/asn.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  catchError,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { ReplenishmentItem } from '../../utils/interfaces';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ITNInfoComponent } from '../../ui/itn-info.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import {
  FindAsnReplenishmentInventoryGQL,
  FetchAsnRejectionReasonsGQL,
} from 'src/app/graphql/autostoreASN.graphql-gen';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { isTemplateExpression, readJsonConfigFile } from 'typescript';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    GreenButtonComponent,
    PopupModalComponent,
    ITNInfoComponent,
    RedButtonComponent,
    NzModalModule,
    NzGridModule,
    NzRadioModule,
    FormsModule,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      iputType="string"
      controlName="ITN"
      title="Scan ITN:"
    >
    </single-input-form>
    <div style="height: 20px"></div>
    <ng-container *ngIf="info$ | async as info">
      <itn-info [itnInfo]="replenishmentItem"></itn-info>
    </ng-container>
    <div style="height: 20px"></div>
    <div
      class="grid h-12 w-full grid-cols-4 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
    >
      <div></div>
      <div class="col-span-2">
        <button
          (click)="showRejectReasons()"
          class="h-full w-full rounded-lg bg-red-700 font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-red-200  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          type="button"
        >
          Skip
        </button>
      </div>
      <div></div>
    </div>
    <ng-container *ngIf="error">
      <popup-modal (clickSubmit)="onBack()" [message]="error"></popup-modal>
    </ng-container>
    <div *ngIf="test$ | async"></div>
    <div *ngIf="log$ | async"></div>
    <div *ngIf="rejectReasons$ | async"></div>
    <nz-modal
      [(nzVisible)]="rejectVisible"
      [nzTitle]="rejectReasonTitleTemplate"
      (nzOnCancel)="hideRejectReasons()"
      (nzOnOk)="onOk()"
      [nzOkDisabled]="!rejectValue"
      [nzStyle]="{ top: '5px' }"
    >
      <ng-template #rejectReasonTitleTemplate>Reject Reason</ng-template>
      <ng-container *nzModalContent>
        <nz-radio-group [(ngModel)]="rejectValue">
          <label
            *ngFor="let reason of rejectReasonList"
            nz-radio
            nzValue="{{ reason.label }}"
            (click)="setGlobal(reason.global)"
            >{{ reason.label
            }}<span *ngIf="reason.global"> - Global</span></label
          >
        </nz-radio-group>
      </ng-container>
    </nz-modal>
  `,
  styleUrls: ['./scan-itn.component.css'],
})
export class ScanITN implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _asn: ASNService,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _eventLog: EventLogService,
    private _findReplenishmentItem: FindAsnReplenishmentInventoryGQL,
    private _fetchRejectReasons: FetchAsnRejectionReasonsGQL,
    private _userInfo: StorageUserInfoService
  ) {}

  rejectVisible: boolean;
  rejectValue: string;
  rejectReasonList: { label: string; value: string; global: boolean }[];
  rejectReasonIsGlobal: boolean;
  test;
  public data$;
  public test$;
  public log$;
  public info$;
  public rejectReasons$;
  public inputForm = this._fb.nonNullable.group({
    ITN: ['', [Validators.required]],
  });

  replenishmentItem: ReplenishmentItem;
  error;

  ngOnInit(): void {
    this.rejectReasonList = [];

    this.rejectVisible = false;
    this.replenishmentItem = null;

    this.info$ = this._actRoute.data.pipe(
      map((res) => {
        if (!res.ReplenishmentItem.InventoryTrackingNumber) {
          this.error = 'There are no more replenishment ITNs';
          return of(false);
        }
        this.replenishmentItem = res.ReplenishmentItem;
        sessionStorage.setItem(
          'asnReplenishmentItem',
          JSON.stringify(this.replenishmentItem)
        );

        this.log$ = this._eventLog.insertLog(
          [
            {
              UserEventID: sqlData.Event_Autostore_ASN_ITN_Presented,
              UserName: this._userInfo.userName,
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber:
                this.replenishmentItem.InventoryTrackingNumber,
            },
          ],
          [
            {
              UserName: this._userInfo.userName,
              EventTypeID: sqlData.Event_Autostore_ASN_ITN_Presented,
              Log: JSON.stringify({
                DistributionCenter: environment.DistributionCenter,
                data: this.replenishmentItem,
              }),
            },
          ]
        );

        return of(true);
      })
    );

    this.rejectReasons$ = this._fetchRejectReasons
      .fetch({}, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          res.data.fetchASNRejectionReasons.map((reason) => {
            this.rejectReasonList.push({
              label: reason.Reason,
              value: reason._id.toString(),
              global: reason.Global,
            });
          });
        })
      );

    this.data$ = of(true);
    sessionStorage.removeItem('asnLocation');
    sessionStorage.removeItem('asn-itn');
  }

  public onSubmit(): void {
    const input = this.inputForm.value.ITN.trim();

    if (ITNBarcodeRegex.test(input)) {
      if (this.replenishmentItem.InventoryTrackingNumber != input) {
        this.data$ = of({
          error: { message: 'Incorrect ITN!', type: 'error' },
        });

        return;
      }

      sessionStorage.setItem('asnLocation', this.replenishmentItem.Barcode);
      sessionStorage.setItem('asn-itn', input);

      this.log$ = this._eventLog.insertLog(
        [
          {
            UserEventID: sqlData.Event_Autostore_ASN_ITN_Scanned,
            UserName: this._userInfo.userName,
            DistributionCenter: environment.DistributionCenter,
            InventoryTrackingNumber: input,
          },
        ],
        [
          {
            UserName: this._userInfo.userName,
            EventTypeID: sqlData.Event_Autostore_ASN_ITN_Scanned,
            Log: JSON.stringify({
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber: input,
            }),
          },
        ]
      );

      this._router.navigate(['../scan-location'], {
        relativeTo: this._actRoute,
      });

      return;
    } else {
      this.data$ = of({
        error: { message: 'Invalid ITN format', type: 'error' },
      });
    }
  }

  // sendToAutostore() {
  //   this._router.navigate(['../create/scan-location'], {
  //     relativeTo: this._actRoute,
  //   });
  // }

  onBack() {
    this._router.navigate(['../start-location'], {
      relativeTo: this._actRoute,
    });
  }

  showRejectReasons() {
    this.rejectVisible = true;
  }

  hideRejectReasons() {
    this.rejectValue = null;
    this.rejectReasonIsGlobal = null;
    this.rejectVisible = false;
  }

  setGlobal(IsGlobal: boolean) {
    this.rejectReasonIsGlobal = IsGlobal;
  }

  async onOk() {
    const rejectReason = this.rejectValue;
    const t = this.rejectReasonIsGlobal;
    if (this.rejectReasonIsGlobal) {
      const userEventLogs = [];
      const eventLogs = [];

      userEventLogs.push({
        UserEventID: sqlData.Event_Autostore_ASN_ITN_Skipped,
        UserName: this._userInfo.userName,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: JSON.parse(
          sessionStorage.getItem('asnReplenishmentItem')
        ).InventoryTrackingNumber,
        Message: rejectReason,
      });

      eventLogs.push({
        UserName: this._userInfo.userName,
        EventTypeID: sqlData.Event_Autostore_ASN_ITN_Skipped,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          data: sessionStorage.getItem('asnReplenishmentItem'),
          RejectReason: rejectReason,
        }),
      });

      this.data$ = await forkJoin({
        globalReject: this._asn.globalASNRejection(
          Number(
            JSON.parse(sessionStorage.getItem('asnReplenishmentItem'))
              .InventoryID
          )
        ),
        updateProduct: this._asn.updateProduct({
          _id: this.replenishmentItem.ProductID,
          ExcludeFromAutostore: true,
        }),
        skip: this._asn.clearSuspect(
          this._userInfo.userName,
          this.replenishmentItem.InventoryTrackingNumber,
          this.replenishmentItem.Barcode,
          'false'
        ),
      }).pipe(
        map(async (res) => {
          res.globalReject.data.globalASNRejection.forEach((item) => {
            userEventLogs.push({
              UserEventID: sqlData.Event_Autostore_ASN_ITN_Skipped,
              UserName: this._userInfo.userName,
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber: item.InventoryTrackingNumber,
              Message: rejectReason,
            });

            eventLogs.push({
              UserName: this._userInfo.userName,
              EventTypeID: sqlData.Event_Autostore_ASN_ITN_Skipped,
              Log: JSON.stringify({
                DistributionCenter: environment.DistributionCenter,
                data: item,
                RejectReason: rejectReason,
              }),
            });
          });

          this.log$ = await this._eventLog.insertLog(userEventLogs, eventLogs);

          return res;
        })
      );
    } else {
      this.data$ = await forkJoin({
        skip: this._asn.clearSuspect(
          this._userInfo.userName,
          this.replenishmentItem.InventoryTrackingNumber,
          this.replenishmentItem.Barcode,
          'false'
        ),
        updateProduct: this._asn.updateProduct({
          _id: this.replenishmentItem.ProductID,
          ExcludeFromAutostore: true,
        }),
      });

      this.log$ = await this._eventLog.insertLog(
        [
          {
            UserEventID: sqlData.Event_Autostore_ASN_ITN_Skipped,
            UserName: this._userInfo.userName,
            DistributionCenter: environment.DistributionCenter,
            InventoryTrackingNumber: JSON.parse(
              sessionStorage.getItem('asnReplenishmentItem')
            ).InventoryTrackingNumber,
            Message: rejectReason,
          },
        ],
        [
          {
            UserName: this._userInfo.userName,
            EventTypeID: sqlData.Event_Autostore_ASN_ITN_Skipped,
            Log: JSON.stringify({
              DistributionCenter: environment.DistributionCenter,
              data: sessionStorage.getItem('asnReplenishmentItem'),
              RejectReason: rejectReason,
            }),
          },
        ]
      );
    }

    this.skipITN();

    this.hideRejectReasons();
  }

  skipITN() {
    sessionStorage.setItem('asnLocation', this.replenishmentItem.Barcode);
    this.info$ = this._asn
      .updateASNReplenishmentItem(
        Number(JSON.parse(sessionStorage.getItem('asnReplenishmentItem'))._id),
        'skipped'
      )
      .pipe(
        switchMap(() => {
          return this._findReplenishmentItem.fetch(
            {
              barcode: sessionStorage.getItem('asnLocation'),
            },
            { fetchPolicy: 'network-only' }
          );
        }),
        map((res) => {
          if (res.data.findASNReplenishmentInventory.length == 0) {
            this.error = 'There are no more replenishment ITNs';
            return of(false);
          }
          this.replenishmentItem = {
            _id: res.data.findASNReplenishmentInventory[0]._id,
            InventoryID: res.data.findASNReplenishmentInventory[0].InventoryID,
            Status: res.data.findASNReplenishmentInventory[0].Status,
            Barcode: res.data.findASNReplenishmentInventory[0].Barcode,
            Warehouse: res.data.findASNReplenishmentInventory[0].Warehouse,
            Row: res.data.findASNReplenishmentInventory[0].Row,
            Aisle: res.data.findASNReplenishmentInventory[0].Aisle,
            Section: res.data.findASNReplenishmentInventory[0].Section,
            Shelf: res.data.findASNReplenishmentInventory[0].Shelf,
            ShelfDetail: res.data.findASNReplenishmentInventory[0].ShelfDetail,
            InventoryTrackingNumber:
              res.data.findASNReplenishmentInventory[0].InventoryTrackingNumber,
          };
          sessionStorage.setItem(
            'asnReplenishmentItem',
            JSON.stringify(this.replenishmentItem)
          );

          this.log$ = this._eventLog.insertLog(
            [
              {
                UserEventID: sqlData.Event_Autostore_ASN_ITN_Presented,
                UserName: this._userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber:
                  this.replenishmentItem.InventoryTrackingNumber,
              },
            ],
            [
              {
                UserName: this._userInfo.userName,
                EventTypeID: sqlData.Event_Autostore_ASN_ITN_Presented,
                Log: JSON.stringify({
                  DistributionCenter: environment.DistributionCenter,
                  data: this.replenishmentItem,
                }),
              },
            ]
          );

          return of(true);
        }),
        catchError((error) => {
          return of({ error });
        })
      );
  }
}
