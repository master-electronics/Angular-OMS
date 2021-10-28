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
import { Subscription } from 'rxjs';
import { QualityControlService, itemParams } from '../quality-control.server';
import { ITNBarcodeRegex } from '../../../shared/dataRegex';
import { tap } from 'rxjs/operators';
import { VerifyItNforQcGQL } from 'src/app/graphql/qualityControl.graphql-gen';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'scan-itn',
  templateUrl: './scan-itn.component.html',
})
export class ScanItnComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private qcService: QualityControlService,
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
    this.subscription.add(
      this.verifyITNQC
        .fetch(
          { OrderLineDetail: { InternalTrackingNumber: ITN } },
          { fetchPolicy: 'network-only' }
        )
        .pipe(
          // check vaild
          tap((res) => {
            if (!res.data.findOrderLineDetail?.length) {
              throw 'Can not find this ITN';
            }
            if (res.data.findOrderLineDetail.length > 1) {
              throw 'Invalid ITN';
            }
            let error = '';
            if (
              res.data.findOrderLineDetail[0].BinLocation.toLowerCase().trim() !==
              'qc'
            ) {
              error = `The Binlocation ${res.data.findOrderLineDetail[0].BinLocation} must be QC\n`;
            }
            if (
              ![
                environment.droppedQC_ID,
                environment.warehouseHold_ID,
                environment.qcComplete_ID,
              ].includes(res.data.findOrderLineDetail[0].StatusID)
            ) {
              error += `Invalid order line status ${res.data.findOrderLineDetail[0].StatusID}. Must be 20, 30, or 60`;
            }
            if (error) {
              throw error;
            }
          })
        )
        .subscribe(
          (res) => {
            const detail = res.data.findOrderLineDetail[0];
            const itemInfo: itemParams = {
              InternalTrackingNumber: ITN,
              OrderID: detail.Order._id,
              CustomerNumber: detail.Order.CustomerNumber?.trim() || '',
              DistributionCenter: detail.Order.DistributionCenter?.trim(),
              OrderNumber: detail.Order.OrderNumber?.trim(),
              NOSI: detail.Order.NOSINumber?.trim(),
              OrderLineNumber: detail.OrderLine.OrderLineNumber.toString(),
              PartNumber: detail.OrderLine.PartNumber?.trim(),
              ProductCode: detail.OrderLine.ProductCode?.trim(),
              Quantity: detail.Quantity,
              ParentITN: detail.ParentITN?.trim() || '',
              ROHS: detail.ROHS,
              DateCode: detail.DateCode?.trim() || '',
              CountryOfOrigin: detail.CountryOfOrigin?.trim() || '',
              CountMethod: '',
            };
            this.qcService.changeItemParams(itemInfo);
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
