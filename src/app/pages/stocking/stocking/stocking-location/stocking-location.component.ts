import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, pipe } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  FetchSuggetionLocationForSortingGQL,
  UpdateInventoryAfterSortingGQL,
  VerifyContainerForSortingGQL,
  VerifyItnForSortingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/sqlData';
import { environment } from 'src/environments/environment';
import {
  ITNInfo,
  ITNinfoForStocking,
  StockingService,
  SuggetionLocation,
} from '../../stocking.server';

@Component({
  selector: 'stocking-location',
  templateUrl: './stocking-location.component.html',
})
export class StockingLocationComponent implements OnInit {
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  submit$ = new Observable();
  init$ = new Observable();
  locationList = [];
  ITNInfo = {} as ITNInfo;
  currentITN = {} as ITNinfoForStocking;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: StockingService,
    private _verifyContainer: VerifyContainerForSortingGQL,
    private _updateInventory: UpdateInventoryAfterSortingGQL,
    private _fetchSuggetion: FetchSuggetionLocationForSortingGQL,
    private _fetchITN: VerifyItnForSortingGQL,
    private _insertLog: Insert_UserEventLogsGQL
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
    this.currentITN = this._service.currentITN;
    if (!this.currentITN) {
      this._router.navigate(['/stocking/stocking']);
    }
    this.isLoading = true;
    this.init$ = forkJoin({
      ITNInfo: this._fetchITN.fetch(
        { ITN: this.currentITN.ITN, DC: environment.DistributionCenter },
        { fetchPolicy: 'network-only' }
      ),
      locationList: this._fetchSuggetion.fetch(
        { ProductID: this.currentITN.productID, limit: 5 },
        { fetchPolicy: 'network-only' }
      ),
    }).pipe(
      pipe(),
      switchMap((res) => {
        const returnITN = res.ITNInfo.data;
        const suggetionList = res.locationList.data;
        this.ITNInfo = {
          ITN: this.currentITN.ITN,
          productID: returnITN.findInventory[0].Product._id,
          InventoryID: returnITN.findInventory[0]._id,
          productCode:
            returnITN.findInventory[0].Product.ProductCode.ProductCode,
          partNumber: returnITN.findInventory[0].Product.PartNumber,
          QuantityOnHand: returnITN.findInventory[0].QuantityOnHand ?? null,
          remaining: null,
          productType: null,
          velocity:
            returnITN.findInventory[0].Product.DCPRODUCTs[0]?.Velocity ?? null,
          zone: null,
          suggetionLocationList: [],
          OrderNumber:
            returnITN.findInventory[0].ORDERLINEDETAILs[0].Order.OrderNumber,
          NOSINumber:
            returnITN.findInventory[0].ORDERLINEDETAILs[0].Order.NOSINumber,
          OrderLineNumber:
            returnITN.findInventory[0].ORDERLINEDETAILs[0].OrderLine
              .OrderLineNumber,
        };
        suggetionList.findProduct[0].INVENTORies.forEach((inventory) => {
          const element: SuggetionLocation = {
            Quantity: inventory.QuantityOnHand,
            Zone: inventory.Container.Zone,
            Bincode: inventory.Container.Barcode,
          };
          this.ITNInfo.suggetionLocationList.push(element);
        });
        return this._insertLog.mutate({
          log: {
            UserID: Number(JSON.parse(sessionStorage.getItem('userInfo'))._id),
            UserEventID: sqlData.Event_Stocking_StockingLocation_Start,
            OrderNumber:
              returnITN.findInventory[0].ORDERLINEDETAILs[0].Order.OrderNumber,
            NOSINumber:
              returnITN.findInventory[0].ORDERLINEDETAILs[0].Order.NOSINumber,
            OrderLineNumber:
              returnITN.findInventory[0].ORDERLINEDETAILs[0].OrderLine
                .OrderLineNumber,
            InventoryTrackingNumber: this.currentITN.ITN,
            Message: ``,
          },
        });
      }),
      map(() => {
        this.isLoading = false;
        this.locationInput.nativeElement.select();
      }),
      catchError((err) => {
        this.alertType = 'error';
        this.alertMessage = err.message;
        this.isLoading = false;
        this.locationInput.nativeElement.select();
        return of(err);
      })
    );
  }

  @ViewChild('location') locationInput!: ElementRef;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.locationInput.nativeElement.select();
    }, 10);
  }

  back(): void {
    this._router.navigate(['/stocking/stocking']);
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
            InventoryID: this.ITNInfo.InventoryID,
            ContainerID: res.data.findContainer[0]._id,
            log: {
              UserID: Number(
                JSON.parse(sessionStorage.getItem('userInfo'))._id
              ),
              UserEventID: sqlData.Event_Stocking_StockingLocation_Done,
              InventoryTrackingNumber: this.ITNInfo.ITN,
              Message: `${this.locationForm.value.location.trim()}`,
            },
          });
        }),
        map(() => {
          this.isLoading = false;
          const ScanedITNList = this._service.ScanedITNList;
          ScanedITNList.some((ITN) => {
            if (ITN.ITN === this.ITNInfo.ITN) {
              ScanedITNList.push(ITN);
              return true;
            }
            return false;
          });
          this._service.changeScanedITNList(ScanedITNList);
          this._router.navigate(['/stocking/stocking/verify'], {
            queryParams: {
              type: 'success',
              message: `${
                this.ITNInfo.ITN
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
