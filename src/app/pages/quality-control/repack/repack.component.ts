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

import { QualityControlService } from '../quality-control.server';
import {
  VerifyQcRepackGQL,
  UpdateMerpForLastLineAfterQcRepackGQL,
  UpdateSourceAndTargetContainerAfterQcRepackGQL,
} from '../../../graphql/qualityControl.graphql-gen';
import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Update_OrderLineDetailGQL } from '../../../graphql/wms.graphql-gen';

@Component({
  selector: 'repack',
  templateUrl: './repack.component.html',
})
export class RepackComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  messageType = 'error';
  buttonStyles = 'bg-green-500';
  buttonLabel = 'submit';
  message = '';
  inProcess = 0;
  urlParams: { [key: string]: any };
  isNeed;

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
    private updateContainer: UpdateSourceAndTargetContainerAfterQcRepackGQL,
    private updateMerpLastLine: UpdateMerpForLastLineAfterQcRepackGQL,
    private gtmService: GoogleTagManagerService
  ) {
    titleService.setTitle('qc/repack');
  }

  containerForm = this.fb.group({
    container: [
      '',
      [Validators.required, Validators.pattern(ToteBarcodeRegex)],
    ],
  });

  ngOnInit(): void {
    this.urlParams = { ...this.route.snapshot.queryParams };
    this.qcService.changeTab(4);
  }

  @ViewChild('container') containerInput: ElementRef;
  @ViewChild('containerError') containerError: ElementRef;
  shortcuts: ShortcutInput[] = [];
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.containerInput.nativeElement.select();
    }, 10);
    this.shortcuts.push({
      key: ['ctrl + s'],
      label: 'Quick Access',
      description: 'Submit',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: () => {
        this.onSubmit();
      },
    });
  }

  onSubmit(): void {
    this.message = '';
    if (this.containerForm.invalid) {
      if (this.containerForm.get('container').errors.required)
        this.containerError.nativeElement.textContent =
          'A Tote barcode is required.';
      if (this.containerForm.get('container').errors.pattern)
        this.containerError.nativeElement.textContent =
          'Incorrect barcode format.';
      this.containerError.nativeElement.classList.remove('hidden');
      return;
    }

    this.isLoading = true;
    this.containerError.nativeElement.classList.add('hidden');
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
              OrderNumber: this.urlParams.OrderNum,
              NOSINumber: this.urlParams.NOSI,
            },
          },
          { fetchPolicy: 'no-cache' }
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
                  itn.InternalTrackingNumber !== this.urlParams.ITN &&
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
              if (line.InternalTrackingNumber !== this.urlParams.ITN) {
                line.StatusID !== environment.qcComplete_ID && ++inProcess;
              } else {
                sourceContainer = line.ContainerID;
              }
            });

            // Setup graphql queries
            const updateDetail = this.updateOrderLineDetail.mutate({
              InternalTrackingNumber: this.urlParams.ITN,
              OrderLineDetail: {
                StatusID: environment.qcComplete_ID,
                ContainerID: targetContainer._id,
              },
            });

            const updateContainer = this.updateContainer.mutate({
              targetID: targetContainer._id,
              targetContainer: {
                Warehouse: '01',
                Row: 'QC',
                Aisle: null,
                Section: null,
                Shelf: null,
                ShelfDetail: null,
              },
              sourceID: sourceContainer,
              sourceContainer: {
                Warehouse: null,
                Row: null,
                Aisle: null,
                Section: null,
                Shelf: null,
                ShelfDetail: null,
              },
            });

            const updateMerpLog = this.updateMerpLastLine.mutate({
              OrderNumber: this.urlParams.OrderNum,
              NOSINumber: this.urlParams.NOSI,
              Status: '60',
              UserOrStatus: 'AGGREGATION-IN',
            });

            // Send different query combination
            const updateQueries = {
              updateDetail,
              updateContainer,
              updateMerpLog,
            };
            if (targetContainer._id === sourceContainer)
              delete updateQueries.updateContainer;
            if (inProcess) delete updateQueries.updateMerpLog;
            // if target container has item in it and these items's status is after aggregation out, then clean up Container ID from previous order detail table
            if (targetContainer.ORDERLINEDETAILs.length) {
              const needCleanup = targetContainer.ORDERLINEDETAILs.some(
                (itn) => {
                  return (
                    itn.InternalTrackingNumber !== this.urlParams.ITN &&
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
            let error = '';
            if (!res.updateDetail.data.updateOrderLineDetail.length) {
              error += `\nFail to update OrderLineDetail SQL`;
            }
            if (
              res.updateContainer &&
              !res.updateContainer.data.source.length
            ) {
              error += `\nFail to update source Container SQL`;
            }
            if (
              res.updateContainer &&
              !res.updateContainer.data.target.length
            ) {
              error += `\nFail to update target Container SQL`;
            }
            if (
              res.cleanContainerFromPrevOrder &&
              !res.cleanContainerFromPrevOrder.data.updateOrderLineDetail.length
            ) {
              error += `\nFail to clean container in previous OrderLineDetail`;
            }
            if (error) throw `${this.urlParams.ITN}`.concat(error);
          })
        )

        .subscribe(
          (res) => {
            let type = 'info';
            let message = `QC complete for ${this.urlParams.ITN}`;
            if (res.updateMerpLog) {
              type = 'success';
              message = `QC complete for ${this.urlParams.ITN}\nQC complete for Order ${this.urlParams.OrderNum}`;
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
            this.messageType = 'error';
            this.message = error;
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
