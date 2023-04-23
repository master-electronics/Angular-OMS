import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { VerifyAsnLocationGQL } from 'src/app/graphql/autostoreASN.graphql-gen';
import { environment } from 'src/environments/environment';
import { catchError, map, of, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ASNService } from '../../data/asn.service';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { PrinterService } from 'src/app/shared/data/printer';

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
      title="Scan ASN Location:"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <ng-container *ngIf="message">
      <popup-modal (clickSubmit)="onOk()" [message]="message"></popup-modal>
    </ng-container>
    <div *ngIf="log$ | async"></div>
    <div *ngIf="print$ | async"></div>
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
    private _printer: PrinterService
  ) {}

  public data$;
  public log$;
  public print$;
  public inputForm = this._fb.nonNullable.group({
    location: ['', [Validators.required]],
  });

  itnList;
  message;

  ngOnInit(): void {
    this.data$ = of(true);
  }

  public onSubmit(): void {
    this.data$ = this._asn
      .findContainer(this.inputForm.value.location.toString())
      .pipe(
        map((res) => {
          if (res.data.findContainer) {
            const asnContainer = {
              _id: res.data.findContainer._id,
              Barcode: res.data.findContainer.Barcode,
            };

            sessionStorage.setItem(
              'asnContainer',
              JSON.stringify(asnContainer)
            );

            this._router.navigate(['../../drop-off/scan-location'], {
              relativeTo: this._actRoute,
            });
          }
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
    // this.data$ = this._asn
    //   .sendToAutostore$(this.inputForm.value.location.toString())
    //   .pipe(
    //     map((res) => {
    //       this.print$ = this._printer.printQRCode$(res.toString());
    //       this.log$ = this._eventLog.insertLog(
    //         [
    //           {
    //             UserEventID: sqlData.Event_Autostore_ASN_Submitted,
    //             UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
    //             DistributionCenter: environment.DistributionCenter,
    //             Message:
    //               'Location: ' +
    //               this.inputForm.value.location.toString() +
    //               ' ASNID: ' +
    //               res,
    //           },
    //         ],
    //         [
    //           {
    //             UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
    //             EventTypeID: sqlData.Event_Autostore_ASN_Submitted,
    //             Log: JSON.stringify({
    //               DistributionCenter: environment.DistributionCenter,
    //               Location: this.inputForm.value.location.toString(),
    //               ASNID: res,
    //             }),
    //           },
    //         ]
    //       );

    //       this.message = `ASN '${res}' created`;
    //       return res;
    //     }),
    //     catchError((error) => {
    //       return of({
    //         error: { message: error.message, type: 'error' },
    //       });
    //     })
    //   );
  }

  onOk() {
    this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
  }

  onBack() {
    this._router.navigate(['../../menu'], { relativeTo: this._actRoute });
  }
}
