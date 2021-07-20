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
import { FetchPackInfoByItNfromMerpGQL } from '../../../graphql/forQualityControl.graphql-gen';
import { ITNRegex } from '../../../shared/dataRegex';

@Component({
  selector: 'scan-itn',
  templateUrl: './scan-itn.component.html',
})
export class ScanItnComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';
  buttonLabel = 'Next';
  message = '';
  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private qcService: QualityControlService,
    private fetchPcakInfo: FetchPackInfoByItNfromMerpGQL
  ) {}

  ITNForm = this.fb.group({
    ITN: ['', [Validators.required, Validators.pattern(ITNRegex)]],
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
      this.fetchPcakInfo
        .watch({ InternalTrackingNumber: ITN }, { fetchPolicy: 'no-cache' })
        .valueChanges.subscribe(
          (res) => {
            this.isLoading = res.loading;
            if (res.error) {
              this.message = res.error.message;
              this.messageType = 'error';
            }
            if (
              res.data.fetchPackInfoFromMerp.Status === 'pl' &&
              res.data.fetchPackInfoFromMerp.Quantity &&
              res.data.fetchPackInfoFromMerp.DemandQuantity === 0
            ) {
              const queryParams: urlParams = {
                ITN: ITN,
                CustomerNum: res.data.fetchPackInfoFromMerp.CustomerNumber,
                DC: res.data.fetchPackInfoFromMerp.DistributionCenter,
                OrderNum: res.data.fetchPackInfoFromMerp.OrderNumber,
                OrderLine: res.data.fetchPackInfoFromMerp.OrderLineNumber,
                NOSI: res.data.fetchPackInfoFromMerp.NOSINumber,
                PartNum: res.data.fetchPackInfoFromMerp.PartNumber,
                PRC: res.data.fetchPackInfoFromMerp.ProductCode,
                Quantity: res.data.fetchPackInfoFromMerp.Quantity,
                ParentITN: res.data.fetchPackInfoFromMerp.ParentITN,
                ROHS: res.data.fetchPackInfoFromMerp.ROHS,
                DateCode: res.data.fetchPackInfoFromMerp.DateCode,
                coo: res.data.fetchPackInfoFromMerp.CountryOfOrigin,
              };
              this.router.navigate(['/qc/globalmessages'], {
                queryParams: queryParams,
              });
            } else {
              this.messageType = 'error';
              this.message = 'Inavild ITN';
              this.ITNInput.nativeElement.select();
            }
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
