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

const DistributionCenter = 'PH';

@Component({
  selector: 'search-barcode',
  templateUrl: './search-barcode.component.html',
})
export class SearchBarcodeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  title = 'Search Barcode';
  isLoading = false;
  message = '';
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title
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
    if (this.barcodeForm.valid) {
      //
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
