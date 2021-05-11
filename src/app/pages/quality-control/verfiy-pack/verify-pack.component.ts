import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Country from '../../../shared/country';
import { QualityControlService } from '../quality-control.server';
import { FetchPackInfoByItNfromMerpQuery } from '../../../graphql/forQualityControl.graphql-gen';

@Component({
  selector: 'verify-pack',
  templateUrl: './verify-pack.component.html',
})
export class VerifyPackComponent implements OnInit, AfterViewInit, OnDestroy {
  ITNRegex = '[a-zA-Z0-9]{10}';
  dateCodeRegex = '[0-9]{3,4}';
  isLoading = false;
  messageType = 'error';
  submitStyles = 'bg-green-800';
  backStyles = 'bg-indigo-800';
  holdStyles = 'bg-yellow-700';
  buttonLabel = 'submit';
  message = '';
  // input data
  Quantity: number;
  DateCode: string;
  ROHS: string;
  CountryOfOrigin: string;
  CountMethod: number;
  // set autocomplete input box
  countMethodData = [
    { name: '1. Factory bag' },
    { name: '2. Factory box' },
    { name: '3. B/C' },
    { name: '4. Reel/TUB' },
    { name: '5. Scale' },
    { name: '6. Factory Real' },
  ];
  countMethodKeyword = 'name';
  countryData = Country;
  COOkeyword = 'ISO2';
  // form group
  verifyPack = this.fb.group({
    quantity: ['', [Validators.required]],
    dateCode: ['', [Validators.required, Validators.pattern(this.dateCodeRegex)]],
    countMethod: ['', [Validators.required]],
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
    const ROHStext = this.route.snapshot.queryParams['ROHS'];
    this.ROHS = ROHStext ? (ROHStext === 'true' ? 'Yes' : 'No') : 'Unknow';
    const coo = this.route.snapshot.queryParams['CountryOfOrigin'];
    this.CountryOfOrigin = coo ? coo : 'Unknow';
    this.Quantity = parseInt(this.route.snapshot.queryParams['quantity']);
    this.DateCode = this.route.snapshot.queryParams['DateCode'];
    let country = this.countryData.find((element) => element.ISO2 === this.CountryOfOrigin);
    country ? 0 : (country = this.countryData.find((element) => element.ISO2 === 'UNKNOW'));
    this.verifyPack.setValue({
      quantity: this.Quantity || '',
      dateCode: this.DateCode || '',
      ROHS: this.ROHS === 'Unknow' ? 'null' : this.ROHS === 'Yes' ? 1 : 0,
      countMethod: '',
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

  ngOnDestroy() {
    //
  }
}
