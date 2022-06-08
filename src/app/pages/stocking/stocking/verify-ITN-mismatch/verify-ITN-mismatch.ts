import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { ITNBarcodeRegex } from 'src/app/shared/dataRegex';
import { ITNinfoForStocking, StockingService } from '../../stocking.server';

@Component({
  selector: 'verify-ITN-mismatch',
  templateUrl: './verify-ITN-mismatch.html',
})
export class VerifyITNMismatchComponent implements OnInit {
  stage = '';
  isLoading = false;
  message = '';
  alertType = 'error';
  alertMessage = '';
  ITNList: ITNinfoForStocking[] = [];
  verifiedList: ITNinfoForStocking[] = [];
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
    this.stage = 'verify';
    if (!this._service.ITNListInContainer.length) {
      this._router.navigate(['/stocking/stocking']);
    }
    this.ITNList = this._service.ITNListInContainer;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ITNInput.nativeElement.select();
    }, 10);
  }

  Done(): void {
    if (this.ITNList.length) {
      this.stage = 'noFound';
      this.message = `You are about to declare ${this.ITNList.length} ITNs as not found?`;
    } else {
      this.stage = 'locationEmpty';
    }
  }

  yes(): void {
    //
  }

  no(): void {
    //
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.inputForm.get('barcode').valid || this.isLoading) {
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
