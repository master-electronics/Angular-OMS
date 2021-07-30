import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { CommonService } from '../../../shared/services/common.service';
import {
  FetchLocationForAggregationOutGQL,
  UpdateOrderStatusAfterAgOutGQL,
} from '../../../graphql/forAggregation.graphql-gen';

const StatusIDAgOutPicking = 4;
const StatusIDAgOutDone = 5;
const StatusForMerpStatusAfterAgOut = '65';

@Component({
  selector: 'aggregationout-pick',
  templateUrl: './pick.component.html',
})
export class PickComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string;
  urlParams: { [key: string]: string };
  DistributionCenter: string;
  NOSINumber: string;
  isLoading = false;
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';
  buttonLabel = 'submit';
  message = '';
  totalITNs = 1;
  orderID: number;
  containerList = [];
  selectedList = [];

  containerForm = this.fb.group({
    containerNumber: [
      '',
      [Validators.required, Validators.pattern(ToteBarcodeRegex)],
    ],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.containerForm.controls;
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private fetchLocation: FetchLocationForAggregationOutGQL,
    private updateOrderStatusAfterAgOut: UpdateOrderStatusAfterAgOutGQL
  ) {}

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    this.urlParams = { ...this.route.snapshot.queryParams };
    this.title = `Pick: ${this.urlParams.orderNumber}`;
    this.commonService.changeTitle(this.title);
    this.fetchContainersLocation();
  }

  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  fetchContainersLocation(): void {
    this.isLoading = true;
    this.subscription.add(
      this.fetchLocation
        .watch(
          {
            DistributionCenter: this.urlParams.DC,
            OrderNumber: this.urlParams.orderNumber,
            NOSINumber: this.urlParams.NOSINumber,
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          (result) => {
            this.isLoading = result.loading;
            result.error && (this.message = result.error.message);
            this.containerList = result.data.findOrder[0].INVENTORies;
            this.totalITNs = this.containerList.length;
            this.orderID = result.data.findOrder[0]._id;
          },
          (error) => {
            this.message = error;
            this.isLoading = false;
          }
        )
    );
  }

  onSubmit(): void {
    this.message = '';
    if (this.containerForm.valid) {
      this.selectContainer();
    }
  }

  updateAfterPick(): void {
    this.isLoading = true;
    const LastUpdated = new Date().toISOString();
    const fileKey = `${this.urlParams.DistributionCenter}${this.urlParams.orderNumber}${this.urlParams.NOSINumber}`;
    const fileKeyList = [];
    this.selectedList.forEach((container, index) => {
      fileKeyList.push(
        `${fileKey}${String(index + 1).padStart(2, '0')}packing        ${
          container.InternalTrackingNumber
        }`
      );
    });
    this.subscription.add(
      this.updateOrderStatusAfterAgOut
        .mutate(
          {
            _id: this.orderID,
            Order: {
              StatusID: StatusIDAgOutDone,
              LastUpdated: LastUpdated,
            },
            DistributionCenter: this.urlParams.DistributionCenter,
            OrderNumber: this.urlParams.orderNumber,
            NOSINumber: this.urlParams.NOSINumber,
            UserOrStatus: 'Packing',
            MerpStatus: StatusForMerpStatusAfterAgOut,
            FileKeyList: fileKeyList,
            ActionType: 'A',
            Action: 'line_aggregation_out',
          },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe(
          (result) => {
            if (
              result.data.updateOrderStatus.success &&
              result.data.updateMerpWMSLog.success &&
              result.data.updateOrderStatus.success
            ) {
              this.router.navigate(['/agout'], {
                queryParams: {
                  result: 'success',
                  message: `Aggregation Out: ${this.urlParams.orderNumber}`,
                },
              });
            }
            if (result.data.updateOrderStatus.message === `Invalid Order!`) {
              this.router.navigate(['/agout'], {
                queryParams: {
                  result: 'error',
                  message: `Invalid Order: ${this.urlParams.orderNumber}`,
                },
              });
            }
            this.isLoading = false;
            this.message = result.data.updateOrderStatus.message;
          },
          (err) => {
            this.isLoading = false;
            this.message = err;
          }
        )
    );
    this.containerInput.nativeElement.select();
  }

  selectContainer(): void {
    let count = 0;
    this.containerList = this.containerList.filter((node) => {
      if (node.Container.Barcode === this.f.containerNumber.value) {
        this.selectedList.unshift(node);
        count += 1;
      }
      return node.Container.Barcode !== this.f.containerNumber.value;
    });
    if (count === 0) {
      this.message = `Container is not in the list.`;
    }
    if (this.totalITNs === this.selectedList.length) {
      this.buttonLabel = `Aggregation Out`;
      this.buttonStyles = `bg-green-500`;
      this.updateAfterPick();
    } else {
      this.containerInput.nativeElement.select();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
