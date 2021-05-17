import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Countries from '../../../shared/countries';
import { QualityControlService } from '../quality-control.server';
import { FetchPackInfoByItNfromMerpQuery } from '../../../graphql/forQualityControl.graphql-gen';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'verify-pack',
  templateUrl: './verify-pack.component.html',
})
export class VerifyPackComponent implements OnInit, AfterViewInit, OnDestroy {
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
  ROHS: string;
  Quantity: number;
  DateCode: string;
  CountryOfOrigin: string;
  // set autocomplete input box
  countryData = Countries;
  COOkeyword = 'name';
  COOFilter(countryData: { _id: number; name: string }[], query: string) {
    let result = [];
    if (query.length < 3) {
      countryData.map((country) => {
        if (query.toUpperCase() === country.name.substring(0, query.length)) result.push(country);
      });
      return result;
    }
    countryData.map((country) => {
      if (country.name.substring(4, 4 + query.length) === query.toUpperCase()) result.push(country);
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
    { id: 6, content: 'Factory Real' },
  ];
  ROHSOptions = [
    { id: 1, name: 'Yes' },
    { id: 0, name: 'No' },
  ];

  // form group
  verifyPack = this.fb.group({
    quantity: ['', [Validators.required]],
    dateCode: ['', [Validators.required, Validators.pattern(this.dateCodeRegex)]],
    countMethods: ['', [Validators.required]],
    countryOfOrigin: ['', [Validators.required]],
    ROHS: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private qcService: QualityControlService
  ) {
    //
  }

  @ViewChild('quantity') quantityInput: ElementRef;

  ngOnInit() {
    this.qcService.changeTab(2);
    this.ITN = this.route.snapshot.queryParams['ITN'];
    const ROHStext = this.route.snapshot.queryParams['ROHS'];
    this.ROHS = ROHStext ? (ROHStext === 'true' ? 'Yes' : 'No') : 'Unknow';
    const coo = this.route.snapshot.queryParams['CountryOfOrigin'];
    this.CountryOfOrigin = coo ? coo : 'Unknow';
    this.Quantity = parseInt(this.route.snapshot.queryParams['quantity']);
    this.DateCode = this.route.snapshot.queryParams['DateCode'];
    let country = this.countryData.find(
      (element) => element.name.substring(0, 2) === this.CountryOfOrigin
    );
    country ? 0 : (country = this.countryData.find((element) => element.name === 'UNKNOW'));
    this.verifyPack.setValue({
      quantity: this.Quantity || '',
      dateCode: this.DateCode || '',
      ROHS: this.ROHS === 'Yes' ? 1 : 0,
      countMethods: '',
      countryOfOrigin: country,
    });
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
    //
  }
}
