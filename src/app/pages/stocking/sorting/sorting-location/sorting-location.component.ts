import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  FetchSuggetionLocationForSortingGQL,
  UpdateInventoryAfterSortingGQL,
  VerifyContainerForSortingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { sqlData } from 'src/app/shared/sqlData';
import { environment } from 'src/environments/environment';
import {
  SortingInfo,
  StockingService,
  SuggetionLocation,
} from '../../stocking.server';

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
  init$ = new Observable();
  locationList = [];
  sortingInfo = {} as SortingInfo;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: StockingService,
    private _verifyContainer: VerifyContainerForSortingGQL,
    private _updateInventory: UpdateInventoryAfterSortingGQL,
    private _fetchLocation: FetchSuggetionLocationForSortingGQL
  ) {
    //
  }

  locationForm = this._fb.group({
    location: [
      '',
      [Validators.required, Validators.maxLength(20), Validators.minLength(4)],
    ],
  });

  ngOnInit(): void {
    this.sortingInfo = this._service.sortingInfo;
    if (!this.sortingInfo) {
      this._router.navigate(['/stocking/sorting']);
    }
    this.init$ = this._fetchLocation
      .fetch({ ProductID: this.sortingInfo.productID, limit: 5 })
      .pipe(
        map((res) => {
          res.data.findProduct[0].INVENTORies.forEach((inventory) => {
            const element: SuggetionLocation = {
              Quantity: inventory.QuantityOnHand,
              Zone: inventory.Container.Zone,
              Bincode: inventory.Container.Barcode,
            };
            this.sortingInfo.suggetionLocationList.push(element);
          });
        })
      );
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
          if (!res.data.findContainer[0].ContainerType.IsMobile) {
            throw new Error('This container is not a mobile container');
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
