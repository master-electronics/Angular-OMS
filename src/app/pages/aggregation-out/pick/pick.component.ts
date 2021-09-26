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
import { forkJoin, Observable, of, Subscription } from 'rxjs';

import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { CommonService } from '../../../shared/services/common.service';
import { catchError, map, take, tap } from 'rxjs/operators';
import {
  FetchContainerForAgoutPickGQL,
  FetchHazardMaterialLevelGQL,
  UpdateAfterAgOutGQL,
} from 'src/app/graphql/aggregationIn.graphql-gen';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'aggregationout-pick',
  templateUrl: './pick.component.html',
})
export class PickComponent implements OnInit, OnDestroy, AfterViewInit {
  title: string;
  urlParams: { [key: string]: string };
  DistributionCenter: string;
  NOSINumber: string;
  // html control
  buttonLabel = `Pick`;
  buttonStyles = `bg-indigo-500`;
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  totalITNs = 0;
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
    private titleService: Title,
    private fetchLocation: FetchContainerForAgoutPickGQL,
    private fetchHazard: FetchHazardMaterialLevelGQL,
    private updateAfterQC: UpdateAfterAgOutGQL,
    private gtmService: GoogleTagManagerService,
    private authService: AuthenticationService
  ) {}

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    this.urlParams = { ...this.route.snapshot.queryParams };
    this.title = `Pick: ${this.urlParams.OrderNumber}-${this.urlParams.NOSINumber}`;
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle('agout/pick');
    this.fetchLocationInfo();
  }

  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  fetchLocationInfo(): void {
    this.isLoading = true;
    this.subscription.add(
      this.fetchLocation
        .fetch(
          {
            OrderID: Number(this.urlParams.OrderID),
          },
          { fetchPolicy: 'network-only' }
        )
        .subscribe(
          (res) => {
            this.itemList = res.data.findOrderLineDetail;
            this.totalITNs = this.itemList.length;
            this.isLoading = res.loading;
          },
          (error) => {
            this.alertMessage = error;
            this.isLoading = false;
          }
        )
    );
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.containerForm.valid || this.isLoading) {
      this.containerInput.nativeElement.select();
      return;
    }
    this.selectContainer();
  }

  updateSQLAndCheckHazmzd(): Observable<any> {
    const fileKey = `${environment.DistributionCenter}${this.urlParams.OrderNumber}${this.urlParams.NOSINumber}`;
    const FileKeyList = [];
    const productSet = new Set<string>();
    const BarcodeList = [];
    this.selectedList.forEach((node) => {
      FileKeyList.push(
        `${fileKey}${String(node.OrderLine.OrderLineNumber).padStart(
          2,
          '0'
        )}packing        ${node.InternalTrackingNumber}`
      );
      BarcodeList.push(node.Container.Barcode);
      productSet.add(
        `${node.OrderLine.ProductCode.padEnd(3)}${node.OrderLine.PartNumber}`
      );
    });
    const productList = [...productSet];

    return forkJoin({
      updateOrder: this.updateAfterQC.mutate({
        OrderID: Number(this.urlParams.OrderID),
        OrderLineDetail: {
          StatusID: environment.agOutComplete_ID,
        },
        // Container: {
        //   Warehouse: '10',
        //   Row: 'AG',
        //   Aisle: null,
        //   Section: null,
        //   Shelf: null,
        //   ShelfDetail: null,
        // },
        // BarcodeList,
        EventLog: {
          UserID: Number(JSON.parse(sessionStorage.getItem('userInfo'))._id),
          Event: `Ag Out`,
          Module: `Ag Out`,
          Target: `${this.urlParams.OrderNumber}-${this.urlParams.NOSINumber}`,
        },
        DistributionCenter: environment.DistributionCenter,
        OrderNumber: this.urlParams.OrderNumber,
        NOSINumber: this.urlParams.NOSINumber,
        UserOrStatus: 'Packing',
        MerpStatus: String(environment.agOutComplete_ID),
        FileKeyList,
        ActionType: 'A',
        Action: 'line_aggregation_out',
      }),
      checkHazmzd: this.fetchHazard.fetch(
        { ProductList: productList },
        { fetchPolicy: 'network-only' }
      ),
    });
  }

  updateAfterPick(): void {
    this.isLoading = true;
    this.subscription.add(
      this.updateSQLAndCheckHazmzd()
        .pipe(
          // throw errors
          tap((res) => {
            let error = '';
            if (!res.updateOrder.data.updateMerpOrderStatus.success) {
              error += res.updateOrder.data.updateMerpOrderStatus.message;
            }
            if (error) throw error;
          }),

          // navgate to first page if success
          map((res) => {
            let result = 'success';
            let message = `Order complete: ${this.urlParams.OrderNumber}-${this.urlParams.NOSINumber}`;
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
            this.sendGTM();
            this.router.navigate(['/agout'], {
              queryParams: {
                result,
                message,
              },
            });
            this.isLoading = false;
          }),

          catchError((error) => {
            this.alertMessage = error;
            this.isLoading = false;
            this.containerInput.nativeElement.select();
            return of();
          })
        )
        .subscribe()
    );
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
      this.alertMessage = `Container is not in the list.`;
    }
    if (this.totalITNs === this.selectedList.length) {
      this.buttonLabel = `Aggregation Out`;
      this.buttonStyles = `bg-green-500`;
      this.updateAfterPick();
    } else {
      this.f.containerNumber.setValue('');
      this.containerInput.nativeElement.select();
    }
  }
  sendGTM(): void {
    this.gtmService.pushTag({
      event: 'AggregationOut',
      userID: this.authService.userName,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
