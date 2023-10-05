import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  combineLatest,
  of,
  tap,
  map,
  catchError,
  forkJoin,
  switchMap,
} from 'rxjs';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormsModule,
} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditInfoComponent } from '../../ui/audit-info.component';
import { AuditService } from '../../data/audit.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { dateCodeRegex } from 'src/app/shared/utils/dataRegex';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import {
  DeleteAuditDocument,
  InventoryUpdateDocument,
} from 'src/app/graphql/inventoryManagement.graphql-gen';
import { Audit } from '../../utils/interfaces';
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
    SimpleKeyboardComponent,
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
      controlName="dateCode"
      title="Enter Date Code:"
      [isvalid]="this.inputForm.valid"
    >
    </single-input-form>
    <div style="height: 200px;"></div>
    <simple-keyboard
      [inputString]="this.inputForm.value.dateCode"
      (outputString)="onChange($event)"
      layout="number"
    ></simple-keyboard>
    <ng-container *ngIf="message">
      <popup-modal (clickSubmit)="onBack()" [message]="message"></popup-modal>
    </ng-container>
    <div *ngIf="info$ | async"></div>
    <div *ngIf="close$ | async"></div>
  `,
})
export class DateCodeAudit implements OnInit {
  userInfo = inject(StorageUserInfoService);
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _auditService: AuditService,
    private _eventLog: EventLogService
  ) {}

  public data$;
  public close$;
  public info$;
  public inputForm = this._fb.nonNullable.group({
    dateCode: ['', [Validators.required, Validators.pattern(dateCodeRegex)]],
  });
  public currentInputField;
  auditInfo: Audit;
  message;

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
          Product: {
            PartNumber: currentAudit.Inventory.Product.PartNumber,
            ProductCode: {
              ProductCodeNumber:
                currentAudit.Inventory.Product.ProductCode.ProductCodeNumber,
            },
          },
        },
      };
    }

    this.data$ = of(true);
  }

  onChange(input: string) {
    this.inputForm.patchValue({ dateCode: input });
  }

  onInputFocus(event) {
    this.currentInputField = this.inputForm.get(`field${event.target.id}`);
  }

  async onSubmit() {
    const dateCode = this.inputForm.value.dateCode;
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    this.info$ = this._auditService
      .validateAssignment$(currentAudit._id, this.userInfo.userId)
      .pipe(
        map((res) => {
          if (!res.data.validateAssignment) {
            this.message = 'This Audit has timed out!';
            sessionStorage.removeItem('currentAudit');
            sessionStorage.removeItem('auditITN');

            return of(true);
          } else {
            const userEventLogs = [
              {
                UserEventID: sqlData.Event_IM_DateCode_Entered,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                Message: 'Date Code: ' + this.inputForm.value.dateCode,
              },
            ];

            const eventLogs = [
              {
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_DateCode_Entered,
                Log: JSON.stringify({
                  DistributionCenter: environment.DistributionCenter,
                  InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                  ParentITN: currentAudit.Inventory.ParentITN,
                  BinLocation: currentAudit.Container.Barcode,
                  QuantityOnHand: currentAudit.Inventory.Quantity,
                  OriginalQuantity: currentAudit.Inventory.OriginalQuantity,
                  DateCode: currentAudit.Inventory.DateCode,
                  DateCodeEntered: this.inputForm.value.dateCode,
                  CountryOfOrigin: currentAudit.Inventory.COO,
                  ROHS: currentAudit.Inventory.ROHS,
                  NotFound: currentAudit.Inventory.NotFound,
                  Suspect: currentAudit.Inventory.Suspect,
                  LocatedInAutostore: currentAudit.Inventory.LocatedInAutostore,
                  BoundForAutostore: currentAudit.Inventory.BoundForAutostore,
                  PartNumber: currentAudit.Inventory.Product.PartNumber,
                  ProductCode:
                    currentAudit.Inventory.Product.ProductCode
                      .ProductCodeNumber,
                  Description: currentAudit.Inventory.Product.Description,
                  ProductTier: currentAudit.Inventory.Product.ProductTier,
                  ProductType:
                    currentAudit.Inventory.Product.ProductType.ProductType,
                  ProductTypeDescription:
                    currentAudit.Inventory.Product.ProductType.Description,
                  Velocity: currentAudit.Inventory.Product.Velocity,
                  MICPartNumber: currentAudit.Inventory.Product.MICPartNumber,
                  UOM: currentAudit.Inventory.Product.UOM,
                  Autostore: currentAudit.Inventory.Product.Autostore,
                  PackType: currentAudit.Inventory.Product.PackType,
                  PackQuantity: currentAudit.Inventory.Product.PackQty,
                  Cost: currentAudit.Inventory.Product.Cost,
                }),
              },
            ];

            if (
              dateCode !=
              JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                .DateCode
            ) {
              userEventLogs.push({
                UserEventID: sqlData.Event_IM_DateCode_Updated,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                Message:
                  'Original Date Code: ' +
                  JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                    .DateCode +
                  ' --- New Date Code: ' +
                  dateCode,
              });

              eventLogs.push({
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_DateCode_Updated,
                Log: JSON.stringify({
                  DistributionCenter: environment.DistributionCenter,
                  InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                  ParentITN: currentAudit.Inventory.ParentITN,
                  BinLocation: currentAudit.Container.Barcode,
                  QuantityOnHand: currentAudit.Inventory.Quantity,
                  OriginalQuantity: currentAudit.Inventory.OriginalQuantity,
                  DateCode: currentAudit.Inventory.DateCode,
                  CountryOfOrigin: currentAudit.Inventory.COO,
                  ROHS: currentAudit.Inventory.ROHS,
                  NotFound: currentAudit.Inventory.NotFound,
                  Suspect: currentAudit.Inventory.Suspect,
                  LocatedInAutostore: currentAudit.Inventory.LocatedInAutostore,
                  BoundForAutostore: currentAudit.Inventory.BoundForAutostore,
                  PartNumber: currentAudit.Inventory.Product.PartNumber,
                  ProductCode:
                    currentAudit.Inventory.Product.ProductCode
                      .ProductCodeNumber,
                  Description: currentAudit.Inventory.Product.Description,
                  ProductTier: currentAudit.Inventory.Product.ProductTier,
                  ProductType:
                    currentAudit.Inventory.Product.ProductType.ProductType,
                  ProductTypeDescription:
                    currentAudit.Inventory.Product.ProductType.Description,
                  Velocity: currentAudit.Inventory.Product.Velocity,
                  MICPartNumber: currentAudit.Inventory.Product.MICPartNumber,
                  UOM: currentAudit.Inventory.Product.UOM,
                  Autostore: currentAudit.Inventory.Product.Autostore,
                  PackType: currentAudit.Inventory.Product.PackType,
                  PackQuantity: currentAudit.Inventory.Product.PackQty,
                  Cost: currentAudit.Inventory.Product.Cost,
                  NewDateCode: dateCode,
                }),
              });
            }

            this.data$ = this._eventLog
              .insertLog(userEventLogs, eventLogs)
              .pipe(
                switchMap((res) => {
                  return this._auditService.inventoryUpdate(
                    this.userInfo.userName,
                    sessionStorage.getItem('auditITN'),
                    'Inventory Management Audit',
                    '',
                    dateCode
                  );
                }),
                switchMap((res) => {
                  return this._auditService.deleteAudit(
                    JSON.parse(sessionStorage.getItem('currentAudit'))
                      .InventoryID,
                    30
                  );
                }),
                switchMap((res) => {
                  return this._auditService
                    .nextSubAudit$(
                      JSON.parse(sessionStorage.getItem('currentAudit'))
                        .InventoryID,
                      this.userInfo.userId
                    )
                    .pipe(
                      tap((res) => {
                        if (!res) {
                          const closeUserEventLog = [
                            {
                              UserEventID: sqlData.Event_IM_Audit_Completed,
                              UserName: this.userInfo.userName,
                              DistributionCenter:
                                environment.DistributionCenter,
                              InventoryTrackingNumber:
                                sessionStorage.getItem('auditITN'),
                            },
                          ];

                          const closeEventLog = [
                            {
                              UserName: this.userInfo.userName,
                              EventTypeID: sqlData.Event_IM_Audit_Completed,
                              Log: JSON.stringify({
                                DistributionCenter:
                                  environment.DistributionCenter,
                                InventoryTrackingNumber:
                                  sessionStorage.getItem('auditITN'),
                                ParentITN: currentAudit.Inventory.ParentITN,
                                BinLocation: currentAudit.Container.Barcode,
                                QuantityOnHand: currentAudit.Inventory.Quantity,
                                OriginalQuantity:
                                  currentAudit.Inventory.OriginalQuantity,
                                DateCode: currentAudit.Inventory.DateCode,
                                DateCodeEntered: dateCode,
                                CountryOfOrigin: currentAudit.Inventory.COO,
                                ROHS: currentAudit.Inventory.ROHS,
                                NotFound: currentAudit.Inventory.NotFound,
                                Suspect: currentAudit.Inventory.Suspect,
                                LocatedInAutostore:
                                  currentAudit.Inventory.LocatedInAutostore,
                                BoundForAutostore:
                                  currentAudit.Inventory.BoundForAutostore,
                                PartNumber:
                                  currentAudit.Inventory.Product.PartNumber,
                                ProductCode:
                                  currentAudit.Inventory.Product.ProductCode
                                    .ProductCodeNumber,
                                Description:
                                  currentAudit.Inventory.Product.Description,
                                ProductTier:
                                  currentAudit.Inventory.Product.ProductTier,
                                ProductType:
                                  currentAudit.Inventory.Product.ProductType
                                    .ProductType,
                                ProductTypeDescription:
                                  currentAudit.Inventory.Product.ProductType
                                    .Description,
                                Velocity:
                                  currentAudit.Inventory.Product.Velocity,
                                MICPartNumber:
                                  currentAudit.Inventory.Product.MICPartNumber,
                                UOM: currentAudit.Inventory.Product.UOM,
                                Autostore:
                                  currentAudit.Inventory.Product.Autostore,
                                PackType:
                                  currentAudit.Inventory.Product.PackType,
                                PackQuantity:
                                  currentAudit.Inventory.Product.PackQty,
                                Cost: currentAudit.Inventory.Product.Cost,
                              }),
                            },
                          ];

                          this.close$ = this._eventLog
                            .insertLog(closeUserEventLog, closeEventLog)
                            .pipe(
                              switchMap((res) => {
                                return this._auditService
                                  .closeAudit(
                                    JSON.parse(
                                      sessionStorage.getItem('currentAudit')
                                    ).InventoryID,
                                    10,
                                    JSON.parse(
                                      sessionStorage.getItem('currentAudit')
                                    ).Inventory.ITN,
                                    this.userInfo.userName
                                  )
                                  .pipe(
                                    map((res) => {
                                      this._router.navigate(
                                        ['../verify/scan-itn'],
                                        {
                                          relativeTo: this._actRoute,
                                        }
                                      );

                                      return res;
                                    })
                                  );
                              })
                            );

                          return of(true);
                        } else {
                          this._router.navigate(['../' + res.Route], {
                            relativeTo: this._actRoute,
                          });

                          return res;
                        }
                      })
                    );
                }),
                catchError((error) => {
                  return of({
                    error: { message: error.message, type: 'error' },
                  });
                })
              );

            return of(true);
          }
        })
      );
  }

  onBack(): void {
    this._router.navigate(['../scan-itn'], { relativeTo: this._actRoute });
  }
}
