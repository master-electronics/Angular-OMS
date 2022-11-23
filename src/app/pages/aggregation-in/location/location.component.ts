import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, Subscription } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import {
  AggregationShelfBarcodeRegex,
  ToteBarcodeRegex,
} from '../../../shared/utils/dataRegex';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { Title } from '@angular/platform-browser';
import {
  CountOrderItnsFromMerpGQL,
  FetchHazardMaterialLevelGQL,
  FetchLocationAndOrderDetailForAgInGQL,
  UpdateAfterAgOutGQL,
  VerifyContainerForAggregationInGQL,
} from 'src/app/graphql/aggregationIn.graphql-gen';
import {
  AggregationInService,
  endContainer,
  outsetContainer,
} from '../aggregation-in.server';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnInit, OnDestroy, AfterViewInit {
  // varable for query
  private OrderNumber: string;
  private NOSINumber: string;
  private OrderLineNumber: number;
  private FileKeyListforAgIn = [];
  // control html element
  outsetContainer: outsetContainer;
  initInfo$: Observable<boolean>;
  verifyContainer$: Observable<boolean>;
  isLoading = false;
  newLocation = false;
  buttonLabel = 'Relocate';
  locationList: string[];
  ITNInfo = [];
  alertMessage = '';
  alertType = 'error';
  isLastLine = false;

  regex(input: UntypedFormControl): { regex: { valid: boolean } } {
    return AggregationShelfBarcodeRegex.test(input.value) ||
      ToteBarcodeRegex.test(input.value) ||
      input.value === ''
      ? null
      : {
          regex: {
            valid: false,
          },
        };
  }

  locationForm = this._fb.group({
    location: ['', [Validators.required, this.regex]],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.locationForm.controls;
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private _fb: UntypedFormBuilder,
    private _commonService: CommonService,
    private _titleService: Title,
    private _router: Router,
    private _fetchLocation: FetchLocationAndOrderDetailForAgInGQL,
    private _updateAfterAgOut: UpdateAfterAgOutGQL,
    private _fetchHazard: FetchHazardMaterialLevelGQL,
    private _verifyContainer: VerifyContainerForAggregationInGQL,
    private _countOrderItns: CountOrderItnsFromMerpGQL,
    private _agInService: AggregationInService
  ) {
    this._titleService.setTitle('agin/location');
  }

  @ViewChild('location') locationInput: ElementRef;
  ngOnInit(): void {
    this.outsetContainer = this._agInService.outsetContainer;
    if (!this.outsetContainer) {
      this._router.navigate(['agin']);
      return;
    }
    this._agInService.changeEndContainer(null);
    this._commonService.changeNavbar(`AGIN: ${this.outsetContainer.Barcode}`);
    // fetch location and orderlinedetail
    this.isLoading = true;
    const FileKeyListforAgOut = [];
    const ProductList = [];
    let singleITN = '';
    this.initInfo$ = this._fetchLocation
      .fetch(
        { OrderID: this.outsetContainer.OrderID },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        // if the order is singleLine order Auto ag out, else complete Observable
        filter((res) => {
          const locationsSet: Set<string> = new Set();
          let totalLines = 0;
          let countLines = 0;
          res.data.findOrderLineDetails.forEach((line) => {
            ++totalLines;
            if (line.Inventory) {
              // set for other queries
              singleITN = line.Inventory.InventoryTrackingNumber;
              this.OrderNumber = this.outsetContainer.OrderNumber;
              this.NOSINumber = this.outsetContainer.NOSINumber;
              FileKeyListforAgOut.push(
                `${environment.DistributionCenter}${this.OrderNumber}${this.NOSINumber}${this.outsetContainer.ITNsInTote[0].OrderLineNumber}ag             ${line.Inventory.InventoryTrackingNumber}`
              );
              // store locations in Aggregation area.
              if (line.Inventory.Container.Row === 'AG') {
                locationsSet.add(
                  line.Inventory.Container.Warehouse.concat(
                    line.Inventory.Container.Row,
                    line.Inventory.Container.Aisle,
                    line.Inventory.Container.Section,
                    line.Inventory.Container.Shelf,
                    line.Inventory.Container.ShelfDetail,
                    line.Inventory.Container.Barcode
                  )
                );
              }

              const toteIndex = this.outsetContainer.ITNsInTote.findIndex(
                (element) => line._id === element.detaileID
              );
              if (toteIndex >= 0) {
                this.ITNInfo = [
                  ['Order#', this.OrderNumber],
                  ['Priority', !this.outsetContainer.Priority ? 'Yes' : 'No'],
                  ['Customer', this.outsetContainer.CustomerNumber],
                  ['Quantity', line.Quantity],
                  ['ITN Count', ''],
                  [
                    'PRC',
                    this.outsetContainer.ITNsInTote[toteIndex].ProductCode,
                  ],
                  [
                    'PartNumber',
                    this.outsetContainer.ITNsInTote[toteIndex].PartNumber,
                  ],
                  ['Shipment', this.outsetContainer.ShipmentMethodDescription],
                ];
                // set fikekey for ag in
                this.FileKeyListforAgIn.push(
                  `${environment.DistributionCenter}${this.OrderNumber}${this.NOSINumber}${this.outsetContainer.ITNsInTote[toteIndex].OrderLineNumber}ag             ${line.Inventory.InventoryTrackingNumber}`
                );
                // set for single line AG out.
                ProductList.push(
                  `${this.outsetContainer.ITNsInTote[
                    toteIndex
                  ].ProductCode.padEnd(3)}${
                    this.outsetContainer.ITNsInTote[toteIndex].PartNumber
                  }`
                );
                // count currentLines without check statusID
                ++countLines;
                return;
              }
              line.StatusID >= sqlData.agInComplete_ID && ++countLines;
            }
          });
          this.ITNInfo[4][1] = `${countLines} of ${totalLines}`;
          if (locationsSet.size === 0) {
            this.newLocation = true;
            this.buttonLabel = 'New Location';
          }
          if (this.outsetContainer.isRelocation) {
            this.newLocation = true;
            this.buttonLabel = 'Relocate';
            this.ITNInfo = [];
          }
          this.isLastLine = countLines === totalLines;
          this.locationList = [...locationsSet];
          if (totalLines === 1) {
            return true;
          }
          // if not single Line ITN stop here.
          this.isLoading = false;
          return false;
        }),
        // fetch ITN count from Merp
        switchMap(() => {
          return this._countOrderItns.fetch(
            {
              LocationCode: environment.DistributionCenter,
              OrderNumber: this.OrderNumber,
              NOSINumber: this.NOSINumber,
            },
            { fetchPolicy: 'network-only' }
          );
        }),
        // filter if the merp count ITN is not 1
        filter((res) => {
          if (res.data.countOrderItns === 1) {
            return true;
          }
          this.isLoading = false;
          return false;
        }),

        // swith to ag out update observeable If this is single Line ITN
        switchMap(() => {
          return forkJoin({
            updateOrder: this._updateAfterAgOut.mutate({
              OrderID: Number(this.outsetContainer.OrderID),
              OrderLineDetail: { StatusID: sqlData.agOutComplete_ID },
              DistributionCenter: environment.DistributionCenter,
              // toteList: [this.outsetContainer.Barcode],
              log: [
                {
                  UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
                  OrderNumber: this.OrderNumber,
                  NOSINumber: this.NOSINumber,
                  InventoryTrackingNumber: singleITN,
                  UserEventID: sqlData.Event_AgIn_SingleITNAgOut,
                  Message: `Single ITN Ag out ${this.outsetContainer.Barcode}`,
                  CustomerNumber: this.outsetContainer.CustomerNumber,
                  CustomerTier: this.outsetContainer.CustomerTier,
                  DistributionCenter: environment.DistributionCenter,
                  OrderLineNumber:
                    this.outsetContainer.ITNsInTote[0].OrderLineNumber,
                  PartNumber: this.outsetContainer.ITNsInTote[0].PartNumber,
                  ProductCode: this.outsetContainer.ITNsInTote[0].ProductCode,
                  ProductTier: this.outsetContainer.ITNsInTote[0].ProductTier,
                  Quantity: this.outsetContainer.ITNsInTote[0].Quantity,
                  ParentITN: this.outsetContainer.ITNsInTote[0].ParentITN,
                  ShipmentMethod: this.outsetContainer.ShipmentMethod,
                  ShipmentMethodDescription:
                    this.outsetContainer.ShipmentMethodDescription,
                  Priority: this.outsetContainer.Priority,
                  WMSPriority: this.outsetContainer.ITNsInTote[0].WMSPriority,
                },
              ],
              OrderNumber: this.OrderNumber,
              NOSINumber: this.NOSINumber,
              UserOrStatus: 'Packing',
              MerpStatus: String(sqlData.agOutComplete_ID),
              FileKeyList: FileKeyListforAgOut,
              ActionType: 'A',
              Action: 'line_aggregation_out',
            }),
            checkHazmzd: this._fetchHazard.fetch(
              { ProductList: ProductList },
              { fetchPolicy: 'network-only' }
            ),
          });
        }),

        // Emite errors
        // tap((res) => {
        // let error = '';
        // if (!res.updateOrder.data.updateMerpOrderStatus.success) {
        //   error += res.updateOrder.data.updateMerpOrderStatus.message;
        // }
        // if (error) throw error;
        // }),

        // Back to first page after ag out success
        map((res) => {
          let type = 'success';
          let message = `Order complete ${this.OrderNumber}-${this.NOSINumber}`;
          if (
            res.checkHazmzd.data.fetchProductInfoFromMerp.some(
              (node) =>
                /^[\w]+$/.test(node.HazardMaterialLevel.trim()) &&
                node.HazardMaterialLevel.trim() !== 'N'
            )
          ) {
            type = 'warning';
            message = message + `\nThis order contains hazardous materials`;
          }

          // return the first step
          this._router.navigate(['agin'], {
            queryParams: {
              type,
              message,
            },
          });
          this.isLoading = false;
          return true;
        }),

        catchError((error) => {
          this.alertMessage = error;
          this.isLoading = false;
          this.locationInput.nativeElement.select();
          return of(false);
        })
      );
  }

  ngAfterViewInit(): void {
    this.locationInput.nativeElement.focus();
  }

  toggleNewLocation(): void {
    this.newLocation = true;
    this.buttonLabel = `New Location`;
    this.locationInput.nativeElement.select();
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.locationForm.valid || this.isLoading) {
      return;
    }
    const barcodeInput = this.f.location.value;
    const Barcode =
      barcodeInput.length === 8 ? barcodeInput : barcodeInput.replace(/-/g, '');
    const type = barcodeInput.length === 8 ? 'tote' : 'shelf';
    if (this.outsetContainer.Barcode === Barcode) {
      this.alertMessage = 'Should scan a new Container';
      this.alertType = 'warning';
      this.locationInput.nativeElement.select();
      return;
    }
    if (!this.newLocation && Barcode.length > 8) {
      const inList = this.locationList.some((location) => {
        return location.substring(0, 11) === Barcode;
      });
      if (!inList) {
        this.alertMessage = 'This container is a new location';
        this.alertType = 'error';
        this.locationInput.nativeElement.select();
        return;
      }
    }

    // if pass all verifercation jump to verify page
    this.isLoading = true;
    this.verifyContainer$ = this._verifyContainer
      .fetch(
        {
          Barcode: Barcode,
          DistributionCenter: environment.DistributionCenter,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        // Emite Errors
        map((res) => {
          const container = res.data.findContainer;
          if (!container) {
            throw 'Can not find this container';
          }
          if (
            ![sqlData.toteType_ID, sqlData.shelfType_ID].includes(
              container.ContainerTypeID
            )
          ) {
            throw 'This container should be tote or shelf';
          }
          if (container.Row !== 'AG') {
            throw 'This container is not in Aggregation area';
          }
          // When the order is hold, the record still in Invenotry table, but the record in the OrderLineDetail is deleted. Need to exclude this situation.
          const ITNList = res.data.findContainer.INVENTORies.filter((item) => {
            return item.ORDERLINEDETAILs.length !== 0;
          });
          // if target container is mobile, check all items in target container have the some order number with source tote.
          if (container.ContainerType.IsMobile) {
            ITNList.forEach((line) => {
              // check if the item in container
              if (
                line.ORDERLINEDETAILs[0].OrderID !==
                this.outsetContainer.OrderID
              ) {
                throw 'This container has other order in it.';
              }
            });
          }
          return container;
        }),
        map((container) => {
          const endContainer: endContainer = {
            Barcode: barcodeInput,
            type,
            isLastLine: this.isLastLine,
            location: {
              Warehouse: container.Warehouse,
              Row: container.Row,
              Aisle: container.Aisle,
              Section: container.Section,
              Shelf: container.Shelf,
              ShelfDetail: container.ShelfDetail,
            },
            OrderNumber: this.OrderNumber,
            NOSINumber: this.NOSINumber,
            containerID: container._id,
            FileKeyListforAgIn: this.FileKeyListforAgIn,
          };
          this._agInService.changeEndContainer(endContainer);
          this._router.navigate(['agin/verifytote']);
          return true;
        }),

        catchError((error) => {
          this.alertMessage = error;
          this.isLoading = false;
          this.locationInput.nativeElement.select();
          return of(false);
        })
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
