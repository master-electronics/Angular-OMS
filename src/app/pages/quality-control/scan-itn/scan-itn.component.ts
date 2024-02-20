import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { QualityControlService, itemParams } from '../quality-control.server';
import { ITNBarcodeRegex } from '../../../shared/utils/dataRegex';
import { switchMap, tap } from 'rxjs/operators';
import { VerifyItNforQcGQL } from 'src/app/graphql/qualityControl.graphql-gen';
import { Title } from '@angular/platform-browser';
import {
  ChangeItnListForMerpGQL,
  Create_EventLogsGQL,
  Insert_UserEventLogsGQL,
  Update_Merp_QcBinGQL,
} from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NgIf } from '@angular/common';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FocusInvlidInputDirective } from '../../../shared/directives/focusInvalidInput.directive';
import { NzFormModule } from 'ng-zorro-antd/form';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Component({
  selector: 'scan-itn',
  templateUrl: './scan-itn.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    FocusInvlidInputDirective,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NgIf,
    NzAlertModule,
  ],
})
export class ScanItnComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  itemInfo: itemParams;
  private subscription = new Subscription();
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private titleService: Title,
    public qcService: QualityControlService,
    private logService: EventLogService,
    private eventLog: Create_EventLogsGQL,
    private _userInfo: StorageUserInfoService,
    private verifyITNQC: VerifyItNforQcGQL
  ) {
    this.titleService.setTitle('qc/scanitn');
  }

  @ViewChild('ITN') ITNInput!: ElementRef;
  ITNForm = this.fb.group({
    ITN: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.qcService.changeTab(['process', 'wait', 'wait', 'wait']);
    this.logService.initEventLog({
      UserName: this._userInfo.userName,
      EventTypeID: sqlData.Event_QC_Start,
      Log: '',
    });
    this.qcService.changeGlobalMessages(null);
    this.qcService.changeItemParams(null);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ITNInput.nativeElement.select();
    });
  }

  onSubmit(): void {
    this.qcService.alertMessage.set('');
    if (this.ITNForm.invalid || this.isLoading) {
      return;
    }
    this.verfiyITN(this.ITNForm.get('ITN').value.trim().toUpperCase());
  }

  verfiyITN(ITN: string): void {
    this.isLoading = true;
    const holdRegex = /^hld*/gi;
    const autostoreRegex = /^autostore*/gi;
    this.subscription.add(
      this.verifyITNQC
        .fetch(
          {
            InventoryTrackingNumber: ITN,
            DistributionCenter: this._userInfo.distributionCenter,
          },
          { fetchPolicy: 'network-only' }
        )
        .pipe(
          // check vaild
          tap((res) => {
            if (!res.data.findInventory.ORDERLINEDETAILs?.length) {
              throw 'Can not find this order';
            }

            if (res.data.findInventory.ORDERLINEDETAILs?.length > 1) {
              throw 'Invalid Order Line Detail';
            }
            let error = '';
            if (
              ![
                sqlData.droppedQC_ID,
                sqlData.warehouseHold_ID,
                sqlData.qcComplete_ID,
              ].includes(res.data.findInventory.ORDERLINEDETAILs[0].StatusID) &&
              !res.data.findInventory.ORDERLINEDETAILs[0].BinLocation.trim().match(
                autostoreRegex
              )
            ) {
              error += `Invalid order line status ${res.data.findInventory.ORDERLINEDETAILs[0].StatusID}. Must be 20, 30, or 60`;
            }
            if (error) {
              throw error;
            }
          }),
          switchMap((res) => {
            const detail = res.data.findInventory;
            const Order = res.data.findInventory.ORDERLINEDETAILs[0].Order;
            const OrderLine =
              res.data.findInventory.ORDERLINEDETAILs[0].OrderLine;
            this.itemInfo = {
              InventoryTrackingNumber: ITN,
              InventoryID: detail._id,
              OrderLineDetailID: detail.ORDERLINEDETAILs[0]._id,
              OrderID: Order._id,
              CustomerNumber: Order.Customer?.CustomerNumber.trim() || '',
              DistributionCenter: Order.DistributionCenter?.trim(),
              OrderNumber: Order.OrderNumber?.trim(),
              NOSI: Order.NOSINumber?.trim(),
              OrderLineNumber: OrderLine.OrderLineNumber,
              PartNumber: detail.Product.PartNumber?.trim(),
              ProductCode: detail.Product.ProductCode.ProductCodeNumber.trim(),
              Quantity: detail.ORDERLINEDETAILs[0].Quantity,
              ParentITN: detail.ParentITN?.trim() || '',
              ROHS: detail.ROHS,
              DateCode: detail.DateCode?.trim() || '',
              CountryISO2: detail.Country?.ISO2 || '',
              CountMethod: '',
              isHold: !!detail.ORDERLINEDETAILs[0].BinLocation.toLowerCase()
                .trim()
                .match(holdRegex),
              CustomerTier: Order.Customer?.CustomerTier,
              ProductTier: detail.Product?.ProductTier,
              ShipmentMethod: Order.ShipmentMethod._id,
              ShipmentMethodDescription: Order.ShipmentMethod.ShippingMethod,
              WMSPriority: detail.ORDERLINEDETAILs[0].WMSPriority,
              Priority: Order.ShipmentMethod.PriorityPinkPaper,
            };
            return of(true);
          }),
          switchMap(() => {
            const oldLogs = [
              {
                UserName: this._userInfo.userName,
                OrderNumber: this.itemInfo.OrderNumber,
                NOSINumber: this.itemInfo.NOSI,
                OrderLineNumber: this.itemInfo.OrderLineNumber,
                InventoryTrackingNumber: ITN,
                UserEventID: sqlData.Event_QC_Start,
                CustomerNumber: this.itemInfo.CustomerNumber,
                CustomerTier: this.itemInfo.CustomerTier,
                DistributionCenter: this.itemInfo.DistributionCenter,
                PartNumber: this.itemInfo.PartNumber,
                ProductCode: this.itemInfo.ProductCode,
                ProductTier: this.itemInfo.ProductTier,
                Quantity: this.itemInfo.Quantity,
                ParentITN: this.itemInfo.ParentITN,
                ShipmentMethod: this.itemInfo.ShipmentMethod,
                ShipmentMethodDescription:
                  this.itemInfo.ShipmentMethodDescription,
                WMSPriority: this.itemInfo.WMSPriority,
                Priority: this.itemInfo.Priority,
              },
            ];
            this.logService.updateEventLog({
              ...this.logService.eventLog,
              Log: JSON.stringify({
                OrderNumber: this.itemInfo.OrderNumber,
                NOSINumber: this.itemInfo.NOSI,
                OrderLineNumber: this.itemInfo.OrderLineNumber,
                InventoryTrackingNumber: ITN,
                CustomerNumber: this.itemInfo.CustomerNumber,
                CustomerTier: this.itemInfo.CustomerTier,
                DistributionCenter: this.itemInfo.DistributionCenter,
                PartNumber: this.itemInfo.PartNumber,
                ProductCode: this.itemInfo.ProductCode,
                ProductTier: this.itemInfo.ProductTier,
                Quantity: this.itemInfo.Quantity,
                ParentITN: this.itemInfo.ParentITN,
                ShipmentMethod: this.itemInfo.ShipmentMethod,
                ShipmentMethodDescription:
                  this.itemInfo.ShipmentMethodDescription,
                WMSPriority: this.itemInfo.WMSPriority,
                Priority: this.itemInfo.Priority,
              }),
            });
            return this.eventLog.mutate({
              oldLogs,
              eventLogs: this.logService.eventLog,
            });
          })
        )
        .subscribe({
          next: () => {
            this.qcService.changeItemParams(this.itemInfo);
            this.router.navigate(['/qc/globalmessages']);
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            this.qcService.alertType.set('error');
            this.qcService.alertMessage.set(error);
            this.ITNInput.nativeElement.select();
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
