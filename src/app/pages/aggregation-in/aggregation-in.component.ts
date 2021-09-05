import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CommonService } from '../../shared/services/common.service';
import { ToteBarcodeRegex } from '../../shared/dataRegex';
import { VerifyContainerForAggregationInGQL } from '../../graphql/aggregationIn.graphql-gen';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'aggregation-in',
  templateUrl: './aggregation-in.component.html',
})
export class AggregationInComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  title = 'Aggregation In';
  isLoading = false;
  messageType = 'error';
  message = '';

  containerForm = new FormGroup({
    containerNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(ToteBarcodeRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.containerForm.controls;
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private verifyContainer: VerifyContainerForAggregationInGQL
  ) {
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle('agin');
  }

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    this.messageType = this.route.snapshot.queryParams['result'];
    this.message = this.route.snapshot.queryParams['message'];
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.containerInput.nativeElement.select();
    }, 10);
  }

  onSubmit(): void {
    this.message = '';
    if (!this.containerForm.valid) {
      this.containerInput.nativeElement.select();
      return;
    }
    this.isLoading = true;
    this.subscription.add(
      this.verifyContainer
        .watch(
          {
            Container: {
              DistributionCenter: environment.DistributionCenter,
              Barcode: this.containerForm.value.containerNumber,
            },
          },
          { fetchPolicy: 'network-only' }
        )
        .valueChanges.pipe(
          tap((res) => {
            const container = res.data.findContainer[0];
            if (container === undefined) throw 'Container not found!';
            // only accepte mobile container
            if (!container.ContainerType.IsMobile)
              throw 'This container is not mobile!';
            if (container.ORDERLINEDETAILs.length === 0)
              throw 'No item in this tote!';
            // verify all line have the same orderID and statusID in the tote
            if (
              !container.ORDERLINEDETAILs.every(
                (line, i, arr) =>
                  line.OrderID === arr[0].OrderID &&
                  line.StatusID === arr[0].StatusID
              )
            ) {
              throw 'More than 1 order in this tote.';
            }
            // only allow status is agIn complete and qc complete
            if (
              container.ORDERLINEDETAILs[0].StatusID <
                environment.qcComplete_ID ||
              container.ORDERLINEDETAILs[0].StatusID >
                environment.agOutComplete_ID
            ) {
              throw "OrderLine's status is invalid.";
            }
            // if the container already in Aggregation area, will allow multiple items in it.
            if (
              container.ORDERLINEDETAILs.length > 1 &&
              container.ORDERLINEDETAILs[0].StatusID !==
                environment.agInComplete_ID
            ) {
              throw 'More than 1 order line in this tote.';
            }
          })
        )
        .subscribe(
          (res) => {
            this.isLoading = false;
            const container = res.data.findContainer[0];
            // if pass all naveigate to next page
            const isRelocation =
              container.ORDERLINEDETAILs[0].StatusID ===
              environment.agInComplete_ID;
            const toteID = container._id;
            const Barcode = container.Barcode;
            const OrderID = container.ORDERLINEDETAILs[0].OrderID;
            const orderLineDetailID = container.ORDERLINEDETAILs[0]._id;
            this.router.navigate(['agin/location'], {
              queryParams: {
                isRelocation,
                OrderID,
                Barcode,
                orderLineDetailID,
                toteID,
              },
            });
          },
          (error) => {
            this.isLoading = false;
            this.message = error;
            this.messageType = 'error';
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
