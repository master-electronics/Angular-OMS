import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, Subscription } from 'rxjs';

import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { CommonService } from '../../../shared/services/common.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  FetchContainerForAgoutPickGQL,
  FetchHazardMaterialLevelGQL,
  UpdateAfterAgOutGQL,
} from 'src/app/graphql/aggregationIn.graphql-gen';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { AggregationOutService } from '../aggregation-out.server';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/wms.graphql-gen';

@Component({
  selector: 'pick-tote',
  templateUrl: './pick-tote.component.html',
})
export class PickToteComponent implements OnInit, OnDestroy, AfterViewInit {
  urlParams: { [key: string]: string };
  locationInfo$: Observable<boolean>;
  updateSQL$: Observable<boolean>;
  buttonLabel = `Pick`;
  buttonStyles = `bg-indigo-500`;
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  totalTotes = 0;
  containerList = [];
  selectedList = [];

  containerForm = this._fb.group({
    containerNumber: [
      '',
      [Validators.required, Validators.pattern(ToteBarcodeRegex)],
    ],
  });

  private subscription: Subscription = new Subscription();
  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _router: Router,
    private _route: ActivatedRoute,
    private agOutService: AggregationOutService,
    private _titleService: Title,
    private _fetchLocation: FetchContainerForAgoutPickGQL,
    private _fetchHazard: FetchHazardMaterialLevelGQL,
    private _insertUserEvnetLog: Insert_UserEventLogsGQL,
    private _updateAfterQC: UpdateAfterAgOutGQL,
    private _authService: AuthenticationService
  ) {
    this._titleService.setTitle('agout/pick');
  }

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    this.urlParams = { ...this._route.snapshot.queryParams };
    this._commonService.changeNavbar(
      `Pick: ${this.urlParams.OrderNumber}-${this.urlParams.NOSINumber}`
    );
    this.containerList = this.agOutService.containerList;
    this.selectedList = this.agOutService.selectedList;
    this.totalTotes = this.agOutService.totalTotes;
    if (this.totalTotes === null) {
      this.isLoading = true;
      this.locationInfo$ = this._fetchLocation
        .fetch(
          {
            OrderID: Number(this.urlParams.OrderID),
          },
          { fetchPolicy: 'network-only' }
        )
        .pipe(
          switchMap((res) => {
            this.agOutService.changeITNsInOrder(res.data.findOrderLineDetail);
            const containerSet = new Set();
            const ITNSet = new Set<string>();
            const log = this.agOutService.ITNsInOrder.map((node) => {
              containerSet.add(node.Container);
              ITNSet.add(node.InternalTrackingNumber);
              return {
                DistributionCenter: environment.DistributionCenter,
                UserID: Number(
                  JSON.parse(sessionStorage.getItem('userInfo'))._id
                ),
                OrderNumber: this.urlParams.OrderNumber,
                NOSINumber: this.urlParams.NOSINumber,
                InternalTrackingNumber: node.InternalTrackingNumber,
                OrderLineNumber: node.OrderLine.OrderLineNumber,
                PartNumber: node.OrderLine.PartNumber,
                ProductCode: node.OrderLine.ProductCode,
                Quantity: node.OrderLine.Quantity,
                UserEventID: environment.Event_AgOut_Start,
              };
            });
            this.containerList = [...containerSet];
            this.totalTotes = this.containerList.length;
            return this._insertUserEvnetLog.mutate({ log });
          }),
          map(() => {
            //
            this.isLoading = false;
            return true;
          }),
          catchError((error) => {
            this.alertMessage = error;
            this.isLoading = false;
            this.containerInput.nativeElement.select();
            return of(false);
          })
        );
    } else if (this.totalTotes === this.selectedList?.length)
      this.updateSQLAndCheckHazmzd();
  }

  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.containerForm.valid || this.isLoading) {
      this.containerInput.nativeElement.select();
      return;
    }
    this.selectContainer();
  }

  selectContainer(): void {
    const inList = this.containerList.some((node) => {
      if (node.Barcode === this.containerForm.get('containerNumber').value) {
        this.agOutService.changePickedContainer(node.Barcode);
        return true;
      }
      return false;
    });
    if (!inList) {
      this.alertMessage = `Container is not in the list.`;
      this.containerInput.nativeElement.select();
      return;
    }
    const selectedITNs = [];
    this.agOutService.ITNsInOrder.forEach((node) => {
      if (
        node.Container.Barcode ===
        this.containerForm.get('containerNumber').value
      ) {
        selectedITNs.push(node.InternalTrackingNumber);
      }
    });
    this.agOutService.changeContainerList(this.containerList);
    this.agOutService.changeselectedITNs(selectedITNs);
    this.agOutService.changeTotalTotes(this.totalTotes);
    this._router.navigate(['agout/pickitn'], {
      queryParams: this._route.snapshot.queryParams,
    });
    return;
  }

  updateSQLAndCheckHazmzd(): void {
    this.buttonLabel = `Ag Out`;
    this.buttonStyles = `bg-green-500`;
    const fileKey = `${environment.DistributionCenter}${this.urlParams.OrderNumber}${this.urlParams.NOSINumber}`;
    const FileKeyList = [];
    const productSet = new Set<string>();
    const BarcodeList = [];
    this.agOutService.ITNsInOrder.forEach((node) => {
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

    // Process query
    const toteSet = new Set<string>();
    this.agOutService.selectedList.forEach((node) => toteSet.add(node.Barcode));
    this.isLoading = true;
    const log = this.agOutService.ITNsInOrder.map((node) => {
      return {
        DistributionCenter: environment.DistributionCenter,
        UserID: Number(JSON.parse(sessionStorage.getItem('userInfo'))._id),
        OrderNumber: this.urlParams.OrderNumber,
        NOSINumber: this.urlParams.NOSINumber,
        OrderLineNumber: node.OrderLine.OrderLineNumber,
        InternalTrackingNumber: node.InternalTrackingNumber,
        PartNumber: node.OrderLine.PartNumber,
        ProductCode: node.OrderLine.ProductCode,
        Quantity: node.OrderLine.Quantity,
        UserEventID: environment.Event_AgOut_Done,
      };
    });
    this.updateSQL$ = forkJoin({
      updateOrder: this._updateAfterQC.mutate({
        OrderID: Number(this.urlParams.OrderID),
        OrderLineDetail: {
          StatusID: environment.agOutComplete_ID,
        },
        // toteList: [...toteSet],
        log: log,
        DistributionCenter: environment.DistributionCenter,
        OrderNumber: this.urlParams.OrderNumber,
        NOSINumber: this.urlParams.NOSINumber,
        UserOrStatus: 'Packing',
        MerpStatus: String(environment.agOutComplete_ID),
        FileKeyList,
        ActionType: 'A',
        Action: 'line_aggregation_out',
      }),
      checkHazmzd: this._fetchHazard.fetch(
        { ProductList: productList },
        { fetchPolicy: 'network-only' }
      ),
    }).pipe(
      // // throw errors
      // tap((res) => {
      //   let error = '';
      //   if (!res.updateOrder.data.updateMerpOrderStatus.success) {
      //     error += res.updateOrder.data.updateMerpOrderStatus.message;
      //   }
      //   if (error) throw error;
      // }),

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

        this._router.navigate(['/agout'], {
          queryParams: {
            result,
            message,
          },
        });
        this.isLoading = false;
        return true;
      }),

      catchError((error) => {
        this.alertMessage = error;
        this.isLoading = false;
        this.containerInput.nativeElement.select();
        return of(false);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
