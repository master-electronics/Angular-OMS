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
} from '../../../graphql/qualityControl.graphql-gen';
import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Create_EventLogGQL,
  Insert_UserEventLogsGQL,
  Update_ContainerGQL,
  Update_OrderLineDetailGQL,
} from '../../../graphql/wms.graphql-gen';

@Component({
  selector: 'repack',
  templateUrl: './repack.component.html',
})
export class RepackComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
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
    private updateOrderLineDetail: Update_OrderLineDetailGQL,
    private updateContainer: Update_ContainerGQL,
    private updateMerpLastLine: UpdateMerpForLastLineAfterQcRepackGQL,
    private updateMerp: UpdateMerpAfterQcRepackGQL,
    private createEventLog: Create_EventLogGQL,
    private insertUserEventLog: Insert_UserEventLogsGQL,
    private gtmService: GoogleTagManagerService
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
    setTimeout(() => {
      this.containerInput.nativeElement.select();
    }, 10);
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.containerForm.invalid) {
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
            if (targetContainer.ContainerTypeID !== environment.toteType_ID)
              throw 'This container is not a tote!';
            if (!returnOrder.ORDERLINEDETAILs.length)
              throw 'This Order is not exist in OrderLineDetail.';
            // Search all ITN by containerID, if has ITN record != current ITN, and the status is before ag out, pop error.
            if (targetContainer.ORDERLINEDETAILs.length) {
              targetContainer.ORDERLINEDETAILs.forEach((itn) => {
                if (
                  itn.OrderID !== this.itemInfo.OrderID &&
                  itn.StatusID < environment.agOutComplete_ID
                )
                  throw 'This tote has other order item in it.';
                if (
                  itn.OrderID === this.itemInfo.OrderID &&
                  itn.StatusID !== environment.qcComplete_ID
                )
                  throw 'This tote is not in QC area.';
              });
            }
            // Search all ITN by orderID, if statusID is not qc done,  ++inventoryInProcess. If inventoryInProces == 0, current ITN is the last ITN.
            returnOrder.ORDERLINEDETAILs.forEach((line) => {
              if (
                line.InternalTrackingNumber !==
                this.itemInfo.InternalTrackingNumber
              ) {
                line.StatusID < environment.qcComplete_ID && ++inProcess;
              } else {
                sourceContainer = line.ContainerID;
              }
            });
          }),
          switchMap((res) => {
            const targetContainer = res.data.findContainer[0];
            // Setup graphql queries
            const updatQCComplete = this.updateMerp.mutate({
              InternalTrackingNumber: this.itemInfo.InternalTrackingNumber,
              DateCode: this.itemInfo.DateCode,
              CountryOfOrigin: this.itemInfo.CountryOfOrigin,
              ROHS: this.itemInfo.ROHS ? 'Y' : 'N',
              CountMethod: this.itemInfo.CountMethod,
            });

            const EventLog = {
              UserID: Number(
                JSON.parse(sessionStorage.getItem('userInfo'))._id
              ),
              Event: `Repack to ${this.containerForm.value.container}`,
              Module: `qc`,
              Target: `${this.itemInfo.OrderNumber}-${this.itemInfo.NOSI}`,
              SubTarget: `${this.itemInfo.InternalTrackingNumber}`,
            };
            const UserEventLog = [
              {
                UserID: Number(
                  JSON.parse(sessionStorage.getItem('userInfo'))._id
                ),
                OrderNumber: this.itemInfo.OrderNumber,
                NOSINumber: this.itemInfo.NOSI,
                InternalTrackingNumber: this.itemInfo.InternalTrackingNumber,
                UserEventID: environment.Event_QC_Done,
                Message: EventLog.Event,
              },
            ];
            if (!inProcess) {
              EventLog.Event = 'Order Done ' + EventLog.Event;
              UserEventLog.push({
                UserID: Number(
                  JSON.parse(sessionStorage.getItem('userInfo'))._id
                ),
                OrderNumber: this.itemInfo.OrderNumber,
                NOSINumber: this.itemInfo.NOSI,
                UserEventID: environment.Event_QC_OrderComplete,
                InternalTrackingNumber: null,
                Message: null,
              });
            }
            const createEventLog = this.createEventLog.mutate({ EventLog });
            const insertUserEventLog = this.insertUserEventLog.mutate({
              log: UserEventLog,
            });
            this.updateDetail = this.updateOrderLineDetail.mutate({
              InternalTrackingNumber: this.itemInfo.InternalTrackingNumber,
              OrderLineDetail: {
                StatusID: environment.qcComplete_ID,
                ContainerID: targetContainer._id,
              },
            });

            const updateTargetConatiner = this.updateContainer.mutate({
              _id: targetContainer._id,
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
              _id: sourceContainer,
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
              createEventLog,
              insertUserEventLog,
              updateTargetConatiner,
              updateSourceConatiner,
              updateMerpLog,
              updatQCComplete,
            };
            environment.qcComplete_ID;
            if (sourceContainer === environment.DC_PH_ID) {
              delete updateQueries.updateSourceConatiner;
            }
            if (targetContainer._id === sourceContainer) {
              delete updateQueries.updateTargetConatiner;
              delete updateQueries.updateSourceConatiner;
            }
            if (inProcess) delete updateQueries.updateMerpLog;
            // if target container has other order's item in it and these items's status is after aggregation out, then clean up Container ID from previous order detail table
            if (targetContainer.ORDERLINEDETAILs.length) {
              const needCleanup = targetContainer.ORDERLINEDETAILs.some(
                (itn) => {
                  return (
                    itn.OrderID !== this.itemInfo.OrderID &&
                    itn.StatusID >= environment.agOutComplete_ID
                  );
                }
              );
              if (needCleanup)
                updateQueries['cleanContainerFromPrevOrder'] =
                  this.updateOrderLineDetail.mutate({
                    ContainerID: targetContainer._id,
                    OrderID: targetContainer.ORDERLINEDETAILs[0].OrderID,
                    OrderLineDetail: { ContainerID: environment.DC_PH_ID },
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
              error += `${this.itemInfo.InternalTrackingNumber} Fail to update Target Container SQL`;
            }
            if (
              res.updateSourceContainer &&
              !res.updateSourceContainer.data.updateContainer[0]
            ) {
              error += `${this.itemInfo.InternalTrackingNumber} Fail to update source Container SQL`;
            }
            if (error) throw error;
          }),

          switchMap(() => {
            return this.updateDetail;
          }),

          tap((res: any) => {
            if (!res.data.updateOrderLineDetail[0]) {
              throw `${this.itemInfo.InternalTrackingNumber} Fail to update OrderLineDetail SQL`;
            }
          })
        )
        .subscribe(
          (res: any) => {
            let type = 'info';
            let message = `QC complete for ${this.itemInfo.InternalTrackingNumber}`;
            if (res.updateMerpLog) {
              type = 'success';
              message = `QC complete for ${this.itemInfo.InternalTrackingNumber}\nQC complete for Order ${this.itemInfo.OrderNumber}`;
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
    const taskTime = Date.now() - this.qcService.qcStart;
    this.qcService.resetQCStartTime(Date.now());
    this.gtmService.pushTag({
      event: 'QualityControlDone',
      userID: this.authService.userName,
      taskTime: taskTime,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
