import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, Subscription } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import {
  AggregationShelfBarcodeRegex,
  ToteBarcodeRegex,
} from '../../../shared/dataRegex';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import {
  FetchHazardMaterialLevelGQL,
  FetchLocationAndOrderDetailForAgInGQL,
  UpdateAfterAgOutGQL,
  UpdateMerpOrderStatusGQL,
  UpdateMerpWmsLogGQL,
  UpdateSqlAfterAgInGQL,
  VerifyContainerForAggregationInGQL,
} from 'src/app/graphql/aggregationIn.graphql-gen';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnInit, OnDestroy, AfterViewInit {
  // varable for query
  urlParams;
  initInfo$: Observable<any>;
  updateLocation$: Observable<any>;
  OrderNumber: string;
  NOSINumber: string;
  FileKeyListforAgIn = [];
  isLastLine = false;
  isSingleLine = false;
  // control html element
  isLoading = false;
  isRelocation = false;
  newLocation = false;
  buttonLabel = 'place to the shelf';
  locationList = [];
  ITNInfo = [];
  message = '';
  messageType = 'error';

  regex(input: FormControl): { regex: { valid: boolean } } {
    return AggregationShelfBarcodeRegex.test(input.value) ||
      ToteBarcodeRegex.test(input.value) ||
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
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private fetchLocation: FetchLocationAndOrderDetailForAgInGQL,
    private updateAfterAgOut: UpdateAfterAgOutGQL,
    private fetchHazard: FetchHazardMaterialLevelGQL,
    private verifyContainer: VerifyContainerForAggregationInGQL,
    private updateSql: UpdateSqlAfterAgInGQL,
    private updateMerpLog: UpdateMerpWmsLogGQL,
    private updateMerpOrder: UpdateMerpOrderStatusGQL
  ) {}

  @ViewChild('location') locationInput: ElementRef;
  ngOnInit(): void {
    this.urlParams = { ...this.route.snapshot.queryParams };
    this.titleService.setTitle('agin/location');
    this.commonService.changeNavbar(`AGIN: ${this.urlParams.Barcode}`);
    this.isRelocation = this.urlParams.isRelocation === 'true';
    // fetch location and orderlinedetail
    this.isLoading = true;
    const FileKeyListforAgOut = [];
    const ProductList = [];
    this.initInfo$ = this.fetchLocation
      .fetch(
        { OrderLineDetail: { OrderID: Number(this.urlParams.OrderID) } },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        filter((res) => {
          const locationsSet: Set<string> = new Set();
          let totalLines = 0;
          let countLines = 0;
          res.data.findOrderLineDetail.forEach((line) => {
            ++totalLines;
            // set for other queries
            this.OrderNumber = line.Order.OrderNumber;
            this.NOSINumber = line.Order.NOSINumber;
            FileKeyListforAgOut.push(
              `${environment.DistributionCenter}${line.Order.OrderNumber}${line.Order.NOSINumber}${line.OrderLine.OrderLineNumber}ag             ${line.InternalTrackingNumber}`
            );
            // store top 3 locations in Aggregation area.
            if (line.Container.Row === 'AG') {
              locationsSet.add(
                line.Container.Warehouse.concat(
                  line.Container.Row,
                  line.Container.Aisle,
                  line.Container.Section,
                  line.Container.Shelf,
                  line.Container.ShelfDetail,
                  line.Container.Barcode
                )
              );
            }
            if (line._id === Number(this.urlParams.orderLineDetailID)) {
              this.ITNInfo = [
                ['Order#', line.Order.OrderNumber],
                [
                  'Priority',
                  !line.Order.ShipmentMethod.PriorityPinkPaper ? 'Yes' : 'No',
                ],
                ['Customer', line.Order.CustomerNumber],
                ['Quantity', line.Quantity],
                ['ITN Count', ''],
                ['PRC', line.OrderLine.ProductCode],
                ['PartNumber', line.OrderLine.PartNumber],
                ['Shipment', line.Order.ShipmentMethod.ShippingMethod],
              ];
              // set fikekey for ag in
              this.FileKeyListforAgIn.push(
                `${environment.DistributionCenter}${line.Order.OrderNumber}${line.Order.NOSINumber}${line.OrderLine.OrderLineNumber}ag             ${line.InternalTrackingNumber}`
              );
              // set for single line AG out.
              ProductList.push(
                `${line.OrderLine.ProductCode.padEnd(3)}${
                  line.OrderLine.PartNumber
                }`
              );
              // count currentLines without check statusID
              ++countLines;
              return;
            }
            line.StatusID >= environment.agInComplete_ID && ++countLines;
          });
          this.ITNInfo[4][1] = `${countLines} of ${totalLines}`;
          if (locationsSet.size === 0) {
            this.newLocation = true;
            this.buttonLabel = 'New Location';
          }
          if (this.isRelocation) {
            this.newLocation = true;
            this.buttonLabel = 'Relocate';
            this.ITNInfo = [];
          }
          this.isLastLine = countLines === totalLines;
          this.locationList = [...locationsSet];
          if (totalLines === 1) {
            this.isSingleLine = true;
            return true;
          }
          this.isLoading = false;
          return false;
        }),
        // if the order is singleLine order Auto ag out, else complete Observable
        // swith to ag out update observeable
        switchMap(() => {
          return forkJoin({
            updateOrder: this.updateAfterAgOut.mutate(
              {
                OrderID: Number(this.urlParams.OrderID),
                OrderLineDetail: { StatusID: environment.agOutComplete_ID },
                DistributionCenter: environment.DistributionCenter,
                OrderNumber: this.OrderNumber,
                NOSINumber: this.NOSINumber,
                UserOrStatus: 'Packing',
                MerpStatus: String(environment.agOutComplete_ID),
                FileKeyList: FileKeyListforAgOut,
                ActionType: 'A',
                Action: 'line_aggregation_out',
              },
              { fetchPolicy: 'network-only' }
            ),
            checkHazmzd: this.fetchHazard.fetch(
              { ProductList: ProductList },
              { fetchPolicy: 'network-only' }
            ),
          });
        }),
        // Emite errors
        tap((res) => {
          let error = '';
          if (!res.updateOrder.data.updateOrderLineDetail[0]) {
            error += 'Update SQL OrderLineDetail failed.\n';
          }
          if (!res.updateOrder.data.updateMerpOrderStatus.success) {
            error += res.updateOrder.data.updateMerpOrderStatus.message;
          }
          if (error) throw error;
        }),
        // Back to first page after ag out success
        map((res) => {
          let result = 'success';
          let message = `Order complete ${this.OrderNumber}-${this.NOSINumber}`;
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
          this.router.navigate(['agin'], {
            queryParams: {
              result,
              message,
            },
          });
          this.isLoading = false;
        }),
        catchError((error) => {
          this.message = error;
          this.isLoading = false;
          this.locationInput.nativeElement.select();
          return of();
        })
      );
  }

  ngAfterViewInit(): void {
    this.locationInput.nativeElement.focus();
  }

  toggleNewLocation(): void {
    this.newLocation = true;
    this.buttonLabel = `New Location`;
    this.locationInput.nativeElement.select();
  }

  onSubmit(): void {
    this.message = '';
    if (!this.locationForm.valid) {
      return;
    }
    const barcodeInput = this.f.location.value;
    const barcode =
      barcodeInput.length === 8 ? barcodeInput : barcodeInput.replace(/-/g, '');
    if (this.urlParams.Barcode === barcode) {
      this.message = 'Should scan a new Container';
      this.messageType = 'warning';
      this.locationInput.nativeElement.select();
      return;
    }
    if (!this.newLocation && barcode.length > 8) {
      const inList = !this.locationList.every((location) => {
        location.substring(0, 11) !== barcode;
      });
      if (!inList) {
        this.message = 'This container is a new location';
        this.messageType = 'error';
        this.locationInput.nativeElement.select();
        return;
      }
    }
    this.isLoading = true;
    // fetch container data for verification
    this.updateLocation$ = this.verifyContainer
      .fetch(
        { Container: { Barcode: barcode } },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        // Emite Errors
        tap((res) => {
          const container = res.data.findContainer[0];
          if (!container) {
            throw 'Can not find this container';
          }
          if (
            ![environment.toteType_ID, environment.shelfType_ID].includes(
              container.ContainerTypeID
            )
          ) {
            throw 'This container should be tote or shelf';
          }
          if (container.Row !== 'AG') {
            throw 'This container is not in Aggregation area';
          }
          // if target container is tote, check all items in target container have the some order number with source tote.
          if (container.ContainerTypeID === environment.toteType_ID) {
            container.ORDERLINEDETAILs.forEach((line) => {
              // check if the item in container
              if (line.OrderID !== Number(this.urlParams.OrderID)) {
                throw 'This container has other order in it.';
              }
            });
          }
        }),

        // switch to update Observable
        switchMap((res) => {
          const container = res.data.findContainer[0];
          const updatequery = {};
          // if target container is shelf, update source container's location with new location, else release tote to dc.
          let sourceTote = {
            Warehouse: null,
            Row: null,
            Aisle: null,
            Section: null,
            Shelf: null,
            ShelfDetail: null,
          };
          const OrderLineDetail = {
            StatusID: environment.agInComplete_ID,
            ContainerID: container._id,
          };
          if (barcode.length > 8) {
            sourceTote = {
              Warehouse: container.Warehouse,
              Row: container.Row,
              Aisle: container.Aisle,
              Section: container.Section,
              Shelf: container.Shelf,
              ShelfDetail: container.ShelfDetail,
            };
            delete OrderLineDetail.ContainerID;
          }
          // update orderlineDetail's containerID to new input container, and update StatusID as ag in complete.
          // set query for updateSql
          updatequery['updateSql'] = this.updateSql.mutate({
            ContainerID: Number(this.urlParams.toteID),
            Container: sourceTote,
            OrderLineDetail: OrderLineDetail,
          });
          // set query for merp update.
          if (!this.isRelocation) {
            updatequery['updateMerpLog'] = this.updateMerpLog.mutate(
              {
                DistributionCenter: environment.DistributionCenter,
                FileKeyList: this.FileKeyListforAgIn,
                ActionType: 'A',
                Action: 'line_aggregation_in',
              },
              { fetchPolicy: 'network-only' }
            );
            if (this.isLastLine) {
              updatequery['updateMerpOrder'] = this.updateMerpOrder.mutate(
                {
                  OrderNumber: this.OrderNumber,
                  NOSINumber: this.NOSINumber,
                  Status: String(environment.agInComplete_ID),
                  UserOrStatus: 'AGGREGATION-OUT',
                },
                { fetchPolicy: 'network-only' }
              );
            }
          }
          return forkJoin(updatequery);
        }),
        // Emit Errors
        tap((res: any) => {
          let error: string;
          if (!res.updateSql.data.updateOrderLineDetail[0]) {
            error += `\nFail to update SQL OrderLineDetail.`;
          }
          if (!res.updateSql.data.updateContainer[0]) {
            error += `\nFail to update SQL Container.`;
          }
          if (
            res.updateMerpOrder &&
            !res.updateMerpOrder.data.updateMerpOrderStatus.success
          ) {
            error += res.updateMerpOrder.data.updateMerpOrderStatus.message;
          }
          if (error)
            throw `${this.OrderNumber}-${this.NOSINumber}`.concat(error);
        }),
        // Navgate to first after update success
        map(() => {
          let message = `Place in ${barcode}.`;
          if (this.isLastLine) {
            message += `\nOrder ${this.OrderNumber}-${this.NOSINumber} complete AG In.`;
          }
          this.router.navigate(['agin'], {
            queryParams: {
              result: 'info',
              message,
            },
          });
        }),
        catchError((error) => {
          this.message = error;
          this.isLoading = false;
          this.locationInput.nativeElement.select();
          return of();
        })
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
