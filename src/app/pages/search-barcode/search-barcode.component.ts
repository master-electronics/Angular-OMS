import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { CommonService } from '../../shared/services/common.service';
import {
  AggregationShelfBarcodeRegex,
  ToteBarcodeRegex,
  ITNBarcodeRegex,
  OrderBarcodeRegex,
} from '../../shared/dataRegex';
import {
  FindContainerForSearchBarcodeGQL,
  FindItNforSearchBarcodeGQL,
  FindOrderForSearchBarcodeGQL,
} from '../../graphql/searchBarcode.graphql-gen';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const DistributionCenter = 'PH';

@Component({
  selector: 'search-barcode',
  templateUrl: './search-barcode.component.html',
})
export class SearchBarcodeComponent implements AfterViewInit {
  title = 'Search Barcode';
  message = '';
  messageType = 'error';
  container$;
  ITN$;
  order$;
  isLoading = false;
  isContainer = false;
  isITN = false;
  isOrder = false;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private titleService: Title,
    private searchContainer: FindContainerForSearchBarcodeGQL,
    private searchITN: FindItNforSearchBarcodeGQL,
    private searchOrder: FindOrderForSearchBarcodeGQL
  ) {
    this.commonService.changeNavbar(this.title);
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
        this.isContainer = true;
        const containerInfo = { Barcode: barcode };
        this.container$ = this.searchContainer
          .watch({ Container: containerInfo }, { fetchPolicy: 'network-only' })
          .valueChanges.pipe(map((res) => res.data.findContainer));
      }
      if (AggregationShelfBarcodeRegex.test(barcode)) {
        this.isContainer = true;
        const containerInfo = {
          DistributionCenter: environment.DistributionCenter,
          Warehouse: barcode.substring(0, 2),
          Row: barcode.substring(3, 5),
          Aisle: barcode.substring(6, 8),
          Section: barcode.substring(9, 11),
          Shelf: barcode.substring(12, 13),
          ShelfDetail: barcode.substring(14),
        };
        this.container$ = this.searchContainer
          .watch({ Container: containerInfo }, { fetchPolicy: 'network-only' })
          .valueChanges.pipe(
            map((res) =>
              res.data.findContainer.filter((res) => res.Barcode.length === 8)
            )
          );
      }
      if (ITNBarcodeRegex.test(barcode)) {
        this.isITN = true;
        this.ITN$ = this.searchITN
          .watch(
            {
              InternalTrackingNumber: barcode,
            },
            { fetchPolicy: 'network-only' }
          )
          .valueChanges.pipe(map((res) => res.data.findOrderLineDetail));
      }
      if (OrderBarcodeRegex.test(barcode)) {
        this.isOrder = true;
        const barcodeSplit = barcode.split('-');
        this.order$ = this.searchOrder
          .watch(
            {
              DistributionCenter: DistributionCenter,
              OrderNumber: barcodeSplit[0],
              NOSINumber: barcodeSplit[1],
            },
            { fetchPolicy: 'network-only' }
          )
          .valueChanges.pipe(map((res) => res.data.findOrder));
      }
      this.barcode.nativeElement.select();
    }
  }
}
