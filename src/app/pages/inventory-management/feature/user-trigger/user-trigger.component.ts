import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FetchAuditTypesGQL } from 'src/app/graphql/inventoryManagement.graphql-gen';
import {
  VerifyAuditLocationGQL,
  FindProductCodeGQL,
  FindImProductGQL,
  FindImInventoryGQL,
  FindImInventoriesGQL,
  InsertAuditsGQL,
  FindImprcInventoriesGQL,
  FindImprcPartNumberInventoriesGQL,
  ValidateFilterGQL,
} from 'src/app/graphql/inventoryManagement.graphql-gen';
import {
  Observable,
  catchError,
  combineLatest,
  forkJoin,
  lastValueFrom,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuditService } from '../../data/audit.service';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    MessageBarComponent,
    PopupModalComponent,
    NzButtonModule,
  ],
  template: `
    <div *ngIf="data$ | async"></div>
    <div class="flexContainer">
      <div class="title">Select Audit Types</div>
    </div>
    <div class="flexContainer">
      <div class="container">
        <select multiple [(ngModel)]="selectedTypes" size="8">
          <option *ngFor="let type of auditTypeList" [ngValue]="type">
            {{ type.name }}
          </option>
        </select>
      </div>
      <div>
        <div>
          <div>
            <span
              nz-icon
              nzType="right"
              nzTheme="outline"
              class="button"
              (click)="includeSelected()"
            ></span>
          </div>
          <div>
            <span
              nz-icon
              nzType="vertical-left"
              nzTheme="outline"
              class="button"
              (click)="includeAll()"
            ></span>
          </div>
          <div>
            <span
              nz-icon
              nzType="left"
              nzTheme="outline"
              class="button"
              (click)="removeSelected()"
            ></span>
          </div>
          <div>
            <span
              nz-icon
              nzType="vertical-right"
              nzTheme="outline"
              class="button"
              (click)="removeAll()"
            ></span>
          </div>
        </div>
      </div>
      <div class="container">
        <select multiple [(ngModel)]="selectedRemoveTypes" size="8">
          <option
            *ngFor="let type of includedAuditTypeList"
            [ngValue]="type"
            [disabled]="type.disabled"
          >
            {{ type.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="flexContainer">
      <div class="title">Select Filter</div>
      <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
        <div class="flexContainer">
          <div class="inputBox">
            <input
              nz-input
              placeholder="ITN"
              nzSize="large"
              formControlName="itn"
            />
          </div>
          <div class="inputBox">
            <input
              nz-input
              placeholder="Location"
              nzSize="large"
              formControlName="location"
            />
          </div>
          <div class="inputBox">
            <input
              nz-input
              placeholder="End Location"
              nzSize="large"
              formControlName="endLocation"
            />
          </div>
          <div class="inputBox">
            <input
              nz-input
              placeholder="PRC"
              nzSize="large"
              formControlName="prc"
            />
          </div>
          <div class="inputBox">
            <input
              nz-input
              placeholder="Part Number"
              nzSize="large"
              formControlName="partNumber"
            />
          </div>
        </div>
      </form>
    </div>
    <div class="flexContainer">
      <div class="buttonContainer">
        <button
          nz-button
          type="submit"
          nzType="primary"
          nzSize="large"
          class="w-full"
          (click)="onSubmit()"
        >
          Submit
        </button>
      </div>
      <div class="buttonContainer">
        <button
          nz-button
          type="default"
          nzSize="large"
          class="backButton w-full"
          (click)="onBack()"
        >
          Back
        </button>
      </div>
    </div>
    <div class="flexContainer">
      <div *ngIf="error" class="alertContainer">
        <message-bar [message]="error.message" [name]="errorType"></message-bar>
      </div>
    </div>
    <ng-container *ngIf="message">
      <popup-modal
        [message]="message"
        (clickSubmit)="onOk()"
        (clickCancel)="onCancel()"
      ></popup-modal>
    </ng-container>
    <div class="clear"></div>
    <div *ngIf="suspect$ | async"></div>
  `,
  styleUrls: ['./user-trigger.component.css'],
})
export class UserTrigger {
  userInfo = inject(StorageUserInfoService);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fetchAuditTypes: FetchAuditTypesGQL,
    private _findITN: FindImInventoryGQL,
    private _findLocation: VerifyAuditLocationGQL,
    private _findProductCode: FindProductCodeGQL,
    private _findProduct: FindImProductGQL,
    private _findITNs: FindImInventoriesGQL,
    private _insertAudits: InsertAuditsGQL,
    private _findPRCITNs: FindImprcInventoriesGQL,
    private _findPRCPartNumITNs: FindImprcPartNumberInventoriesGQL,
    private _validateFilter: ValidateFilterGQL,
    private _fb: FormBuilder,
    private _auditService: AuditService
  ) {}

  inputForm: FormGroup;

  data$;
  suspect$;
  submit$;
  selectedTypes;
  selectedRemoveTypes;
  auditTypeList = [];
  includedAuditTypeList = [
    {
      name: 'Location',
      value: 10,
      disabled: true,
    },
  ];
  location;
  error;
  errorType;
  prcID;
  message;
  filterType;
  inventoryID;
  locationITNList;
  prcITNList;
  itnList;

  ngOnInit(): void {
    this.data$ = this._fetchAuditTypes
      .fetch({}, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          res.data.fetchAuditTypes.forEach((type) => {
            if (type.Type != 'Location') {
              this.auditTypeList.push({
                name: type.Type,
                value: type._id,
                disabled: type.Type == 'Location',
              });
            }
          });
        })
      );

    this.inputForm = this._fb.group({
      itn: [
        {
          value: null,
          disabled: false,
        },
      ],
      location: [
        {
          value: null,
          disabled: false,
        },
      ],
      endLocation: [
        {
          value: null,
          disabled: false,
        },
      ],
      prc: [
        {
          value: null,
          disabled: false,
        },
      ],
      partNumber: [
        {
          value: null,
          disabled: false,
        },
      ],
    });

    this.onChanges();
  }

  onChanges(): void {
    this.inputForm.get('itn').valueChanges.subscribe((val) => {
      if (val) {
        this.inputForm
          .get('location')
          .disable({ onlySelf: true, emitEvent: false });
        this.inputForm
          .get('endLocation')
          .disable({ onlySelf: true, emitEvent: false });
        this.inputForm.get('prc').disable({ onlySelf: true, emitEvent: false });
        this.inputForm
          .get('partNumber')
          .disable({ onlySelf: true, emitEvent: false });
      } else {
        this.inputForm
          .get('location')
          .enable({ onlySelf: true, emitEvent: false });
        this.inputForm
          .get('endLocation')
          .enable({ onlySelf: true, emitEvent: false });
        this.inputForm.get('prc').enable({ onlySelf: true, emitEvent: false });
        this.inputForm
          .get('partNumber')
          .enable({ onlySelf: true, emitEvent: false });
      }
    });

    this.inputForm.get('location').valueChanges.subscribe((val) => {
      if (val) {
        this.inputForm.get('itn').disable({ onlySelf: true, emitEvent: false });
      } else {
        this.inputForm.get('itn').enable({ onlySelf: true, emitEvent: false });
      }
    });

    this.inputForm.get('endLocation').valueChanges.subscribe((val) => {
      if (val) {
        this.inputForm.get('itn').disable({ onlySelf: true, emitEvent: false });
      } else {
        this.inputForm.get('itn').enable({ onlySelf: true, emitEvent: false });
      }
    });

    this.inputForm.get('prc').valueChanges.subscribe((val) => {
      if (val || this.inputForm.value.partNumber) {
        this.inputForm.get('itn').disable({ onlySelf: true, emitEvent: false });
      } else {
        this.inputForm.get('itn').enable({ onlySelf: true, emitEvent: false });
      }
    });

    this.inputForm.get('partNumber').valueChanges.subscribe((val) => {
      if (val || this.inputForm.value.prc) {
        this.inputForm.get('itn').disable({ onlySelf: true, emitEvent: false });
      } else {
        this.inputForm.get('itn').enable({ onlySelf: true, emitEvent: false });
      }
    });
  }

  onSubmit() {
    this.error = null;
    this.errorType = null;

    if (
      !this.inputForm.value.itn &&
      !this.inputForm.value.location &&
      !this.inputForm.value.endLocation &&
      !this.inputForm.value.prc &&
      !this.inputForm.value.partNumber
    ) {
      this.error = { message: 'Select Filter!' };
      return;
    }

    const itn =
      this.inputForm.value.itn != '' ? this.inputForm.value.itn : null;
    const loc =
      this.inputForm.value.location != ''
        ? this.inputForm.value.location
        : null;

    const endLoc =
      this.inputForm.value.endLocation != ''
        ? this.inputForm.value.endLocation
        : null;

    const prc =
      this.inputForm.value.prc != '' ? this.inputForm.value.prc : null;

    const partNum =
      this.inputForm.value.partNumber != ''
        ? this.inputForm.value.partNumber
        : null;

    this.data$ = this._validateFilter
      .fetch({
        itn: itn,
        locationStart: loc,
        locationEnd: endLoc,
        prc: prc,
        partNumber: partNum,
      })
      .pipe(
        tap((res) => {
          if (!res.data.validateFilter) {
            throw new Error('errored');
          }
        }),
        map(() => {
          this.displayAuditCount();
          return true;
        }),
        catchError((error) => {
          const msg = error.message
            .toString()
            .substring(
              error.message.toString().indexOf('"') + 1,
              error.message
                .toString()
                .indexOf('"', error.message.toString().indexOf('"') + 1)
            );
          this.error = { message: msg };
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }

  onBack() {
    this.router.navigate(['../menu'], { relativeTo: this.route });
  }

  displayAuditCount(): void {
    this.itnList = [];

    this.data$ = this._findITNs
      .fetch(
        {
          itn: this.inputForm.value.itn ? this.inputForm.value.itn : null,
          barcodeStart: this.inputForm.value.location
            ? this.inputForm.value.location.toString()
            : null,
          barcodeEnd: this.inputForm.value.endLocation
            ? this.inputForm.value.endLocation.toString()
            : null,
          prc: this.inputForm.value.prc
            ? this.inputForm.value.prc.toString()
            : null,
          partNumber: this.inputForm.value.partNumber
            ? this.inputForm.value.partNumber.toString()
            : null,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          res.data.findIMInventories.forEach((inventory) => {
            this.itnList.push({
              _id: Number(inventory._id),
              ITN: inventory.InventoryTrackingNumber,
              oldID: inventory.oldID,
            });
          });

          const skipped = this.itnList.filter((itn) => itn.oldID);
          const included = this.itnList.filter((itn) => !itn.oldID);

          this.itnList = included;

          this.message = `${included.length} audit${
            res.data.findIMInventories.length > 1 ? 's' : ''
          } will be created.`;

          if (skipped) {
            this.message += `<br /><br />`;

            if (skipped.length >= 3) {
              this.message += `${skipped.length} ITNs will not have audits created because they have active picks.`;
            } else if (skipped.length != 0) {
              this.message +=
                'The following ITNs will not have audits created because they have active picks:<br />';

              skipped.forEach((itn) => {
                this.message += `
                ${itn.ITN}<br />`;
              });
            }
          }
        }),
        catchError((error) => {
          return of(false);
        })
      );
  }

  onOk(): void {
    const audits = [];
    const suspects = [];
    this.itnList.forEach((item) => {
      suspects.push(
        this._auditService.inventoryUpdate(
          this.userInfo.userName,
          item.ITN,
          'Inventory Management Audit',
          '',
          '',
          '',
          '',
          'true'
        )
      );

      this.includedAuditTypeList.forEach((type) => {
        audits.push({
          TypeID: Number(type.value),
          InventoryID: Number(item._id),
          LastUpdated: new Date(Date.now()).toISOString(),
          CreatedDatetime: new Date(Date.now()).toISOString(),
        });
      });
    });

    this.suspect$ = forkJoin(suspects);

    this.data$ = this._insertAudits
      .mutate({
        audits: audits,
      })
      .pipe(
        tap(() => {
          this.errorType = 'success';
          this.error = { message: 'Audits created!' };
          this.removeAll();
          this.inputForm.reset();
          return of(true);
        }),
        catchError((error) => {
          this.errorType = 'error';
          this.error = { message: error.message };

          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );

    this.message = null;
  }

  onCancel(): void {
    this.itnList = null;
    this.message = null;
  }

  includeSelected(): void {
    this.selectedTypes.forEach((type) => {
      const exists = this.includedAuditTypeList.find((item) => item == type);

      if (!exists) {
        this.includedAuditTypeList.push(type);
        const index = this.auditTypeList.indexOf(type);
        this.auditTypeList.splice(index, 1);
      }
    });

    this.includedAuditTypeList.sort((a, b) => {
      if (Number(a.value) < Number(b.value)) {
        return -1;
      }

      if (Number(a.value) == Number(b.value)) {
        return 0;
      }

      return 1;
    });
  }

  includeAll(): void {
    this.auditTypeList.forEach((type) => {
      const exists = this.includedAuditTypeList.find((item) => item == type);

      if (!exists) {
        this.includedAuditTypeList.push(type);
      }
    });

    this.includedAuditTypeList.sort((a, b) => {
      if (Number(a.value) < Number(b.value)) {
        return -1;
      }

      if (Number(a.value) == Number(b.value)) {
        return 0;
      }

      return 1;
    });

    this.auditTypeList.splice(0, this.auditTypeList.length);
  }

  removeSelected(): void {
    this.selectedRemoveTypes.forEach((type) => {
      const exists = this.auditTypeList.find((item) => item == type);

      if (!exists) {
        this.auditTypeList.push(type);
        const index = this.includedAuditTypeList.indexOf(type);
        this.includedAuditTypeList.splice(index, 1);
      }
    });

    this.auditTypeList.sort((a, b) => {
      if (Number(a.value) < Number(b.value)) {
        return -1;
      }

      if (Number(a.value) == Number(b.value)) {
        return 0;
      }

      return 1;
    });
  }

  removeAll(): void {
    this.includedAuditTypeList.forEach((type) => {
      if (type.name != 'Location') {
        const exists = this.auditTypeList.find((item) => item == type);

        if (!exists) {
          this.auditTypeList.push(type);
        }
      }
    });

    this.auditTypeList.sort((a, b) => {
      if (Number(a.value) < Number(b.value)) {
        return -1;
      }

      if (Number(a.value) == Number(b.value)) {
        return 0;
      }

      return 1;
    });

    this.includedAuditTypeList.splice(1, this.includedAuditTypeList.length);
  }
}
