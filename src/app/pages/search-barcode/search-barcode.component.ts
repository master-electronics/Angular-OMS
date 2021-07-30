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
import { ApolloQueryResult } from '@apollo/client/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CommonService } from '../../shared/services/common.service';
import { ITNBarcodeRegex, OrderBarcodeRegex } from '../../shared/dataRegex';
import {
  AggregationShelfBarcodeRegex,
  ToteBarcodeRegex,
} from '../../shared/dataRegex';
import { FetchToteInfoByBarcodeGQL } from '../../graphql/forSearchBarcode.graphql-gen';

const DistributionCenter = 'PH';

interface BarcodeInfo {
  location: string;
  OrderList: [
    {
      orderBarcode: string;
      ITNList: [
        {
          ITN: string;
          containerBarcode: string;
        }
      ];
    }
  ];
}

@Component({
  selector: 'search-barcode',
  templateUrl: './search-barcode.component.html',
})
export class SearchBarcodeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  title = 'Search Barcode';
  isLoading = false;
  isScanning = true;
  message = '';
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';
  barcodeInfo: BarcodeInfo;

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title,
    private fetchToteInfoByBarcode: FetchToteInfoByBarcodeGQL
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
      this.isLoading = true;
      if (ToteBarcodeRegex.test(barcode)) {
        this.fetchMobileContainerInfo(barcode);
        return;
      }
    }
  }

  fetchMobileContainerInfo(barcode: string): void {
    this.subscription.add(
      this.fetchToteInfoByBarcode
        .watch(
          { DistributionCenter: DistributionCenter, Barcode: barcode },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe((res) => {
          this.isLoading = res.loading;
          this.message = res.error ? res.error.message : '';
          const resInfo = res.data.findContainer;
          if (resInfo) {
            const locationBarcode = `${resInfo[0].Warehouse}-${resInfo[0].Row}-${resInfo[0].Aisle}-${resInfo[0].Section}-${resInfo[0].Shelf}-${resInfo[0].ShelfDetail}`;
            if (resInfo[0].INVENTORies.length === 0) {
              this.barcodeInfo = { location: locationBarcode, OrderList: null };
              return;
            }
            const firstOrderbarcode = `${resInfo[0].INVENTORies[0].Order.OrderNumber}-${resInfo[0].INVENTORies[0].Order.NOSINumber}`;
            const orderList = [firstOrderbarcode];
            this.barcodeInfo = {
              location: locationBarcode,
              OrderList: [
                {
                  orderBarcode: firstOrderbarcode,
                  ITNList: [
                    {
                      ITN: resInfo[0].INVENTORies[0].InternalTrackingNumber,
                      containerBarcode: barcode,
                    },
                  ],
                },
              ],
            };
            resInfo[0].INVENTORies.forEach((element, index) => {
              if (index === 0) return;
              const orderBarcode = `${element.Order.OrderNumber}-${element.Order.NOSINumber}`;
              if (!orderList.includes(orderBarcode)) {
                this.barcodeInfo.OrderList.push({
                  orderBarcode: orderBarcode,
                  ITNList: [
                    {
                      ITN: element.InternalTrackingNumber,
                      containerBarcode: barcode,
                    },
                  ],
                });
                orderList.push(orderBarcode);
              } else {
                this.barcodeInfo.OrderList[orderList.length - 1].ITNList.push({
                  ITN: element.InternalTrackingNumber,
                  containerBarcode: barcode,
                });
              }
            });
          }
          console.log(this.barcodeInfo);

          this.isScanning = false;
        })
    );
  }
  fetchShelfInfo(): void {
    this.subscription.add();
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
