import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { QualityControlService, itemParams } from '../quality-control.server';
import { ITNBarcodeRegex } from '../../../shared/dataRegex';
import { switchMap, tap } from 'rxjs/operators';
import { VerifyItNforQcGQL } from 'src/app/graphql/qualityControl.graphql-gen';
import { Title } from '@angular/platform-browser';
import {
  Insert_UserEventLogsGQL,
  Update_Merp_QcBinGQL,
} from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/sqlData';
import { environment } from 'src/environments/environment';

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
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private qcService: QualityControlService,
    private insertUserEventLog: Insert_UserEventLogsGQL,
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
    this.qcService.changeGlobalMessages(null);
    this.qcService.changeItemParams(null);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ITNInput.nativeElement.select();
    }, 10);
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
    const regex = /^hld*/g;
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
                res.data.findInventory.ORDERLINEDETAILs[0].Container.Barcode.toLowerCase().trim()
              ) &&
              !res.data.findInventory[0].ORDERLINEDETAILs[0].Container.Barcode.toLowerCase()
                .trim()
                .match(regex)
            ) {
              error = `The Binlocation ${res.data.findInventory[0].ORDERLINEDETAILs[0].Container.Barcode} must be QC or hold\n`;
            }
            if (
              ![
                sqlData.droppedQC_ID,
                sqlData.warehouseHold_ID,
                sqlData.qcComplete_ID,
              ].includes(res.data.findInventory.ORDERLINEDETAILs[0].StatusID)
            ) {
              error += `Invalid order line status ${res.data.findInventory[0].ORDERLINEDETAILs[0].StatusID}. Must be 20, 30, or 60`;
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
              ProductCode: detail.Product.ProductCode[0].ProductCode.trim(),
              Quantity: detail.QuantityOnHand,
              ParentITN: detail.ParentITN?.trim() || '',
              ROHS: detail.ROHS,
              DateCode: detail.DateCode?.trim() || '',
              CountryOfOrigin: detail.CountryOfOrigin?.trim() || '',
              CountMethod: '',
              isQCDrop: detail.ORDERLINEDETAILs[0].StatusID === 60,
            };
            const log = [
              {
                UserID: Number(
                  JSON.parse(sessionStorage.getItem('userInfo'))._id
                ),
                OrderNumber: Order.OrderNumber.trim(),
                NOSINumber: Order.NOSINumber.trim(),
                OrderLineNumber:
                  detail.ORDERLINEDETAILs[0].OrderLine.OrderLineNumber,
                InventoryTrackingNumber: ITN,
                UserEventID: sqlData.Event_QC_Start,
              },
            ];
            const updateLog = this.insertUserEventLog.mutate({ log });
            const updateMerpQCBin = this.updateQCBin.mutate({
              InventoryTrackingNumber: ITN,
            });
            // update QCBin when bin is hold
            const updateQueries = this.itemInfo.isQCDrop
              ? { updateLog }
              : { updateLog, updateMerpQCBin };
            return forkJoin(updateQueries);
          })
        )
        .subscribe(
          () => {
            this.qcService.changeItemParams(this.itemInfo);
            this.router.navigate(['/qc/globalmessages']);
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.alertType = 'error';
            this.alertMessage = error;
            this.ITNInput.nativeElement.select();
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
