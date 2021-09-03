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
import { QualityControlService, urlParams } from '../quality-control.server';
import { ITNBarcodeRegex } from '../../../shared/dataRegex';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { map } from 'rxjs/operators';
import { VerifyItNforQcGQL } from 'src/app/graphql/forQualityControl.graphql-gen';

const pickComplete = 10;
const warehouseHold = 30;
const qcComplete = 60;

@Component({
  selector: 'scan-itn',
  templateUrl: './scan-itn.component.html',
})
export class ScanItnComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  shortcuts: ShortcutInput[] = [];
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';
  buttonLabel = 'submit';
  message = '';
  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private qcService: QualityControlService,
    private verifyITNQC: VerifyItNforQcGQL
  ) {}

  ITNForm = this.fb.group({
    ITN: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  @ViewChild('ITN') ITNInput: ElementRef;
  @ViewChild('ITNError') ITNError: ElementRef;
  ngOnInit(): void {
    this.messageType = this.route.snapshot.queryParams['type'];
    this.message = this.route.snapshot.queryParams['message'];
    this.qcService.changeTab(1);
    this.qcService.changeGlobalMessages(null);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ITNInput.nativeElement.select();
    }, 10);

    this.shortcuts.push({
      key: ['ctrl + s'],
      label: 'Quick Access',
      description: 'Next Step',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: () => {
        this.onSubmit();
      },
    });
  }

  onSubmit(): void {
    this.message = '';
    if (this.ITNForm.invalid) {
      if (this.ITNForm.get('ITN').errors.required)
        this.ITNError.nativeElement.textContent = 'ITN is required.';
      if (this.ITNForm.get('ITN').errors.pattern)
        this.ITNError.nativeElement.textContent = 'Incorrect ITN format.';
      this.ITNError.nativeElement.classList.remove('hidden');
      return;
    }
    this.ITNError.nativeElement.classList.add('hidden');
    this.verfiyITN(this.ITNForm.get('ITN').value.trim());
  }

  verfiyITN(ITN: string): void {
    this.isLoading = true;
    this.subscription.add(
      this.verifyITNQC
        .watch(
          { OrderLineDetail: { InternalTrackingNumber: ITN } },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.pipe(
          map((res) => {
            if (!res.data.findOrderLineDetail.length) {
              throw 'Can not find this ITN';
            }
            if (res.data.findOrderLineDetail.length > 1) {
              throw 'Invalid ITN';
            }
            if (
              ![qcComplete, warehouseHold, pickComplete].includes(
                res.data.findOrderLineDetail[0].StatusID
              )
            ) {
              throw 'Invalid order line status.';
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            const detail = res.data.findOrderLineDetail[0];
            const queryParams: urlParams = {
              ITN: ITN,
              CustomerNum: detail.Order.CustomerNumber,
              DC: detail.Order.DistributionCenter,
              OrderNum: detail.Order.OrderNumber,
              NOSI: detail.Order.NOSINumber,
              OrderLine: detail.OrderLine.OrderLineNumber,
              PartNum: detail.OrderLine.PartNumber,
              PRC: detail.OrderLine.ProductCode,
              Quantity: detail.Quantity,
              ParentITN: detail.ParentITN,
              ROHS: detail.ROHS ? 1 : 0,
              DateCode: detail.DateCode,
              coo: detail.CountryOfOrigin,
            };
            this.router.navigate(['/qc/globalmessages'], {
              queryParams: queryParams,
            });
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.messageType = 'error';
            this.message = error;
            this.ITNInput.nativeElement.select();
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
