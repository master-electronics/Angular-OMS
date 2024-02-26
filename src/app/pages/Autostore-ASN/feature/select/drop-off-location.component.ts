import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ASNService } from '../../data/asn.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { of, tap, map, catchError, switchMap } from 'rxjs';
import { VerifyAsnLocationDropOffGQL } from 'src/app/graphql/autostoreASN.graphql-gen';
import { PrinterService } from 'src/app/shared/data/printer';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
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
      title="Scan ASN drop-off location:"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <ng-container *ngIf="message">
      <popup-modal (clickSubmit)="onBack()" [message]="message"></popup-modal>
    </ng-container>
    <ng-container *ngIf="zeroList">
      <popup-modal
        [message]="zeroList"
        (clickSubmit)="zeroListOK()"
        [cancelVisible]="cancelVisible"
      ></popup-modal>
    </ng-container>
    <ng-container *ngIf="zeroList">
      <popup-modal
        [message]="zeroList"
        (clickSubmit)="zeroListOK()"
        [cancelVisible]="cancelVisible"
      ></popup-modal>
    </ng-container>
    <div *ngIf="log$ | async"></div>
    <div *ngIf="print$ | async"></div>
  `,
})
export class ASNDropOffLocation implements OnInit {
  constructor(
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _asn: ASNService,
    private _eventLog: EventLogService,
    private _findContainer: VerifyAsnLocationDropOffGQL,
    private _userInfo: StorageUserInfoService,
    private _printer: PrinterService
  ) {}

  public data$;
  public log$;
  public print$;
  public inputForm = this._fb.nonNullable.group({
    location: ['', [Validators.required]],
  });

  message;
  zeroList;
  cancelVisible = false;
  asnID;

  ngOnInit(): void {
    this.data$ = of(true);
    this.asnID = null;
  }

  public onSubmit(): void {
    const asnContainer = JSON.parse(sessionStorage.getItem('asnContainer'));
    this.data$ = this._findContainer
      .fetch(
        {
          container: {
            Barcode: this.inputForm.value.location.toString(),
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          const t = 'test';
          if (!res.data.findContainer) {
            throw new Error("Can't find this Location!");
          }
        }),
        switchMap((dropOffContainer) => {
          return this._asn
            .updateASNParentContainer(
              asnContainer._id,
              dropOffContainer.data.findContainer._id
            )
            .pipe(map((res) => res));
        }),
        switchMap((res) => {
          return this._asn.sendToAutostore$(asnContainer.Barcode).pipe(
            map((res) => {
              let zl = '';
              if (res.ZeroList) {
                res.ZeroList.forEach((itn) => {
                  if (itn) {
                    zl += itn.toString() + '<br />';
                  }
                });
                this.zeroList =
                  'The following ITNs have zero quantity:<br />' + zl;
              }

              if (res.ASNID != '0') {
                this.print$ = this._printer.printQRCode$(res.ASNID.toString());
                this.log$ = this._eventLog.insertLog(
                  [
                    {
                      UserEventID: sqlData.Event_Autostore_ASN_Submitted,
                      UserName: this._userInfo.userName,
                      DistributionCenter: this._userInfo.distributionCenter,
                      Message:
                        'Location: ' +
                        asnContainer.Barcode +
                        ' ASNID: ' +
                        res.ASNID.toString(),
                    },
                  ],
                  [
                    {
                      UserName: this._userInfo.userName,
                      EventTypeID: sqlData.Event_Autostore_ASN_Submitted,
                      Log: JSON.stringify({
                        DistributionCenter: this._userInfo.distributionCenter,
                        Location: asnContainer.Barcode,
                        ASNID: res,
                      }),
                    },
                  ]
                );
              }

              if (res.ASNID) {
                if (res.ASNID != '0') {
                  this.asnID = res.ASNID;
                  this.message = `ASN '${res.ASNID.toString()}' created`;
                }
              }
              sessionStorage.removeItem('asnContainer');
            })
          );
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );

    //this.data$ = of(true);
  }

  onBack(): void {
    this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
  }

  zeroListOK(): void {
    this.zeroList = null;
    if (!this.asnID) {
      this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
    }
  }
}
