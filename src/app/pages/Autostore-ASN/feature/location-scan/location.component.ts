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
import { FindInventoryByUserGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ASNService } from '../../data/asn.service';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';

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
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="location"
      title="Scan Location:"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <ng-container *ngIf="error">
      <popup-modal (clickSubmit)="onBack()" [message]="error"></popup-modal>
    </ng-container>
  `,
})
export class ASNLocation implements OnInit {
  constructor(
    private _findContainer: VerifyAsnLocationGQL,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _asn: ASNService
  ) {}

  //public inputForm: FormGroup;
  public data$;
  public inputForm = this._fb.nonNullable.group({
    location: ['', [Validators.required]],
  });

  itnList;
  error;
  selectedITN;

  ngOnInit(): void {
    this._actRoute.data.subscribe((data) => {
      if (!data.InventoryTrackingNumber) {
        this.error = 'ITN must be scanned first!';
      } else {
        this.selectedITN = data.InventoryTrackingNumber;
      }
    });
    console.log(this.selectedITN);
    this.data$ = of(true);
  }

  public onSubmit(): void {
    this.itnList = [];

    let containerID: number;
    this.data$ = this._findContainer
      .fetch(
        {
          container: {
            Barcode: this.inputForm.value.location.toString(),
          },
          barcode: this.inputForm.value.location.toString(),
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findContainer) {
            throw new Error("Can't find this Location!");
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

          this.data$ = this._asn
            .moveItnToLocation(this.selectedITN, containerID)
            .pipe(
              map(() => {
                this._router.navigate(['../scan-itn'], {
                  relativeTo: this._actRoute,
                });
              }),
              catchError((error) => {
                return of({
                  error: { message: error.message, type: 'error' },
                });
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
