import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { sqlData } from 'src/app/shared/utils/sqlData';
import {
  UpdateContainerAfterAgInGQL,
  UpdateLocationAndLogAfterAgInGQL,
  UpdateMerpOrderStatusGQL,
  UpdateMerpWmsLogGQL,
  UpdateStatusAfterAgInGQL,
} from 'src/app/graphql/aggregationIn.graphql-gen';
import { ITNBarcodeRegex } from '../../../shared/utils/dataRegex';
import {
  AggregationInService,
  endContainer,
  outsetContainer,
} from '../aggregation-in.server';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'verify-itn',
  templateUrl: './verify-itn.component.html',
})
export class VerifyITNComponent implements OnInit, AfterViewInit {
  alertType = 'error';
  alertMessage = '';
  isLoading = false;
  totalITNs = 0;
  itemList = [];
  selectedList = [];
  endContainer: endContainer;
  outsetContainer: outsetContainer;
  updateAfterAgIn$: Observable<number>;

  containerForm = this._fb.group({
    containerNumber: [
      '',
      [Validators.required, Validators.pattern(ITNBarcodeRegex)],
    ],
  });

  constructor(
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _agInService: AggregationInService,
    private _updateLog: UpdateLocationAndLogAfterAgInGQL,
    private _updateContainer: UpdateContainerAfterAgInGQL,
    private _updateStatus: UpdateStatusAfterAgInGQL,
    private _updateMerpLog: UpdateMerpWmsLogGQL,
    private _updateMerpOrder: UpdateMerpOrderStatusGQL
  ) {}

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    this.endContainer = this._agInService.endContainer;
    this.outsetContainer = this._agInService.outsetContainer;
    if (!this.endContainer || !this.outsetContainer) {
      this._router.navigate(['agin']);
      return;
    }
    this.itemList = this.outsetContainer.ITNsInTote.map((node) => node.ITN);
    this.totalITNs = this.itemList.length;
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
    this.selectITN();
  }

  selectITN(): void {
    let count = 0;
    this.itemList = this.itemList.filter((node) => {
      const isEqual = node === this.containerForm.get('containerNumber').value;
      if (isEqual) {
        this.selectedList.unshift(node);
        count += 1;
      }
      return !isEqual;
    });
    if (this.totalITNs === this.selectedList.length) {
      this.updateForAgIn();
    } else if (count === 0) {
      this.alertMessage = `ITN is not in the list.`;
    }

    this.containerForm.reset({
      containerNumber: '',
    });
    this.containerInput.nativeElement.select();
    return;
  }

  updateForAgIn(): void {
    // preper query for update info to sql and merp
    const updatequery = {
      updateContainer: this._updateContainer.mutate({
        sourceContainerID: this.outsetContainer.toteID,
        endContainerID: this.endContainer.containerID,
      }),
      updateStatus: this._updateStatus.mutate({
        StatusID: sqlData.agInComplete_ID,
        InventoryIDList: this._agInService.outsetContainer.ITNsInTote.map(
          (node) => node.InventoryID
        ),
      }),
    };
    // if target container is shelf, update source container's location with new location, else release tote to dc.
    let sourceTote = {
      Warehouse: null,
      Row: null,
      Aisle: null,
      Section: null,
      Shelf: null,
      ShelfDetail: null,
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
      delete updatequery.updateContainer;
    }
    // update orderlineDetail's containerID to new input container, and update StatusID as ag in complete.
    // set query for updateSql
    const log = this.outsetContainer.ITNsInTote.map((node) => {
      return {
        UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        OrderNumber: this.endContainer.OrderNumber,
        NOSINumber: this.endContainer.NOSINumber,
        UserEventID: sqlData.Event_AgIn_Relocate,
        InventoryTrackingNumber: node.ITN,
        OrderLineNumber: node.OrderLineNumber,
        Message: `Relocate ${this.outsetContainer.Barcode} to ${this.endContainer.Barcode}`,
        CustomerNumber: this.outsetContainer.CustomerNumber,
        CustomerTier: this.outsetContainer.CustomerTier,
        DistributionCenter: environment.DistributionCenter,
        PartNumber: node.PartNumber,
        ProductCode: node.ProductCode,
        ProductTier: node.ProductTier,
        Quantity: node.Quantity,
        ParentITN: node.ParentITN,
        ShipmentMethod: this.outsetContainer.ShipmentMethod,
        ShipmentMethodDescription:
          this.outsetContainer.ShipmentMethodDescription,
        Priority: this.outsetContainer.Priority,
        WMSPriority: node.WMSPriority,
      };
    });
    const updateSqlQuery = {
      ContainerID: Number(this.outsetContainer.toteID),
      Container: sourceTote,
      log: log,
    };
    // set query for merp update.
    if (!this.outsetContainer.isRelocation) {
      log.forEach((node) => {
        node.Message = node.Message.substring(9);
        node.UserEventID = sqlData.Event_AgIn_Done;
      });
      updatequery['updateMerpLog'] = this._updateMerpLog.mutate({
        DistributionCenter: environment.DistributionCenter,
        FileKeyList: this.endContainer.FileKeyListforAgIn,
        ActionType: 'A',
        Action: 'line_aggregation_in',
      });
      if (this.endContainer.isLastLine) {
        log.push({
          UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
          OrderNumber: this.endContainer.OrderNumber,
          NOSINumber: this.endContainer.NOSINumber,
          UserEventID: sqlData.Event_AgIn_OrderComplete,
          InventoryTrackingNumber: null,
          OrderLineNumber: null,
          Message: null,
          CustomerNumber: this.outsetContainer.CustomerNumber,
          CustomerTier: this.outsetContainer.CustomerTier,
          DistributionCenter: environment.DistributionCenter,
          PartNumber: null,
          ProductCode: null,
          ProductTier: null,
          Quantity: null,
          ParentITN: null,
          ShipmentMethod: this.outsetContainer.ShipmentMethod,
          ShipmentMethodDescription:
            this.outsetContainer.ShipmentMethodDescription,
          WMSPriority: null,
          Priority: this.outsetContainer.Priority,
        });
        updatequery['updateMerpOrder'] = this._updateMerpOrder.mutate({
          OrderNumber: this.endContainer.OrderNumber,
          NOSINumber: this.endContainer.NOSINumber,
          Status: String(sqlData.agInComplete_ID),
          UserOrStatus: 'AGGREGATION-OUT',
        });
      }
    }
    updatequery['updateSql'] = this._updateLog.mutate(updateSqlQuery);
    // update infor to sql and merp
    this.isLoading = true;
    this.updateAfterAgIn$ = forkJoin(updatequery).pipe(
      // Emit Errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tap((res: any) => {
        let error: string;
        if (!res.updateStatus.data.updateOrderLineDetailList.length) {
          error += `\nFail to update order Status.`;
        }
        if (!res.updateSql.data.updateContainer.length) {
          error += `\nFail to update SQL Container.`;
        }
        // if (
        //   res.updateMerpOrder &&
        //   !res.updateMerpOrder.data.updateMerpOrderStatus.success
        // ) {
        //   error += res.updateMerpOrder.data.updateMerpOrderStatus.message;
        // }
        if (error)
          throw `${this.endContainer.OrderNumber}-${this.endContainer.NOSINumber}`.concat(
            error
          );
      }),

      // Navgate to first after update success
      map(() => {
        this._router.navigate(['agin'], {
          queryParams: {
            type: 'info',
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
}
