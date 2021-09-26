import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subscription, throwError } from 'rxjs';

import { dateCodeRegex } from '../../../shared/dataRegex';
import Countries from '../../../shared/countries';
import { QualityControlService } from '../quality-control.server';
import {
  FetchProductInfoFromMerpGQL,
  HoldQcOrderGQL,
  HoldQcOrderMutationVariables,
  PrintItnLabelGQL,
  UpdateMerpAfterQcVerifyGQL,
} from '../../../graphql/qualityControl.graphql-gen';
import { Update_OrderLineDetailGQL } from 'src/app/graphql/wms.graphql-gen';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';
import { catchError, map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'verify-pack',
  templateUrl: './verify-pack.component.html',
})
export class VerifyPackComponent implements OnInit, AfterViewInit, OnDestroy {
  imgURL = 'https://www.onlinecomponents.com/images/parts/largeimages/';
  productURL = 'https://www.onlinecomponents.com/en/grayhill/';
  specSheetURL = 'https://www.onlinecomponents.com/en/datasheet/';
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  isEditable = false;
  urlParams: any;
  UnitOfMeasure = 'loading';
  MICPartNumber: string;
  HazardMaterialLevel: boolean;
  countryData = Countries;

  countMethods = [
    { id: 1, content: 'Factory bag' },
    { id: 2, content: 'Factory box' },
    { id: 3, content: 'Hand count' },
    { id: 4, content: 'Reel/TUB' },
    { id: 5, content: 'Drypack' },
    { id: 6, content: 'Scale' },
    { id: 7, content: 'Factory Reel' },
  ];

  booleanOptions = [
    { id: '1', name: 'Yes' },
    { id: '0', name: 'No' },
  ];

  COOFilter(
    countryData: { _id: number; name: string }[],
    query: string
  ): string[] {
    const result = [];
    if (query.length < 3) {
      countryData.map((country) => {
        if (query.toUpperCase() === country.name.substring(0, query.length))
          result.push(country);
      });
      return result;
    }
    countryData.map((country) => {
      if (country.name.substring(4, 4 + query.length) === query.toUpperCase())
        result.push(country);
    });
    return result;
  }

  // form group
  verifyPack = this.fb.group({
    dateCode: [
      { value: '', disabled: true },
      [Validators.pattern(dateCodeRegex)],
    ],
    ROHS: [{ value: '', disabled: true }, [Validators.required]],
    countryOfOrigin: [{ value: '', disabled: true }, [Validators.required]],
    countMethods: [1, [Validators.required]],
  });

  @ViewChild('DateCode') dateCodeInput: ElementRef;
  @ViewChild('countMethodError') countMethodError: ElementRef;
  @ViewChild('countMethods') countMethodsInput: ElementRef;
  @ViewChild('holdInput') holdInput: ElementRef;

  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private titleService: Title,
    private qcService: QualityControlService,
    private updateMerp: UpdateMerpAfterQcVerifyGQL,
    private updateWms: Update_OrderLineDetailGQL,
    private fetchProductInfoFromMerp: FetchProductInfoFromMerpGQL,
    private printITN: PrintItnLabelGQL,
    private holdQCOrder: HoldQcOrderGQL,
    private gtmService: GoogleTagManagerService,
    private authService: AuthenticationService
  ) {
    this.titleService.setTitle('qc/verifypack');
  }
  isInit = true;
  productInfo$;
  ngOnInit(): void {
    this.qcService.changeTab(['finish', 'finish', 'process', 'wait']);
    // Set up urlParams
    this.urlParams = { ...this.route.snapshot.queryParams };
    this.urlParams.coo = this.urlParams.coo ? this.urlParams.coo : 'Unknown';
    this.urlParams.Quantity = Number(this.urlParams.Quantity);
    // Set up for html element
    let selectedCountry = this.countryData.find(
      (element) => element.name.substring(0, 2) === this.urlParams.coo
    );
    selectedCountry ||
      (selectedCountry = this.countryData.find(
        (element) => element.name === 'UNKNOWN'
      ));
    // set html by urlParams
    this.verifyPack.setValue({
      dateCode: this.urlParams.DateCode || '',
      ROHS: this.urlParams.ROHS,
      countMethods: '',
      countryOfOrigin: selectedCountry._id,
    });

    // fetch infor from merp
    this.productInfo$ = this.fetchProductInfoFromMerp
      .fetch({
        ProductList: [this.urlParams.PRC.padEnd(3) + this.urlParams.PartNum],
      })
      .pipe(
        map((res) => {
          if (res.data.fetchProductInfoFromMerp.length) {
            this.UnitOfMeasure =
              res.data.fetchProductInfoFromMerp[0].UnitOfMeasure.trim();
            this.MICPartNumber =
              res.data.fetchProductInfoFromMerp[0].MICPartNumber.trim();
            const tmp =
              res.data.fetchProductInfoFromMerp[0].HazardMaterialLevel.trim();
            this.HazardMaterialLevel = tmp === 'N' || !tmp ? false : true;
            this.imgURL = `${this.imgURL}${this.MICPartNumber}.jpg`;
            this.productURL = `${this.productURL}${this.urlParams.PartNum}-${this.MICPartNumber}.html`;
            this.specSheetURL = `${this.specSheetURL}${this.urlParams.PartNum}-${this.MICPartNumber}/`;
          }
          this.isInit = false;
          return res;
        }),
        catchError((error) => {
          this.isInit = false;
          this.alertMessage = error;
          this.alertType = error;
          return throwError(error);
        })
      );
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.verifyPack.invalid || this.isLoading) {
      if (this.verifyPack.get('countMethods').errors) {
        this.countMethodError.nativeElement.classList.remove('hidden');
      }
      return;
    }
    this.countMethodError.nativeElement.classList.add('hidden');
    // set up update query
    let cooValue = '';
    this.countryData.forEach((ele) => {
      ele._id === this.verifyPack.get('countryOfOrigin').value &&
        (cooValue = ele.name);
    });
    if (cooValue === 'UNKNOWN') {
      cooValue = '';
    } else {
      cooValue = cooValue.substring(0, 2);
    }

    const orderInfo = {
      InternalTrackingNumber: this.urlParams.ITN,
      DateCode: this.verifyPack.get('dateCode').value,
      CountryOfOrigin: cooValue,
      ROHS: this.verifyPack.get('ROHS').value === '1' ? 'Y' : 'N',
      CountMethod: this.verifyPack.get('countMethods').value,
    };

    this.urlParams.ROHS = this.verifyPack.get('ROHS').value;
    this.urlParams.coo = cooValue;
    this.urlParams.DateCode = this.verifyPack.get('dateCode').value;

    const updateMerp = this.updateMerp.mutate(orderInfo);
    const updateWms = this.updateWms.mutate({
      InternalTrackingNumber: this.urlParams.ITN,
      OrderLineDetail: {
        ROHS: this.urlParams.ROHS === '1' ? true : false,
        CountryOfOrigin: this.urlParams.coo,
        DateCode: this.urlParams.DateCode,
      },
    });

    //check if change then update info to merp and wms
    const updateQuery = { updateMerp, updateWms };
    if (!this.isEditable) {
      delete updateQuery.updateWms;
    }
    this.isLoading = true;
    this.subscription.add(
      forkJoin(updateQuery).subscribe(
        (res: any) => {
          let type: string;
          let message: string;
          if (!res.updateMerp.data.changeQCLineInfo.success) {
            type = 'error';
            message = `QCCOMPELETE: ${res.updateMerp.data.changeQCLineInfo.message}\n`;
          }
          if (res.updateWms && !res.updateWms.data.updateOrderLineDetail[0]) {
            type = 'error';
            message += `Fail to update SQL`;
          }
          this.isLoading = false;
          if (!type) {
            this.router.navigate(['qc/repack'], {
              queryParams: this.urlParams,
            });
            return;
          }
          this.router.navigate(['qc'], {
            queryParams: { type, message },
          });
        },
        (error) => {
          this.isLoading = false;
          this.router.navigate(['qc'], {
            queryParams: {
              type: `error`,
              message: `${this.urlParams.ITN} failed\n${error}`,
            },
          });
        }
      )
    );
  }

  back(): void {
    this.router.navigate(['/qc']);
  }
  toggleEdit(): void {
    this.isEditable = true;
    this.verifyPack.controls['ROHS'].enable();
    this.verifyPack.controls['dateCode'].enable();
    this.verifyPack.controls['countryOfOrigin'].enable();
    this.dateCodeInput.nativeElement.select();
  }
  ngAfterViewInit(): void {
    this.countMethodsInput.nativeElement.select();
  }

  printITN$;
  print(): void {
    this.alertMessage = '';
    this.isLoading = true;
    this.printITN$ = this.printITN
      .mutate({
        InternalTrackingNumber: this.urlParams.ITN,
        Station: this.commonService.printerInfo,
      })
      .pipe(
        tap((res) => {
          if (!res.data.printITNLabel.success) {
            throw `Print failed: ` + res.data.printITNLabel.message;
          } else {
            this.isLoading = false;
            this.alertMessage = 'Print success.';
            this.alertType = 'success';
          }
        }),
        catchError((error) => {
          this.isLoading = false;
          this.alertMessage = error;
          this.alertType = 'error';
          return throwError(error);
        })
      );
  }

  // hold drawer

  holdVisible = false;
  open(): void {
    this.holdVisible = true;
    setTimeout(() => {
      this.holdInput.nativeElement.select();
    }, 10);
  }

  close(): void {
    this.holdVisible = false;
  }

  holdOptions = [
    { id: 1, content: 'Short Quantity' },
    { id: 2, content: 'Damaged' },
    { id: 3, content: 'Repackaging' },
    { id: 4, content: 'Wrong Parts' },
    { id: 5, content: 'Verify Quantity' },
    { id: 6, content: 'Mixed Parts' },
    { id: 7, content: 'Part Number Verification' },
    { id: 8, content: 'Kit Set' },
    { id: 9, content: 'Over Shipment' },
  ];

  holdForm = this.fb.group({
    holdReason: ['', Validators.required],
  });

  onHold(): void {
    const Status = this.holdForm.get('holdReason').value;
    const qcHoldOrderInfo = {
      InternalTrackingNumber: this.urlParams.ITN,
      Status: String(Status).padStart(2, '3'),
      Station: this.commonService.printerInfo,
      StatusID: environment.warehouseHold_ID,
      EventLog: {
        UserID: Number(JSON.parse(sessionStorage.getItem('userInfo'))._id),
        Event: `Hold ${this.urlParams.ITN} ${String(Status).padStart(2)}`,
        Module: `qc`,
        Target: `${this.urlParams.OrderNum}-${this.urlParams.NOSI}`,
      },
    };
    this.isLoading = true;
    this.writeInfoToMerp(qcHoldOrderInfo);
  }

  writeInfoToMerp(holdInfo: HoldQcOrderMutationVariables): void {
    this.subscription.add(
      this.holdQCOrder.mutate(holdInfo).subscribe(
        (res) => {
          let type = '';
          let message = '';
          this.isLoading = false;
          if (!res.data.holdQCOrder.success) {
            type = 'error';
            message = `HOLDORDER api: ${res.data.holdQCOrder.message}\n`;
          }
          if (!res.data.updateOrderLineDetail[0]) {
            type = 'error';
            message = message.concat(`Fail to update SQL`);
          }
          message = `${this.urlParams.ITN} hold failed\n`.concat(message);
          if (!type) {
            type = `warning`;
            message = `${this.urlParams.ITN} is on hold.`;
          }
          this.sendGTM();
          this.router.navigate(['qc'], {
            queryParams: { type, message },
          });
        },
        (error) => {
          this.sendGTM();
          this.router.navigate(['qc'], {
            queryParams: {
              type: `error`,
              message: `${this.urlParams.ITN} hold failed.\n${error}`,
            },
          });
          this.isLoading = false;
        }
      )
    );
  }

  sendGTM(): void {
    const taskTime = Date.now() - this.qcService.qcStart;
    this.qcService.resetQCStartTime(Date.now());
    this.gtmService.pushTag({
      event: 'QCHoldOn',
      userID: this.authService.userName,
      taskTime: taskTime,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
