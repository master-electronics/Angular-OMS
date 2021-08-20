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
import { forkJoin, Subscription, throwError } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import {
  FetchInventoryInfoGQL,
  RelocateAggregationLocationGQL,
  PutOnAggregationShelfGQL,
  UpdateLastLineOfOrderGQL,
} from '../../../graphql/aggregation.graphql-gen';
import {
  AggregationShelfBarcodeRegex,
  ToteBarcodeRegex,
} from '../../../shared/dataRegex';
import {
  FetchHazardMaterialLevelGQL,
  UpdateOrderAfterAgOutGQL,
} from 'src/app/graphql/forAggregation.graphql-gen';
import { take } from 'rxjs/operators';

const StatusIDForAggregationOutDone = 5;
const StatusIDForAggregationInDone = 2;
const DistributionCenter = 'PH';
const StatusForMerpStatusAfterAgIn = '63';
const StatusForMerpStatusAfterAgOut = '65';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;
  title: string;
  message = '';
  messageType = 'error';
  isRelocation: boolean;
  isLastITN: boolean;
  ITNList;
  NOSINumber: string;
  orderLineNumber: string;
  qcContainer: number;
  locationList: string[];
  locationsSet: Set<string> = new Set();
  locations: string[];
  binContainer: string;
  newLocation = false;
  buttonLabel = 'place to the shelf';
  buttonStyles = 'bg-indigo-800';
  ITNInfo = [
    { key: 'Order#', value: '' },
    { key: 'Priority', value: '' },
    { key: 'Customer', value: '' },
    { key: 'Quantity', value: '' },
    { key: 'ITN Count', value: '' },
    { key: 'PRC', value: '' },
    { key: 'PartNumber', value: '' },
    { key: 'Shipment', value: '' },
  ];

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
    private fetchInventoryInfoGQL: FetchInventoryInfoGQL,
    private updateOrderStatusAfterAgout: UpdateOrderAfterAgOutGQL,
    private RelocateAggregationLocation: RelocateAggregationLocationGQL,
    private PutOnAggregationShelf: PutOnAggregationShelfGQL,
    private UpdateLastLineOfOrder: UpdateLastLineOfOrderGQL,
    private fetchHazardMaterialLevel: FetchHazardMaterialLevelGQL,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @ViewChild('location') locationInput: ElementRef;
  ngOnInit(): void {
    this.ITNList = this.route.snapshot.queryParams['ITNList'];
    this.qcContainer = parseInt(this.route.snapshot.queryParams['qcContainer']);
    this.binContainer = this.route.snapshot.queryParams['Bin'];
    (this.ITNList === undefined || this.qcContainer === undefined) &&
      this.router.navigate(['agin']);
    this.isRelocation =
      this.route.snapshot.queryParams['isRelocation'] === 'true';
    if (this.ITNList[0].length !== 10) {
      this.ITNList = [this.ITNList];
    }
    this.isRelocation
      ? ((this.title = `AGIN: ${this.binContainer}`),
        (this.buttonLabel = 'Relocate'))
      : (this.title = `AGIN: ${this.ITNList}`);
    this.commonService.changeTitle(this.title);
    this.fetchInfo();
  }

  ngAfterViewInit(): void {
    this.locationInput.nativeElement.focus();
  }

  toggleNewLocation(): void {
    this.newLocation = true;
    this.buttonLabel = `New Location`;
    this.locationInput.nativeElement.select();
  }

  async onSubmit(): Promise<void> {
    this.message = '';
    if (!this.locationForm.valid) {
      return;
    }
    if (this.binContainer === this.f.location.value) {
      this.message = 'Should scan a new location';
      this.messageType = 'warning';
      this.locationInput.nativeElement.select();
      return;
    }
    const barcodeInput = this.locationForm.get('location').value;
    const barcode =
      barcodeInput.length === 8 ? barcodeInput : barcodeInput.replace(/-/g, '');
    this.isLoading = true;
    const fileKey = `${DistributionCenter}${this.ITNInfo[0].value}${this.NOSINumber}${this.orderLineNumber}ag             ${this.ITNList[0]}`;
    // Seclet correspond query
    try {
      if (this.isRelocation) this.relocateAggregationLocation(barcode);
      else {
        if (this.isLastITN) {
          this.updateLastLineOfOrder(barcode, fileKey);
        } else {
          this.putOnAggregationShelf(barcode, fileKey);
        }
      }
    } catch (error) {
      this.message = error;
      this.locationInput.nativeElement.select();
      this.isLoading = false;
    }
  }

  relocateAggregationLocation(barcode: string): void {
    this.RelocateAggregationLocation.mutate(
      {
        qcContainer: this.qcContainer,
        ITNList: this.ITNList,
        Barcode: barcode,
        DistributionCenter: DistributionCenter,
        newLocation: this.newLocation,
        isLastITN: this.isLastITN,
        LocationList: this.locationList,
      },
      { fetchPolicy: 'no-cache' }
    ).subscribe((res) => {
      if (res.data.aggregationIn.success) {
        const result = 'info';
        const message = `Place in ${barcode}.`;
        this.router.navigate(['agin'], {
          queryParams: {
            result,
            message,
          },
        });
      } else {
        this.message = res.data.aggregationIn.message;
        this.locationInput.nativeElement.select();
        this.isLoading = false;
      }
      this.isLoading = false;
    });
  }

  putOnAggregationShelf(barcode: string, fileKey: string): void {
    this.PutOnAggregationShelf.mutate(
      {
        qcContainer: this.qcContainer,
        ITNList: this.ITNList,
        Barcode: barcode,
        DistributionCenter: DistributionCenter,
        newLocation: this.newLocation,
        isLastITN: this.isLastITN,
        LocationList: this.locationList,
        FileKeyList: [fileKey],
        ActionType: 'A',
        Action: 'line_aggregation_in',
        Inventory: { StatusID: StatusIDForAggregationInDone },
      },
      { fetchPolicy: 'no-cache' }
    ).subscribe((res) => {
      if (
        res.data.aggregationIn.success &&
        res.data.updateInventoryList.success
      ) {
        const result = 'info';
        const message = `Place in ${barcode}.`;
        this.router.navigate(['agin'], {
          queryParams: {
            result,
            message,
          },
        });
      } else {
        this.message = `${res.data.aggregationIn.message} ${res.data.updateInventoryList.message}`;
        this.locationInput.nativeElement.select();
        this.isLoading = false;
      }
      this.isLoading = false;
    });
  }

  updateLastLineOfOrder(barcode: string, fileKey: string): void {
    this.UpdateLastLineOfOrder.mutate(
      {
        qcContainer: this.qcContainer,
        ITNList: this.ITNList,
        Barcode: barcode,
        DistributionCenter: DistributionCenter,
        newLocation: this.newLocation,
        isLastITN: this.isLastITN,
        LocationList: this.locationList,
        FileKeyList: [fileKey],
        ActionType: 'A',
        Action: 'line_aggregation_in',
        OrderNumber: this.ITNInfo[0].value,
        NOSINumber: this.NOSINumber,
        Status: StatusForMerpStatusAfterAgIn,
        UserOrStatus: 'AGGREGATION-OUT',
        Inventory: { StatusID: StatusIDForAggregationInDone },
      },
      { fetchPolicy: 'no-cache' }
    ).subscribe((res) => {
      if (
        res.data.aggregationIn.success &&
        res.data.updateInventoryList.success
      ) {
        const result = 'success';
        const message = `Place in ${barcode}.\nOrder ${this.ITNInfo[0].value}-${this.NOSINumber} complete AG In.`;
        this.router.navigate(['agin'], {
          queryParams: {
            result,
            message,
          },
        });
      } else {
        this.message = res.data.aggregationIn.message;
        this.locationInput.nativeElement.select();
        this.isLoading = false;
      }
      this.isLoading = false;
    });
  }

  fetchInfo(): void {
    this.isLoading = true;
    this.subscription.add(
      this.fetchInventoryInfoGQL
        .watch(
          {
            InternalTrackingNumber: this.ITNList[0],
            DistributionCenter: DistributionCenter,
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          async (result) => {
            this.isLoading = result.loading;
            result.error && (this.message = result.error.message);
            const data = result.data.fetchInventoryInfo;
            this.orderLineNumber = data.OrderLineNumber;
            this.NOSINumber = data.NOSINumber;
            this.ITNInfo[0].value = data.OrderNumber;
            this.ITNInfo[1].value =
              data.PriorityPinkPaper === '1' ? 'Yes' : 'No';
            this.ITNInfo[2].value = data.CustomerNumber;
            this.ITNInfo[3].value = `${data.Quantity}`;
            this.ITNInfo[4].value = `${data.ITNCount} of ${data.ITNTotal}`;
            this.ITNInfo[5].value = data.ProductCode;
            this.ITNInfo[6].value = data.PartNumber;
            this.ITNInfo[7].value = data.ShippingMethod;
            this.isLastITN = data.ITNCount === data.ITNTotal;
            this.locationList = data.Locations;
            // if the order is single ITN order skip location step.
            if (data.ITNTotal === 1) {
              this.singleITNorder(data.orderId);
              return;
            }
            // auto select new location when ITNCount is 1 or less.
            if (data.ITNCount < 2) {
              this.newLocation = true;
              if (!this.isRelocation) this.buttonLabel = `New Location`;
            } else {
              data.Locations.slice(0)
                .reverse()
                .map((element) => {
                  if (element) {
                    this.locationsSet.size < 3 &&
                      this.locationsSet.add(element);
                  }
                });
              if (this.locationsSet.size !== 0) {
                this.locations = [...this.locationsSet];
              }
            }
          },
          (error) => {
            this.message = error;
            this.isLoading = false;
          }
        )
    );
  }

  singleITNorder(ID: number): void {
    this.isLoading = true;
    const fileKey = `${DistributionCenter}${this.ITNInfo[0].value}${this.NOSINumber}${this.orderLineNumber}packing        ${this.ITNList[0]}`;
    const productList = [
      `${this.ITNInfo[5].value.padEnd(3)}${this.ITNInfo[6].value}`,
    ];
    this.subscription.add(
      forkJoin({
        updateOrder: this.updateOrderStatusAfterAgout.mutate(
          {
            _id: ID,
            Order: {
              StatusID: StatusIDForAggregationOutDone,
            },
            DistributionCenter: DistributionCenter,
            OrderNumber: this.ITNInfo[0].value,
            NOSINumber: this.NOSINumber,
            UserOrStatus: 'Packing',
            MerpStatus: StatusForMerpStatusAfterAgOut,
            FileKeyList: [fileKey],
            ActionType: 'A',
            Action: 'line_aggregation_out',
            ITNList: this.ITNList,
            Inventory: { StatusID: StatusIDForAggregationOutDone },
          },
          { fetchPolicy: 'no-cache' }
        ),
        checkHazmzd: this.fetchHazardMaterialLevel
          .watch({ ProductList: productList }, { fetchPolicy: 'no-cache' })
          .valueChanges.pipe(take(1)),
      }).subscribe(
        (res) => {
          this.isLoading = false;
          if (
            res.updateOrder.data.updateOrder.success &&
            res.updateOrder.data.updateInventoryList.success
          ) {
            let result = 'success';
            let message = `Order complete ${this.ITNInfo[0].value}-${this.NOSINumber}`;
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
          } else {
            this.message = res.updateOrder.data.updateOrder.message.concat(
              res.updateOrder.data.updateInventoryList.message
            );
            this.isLoading = false;
          }
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
