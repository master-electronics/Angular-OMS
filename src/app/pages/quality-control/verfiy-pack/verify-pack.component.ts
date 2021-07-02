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
import { QualityControlService } from '../quality-control.server';
import {
  FetchProductInfoFromMerpGQL,
  UpdateQcOrderGQL,
  UpdateQcOrderMutationVariables,
} from '../../../graphql/forQualityControl.graphql-gen';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'verify-pack',
  templateUrl: './verify-pack.component.html',
})
export class VerifyPackComponent implements OnInit, AfterViewInit, OnDestroy {
  imgURL = 'https://www.onlinecomponents.com/images/parts/largeimages/';
  productURL = 'https://www.onlinecomponents.com/en/grayhill/';
  specSheetURL = 'https://www.onlinecomponents.com/en/datasheet/';
  shortcuts: ShortcutInput[] = [];
  isImgExist = true;
  globalMessages: string[];
  ITNRegex = '[a-zA-Z0-9]{10}';
  isLoading = false;
  // isNeedSupv = true;
  messageType = 'error';
  submitStyles = 'bg-indigo-800';
  backStyles = 'bg-gray-500';
  holdStyles = 'bg-yellow-500';
  buttonLabel = 'submit';
  message = '';
  isHoldModalHidden = true;
  isGlobalMessagesModalHidden = true;
  // input data
  ITN: string;
  PRC: string;
  PartNumber: string;
  ROHS: string;
  Quantity: number;
  DateCode: string;
  CountryOfOrigin: string;
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
    { id: 3, content: 'B/C' },
    { id: 4, content: 'Reel/TUB' },
    { id: 5, content: 'Scale' },
    { id: 6, content: 'Factory Reel' },
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
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  @ViewChild('dateCodeError') dateCodeError: ElementRef;
  @ViewChild('countMethodError') countMethodError: ElementRef;
  @ViewChild('dateCode') dateCodeInput: ElementRef;
  @ViewChild('username') usernameInput: ElementRef;
  @ViewChild('password') passwordInput: ElementRef;

  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private qcService: QualityControlService,
    private authService: AuthenticationService,
    private fetchProductInfoFromMerp: FetchProductInfoFromMerpGQL,
    private updateQCOrder: UpdateQcOrderGQL
  ) {
    //
  }

  async ngOnInit(): Promise<void> {
    this.qcService.changeTab(3);
    // check global message
    this.globalMessages = this.qcService.globalMessages;
    // this.qcService.globalMessages?.some((message) => {
    //   return message.includes('SUPV SIGNATURE REQUIRED');
    // })
    //   ? (this.isNeedSupv = true)
    //   : (this.isNeedSupv = false);
    this.ITN = this.route.snapshot.queryParams['ITN'];
    this.PRC = this.route.snapshot.queryParams['PRC'];
    this.PartNumber = this.route.snapshot.queryParams['PartNum'];
    const ROHStext = this.route.snapshot.queryParams['ROHS'];
    this.ROHS = ROHStext ? (ROHStext === 'true' ? 'Yes' : 'No') : 'Unknown';
    const coo = this.route.snapshot.queryParams['coo'];
    this.CountryOfOrigin = coo ? coo : 'Unknown';
    this.Quantity = parseInt(this.route.snapshot.queryParams['Quantity']);
    this.DateCode = this.route.snapshot.queryParams['DateCode'];
    let country = this.countryData.find(
      (element) => element.name.substring(0, 2) === this.CountryOfOrigin
    );
    country
      ? 0
      : (country = this.countryData.find(
          (element) => element.name === 'UNKNOWN'
        ));
    await this.fetchProductInfo();
    // set init value of form
    this.verifyPack.setValue({
      dateCode: this.DateCode || '',
      ROHS: this.ROHS === 'Yes' ? 1 : 0,
      countMethods: '',
      countryOfOrigin: country,
      // username: '',
      // password: '',
    });
    // if (!this.isNeedSupv) {
    //   this.verifyPack.setValue({
    //     dateCode: this.DateCode || '',
    //     ROHS: this.ROHS === 'Yes' ? 1 : 0,
    //     countMethods: '',
    //     countryOfOrigin: country,
    //     username: 'test',
    //     password: 'test',
    //   });
    // }
  }

  async fetchProductInfo(): Promise<void> {
    this.subscription.add(
      this.fetchProductInfoFromMerp
        .watch(
          { PartNumber: this.PartNumber, ProductCode: this.PRC },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          (res) => {
            if (res) {
              this.MICPartNumber =
                res.data.fetchProductInfoFromMerp.MICPartNumber;
              this.HazardMaterialLevel =
                res.data.fetchProductInfoFromMerp.HazardMaterialLevel;
              this.imgURL = `${this.imgURL}${this.MICPartNumber}.jpg`;
              this.productURL = `${this.productURL}${this.PartNumber}-${this.MICPartNumber}.html`;
              this.specSheetURL = `${this.specSheetURL}${this.PartNumber}-${this.MICPartNumber}/`;
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
      InternalTrackingNumber: this.ITN,
      User: this.authService.userName,
      DateCode: this.verifyPack.get('dateCode').value,
      CountryOfOrigin: coo === 'UNKNOWN' ? '' : coo.slice(0, 2),
      ROHS: this.verifyPack.get('ROHS').value === 1 ? 'Y' : 'N',
      CountMethod:
        this.countMethods[this.verifyPack.get('countMethods').value - 1]
          .content,
    };
    this.isLoading = true;
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
    this.writeInfo(orderInfo);
    return;
  }

  async writeInfo(orderInfo: UpdateQcOrderMutationVariables): Promise<void> {
    this.subscription.add(
      this.updateQCOrder
        .mutate(orderInfo, { fetchPolicy: 'no-cache' })
        .subscribe(
          (res) => {
            let response: { type: string; message: string };
            if (res.data.updateQCOrder.success) {
              response = {
                type: `success`,
                message: `${this.ITN} QC done`,
              };
            } else {
              response = {
                type: 'error',
                message: `${this.ITN} QC failed. ${res.data.updateQCOrder.message}`,
              };
            }
            this.isLoading = false;
            this.router.navigate(['qc'], {
              queryParams: response,
            });
          },
          (error) => {
            this.isLoading = false;
            this.router.navigate(['qc'], {
              queryParams: {
                type: `error`,
                message: `${this.ITN} QC failed.${error}`,
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

  ngAfterViewInit(): void {
    this.dateCodeInput.nativeElement.select();
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
        key: ['ctrl + g'],
        label: 'Quick Access',
        description: 'Back to Sacn ITN',
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: () => {
          this.toggleGlobalMessagesModal();
        },
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
