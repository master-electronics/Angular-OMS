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
import { forkJoin, Observable, Subscription } from 'rxjs';

import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { CommonService } from '../../../shared/services/common.service';
import {
  FetchLocationForAggregationOutGQL,
  UpdateOrderAfterAgOutGQL,
  FetchHazardMaterialLevelGQL,
} from '../../../graphql/forAggregation.graphql-gen';
import { take } from 'rxjs/operators';

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
  itemList = [];
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
    private updateOrderAfterAgOut: UpdateOrderAfterAgOutGQL,
    private fetchHazardMaterialLevel: FetchHazardMaterialLevelGQL
  ) {}

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    this.urlParams = { ...this.route.snapshot.queryParams };
    this.title = `Pick: ${this.urlParams.orderNumber}`;
    this.commonService.changeTitle(this.title);
    this.fetchItemsInfo();
  }

  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  fetchItemsInfo(): void {
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
            this.itemList = result.data.findOrder[0].INVENTORies;
            this.totalITNs = this.itemList.length;
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

  updateSQLAndCheckHazmzd(): Observable<any> {
    const LastUpdated = new Date().toISOString();
    const fileKey = `${this.urlParams.DistributionCenter}${this.urlParams.orderNumber}${this.urlParams.NOSINumber}`;
    const fileKeyList = [];
    const productSet = new Set<string>();
    this.selectedList.forEach((node, index) => {
      fileKeyList.push(
        `${fileKey}${String(index + 1).padStart(2, '0')}packing        ${
          node.InternalTrackingNumber
        }`
      );
      productSet.add(`${node.ProductCode.padEnd(3)}${node.PartNumber}`);
    });
    const productList = [...productSet];

    return forkJoin({
      updateOrder: this.updateOrderAfterAgOut.mutate(
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
      ),
      checkHazmzd: this.fetchHazardMaterialLevel
        .watch({ ProductList: productList }, { fetchPolicy: 'no-cache' })
        .valueChanges.pipe(take(1)),
    });
  }

  updateAfterPick(): void {
    this.isLoading = true;
    this.subscription.add(
      this.updateSQLAndCheckHazmzd().subscribe(
        (res) => {
          console.log(res);

          if (
            res.updateOrder.data.updateOrder.success &&
            res.updateOrder.data.updateMerpWMSLog.success &&
            res.updateOrder.data.updateMerpOrderStatus.success
          ) {
            let result = 'success';
            let message = `Aggregation Out: ${this.urlParams.orderNumber}-${this.urlParams.NOSINumber}`;
            if (
              res.checkHazmzd.data.fetchProductInfoFromMerp.some(
                (node) =>
                  node.HazardMaterialLevel !== 'N' &&
                  node.HazardMaterialLevel !== ' '
              )
            ) {
              result = 'warning';
              message = message + `\nThis order contains hazardous materials`;
            }
            this.router.navigate(['/agout'], {
              queryParams: {
                result,
                message,
              },
            });
          }
          if (res.updateOrder.data.updateOrder.message === `Invalid Order!`) {
            this.router.navigate(['/agout'], {
              queryParams: {
                result: 'error',
                message: `Invalid Order: ${this.urlParams.orderNumber}-${this.urlParams.NOSINUmber}`,
              },
            });
          }
          this.isLoading = false;
          this.message = res.updateOrder.data.updateOrder.message;
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
    this.itemList = this.itemList.filter((node) => {
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
