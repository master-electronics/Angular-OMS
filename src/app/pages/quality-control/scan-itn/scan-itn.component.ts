import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QualityControlService } from '../quality-control.server';
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
  buttonLabel = 'submit';
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
  ngOnInit() {
    this.messageType = this.route.snapshot.queryParams['result'];
    this.message = this.route.snapshot.queryParams['message'];
    this.qcService.changeTab(1);
  }
  ngAfterViewInit() {
    this.ITNInput.nativeElement.select();
  }

  onSubmit() {
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
    this.verfiyITN;
  }

  verfiyITN() {
    this.isLoading = true;
    this.subscription.add(
      this.fetchPcakInfo
        .watch(
          { InternalTrackingNumber: this.ITNForm.get('ITN').value },
          { fetchPolicy: 'no-cache' }
        )
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
              this.router.navigate(['qc/verifypack'], {
                queryParams: {
                  ITN: this.ITNForm.get('ITN').value,
                  quantity: res.data.fetchPackInfoFromMerp.Quantity,
                  ROHS: res.data.fetchPackInfoFromMerp.ROHS,
                  DateCode: res.data.fetchPackInfoFromMerp.DateCode,
                  CountryOfOrigin: res.data.fetchPackInfoFromMerp.CountryOfOrigin,
                },
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

  ngOnDestroy() {
    //
    this.subscription.unsubscribe();
  }
}
