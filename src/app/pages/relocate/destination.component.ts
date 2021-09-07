import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { VerifyContainerForAggregationInGQL } from 'src/app/graphql/aggregationIn.graphql-gen';
import {
  Update_ContainerGQL,
  Update_OrderLineDetailGQL,
} from 'src/app/graphql/wms.graphql-gen';
import { environment } from 'src/environments/environment';

import {
  AggregationShelfBarcodeRegex,
  ToteBarcodeRegex,
} from '../../shared/dataRegex';

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
})
export class DestinationComponent implements OnInit, AfterViewInit {
  isLoading = false;
  messageType = 'error';
  message = '';
  urlParams;
  updateContainer$;

  // build form
  regex(input: FormControl): { regex: { valid: boolean } } {
    return AggregationShelfBarcodeRegex.test(input.value) ||
      ToteBarcodeRegex.test(input.value) ||
      input.value === ''
      ? null
      : {
          regex: {
            valid: false,
          },
        };
  }
  containerForm = new FormGroup({
    containerNumber: new FormControl('', [Validators.required, this.regex]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.containerForm.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private verifyContainer: VerifyContainerForAggregationInGQL,
    private updateContainer: Update_ContainerGQL,
    private updateOrderLineDetail: Update_OrderLineDetailGQL
  ) {}

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.containerInput.nativeElement.select();
    }, 10);
  }

  ngOnInit(): void {
    this.urlParams = { ...this.route.snapshot.queryParams };
  }

  onSubmit(): void {
    this.message = '';
    const barcodeInput = this.f.containerNumber.value;
    const barcode =
      barcodeInput.length === 8 ? barcodeInput : barcodeInput.replace(/-/g, '');
    if (!this.containerForm.valid) {
      this.containerInput.nativeElement.select();
      return;
    }
    if (this.urlParams.Barcode === barcode) {
      this.message = 'Should scan a new Container';
      this.messageType = 'warning';
      this.containerInput.nativeElement.select();
      return;
    }
    // async pipe abservable

    this.isLoading = true;
    this.updateContainer$ = this.verifyContainer
      .fetch({
        Container: {
          DistributionCenter: environment.DistributionCenter,
          Barcode: barcode,
        },
      })

      .pipe(
        // check if destination is valid.
        tap((res) => {
          const container = res.data.findContainer[0];
          if (!container) {
            throw 'Can not find this container';
          }
          if (
            !container.ORDERLINEDETAILs.every(
              (line, i, arr) =>
                line.OrderID === arr[0].OrderID &&
                line.StatusID === arr[0].StatusID
            )
          )
            throw 'Have Different order or status in the Container.';
          // if the container before Aggregation in, will allow multiple items in it.
          if (
            container.ORDERLINEDETAILs.length > 1 &&
            container.ORDERLINEDETAILs[0].StatusID < environment.agInComplete_ID
          )
            throw 'More than one ITN in this Container.';
          // if target container is mobile, check all items in target container have the some order number with source tote.
          if (container.ContainerType.IsMobile) {
            container.ORDERLINEDETAILs.forEach((line) => {
              // check if the item in container
              if (line.OrderID !== Number(this.urlParams.OrderID)) {
                throw 'This container has other order in it.';
              }
              if (line.StatusID !== Number(this.urlParams.StatusID)) {
                throw 'This container has other order whith different Status';
              }
            });
          }
        }),

        switchMap((res) => {
          const container = res.data.findContainer[0];
          const updatequery = {};
          // if target container is shelf, update source container's location with new location, else release tote to dc.
          let sourceTote = {
            Warehouse: container.Warehouse,
            Row: container.Row,
            Aisle: container.Aisle,
            Section: container.Section,
            Shelf: container.Shelf,
            ShelfDetail: container.ShelfDetail,
          };
          const OrderLineDetail = {
            ContainerID: container._id,
          };

          // build query object base on container type
          if (container.ContainerType.IsMobile) {
            sourceTote = {
              Warehouse: null,
              Row: null,
              Aisle: null,
              Section: null,
              Shelf: null,
              ShelfDetail: null,
            };
            updatequery['updateOrderLineDetail'] =
              this.updateOrderLineDetail.mutate({
                ContainerID: Number(this.urlParams.toteID),
                OrderLineDetail,
              });
          }
          updatequery['updateContainer'] = this.updateContainer.mutate({
            _id: Number(this.urlParams.toteID),
            Container: sourceTote,
          });
          return forkJoin(updatequery);
        }),

        tap((res: any) => {
          let error = '';
          if (!res.updateContainer.data.updateContainer.length) {
            error += `\nFail to update container table in SQL`;
          }
          if (
            res.updateOrderLineDetai &&
            !res.updateOrderLineDetail.data.updateOrderLineDetail.length
          ) {
            error += `\nFail to update OrderLineDetail table in SQL`;
          }
          if (error)
            throw `${this.urlParams.Barcode} to ${barcodeInput}`.concat(error);
        }),

        // Navgate to first after update success
        map(() => {
          const message = `${this.urlParams.Barcode} to ${barcodeInput}`;
          this.router.navigate(['relocate'], {
            queryParams: {
              result: 'success',
              message,
            },
          });
          this.isLoading = false;
        }),

        catchError((error) => {
          this.message = error;
          this.isLoading = false;
          this.containerInput.nativeElement.select();
          return of();
        })
      );
  }
}
