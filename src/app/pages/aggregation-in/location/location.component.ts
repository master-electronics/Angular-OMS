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
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subscription } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import {
  AggregationShelfBarcodeRegex,
  ToteBarcodeRegex,
} from '../../../shared/dataRegex';
import { map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import {
  FetchHazardMaterialLevelGQL,
  FetchLocationAndOrderDetailForAgInGQL,
  UpdateAfterAgOutGQL,
} from 'src/app/graphql/aggregationIn.graphql-gen';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnInit, OnDestroy, AfterViewInit {
  // varable for query
  urlParams;
  OrderNumber: string;
  NOSINumber: string;
  FileKeyList = [];
  ProductList = [];
  isLastLine = false;
  locationsSet: Set<string> = new Set();
  // control html element
  isLoading = false;
  isRelocation = false;
  newLocation = false;
  buttonLabel = 'place to the shelf';
  location$: Observable<string[]>;
  ITNInfo = [];
  message = '';
  messageType = 'error';

  regex(input: FormControl): { regex: { valid: boolean } } {
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

  locationForm = this.fb.group({
    location: ['', [Validators.required, this.regex]],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.locationForm.controls;
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private fetchLocation: FetchLocationAndOrderDetailForAgInGQL,
    private updateAfterAgOut: UpdateAfterAgOutGQL,
    private fetchHazard: FetchHazardMaterialLevelGQL
  ) {}

  @ViewChild('location') locationInput: ElementRef;
  ngOnInit(): void {
    this.urlParams = { ...this.route.snapshot.queryParams };
    this.titleService.setTitle('agin/location');
    this.commonService.changeNavbar(`AGIN: ${this.urlParams.Barcode}`);
    this.isRelocation = this.urlParams.isRelocation === 'true';
    this.isRelocation && (this.buttonLabel = 'Relocate');
    // fetch location and orderlinedetail
    this.isLoading = true;
    this.location$ = this.fetchLocation
      .fetch(
        { OrderLineDetail: { OrderID: Number(this.urlParams.OrderID) } },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          let location = [];
          let totalLines = 0;
          let countLines = 0;
          res.data.findOrderLineDetail.forEach((line) => {
            ++totalLines;
            // set for other queries
            this.OrderNumber = line.Order.OrderNumber;
            this.NOSINumber = line.Order.NOSINumber;
            this.FileKeyList.push(
              `${environment.DistributionCenter}${line.Order.OrderNumber}${line.Order.NOSINumber}${line.OrderLine.OrderLineNumber}ag             ${line.InternalTrackingNumber}`
            );
            // set for locations
            if (line._id === Number(this.urlParams.orderLineDetailID)) {
              this.ITNInfo = [
                ['Order#', line.Order.OrderNumber],
                [
                  'Priority',
                  !line.Order.ShipmentMethod.PriorityPinkPaper ? 'Yes' : 'No',
                ],
                ['Customer', line.Order.CustomerNumber],
                ['Quantity', line.Quantity],
                ['ITN Count', ''],
                ['PRC', line.OrderLine.ProductCode],
                ['PartNumber', line.OrderLine.PartNumber],
                ['Shipment', line.Order.ShipmentMethod.ShippingMethod],
              ];
              // set for single line AG out.
              this.ProductList.push(
                `${line.OrderLine.ProductCode.padEnd(3)}${
                  line.OrderLine.PartNumber
                }`
              );
              // count currentLines without check statusID
              ++countLines;
              return;
            }
            line.StatusID === environment.agInComplete_ID && ++countLines;
          });
          this.ITNInfo[4][1] = `${countLines} of ${totalLines}`;
          if (this.isRelocation) {
            location = [];
          }
          if (totalLines === 1) {
            this.singleITNorder(Number(this.urlParams.OrderID));
            return null;
          }
          this.isLoading = false;
          return location;
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
    this.message = '';
    if (!this.locationForm.valid) {
      return;
    }
    if (this.urlParams.Barcode === this.f.location.value) {
      this.message = 'Should scan a new location';
      this.messageType = 'warning';
      this.locationInput.nativeElement.select();
      return;
    }
    const barcodeInput = this.f.location.value;
    const barcode =
      barcodeInput.length === 8 ? barcodeInput : barcodeInput.replace(/-/g, '');
    this.isLoading = true;
  }

  // relocateAggregationLocation(barcode: string): void {
  //   this.RelocateAggregationLocation.mutate(
  //     {
  //       qcContainer: this.qcContainer,
  //       ITNList: this.ITNList,
  //       Barcode: barcode,
  //       DistributionCenter: DistributionCenter,
  //       newLocation: this.newLocation,
  //       isLastITN: this.isLastITN,
  //       LocationList: this.locationList,
  //     },
  //     { fetchPolicy: 'no-cache' }
  //   ).subscribe((res) => {
  //     if (res.data.aggregationIn.success) {
  //       const result = 'info';
  //       const message = `Place in ${barcode}.`;
  //       this.router.navigate(['agin'], {
  //         queryParams: {
  //           result,
  //           message,
  //         },
  //       });
  //     } else {
  //       this.message = res.data.aggregationIn.message;
  //       this.locationInput.nativeElement.select();
  //     }
  //     this.isLoading = false;
  //   }),
  //     (error) => {
  //       this.message = error;
  //       this.locationInput.nativeElement.select();
  //       this.isLoading = false;
  //     };
  // }

  // putOnAggregationShelf(barcode: string, fileKey: string): void {
  //   this.PutOnAggregationShelf.mutate(
  //     {
  //       qcContainer: this.qcContainer,
  //       ITNList: this.ITNList,
  //       Barcode: barcode,
  //       DistributionCenter: DistributionCenter,
  //       newLocation: this.newLocation,
  //       isLastITN: this.isLastITN,
  //       LocationList: this.locationList,
  //       FileKeyList: [fileKey],
  //       ActionType: 'A',
  //       Action: 'line_aggregation_in',
  //       Inventory: { StatusID: AGInDone },
  //     },
  //     { fetchPolicy: 'no-cache' }
  //   ).subscribe((res) => {
  //     if (
  //       res.data.aggregationIn.success &&
  //       res.data.updateInventoryList.success
  //     ) {
  //       const result = 'info';
  //       const message = `Place in ${barcode}.`;
  //       this.router.navigate(['agin'], {
  //         queryParams: {
  //           result,
  //           message,
  //         },
  //       });
  //     } else {
  //       this.message = `${res.data.aggregationIn.message}`;
  //       this.locationInput.nativeElement.select();
  //     }
  //     this.isLoading = false;
  //   }),
  //     (error) => {
  //       this.message = error;
  //       this.locationInput.nativeElement.select();
  //       this.isLoading = false;
  //     };
  // }

  // updateLastLineOfOrder(barcode: string, fileKey: string): void {
  //   this.UpdateLastLineOfOrder.mutate(
  //     {
  //       qcContainer: this.qcContainer,
  //       ITNList: this.ITNList,
  //       Barcode: barcode,
  //       DistributionCenter: DistributionCenter,
  //       newLocation: this.newLocation,
  //       isLastITN: this.isLastITN,
  //       LocationList: this.locationList,
  //       FileKeyList: [fileKey],
  //       ActionType: 'A',
  //       Action: 'line_aggregation_in',
  //       OrderNumber: this.ITNInfo[0].value,
  //       NOSINumber: this.NOSINumber,
  //       Status: StatusForMerpStatusAfterAgIn,
  //       UserOrStatus: 'AGGREGATION-OUT',
  //       Inventory: { StatusID: AGInDone },
  //     },
  //     { fetchPolicy: 'no-cache' }
  //   ).subscribe((res) => {
  //     if (
  //       res.data.aggregationIn.success &&
  //       res.data.updateInventoryList.success
  //     ) {
  //       const result = 'info';
  //       const message = `Place in ${barcode}.\nOrder ${this.ITNInfo[0].value}-${this.NOSINumber} complete AG In.`;
  //       this.router.navigate(['agin'], {
  //         queryParams: {
  //           result,
  //           message,
  //         },
  //       });
  //     } else {
  //       this.message = res.data.aggregationIn.message;
  //       this.locationInput.nativeElement.select();
  //     }
  //     this.isLoading = false;
  //   }),
  //     (error) => {
  //       this.message = error;
  //       this.locationInput.nativeElement.select();
  //       this.isLoading = false;
  //     };
  // }

  // fetchInfo(): void {
  //   this.isLoading = true;
  //   this.subscription.add(
  //     this.fetchInventoryInfoGQL
  //       .watch(
  //         {
  //           InternalTrackingNumber: this.ITNList[0],
  //           DistributionCenter: DistributionCenter,
  //         },
  //         { fetchPolicy: 'no-cache' }
  //       )
  //       .valueChanges.subscribe(
  //         (result) => {
  //           this.isLoading = result.loading;
  //           result.error && (this.message = result.error.message);
  //           const data = result.data.fetchInventoryInfo;
  //           this.orderLineNumber = data.OrderLineNumber;
  //           this.NOSINumber = data.NOSINumber;
  //           this.ITNInfo[0].value = data.OrderNumber;
  //           this.ITNInfo[1].value =
  //             data.PriorityPinkPaper === '1' ? 'Yes' : 'No';
  //           this.ITNInfo[2].value = data.CustomerNumber;
  //           this.ITNInfo[3].value = `${data.Quantity}`;
  //           this.ITNInfo[4].value = `${data.ITNCount} of ${data.ITNTotal}`;
  //           this.ITNInfo[5].value = data.ProductCode;
  //           this.ITNInfo[6].value = data.PartNumber;
  //           this.ITNInfo[7].value = data.ShippingMethod;
  //           this.isLastITN = data.ITNCount === data.ITNTotal;
  //           this.locationList = data.Locations;
  //           // if the order is single ITN order skip location step.
  //           if (data.ITNTotal === 1) {
  //             this.singleITNorder(data.orderId);
  //             return;
  //           }
  //           // auto select new location when ITNCount is 1 or less.
  //           if (data.ITNCount < 2) {
  //             this.newLocation = true;
  //             if (!this.isRelocation) this.buttonLabel = `New Location`;
  //           } else {
  //             data.Locations.slice(0)
  //               .reverse()
  //               .map((element) => {
  //                 if (element) {
  //                   // use && to check if the first part is ture.
  //                   this.locationsSet.size < 3 &&
  //                     this.locationsSet.add(element);
  //                 }
  //               });
  //             if (this.locationsSet.size !== 0) {
  //               this.locations = [...this.locationsSet];
  //             }
  //           }
  //         },
  //         (error) => {
  //           this.message = error;
  //           this.isLoading = false;
  //         }
  //       )
  //   );
  // }

  singleITNorder(OrderID: number): void {
    this.isLoading = true;
    this.subscription.add(
      forkJoin({
        updateOrder: this.updateAfterAgOut.mutate(
          {
            OrderID,
            OrderLineDetail: { StatusID: environment.agOutComplete_ID },
            DistributionCenter: environment.DistributionCenter,
            OrderNumber: this.OrderNumber,
            NOSINumber: this.NOSINumber,
            UserOrStatus: 'Packing',
            MerpStatus: String(environment.agOutComplete_ID),
            FileKeyList: this.FileKeyList,
            ActionType: 'A',
            Action: 'line_aggregation_out',
          },
          { fetchPolicy: 'network-only' }
        ),
        checkHazmzd: this.fetchHazard.fetch(
          { ProductList: this.ProductList },
          { fetchPolicy: 'network-only' }
        ),
      })
        .pipe(
          tap((res) => {
            //
            if (!res.updateOrder.data.updateOrderLineDetail[0]) {
              throw 'Update SQL OrderLineDetail failed.';
            }
            if (!res.updateOrder.data.updateMerpOrderStatus.success) {
              throw res.updateOrder.data.updateMerpOrderStatus.message;
            }
          })
        )
        .subscribe(
          (res) => {
            let result = 'success';
            let message = `Order complete ${this.OrderNumber}-${this.NOSINumber}`;
            if (
              res.checkHazmzd.data.fetchProductInfoFromMerp.some(
                (node) =>
                  /^[\w]+$/.test(node.HazardMaterialLevel.trim()) &&
                  node.HazardMaterialLevel.trim() !== 'N'
              )
            ) {
              result = 'warning';
              message = message + `\nThis order contains hazardous materials`;
            }
            this.router.navigate(['agin'], {
              queryParams: {
                result,
                message,
              },
            });
            this.isLoading = false;
          },
          (error) => {
            this.message = error;
            this.isLoading = false;
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
