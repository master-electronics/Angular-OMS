import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditInfoComponent } from '../../ui/audit-info.component';
import { AuditService } from '../../data/audit.service';
import {
  Audit,
  AuditType,
  Inventory,
  Product,
  ProductCode,
} from '../../utils/interfaces';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { ShelfBarcodeBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { FindContainerGQL } from 'src/app/graphql/pick.graphql-gen';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

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
    <ng-container *ngIf="auditInfo">
      <audit-info [auditInfo]="auditInfo"></audit-info>
    </ng-container>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="string"
      controlName="barcode"
      title="Scan Location:"
      [isvalid]="this.inputForm.valid"
    >
    </single-input-form>
    <div style="height: 20px"></div>
    <div style="height: 20px"></div>
    <ng-container *ngIf="message">
      <popup-modal (clickSubmit)="onBack()" [message]="message"></popup-modal>
    </ng-container>
  `,
})
export class ScanLocation implements OnInit {
  userInfo = inject(StorageUserInfoService);
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _auditService: AuditService,
    private _eventLog: EventLogService,
    private _findContainer: FindContainerGQL
  ) {}

  public data$;
  public info$;
  public inputForm = this._fb.nonNullable.group({
    barcode: [
      '',
      [Validators.required, Validators.pattern(ShelfBarcodeBarcodeRegex)],
    ],
  });

  message;

  auditInfo: Audit;

  ngOnInit(): void {
    if (sessionStorage.getItem('currentAudit')) {
      const currentAudit: Audit = JSON.parse(
        sessionStorage.getItem('currentAudit')
      );
      this.auditInfo = {
        Container: {
          Barcode: currentAudit.Container.Barcode,
        },
        Inventory: {
          ITN: currentAudit.Inventory.ITN,
        },
      };
    }
    this.data$ = of(true);
  }

  verifyLocation(): void {
    const barcode = this.inputForm.value.barcode.replace(/-/g, '').trim();
    this.data$ = this._findContainer
      .fetch(
        {
          Container: {
            DistributionCenter: environment.DistributionCenter,
            Barcode: barcode,
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findContainer) {
            throw new Error('Location not found');
          }
        }),
        switchMap((res) => {
          const userEventLogs = [
            {
              UserEventID: sqlData.Event_IM_Location_Scanned,
              UserName: this.userInfo.userName,
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
              Message: 'BinLocation: ' + barcode,
            },
          ];

          const eventLogs = [
            {
              UserName: this.userInfo.userName,
              EventTypeID: sqlData.Event_IM_Location_Scanned,
              Log: JSON.stringify({
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                BinLocation: barcode,
              }),
            },
          ];

          return this._eventLog.insertLog(userEventLogs, eventLogs).pipe(
            switchMap((res) => {
              return this._auditService.inventoryUpdate(
                this.userInfo.userName,
                sessionStorage.getItem('auditITN'),
                'Inventory Management Audit',
                '',
                '',
                '',
                '',
                '',
                barcode
              );
            }),
            catchError((error) => {
              throw new Error(error);
            })
          );
        }),
        switchMap((res) => {
          this._router.navigate(['../../scan-itn'], {
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
  }

  onSubmit(): void {
    this.verifyLocation();
  }

  onBack(): void {
    this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
  }
}
