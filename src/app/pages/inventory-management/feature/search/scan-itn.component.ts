import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  ITNBarcodeRegex,
  ShelfBarcodeBarcodeRegex,
} from 'src/app/shared/utils/dataRegex';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditInfoComponent } from '../../ui/audit-info.component';
import {
  Audit,
  AuditType,
  Inventory,
  Product,
  ProductCode,
} from '../../utils/interfaces';
import { FindContainerGQL } from 'src/app/graphql/pick.graphql-gen';
import { environment } from 'src/environments/environment';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { AuditService } from '../../data/audit.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    PopupModalComponent,
    NzModalModule,
    NzGridModule,
    FormsModule,
    AuditInfoComponent,
  ],
  template: `
    <ng-container *ngIf="info$ | async as info">
      <audit-info [auditInfo]="auditInfo"></audit-info>
    </ng-container>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="string"
      controlName="itn"
      title="Scan ITN:"
      backButtonText="Done"
      [isvalid]="this.inputForm.valid"
    >
    </single-input-form>
  `,
})
export class ScanITN implements OnInit {
  userInfo = inject(StorageUserInfoService);
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _findContainer: FindContainerGQL,
    private _router: Router,
    private _eventLog: EventLogService,
    private _auditService: AuditService
  ) {}

  public data$;
  public info$;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  searchLocation;
  auditInfo: Audit;

  ngOnInit(): void {
    this.data$ = of(true);
  }

  onSubmit(): void {
    const itn = this.inputForm.value.itn;
    let loc;
    let locs;
    let barcode;
    // if (this.searchLocation != itn) {
    //   this.data$ = of({
    //     error: { message: 'Incorrect Location!', type: 'error' },
    //   });
    // } else {
    const userEventLogs = [
      {
        UserEventID: sqlData.Event_IM_Search_ITN_Scanned,
        UserName: this.userInfo.userName,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: itn,
        Message: '',
      },
    ];

    const eventLogs = [
      {
        UserName: this.userInfo.userName,
        EventTypeID: sqlData.Event_IM_Search_ITN_Scanned,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: itn,
        }),
      },
    ];

    this.data$ = this._auditService.checkBinlocation(itn).pipe(
      switchMap((res) => {
        locs = JSON.parse(sessionStorage.getItem('searchLocations'));
        loc = locs?.find((loc) => loc.Status == 'active');
        barcode = res.data.findInventory.Container.Barcode;

        if (loc.Barcode != barcode) {
          userEventLogs.push({
            UserEventID: sqlData.Event_IM_Search_ITN_Location_Updated,
            UserName: this.userInfo.userName,
            DistributionCenter: environment.DistributionCenter,
            InventoryTrackingNumber: itn,
            Message:
              'Original BinLocation: ' +
              barcode +
              ' --- New BinLocation: ' +
              loc.Barcode,
          });

          eventLogs.push({
            UserName: this.userInfo.userName,
            EventTypeID: sqlData.Event_IM_Search_ITN_Location_Updated,
            Log: JSON.stringify({
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber: itn,
              OriginalBinLocation: barcode,
              NewBinLocation: loc.Barcode,
            }),
          });
        }

        return this._eventLog.insertLog(userEventLogs, eventLogs);
      }),
      switchMap((res) => {
        if (loc.Barcode != barcode) {
          return this._auditService.inventoryUpdate(
            this.userInfo.userName,
            itn,
            'Inventory Management Audit',
            '',
            '',
            '',
            '',
            '',
            loc.Barcode
          );
        }

        return of(res);
      }),
      switchMap((res) => {
        this._router.navigate(['../scan-itn'], {
          relativeTo: this._actRoute,
        });

        return of(res);
      }),
      catchError((error) => {
        return of({
          error: { message: error.message, type: 'error' },
        });
      })
    );

    // this.data$ = this._findContainer
    //   .fetch(
    //     {
    //       Container: {
    //         DistributionCenter: environment.DistributionCenter,
    //         Barcode: itn,
    //       },
    //     },
    //     { fetchPolicy: 'network-only' }
    //   )
    //   .pipe(
    //     tap((res) => {
    //       if (!res.data.findContainer) {
    //         throw new Error('Location not found');
    //       }
    //     }),
    //     map((res) => {
    //       //this._router.navigate
    //     })
    //   );
    //}
  }

  onBack(): void {
    const locs = JSON.parse(sessionStorage.getItem('searchLocations'));
    const loc = locs?.find((loc) => loc.Status == 'active');
    loc.Status = 'done';
    sessionStorage.setItem('searchLocations', JSON.stringify(locs));

    this._router.navigate(['../scan-location'], {
      relativeTo: this._actRoute,
    });
  }
}
