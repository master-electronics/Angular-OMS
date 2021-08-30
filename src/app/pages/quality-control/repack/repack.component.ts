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
  InventoryUpdate,
  OrderUpdate,
  UpdateInventoryAfterQcGQL,
  UpdateContainerAfterQcGQL,
  UpdateAfterQcLastLineGQL,
} from '../../../graphql/forQualityControl.graphql-gen';
import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { switchMap } from 'rxjs/operators';

const ToteTypeID = 15;
const QCDoneID = 1;
const DistributionCenter = 'PH';

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
  Inventory: InventoryUpdate;
  Order: OrderUpdate;
  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private qcService: QualityControlService,
    private verifyQCRepack: VerifyQcRepackGQL,
    private updateInventoryAfterQC: UpdateInventoryAfterQcGQL,
    private updateContainerAfterQC: UpdateContainerAfterQcGQL,
    private updateAfterQCLastLine: UpdateAfterQcLastLineGQL,
    private gtmService: GoogleTagManagerService
  ) {}

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
            DistributionCenter: DistributionCenter,
            Barcode: this.containerForm.value.container,
            OrderNumber: this.urlParams.OrderNum,
            NOSINumber: this.urlParams.NOSI,
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.pipe(
          switchMap((res) => {
            const container = res.data.findContainer;
            const order = res.data.findOrder;
            if (container[0].TypeID !== ToteTypeID) {
              throw 'This container is not a tote!';
            }

            // Search all inventries by containerID, if has ITN record != current ITN, return error
            container[0].INVENTORies.forEach((itn) => {
              if (itn.InternalTrackingNumber !== this.urlParams.ITN) {
                throw 'This tote is not empty.';
              }
            });

            // Search all inventries by orderID, if statusID is not qc done,  ++inventoryInProcess. If inventoryInProces == 0, current ITN is the last ITN.
            let inProcess = 0;
            let isRedo: boolean;
            let sourceContainer: number;
            order[0].INVENTORies.forEach((inventory) => {
              if (inventory.InternalTrackingNumber !== this.urlParams.ITN) {
                inventory.StatusID !== QCDoneID && ++inProcess;
              } else {
                sourceContainer = inventory.ContainerID;
                isRedo = inventory.StatusID === QCDoneID;
              }
            });

            // Setup graphql queries
            const Inventory: InventoryUpdate = {
              ContainerID: container[0]._id,
              Quantity: Number(this.urlParams.Quantity),
              ROHS: this.urlParams.ROHS === '1' ? true : false,
              DateCode: this.urlParams.DateCode,
              CountryOfOrigin: this.urlParams.coo,
              StatusID: QCDoneID,
            };
            const updateInventory = this.updateInventoryAfterQC.mutate({
              Inventory: Inventory,
              ITNList: [this.urlParams.ITN],
            });

            const updateTargetContainer = this.updateContainerAfterQC.mutate(
              {
                _id: container[0]._id,
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

            const updateSourceContainer = this.updateContainerAfterQC.mutate(
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

            const OrderUpdate: OrderUpdate = {
              StatusID: QCDoneID,
            };
            const updateOrderAndMerpLog = this.updateAfterQCLastLine.mutate(
              {
                orderID: order[0]._id,
                Order: OrderUpdate,
                OrderNumber: this.urlParams.OrderNum,
                NOSINumber: this.urlParams.NOSI,
                Status: '60',
                UserOrStatus: 'AGGREGATION-IN',
              },
              { fetchPolicy: 'no-cache' }
            );

            // Send different query combination
            const updateQueries = {
              updateInventory,
              updateTargetContainer,
              updateOrderAndMerpLog,
              updateSourceContainer,
            };
            if (inProcess) delete updateQueries.updateOrderAndMerpLog;
            if (!isRedo) delete updateQueries.updateSourceContainer;
            return forkJoin(updateQueries);
          })
        )
        .subscribe(
          (res: any) => {
            try {
              let type = 'info';
              let message = `QC complete for ${this.urlParams.ITN}`;
              if (
                res.updateInventory.data.updateInventoryList.success &&
                res.updateTargetContainer.data.updateContainerLocation.success
              ) {
                if (res.updateOrderAndMerpLog) {
                  if (res.updateOrderAndMerpLog.data.updateOrder.success) {
                    type = 'success';
                    message = `QC complete for ${this.urlParams.ITN}\nQC complete for Order ${this.urlParams.OrderNum}`;
                  } else {
                    throw res.updateOrderAndMerpLog.data.updateOrder.message;
                  }
                }
              } else {
                throw (
                  res.updateInventory.data.updateInventoryList.message +
                  res.updateTargetContainer.data.updateContainerLocation.message
                );
              }
              this.sendGTM();
              this.router.navigate(['/qc'], {
                queryParams: {
                  type,
                  message,
                },
              });
            } catch (error) {
              this.isLoading = false;
              this.messageType = 'error';
              this.message = error;
              this.containerInput.nativeElement.select();
            }
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
