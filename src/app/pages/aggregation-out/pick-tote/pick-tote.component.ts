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
import { AggregationOutService } from '../aggregation-out.server';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/sqlData';

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
    private _updateAfterQC: UpdateAfterAgOutGQL
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
            this.agOutService.changeITNsInOrder(res.data.findOrderLineDetails);
            const containerSet = new Set();
            const ITNSet = new Set<string>();
            const log = res.data.findOrderLineDetails.map((node) => {
              ITNSet.add(node.Inventory.InventoryTrackingNumber);
              containerSet.add(node.Inventory.Container);
              return {
                UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
                OrderNumber: this.urlParams.OrderNumber,
                NOSINumber: this.urlParams.NOSINumber,
                InventoryTrackingNumber: node.Inventory.InventoryTrackingNumber,
                UserEventID: sqlData.Event_AgOut_Start,
                OrderLineNumber: node.OrderLine.OrderLineNumber,
                CustomerNumber: node.Order.Customer?.CustomerNumber,
                CustomerTier: node.Order.Customer?.CustomerTier,
                DistributionCenter: environment.DistributionCenter,
                PartNumber: node.Inventory.Product?.PartNumber,
                ProductCode:
                  node.Inventory.Product?.ProductCode.ProductCodeNumber,
                ProductTier: node.Inventory.Product?.ProductTier,
                Quantity: node.Quantity,
                ParentITN: node.Inventory.ParentITN,
                ShipmentMethod: node.Order.ShipmentMethod?._id,
                ShipmentMethodDescription:
                  node.Order.ShipmentMethod?.ShippingMethod,
                Priority: node.Order.ShipmentMethod?.PriorityPinkPaper,
                WMSPriority: node.WMSPriority,
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
        node.Inventory.Container.Barcode ===
        this.containerForm.get('containerNumber').value
      ) {
        selectedITNs.push(node.Inventory.InventoryTrackingNumber);
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
        )}packing        ${node.Inventory.InventoryTrackingNumber}`
      );
      BarcodeList.push(node.Inventory.Container.Barcode);
      productSet.add(
        `${node.Inventory.Product.ProductCode.ProductCodeNumber.padEnd(3)}${
          node.Inventory.Product.PartNumber
        }`
      );
    });
    const productList = [...productSet];

    // Process query
    const toteSet = new Set<string>();
    this.agOutService.selectedList.forEach((node) => toteSet.add(node.Barcode));
    this.isLoading = true;
    const log = this.agOutService.ITNsInOrder.map((node) => {
      return {
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        OrderNumber: this.urlParams.OrderNumber,
        NOSINumber: this.urlParams.NOSINumber,
        InventoryTrackingNumber: node.Inventory.InventoryTrackingNumber,
        UserEventID: sqlData.Event_AgOut_Done,
        OrderLineNumber: node.OrderLine.OrderLineNumber,
        CustomerNumber: node.Order.Customer?.CustomerNumber,
        CustomerTier: node.Order.Customer?.CustomerTier,
        DistributionCenter: environment.DistributionCenter,
        PartNumber: node.Inventory.Product?.PartNumber,
        ProductCode: node.Inventory.Product?.ProductCode.ProductCodeNumber,
        ProductTier: node.Inventory.Product?.ProductTier,
        Quantity: node.Quantity,
        ParentITN: node.Inventory.ParentITN,
        ShipmentMethod: node.Order.ShipmentMethod?._id,
        ShipmentMethodDescription: node.Order.ShipmentMethod?.ShippingMethod,
        Priority: node.Order.ShipmentMethod?.PriorityPinkPaper,
        WMSPriority: node.WMSPriority,
      };
    });
    this.updateSQL$ = forkJoin({
      updateOrder: this._updateAfterQC.mutate({
        OrderID: Number(this.urlParams.OrderID),
        OrderLineDetail: {
          StatusID: sqlData.agOutComplete_ID,
        },
        // toteList: [...toteSet],
        log: log,
        DistributionCenter: environment.DistributionCenter,
        OrderNumber: this.urlParams.OrderNumber,
        NOSINumber: this.urlParams.NOSINumber,
        UserOrStatus: 'Packing',
        MerpStatus: String(sqlData.agOutComplete_ID),
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
        let type = 'success';
        let message = `Order complete: ${this.urlParams.OrderNumber}-${this.urlParams.NOSINumber}`;
        if (
          res.checkHazmzd.data.fetchProductInfoFromMerp.some(
            (node) =>
              /^[\w]+$/.test(node.HazardMaterialLevel.trim()) &&
              node.HazardMaterialLevel.trim() !== 'N'
          )
        ) {
          type = 'warning';
          message = message + `\nThis order contains hazardous materials`;
        }

        this._router.navigate(['/agout'], {
          queryParams: {
            type,
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
