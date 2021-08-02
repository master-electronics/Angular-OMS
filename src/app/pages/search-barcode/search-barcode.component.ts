import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';

import { CommonService } from '../../shared/services/common.service';
import {
  AggregationShelfBarcodeRegex,
  ToteBarcodeRegex,
  ITNBarcodeRegex,
  OrderBarcodeRegex,
} from '../../shared/dataRegex';
import {
  FetchMobileContainerInfoByBarcodeGQL,
  FetchMobileContainerInfoByBarcodeQuery,
  FindMobileContainerListInFixLocationGQL,
} from '../../graphql/forSearchBarcode.graphql-gen';
import { map, mergeMap } from 'rxjs/operators';

const DistributionCenter = 'PH';

@Component({
  selector: 'search-barcode',
  templateUrl: './search-barcode.component.html',
})
export class SearchBarcodeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  title = 'Search Barcode';
  message = '';
  messageType = 'error';
  searchType: string;
  containerInfo$: Observable<FetchMobileContainerInfoByBarcodeQuery>;

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title,
    private fetchMobileContainerInfoByBarcode: FetchMobileContainerInfoByBarcodeGQL,
    private findMobileContainerListInFixLocation: FindMobileContainerListInFixLocationGQL
  ) {
    this.commonService.changeTitle(this.title);
    this.titleService.setTitle(this.title);
  }

  barcodeForm = this.fb.group({
    barcode: ['', [Validators.required, this.regex]],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.barcodeForm.controls;
  }

  regex(input: FormControl): { regex: { valid: boolean } } {
    return AggregationShelfBarcodeRegex.test(input.value) ||
      ToteBarcodeRegex.test(input.value) ||
      OrderBarcodeRegex.test(input.value) ||
      ITNBarcodeRegex.test(input.value) ||
      input.value === ''
      ? null
      : {
          regex: {
            valid: false,
          },
        };
  }

  ngOnInit(): void {
    //
  }

  @ViewChild('barcode') barcode: ElementRef;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.barcode.nativeElement.select();
    }, 10);
  }

  onSubmit(): void {
    this.message = '';
    const barcode = this.barcodeForm.get('barcode').value;
    if (this.barcodeForm.valid) {
      if (ToteBarcodeRegex.test(barcode)) {
        this.searchType = 'mobile';
        this.containerInfo$ = this.forMobileContainer(barcode);
        return;
      }
      if (AggregationShelfBarcodeRegex.test(barcode)) {
        this.searchType = 'fix';
        this.containerInfo$ = this.forFixContainer(barcode);
        return;
      }
    }
  }

  forFixContainer(
    barcode: string
  ): Observable<FetchMobileContainerInfoByBarcodeQuery> {
    const barcodeSplit = barcode.split('-');
    return this.findMobileContainerListInFixLocation
      .watch(
        {
          DistributionCenter: DistributionCenter,
          Warehouse: barcodeSplit[0],
          Row: barcodeSplit[1],
          Aisle: barcodeSplit[2],
          Section: barcodeSplit[3],
          Shelf: barcodeSplit[4],
          ShelfDetail: barcodeSplit[5],
        },
        { fetchPolicy: 'no-cache' }
      )
      .valueChanges.pipe(
        mergeMap((res) =>
          this.forMobileContainer(
            res.data.findContainer
              .map((ele) => ele.Barcode)
              .filter((ele) => ToteBarcodeRegex.test(ele))
          )
        )
      );
  }

  forMobileContainer(barcodeList: string[]): Observable<any> {
    return this.fetchMobileContainerInfoByBarcode
      .watch(
        { DistributionCenter: DistributionCenter, BarcodeList: barcodeList },
        { fetchPolicy: 'no-cache' }
      )
      .valueChanges.pipe(map((res) => res.data.findContainerList));
  }

  back(): void {
    this.containerInfo$ = null;
  }

  fetchITNInfo(): void {
    this.subscription.add();
  }

  fetchOrderInfo(): void {
    this.subscription.add();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
