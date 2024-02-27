import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, Subscription } from 'rxjs';

import {
  AggregationShelfBarcodeRegex,
  ToteBarcodeRegex,
} from '../../../shared/utils/dataRegex';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { Title } from '@angular/platform-browser';
import {
  CountOrderItnsFromMerpGQL,
  FetchHazardMaterialLevelGQL,
  FetchLocationAndOrderDetailForAgInGQL,
  UpdateAfterAgOutGQL,
  VerifyContainerForAggregationInGQL,
} from 'src/app/graphql/aggregationIn.graphql-gen';
import {
  AggregationInService,
  endContainer,
  outsetContainer,
} from '../aggregation-in.server';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FocusInvlidInputDirective } from '../../../shared/directives/focusInvalidInput.directive';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NgIf, NgFor, NgClass, AsyncPipe, SlicePipe } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  standalone: true,
  imports: [
    NzGridModule,
    NgIf,
    NzSkeletonModule,
    NgFor,
    FormsModule,
    NzFormModule,
    FocusInvlidInputDirective,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzAlertModule,
    NgClass,
    AsyncPipe,
    SlicePipe,
  ],
})
export class LocationComponent implements OnInit, OnDestroy, AfterViewInit {
  // varable for query
  private OrderNumber: string;
  private NOSINumber: string;
  private OrderLineNumber: number;
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
  alertMessage = '';
  alertType = 'error';
  isLastLine = false;

  regex(input: UntypedFormControl): { regex: { valid: boolean } } {
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
  userInfo = inject(StorageUserInfoService);
  constructor(
    private _fb: UntypedFormBuilder,
    private _title: NavbarTitleService,
    private _titleService: Title,
    private _router: Router,
    private _fetchLocation: FetchLocationAndOrderDetailForAgInGQL,
    private _updateAfterAgOut: UpdateAfterAgOutGQL,
    private _fetchHazard: FetchHazardMaterialLevelGQL,
    private _verifyContainer: VerifyContainerForAggregationInGQL,
    private _countOrderItns: CountOrderItnsFromMerpGQL,
    private _agInService: AggregationInService,
    private _insertLog: Create_EventLogsGQL,
    private _eventLog: EventLogService
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
    this._title.update(`AGIN: ${this.outsetContainer.Barcode}`);
    // fetch location and orderlinedetail
    this.isLoading = true;
    const FileKeyListforAgOut = [];
    const ProductList = [];
    let singleITN = '';
    this.initInfo$ = this._fetchLocation
      .fetch(
        { OrderID: this.outsetContainer.OrderID },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        // if the order is singleLine order Auto ag out, else complete Observable
        filter((res) => {
          const locationsSet: Set<string> = new Set();
          let totalLines = 0;
          let countLines = 0;
          res.data.findOrderLineDetails.forEach((line) => {
            ++totalLines;
            if (line.Inventory) {
              // set for other queries
              singleITN = line.Inventory.InventoryTrackingNumber;
              this.OrderNumber = this.outsetContainer.OrderNumber;
              this.NOSINumber = this.outsetContainer.NOSINumber;
              FileKeyListforAgOut.push(
                `${this.userInfo.distributionCenter}${this.OrderNumber}${this.NOSINumber}${this.outsetContainer.ITNsInTote[0].OrderLineNumber}ag             ${line.Inventory.InventoryTrackingNumber}`
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

              const toteIndex = this.outsetContainer.ITNsInTote.findIndex(
                (element) => line._id === element.detaileID
              );
              if (toteIndex >= 0) {
                this.ITNInfo = [
                  ['Order#', this.OrderNumber],
                  ['Priority', !this.outsetContainer.Priority ? 'Yes' : 'No'],
                  ['Customer', this.outsetContainer.CustomerNumber],
                  ['Quantity', line.Quantity],
                  ['ITN Count', ''],
                  [
                    'PRC',
                    this.outsetContainer.ITNsInTote[toteIndex].ProductCode,
                  ],
                  [
                    'PartNumber',
                    this.outsetContainer.ITNsInTote[toteIndex].PartNumber,
                  ],
                  ['Shipment', this.outsetContainer.ShipmentMethodDescription],
                ];
                // set fikekey for ag in
                this.FileKeyListforAgIn.push(
                  `${this.userInfo.distributionCenter}${this.OrderNumber}${this.NOSINumber}${this.outsetContainer.ITNsInTote[toteIndex].OrderLineNumber}ag             ${line.Inventory.InventoryTrackingNumber}`
                );
                // set for single line AG out.
                ProductList.push(
                  `${this.outsetContainer.ITNsInTote[
                    toteIndex
                  ].ProductCode.padEnd(3)}${
                    this.outsetContainer.ITNsInTote[toteIndex].PartNumber
                  }`
                );
                // count currentLines without check statusID
                ++countLines;
                return;
              }
              line.StatusID >= sqlData.agInComplete_ID && ++countLines;
            }
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
              LocationCode: this.userInfo.distributionCenter,
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
              OrderLineDetail: { StatusID: sqlData.agOutComplete_ID },
              DistributionCenter: this.userInfo.distributionCenter,
              toteList: [this.outsetContainer.Barcode],
              OrderNumber: this.OrderNumber,
              NOSINumber: this.NOSINumber,
              UserOrStatus: 'Packing',
              MerpStatus: String(sqlData.agOutComplete_ID),
              FileKeyList: FileKeyListforAgOut,
              ActionType: 'A',
              Action: 'line_aggregation_out',
              ITNList: [
                {
                  ITN: singleITN,
                  BinLocation: 'PACKING',
                  User: this.userInfo.userName,
                },
              ],
            }),
            checkHazmzd: this._fetchHazard.fetch(
              { ProductList: ProductList },
              { fetchPolicy: 'network-only' }
            ),
          });
        }),

        // Back to first page after ag out success
        switchMap((res) => {
          const oldLogs = [
            {
              UserName: this.userInfo.userName,
              OrderNumber: this.OrderNumber,
              NOSINumber: this.NOSINumber,
              InventoryTrackingNumber: singleITN,
              UserEventID: sqlData.Event_AgIn_SingleITNAgOut,
              Message: `Single ITN Ag out ${this.outsetContainer.Barcode}`,
              CustomerNumber: this.outsetContainer.CustomerNumber,
              CustomerTier: this.outsetContainer.CustomerTier,
              DistributionCenter: this.userInfo.distributionCenter,
              OrderLineNumber:
                this.outsetContainer.ITNsInTote[0].OrderLineNumber,
              PartNumber: this.outsetContainer.ITNsInTote[0].PartNumber,
              ProductCode: this.outsetContainer.ITNsInTote[0].ProductCode,
              ProductTier: this.outsetContainer.ITNsInTote[0].ProductTier,
              Quantity: this.outsetContainer.ITNsInTote[0].Quantity,
              ParentITN: this.outsetContainer.ITNsInTote[0].ParentITN,
              ShipmentMethod: this.outsetContainer.ShipmentMethod,
              ShipmentMethodDescription:
                this.outsetContainer.ShipmentMethodDescription,
              Priority: this.outsetContainer.Priority,
              WMSPriority: this.outsetContainer.ITNsInTote[0].WMSPriority,
            },
          ];
          const eventLogs = {
            ...this._eventLog.eventLog,
            EventTypeID: sqlData.Event_AgIn_SingleITNAgOut,
            Log: JSON.stringify({
              ...JSON.parse(this._eventLog.eventLog.Log),
              InventoryTrackingNumber: singleITN,
              OrderLineNumber:
                this.outsetContainer.ITNsInTote[0].OrderLineNumber,
              PartNumber: this.outsetContainer.ITNsInTote[0].PartNumber,
              ProductCode: this.outsetContainer.ITNsInTote[0].ProductCode,
              ProductTier: this.outsetContainer.ITNsInTote[0].ProductTier,
              Quantity: this.outsetContainer.ITNsInTote[0].Quantity,
              ParentITN: this.outsetContainer.ITNsInTote[0].ParentITN,
              WMSPriority: this.outsetContainer.ITNsInTote[0].WMSPriority,
              Message: `Single ITN Ag out ${this.outsetContainer.Barcode}`,
            }),
          };
          // return the first step
          this.type = 'success';
          this.message = `Order complete ${this.OrderNumber}-${this.NOSINumber}`;
          if (
            res.checkHazmzd.data.fetchProductInfoFromMerp.some(
              (node) =>
                /^[\w]+$/.test(node.HazardMaterialLevel.trim()) &&
                node.HazardMaterialLevel.trim() !== 'N'
            )
          ) {
            this.type = 'warning';
            this.message += `\nThis order contains hazardous materials`;
          }
          if (!res.updateOrder.data.deleteAndInsertRouteTable) {
            this.type = 'error';
            this.message += '\nConveyor Error!';
          }
          return this._insertLog.mutate({ oldLogs, eventLogs });
        }),
        map(() => {
          this.isLoading = false;
          this._router.navigate(['agin'], {
            queryParams: {
              type: this.type,
              message: this.message,
            },
          });
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
  private type;
  private message;

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
        {
          Barcode: Barcode,
          DistributionCenter: this.userInfo.distributionCenter,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        // Emite Errors
        tap((res) => {
          const container = res.data.findContainer;
          if (!container) {
            throw 'Can not find this container';
          }
          if (
            ![sqlData.toteType_ID, sqlData.shelfType_ID].includes(
              container.ContainerTypeID
            )
          ) {
            throw 'This container should be tote or shelf';
          }
          if (container.Row !== 'AG') {
            throw 'This container is not in Aggregation area';
          }
          // When the order is hold, the record still in Invenotry table, but the record in the OrderLineDetail is deleted. Need to exclude this situation.
          const ITNList = res.data.findContainer.INVENTORies.filter((item) => {
            return item.ORDERLINEDETAILs.length !== 0;
          });
          // if target container is mobile, check all items in target container have the some order number with source tote.
          if (container.ContainerType.IsMobile) {
            ITNList.forEach((line) => {
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
        // store the end container info
        map((res) => {
          const container = res.data.findContainer;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
