import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { itemParams, QualityControlService } from '../quality-control.server';
import {
  VerifyQcRepackGQL,
  UpdateMerpForLastLineAfterQcRepackGQL,
  UpdateMerpAfterQcRepackGQL,
  FindNewAfterUpdateBinGQL,
  UpdateInventoryAndDetailAfterRepackGQL,
  CleanContainerFromPrevOrderGQL,
} from '../../../graphql/qualityControl.graphql-gen';
import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Insert_UserEventLogsGQL,
  UpdateContainerGQL,
} from '../../../graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/sqlData';

@Component({
  selector: 'repack',
  templateUrl: './repack.component.html',
})
export class RepackComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  needSearch = false;
  alertType = 'error';
  buttonStyles = 'bg-green-500';
  buttonLabel = 'submit';
  alertMessage = '';
  itemInfo: itemParams;
  updateDetail;
  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title,
    private authService: AuthenticationService,
    private qcService: QualityControlService,
    private verifyQCRepack: VerifyQcRepackGQL,
    private updateContainer: UpdateContainerGQL,
    private updateInventoryDetail: UpdateInventoryAndDetailAfterRepackGQL,
    private cleanContainer: CleanContainerFromPrevOrderGQL,
    private updateMerpLastLine: UpdateMerpForLastLineAfterQcRepackGQL,
    private updateMerp: UpdateMerpAfterQcRepackGQL,
    private insertUserEventLog: Insert_UserEventLogsGQL,
    private findNewID: FindNewAfterUpdateBinGQL
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
    if (!this.itemInfo.isQCDrop) {
      this.findDetailID();
    }
  }

  @ViewChild('container') containerInput!: ElementRef;
  @ViewChild('containerError') containerError!: ElementRef;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.containerInput.nativeElement.select();
    }, 10);
  }

  findDetailID(): void {
    this.isLoading = true;
    this.subscription.add(
      this.findNewID
        .fetch(
          {
            DistributionCenter: environment.DistributionCenter,
            InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
          },
          { fetchPolicy: 'network-only' }
        )
        .subscribe(
          (res) => {
            this.isLoading = false;
            let message = '';
            if (
              res.data.findInventory.ORDERLINEDETAILs[0].Container.Barcode.toLowerCase() !==
              'qc'
            ) {
              this.needSearch = true;
              message = `Bin location is not qc, Click search button again!`;
            }
            if (this.needSearch) {
              this.needSearch = true;
              this.alertType = 'error';
              this.alertMessage = message;
              this.containerInput.nativeElement.select();
            }
          },
          (error) => {
            this.isLoading = false;
            this.needSearch = true;
            this.alertType = 'error';
            this.alertMessage = error;
            this.containerInput.nativeElement.select();
          }
        )
    );
  }

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
    this.subscription.add(
      this.verifyQCRepack
        .fetch(
          {
            Container: {
              DistributionCenter: environment.DistributionCenter,
              Barcode: this.containerForm.value.container,
            },
            Order: {
              _id: this.itemInfo.OrderID,
            },
          },
          { fetchPolicy: 'no-cache' }
        )

        .pipe(
          tap((res) => {
            const targetContainer = res.data.findContainer[0];
            const returnOrder = res.data.findOrder[0];
            if (!targetContainer) throw 'This barcode is not exist.';
            if (!returnOrder) throw 'This order is not exist.';
            if (targetContainer.ContainerTypeID !== sqlData.toteType_ID)
              throw 'This container is not a tote!';
            if (!returnOrder.ORDERLINEDETAILs.length)
              throw 'This Order is not exist in OrderLineDetail.';
            // Search all ITN by containerID, if has ITN record != current ITN, and the status is before ag out, pop error.
            if (targetContainer.INVENTORies.length) {
              targetContainer.INVENTORies.forEach((itn) => {
                if (
                  itn.ORDERLINEDETAILs[0].OrderID !== this.itemInfo.OrderID &&
                  itn.ORDERLINEDETAILs[0].StatusID < sqlData.agOutComplete_ID
                )
                  throw 'This tote has other order item in it.';
                if (
                  itn.ORDERLINEDETAILs[0].OrderID === this.itemInfo.OrderID &&
                  itn.ORDERLINEDETAILs[0].StatusID !== sqlData.qcComplete_ID
                )
                  throw 'This tote is not in QC area.';
              });
            }
            // Search all ITN by orderID, if statusID is not qc done,  ++inventoryInProcess. If inventoryInProces == 0, current ITN is the last ITN.
            returnOrder.ORDERLINEDETAILs.forEach((line) => {
              if (
                line.Inventory.InventoryTrackingNumber !==
                this.itemInfo.InventoryTrackingNumber
              ) {
                line.StatusID < sqlData.qcComplete_ID && ++inProcess;
              } else {
                sourceContainer = line.Inventory.ContainerID;
              }
            });
          }),
          switchMap((res) => {
            const targetContainer = res.data.findContainer[0];
            // Setup graphql queries
            const updatQCComplete = this.updateMerp.mutate({
              InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
              DateCode: this.itemInfo.DateCode,
              CountryOfOrigin: this.itemInfo.CountryOfOrigin,
              ROHS: this.itemInfo.ROHS ? 'Y' : 'N',
              CountMethod: this.itemInfo.CountMethod,
            });

            const UserEventLog = [
              {
                UserID: Number(
                  JSON.parse(sessionStorage.getItem('userInfo'))._id
                ),
                OrderNumber: this.itemInfo.OrderNumber,
                NOSINumber: this.itemInfo.NOSI,
                InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
                UserEventID: sqlData.Event_QC_Done,
                OrderLineNumber: this.itemInfo.OrderLineNumber,
                Message: `Repack to ${this.containerForm.value.container}`,
              },
            ];
            if (!inProcess) {
              UserEventLog.push({
                UserID: Number(
                  JSON.parse(sessionStorage.getItem('userInfo'))._id
                ),
                OrderNumber: this.itemInfo.OrderNumber,
                NOSINumber: this.itemInfo.NOSI,
                UserEventID: sqlData.Event_QC_OrderComplete,
                InventoryTrackingNumber: null,
                OrderLineNumber: this.itemInfo.OrderLineNumber,
                Message: null,
              });
            }
            const insertUserEventLog = this.insertUserEventLog.mutate({
              log: UserEventLog,
            });
            this.updateDetail = this.updateInventoryDetail.mutate({
              InventoryTrackingNumber: this.itemInfo.InventoryTrackingNumber,
              OrderLineDetailID: this.itemInfo.OrderLineDetailID,
              OrderLineDetail: {
                StatusID: sqlData.qcComplete_ID,
                ContainerID: targetContainer._id,
              },
              Inventory: {
                ContainerID: targetContainer._id,
              },
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
            const updateQueries = {
              insertUserEventLog,
              updateTargetConatiner,
              updateSourceConatiner,
              updateMerpLog,
              updatQCComplete,
            };
            sqlData.qcComplete_ID;
            if (sourceContainer === sqlData.DC_PH_ID) {
              delete updateQueries.updateSourceConatiner;
            }
            if (targetContainer._id === sourceContainer) {
              delete updateQueries.updateTargetConatiner;
              delete updateQueries.updateSourceConatiner;
            }
            if (inProcess) delete updateQueries.updateMerpLog;
            // if target container has other order's item in it and these items's status is after aggregation out, then clean up Container ID from previous order detail table
            if (targetContainer.INVENTORies.length) {
              let orderID = null;
              const needCleanup = targetContainer.INVENTORies.some((itn) => {
                orderID = itn.ORDERLINEDETAILs[0].OrderID;
                return (
                  orderID !== this.itemInfo.OrderID &&
                  itn.ORDERLINEDETAILs[0].StatusID >= sqlData.agOutComplete_ID
                );
              });
              if (needCleanup)
                updateQueries['cleanContainerFromPrevOrder'] =
                  this.cleanContainer.mutate({
                    ContainerID: targetContainer._id,
                    OrderID: orderID,
                    Inventory: { ContainerID: sqlData.DC_PH_ID },
                  });
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
            return this.updateDetail;
          }),

          tap((res: any) => {
            if (!res.data.updateOrderLineDetail[0]) {
              throw `${this.itemInfo.InventoryTrackingNumber} Fail to update OrderLineDetail SQL`;
            }
          })
        )
        .subscribe(
          (res: any) => {
            let type = 'info';
            let message = `QC complete for ${this.itemInfo.InventoryTrackingNumber}`;
            if (res.updateMerpLog) {
              type = 'success';
              message = `QC complete for ${this.itemInfo.InventoryTrackingNumber}\nQC complete for Order ${this.itemInfo.OrderNumber}`;
            }
            this.sendGTM();
            this.router.navigate(['/qc'], {
              queryParams: {
                type,
                message,
              },
            });
          },
          (error) => {
            this.isLoading = false;
            this.alertType = 'error';
            this.alertMessage = error;
            this.containerInput.nativeElement.select();
          }
        )
    );
  }

  sendGTM(): void {
    // const taskTime = Date.now() - this.qcService.qcStart;
    // this.qcService.resetQCStartTime(Date.now());
    // this.gtmService.pushTag({
    //   event: 'QualityControlDone',
    //   userID: this.authService.userName,
    //   taskTime: taskTime,
    // });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
