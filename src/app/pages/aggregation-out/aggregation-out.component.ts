import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  PickOrdersForAggregationOutGQL,
  PickOrdersForAggregationOutQuery,
  OrderInfoFragment,
  UpdateOrderStatusGQL,
  FetchOrderStatusGQL,
} from '../../graphql/forAggregation.graphql-gen';
import { CommonService } from '../../shared/services/common.service';
import { OrderBarcodeRegex } from '../../shared/dataRegex';
import { Title } from '@angular/platform-browser';

const agOutPresent = 3;
const agOutPicking = 4;
const expireTimeForAccptTask = 180000; // 3min
const expireTimeForPick = 900000; // 15min

const DistributionCenter = 'PH';

@Component({
  selector: 'aggregation-out',
  templateUrl: './aggregation-out.component.html',
})
export class AggregationOutComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  title = 'Aggregation Out';
  isLoading = false;
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';
  buttonLabel = 'submit';
  message = '';
  orderStatus: string;

  orderForm = this.fb.group({
    orderNumber: [
      '',
      [Validators.required, Validators.pattern(OrderBarcodeRegex)],
    ],
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
    private titleService: Title,
    private pickOrders: PickOrdersForAggregationOutGQL,
    private updateOrderStatus: UpdateOrderStatusGQL,
    private fetchOrderStatus: FetchOrderStatusGQL
  ) {
    this.commonService.changeTitle(this.title);
    this.titleService.setTitle(this.title);
  }

  @ViewChild('orderNumber') orderInpt: ElementRef;
  ngOnInit(): void {
    // read info from previous page.
    this.messageType = this.route.snapshot.queryParams['result'];
    this.message = this.route.snapshot.queryParams['message'];
    this.fechOrderInfo();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.orderInpt.nativeElement.select();
    }, 10);
  }

  fechOrderInfo(): void {
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
                orderNumber: `${chosenOrder.OrderNumber}-${chosenOrder.NOSINumber}`,
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
          () => {
            this.isLoading = false;
          }
        )
    );
  }

  chooseOneOrder(
    result: ApolloQueryResult<PickOrdersForAggregationOutQuery>
  ): OrderInfoFragment {
    if (result.data.agOutPicking[0]) {
      if (
        Date.now() - Number(result.data.agOutPicking[0].LastUpdated) >
        expireTimeForPick
      )
        return result.data.agOutPicking[0];
    }
    if (result.data.agOutPresent[0]) {
      if (
        Date.now() - Number(result.data.agOutPresent[0].LastUpdated) >
        expireTimeForAccptTask
      )
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

  updateValidOrder(): void {
    const orderNumber = this.orderForm.get('orderNumber').value.slice(0, 6);
    const NOSINumber = this.orderForm.get('orderNumber').value.slice(7);
    const LastUpdated = new Date().toISOString();
    this.isLoading = true;
    this.subscription.add(
      this.fetchOrderStatus
        .watch(
          {
            DistributionCenter: DistributionCenter,
            OrderNumber: orderNumber,
            NOSINumber: NOSINumber,
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.pipe(
          switchMap((res) => {
            if (res.data.findOrder.length > 0) {
              if (
                res.data.findOrder[0].StatusID > 1 &&
                res.data.findOrder[0].StatusID < 6
              ) {
                return this.updateOrderStatus.mutate(
                  {
                    DistributionCenter: DistributionCenter,
                    OrderNumber: orderNumber,
                    NOSINumber: NOSINumber,
                    Order: { StatusID: agOutPicking, LastUpdated: LastUpdated },
                  },
                  { fetchPolicy: 'no-cache' }
                );
              }
              throw 'This order is not finish Ag in yet.';
            }
            throw 'Can not find this order number.';
          })
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
                queryParams: {
                  orderNumber,
                  NOSINumber,
                  DistributionCenter,
                },
              });
            } else {
              this.messageType = 'error';
              this.message = result.data.updateOrderStatus.message;
              this.orderInpt.nativeElement.select();
            }
          },
          (error) => {
            this.messageType = 'error';
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
