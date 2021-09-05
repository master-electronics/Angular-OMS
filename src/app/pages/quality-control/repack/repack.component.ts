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
import { QualityControlService } from '../quality-control.server';
import {
  VerifyQcRepackGQL,
  UpdateMerpForLastLineAfterQcRepackGQL,
} from '../../../graphql/forQualityControl.graphql-gen';
import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Update_ContainerGQL,
  Update_OrderLineDetailGQL,
} from '../../../graphql/wms.graphql-gen';
import { Title } from '@angular/platform-browser';

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
  urlParams: { [key: string]: any };
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
    titleService.setTitle('qc/repack');
  }

  containerForm = this.fb.group({
    container: [
      '',
      [Validators.required, Validators.pattern(ToteBarcodeRegex)],
    ],
  });

  @ViewChild('container') containerInput: ElementRef;
  @ViewChild('containerError') containerError: ElementRef;
  ngOnInit(): void {
    this.urlParams = { ...this.route.snapshot.queryParams };
    this.qcService.changeTab(4);
  }
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
          switchMap((res) => {
            const returnContainer = res.data.findContainer[0];
            const returnOrder = res.data.findOrder[0];
            if (returnContainer.ContainerTypeID !== environment.toteType_ID) {
              throw 'This container is not a tote!';
            }
            if (!returnOrder.ORDERLINEDETAILs.length) {
              throw 'Invaild urlParams';
            }

            // Search all ITN by containerID, if has ITN record != current ITN, return error
            if (returnContainer.ORDERLINEDETAILs.length) {
              returnContainer.ORDERLINEDETAILs.forEach((itn) => {
                if (itn.InternalTrackingNumber !== this.urlParams.ITN) {
                  throw 'This tote is not empty.';
                }
              });
            }

            // Search all ITN by orderID, if statusID is not qc done,  ++inventoryInProcess. If inventoryInProces == 0, current ITN is the last ITN.
            let inProcess = 0;
            let isRedo: boolean;
            let sourceContainer: number;
            returnOrder.ORDERLINEDETAILs.forEach((line) => {
              if (line.InternalTrackingNumber !== this.urlParams.ITN) {
                line.StatusID !== environment.qcComplete_ID && ++inProcess;
              } else {
                sourceContainer = line.ContainerID;
                isRedo = line.StatusID === environment.qcComplete_ID;
              }
            });

            // Setup graphql queries
            const updateDetail = this.updateOrderLineDetail.mutate({
              InternalTrackingNumber: this.urlParams.ITN,
              OrderLineDetail: {
                StatusID: environment.qcComplete_ID,
                ContainerID: returnContainer._id,
              },
            });

            const updateTargetContainer = this.updateContainer.mutate(
              {
                _id: returnContainer._id,
                Container: {
                  Warehouse: '01',
                  Row: 'QC',
                  Aisle: null,
                  Section: null,
                  Shelf: null,
                  ShelfDetail: null,
                },
              },
              { fetchPolicy: 'no-cache' }
            );

            const updateSourceContainer = this.updateContainer.mutate(
              {
                _id: sourceContainer,
                Container: {
                  Warehouse: null,
                  Row: null,
                  Aisle: null,
                  Section: null,
                  Shelf: null,
                  ShelfDetail: null,
                },
              },
              { fetchPolicy: 'no-cache' }
            );

            const updateMerpLog = this.updateMerpLastLine.mutate(
              {
                OrderNumber: this.urlParams.OrderNum,
                NOSINumber: this.urlParams.NOSI,
                Status: '60',
                UserOrStatus: 'AGGREGATION-IN',
              },
              { fetchPolicy: 'no-cache' }
            );

            // Send different query combination
            const updateQueries = {
              updateDetail,
              updateTargetContainer,
              updateSourceContainer,
              updateMerpLog,
            };
            if (inProcess) delete updateQueries.updateMerpLog;
            if (!isRedo) delete updateQueries.updateSourceContainer;
            return forkJoin(updateQueries);
          }),
          tap((res: any) => {
            let error = '';
            if (!res.updateDetail.data.updateOrderLineDetail[0]) {
              error += `\nFail to update OrderLineDetail SQL`;
            }
            if (!res.updateTargetContainer.data.updateContainer[0]) {
              error += `\nFail to update Target Container SQL`;
            }
            if (
              res.updateSourceContainer &&
              !res.updateSourceContainer.data.updateContainer[0]
            ) {
              error += `\nFail to update source Container SQL`;
            }
            if (error) throw `${this.urlParams.ITN}`.concat(error);
          })
        )
        .subscribe(
          (res: any) => {
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
