import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { BinContainerRegex } from '../../../shared/dataRegex';
import { CommonService } from '../../../shared/services/common.service';
import {
  FetchLocationForAggregationOutGQL,
  UpdateOrderStatusGQL,
} from '../../../graphql/forAggregation.graphql-gen';

const agOutPicking = 4;
const agOutDone = 5;

@Component({
  selector: 'aggregationout-pick',
  templateUrl: './pick.component.html',
})
export class PickComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string;
  orderNumber: string;
  isLoading = false;
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';
  buttonLabel = 'submit';
  message = '';
  totalITNs = 1;
  containerList;
  selectedList = [];

  containerForm = this.fb.group({
    containerNumber: ['', [Validators.required, Validators.pattern(BinContainerRegex)]],
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
    private updateOrder: UpdateOrderStatusGQL
  ) {}

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    this.orderNumber = this.route.snapshot.queryParams['orderNumber'];
    this.title = `Pick: ${this.orderNumber}`;
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
            DistributionCenter: this.orderNumber.slice(0, 2),
            OrderNumber: this.orderNumber.slice(2, 8),
            NOSINumber: this.orderNumber.slice(8),
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          (result) => {
            this.isLoading = result.loading;
            result.error && (this.message = result.error.message);
            this.containerList = result.data.findOrder[0].INVENTORies;
            this.totalITNs = this.containerList.length;
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

  updateOrderStatus(): void {
    this.isLoading = true;
    const LastUpdated = new Date().toISOString();
    this.subscription.add(
      this.updateOrder
        .mutate(
          {
            DistributionCenter: this.orderNumber.slice(0, 2),
            OrderNumber: this.orderNumber.slice(2, 8),
            NOSINumber: this.orderNumber.slice(8),
            StatusID: agOutPicking,
            Order: {
              StatusID: agOutDone,
              LastUpdated: LastUpdated,
            },
          },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe(
          (result) => {
            if (result.data.updateOrderStatus.success) {
              this.router.navigate(['/agout'], {
                queryParams: {
                  result: 'success',
                  message: `Aggregation Out: ${this.orderNumber}`,
                },
              });
            }
            if (result.data.updateOrderStatus.message === `Invalid Order!`) {
              this.router.navigate(['/agout'], {
                queryParams: {
                  result: 'error',
                  message: `Invalid Order: ${this.orderNumber}`,
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
      this.updateOrderStatus();
    } else {
      this.containerInput.nativeElement.select();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
