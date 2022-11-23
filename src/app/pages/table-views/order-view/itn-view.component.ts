import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { OrderBarcodeRegex } from '../../../shared/utils/dataRegex';
import {
  FetchOrderDetailforitnViewGQL,
  FetchOrderLineDetailforWmsCountGQL,
  SearchIntForWmsCount,
} from '../../../graphql/tableViews.graphql-gen';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'itn-view',
  templateUrl: './itn-view.component.html',
})
export class ITNViewComponent implements OnInit, AfterViewInit {
  OrderInfo$;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private fetchOrderDetail: FetchOrderDetailforitnViewGQL,
    private findDetail: FetchOrderLineDetailforWmsCountGQL
  ) {}

  barcodeForm = this.fb.group({
    barcode: ['', [Validators.required, this.regex]],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.barcodeForm.controls;
  }

  regex(input: UntypedFormControl): { regex: { valid: boolean } } {
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
    if (urlParams.orderNumber) {
      this.barcodeForm.setValue({
        barcode: `${urlParams.orderNumber}-${urlParams.NOSINumber}`,
      });
      this.onSubmit();
    }
    if (urlParams.statusID) {
      const detail: SearchIntForWmsCount = {
        StatusID: Number(urlParams.statusID),
        Priority: urlParams.priority === '1' ? true : null,
      };
      this.fetchData(detail);
    }
  }

  fetchData(filter: SearchIntForWmsCount): void {
    this.OrderInfo$ = this.findDetail
      .fetch({ filter: filter }, { fetchPolicy: 'network-only' })
      .pipe(map((res) => res.data.fetchOrderLineDetailforWMSCount));
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
            if (res.data.findOrder.OrderNumber) {
              if (!res.data.findOrder.ORDERLINEDETAILs.length) {
                return null;
              }
              if (!res.data.findOrder.ORDERLINEDETAILs[0].Inventory) {
                return null;
              }
              return res.data.findOrder.ORDERLINEDETAILs.map((item) => ({
                ...item,
                Order: {
                  OrderNumber: res.data.findOrder.OrderNumber,
                  NOSINumber: res.data.findOrder.NOSINumber,
                },
              }));
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
