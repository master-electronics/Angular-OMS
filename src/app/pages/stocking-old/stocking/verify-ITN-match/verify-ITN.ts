import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { StockingService } from '../../stocking.server';

@Component({
  selector: 'verify-ITN',
  templateUrl: './verify-ITN.html',
})
export class VerifyITNMatchComponent implements OnInit {
  stage = '';
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  ITNCount = this._service.ITNListInContainer.length;
  ScanedITNNumber: number;
  verify$ = new Observable();
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _insertLog: Insert_UserEventLogsGQL,
    private _service: StockingService
  ) {
    //
  }

  @ViewChild('ITNinput') ITNInput!: ElementRef;
  inputForm = this._fb.group({
    ITNInput: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    if (!this._service.ITNListInContainer.length) {
      this._router.navigate(['/stocking/stocking']);
    }
    this.ScanedITNNumber = this._service.ScanedITNList.length + 1;
  }

  done(): void {
    this._router.navigate(['/stocking/stocking']);
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.inputForm.get('ITNInput').valid || this.isLoading) {
      this.ITNInput.nativeElement.select();
      return;
    }
    // find then ITN input in the ITNListiinContainer, if exist jump to location input, if not, show error
    if (
      this._service.ITNListInContainer.some((iterator) => {
        if (iterator.ITN === this.inputForm.value.ITNInput) {
          this._service.changeCurrentITN(iterator);
          return true;
        }
        return false;
      })
    ) {
      this._router.navigate(['/stocking/stocking/location']);
      return;
    }
    this.alertMessage = 'ITN not found';
    this.ITNInput.nativeElement.select();
  }
}
