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
import { Router } from '@angular/router';
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
  CountOrderItnsFromMerpGQL,
  FetchHazardMaterialLevelGQL,
  FetchLocationAndOrderDetailForAgInGQL,
  UpdateAfterAgOutGQL,
  VerifyContainerForAggregationInGQL,
} from 'src/app/graphql/aggregationIn.graphql-gen';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import {
  AggregationInService,
  endContainer,
  outsetContainer,
} from '../aggregation-in.server';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnInit, OnDestroy, AfterViewInit {
  // varable for query
  private OrderNumber: string;
  private NOSINumber: string;
  private FileKeyListforAgIn = [];
  // control html element
  outsetContainer: outsetContainer;
  initInfo$: Observable<boolean>;
  verifyContainer$: Observable<boolean>;
  isLoading = false;
  newLocation = false;
  buttonLabel = 'Relocate';
  locationList: string[];
  ITNInfo = [];
  ITNsInTote = [];
  alertMessage = '';
  alertType = 'error';
  isLastLine = false;

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

  locationForm = this._fb.group({
    location: ['', [Validators.required, this.regex]],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.locationForm.controls;
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _titleService: Title,
    private _router: Router,
    private _fetchLocation: FetchLocationAndOrderDetailForAgInGQL,
    private _updateAfterAgOut: UpdateAfterAgOutGQL,
    private _fetchHazard: FetchHazardMaterialLevelGQL,
    private _verifyContainer: VerifyContainerForAggregationInGQL,
    private _gtmService: GoogleTagManagerService,
    private _authService: AuthenticationService,
    private _countOrderItns: CountOrderItnsFromMerpGQL,
    private _agInService: AggregationInService
  ) {
    this._titleService.setTitle('agin/location');
  }

  @ViewChild('location') locationInput: ElementRef;
  ngOnInit(): void {
    this.outsetContainer = this._agInService.outsetContainer;
    if (!this.outsetContainer) {
      this._router.navigate(['agin']);
      return;
    }
    this._agInService.changeEndContainer(null);
    this._commonService.changeNavbar(`AGIN: ${this.outsetContainer.Barcode}`);
    // fetch location and orderlinedetail
    this.isLoading = true;
    const FileKeyListforAgOut = [];
    const ProductList = [];
    let singleITN = '';
    this.initInfo$ = this._fetchLocation
      .fetch(
        { OrderLineDetail: { OrderID: this.outsetContainer.OrderID } },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        // if the order is singleLine order Auto ag out, else complete Observable
        filter((res) => {
          const locationsSet: Set<string> = new Set();
          let totalLines = 0;
          let countLines = 0;
          res.data.findOrderLineDetail.forEach((line) => {
            ++totalLines;
            // set for other queries
            singleITN = line.Inventory.InventoryTrackingNumber;
            this.OrderNumber = line.Order.OrderNumber;
            this.NOSINumber = line.Order.NOSINumber;
            FileKeyListforAgOut.push(
              `${environment.DistributionCenter}${line.Order.OrderNumber}${line.Order.NOSINumber}${line.OrderLine.OrderLineNumber}ag             ${line.Inventory.InventoryTrackingNumber}`
            );
            // store locations in Aggregation area.
            if (line.Inventory.Container.Row === 'AG') {
              locationsSet.add(
                line.Inventory.Container.Warehouse.concat(
                  line.Inventory.Container.Row,
                  line.Inventory.Container.Aisle,
                  line.Inventory.Container.Section,
                  line.Inventory.Container.Shelf,
                  line.Inventory.Container.ShelfDetail,
                  line.Inventory.Container.Barcode
                )
              );
            }
            // add ITN to list if there are in the same tote.
            if (
              line.Inventory.Container.Barcode === this.outsetContainer.Barcode
            ) {
              this.ITNsInTote.push(line.Inventory.InventoryTrackingNumber);
            }
            if (line._id === this.outsetContainer.orderLineDetailID) {
              this.ITNInfo = [
                ['Order#', line.Order.OrderNumber],
                [
                  'Priority',
                  !line.Order.ShipmentMethod.PriorityPinkPaper ? 'Yes' : 'No',
                ],
                ['Customer', line.Order.CustomerNumber],
                ['Quantity', line.Quantity],
                ['ITN Count', ''],
                ['PRC', line.Inventory.Product.ProductCode],
                ['PartNumber', line.Inventory.Product.PartNumber],
                ['Shipment', line.Order.ShipmentMethod.ShippingMethod],
              ];
              // set fikekey for ag in
              this.FileKeyListforAgIn.push(
                `${environment.DistributionCenter}${line.Order.OrderNumber}${line.Order.NOSINumber}${line.OrderLine.OrderLineNumber}ag             ${line.Inventory.InventoryTrackingNumber}`
              );
              // set for single line AG out.
              ProductList.push(
                `${line.Inventory.Product.ProductCode.padEnd(3)}${
                  line.Inventory.Product.PartNumber
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
          if (this.outsetContainer.isRelocation) {
            this.newLocation = true;
            this.buttonLabel = 'Relocate';
            this.ITNInfo = [];
          }
          this.isLastLine = countLines === totalLines;
          this.locationList = [...locationsSet];
          if (totalLines === 1) {
            return true;
          }
          // if not single Line ITN stop here.
          this.isLoading = false;
          return false;
        }),
        // fetch ITN count from Merp
        switchMap(() => {
          return this._countOrderItns.fetch(
            {
              LocationCode: environment.DistributionCenter,
              OrderNumber: this.OrderNumber,
              NOSINumber: this.NOSINumber,
            },
            { fetchPolicy: 'network-only' }
          );
        }),
        // filter if the merp count ITN is not 1
        filter((res) => {
          if (res.data.countOrderItns === 1) {
            return true;
          }
          this.isLoading = false;
          return false;
        }),

        // swith to ag out update observeable If this is single Line ITN
        switchMap(() => {
          return forkJoin({
            updateOrder: this._updateAfterAgOut.mutate({
              OrderID: Number(this.outsetContainer.OrderID),
              OrderLineDetail: { StatusID: environment.agOutComplete_ID },
              DistributionCenter: environment.DistributionCenter,
              toteList: [this.outsetContainer.Barcode],
              log: [
                {
                  UserID: Number(
                    JSON.parse(sessionStorage.getItem('userInfo'))._id
                  ),
                  OrderNumber: this.OrderNumber,
                  NOSINumber: this.NOSINumber,
                  InventoryTrackingNumber: singleITN,
                  UserEventID: environment.Event_AgIn_SingleITNAgOut,
                  Message: `Single ITN Ag out ${this.outsetContainer.Barcode}`,
                },
              ],
              OrderNumber: this.OrderNumber,
              NOSINumber: this.NOSINumber,
              UserOrStatus: 'Packing',
              MerpStatus: String(environment.agOutComplete_ID),
              FileKeyList: FileKeyListforAgOut,
              ActionType: 'A',
              Action: 'line_aggregation_out',
            }),
            checkHazmzd: this._fetchHazard.fetch(
              { ProductList: ProductList },
              { fetchPolicy: 'network-only' }
            ),
          });
        }),

        // Emite errors
        // tap((res) => {
        // let error = '';
        // if (!res.updateOrder.data.updateMerpOrderStatus.success) {
        //   error += res.updateOrder.data.updateMerpOrderStatus.message;
        // }
        // if (error) throw error;
        // }),

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

          // return the first step
          this.sendGTM();
          this._router.navigate(['agin'], {
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
          this.locationInput.nativeElement.select();
          return of(false);
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
    this.alertMessage = '';
    if (!this.locationForm.valid || this.isLoading) {
      return;
    }
    const barcodeInput = this.f.location.value;
    const Barcode =
      barcodeInput.length === 8 ? barcodeInput : barcodeInput.replace(/-/g, '');
    const type = barcodeInput.length === 8 ? 'tote' : 'shelf';
    if (this.outsetContainer.Barcode === Barcode) {
      this.alertMessage = 'Should scan a new Container';
      this.alertType = 'warning';
      this.locationInput.nativeElement.select();
      return;
    }
    if (!this.newLocation && Barcode.length > 8) {
      const inList = this.locationList.some((location) => {
        return location.substring(0, 11) === Barcode;
      });
      if (!inList) {
        this.alertMessage = 'This container is a new location';
        this.alertType = 'error';
        this.locationInput.nativeElement.select();
        return;
      }
    }

    // if pass all verifercation jump to verify page
    this.isLoading = true;
    this.verifyContainer$ = this._verifyContainer
      .fetch(
        { Container: { Barcode: Barcode } },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        // Emite Errors
        tap((res) => {
          const container = res.data.findContainer;
          if (!container.length) {
            throw 'Can not find this container';
          }
          if (
            ![environment.toteType_ID, environment.shelfType_ID].includes(
              container[0].ContainerTypeID
            )
          ) {
            throw 'This container should be tote or shelf';
          }
          if (container[0].Row !== 'AG') {
            throw 'This container is not in Aggregation area';
          }
          // if target container is mobile, check all items in target container have the some order number with source tote.
          if (container[0].ContainerType.IsMobile) {
            container[0].INVENTORies.forEach((line) => {
              // check if the item in container
              if (
                line.ORDERLINEDETAILs[0].OrderID !==
                this.outsetContainer.OrderID
              ) {
                throw 'This container has other order in it.';
              }
            });
          }
        }),

        map((res) => {
          const container = res.data.findContainer[0];
          const endContainer: endContainer = {
            Barcode: barcodeInput,
            type,
            isLastLine: this.isLastLine,
            location: {
              Warehouse: container.Warehouse,
              Row: container.Row,
              Aisle: container.Aisle,
              Section: container.Section,
              Shelf: container.Shelf,
              ShelfDetail: container.ShelfDetail,
            },
            OrderNumber: this.OrderNumber,
            NOSINumber: this.NOSINumber,
            containerID: container._id,
            ITNsInTote: this.ITNsInTote,
            FileKeyListforAgIn: this.FileKeyListforAgIn,
          };
          this._agInService.changeEndContainer(endContainer);
          this._router.navigate(['agin/verifytote']);
          return true;
        }),

        catchError((error) => {
          this.alertMessage = error;
          this.isLoading = false;
          this.locationInput.nativeElement.select();
          return of(false);
        })
      );
  }

  sendGTM(): void {
    // this.gtmService.pushTag({
    //   event: 'AggregationOut',
    //   userID: this.authService.userName,
    // });
    // this.gtmService.pushTag({
    //   event: 'AggregationIn',
    //   userID: this.authService.userName,
    // });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
