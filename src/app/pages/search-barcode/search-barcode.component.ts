import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { CommonService } from '../../shared/services/common.service';
import {
  AggregationShelfBarcodeRegex,
  ToteBarcodeRegex,
  ITNBarcodeRegex,
  OrderBarcodeRegex,
} from '../../shared/utils/dataRegex';
import {
  FindContainerForSearchBarcodeGQL,
  FindItNforSearchBarcodeGQL,
  FindOrderForSearchBarcodeGQL,
} from '../../graphql/searchBarcode.graphql-gen';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'search-barcode',
  templateUrl: './search-barcode.component.html',
})
export class SearchBarcodeComponent implements AfterViewInit {
  title = 'Search Barcode';
  isLoading = false;
  isContainer = false;
  isITN = false;
  isOrder = false;
  search$ = new Observable<any>();
  displayContainer = [];
  displayITN = [];
  displayOrder = [];

  constructor(
    private commonService: CommonService,
    private fb: UntypedFormBuilder,
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

  regex(input: UntypedFormControl): { regex: { valid: boolean } } {
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
    this.barcode.nativeElement.select();
  }

  onSubmit(): void {
    this.isContainer = false;
    this.isITN = false;
    this.isOrder = false;
    const barcode = this.barcodeForm.get('barcode').value;
    if (this.barcodeForm.valid) {
      this.isLoading = true;
      if (ToteBarcodeRegex.test(barcode)) {
        this.isContainer = true;
        const containerInfo = {
          Barcode: barcode,
          DistributionCenter: environment.DistributionCenter,
        };
        this.search$ = this.searchContainer
          .fetch({ Container: containerInfo }, { fetchPolicy: 'network-only' })
          .pipe(
            map((res) => {
              this.isLoading = false;
              return res.data.findContainers;
            })
          );
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
        this.search$ = this.searchContainer
          .fetch({ Container: containerInfo }, { fetchPolicy: 'network-only' })
          .pipe(
            map((res) => {
              this.isLoading = false;
              return res.data.findContainers.filter(
                (res) => res.Barcode.length === 8
              );
            })
          );
      }
      if (ITNBarcodeRegex.test(barcode)) {
        this.isITN = true;
        this.search$ = this.searchITN
          .fetch(
            {
              InventoryTrackingNumber: barcode,
            },
            { fetchPolicy: 'network-only' }
          )
          .pipe(
            map((res) => {
              this.isLoading = false;
              return [res.data.findInventory];
            })
          );
      }
      if (OrderBarcodeRegex.test(barcode)) {
        this.isOrder = true;
        const barcodeSplit = barcode.split('-');
        this.search$ = this.searchOrder
          .fetch(
            {
              DistributionCenter: environment.DistributionCenter,
              OrderNumber: barcodeSplit[0],
              NOSINumber: barcodeSplit[1],
            },
            { fetchPolicy: 'network-only' }
          )
          .pipe(
            map((res) => {
              this.isLoading = false;
              return [res.data.findOrder];
            })
          );
      }
      this.barcode.nativeElement.select();
    }
  }
}
