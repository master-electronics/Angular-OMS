import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { VerifyAsnLocationGQL } from 'src/app/graphql/autostoreASN.graphql-gen';
import { catchError, combineLatest, map, Observable, of, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ASNService } from '../../data/asn.service';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    PopupModalComponent,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="location"
      title="Scan Location:"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <ng-container *ngIf="error">
      <popup-modal (clickSubmit)="onBack()" [message]="error"></popup-modal>
    </ng-container>
    <div *ngIf="log$ | async"></div>
  `,
})
export class ASNLocation implements OnInit {
  constructor(
    private _findContainer: VerifyAsnLocationGQL,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _asn: ASNService,
    private _eventLog: EventLogService,
    private _userInfo: StorageUserInfoService
  ) {}

  //public inputForm: FormGroup;
  public data$;
  public log$;
  public inputForm = this._fb.nonNullable.group({
    location: ['', [Validators.required]],
  });

  itnList;
  error;
  selectedITN;

  ngOnInit(): void {
    if (!sessionStorage.getItem('asn-itn')) {
      this.error = 'ITN must be scanned first!';
    } else {
      this.selectedITN = sessionStorage.getItem('asn-itn');
    }

    this.data$ = of(true);
  }

  public onSubmit(): void {
    const barcode = this.inputForm.value.location.toString();
    this.itnList = [];

    let containerID: number;
    this.data$ = this._findContainer
      .fetch(
        {
          container: {
            Barcode: this.inputForm.value.location.toString(),
          },
          barcode: this.inputForm.value.location.toString(),
          statusList: ['Open', 'Closed', 'CANCELLED'],
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findContainer) {
            throw new Error("Can't find this Location!");
          }

          if (res.data.verifyASNLocationNotInProcess.length > 0) {
            throw new Error('ASN for this location In Process');
          }

          containerID = res.data.findContainer._id;
        }),
        map((res) => res.data.verifyASNLocation),
        map((res) => {
          res.map((itn) => {
            this.itnList.push(itn.InventoryTrackingNumber);
          });

          if (this.itnList.length > 0) {
            throw new Error('Location has ITNs not bound for Autostore');
          }

          this.log$ = this._eventLog.insertLog(
            [
              {
                UserEventID: sqlData.Event_Autostore_ASN_Location_Scanned,
                UserName: this._userInfo.userName,
                DistributionCenter: this._userInfo.distributionCenter,
                InventoryTrackingNumber: this.selectedITN,
                Message: 'Location: ' + barcode,
              },
            ],
            [
              {
                UserName: this._userInfo.userName,
                EventTypeID: sqlData.Event_Autostore_ASN_Location_Scanned,
                Log: JSON.stringify({
                  DistributionCenter: this._userInfo.distributionCenter,
                  InventoryTrackingNumber: this.selectedITN,
                  Location: barcode,
                }),
              },
            ]
          );

          this.data$ = combineLatest({
            location: this._asn
              .moveItnToLocation(
                this.selectedITN,
                containerID,
                this._userInfo.userName,
                barcode
              )
              .pipe(
                map(() => {
                  this._router.navigate(['../scan-itn'], {
                    relativeTo: this._actRoute,
                  });
                }),
                catchError((error) => {
                  this.error = error;
                  return of({
                    error: { message: error.message, type: 'error' },
                  });
                })
              ),
            status: this._asn.updateASNReplenishmentItem(
              Number(
                JSON.parse(sessionStorage.getItem('asnReplenishmentItem'))._id
              ),
              'In-process'
            ),
            // delete: this._asn.deleteASNReplenishmentItem(
            //   Number(
            //     JSON.parse(sessionStorage.getItem('asnReplenishmentItem'))._id
            //   )
            // ),
          });

          sessionStorage.removeItem('asnReplenishmentItem');
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
