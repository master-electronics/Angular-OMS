import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  MoveInventoryToContainerForStockingGQL,
  UpdateNotFoundForStockingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { ITNBarcodeRegex } from 'src/app/shared/dataRegex';
import { sqlData } from 'src/app/shared/sqlData';
import { environment } from 'src/environments/environment';
import { ITNinfoForStocking, StockingService } from '../../stocking.server';

@Component({
  selector: 'verify-ITN-mismatch',
  templateUrl: './verify-ITN-mismatch.html',
})
export class VerifyITNMismatchComponent implements OnInit {
  stage = '';
  isLoading = false;
  message = '';
  alertType = 'warning';
  alertMessage = '';
  ITNList: ITNinfoForStocking[] = [];
  verifiedList: ITNinfoForStocking[] = [];
  submit$ = new Observable();
  notFound$ = new Observable();
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _moveITN: MoveInventoryToContainerForStockingGQL,
    private _insertLog: Insert_UserEventLogsGQL,
    private _noFound: UpdateNotFoundForStockingGQL,
    private _service: StockingService
  ) {}

  @ViewChild('ITNInput') ITNInput!: ElementRef;
  inputForm = this._fb.group({
    ITNInput: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.stage = 'verify';
    if (!this._service.ITNListInContainer.length) {
      this._router.navigate(['/stocking/stocking']);
    }
    this.ITNList = [...this._service.ITNListInContainer];
  }

  done(): void {
    if (this.ITNList.length) {
      this.stage = 'noFound';
      this.message = `You are about to declare ${this.ITNList.length} ITNs as not found?`;
      return;
    }
    this._router.navigate(['/stocking/stocking/verify']);
  }

  yes(): void {
    this.isLoading = true;
    const ITNList = this.ITNList.map((iterator) => iterator.ITN);
    const log = ITNList.map((iterator) => ({
      UserID: Number(JSON.parse(sessionStorage.getItem('userInfo'))._id),
      UserEventID: sqlData.Event_Stocking_NotFound,
      InventoryTrackingNumber: iterator,
      Message: ``,
    }));
    this.notFound$ = this._noFound
      .mutate({
        log,
        ITNList,
        DC: environment.DistributionCenter,
      })
      .pipe(
        map(() => {
          this.isLoading = false;
          // remove not found ITN from the ITNListInContainer
          this.ITNList.forEach((iterator) => {
            const tmp = this._service.ITNListInContainer.filter(
              (res) => iterator.ITN !== res.ITN
            );
            this._service.changeITNListInContainer(tmp);
          });
          // If still ITN in the contianer continue to verify, otherwise go to starter stage
          if (this._service.ITNListInContainer.length) {
            this._router.navigate(['/stocking/stocking/verify']);
            return;
          }
          this._router.navigate(['/stocking/stocking']);
        }),
        catchError((err) => {
          this.alertType = 'error';
          this.alertMessage = err.message;
          this.isLoading = false;
          this.ITNInput.nativeElement.select();
          return of(err);
        })
      );
  }

  no(): void {
    this.stage = 'verify';
  }

  onSubmit(): void {
    if (!this.inputForm.get('ITNInput').valid || this.isLoading) {
      this.ITNInput.nativeElement.select();
      return;
    }
    // find then ITN input in the ITNListiinContainer, if exist jump to location input, if not, show error
    let target: number;
    if (
      this.ITNList.some((iterator, index) => {
        if (iterator.ITN === this.inputForm.value.ITNInput) {
          target = index;
          return true;
        }
        return false;
      })
    ) {
      this.ITNList.splice(target, 1);
      this.submit$ = this._insertLog.mutate({
        log: {
          UserID: Number(JSON.parse(sessionStorage.getItem('userInfo'))._id),
          UserEventID: sqlData.Event_Stocking_Stocking_verifyITN,
          InventoryTrackingNumber: this.inputForm.value.ITNInput,
          Message: ``,
        },
      });
      this.alertType = 'success';
      this.alertMessage = `ITN ${this.inputForm.value.ITNInput} is found.`;
      this.inputForm.reset();
      this.ITNInput.nativeElement.select();
      return;
    } else {
      // if ITN is not found, move this ITN to the user's contianer
      if (
        this._service.ITNListInContainer.some(
          (iterator) => iterator.ITN === this.inputForm.value.ITNInput
        )
      ) {
        this.alertType = 'success';
        this.alertMessage = `ITN ${this.inputForm.value.ITNInput} is found.`;
        this.inputForm.reset();
        return;
      }
      this.isLoading = true;
      this.submit$ = this._moveITN
        .mutate({
          ITN: this.inputForm.value.ITNInput,
          DC: environment.DistributionCenter,
          ContainerID: this._service.userContainerID,
        })
        .pipe(
          switchMap(() => {
            return this._insertLog.mutate({
              log: {
                UserID: Number(
                  JSON.parse(sessionStorage.getItem('userInfo'))._id
                ),
                UserEventID: sqlData.Event_Stocking_Stocking_MoveITNToUser,
                InventoryTrackingNumber: this.inputForm.value.ITNInput,
                Message: ``,
              },
            });
          }),
          map(() => {
            this.alertMessage = 'ITN not found, move it to your container.';
            this.ITNInput.nativeElement.select();
            this.isLoading = false;
          }),
          catchError((err) => {
            this.alertType = 'error';
            this.alertMessage = err.message;
            this.isLoading = false;
            this.ITNInput.nativeElement.select();
            return of(err);
          })
        );
    }
  }
}
