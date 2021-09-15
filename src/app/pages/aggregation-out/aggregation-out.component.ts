import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';

import { CommonService } from '../../shared/services/common.service';
import { OrderBarcodeRegex } from '../../shared/dataRegex';
import { Title } from '@angular/platform-browser';
import {
  PickOrderForAgOutGQL,
  VerifyOrderForAgOutGQL,
} from 'src/app/graphql/aggregationIn.graphql-gen';
import { environment } from 'src/environments/environment';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'aggregation-out',
  templateUrl: './aggregation-out.component.html',
})
export class AggregationOutComponent implements OnInit, AfterViewInit {
  title = 'Aggregation Out';
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  pickOrder$;
  verifyOrder$;

  orderForm = this.fb.group({
    orderNumber: [
      '',
      [Validators.required, Validators.pattern(OrderBarcodeRegex)],
    ],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.orderForm.controls;
  }

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private pickOrder: PickOrderForAgOutGQL,
    private verifyOrder: VerifyOrderForAgOutGQL
  ) {
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle(this.title);
  }

  @ViewChild('orderNumber') orderInpt: ElementRef;
  ngOnInit(): void {
    // read info from previous page.
    this.alertType = this.route.snapshot.queryParams['result'];
    this.alertMessage = this.route.snapshot.queryParams['message'];
    this.isLoading = true;
    this.pickOrder$ = this.pickOrder.mutate(null).pipe(
      tap((res) => {
        const order = res.data.pickOrderForAgOut;
        let orderBarcode = `No available order`;
        if (order) {
          orderBarcode = `${order.OrderNumber}-${order.NOSINumber}`;
        }
        this.f.orderNumber.setValue(orderBarcode);
        this.orderInpt.nativeElement.select();
        this.isLoading = false;
      }),
      catchError((error) => {
        this.alertMessage = error;
        this.orderInpt.nativeElement.select();
        this.isLoading = false;
        return of([]);
      })
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.orderInpt.nativeElement.select();
    }, 10);
  }

  onSubmit(): void {
    this.alertMessage = '';
    this.alertType = 'error';
    if (!this.orderForm.valid) {
      this.orderInpt.nativeElement.select();
      return;
    }
    // verify Order query
    const OrderNumber = this.orderForm.get('orderNumber').value.slice(0, 6);
    const NOSINumber = this.orderForm.get('orderNumber').value.slice(7);
    this.isLoading = true;
    this.verifyOrder$ = this.verifyOrder
      .fetch(
        {
          DistributionCenter: environment.DistributionCenter,
          OrderNumber,
          NOSINumber,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          const order = res.data.fetchOrderView;
          if (!order.length) {
            throw `Can not find this order!`;
          }
          if (
            order[0].StatusID !== environment.agInComplete_ID &&
            order[0].StatusID !== environment.agOutComplete_ID
          ) {
            throw `Invalid Order Status!`;
          }
        }),
        map((res) => {
          this.router.navigate(['/agout/pick'], {
            queryParams: {
              OrderNumber,
              NOSINumber,
              OrderID: res.data.fetchOrderView[0].OrderID,
            },
          });
        }),
        catchError((error) => {
          this.alertMessage = error;
          this.orderInpt.nativeElement.select();
          this.isLoading = false;
          return throwError(error);
        })
      );
  }
}
