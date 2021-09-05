import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';

import { CommonService } from '../../shared/services/common.service';
import { OrderBarcodeRegex } from '../../shared/dataRegex';
import { FetchOrderViewGQL } from '../../graphql/orderView.graphql-gen';
import { map } from 'rxjs/operators';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'order-view',
  templateUrl: './order-view.component.html',
})
export class OrderViewComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Order View';
  message = '';
  messageType = 'error';
  searchType: string;
  priorityList = [];
  shipMethodList = [];
  statusList = [];
  OrderInfo$: Observable<any>;

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private titleService: Title,
    private fetchOrderView: FetchOrderViewGQL
  ) {
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle(this.title);
  }

  filterForm = this.fb.group({
    orderBarcode: ['', [this.regex]],
    Priority: [''],
    ShippingMethod: [''],
    Status: [''],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.filterForm.controls;
  }

  regex(input: FormControl): { regex: { valid: boolean } } {
    return OrderBarcodeRegex.test(input.value) || input.value === ''
      ? null
      : {
          regex: {
            valid: false,
          },
        };
  }

  @ViewChild('orderBarcode') orderBarcode: ElementRef;
  shortcuts: ShortcutInput[] = [];
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.orderBarcode.nativeElement.select();
    }, 10);
    this.shortcuts.push({
      key: ['ctrl + s'],
      label: 'Quick Access',
      description: 'Submit',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: () => {
        this.search(true);
      },
    });
  }

  ngOnInit(): void {
    this.search(false);
  }

  search(isreload: boolean): void {
    this.message = '';
    this.OrderInfo$ = null;
    if (this.filterForm.valid) {
      let filter = this.filterForm.value;
      if (filter.orderBarcode) {
        filter.DistributionCenter = environment.DistributionCenter;
        [filter.OrderNumber, filter.NOSINumber] =
          filter.orderBarcode.split('-');
        delete filter.orderBarcode;
      }
      let isEmpty = true;
      for (const key in filter) {
        filter[key] ? (isEmpty = false) : delete filter[key];
      }
      isEmpty ? (filter = null) : null;

      this.OrderInfo$ = this.fetchOrderView
        .watch(
          {
            filter: filter,
          },
          { fetchPolicy: isreload ? 'network-only' : 'cache-first' }
        )
        .valueChanges.pipe(
          map((res) => {
            const prioritySet = new Set();
            const shipMethodSet = new Set();
            const statusSet = new Set();
            res.data.fetchOrderView.forEach((element) => {
              prioritySet.add(element.Priority);
              shipMethodSet.add(element.ShippingMethod.trim());
              statusSet.add(element.Status.trim());
            });
            this.priorityList = ['', ...prioritySet];
            this.shipMethodList = ['', ...shipMethodSet];
            this.statusList = ['', ...statusSet];
            return res.data.fetchOrderView;
          })
        );
    }
  }

  reset(): void {
    this.filterForm.setValue({
      orderBarcode: '',
      Priority: '',
      ShippingMethod: '',
      Status: '',
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
