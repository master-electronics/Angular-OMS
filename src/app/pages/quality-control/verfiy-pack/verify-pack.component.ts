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
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';

import { dateCodeRegex } from '../../../shared/dataRegex';
import Countries from '../../../shared/countries';
import { QualityControlService } from '../quality-control.server';
import {
  FetchProductInfoFromMerpGQL,
  UpdateMerpAfterQcVerifyGQL,
} from '../../../graphql/forQualityControl.graphql-gen';
import { Update_OrderLineDetailGQL } from 'src/app/graphql/wms.graphql-gen';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'verify-pack',
  templateUrl: './verify-pack.component.html',
})
export class VerifyPackComponent implements OnInit, AfterViewInit, OnDestroy {
  imgURL = 'https://www.onlinecomponents.com/images/parts/largeimages/';
  productURL = 'https://www.onlinecomponents.com/en/grayhill/';
  specSheetURL = 'https://www.onlinecomponents.com/en/datasheet/';
  shortcuts: ShortcutInput[] = [];
  isImgExist = false;
  globalMessages: string[];
  isLoading = false;
  editable = false;
  messageType = 'error';
  message = '';
  isHoldModalHidden = true;
  isGlobalMessagesModalHidden = true;
  urlParams;
  UnitOfMeasure = 'loading';
  MICPartNumber: string;
  HazardMaterialLevel: boolean;
  countryData = Countries;
  COOkeyword = 'name';
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

  // Count method input list
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
    { id: 1, name: 'Yes' },
    { id: 0, name: 'No' },
  ];

  // form group
  verifyPack = this.fb.group({
    dateCode: [
      { value: '', disabled: true },
      [Validators.pattern(dateCodeRegex)],
    ],
    ROHS: [{ value: '', disabled: true }, [Validators.required]],
    countryOfOrigin: [{ value: '', disabled: true }, [Validators.required]],
    countMethods: ['', [Validators.required]],
  });

  @ViewChild('dateCodeError') dateCodeError: ElementRef;
  @ViewChild('countMethodError') countMethodError: ElementRef;
  @ViewChild('dateCode') dateCodeInput: ElementRef;
  @ViewChild('countMethods') countMethodsInput: ElementRef;

  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private qcService: QualityControlService,
    private updateMerp: UpdateMerpAfterQcVerifyGQL,
    private updateWms: Update_OrderLineDetailGQL,
    private fetchProductInfoFromMerp: FetchProductInfoFromMerpGQL
  ) {
    titleService.setTitle('qc/verifypack');
  }

  async ngOnInit(): Promise<void> {
    this.qcService.changeTab(3);
    // check global message
    this.globalMessages = this.qcService.globalMessages;
    this.urlParams = { ...this.route.snapshot.queryParams };
    this.urlParams.coo = this.urlParams.coo ? this.urlParams.coo : 'Unknown';
    this.urlParams.Quantity = Number(this.urlParams.Quantity);
    let country = this.countryData.find(
      (element) => element.name.substring(0, 2) === this.urlParams.coo
    );
    country
      ? 0
      : (country = this.countryData.find(
          (element) => element.name === 'UNKNOWN'
        ));
    this.fetchProductInfo();
    // set init value of form
    this.verifyPack.setValue({
      dateCode: this.urlParams.DateCode || '',
      ROHS: this.urlParams.ROHS === '1' ? 1 : 0,
      countMethods: '',
      countryOfOrigin: country,
    });
  }

  fetchProductInfo(): void {
    this.subscription.add(
      this.fetchProductInfoFromMerp
        .watch(
          {
            ProductList: [
              this.urlParams.PRC.padEnd(3) + this.urlParams.PartNum,
            ],
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          (res) => {
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
              this.isImgExist = true;
            }
          },
          (error) => {
            console.log(error);
          }
        )
    );
  }

  onSubmit(): void {
    if (this.verifyPack.invalid) {
      if (this.verifyPack.get('dateCode').errors) {
        this.dateCodeError.nativeElement.textContent =
          'Incorrect dateCode format.';
        this.dateCodeError.nativeElement.classList.remove('hidden');
      }
      if (this.verifyPack.get('countMethods').errors) {
        this.countMethodError.nativeElement.classList.remove('hidden');
      }
      return;
    }
    this.dateCodeError.nativeElement.classList.add('hidden');
    this.countMethodError.nativeElement.classList.add('hidden');

    // set up update query
    const coo = this.verifyPack.get('countryOfOrigin').value.name;
    const orderInfo = {
      InternalTrackingNumber: this.urlParams.ITN,
      DateCode: this.verifyPack.get('dateCode').value,
      CountryOfOrigin: coo === 'UNKNOWN' ? '' : coo.slice(0, 2),
      ROHS: this.verifyPack.get('ROHS').value === 1 ? 'Y' : 'N',
      CountMethod:
        this.countMethods[this.verifyPack.get('countMethods').value - 1]
          .content,
    };

    const countryOO = this.verifyPack.get('countryOfOrigin').value;
    let cooValue: string;
    countryOO._id === 1
      ? (cooValue = null)
      : (cooValue = countryOO.name.substring(0, 2));
    this.urlParams.ROHS = this.verifyPack.get('ROHS').value;
    this.urlParams.coo = cooValue;
    this.urlParams.DateCode = this.verifyPack.get('dateCode').value;

    const updateMerp = this.updateMerp.mutate(orderInfo);
    const updateWms = this.updateWms.mutate({
      InternalTrackingNumber: this.urlParams.ITN,
      OrderLineDetail: {
        ROHS: this.urlParams.ROHS ? true : false,
        CountryOfOrigin: this.urlParams.coo,
        DateCode: this.urlParams.DateCode,
      },
    });

    //check if change then update info to merp and wms
    const updateQuery = { updateMerp, updateWms };
    if (!this.editable) {
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
            message = `QCCOMPELETE api:${res.updateMerp.data.changeQCLineInfo.message}\n`;
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
          message = `${this.urlParams.ITN} verify failed\n`.concat(message);
          this.router.navigate(['qc'], {
            queryParams: { type, message },
          });
        },
        (error) => {
          this.isLoading = false;
          this.router.navigate(['qc'], {
            queryParams: {
              type: `error`,
              message: `${this.urlParams.ITN} update failed\n${error}`,
            },
          });
        }
      )
    );
  }

  back(): void {
    this.router.navigate(['/qc']);
  }

  toggleHoldModal(): void {
    this.isHoldModalHidden = !this.isHoldModalHidden;
  }
  toggleGlobalMessagesModal(): void {
    this.isGlobalMessagesModalHidden = !this.isGlobalMessagesModalHidden;
  }
  toggleEdit(): void {
    this.editable = true;
    this.verifyPack.controls['ROHS'].enable();
    this.verifyPack.controls['dateCode'].enable();
    this.verifyPack.controls['countryOfOrigin'].enable();
    this.dateCodeInput.nativeElement.select();
  }

  ngAfterViewInit(): void {
    this.countMethodsInput.nativeElement.focus();
    this.shortcuts.push(
      {
        key: ['ctrl + h'],
        label: 'Quick Access',
        description: 'Hold Order',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => {
          this.toggleHoldModal();
        },
      },
      {
        key: ['ctrl + b'],
        label: 'Quick Access',
        description: 'Back to Sacn ITN',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => {
          this.back();
        },
      },
      {
        key: ['ctrl + e'],
        label: 'Quick Access',
        description: 'Toggle editable',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => {
          this.toggleEdit();
        },
      },
      {
        key: ['ctrl + g'],
        label: 'Quick Access',
        description: 'Show Global Message',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => {
          this.toggleGlobalMessagesModal();
        },
      },
      {
        key: ['ctrl + s'],
        label: 'Quick Access',
        description: 'Next Step',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => {
          this.onSubmit();
        },
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
