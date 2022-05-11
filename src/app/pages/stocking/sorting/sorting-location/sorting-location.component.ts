import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  UpdateInventoryAfterSortingGQL,
  VerifyContainerForSortingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { sqlData } from 'src/app/shared/sqlData';
import { environment } from 'src/environments/environment';
import { SortingInfo, StockingService } from '../../stocking.server';

@Component({
  selector: 'sorting-location',
  templateUrl: './sorting-location.component.html',
})
export class SortingLocationComponent implements OnInit {
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  print$ = new Observable();
  submit$ = new Observable();
  locationList = [];
  sortingInfo = {} as SortingInfo;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: StockingService,
    private _verifyContainer: VerifyContainerForSortingGQL,
    private _updateInventory: UpdateInventoryAfterSortingGQL
  ) {
    //
  }

  locationForm = this._fb.group({
    location: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.sortingInfo = this._service.sortingInfo;
    if (!this.sortingInfo) {
      this._router.navigate(['/stocking/sorting']);
    }
  }

  @ViewChild('location') locationInput!: ElementRef;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.locationInput.nativeElement.select();
    }, 10);
  }

  reprint(): void {
    //
  }

  back(): void {
    this._router.navigate(['/stocking']);
  }

  onSubmit(): void {
    if (!this.locationForm.valid || this.isLoading) {
      this.locationInput.nativeElement.select();
      return;
    }
    const barcodeInput = this.locationForm.value.location;
    const Barcode =
      barcodeInput.trim().length === 16
        ? barcodeInput.trim().replace(/-/g, '')
        : barcodeInput.trim();
    this.isLoading = true;
    this.submit$ = this._verifyContainer
      .fetch(
        { Barcode, DistrubutionCenter: environment.DistributionCenter },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (res.data.findContainer.length === 0) {
            throw 'Container not found';
          }
        }),
        switchMap((res) => {
          return this._updateInventory.mutate({
            InventoryID: this.sortingInfo.InventoryID,
            ContainerID: res.data.findContainer[0]._id,
            log: {
              UserID: Number(
                JSON.parse(sessionStorage.getItem('userInfo'))._id
              ),
              UserEventID: sqlData.Event_Stocking_SortingDone,
              InventoryTrackingNumber: this.sortingInfo.ITN,
              Message: `${this.locationForm.value.location.trim()}`,
            },
          });
        }),
        map(() => {
          this.isLoading = false;
          this._router.navigate(['/stocking/sorting'], {
            queryParams: {
              type: 'success',
              message: `${
                this.sortingInfo.ITN
              } place in ${this.locationForm.value.location.trim()}.`,
            },
          });
        }),
        catchError((error) => {
          this.isLoading = false;
          this.alertMessage = error;
          this.locationInput.nativeElement.select();
          return error;
        })
      );
  }
}
