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
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';

import { dateCodeRegex } from '../../../shared/dataRegex';
import Countries from '../../../shared/countries';
import { QualityControlService, urlParams } from '../quality-control.server';
import {
  ChangeInfoAfterVerifyGQL,
  ChangeInfoAfterVerifyMutationVariables,
  FetchProductInfoFromMerpGQL,
} from '../../../graphql/forQualityControl.graphql-gen';

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
  ITNRegex = '[a-zA-Z0-9]{10}';
  isLoading = false;
  editable = false;
  // isNeedSupv = true;
  messageType = 'error';
  editStyles = 'bg-purple-500';
  holdStyles = 'bg-yellow-300';
  backStyles = 'bg-gray-500';
  submitStyles = 'bg-indigo-800';
  message = '';
  isHoldModalHidden = true;
  isGlobalMessagesModalHidden = true;
  // input data
  urlParams;
  MICPartNumber: string;
  HazardMaterialLevel: boolean;
  // set autocomplete input box
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
    dateCode: ['', [Validators.pattern(dateCodeRegex)]],
    countMethods: ['', [Validators.required]],
    countryOfOrigin: ['', [Validators.required]],
    ROHS: ['', [Validators.required]],
    // username: ['', [Validators.required]],
    // password: ['', [Validators.required]],
  });

  @ViewChild('dateCodeError') dateCodeError: ElementRef;
  @ViewChild('countMethodError') countMethodError: ElementRef;
  @ViewChild('dateCode') dateCodeInput: ElementRef;
  @ViewChild('countMethods') countMethodsInput: ElementRef;
  // @ViewChild('username') usernameInput: ElementRef;
  // @ViewChild('password') passwordInput: ElementRef;

  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private qcService: QualityControlService,
    private changeLineAfterVerify: ChangeInfoAfterVerifyGQL,
    private fetchProductInfoFromMerp: FetchProductInfoFromMerpGQL
  ) {
    //
  }

  async ngOnInit(): Promise<void> {
    this.qcService.changeTab(3);
    // check global message
    this.globalMessages = this.qcService.globalMessages;
    this.urlParams = { ...this.route.snapshot.queryParams };
    // this.qcService.globalMessages?.some((message) => {
    //   return message.includes('SUPV SIGNATURE REQUIRED');
    // })
    //   ? (this.isNeedSupv = true)
    //   : (this.isNeedSupv = false);
    this.urlParams.ROHS = this.urlParams.ROHS === 'true' ? true : false;
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
    await this.fetchProductInfo();
    // set init value of form
    this.verifyPack.setValue({
      dateCode: this.urlParams.DateCode || '',
      ROHS: this.urlParams.ROHS ? 1 : 0,
      countMethods: '',
      countryOfOrigin: country,
      // username: '',
      // password: '',
    });
    // if (!this.isNeedSupv) {
    //   this.verifyPack.setValue({
    //     dateCode: this.urlParams.DateCode|| '',
    //     ROHS: this.urlParams.ROHS === 'Yes' ? 1 : 0,
    //     countMethods: '',
    //     countryOfOrigin: country,
    //     username: 'test',
    //     password: 'test',
    //   });
    // }
    this.verifyPack.controls['ROHS'].disable();
    this.verifyPack.controls['dateCode'].disable();
  }

  async fetchProductInfo(): Promise<void> {
    this.subscription.add(
      this.fetchProductInfoFromMerp
        .watch(
          {
            PartNumber: this.urlParams.PartNum,
            ProductCode: this.urlParams.PRC,
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          (res) => {
            if (res.data.fetchProductInfoFromMerp) {
              this.MICPartNumber =
                res.data.fetchProductInfoFromMerp.MICPartNumber;
              this.HazardMaterialLevel =
                res.data.fetchProductInfoFromMerp.HazardMaterialLevel;
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
    const nextPageParams: urlParams = {
      ITN: this.urlParams.ITN,
      CustomerNum: this.urlParams.CustomerNum,
      DC: this.urlParams.DC,
      OrderNum: this.urlParams.OrderNum,
      OrderLine: this.urlParams.OrderLine,
      NOSI: this.urlParams.NOSI,
      PRC: this.urlParams.PRC,
      PartNum: this.urlParams.PartNum,
      Quantity: this.urlParams.Quantity,
      ParentITN: this.urlParams.ParentITN,
      ROHS: this.verifyPack.get('ROHS').value,
      coo: cooValue,
      DateCode: this.verifyPack.get('dateCode').value,
    };
    this.isLoading = true;
    this.writeInfo(orderInfo, nextPageParams);
    // if (this.isNeedSupv) {
    //   this.subscription.add(
    //     this.authService
    //       .userAuth(
    //         this.verifyPack.get('username').value,
    //         this.verifyPack.get('password').value
    //       )
    //       .subscribe(
    //         (user: { userGroups: string[] }) => {
    //           if (user.userGroups?.includes('whs_supr')) {
    //             this.writeInfo(orderInfo);
    //           } else {
    //             this.message = 'This user is not supervisor.';
    //             this.usernameInput.nativeElement.select();
    //           }
    //           this.isLoading = false;
    //         },
    //         (error) => {
    //           this.isLoading = false;
    //           this.message = error.error;
    //           if (error.error.toLowerCase().includes('user')) {
    //             this.usernameInput.nativeElement.select();
    //           }
    //           if (error.error.toLowerCase().includes('password')) {
    //             this.passwordInput.nativeElement.select();
    //           }
    //         }
    //       )
    //   );
    // } else {
    //   this.writeInfo(orderInfo);
    // }
    return;
  }

  async writeInfo(
    orderInfo: ChangeInfoAfterVerifyMutationVariables,
    urlParams: urlParams
  ): Promise<void> {
    this.subscription.add(
      this.changeLineAfterVerify
        .mutate(orderInfo, { fetchPolicy: 'no-cache' })
        .subscribe(
          (res) => {
            let response: { type: string; message: string };
            if (res.data.changeQCLineInfo.success) {
              this.router.navigate(['qc/repack'], {
                queryParams: urlParams,
              });
            } else {
              response = {
                type: 'error',
                message: `${this.urlParams.ITN} QC failed. ${res.data.changeQCLineInfo.message}`,
              };
              this.router.navigate(['qc'], {
                queryParams: response,
              });
            }
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.router.navigate(['qc'], {
              queryParams: {
                type: `error`,
                message: `${this.urlParams.ITN} QC failed.${error}`,
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
