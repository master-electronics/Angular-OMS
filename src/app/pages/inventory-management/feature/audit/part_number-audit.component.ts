import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { SingleRadioFormComponent } from 'src/app/shared/ui/input/single-radio-form.component';
import {
  combineLatest,
  of,
  tap,
  map,
  catchError,
  pipe,
  forkJoin,
  switchMap,
} from 'rxjs';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormsModule,
  FormControl,
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
import { Audit } from '../../utils/interfaces';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { LoaderButtonComponent } from 'src/app/shared/ui/button/loader-button.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    SingleRadioFormComponent,
    ReactiveFormsModule,
    PopupModalComponent,
    NzModalModule,
    NzGridModule,
    FormsModule,
    AuditInfoComponent,
    NormalButtonComponent,
    SubmitButtonComponent,
    NzRadioModule,
    LoaderButtonComponent,
    MessageBarComponent,
    SimpleKeyboardComponent,
  ],
  template: `
    <ng-container *ngIf="auditInfo">
      <audit-info [auditInfo]="auditInfo"></audit-info>
    </ng-container>
    <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <div class="text-base sm:text-lg md:mx-16 md:text-2xl lg:text-4xl">
        <div class="gap-2 md:grid" [class.flex]="title.length < 10">
          <label class="mb-0.5 font-bold text-gray-700" [for]="controlName">
            {{ title }}
          </label>
          <div style="height: 10px"></div>
          <div class="relative grow" style="text-align: center;">
            <nz-radio-group
              [(ngModel)]="radioValue"
              [formControlName]="controlName"
              [id]="controlName"
              [ngClass]="[
                inputForm.get(controlName).invalid &&
                inputForm.get(controlName).dirty
                  ? 'border-red-500'
                  : 'border-blue-500'
              ]"
              nzSize="large"
              nzButtonStyle="solid"
              (ngModelChange)="onPartMatchChange()"
            >
              <label
                *ngFor="let option of options"
                nz-radio-button
                nzValue="{{ option.value }}"
                style="margin-left: 35px; margin-right: 35px;"
              >
                {{ option.label }}
              </label>
            </nz-radio-group>
            <!-- error mesage -->
            <div
              *ngIf="
                inputForm.get(controlName).invalid &&
                  inputForm.get(controlName).dirty;
                else NonError
              "
              class="italic text-red-500"
            >
              <div *ngIf="inputForm.get(controlName).errors?.['required']">
                This field is required.
              </div>
              <div *ngIf="inputForm.get(controlName).errors?.['pattern']">
                Invalid Format!
              </div>
              <div *ngFor="let validator of validators">
                <div
                  *ngIf="inputForm.get(controlName).errors?.[validator.name]"
                >
                  {{ validator.message }}
                </div>
              </div>
            </div>
            <ng-template #NonError>
              <div class="opacity-0 ">no error</div>
            </ng-template>
          </div>
        </div>
        <div class="gap-2 md:grid">
          <div class="relative grow">
            <textarea
              formControlName="comment"
              [ngClass]="[
                inputForm.get('comment').invalid &&
                inputForm.get('comment').dirty
                  ? 'border-red-500'
                  : 'border-blue-500'
              ]"
              class="focus:shadow-outline h-fit w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none md:text-2xl lg:text-4xl"
              id="comment"
              type="text"
              autocomplete="off"
              placeholder="Comment"
              (focus)="onInputFocus($event)"
              #input
            ></textarea>
          </div>
        </div>
        <div class="gap-2 md:grid">
          <div class="relative grow">
            <input
              formControlName="partNumber"
              [ngClass]="[
                inputForm.get('comment').invalid &&
                inputForm.get('comment').dirty
                  ? 'border-red-500'
                  : 'border-blue-500'
              ]"
              class="focus:shadow-outline h-fit w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none md:text-2xl lg:text-4xl"
              id="partNumber"
              type="text"
              autocomplete="off"
              placeholder="Part #"
              (focus)="onInputFocus($event)"
              #input
            />
          </div>
        </div>
        <div class="opacity-0 ">no error</div>
        <!-- Button area -->
        <div
          class="grid h-12 w-full grid-cols-3 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
        >
          <submit-button [disabled]="!this.inputForm.valid"> </submit-button>
          <ng-template #buttonLoading>
            <loader-button></loader-button>
          </ng-template>
          <normal-button
            class="col-start-3"
            (buttonClick)="onBack()"
          ></normal-button>
        </div>
        <div *ngIf="data$ | async" class="mt-1 md:mt-3 lg:mt-6">
          <message-bar
            [message]="data$.message"
            [name]="data$.name"
          ></message-bar>
        </div>
      </div>
    </form>
    <div style="height: 200px;"></div>
    <simple-keyboard
      *ngIf="activeControl == 'comment'"
      [inputString]="this.commentInputString"
      (outputString)="onChange($event)"
      layout="string"
    ></simple-keyboard>
    <simple-keyboard
      *ngIf="activeControl == 'partNumber'"
      [inputString]="this.partNumberInputString"
      (outputString)="onChange($event)"
      layout="string"
    ></simple-keyboard>
    <!--
    <single-radio-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="partNumber"
      title="Part Match:"
      [options]="options"
      [isvalid]="this.inputForm.valid"
    >
    </single-radio-form>
    
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="string"
      controlName="partNumber"
      title="Enter Part Number:"
      [isvalid]="this.inputForm.valid"
    >
    </single-input-form>
-->
    <div *ngIf="close$ | async"></div>
  `,
})
export class PartNumberAudit implements OnInit {
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
    partMatch: ['', [Validators.required]],
    comment: [''],
    partNumber: [''],
  });
  auditInfo: Audit;

  options = [
    {
      label: 'Yes',
      value: 'match',
    },
    {
      label: 'No',
      value: 'noMatch',
    },
  ];

  title = 'Part Match:';
  isvalid;
  controlName = 'partMatch';
  radioValue;
  validators = [{ name: '', message: '' }];
  activeControl = 'comment';
  currentInputField = this.inputForm.get('fieldcomment');
  commentInputString;
  partNumberInputString;

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
            MICPartNumber: currentAudit.Inventory.Product.MICPartNumber,
            ProductCode: {
              ProductCodeNumber:
                currentAudit.Inventory.Product.ProductCode.ProductCodeNumber,
            },
          },
        },
      };
    }
  }

  onPartMatchChange() {
    const partMatch = <FormControl>this.inputForm.get('partMatch');
    const comment = <FormControl>this.inputForm.get('comment');

    if (partMatch.value == 'noMatch') {
      comment.setValidators([Validators.required, Validators.minLength(10)]);
    } else {
      comment.setValidators(null);
    }

    comment.updateValueAndValidity();
  }

  onChange(input: string) {
    if (this.activeControl == 'comment') {
      this.inputForm.patchValue({ comment: input });
    } else {
      this.inputForm.patchValue({ partNumber: input });
    }
  }

  onInputFocus(event) {
    this.activeControl = event.target.id;
    this.onChange('');
  }

  async onSubmit() {
    const partMatch = this.inputForm.value.partMatch;
    const partNumber = this.inputForm.value.partNumber;
    const comment = this.inputForm.value.comment;
    const currentAudit: Audit = JSON.parse(
      sessionStorage.getItem('currentAudit')
    );

    const userEventLogs = [
      {
        UserEventID: sqlData.Event_IM_PartNumber_Entered,
        UserName: this.userInfo.userName,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
        Message: 'Part Number: ' + this.inputForm.value.partMatch,
      },
    ];

    const eventLogs = [
      {
        UserName: this.userInfo.userName,
        EventTypeID: sqlData.Event_IM_PartNumber_Entered,
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
          PartNumberEntered: partNumber,
          ProductCode:
            currentAudit.Inventory.Product.ProductCode.ProductCodeNumber,
          Description: currentAudit.Inventory.Product.Description,
          ProductTier: currentAudit.Inventory.Product.ProductTier,
          ProductType: currentAudit.Inventory.Product.ProductType.ProductType,
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
      partMatch.trim() !=
      JSON.parse(
        sessionStorage.getItem('currentAudit')
      ).Inventory.Product.PartNumber.trim()
    ) {
      userEventLogs.push({
        UserEventID: sqlData.Event_IM_PartNumber_Updated,
        UserName: this.userInfo.userName,
        DistributionCenter: environment.DistributionCenter,
        InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
        Message:
          'Original Part Number: ' +
          JSON.parse(sessionStorage.getItem('currentAudit')).Inventory.Product
            .PartNumber +
          ' --- New Part Number: ' +
          partMatch,
      });

      eventLogs.push({
        UserName: this.userInfo.userName,
        EventTypeID: sqlData.Event_IM_PartNumber_Updated,
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
          ProductType: currentAudit.Inventory.Product.ProductType.ProductType,
          ProductTypeDescription:
            currentAudit.Inventory.Product.ProductType.Description,
          Velocity: currentAudit.Inventory.Product.Velocity,
          MICPartNumber: currentAudit.Inventory.Product.MICPartNumber,
          UOM: currentAudit.Inventory.Product.UOM,
          Autostore: currentAudit.Inventory.Product.Autostore,
          PackType: currentAudit.Inventory.Product.PackType,
          PackQuantity: currentAudit.Inventory.Product.PackQty,
          Cost: currentAudit.Inventory.Product.Cost,
          NewPartNumber: partNumber,
        }),
      });
    }

    this.data$ = this._eventLog.insertLog(userEventLogs, eventLogs).pipe(
      switchMap((res) => {
        if (
          JSON.parse(
            sessionStorage.getItem('currentAudit')
          ).Inventory.Product.PartNumber.trim() != partMatch.trim()
        ) {
          const currentAudit = JSON.parse(
            sessionStorage.getItem('currentAudit')
          );

          currentAudit.Inventory.IMSuspect = 'Y';

          sessionStorage.setItem('currentAudit', JSON.stringify(currentAudit));

          const PartData = [
            {
              InventoryID: JSON.parse(sessionStorage.getItem('currentAudit'))
                .InventoryID,
              Reason: `Expected Part Number: 
                  ${
                    JSON.parse(sessionStorage.getItem('currentAudit')).Inventory
                      .Product.PartNumber
                  }
                   found Part Number: ${partNumber}`,
              Comment: comment,
            },
          ];
          return this._auditService.insertSuspect(PartData);
        }

        return of(res);
      }),
      switchMap((res) => {
        return this._auditService.deleteAudit(
          JSON.parse(sessionStorage.getItem('currentAudit')).InventoryID,
          60
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
                    InventoryTrackingNumber: sessionStorage.getItem('auditITN'),
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
                      QuantityOnHand: currentAudit.Inventory.Quantity,
                      OriginalQuantity: currentAudit.Inventory.OriginalQuantity,
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
                      PartNumberEntered: partNumber,
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
  }

  onBack() {
    this._router.navigate(['../scan-itn'], { relativeTo: this._actRoute });
  }
}
