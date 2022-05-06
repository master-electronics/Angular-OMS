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
import { Observable, Subscription } from 'rxjs';

import { CommonService } from '../../shared/services/common.service';
import { ToteBarcodeRegex } from '../../shared/dataRegex';
import { VerifyContainerForAggregationInGQL } from '../../graphql/aggregationIn.graphql-gen';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { sqlData } from 'src/app/shared/sqlData';
import { AggregationInService, outsetContainer } from './aggregation-in.server';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';

@Component({
  selector: 'aggregation-in',
  templateUrl: './aggregation-in.component.html',
})
export class AggregationInComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  title = 'Aggregation In';
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  query$ = new Observable();

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
    private _commonService: CommonService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _titleService: Title,
    private _verifyContainer: VerifyContainerForAggregationInGQL,
    private _insertEventlog: Insert_UserEventLogsGQL,
    private _agInService: AggregationInService
  ) {
    this._agInService.changeOutsetContainer(null);
    this._agInService.changeEndContainer(null);
    this._commonService.changeNavbar(this.title);
    this._titleService.setTitle('agin');
  }

  @ViewChild('containerNumber') containerInput!: ElementRef;
  ngOnInit(): void {
    this.alertType = this._route.snapshot.queryParams['type'];
    this.alertMessage = this._route.snapshot.queryParams['message'];
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.containerInput.nativeElement.select();
    }, 10);
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.containerForm.valid || this.isLoading) {
      this.containerInput.nativeElement.select();
      return;
    }
    this.isLoading = true;
    this.query$ = this._verifyContainer
      .fetch(
        {
          Container: {
            DistributionCenter: environment.DistributionCenter,
            Barcode: this.containerForm.value.containerNumber,
          },
        },
        { fetchPolicy: 'network-only' }
      )

      .pipe(
        tap((res) => {
          const container = res.data.findContainer;
          if (!container?.length) throw 'Container not found!';
          // only accepte mobile container
          if (!container[0]?.ContainerType.IsMobile)
            throw 'This container is not mobile!';
          if (container[0].INVENTORies?.length === 0)
            throw 'No item in this container!';
          // verify all line have the same orderID and statusID in the tote
          if (
            !container[0].INVENTORies.every(
              (line, i, arr) =>
                line.ORDERLINEDETAILs[0].OrderID ===
                  arr[0].ORDERLINEDETAILs[0].OrderID &&
                line.ORDERLINEDETAILs[0].StatusID ===
                  arr[0].ORDERLINEDETAILs[0].StatusID
            )
          )
            throw 'Have different order or status in the container.';
          // only allow status is agIn complete and qc complete
          if (
            container[0].INVENTORies[0].ORDERLINEDETAILs[0].StatusID <
              sqlData.qcComplete_ID ||
            container[0].INVENTORies[0].ORDERLINEDETAILs[0].StatusID >=
              sqlData.agOutComplete_ID
          )
            throw "OrderLine's status is invalid.";
        }),
        switchMap((res) => {
          const container = res.data.findContainer[0];
          const logList = [];
          res.data.findContainer[0].INVENTORies.forEach((line) => {
            if (line.InventoryTrackingNumber) {
              logList.push({
                UserID: Number(
                  JSON.parse(sessionStorage.getItem('userInfo'))._id
                ),
                OrderNumber:
                  container.INVENTORies[0].ORDERLINEDETAILs[0].Order
                    .OrderNumber,
                NOSINumber:
                  container.INVENTORies[0].ORDERLINEDETAILs[0].Order.NOSINumber,
                InventoryTrackingNumber: line.InventoryTrackingNumber,
                UserEventID: sqlData.Event_AgIn_Start,
                Message: `Start ${container.Barcode}`,
              });
            }
          });
          // if pass all naveigate to next page
          const outsetContainer: outsetContainer = {
            toteID: container._id,
            Barcode: container.Barcode,
            OrderID: container.INVENTORies[0].ORDERLINEDETAILs[0].OrderID,
            orderLineDetailID: container.INVENTORies[0].ORDERLINEDETAILs[0]._id,
            InventoryID: container.INVENTORies[0]._id,
            isRelocation:
              container.INVENTORies[0].ORDERLINEDETAILs[0].StatusID ===
              sqlData.agInComplete_ID,
          };
          this._agInService.changeOutsetContainer(outsetContainer);
          return this._insertEventlog.mutate({
            log: logList,
          });
        }),
        map(() => {
          this.isLoading = false;
          this._router.navigate(['agin/location']);
          return true;
        }),
        catchError((err) => {
          this.alertMessage = err;
          this.alertType = 'error';
          this.isLoading = false;
          return [];
        })
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
