import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subscription, throwError } from 'rxjs';

import { dateCodeRegex } from '../../../shared/dataRegex';
import Countries from '../../../shared/countries';
import { itemParams, QualityControlService } from '../quality-control.server';
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
import { catchError, map, tap } from 'rxjs/operators';
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
  isInit = true;
  alertType = 'error';
  alertMessage = '';
  isEditable = false;
  UnitOfMeasure = 'loading';
  MICPartNumber: string;
  HazardMaterialLevel: boolean;
  countryData = Countries;
  itemInfo: itemParams;
  printITN$ = new Observable();
  productInfo$ = new Observable();

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
    { id: true, name: 'Yes' },
    { id: false, name: 'No' },
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

  ngOnInit(): void {
    this.qcService.changeTab(['finish', 'finish', 'process', 'wait']);
    // Set up urlParams
    const itemInfo = this.qcService.itemInfo;
    if (!itemInfo) {
      this.router.navigate(['qc']);
      return;
    }
    itemInfo.CountryOfOrigin = itemInfo.CountryOfOrigin || 'Unknown';
    // Set up for html element
    let selectedCountry = this.countryData.find(
      (element) => element.name.substring(0, 2) === itemInfo.CountryOfOrigin
    );
    selectedCountry ||
      (selectedCountry = this.countryData.find(
        (element) => element.name === 'UNKNOWN'
      ));
    // set html by urlParams
    this.verifyPack.setValue({
      dateCode: itemInfo.DateCode || '',
      ROHS: itemInfo.ROHS,
      countMethods: '',
      countryOfOrigin: selectedCountry._id,
    });
    this.itemInfo = itemInfo;

    // fetch infor from merp
    this.productInfo$ = this.fetchProductInfoFromMerp
      .fetch({
        ProductList: [itemInfo.ProductCode.padEnd(3) + itemInfo.PartNumber],
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
            this.productURL = `${this.productURL}${itemInfo.PartNumber}-${this.MICPartNumber}.html`;
            this.specSheetURL = `${this.specSheetURL}${itemInfo.PartNumber}-${this.MICPartNumber}/`;
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

    // update itemInfo
    this.itemInfo.ROHS = this.verifyPack.get('ROHS').value;
    this.itemInfo.CountryOfOrigin = cooValue;
    this.itemInfo.DateCode = this.verifyPack.get('dateCode').value;
    this.qcService.changeItemParams(this.itemInfo);

    // send query
    const orderInfo = {
      InternalTrackingNumber: this.itemInfo.InternalTrackingNumber,
      DateCode: this.verifyPack.get('dateCode').value,
      CountryOfOrigin: cooValue,
      ROHS: this.verifyPack.get('ROHS').value ? 'Y' : 'N',
      CountMethod: this.verifyPack.get('countMethods').value,
    };
    const updateMerp = this.updateMerp.mutate(orderInfo);
    const updateWms = this.updateWms.mutate({
      InternalTrackingNumber: this.itemInfo.InternalTrackingNumber,
      OrderLineDetail: {
        ROHS: this.itemInfo.ROHS,
        CountryOfOrigin: this.itemInfo.CountryOfOrigin,
        DateCode: this.itemInfo.DateCode,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (res: any) => {
          let type = '';
          let message = '';
          // if (!res.updateMerp.data.changeQCLineInfo.success) {
          //   type = 'error';
          //   message = `QCCOMPELETE: ${res.updateMerp.data.changeQCLineInfo.message}\n`;
          // }
          if (res.updateWms && !res.updateWms.data.updateOrderLineDetail[0]) {
            type = 'error';
            message += `Fail to update SQL`;
          }
          this.isLoading = false;
          if (!type) {
            this.router.navigate(['qc/repack']);
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
              message: `${this.itemInfo.InternalTrackingNumber} failed\n${error}`,
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

  print(): void {
    this.alertMessage = '';
    this.isLoading = true;
    this.printITN$ = this.printITN
      .mutate({
        InternalTrackingNumber: this.itemInfo.InternalTrackingNumber,
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
      InternalTrackingNumber: this.itemInfo.InternalTrackingNumber,
      Status: String(Status).padStart(2, '3'),
      Station: this.commonService.printerInfo,
      StatusID: environment.warehouseHold_ID,
      EventLog: {
        UserID: Number(JSON.parse(sessionStorage.getItem('userInfo'))._id),
        Event: `Hold on ${String(Status).padStart(2, '3')}`,
        Module: `qc`,
        Target: `${this.itemInfo.OrderNumber}-${this.itemInfo.NOSI}`,
        SubTarget: `${this.itemInfo.InternalTrackingNumber}`,
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
          message =
            `${this.itemInfo.InternalTrackingNumber} hold failed\n`.concat(
              message
            );
          if (!type) {
            type = `warning`;
            message = `${this.itemInfo.InternalTrackingNumber} is on hold.`;
          }
          this.sendGTM();
          this.router.navigate(['qc'], {
            queryParams: { type, message },
          });
        },
        (error) => {
          this.router.navigate(['qc'], {
            queryParams: {
              type: `error`,
              message: `${this.itemInfo.InternalTrackingNumber} hold failed.\n${error}`,
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
