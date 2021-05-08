import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  PickOrdersForAggregationOutGQL,
  PickOrdersForAggregationOutQuery,
  OrderInfoFragment,
  UpdateOrderStatusGQL,
} from '../../graphql/forAggregation.graphql-gen';
import { CommonService } from '../../shared/services/common.service';
import { OrderNumberRegex } from '../../shared/dataRegex';

const agOutPresent = 3;
const agOutPicking = 4;
const expireTime = 180000; // 3min

@Component({
  selector: 'aggregation-out',
  templateUrl: './aggregation-out.component.html',
})
export class AggregationOutComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Aggregation Out';
  isLoading = false;
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';
  buttonLabel = 'submit';
  message = '';
  orderStatus: string;

  orderForm = this.fb.group({
    orderNumber: ['', [Validators.required, Validators.pattern(OrderNumberRegex)]],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.orderForm.controls;
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pickOrders: PickOrdersForAggregationOutGQL,
    private updateOrderStatus: UpdateOrderStatusGQL
  ) {
    this.commonService.changeTitle(this.title);
  }

  @ViewChild('orderNumber') orderInpt: ElementRef;
  ngOnInit(): void {
    // read info from previous page.
    this.messageType = this.route.snapshot.queryParams['result'];
    this.message = this.route.snapshot.queryParams['message'];
    this.fechOrderInfo();
  }

  ngAfterViewInit() {
    this.orderInpt.nativeElement.select();
  }

  fechOrderInfo() {
    this.isLoading = true;
    this.subscription.add(
      this.pickOrders
        .watch(
          { agInDone: 2, agOutPresent: 3, agOutPicking: 4, limit: 1 },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.pipe(
          switchMap((result) => {
            const currentTime = new Date().toISOString();
            this.isLoading = result.loading;
            if (result.error) {
              this.message = result.error.message;
              this.messageType = 'error';
            }
            const chosenOrder = this.chooseOneOrder(result);
            if (chosenOrder) {
              this.orderStatus = chosenOrder.Status.Name;
              this.orderForm.patchValue({
                orderNumber:
                  chosenOrder.DistributionCenter + chosenOrder.OrderNumber + chosenOrder.NOSINumber,
              });
              return this.updateOrderStatus.mutate(
                {
                  _id: chosenOrder._id,
                  StatusID: chosenOrder.StatusID,
                  Order: { StatusID: agOutPresent, LastUpdated: currentTime },
                },
                { fetchPolicy: 'no-cache' }
              );
            }
            this.orderStatus = `No available order`;
            return null;
          })
        )
        .subscribe(
          (result) => {
            if (result.errors) {
              this.message = result.errors[0].message;
              this.messageType = 'error';
            }
          },
          (error) => {
            this.isLoading = false;
          }
        )
    );
  }

  chooseOneOrder(result: ApolloQueryResult<PickOrdersForAggregationOutQuery>): OrderInfoFragment {
    if (result.data.agOutPicking[0]) {
      if (Date.now() - Number(result.data.agOutPicking[0].LastUpdated) > expireTime * 10)
        return result.data.agOutPicking[0];
    }
    if (result.data.agOutPresent[0]) {
      if (Date.now() - Number(result.data.agOutPresent[0].LastUpdated) > expireTime)
        return result.data.agOutPresent[0];
    }
    if (result.data.agInDone[0]) {
      return result.data.agInDone[0];
    }
    return null;
  }

  onSubmit(): void {
    this.message = '';
    if (this.orderForm.valid) {
      this.updateValidOrder();
    }
  }

  updateValidOrder() {
    const orderNumber = this.orderForm.get('orderNumber').value;
    const LastUpdated = new Date().toISOString();
    this.isLoading = true;
    this.subscription.add(
      this.updateOrderStatus
        .mutate(
          {
            DistributionCenter: orderNumber.slice(0, 2),
            OrderNumber: orderNumber.slice(2, 8),
            NOSINumber: orderNumber.slice(8),
            Order: { StatusID: agOutPicking, LastUpdated: LastUpdated },
          },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe(
          (result) => {
            this.isLoading = false;
            if (result.errors) {
              this.message = result.errors[0].message;
              this.messageType = 'error';
            }
            if (result.data.updateOrderStatus.success) {
              this.router.navigate(['/agout/pick'], {
                queryParams: { orderNumber: this.orderForm.get('orderNumber').value },
              });
            } else {
              this.messageType = 'error';
              this.message = result.data.updateOrderStatus.message;
              this.orderInpt.nativeElement.select();
            }
          },
          (error) => {
            this.message = error;
            this.isLoading = false;
            this.orderInpt.nativeElement.select();
          }
        )
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
