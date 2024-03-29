import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ToteBarcodeRegex } from '../../shared/utils/dataRegex';
import { VerifyContainerForAggregationInGQL } from '../../graphql/aggregationIn.graphql-gen';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { AggregationInService, outsetContainer } from './aggregation-in.server';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';

@Component({
  selector: 'aggregation-in',
  templateUrl: './aggregation-in.component.html',
})
export class AggregationInComponent implements OnInit, AfterViewInit {
  title = 'Aggregation In';
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  query$ = new Observable();

  containerForm = new FormGroup({
    containerNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(ToteBarcodeRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.containerForm.controls;
  }

  userInfo = inject(StorageUserInfoService);
  constructor(
    private _route: ActivatedRoute,
    private _title: NavbarTitleService,
    private _router: Router,
    private _titleService: Title,
    private _verifyContainer: VerifyContainerForAggregationInGQL,
    private _insertEventlog: Create_EventLogsGQL,
    private _agInService: AggregationInService,
    private _eventLog: EventLogService
  ) {
    this._agInService.changeOutsetContainer(null);
    this._agInService.changeEndContainer(null);
    this._title.update(this.title);
    this._titleService.setTitle('agin');
  }

  @ViewChild('containerNumber') containerInput!: ElementRef;
  ngOnInit(): void {
    this.alertType = this._route.snapshot.queryParams['type'];
    this.alertMessage = this._route.snapshot.queryParams['message'];
    this._eventLog.initEventLog({
      UserName: this.userInfo.userName,
      EventTypeID: sqlData.Event_AgIn_Start,
      Log: '',
    });
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
    this.isLoading = true;
    let ITNList = [];
    this.query$ = this._verifyContainer
      .fetch(
        {
          DistributionCenter: this.userInfo.distributionCenter,
          Barcode: this.containerForm.value.containerNumber,
        },
        { fetchPolicy: 'network-only' }
      )

      .pipe(
        take(1),
        tap((res) => {
          // const container = JSON.parse(JSON.stringify(res.data.findContainer));
          const container = res.data.findContainer;
          if (!container) throw 'Container not found!';
          // only accepte mobile container
          if (!container.ContainerType.IsMobile)
            throw 'This container is not mobile!';
          // When the order is hold, the record still exist in Invenotry table, but the OrderLineDetail will be deleted. Need to exclude this situation.
          ITNList = res.data.findContainer.INVENTORies.filter((item) => {
            return item.ORDERLINEDETAILs.length !== 0;
          });
          if (ITNList?.length === 0) throw 'No item in this container!';
          // Check if container has OrderLineDetail in it
          if (
            !ITNList.some((item) => {
              return item.ORDERLINEDETAILs.length !== 0;
            })
          ) {
            throw new Error('No order in this container!');
          }
          if (
            !ITNList.every((line, i, arr) => {
              // verify all line have the same orderID and statusID in the tote
              return (
                line.ORDERLINEDETAILs[0].OrderID ===
                  arr[0].ORDERLINEDETAILs[0].OrderID &&
                [60, 63].includes(line.ORDERLINEDETAILs[0].StatusID)
              );
            })
          )
            throw 'Have different order or status in the container.';
          // only allow status is agIn complete and qc complete
          if (
            ITNList[0].ORDERLINEDETAILs[0]?.StatusID < sqlData.qcComplete_ID ||
            ITNList[0].ORDERLINEDETAILs[0]?.StatusID >= sqlData.agOutComplete_ID
          )
            throw "OrderLine's status is invalid.";
        }),
        switchMap((res) => {
          const container = res.data.findContainer;
          const oldLogs = [];
          const eventLogs = [];
          const outsetContainer: outsetContainer = {
            toteID: container._id,
            Barcode: container.Barcode,
            OrderID: ITNList[0].ORDERLINEDETAILs[0].OrderID,
            OrderNumber: ITNList[0].ORDERLINEDETAILs[0].Order.OrderNumber,
            NOSINumber: ITNList[0].ORDERLINEDETAILs[0].Order.NOSINumber,
            CustomerNumber:
              ITNList[0].ORDERLINEDETAILs[0].Order.Customer?.CustomerNumber,
            CustomerTier:
              ITNList[0].ORDERLINEDETAILs[0].Order.Customer?.CustomerTier,
            ShipmentMethod:
              ITNList[0].ORDERLINEDETAILs[0].Order.ShipmentMethod?._id,
            ShipmentMethodDescription:
              ITNList[0].ORDERLINEDETAILs[0].Order.ShipmentMethod
                ?.ShippingMethod,
            Priority:
              ITNList[0].ORDERLINEDETAILs[0].Order.ShipmentMethod
                ?.PriorityPinkPaper,
            ITNsInTote: [],
            isRelocation:
              ITNList[0].ORDERLINEDETAILs[0].StatusID ===
              sqlData.agInComplete_ID,
          };
          // get all ITN in tote
          ITNList.forEach((Inventory) => {
            if (Inventory.InventoryTrackingNumber) {
              const detail = Inventory.ORDERLINEDETAILs[0];
              outsetContainer.ITNsInTote.push({
                detaileID: Inventory.ORDERLINEDETAILs[0]._id,
                InventoryID: Inventory._id,
                ITN: Inventory.InventoryTrackingNumber,
                OrderLineNumber: detail.OrderLine.OrderLineNumber,
                PartNumber: Inventory.Product?.PartNumber,
                ProductCode: Inventory.Product?.ProductCode.ProductCodeNumber,
                ProductTier: Inventory.Product?.ProductTier,
                WMSPriority: detail.WMSPriority,
                ParentITN: Inventory.ParentITN,
                Quantity: detail.Quantity,
              });
            }
          });
          this._eventLog.updateEventLog({
            ...this._eventLog.eventLog,
            Log: JSON.stringify({
              OrderNumber: outsetContainer.OrderNumber,
              NOSINumber: outsetContainer.NOSINumber,
              CustomerNumber: outsetContainer.CustomerNumber,
              CustomerTier: outsetContainer.CustomerTier,
              DistributionCenter: this.userInfo.distributionCenter,
              ShipmentMethod: outsetContainer.ShipmentMethod,
              ShipmentMethodDescription:
                outsetContainer.ShipmentMethodDescription,
              Priority: outsetContainer.Priority,
              Message: `Start ${container.Barcode}`,
            }),
          });
          outsetContainer.ITNsInTote.forEach((item) => {
            oldLogs.push({
              UserName: this.userInfo.userName,
              OrderNumber: outsetContainer.OrderNumber,
              NOSINumber: outsetContainer.NOSINumber,
              OrderLineNumber: item.OrderLineNumber,
              InventoryTrackingNumber: item.ITN,
              UserEventID: sqlData.Event_AgIn_Start,
              Message: `Start ${container.Barcode}`,
              CustomerNumber: outsetContainer.CustomerNumber,
              CustomerTier: outsetContainer.CustomerTier,
              DistributionCenter: this.userInfo.distributionCenter,
              PartNumber: item.PartNumber,
              ProductCode: item.ProductCode,
              ProductTier: item.ProductTier,
              Quantity: item.Quantity,
              ParentITN: item.ParentITN,
              ShipmentMethod: outsetContainer.ShipmentMethod,
              ShipmentMethodDescription:
                outsetContainer.ShipmentMethodDescription,
              Priority: outsetContainer.Priority,
              WMSPriority: item.WMSPriority,
            });
            eventLogs.push({
              ...this._eventLog.eventLog,
              Log: JSON.stringify({
                ...JSON.parse(this._eventLog.eventLog.Log),
                OrderLineNumber: item.OrderLineNumber,
                InventoryTrackingNumber: item.ITN,
                PartNumber: item.PartNumber,
                ProductCode: item.ProductCode,
                ProductTier: item.ProductTier,
                Quantity: item.Quantity,
                ParentITN: item.ParentITN,
                WMSPriority: item.WMSPriority,
              }),
            });
          });
          // if pass all naveigate to next page
          this._agInService.changeOutsetContainer(outsetContainer);
          return this._insertEventlog.mutate({
            oldLogs,
            eventLogs,
          });
        }),
        map(() => {
          this.isLoading = false;
          this._router.navigate(['agin/location']);
          return true;
        }),
        catchError((err) => {
          this.alertMessage = err;
          this.alertType = 'error';
          this.isLoading = false;
          return [];
        })
      );
  }
}
