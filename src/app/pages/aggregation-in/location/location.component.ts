import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import { FetchInventoryInfoGQL, AggregationInGQL } from '../../../graphql/aggregation.graphql-gen';
import { BinLocationRegex, BinContainerRegex } from '../../../shared/dataRegex';

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

  regex(input: FormControl) {
    return BinLocationRegex.test(input.value) ||
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
    private aggregationInGQL: AggregationInGQL,
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
    this.isRelocation = this.route.snapshot.queryParams['isRelocation'] === 'true';
    if (this.ITNList[0].length !== 10) {
      this.ITNList = [this.ITNList];
    }
    this.isRelocation
      ? ((this.title = `AGIN: ${this.binContainer}`), (this.buttonLabel = 'Relocate'))
      : (this.title = `AGIN: ${this.ITNList}`);
    this.commonService.changeTitle(this.title);

    this.fetchInfo();
  }

  ngAfterViewInit() {
    this.locationInput.nativeElement.focus();
  }

  toggleNewLocation(): void {
    this.newLocation = true;
    this.buttonLabel = `New Location`;
    this.locationInput.nativeElement.select();
  }

  onSubmit(): void {
    this.message = '';
    if (this.locationForm.valid) {
      this.updateLocation();
    }
  }

  updateLocation() {
    if (this.binContainer === this.f.location.value) {
      this.message = 'Should scan a new location';
      this.messageType = 'warning';
      this.locationInput.nativeElement.select();
      return;
    }
    this.isLoading = true;
    this.subscription.add(
      this.aggregationInGQL
        .mutate(
          {
            qcContainer: this.qcContainer,
            ITNList: this.ITNList,
            LocationList: this.locationList,
            Barcode: this.locationForm.get('location').value,
            DistributionCenter: 'PH',
            newLocation: this.newLocation,
            isLastITN: this.isLastITN,
          },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe(
          (result) => {
            if (result.data.aggregationIn.success) {
              let resultMessage = `Placed in ${this.locationForm.get('location').value}.`;
              let resultType = `info`;
              if (this.isLastITN) {
                resultMessage = resultMessage.concat(
                  `\nOrder ${this.ITNInfo[0].value} is complete.`
                );
                resultType = 'success';
              }
              this.router.navigate(['agin'], {
                queryParams: {
                  result: resultType,
                  message: resultMessage,
                },
              });
            }
            if (result.data.aggregationIn.message === 'Expired tab') {
              this.router.navigate(['agin'], {
                queryParams: { success: false, message: 'Expired tab' },
              });
            }
            this.isLoading = false;
            this.message = result.data.aggregationIn.message;
            this.locationInput.nativeElement.select();
          },
          (error) => {
            this.locationInput.nativeElement.select();
            this.isLoading = false;
            this.message = error;
          }
        )
    );
  }

  fetchInfo() {
    this.isLoading = true;
    this.subscription.add(
      this.fetchInventoryInfoGQL
        .watch(
          { InternalTrackingNumber: this.ITNList[0], DistributionCenter: 'PH' },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          (result) => {
            this.isLoading = result.loading;
            result.error && (this.message = result.error.message);
            const data = result.data.fetchInventoryInfo;
            this.ITNInfo[0].value = data.OrderNumber;
            this.ITNInfo[1].value = data.PriorityPinkPaper === '1' ? 'Yes' : 'No';
            this.ITNInfo[2].value = data.CustomerNumber;
            this.ITNInfo[3].value = `${data.Quantity}`;
            this.ITNInfo[4].value = `${data.ITNCount} of ${data.ITNTotal}`;
            this.ITNInfo[5].value = data.ProductCode;
            this.ITNInfo[6].value = data.PartNumber;
            this.ITNInfo[7].value = data.ShippingMethod;
            this.isLastITN = data.ITNCount === data.ITNTotal;
            this.locationList = data.Locations;
            // auto select new location when ITNCount is 1 or less.
            if (data.ITNCount < 2) {
              this.newLocation = true;
              if (!this.isRelocation) this.buttonLabel = `New Location`;
            } else {
              data.Locations.slice(0)
                .reverse()
                .map((element) => {
                  if (element) {
                    this.locationsSet.size < 3 && this.locationsSet.add(element);
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
