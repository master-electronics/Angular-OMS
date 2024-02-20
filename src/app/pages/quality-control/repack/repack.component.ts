import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { itemParams, QualityControlService } from '../quality-control.server';
import {
  VerifyQcRepackGQL,
  UpdateMerpForLastLineAfterQcRepackGQL,
  UpdateMerpAfterQcRepackGQL,
  UpdatStatusAfterRepackGQL,
} from '../../../graphql/qualityControl.graphql-gen';
import { ToteBarcodeRegex } from '../../../shared/utils/dataRegex';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  ChangeItnListForMerpGQL,
  Create_EventLogsGQL,
  UpdateContainerGQL,
} from '../../../graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FocusInvlidInputDirective } from '../../../shared/directives/focusInvalidInput.directive';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NgIf, AsyncPipe } from '@angular/common';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { HDIService } from 'src/app/shared/data/hdi';

@Component({
  selector: 'repack',
  templateUrl: './repack.component.html',
  standalone: true,
  imports: [
    NgIf,
    NzDescriptionsModule,
    NzDividerModule,
    FormsModule,
    NzFormModule,
    FocusInvlidInputDirective,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzAlertModule,
    AsyncPipe,
  ],
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
    private updateMerpLastLine: UpdateMerpForLastLineAfterQcRepackGQL,
    private updateMerp: UpdateMerpAfterQcRepackGQL,
    private insertUserEventLog: Create_EventLogsGQL,
    private eventLog: EventLogService,
    private _userInfo: StorageUserInfoService,
    private _location: ChangeItnListForMerpGQL,
    private _hdi: HDIService
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
  }

  @ViewChild('container') containerInput!: ElementRef;
  @ViewChild('containerError') containerError!: ElementRef;
  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.containerForm.invalid) {
      return;
    }
    if (this.needSearch) {
      return;
    }
    const barcode = this.containerForm.value.container;
    this.isLoading = true;
    let inProcess = 0;
    let sourceContainer: number;
    let updateQueries;
    let targetContainer;

    this.submit$ = this.verifyQCRepack
      .fetch(
        {
          DistributionCenter: this._userInfo.distributionCenter,
          Barcode: barcode,
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

          const oldLogs = [
            {
              UserName: this._userInfo.userName,
              OrderNumber: this.itemInfo.OrderNumber,
              NOSINumber: this.itemInfo.NOSI,
              InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
              UserEventID: sqlData.Event_QC_Done,
              OrderLineNumber: this.itemInfo.OrderLineNumber,
              Message: `Repack to ${barcode}`,
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
                Message: `Repack to ${barcode}`,
              }),
            },
          ];
          if (!inProcess) {
            oldLogs.push({
              UserName: this._userInfo.userName,
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

          // Send different query combination
          updateQueries = {
            updateTargetConatiner,
            updateSourceConatiner,
          };
          sqlData.qcComplete_ID;
          if (targetContainer._id === sourceContainer) {
            delete updateQueries.updateTargetConatiner;
            delete updateQueries.updateSourceConatiner;
          }
          // if target container has other order's item in it and these items's status is after aggregation out, then updaet Binlocation for M1binloc
          const cleanupItnList = [];
          if (targetContainer.INVENTORies.length) {
            targetContainer.INVENTORies.forEach((itn) => {
              // if no orderlinedetail, means that inventory is old.
              if (!itn.ORDERLINEDETAILs[0]) {
                return;
              }
              if (
                itn.ORDERLINEDETAILs[0].OrderID !== this.itemInfo.OrderID &&
                itn.ORDERLINEDETAILs[0].StatusID >= sqlData.agOutComplete_ID
              ) {
                cleanupItnList.push({
                  User: this._userInfo.userName,
                  ITN: itn.InventoryTrackingNumber,
                  BinLocation: 'PACKING',
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
          if (Object.keys(updateQueries).length === 0) {
            return of(true);
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
                User: this._userInfo.userName,
                BinLocation: barcode,
              },
            ],
          });
          return forkJoin({ updateDetail, updateBin });
        }),
        tap((res: any) => {
          if (!res.updateBin.data.changeItnListForMerp) {
            throw `${this.itemInfo.InventoryTrackingNumber} Fail to update Binlocation in Merp`;
          }
        }),
        switchMap((res: any) => {
          const updatInfo = this.updateMerp.mutate({
            InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
            DateCode: this.itemInfo.DateCode,
            CountryOfOrigin: this.itemInfo.CountryISO2,
            ROHS: this.itemInfo.ROHS ? 'Y' : 'N',
            CountMethod: this.itemInfo.CountMethod,
          });
          const updateStatus = this.updateMerpLastLine.mutate({
            OrderNumber: this.itemInfo.OrderNumber,
            NOSINumber: this.itemInfo.NOSI,
            Status: '60',
            UserOrStatus: 'AGGREGATION-IN',
          });
          const query = { updateStatus, updatInfo };
          if (inProcess) {
            delete query['updateStatus'];
          }
          return forkJoin(query);
        }),
        switchMap((res: any) => {
          this.qcService.alertType.set('info');
          this.qcService.alertMessage.set(
            `QC complete for ${this.itemInfo.InventoryTrackingNumber}`
          );
          if (res.updateStatus) {
            this.qcService.alertType.set('success');
            this.qcService.alertMessage.set(
              `QC complete for ${this.itemInfo.InventoryTrackingNumber}\nQC complete for Order ${this.itemInfo.OrderNumber}`
            );
            this.type = 'success';
          }
          return this.insertlogQuery;
        }),
        map(() => {
          let link = '/qc';
          if (this._hdi.device) {
            link = '/qc/logweight';
          }
          this.router.navigate([link]);
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
