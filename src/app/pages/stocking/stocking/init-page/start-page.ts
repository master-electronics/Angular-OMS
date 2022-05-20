import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { VerifyItnForSortingGQL } from 'src/app/graphql/stocking.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { ITNBarcodeRegex } from 'src/app/shared/dataRegex';
import { CommonService } from 'src/app/shared/services/common.service';
import { sqlData } from 'src/app/shared/sqlData';
import { StockingService } from '../../stocking.server';

@Component({
  selector: 'init-page',
  templateUrl: './init-page.component.html',
})
export class InitPageComponent implements OnInit {
  isLoading = false;
  stage = 'scanBarcode';
  alertType = 'error';
  alertMessage = '';
  count: number;
  inputLabel = 'Scan Location or ITN';
  verify$ = new Observable();
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _commonService: CommonService,
    private _title: Title,
    private _vierfyITN: VerifyItnForSortingGQL,
    private _insertLog: Insert_UserEventLogsGQL,
    private _service: StockingService
  ) {
    this._title.setTitle('Sorting');
    this._commonService.changeNavbar('Sorting');
  }

  @ViewChild('barcode') barcodeInput!: ElementRef;
  barcodeForm = this._fb.group({
    barcode: ['', [Validators.required, this.regex]],
  });
  regex(input: FormControl): { regex: { valid: boolean } } {
    return ITNBarcodeRegex.test(input.value) || input.value === ''
      ? null
      : {
          regex: {
            valid: false,
          },
        };
  }

  ngOnInit(): void {
    this.alertType = this._route.snapshot.queryParams['type'];
    this.alertMessage = this._route.snapshot.queryParams['message'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.barcodeInput.nativeElement.select();
    }, 10);
  }

  back(): void {
    this._router.navigate(['/stocking']);
  }

  onSubmit(): void {
    this.alertMessage = '';
    this.isLoading = true;
    if (this.stage === 'scanBarcode') {
      this.scanBarcode();
      return;
    }
    if (this.stage === 'ITNCount') {
      this.isLoading = true;
      return;
    }
  }

  scanBarcode(): void {
    //
  }
}
