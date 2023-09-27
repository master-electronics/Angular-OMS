import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import {
  catchError,
  combineLatest,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditInfoComponent } from '../../ui/audit-info.component';
import { AuditService } from '../../data/audit.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import {
  Audit,
  AuditType,
  Inventory,
  Product,
  ProductCode,
} from '../../utils/interfaces';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
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
      *ngIf="counts.length == 0"
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="number"
      controlName="quantity"
      title="Enter Quantity:"
      [isvalid]="this.inputForm.valid"
    >
    </single-input-form>
    <single-input-form
      *ngIf="counts.length == 1"
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="number"
      controlName="quantity"
      title="Confirm Quantity:"
      [isvalid]="this.inputForm.valid"
    >
    </single-input-form>
    <div style="height: 200px;"></div>
    <simple-keyboard
      [inputString]="this.inputForm.value.quantity"
      (outputString)="onChange($event)"
      layout="number"
    ></simple-keyboard>
    <div *ngIf="close$ | async"></div>
  `,
})
export class QuantityAudit implements OnInit {
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
  public inputForm = this._fb.nonNullable.group({
    quantity: ['', [Validators.required]],
  });

  counts: number[] = [];
  auditInfo: Audit;

  ngOnInit(): void {
    if (!sessionStorage.getItem('auditITN')) {
      this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
    }

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
    this.inputForm.patchValue({ quantity: input });
  }

  async onSubmit() {
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    if (this.counts.length == 0) {
      this.counts.push(Number(this.inputForm.value.quantity));
      this.data$ = this._eventLog
        .insertLog(
          [
            {
              UserEventID: sqlData.Event_IM_Quantity_Entered,
              UserName: this.userInfo.userName,
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
              Message: 'Quantity: ' + this.inputForm.value.quantity,
            },
          ],
          [
            {
              UserName: this.userInfo.userName,
              EventTypeID: sqlData.Event_IM_Quantity_Entered,
              Log: JSON.stringify({
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                ParentITN: currentAudit.Inventory.ParentITN,
                BinLocation: currentAudit.Container.Barcode,
                QuantityEntered: this.inputForm.value.quantity,
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
                  currentAudit.Inventory.Product.ProductCode.ProductCodeNumber,
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
          ]
        )
        .pipe(
          catchError((error) => {
            return of({
              error: { message: error.message, type: 'error' },
            });
          })
        );
    } else {
      if (Number(this.inputForm.value.quantity) == this.counts[0]) {
        const quantity = this.inputForm.value.quantity;
        const typeID = Number(this.inputForm.value.quantity) == 0 ? null : 20;

        const userEventLogs = [
          {
            UserEventID: sqlData.Event_IM_Quantity_Confirm_Entered,
            UserName: this.userInfo.userName,
            DistributionCenter: environment.DistributionCenter,
            InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
            Message: 'Quantity: ' + this.inputForm.value.quantity,
          },
        ];

        const eventLogs = [
          {
            UserName: this.userInfo.userName,
            EventTypeID: sqlData.Event_IM_Quantity_Confirm_Entered,
            Log: JSON.stringify({
              DistributionCenter: environment.DistributionCenter,
              InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
              ParentITN: currentAudit.Inventory.ParentITN,
              BinLocation: currentAudit.Container.Barcode,
              QuantityEntered: this.inputForm.value.quantity,
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
                currentAudit.Inventory.Product.ProductCode.ProductCodeNumber,
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
          Number(quantity) !=
          Number(
            JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
              .Quantity
          )
        ) {
          userEventLogs.push({
            UserEventID: sqlData.Event_IM_Quantity_Updated,
            UserName: this.userInfo.userName,
            DistributionCenter: environment.DistributionCenter,
            InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
            Message:
              'Original Quantity: ' +
              JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                .Quantity +
              ' --- New Quantity: ' +
              quantity +
              ' --- Cost: ' +
              JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                .Product.Cost,
          });

          eventLogs.push({
            UserName: this.userInfo.userName,
            EventTypeID: sqlData.Event_IM_Quantity_Updated,
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
                currentAudit.Inventory.Product.ProductCode.ProductCodeNumber,
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
              NewQuantity: quantity,
            }),
          });
        }

        this.data$ = this._eventLog.insertLog(userEventLogs, eventLogs).pipe(
          switchMap((res) => {
            return this._auditService.inventoryUpdate(
              this.userInfo.userName,
              sessionStorage.getItem('auditITN'),
              'Inventory Management Audit',
              quantity
            );
          }),
          switchMap((res) => {
            return this._auditService.deleteAudit(
              JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
              typeID
            );
          }),
          switchMap((res) => {
            return this._auditService
              .nextSubAudit$(
                JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
                this.userInfo.userId
              )
              .pipe(
                tap((res) => {
                  if (!res) {
                    const closeUserEventLog = [
                      {
                        UserEventID: sqlData.Event_IM_Audit_Completed,
                        UserName: this.userInfo.userName,
                        DistributionCenter: environment.DistributionCenter,
                        InventoryTrackingNumber:
                          sessionStorage.getItem('auditITN'),
                      },
                    ];

                    const closeEventLog = [
                      {
                        UserName: this.userInfo.userName,
                        EventTypeID: sqlData.Event_IM_Audit_Completed,
                        Log: JSON.stringify({
                          DistributionCenter: environment.DistributionCenter,
                          InventoryTrackingNumber:
                            sessionStorage.getItem('auditITN'),
                          ParentITN: currentAudit.Inventory.ParentITN,
                          BinLocation: currentAudit.Container.Barcode,
                          QuantityEntered: this.inputForm.value.quantity,
                          QuantityOnHand: currentAudit.Inventory.Quantity,
                          OriginalQuantity:
                            currentAudit.Inventory.OriginalQuantity,
                          DateCode: currentAudit.Inventory.DateCode,
                          CountryOfOrigin: currentAudit.Inventory.COO,
                          ROHS: currentAudit.Inventory.ROHS,
                          NotFound: currentAudit.Inventory.NotFound,
                          Suspect: currentAudit.Inventory.Suspect,
                          LocatedInAutostore:
                            currentAudit.Inventory.LocatedInAutostore,
                          BoundForAutostore:
                            currentAudit.Inventory.BoundForAutostore,
                          PartNumber: currentAudit.Inventory.Product.PartNumber,
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
                          Velocity: currentAudit.Inventory.Product.Velocity,
                          MICPartNumber:
                            currentAudit.Inventory.Product.MICPartNumber,
                          UOM: currentAudit.Inventory.Product.UOM,
                          Autostore: currentAudit.Inventory.Product.Autostore,
                          PackType: currentAudit.Inventory.Product.PackType,
                          PackQuantity: currentAudit.Inventory.Product.PackQty,
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
                              JSON.parse(sessionStorage.getItem('currentAudit'))
                                .InventoryID,
                              10,
                              JSON.parse(sessionStorage.getItem('currentAudit'))
                                .Inventory.ITN,
                              this.userInfo.userName
                            )
                            .pipe(
                              map((res) => {
                                this._router.navigate(['../verify/scan-itn'], {
                                  relativeTo: this._actRoute,
                                });

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
      } else {
        this.counts = [];

        this.data$ = this._eventLog
          .insertLog(
            [
              {
                UserEventID: sqlData.Event_IM_Quantity_Confirm_Entered,
                UserName: this.userInfo.userName,
                DistributionCenter: environment.DistributionCenter,
                InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                Message: 'Quantity: ' + this.inputForm.value.quantity,
              },
            ],
            [
              {
                UserName: this.userInfo.userName,
                EventTypeID: sqlData.Event_IM_Quantity_Confirm_Entered,
                Log: JSON.stringify({
                  DistributionCenter: environment.DistributionCenter,
                  InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
                  ParentITN: currentAudit.Inventory.ParentITN,
                  BinLocation: currentAudit.Container.Barcode,
                  QuantityEntered: this.inputForm.value.quantity,
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
                }),
              },
            ]
          )
          .pipe(
            catchError((error) => {
              return of({
                error: { message: error.message, type: 'error' },
              });
            })
          );
      }
    }
  }

  onBack(): void {
    this._router.navigate(['../scan-itn'], { relativeTo: this._actRoute });
  }
}
