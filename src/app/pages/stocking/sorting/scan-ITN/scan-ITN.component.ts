import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { VerifyItnForSortingGQL } from 'src/app/graphql/stocking.graphql-gen';
import { ITNBarcodeRegex } from 'src/app/shared/dataRegex';
import { CommonService } from 'src/app/shared/services/common.service';
import { StockingService } from '../../stocking.server';

@Component({
  selector: 'scan-ITN',
  templateUrl: './scan-ITN.component.html',
})
export class ScanITNComponent implements OnInit {
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  verify$ = new Observable();
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _commonService: CommonService,
    private _title: Title,
    private _vierfyITN: VerifyItnForSortingGQL,
    private _service: StockingService
  ) {
    this._title.setTitle('Sorting');
    this._commonService.changeNavbar('Sorting');
  }

  @ViewChild('ITN') ITNInput!: ElementRef;
  ITNForm = this._fb.group({
    ITN: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.alertType = this._route.snapshot.queryParams['type'];
    this.alertMessage = this._route.snapshot.queryParams['message'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ITNInput.nativeElement.select();
    }, 10);
  }

  back(): void {
    this._router.navigate(['/stocking']);
  }

  reprint(): void {
    //
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.ITNForm.invalid || this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.verify$ = this._vierfyITN
      .fetch({ ITN: this.ITNForm.value.ITN }, { fetchPolicy: 'network-only' })
      .pipe(
        tap((res) => {
          this.isLoading = false;
          if (res.data.findInventory.length === 0) {
            throw 'ITN not found';
          }
        }),
        map((res) => {
          this._service.changeSortingInfo({
            ITN: this.ITNForm.value.ITN,
            productCode: res.data.findInventory[0].Product.ProductCode,
            partNumber: res.data.findInventory[0].Product.PartNumber,
            QuantityOnHand: res.data.findInventory[0].QuantityOnHand,
            percent: null,
            productType: null,
            velocity: null,
            zone: null,
          });
          this._router.navigate(['/stocking/sorting/location']);
        }),
        catchError((error) => {
          this.alertMessage = error;
          this.ITNInput.nativeElement.select();
          return of(null);
        })
      );
  }
}
