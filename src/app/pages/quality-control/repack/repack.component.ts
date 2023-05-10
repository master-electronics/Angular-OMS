import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { itemParams, QualityControlService } from '../quality-control.server';
import {
  VerifyQcRepackGQL,
  UpdateMerpForLastLineAfterQcRepackGQL,
  UpdateMerpAfterQcRepackGQL,
  FindNewAfterUpdateBinGQL,
  CleanContainerFromPrevOrderGQL,
  UpdatStatusAfterRepackGQL,
} from '../../../graphql/qualityControl.graphql-gen';
import { ToteBarcodeRegex } from '../../../shared/utils/dataRegex';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  ChangeItnListForMerpGQL,
  Create_EventLogsGQL,
  Insert_UserEventLogsGQL,
  UpdateContainerGQL,
} from '../../../graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { type } from 'os';

@Component({
  selector: 'repack',
  templateUrl: './repack.component.html',
})
export class RepackComponent implements OnInit, AfterViewInit {
  isLoading = false;
  needSearch = false;
  alertType = 'error';
  buttonStyles = 'bg-green-500';
  buttonLabel = 'submit';
  alertMessage = '';
  itemInfo: itemParams;
  insertlogQuery;
  submit$;
  fetchID$;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private titleService: Title,
    private qcService: QualityControlService,
    private verifyQCRepack: VerifyQcRepackGQL,
    private updateContainer: UpdateContainerGQL,
    private updateStatus: UpdatStatusAfterRepackGQL,
    private cleanContainer: CleanContainerFromPrevOrderGQL,
    private updateMerpLastLine: UpdateMerpForLastLineAfterQcRepackGQL,
    private updateMerp: UpdateMerpAfterQcRepackGQL,
    private insertUserEventLog: Create_EventLogsGQL,
    private eventLog: EventLogService,
    private findNewID: FindNewAfterUpdateBinGQL,
    private _location: ChangeItnListForMerpGQL
  ) {
    this.titleService.setTitle('qc/repack');
  }

  containerForm = this.fb.group({
    container: [
      '',
      [Validators.required, Validators.pattern(ToteBarcodeRegex)],
    ],
  });

  ngOnInit(): void {
    this.qcService.changeTab(['finish', 'finish', 'finish', 'process']);
    this.itemInfo = this.qcService.itemInfo;
    if (!this.itemInfo) {
      this.router.navigate(['qc']);
      return;
    }
    // if (this.itemInfo.isHold) {
    //   this.findDetailID();
    // }
  }

  @ViewChild('container') containerInput!: ElementRef;
  @ViewChild('containerError') containerError!: ElementRef;
  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  // findDetailID(): void {
  //   this.isLoading = true;
  //   this.fetchID$ = this.findNewID
  //     .fetch(
  //       {
  //         DistributionCenter: environment.DistributionCenter,
  //         InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
  //       },
  //       { fetchPolicy: 'network-only' }
  //     )
  //     .pipe(
  //       map((res) => {
  //         this.isLoading = false;
  //         let message = '';
  //         if (
  //           res.data.findInventory.ORDERLINEDETAILs[0].BinLocation.toLowerCase().trim() !==
  //           'qc'
  //         ) {
  //           this.needSearch = true;
  //           message = `Bin location is not qc, Click search button again!`;
  //         }
  //         if (res.data.findInventory.ORDERLINEDETAILs.length > 1) {
  //           this.needSearch = true;
  //           message = `More than one record, Click search button again!`;
  //         }
  //         if (this.needSearch) {
  //           this.needSearch = true;
  //           this.alertType = 'error';
  //           this.alertMessage = message;
  //           this.containerInput.nativeElement.select();
  //         }
  //         this.itemInfo.OrderLineDetailID =
  //           res.data.findInventory.ORDERLINEDETAILs[0]._id;
  //         this.itemInfo.InventoryID = res.data.findInventory._id;
  //       }),
  //       catchError((error) => {
  //         this.isLoading = false;
  //         this.needSearch = true;
  //         this.alertType = 'error';
  //         this.alertMessage = error;
  //         this.containerInput.nativeElement.select();
  //         return error;
  //       })
  //     );
  // }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.containerForm.invalid) {
      return;
    }
    if (this.needSearch) {
      return;
    }

    this.isLoading = true;
    let inProcess = 0;
    let sourceContainer: number;
    let updateQueries;
    let targetContainer;

    this.submit$ = this.verifyQCRepack
      .fetch(
        {
          DistributionCenter: environment.DistributionCenter,
          Barcode: this.containerForm.value.container,
          OrderID: this.itemInfo.OrderID,
        },
        { fetchPolicy: 'no-cache' }
      )
      .pipe(
        tap((res) => {
          targetContainer = res.data.findContainer;
          const returnOrder = res.data.findOrder;
          if (!targetContainer) throw 'This barcode is not exist.';
          if (!returnOrder) throw 'This order is not exist.';
          if (targetContainer.ContainerTypeID !== sqlData.toteType_ID)
            throw 'This container is not a tote!';
          if (!returnOrder.ORDERLINEDETAILs.length)
            throw 'This Order is not exist in OrderLineDetail.';
          // Search all ITN by containerID, if has ITN record != current ITN, and the status is before ag out, pop error.
          if (targetContainer.INVENTORies.length) {
            targetContainer.INVENTORies.forEach((itn) => {
              if (!itn.ORDERLINEDETAILs.length) return;
              if (
                itn.ORDERLINEDETAILs[0].OrderID !== this.itemInfo.OrderID &&
                itn.ORDERLINEDETAILs[0].StatusID < sqlData.agOutComplete_ID
              ) {
                throw 'This tote has other order item in it.';
              }
              if (
                itn.ORDERLINEDETAILs[0].OrderID === this.itemInfo.OrderID &&
                ![sqlData.warehouseHold_ID, sqlData.qcComplete_ID].includes(
                  itn.ORDERLINEDETAILs[0].StatusID
                )
              ) {
                throw 'This tote is not in QC area.';
              }
            });
          }
          // Search all ITN by orderID, if statusID is not qc done,  ++inventoryInProcess. If inventoryInProces == 0, current ITN is the last ITN.
          returnOrder.ORDERLINEDETAILs.forEach((line) => {
            if (
              line.Inventory?.InventoryTrackingNumber !==
              this.itemInfo.InventoryTrackingNumber
            ) {
              line.StatusID < sqlData.qcComplete_ID && ++inProcess;
            } else {
              sourceContainer = line.Inventory.ContainerID;
            }
          });
        }),
        switchMap((res) => {
          const targetContainer = res.data.findContainer;
          // Setup graphql queries
          const updatQCComplete = this.updateMerp.mutate({
            InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
            DateCode: this.itemInfo.DateCode,
            CountryOfOrigin: this.itemInfo.CountryISO2,
            ROHS: this.itemInfo.ROHS ? 'Y' : 'N',
            CountMethod: this.itemInfo.CountMethod,
          });

          const oldLogs = [
            {
              UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
              OrderNumber: this.itemInfo.OrderNumber,
              NOSINumber: this.itemInfo.NOSI,
              InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
              UserEventID: sqlData.Event_QC_Done,
              OrderLineNumber: this.itemInfo.OrderLineNumber,
              Message: `Repack to ${this.containerForm.value.container}`,
              CustomerNumber: this.itemInfo.CustomerNumber,
              CustomerTier: this.itemInfo.CustomerTier,
              DistributionCenter: this.itemInfo.DistributionCenter,
              PartNumber: this.itemInfo.PartNumber,
              ProductCode: this.itemInfo.ProductCode,
              ProductTier: this.itemInfo.ProductTier,
              Quantity: this.itemInfo.Quantity,
              ParentITN: this.itemInfo.ParentITN,
              ShipmentMethod: this.itemInfo.ShipmentMethod,
              ShipmentMethodDescription:
                this.itemInfo.ShipmentMethodDescription,
              WMSPriority: this.itemInfo.WMSPriority,
              Priority: this.itemInfo.Priority,
            },
          ];
          const eventLogs = [
            {
              ...this.eventLog.eventLog,
              EventTypeID: sqlData.Event_QC_Done,
              Log: JSON.stringify({
                ...JSON.parse(this.eventLog.eventLog.Log),
                Message: `Repack to ${this.containerForm.value.container}`,
              }),
            },
          ];
          if (!inProcess) {
            oldLogs.push({
              UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
              OrderNumber: this.itemInfo.OrderNumber,
              NOSINumber: this.itemInfo.NOSI,
              UserEventID: sqlData.Event_QC_OrderComplete,
              InventoryTrackingNumber: null,
              OrderLineNumber: this.itemInfo.OrderLineNumber,
              Message: null,
              CustomerNumber: this.itemInfo.CustomerNumber,
              CustomerTier: this.itemInfo.CustomerTier,
              DistributionCenter: this.itemInfo.DistributionCenter,
              PartNumber: null,
              ProductCode: null,
              ProductTier: null,
              Quantity: null,
              ParentITN: null,
              ShipmentMethod: this.itemInfo.ShipmentMethod,
              ShipmentMethodDescription:
                this.itemInfo.ShipmentMethodDescription,
              Priority: this.itemInfo.Priority,
              WMSPriority: null,
            });
            eventLogs.push({
              ...this.eventLog.eventLog,
              EventTypeID: sqlData.Event_QC_OrderComplete,
              Log: JSON.stringify({
                OrderNumber: this.itemInfo.OrderNumber,
                NOSINumber: this.itemInfo.NOSI,
                OrderLineNumber: this.itemInfo.OrderLineNumber,
                CustomerNumber: this.itemInfo.CustomerNumber,
                CustomerTier: this.itemInfo.CustomerTier,
                DistributionCenter: this.itemInfo.DistributionCenter,
                ShipmentMethod: this.itemInfo.ShipmentMethod,
                ShipmentMethodDescription:
                  this.itemInfo.ShipmentMethodDescription,
                Priority: this.itemInfo.Priority,
              }),
            });
          }
          this.insertlogQuery = this.insertUserEventLog.mutate({
            oldLogs,
            eventLogs,
          });

          const updateTargetConatiner = this.updateContainer.mutate({
            ContainerID: targetContainer._id,
            Container: {
              Warehouse: '01',
              Row: 'QC',
              Aisle: null,
              Section: null,
              Shelf: null,
              ShelfDetail: null,
            },
          });
          const updateSourceConatiner = this.updateContainer.mutate({
            ContainerID: sourceContainer,
            Container: {
              Warehouse: null,
              Row: null,
              Aisle: null,
              Section: null,
              Shelf: null,
              ShelfDetail: null,
            },
          });

          const updateMerpLog = this.updateMerpLastLine.mutate({
            OrderNumber: this.itemInfo.OrderNumber,
            NOSINumber: this.itemInfo.NOSI,
            Status: '60',
            UserOrStatus: 'AGGREGATION-IN',
          });

          // Send different query combination
          updateQueries = {
            updateTargetConatiner,
            updateSourceConatiner,
            updateMerpLog,
            updatQCComplete,
          };
          sqlData.qcComplete_ID;
          if (targetContainer._id === sourceContainer) {
            delete updateQueries.updateTargetConatiner;
            delete updateQueries.updateSourceConatiner;
          }
          if (inProcess) delete updateQueries.updateMerpLog;
          // if target container has other order's item in it and these items's status is after aggregation out, then updaet Binlocation for M1binloc
          const cleanupItnList = [];
          if (targetContainer.INVENTORies.length) {
            targetContainer.INVENTORies.forEach((itn) => {
              if (!itn.ORDERLINEDETAILs[0]) {
                cleanupItnList.push({
                  User: JSON.parse(sessionStorage.getItem('userInfo')).Name,
                  ITN: this.itemInfo.InventoryTrackingNumber,
                  BinLocation: 'qc',
                });
                return;
              }
              if (
                itn.ORDERLINEDETAILs[0].OrderID !== this.itemInfo.OrderID &&
                itn.ORDERLINEDETAILs[0].StatusID >= sqlData.agOutComplete_ID
              ) {
                cleanupItnList.push({
                  User: JSON.parse(sessionStorage.getItem('userInfo')).Name,
                  ITN: itn.InventoryTrackingNumber,
                  BinLocation: 'qc',
                });
              }
            });
            if (cleanupItnList.length) {
              updateQueries['cleanContainerFromPrevOrder'] =
                this._location.mutate({
                  ITNList: cleanupItnList,
                });
            }
          }
          return forkJoin(updateQueries);
        }),
        tap((res: any) => {
          let error: string;
          if (
            res.updateTargetContainer &&
            !res.updateTargetContainer.data.updateContainer[0]
          ) {
            error += `${this.itemInfo.InventoryTrackingNumber} Fail to update Target Container SQL`;
          }
          if (
            res.updateSourceContainer &&
            !res.updateSourceContainer.data.updateContainer[0]
          ) {
            error += `${this.itemInfo.InventoryTrackingNumber} Fail to update source Container SQL`;
          }
          if (error) throw error;
        }),
        switchMap(() => {
          const updateDetail = this.updateStatus.mutate({
            OrderLineDetailID: this.itemInfo.OrderLineDetailID,
            Status: sqlData.qcComplete_ID,
          });
          const updateBin = this._location.mutate({
            ITNList: [
              {
                ITN: this.itemInfo.InventoryTrackingNumber,
                User: JSON.parse(sessionStorage.getItem('userInfo')).Name,
                BinLocation: this.containerForm.value.container,
              },
            ],
          });
          return forkJoin({ updateDetail, updateBin });
        }),
        tap((res: any) => {
          if (!res.updateDetail.data.updateOrderLineDetail[0]) {
            throw `${this.itemInfo.InventoryTrackingNumber} Fail to update OrderLineDetail SQL`;
          }
          if (!res.updateBin.data.changeItnListForMerp) {
            throw `${this.itemInfo.InventoryTrackingNumber} Fail to update Binlocation in Merp`;
          }
        }),
        switchMap((res: any) => {
          this.type = 'info';
          this.message = `QC complete for ${this.itemInfo.InventoryTrackingNumber}`;
          if (res.updateMerpLog) {
            this.type = 'success';
            this.message = `QC complete for ${this.itemInfo.InventoryTrackingNumber}\nQC complete for Order ${this.itemInfo.OrderNumber}`;
          }
          return this.insertlogQuery;
        }),
        map(() => {
          this.router.navigate(['/qc'], {
            queryParams: {
              type: this.type,
              message: this.message,
            },
          });
        }),
        catchError((err) => {
          this.isLoading = false;
          this.alertType = 'error';
          this.alertMessage = err;
          this.containerInput.nativeElement.select();
          return err;
        })
      );
  }
  type;
  message;
}
