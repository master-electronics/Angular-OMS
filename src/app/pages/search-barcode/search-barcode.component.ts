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
  SearchBarcodeForItnGQL,
  SearchBarcodeForOrderNumberGQL,
} from '../../graphql/forSearchBarcode.graphql-gen';
import { map, switchMap } from 'rxjs/operators';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';

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
  ITNInfo$: Observable<any>;
  OrderInfo$: Observable<any>;

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private titleService: Title,
    private fetchMobileContainerInfoByBarcode: FetchMobileContainerInfoByBarcodeGQL,
    private findMobileContainerListInFixLocation: FindMobileContainerListInFixLocationGQL,
    private searchITN: SearchBarcodeForItnGQL,
    private searchOrder: SearchBarcodeForOrderNumberGQL
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

  shortcuts: ShortcutInput[] = [];
  @ViewChild('barcode') barcode: ElementRef;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.barcode.nativeElement.select();
    }, 10);

    this.shortcuts.push({
      key: ['ctrl + s'],
      label: 'Quick Access',
      description: 'Submit',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: () => {
        this.onSubmit();
      },
    });
  }

  ngOnInit(): void {
    //
  }

  onSubmit(): void {
    this.message = '';
    this.ITNInfo$ = null;
    this.containerInfo$ = null;
    this.OrderInfo$ = null;
    const barcode = this.barcodeForm.get('barcode').value;
    if (this.barcodeForm.valid) {
      if (ToteBarcodeRegex.test(barcode)) {
        this.containerInfo$ = this.forMobileContainer(barcode);
      }
      if (AggregationShelfBarcodeRegex.test(barcode)) {
        this.containerInfo$ = this.forFixContainer(barcode);
      }
      if (ITNBarcodeRegex.test(barcode)) {
        this.ITNInfo$ = this.searchITN
          .watch(
            {
              InternalTrackingNumber: barcode,
            },
            { fetchPolicy: 'no-cache' }
          )
          .valueChanges.pipe(map((res) => res.data.findInventory));
      }
      if (OrderBarcodeRegex.test(barcode)) {
        const barcodeSplit = barcode.split('-');
        this.OrderInfo$ = this.searchOrder
          .watch(
            {
              DistributionCenter: DistributionCenter,
              OrderNumber: barcodeSplit[0],
              NOSINumber: barcodeSplit[1],
            },
            { fetchPolicy: 'no-cache' }
          )
          .valueChanges.pipe(map((res) => res.data.findOrder));
      }
      this.barcode.nativeElement.select();
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
        switchMap((res) =>
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
