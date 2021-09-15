import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { QualityControlService, urlParams } from '../quality-control.server';
import {
  VerifyQcRepackGQL,
  UpdateMerpForLastLineAfterQcRepackGQL,
} from '../../../graphql/qualityControl.graphql-gen';
import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
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
  inProcess = 0;
  urlParams = {};
  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private authService: AuthenticationService,
    private qcService: QualityControlService,
    private verifyQCRepack: VerifyQcRepackGQL,
    private updateOrderLineDetail: Update_OrderLineDetailGQL,
    private updateContainer: Update_ContainerGQL,
    private updateMerpLastLine: UpdateMerpForLastLineAfterQcRepackGQL,
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
    this.urlParams = this.route.snapshot.queryParams;
    this.qcService.changeTab(['finish', 'finish', 'finish', 'process']);
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
    this.subscription.add(
      this.verifyQCRepack
        .watch(
          {
            Container: {
              DistributionCenter: environment.DistributionCenter,
              Barcode: this.containerForm.value.container,
            },
            Order: {
              DistributionCenter: environment.DistributionCenter,
              OrderNumber: this.urlParams['OrderNum'],
              NOSINumber: this.urlParams['NOSI'],
            },
          },
          { fetchPolicy: 'network-only' }
        )

        .valueChanges.pipe(
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
                  itn.InternalTrackingNumber !== this.urlParams['ITN'] &&
                  itn.StatusID < environment.agOutComplete_ID
                )
                  throw 'This tote is not empty.';
              });
            }
          }),
          switchMap((res) => {
            const targetContainer = res.data.findContainer[0];
            const returnOrder = res.data.findOrder[0];
            // Search all ITN by orderID, if statusID is not qc done,  ++inventoryInProcess. If inventoryInProces == 0, current ITN is the last ITN.
            let inProcess = 0;
            let sourceContainer: number;
            returnOrder.ORDERLINEDETAILs.forEach((line) => {
              if (line.InternalTrackingNumber !== this.urlParams['ITN']) {
                line.StatusID !== environment.qcComplete_ID && ++inProcess;
              } else {
                sourceContainer = line.ContainerID;
              }
            });

            // Setup graphql queries
            const updateDetail = this.updateOrderLineDetail.mutate({
              InternalTrackingNumber: this.urlParams['ITN'],
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
              OrderNumber: this.urlParams['OrderNum'],
              NOSINumber: this.urlParams['NOSI'],
              Status: '60',
              UserOrStatus: 'AGGREGATION-IN',
            });

            // Send different query combination
            const updateQueries = {
              updateDetail,
              updateTargetConatiner,
              updateSourceConatiner,
              updateMerpLog,
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
            // if target container has item in it and these items's status is after aggregation out, then clean up Container ID from previous order detail table
            if (targetContainer.ORDERLINEDETAILs.length) {
              const needCleanup = targetContainer.ORDERLINEDETAILs.some(
                (itn) => {
                  return (
                    itn.InternalTrackingNumber !== this.urlParams['ITN'] &&
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
          })
        )

        .subscribe(
          (res: any) => {
            let type = 'info';
            let message = `QC complete for ${this.urlParams['ITN']}`;
            if (res.updateMerpLog) {
              type = 'success';
              message = `QC complete for ${this.urlParams['ITN']}\nQC complete for Order ${this.urlParams['OrderNum']}`;
              if (
                !res.updateMerpLog.data.updateMerpOrderStatus.success ||
                !res.updateMerpLog.data.clearMerpTote.success
              ) {
                type = 'warning';
                message = [
                  res.updateMerpLog.data.updateMerpOrderStatus.message,
                  res.updateMerpLog.data.clearMerpTote.message,
                ]
                  .filter(Boolean)
                  .join(`\n`);
              }
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
