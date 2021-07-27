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
import { Subscription } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import {
  FetchInventoryInfoGQL,
  UpdateAggregationLocationGQL,
  UpdateMerpOrderStatusGQL,
  UpdateMerpWmsLogGQL,
} from '../../../graphql/aggregation.graphql-gen';
import {
  AggregationLocationRegex,
  BinContainerRegex,
} from '../../../shared/dataRegex';
import { UpdateOrderStatusAfterAgOutGQL } from 'src/app/graphql/forAggregation.graphql-gen';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

const StatusIDForAggregationOutDone = 5;
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
    return AggregationLocationRegex.test(input.value) ||
      BinContainerRegex.test(input.value) ||
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
    private auth: AuthenticationService,
    private updateOrderStatusAfterAgout: UpdateOrderStatusAfterAgOutGQL,
    private updateAggregationLocation: UpdateAggregationLocationGQL,
    private updateMerpOrderStatus: UpdateMerpOrderStatusGQL,
    private updateMerpWMSLog: UpdateMerpWmsLogGQL,
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
    const BarcodeInput = this.locationForm.get('location').value;
    this.isLoading = true;
    const queryAfterSubmit = [];
    queryAfterSubmit.push(this.updateSQLAfterAgIn(BarcodeInput));
    if (!this.isRelocation) {
      queryAfterSubmit.push(this.writeEvenLogAfterAginLine());
      if (this.isLastITN) {
        queryAfterSubmit.push(this.updateOrderStatusAfterLastLine());
      }
    }
    try {
      const queryRes = await Promise.all(queryAfterSubmit);
      if (queryRes[0].success) {
        if (queryRes[1]) {
          if (queryRes[2]) {
            this.routeNav(
              queryRes[2].success ? `success` : `error`,
              queryRes[2].message
                ? `Place in ${BarcodeInput}.\nOrder ${this.ITNInfo[0].value} is complete.`
                : queryRes[2].message
            );
          }
          this.routeNav(
            queryRes[1].success ? `info` : `error`,
            queryRes[1].message
              ? `Place in ${BarcodeInput}.`
              : queryRes[1].message
          );
        }
      }
      this.routeNav(
        queryRes[0].success ? `info` : `error`,
        queryRes[0].message ? `Place in ${BarcodeInput}.` : queryRes[0].message
      );
    } catch (error) {
      this.message = error;
      this.isLoading = false;
      this.locationInput.nativeElement.select();
    }
    return;
  }

  routeNav(result: string, message: string): void {
    this.router.navigate(['agin'], {
      queryParams: {
        result: result,
        message: message,
      },
    });
  }

  async updateSQLAfterAgIn(
    BarcodeInput: string
  ): Promise<{ success: boolean; message?: string }> {
    return new Promise((resolve, reject) => {
      this.updateAggregationLocation
        .mutate(
          {
            qcContainer: this.qcContainer,
            ITNList: this.ITNList,
            Barcode:
              BarcodeInput.length === 8
                ? BarcodeInput
                : BarcodeInput.replace(/-/g, ''),
            DistributionCenter: DistributionCenter,
            newLocation: this.newLocation,
            isLastITN: this.isLastITN,
            LocationList: this.locationList,
          },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe(
          (res) => {
            resolve(res.data.aggregationIn);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  writeEvenLogAfterAginLine(): Promise<{ success: boolean; message?: string }> {
    const fileKey = `${DistributionCenter}${this.ITNInfo[0].value}${this.NOSINumber}${this.orderLineNumber}ag             ${this.ITNList[0]}`;
    return new Promise((resolve, reject) => {
      this.updateMerpWMSLog
        .mutate(
          {
            FileKeyList: [fileKey],
            DistributionCenter: DistributionCenter,
            ActionType: 'A',
            Action: 'line_aggregation_in',
          },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe(
          (res) => {
            resolve(res.data.updateMerpWMSLog);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  updateOrderStatusAfterLastLine(): Promise<{
    success: boolean;
    message?: string;
  }> {
    return new Promise((resolve, reject) => {
      this.updateMerpOrderStatus
        .mutate(
          {
            User: this.auth.userName,
            OrderNumber: this.ITNInfo[0].value,
            NOSINumber: this.NOSINumber,
            Status: StatusForMerpStatusAfterAgIn,
            UserOrStatus: 'AGGREGATION-OUT',
          },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe(
          (res) => {
            resolve(res.data.updateMerpOrderStatus);
          },
          (error) => {
            reject(error);
          }
        );
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
              this.singleITNorder(data.orderId, data.OrderNumber);
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

  singleITNorder(ID: number, orderNumber: string): void {
    const lastUpdated = new Date().toISOString();
    const fileKey = `${DistributionCenter}${this.ITNInfo[0].value}${this.NOSINumber}${this.orderLineNumber}packing        ${this.ITNList[0]}`;
    this.subscription.add(
      this.updateOrderStatusAfterAgout
        .mutate(
          {
            _id: ID,
            Order: {
              StatusID: StatusIDForAggregationOutDone,
              LastUpdated: lastUpdated,
            },
            DistributionCenter: DistributionCenter,
            OrderNumber: this.ITNInfo[0].value,
            NOSINumber: this.NOSINumber,
            StatusID: StatusIDForAggregationOutDone,
            User: this.auth.userName,
            UserOrStatus: 'Packing',
            MerpStatus: StatusForMerpStatusAfterAgOut,
            FileKeyList: [fileKey],
            ActionType: 'A',
            Action: 'line_aggregation_out',
          },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe(
          (res) => {
            if (res.data.updateOrderStatus.success) {
              this.router.navigate(['agin'], {
                queryParams: {
                  result: 'success',
                  message: `Order complete ${orderNumber}`,
                },
              });
            } else {
              this.message = res.data.updateOrderStatus.message;
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
