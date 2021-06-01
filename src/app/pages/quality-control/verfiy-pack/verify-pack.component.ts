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

import Countries from '../../../shared/countries';
import { QualityControlService } from '../quality-control.server';
import { FetchProductInfoFromMerpGQL } from '../../../graphql/forQualityControl.graphql-gen';
import { Subscription } from 'rxjs';

@Component({
  selector: 'verify-pack',
  templateUrl: './verify-pack.component.html',
})
export class VerifyPackComponent implements OnInit, AfterViewInit, OnDestroy {
  imgURL = 'https://www.onlinecomponents.com/images/parts/largeimages/';
  productURL = 'https://www.onlinecomponents.com/en/grayhill/';
  specSheetURL = 'https://www.onlinecomponents.com/en/datasheet/';
  isImgExist = true;
  ITNRegex = '[a-zA-Z0-9]{10}';
  dateCodeRegex = '[0-9]{3,4}';
  isLoading = false;
  messageType = 'error';
  submitStyles = 'bg-indigo-800';
  backStyles = 'bg-gray-500';
  holdStyles = 'bg-yellow-500';
  buttonLabel = 'submit';
  message = '';
  isModalHidden = true;
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
    quantity: ['', [Validators.required]],
    dateCode: [
      '',
      [Validators.required, Validators.pattern(this.dateCodeRegex)],
    ],
    countMethods: ['', [Validators.required]],
    countryOfOrigin: ['', [Validators.required]],
    ROHS: ['', [Validators.required]],
    HML: ['', [Validators.required]],
  });

  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private qcService: QualityControlService,
    private fetchProductInfoFromMerp: FetchProductInfoFromMerpGQL
  ) {
    //
  }

  @ViewChild('quantity') quantityInput: ElementRef;

  async ngOnInit(): Promise<void> {
    this.qcService.changeTab(2);
    this.ITN = this.route.snapshot.queryParams['ITN'];
    this.PRC = this.route.snapshot.queryParams['PRC'];
    this.PartNumber = this.route.snapshot.queryParams['PartNumber'];
    const ROHStext = this.route.snapshot.queryParams['ROHS'];
    this.ROHS = ROHStext ? (ROHStext === 'true' ? 'Yes' : 'No') : 'Unknown';
    const coo = this.route.snapshot.queryParams['CountryOfOrigin'];
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
    this.verifyPack.setValue({
      quantity: this.Quantity || '',
      dateCode: this.DateCode || '',
      ROHS: this.ROHS === 'Yes' ? 1 : 0,
      HML: this.HazardMaterialLevel ? 1 : 0,
      countMethods: '',
      countryOfOrigin: country,
    });
    await this.fetchProductInfo();
  }

  async fetchProductInfo(): Promise<void> {
    this.subscription.add(
      this.fetchProductInfoFromMerp
        .watch({ PartNumber: this.PartNumber, ProductCode: this.PRC })
        .valueChanges.subscribe(
          (res) => {
            console.log(res);

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
            //
          }
        )
    );
  }

  ngAfterViewInit(): void {
    this.quantityInput.nativeElement.select();
  }

  onSubmit() {
    //
  }

  back(): void {
    this.router.navigate(['qc/scanitn']);
  }

  toggleModal(): void {
    this.isModalHidden = !this.isModalHidden;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
