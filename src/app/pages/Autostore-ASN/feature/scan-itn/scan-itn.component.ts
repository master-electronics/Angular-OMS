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
import { FindAsnReplenishmentInventoryGQL } from 'src/app/graphql/autostoreASN.graphql-gen';

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
        <red-button buttonText="Skip" (buttonClick)="skipITN()"></red-button>
      </div>
      <div></div>
    </div>
    <ng-container *ngIf="error">
      <popup-modal (clickSubmit)="onBack()" [message]="error"></popup-modal>
    </ng-container>
    <div *ngIf="test$ | async"></div>
    <div *ngIf="log$ | async"></div>
  `,
})
export class ScanITN implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _asn: ASNService,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _eventLog: EventLogService,
    private _findReplenishmentItem: FindAsnReplenishmentInventoryGQL
  ) {}

  public data$;
  public test$;
  public log$;
  public info$;
  public inputForm = this._fb.nonNullable.group({
    ITN: ['', [Validators.required]],
  });

  replenishmentItem: ReplenishmentItem;
  error;

  ngOnInit(): void {
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
        return of(true);
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
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
            DistributionCenter: environment.DistributionCenter,
            InventoryTrackingNumber: input,
          },
        ],
        [
          {
            UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
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

  skipITN() {
    this.data$ = of(true);
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
          return of(true);
        }),
        catchError((error) => {
          return of({ error });
        })
      );
  }
}
