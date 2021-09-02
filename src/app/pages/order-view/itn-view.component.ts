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
import { OrderBarcodeRegex } from '../../shared/dataRegex';
import { FetchOrderDetailforitnViewGQL } from '../../graphql/orderView.graphql-gen';
import { map } from 'rxjs/operators';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { ActivatedRoute, Router } from '@angular/router';

const DistributionCenter = 'PH';

@Component({
  selector: 'itn-view',
  templateUrl: './itn-view.component.html',
})
export class ITNViewComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Order View';
  message = '';
  messageType = 'error';
  searchType: string;
  OrderInfo$: Observable<any>;

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private fetchOrderDetail: FetchOrderDetailforitnViewGQL
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
    return OrderBarcodeRegex.test(input.value) || input.value === ''
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
    const urlParams = { ...this.route.snapshot.queryParams };
    this.barcodeForm.setValue({
      barcode: `${urlParams.orderNumber}-${urlParams.NOSINumber}`,
    });
    this.OrderInfo$ = this.fetchOrderDetail
      .watch(
        {
          Order: {
            DistributionCenter: DistributionCenter,
            OrderNumber: urlParams.orderNumber,
            NOSINumber: urlParams.NOSINumber,
          },
        },
        { fetchPolicy: 'no-cache' }
      )
      .valueChanges.pipe(map((res) => res.data.findOrder));
  }

  onSubmit(): void {
    this.message = '';
    this.OrderInfo$ = null;
    const barcode = this.barcodeForm.get('barcode').value;
    if (this.barcodeForm.valid) {
      const barcodeSplit = barcode.split('-');
      this.OrderInfo$ = this.fetchOrderDetail
        .watch(
          {
            Order: {
              DistributionCenter: DistributionCenter,
              OrderNumber: barcodeSplit[0],
              NOSINumber: barcodeSplit[1],
            },
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.pipe(map((res) => res.data.findOrder));
    }
    this.barcode.nativeElement.select();
  }

  back(): void {
    this.router.navigate(['/orderview']);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
