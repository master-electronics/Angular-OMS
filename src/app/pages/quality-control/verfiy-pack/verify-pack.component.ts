import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, Subscription, throwError } from 'rxjs';

import { dateCodeRegex } from '../../../shared/utils/dataRegex';
import { itemParams, QualityControlService } from '../quality-control.server';
import {
  FetchProductInfoFromMerpGQL,
  HoldQcOrderGQL,
  HoldQcOrderMutationVariables,
  PrintItnLabelGQL,
  UpdateAfterQcVerifyGQL,
} from '../../../graphql/qualityControl.graphql-gen';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { sqlData } from 'src/app/shared/utils/sqlData';
import countries from 'src/app/shared/utils/countyList';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { EventLogService } from 'src/app/shared/data/eventLog';

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
  itemInfo: itemParams;
  printITN$ = new Observable();
  productInfo$ = new Observable();
  countryData = countries;

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
    countryISO2: [{ value: '', disabled: true }, [Validators.required]],
    countMethods: [1, [Validators.required]],
  });

  @ViewChild('DateCode') dateCodeInput: ElementRef;
  @ViewChild('countMethodError') countMethodError: ElementRef;
  @ViewChild('countMethods') countMethodsInput: ElementRef;
  @ViewChild('holdInput') holdInput: ElementRef;
  @ViewChild('quantity') quantityInput: ElementRef;

  private subscription = new Subscription();
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private qcService: QualityControlService,
    private updateAfterQc: UpdateAfterQcVerifyGQL,
    private fetchProductInfoFromMerp: FetchProductInfoFromMerpGQL,
    private printITN: PrintItnLabelGQL,
    private holdQCOrder: HoldQcOrderGQL,
    private insertEventLog: Create_EventLogsGQL,
    private evenLog: EventLogService
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
    itemInfo.CountryISO2 = itemInfo.CountryISO2 || 'Unknown';
    // Set up for html element
    let selectedCountry = this.countryData.find(
      (element) => element.name.substring(0, 2) === itemInfo.CountryISO2
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
      countryISO2: selectedCountry._id,
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
    if (
      Number(this.quantityInput.nativeElement.value) !== this.itemInfo.Quantity
    ) {
      this.alertMessage = 'Input correct quantity!';
      this.alertType = 'error';
      return;
    }

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
      ele._id === this.verifyPack.get('countryISO2').value &&
        (cooValue = ele.name);
    });
    if (cooValue === 'UNKNOWN') {
      cooValue = '';
    } else {
      cooValue = cooValue.substring(0, 2);
    }

    // update itemInfo
    this.itemInfo.ROHS = this.verifyPack.get('ROHS').value;
    this.itemInfo.CountryISO2 = cooValue;
    this.itemInfo.DateCode = this.verifyPack.get('dateCode').value;
    this.itemInfo.CountMethod = this.verifyPack.get('countMethods').value;
    this.qcService.changeItemParams(this.itemInfo);

    // send query
    const updateAfterQc = this.updateAfterQc.mutate({
      InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
      Inventory: {
        ROHS: this.itemInfo.ROHS,
        // CountryOfOrigin: this.itemInfo.CountryISO2,
        DateCode: this.itemInfo.DateCode,
      },
    });

    //check if change then update info to wms
    if (this.isEditable) {
      this.subscription.add(
        updateAfterQc.subscribe({
          next: (res) => {
            let type = '';
            let message = '';
            if (!res.data.updateInventory[0]) {
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
          error: (error) => {
            this.isLoading = false;
            this.router.navigate(['qc'], {
              queryParams: {
                type: `error`,
                message: `${this.itemInfo.InventoryTrackingNumber} failed\n${error}`,
              },
            });
          },
        })
      );
    }
    this.router.navigate(['qc/repack']);
  }

  back(): void {
    this.router.navigate(['/qc']);
  }
  toggleEdit(): void {
    this.isEditable = true;
    this.verifyPack.controls['ROHS'].enable();
    this.verifyPack.controls['dateCode'].enable();
    this.verifyPack.controls['countryISO2'].enable();
    this.dateCodeInput.nativeElement.select();
  }
  ngAfterViewInit(): void {
    this.quantityInput.nativeElement.select();
  }

  print(): void {
    this.alertMessage = '';
    this.isLoading = true;
    this.printITN$ = this.printITN
      .mutate({
        InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
        Station: this.commonService.printerStation,
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
    of([])
      .pipe(delay(10))
      .subscribe(() => {
        this.holdInput.nativeElement.select();
      });
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
      OrderLineDetailID: this.itemInfo.OrderLineDetailID,
      InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
      Status: String(Status).padStart(2, '3'),
      Station: this.commonService.printerStation,
      StatusID: sqlData.warehouseHold_ID,
    };
    this.isLoading = true;
    this.writeInfoToMerp(qcHoldOrderInfo);
  }

  private type = '';
  private message = '';
  writeInfoToMerp(holdInfo: HoldQcOrderMutationVariables): void {
    const oldLogs = [
      {
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        OrderNumber: this.itemInfo.OrderNumber,
        NOSINumber: this.itemInfo.NOSI,
        UserEventID: sqlData.Event_QC_Hold,
        OrderLineNumber: this.itemInfo.OrderLineNumber,
        InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
        Message: `Hold on ${String(holdInfo.Status).padStart(2, '3')}`,
        CustomerNumber: this.itemInfo.CustomerNumber,
        CustomerTier: this.itemInfo.CustomerTier,
        DistributionCenter: this.itemInfo.DistributionCenter,
        PartNumber: this.itemInfo.PartNumber,
        ProductCode: this.itemInfo.ProductCode,
        ProductTier: this.itemInfo.ProductTier,
        Quantity: this.itemInfo.Quantity,
        ParentITN: this.itemInfo.ParentITN,
        ShipmentMethod: this.itemInfo.ShipmentMethod,
        ShipmentMethodDescription: this.itemInfo.ShipmentMethodDescription,
        WMSPriority: this.itemInfo.WMSPriority,
        Priority: this.itemInfo.Priority,
      },
    ];
    const eventLogs = {
      ...this.evenLog.eventLog,
      EventTypeID: sqlData.Event_QC_Hold,
      Log: JSON.stringify({
        ...JSON.parse(this.evenLog.eventLog.Log),
        Message: `Hold on ${String(holdInfo.Status).padStart(2, '3')}`,
      }),
    };
    this.subscription.add(
      this.holdQCOrder
        .mutate(holdInfo)
        .pipe(
          switchMap((res) => {
            this.isLoading = false;
            if (!res.data.holdQCOrder.success) {
              throw `HOLDORDER api: ${res.data.holdQCOrder.message}\n`;
            }
            if (!res.data.updateOrderLineDetail) {
              throw `Fail to update SQL`;
            }
            this.type = `warning`;
            this.message = `${this.itemInfo.InventoryTrackingNumber} is on hold.`;
            return this.insertEventLog.mutate({ oldLogs, eventLogs });
          }),
          map(() => {
            this.router.navigate(['qc'], {
              queryParams: { type: this.type, message: this.message },
            });
          }),
          catchError((error) => {
            this.router.navigate(['qc'], {
              queryParams: {
                type: `error`,
                message: `${this.itemInfo.InventoryTrackingNumber} hold failed.\n${error}`,
              },
            });
            this.isLoading = false;
            return error;
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
