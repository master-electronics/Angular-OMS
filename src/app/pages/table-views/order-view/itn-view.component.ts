import {
  Component,
  OnInit,
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
import { Observable } from 'rxjs';

import { OrderBarcodeRegex } from '../../../shared/dataRegex';
import { FetchOrderDetailforitnViewGQL } from '../../../graphql/tableViews.graphql-gen';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'itn-view',
  templateUrl: './itn-view.component.html',
})
export class ITNViewComponent implements OnInit, AfterViewInit {
  OrderInfo$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private fetchOrderDetail: FetchOrderDetailforitnViewGQL
  ) {}

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

  @ViewChild('barcode') barcode: ElementRef;
  ngAfterViewInit(): void {
    this.barcode.nativeElement.select();
  }

  ngOnInit(): void {
    const urlParams = { ...this.route.snapshot.queryParams };
    this.barcodeForm.setValue({
      barcode: `${urlParams.orderNumber}-${urlParams.NOSINumber}`,
    });
    this.onSubmit();
  }

  onSubmit(): void {
    const barcode = this.barcodeForm.get('barcode').value;
    if (this.barcodeForm.valid) {
      const barcodeSplit = barcode.toUpperCase().split('-');
      this.OrderInfo$ = this.fetchOrderDetail
        .fetch(
          {
            Order: {
              DistributionCenter: environment.DistributionCenter,
              OrderNumber: barcodeSplit[0],
              NOSINumber: barcodeSplit[1],
            },
          },
          { fetchPolicy: 'network-only' }
        )
        .pipe(
          map((res) => {
            if (res.data.findOrder.length) {
              return res.data.findOrder[0].ORDERLINEDETAILs;
            }
            return '';
          })
        );
    }
  }

  back(): void {
    this.router.navigate(['/orderview']);
  }
}
