import { Component, OnInit } from '@angular/core';
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
    <div *ngIf="close$ | async"></div>
  `,
})
export class DateCodeAudit implements OnInit {
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
    dateCode: ['', [Validators.required, Validators.pattern(dateCodeRegex)]],
  });
  public currentInputField;
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

    const userEventLogs = [
      {
        UserEventID: sqlData.Event_IM_DateCode_Entered,
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
        Message: 'Date Code: ' + this.inputForm.value.dateCode,
      },
    ];

    const eventLogs = [
      {
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        EventTypeID: sqlData.Event_IM_DateCode_Entered,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
          DateCode: this.inputForm.value.dateCode,
        }),
      },
    ];

    if (
      dateCode !=
      JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.DateCode
    ) {
      userEventLogs.push({
        UserEventID: sqlData.Event_IM_DateCode_Updated,
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
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
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        EventTypeID: sqlData.Event_IM_DateCode_Updated,
        Log: JSON.stringify({
          DistributionCenter: environment.DistributionCenter,
          InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
          OriginalDateCode: JSON.parse(sessionStorage.getItem('currentAudit'))
            .Inventory.DateCode,
          NewDateCode: dateCode,
        }),
      });
    }

    this.data$ = this._eventLog.insertLog(userEventLogs, eventLogs).pipe(
      switchMap((res) => {
        return this._auditService.inventoryUpdate(
          JSON.parse(sessionStorage.getItem('userInfo')).Name,
          sessionStorage.getItem('auditITN'),
          'Inventory Management Audit',
          '',
          dateCode
        );
      }),
      switchMap((res) => {
        return this._auditService.deleteAudit(
          JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
          30
        );
      }),
      switchMap((res) => {
        return this._auditService
          .nextSubAudit$(
            JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
            Number(JSON.parse(sessionStorage.getItem('userInfo'))._id)
          )
          .pipe(
            tap((res) => {
              if (!res) {
                this.close$ = this._auditService
                  .closeAudit(
                    JSON.parse(sessionStorage.getItem('currentAudit'))
                      .InventoryID,
                    10,
                    JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                      .ITN,
                    JSON.parse(sessionStorage.getItem('userInfo')).Name
                  )
                  .pipe(
                    map((res) => {
                      this._router.navigate(['../verify/scan-itn'], {
                        relativeTo: this._actRoute,
                      });

                      return res;
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
  }

  onBack(): void {
    this._router.navigate(['../scan-itn'], { relativeTo: this._actRoute });
  }
}
