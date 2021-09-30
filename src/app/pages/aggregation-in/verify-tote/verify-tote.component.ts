import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, Subscription } from 'rxjs';

import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { CommonService } from '../../../shared/services/common.service';
import { catchError, map, tap } from 'rxjs/operators';
import {
  UpdateMerpOrderStatusGQL,
  UpdateMerpWmsLogGQL,
  UpdateSqlAfterAgInGQL,
} from 'src/app/graphql/aggregationIn.graphql-gen';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import {
  AggregationInService,
  endContainer,
  outsetContainer,
} from '../aggregation-in.server';

@Component({
  selector: 'verify-tote',
  templateUrl: './verify-tote.component.html',
})
export class VerifyToteComponent implements OnInit, OnDestroy, AfterViewInit {
  endContainer: endContainer;
  outsetContainer: outsetContainer;
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  updateAfterAgIn$: Observable<number>;

  containerForm = this._fb.group({
    container: [
      '',
      [Validators.required, Validators.pattern(ToteBarcodeRegex)],
    ],
  });

  private subscription: Subscription = new Subscription();
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _titleService: Title,
    private _commonService: CommonService,
    private _agInService: AggregationInService,
    private _updateSql: UpdateSqlAfterAgInGQL,
    private _updateMerpLog: UpdateMerpWmsLogGQL,
    private _updateMerpOrder: UpdateMerpOrderStatusGQL,
    private _gtmService: GoogleTagManagerService,
    private _authService: AuthenticationService
  ) {
    this._commonService.changeNavbar('Verify Tote');
    this._titleService.setTitle('agIn/verify-tote');
  }

  @ViewChild('container') containerInput: ElementRef;
  ngOnInit(): void {
    this.endContainer = this._agInService.endContainer;
    this.outsetContainer = this._agInService.outsetContainer;
    if (!this.endContainer || !this.outsetContainer) {
      this._router.navigate(['agin']);
      return;
    }
  }

  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.containerForm.invalid || this.isLoading) {
      this.containerInput.nativeElement.select();
      return;
    }
    if (
      this.endContainer.type === 'shelf' &&
      this.containerForm.get('container').value !== this.outsetContainer.Barcode
    ) {
      this.alertMessage = 'Please sacn the start tote.';
      this.containerInput.nativeElement.select();
      return;
    }
    if (
      this.endContainer.type === 'tote' &&
      this.containerForm.get('container').value !== this.endContainer.Barcode
    ) {
      this.alertMessage = 'Please sacn the end tote.';
      this.containerInput.nativeElement.select();
      return;
    }

    // preper query for update info to sql and merp
    const updatequery = {};
    // if target container is shelf, update source container's location with new location, else release tote to dc.
    let sourceTote = {
      Warehouse: null,
      Row: null,
      Aisle: null,
      Section: null,
      Shelf: null,
      ShelfDetail: null,
    };
    const OrderLineDetail = {
      StatusID: environment.agInComplete_ID,
      ContainerID: this.endContainer.containerID,
    };
    if (this.endContainer.type === 'shelf') {
      sourceTote = {
        Warehouse: this.endContainer.location.Warehouse,
        Row: this.endContainer.location.Row,
        Aisle: this.endContainer.location.Aisle,
        Section: this.endContainer.location.Section,
        Shelf: this.endContainer.location.Shelf,
        ShelfDetail: this.endContainer.location.ShelfDetail,
      };
      delete OrderLineDetail.ContainerID;
    }
    // update orderlineDetail's containerID to new input container, and update StatusID as ag in complete.
    // set query for updateSql
    updatequery['updateSql'] = this._updateSql.mutate({
      ContainerID: Number(this.outsetContainer.toteID),
      Container: sourceTote,
      OrderLineDetail: OrderLineDetail,
      EventLog: {
        UserID: Number(JSON.parse(sessionStorage.getItem('userInfo'))._id),
        Event: `${this.outsetContainer.Barcode} to ${this.endContainer.Barcode}`,
        Module: `Ag In`,
        Target: `${this.endContainer.OrderNumber}-${this.endContainer.NOSINumber}`,
        SubTarget: this.endContainer.ITNsInTote.slice(0, -1),
      },
    });
    // set query for merp update.
    if (!this.outsetContainer.isRelocation) {
      updatequery['updateMerpLog'] = this._updateMerpLog.mutate({
        DistributionCenter: environment.DistributionCenter,
        FileKeyList: this.endContainer.FileKeyListforAgIn,
        ActionType: 'A',
        Action: 'line_aggregation_in',
      });
      if (this.endContainer.isLastLine) {
        updatequery['updateMerpOrder'] = this._updateMerpOrder.mutate({
          OrderNumber: this.endContainer.OrderNumber,
          NOSINumber: this.endContainer.NOSINumber,
          Status: String(environment.agInComplete_ID),
          UserOrStatus: 'AGGREGATION-OUT',
        });
      }
    }
    // update infor to sql and merp
    this.isLoading = true;
    this.updateAfterAgIn$ = forkJoin(updatequery).pipe(
      // Emit Errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tap((res: any) => {
        let error: string;
        if (!res.updateSql.data.updateOrderLineDetail.length) {
          error += `\nFail to update SQL OrderLineDetail.`;
        }
        if (!res.updateSql.data.updateContainer.length) {
          error += `\nFail to update SQL Container.`;
        }
        if (
          res.updateMerpOrder &&
          !res.updateMerpOrder.data.updateMerpOrderStatus.success
        ) {
          error += res.updateMerpOrder.data.updateMerpOrderStatus.message;
        }
        if (error)
          throw `${this.endContainer.OrderNumber}-${this.endContainer.NOSINumber}`.concat(
            error
          );
      }),

      // Navgate to first after update success
      map(() => {
        this.sendGTM();
        this._router.navigate(['agin'], {
          queryParams: {
            result: 'info',
            message: `${this.outsetContainer.Barcode} place in ${this.endContainer.Barcode}.`,
          },
        });
        return 1;
      }),

      catchError((error) => {
        this.alertMessage = error;
        this.alertType = 'error';
        this.isLoading = false;
        this.containerInput.nativeElement.select();
        return of(0);
      })
    );
  }

  sendGTM(): void {
    this._gtmService.pushTag({
      event: 'AggregationIn',
      userID: this._authService.userName,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
