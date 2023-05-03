import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { QualityControlService, itemParams } from '../quality-control.server';
import { ITNBarcodeRegex } from '../../../shared/utils/dataRegex';
import { switchMap, tap } from 'rxjs/operators';
import { VerifyItNforQcGQL } from 'src/app/graphql/qualityControl.graphql-gen';
import { Title } from '@angular/platform-browser';
import {
  Create_EventLogsGQL,
  Insert_UserEventLogsGQL,
  Update_Merp_QcBinGQL,
} from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { EventLogService } from 'src/app/shared/data/eventLog';

@Component({
  selector: 'scan-itn',
  templateUrl: './scan-itn.component.html',
})
export class ScanItnComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  itemInfo: itemParams;
  private subscription = new Subscription();
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private qcService: QualityControlService,
    private insertUserEventLog: Insert_UserEventLogsGQL,
    private logService: EventLogService,
    private eventLog: Create_EventLogsGQL,
    private updateQCBin: Update_Merp_QcBinGQL,
    private verifyITNQC: VerifyItNforQcGQL
  ) {
    this.titleService.setTitle('qc/scanitn');
  }

  @ViewChild('ITN') ITNInput!: ElementRef;
  ITNForm = this.fb.group({
    ITN: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.alertType = this.route.snapshot.queryParams['type'];
    this.alertMessage = this.route.snapshot.queryParams['message'];
    this.qcService.changeTab(['process', 'wait', 'wait', 'wait']);
    this.logService.initEventLog({
      UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
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
    this.alertMessage = '';
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
            DistributionCenter: environment.DistributionCenter,
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
              !['qc'].includes(
                res.data.findInventory.ORDERLINEDETAILs[0].BinLocation.toLowerCase().trim()
              ) &&
              !res.data.findInventory.ORDERLINEDETAILs[0].BinLocation.trim().match(
                holdRegex
              ) &&
              !res.data.findInventory.ORDERLINEDETAILs[0].BinLocation.trim().match(
                autostoreRegex
              )
            ) {
              error = `The Binlocation ${res.data.findInventory.ORDERLINEDETAILs[0].BinLocation} must be QC or hold or Autostore\n`;
            }
            if (
              ![
                sqlData.droppedQC_ID,
                sqlData.warehouseHold_ID,
                sqlData.qcComplete_ID,
              ].includes(res.data.findInventory.ORDERLINEDETAILs[0].StatusID)
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
            const oldLogs = [
              {
                UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
                OrderNumber: Order.OrderNumber.trim(),
                NOSINumber: Order.NOSINumber.trim(),
                OrderLineNumber:
                  detail.ORDERLINEDETAILs[0].OrderLine.OrderLineNumber,
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
                OrderNumber: Order.OrderNumber.trim(),
                NOSINumber: Order.NOSINumber.trim(),
                OrderLineNumber:
                  detail.ORDERLINEDETAILs[0].OrderLine.OrderLineNumber,
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
            const updateLog = this.eventLog.mutate({
              oldLogs,
              eventLogs: this.logService.eventLog,
            });
            const updateMerpQCBin = this.updateQCBin.mutate({ ITN });
            // update QCBin when bin is hold
            const updateQueries = this.itemInfo.isHold
              ? { updateLog, updateMerpQCBin }
              : { updateLog };
            return forkJoin(updateQueries);
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
            this.alertType = 'error';
            this.alertMessage = error;
            this.ITNInput.nativeElement.select();
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
