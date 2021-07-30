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
import { Subscription } from 'rxjs';
import { QualityControlService } from '../quality-control.server';
import {
  FindContainerGQL,
  FindInventoryByContainerGQL,
  UpdateRecordsAfterQcLastLineGQL,
  InsertSqlRecordsAfterQcGQL,
  InsertSqlRecordsAfterQcMutationVariables,
  InventoryUpdate,
  OrderUpdate,
  FetchItNsInOrderGQL,
  FindInventoryListGQL,
  UpdateRecordsAfterQcLastLineMutationVariables,
} from '../../../graphql/forQualityControl.graphql-gen';
import { ToteBarcodeRegex } from '../../../shared/dataRegex';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

const ToteTypeID = 15;
const QCDoneID = 1;

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
  urlParams: { [key: string]: string };
  Inventory: InventoryUpdate;
  Order: OrderUpdate;
  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private qcService: QualityControlService,
    private insertRecords: InsertSqlRecordsAfterQcGQL,
    private updateAfterQcLastLine: UpdateRecordsAfterQcLastLineGQL,
    private findContainer: FindContainerGQL,
    private findInventory: FindInventoryByContainerGQL,
    private fetchITNsFromMerp: FetchItNsInOrderGQL,
    private findInventoryListFromSQL: FindInventoryListGQL,
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
      description: 'Next Step',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: () => {
        this.onSubmit();
      },
    });
  }

  async onSubmit(): Promise<void> {
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
    try {
      this.isLoading = true;
      const containerInfoQuery = this.fetchContainerInfo(
        this.urlParams.DC,
        this.containerForm.get('container').value.trim()
      );
      const ITNListQuery = this.fetchITNsInOrder(
        this.urlParams.DC,
        this.urlParams.OrderNum,
        this.urlParams.NOSI
      );
      const queryOne = await Promise.all([containerInfoQuery, ITNListQuery]);
      // if return null or container type is not 15(tote) stop
      if (queryOne[0].typeID !== ToteTypeID) {
        this.containerError.nativeElement.textContent =
          'This container is not a tote!';
        this.containerError.nativeElement.classList.remove('hidden');
        this.containerInput.nativeElement.select();
        this.isLoading = false;
        return;
      }
      const queryList = [];
      let isLastLine = true;
      queryList.push(this.fetchInventoryInfo(queryOne[0]._id));
      if (queryOne[1].length > 1) {
        queryList.push(this.fetchInventoryAfterQC(queryOne[1]));
      }
      const queryTwo = await Promise.all(queryList);
      // check if the tote has other item in it base on sql data.
      if (queryTwo[0]) {
        this.containerError.nativeElement.textContent =
          'This tote is not empty.';
        this.containerError.nativeElement.classList.remove('hidden');
        this.containerInput.nativeElement.select();
        this.isLoading = false;
        return;
      }
      if (queryOne[1].length > 1) {
        const difference = queryOne[1].filter(
          (itn) => !queryTwo[1].includes(itn)
        );
        if (
          difference.length === 0 ||
          (difference.length === 1 && difference[0] === this.urlParams.ITN)
        )
          isLastLine = true;
        else isLastLine = false;
      }

      this.containerError.nativeElement.classList.add('hidden');
      const Inventory: InventoryUpdate = {
        ContainerID: queryOne[0]._id,
        InternalTrackingNumber: this.urlParams.ITN,
        ProductCode: this.urlParams.PRC,
        PartNumber: this.urlParams.PartNum,
        Quantity: Number(this.urlParams.Quantity),
        ROHS: this.urlParams.ROHS === '1' ? true : false,
        DateCode: this.urlParams.DateCode,
        CountryOfOrigin: this.urlParams.coo,
        ParentITN: this.urlParams.ParentITN,
      };
      const Order: OrderUpdate = {
        DistributionCenter: this.urlParams.DC,
        OrderNumber: this.urlParams.OrderNum,
        NOSINumber: this.urlParams.NOSI,
        StatusID: QCDoneID,
      };
      if (isLastLine) {
        const updateVariables: UpdateRecordsAfterQcLastLineMutationVariables = {
          Inventory,
          Order,
          NOSINumber: this.urlParams.NOSI,
          OrderNumber: this.urlParams.OrderNum,
          Status: '60',
          UserOrStatus: 'AGGREGATION-IN',
        };
        this.updateAfterLastLine(updateVariables);
      } else {
        const InsertVariables: InsertSqlRecordsAfterQcMutationVariables = {
          Inventory,
          Order,
        };
        this.insertRecordsAfterQC(InsertVariables);
      }
    } catch (error) {
      this.isLoading = false;
      this.messageType = 'error';
      this.message = error;
      this.containerInput.nativeElement.select();
    }
  }

  fetchITNsInOrder(
    DistributionCenter: string,
    OrderNumber: string,
    NOSINumber: string
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.fetchITNsFromMerp
        .watch(
          { DistributionCenter, OrderNumber, NOSINumber },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          (response) => {
            resolve(response.data.fetchITNsInOrder.ITNList);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchInventoryAfterQC(ITNList: string[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.findInventoryListFromSQL
        .watch({ ITNList }, { fetchPolicy: 'no-cache' })
        .valueChanges.subscribe(
          (response) => {
            resolve(
              response.data.findInventoryList.map(
                (element) => element.InternalTrackingNumber
              )
            );
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchInventoryInfo(ContainerID: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.findInventory
        .watch(
          { ContainerID: ContainerID, limit: 1 },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          (response) => {
            if (response.data.findInventoriesByContainer.length) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  fetchContainerInfo(
    DC: string,
    containerNumber: string
  ): Promise<{ _id: number; typeID: number; Row: string }> {
    return new Promise((resolve, reject) => {
      this.findContainer
        .watch(
          { DistributionCenter: DC, Barcode: containerNumber },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe((response) => {
          let containerInfo;
          if (response.data.findContainer.length) {
            containerInfo = {
              _id: response.data.findContainer[0]._id,
              typeID: response.data.findContainer[0].Type._id,
              Row: response.data.findContainer[0].Row,
            };
          } else {
            reject('Barcode No Found');
          }
          if (response.data.fetchM1TOTEInfo.OrderNumber) {
            reject('This tote has items in it');
          }
          resolve(containerInfo);
        });
    });
  }

  insertRecordsAfterQC(
    InsertVariables: InsertSqlRecordsAfterQcMutationVariables
  ): void {
    this.subscription.add(
      this.insertRecords
        .mutate(InsertVariables, { fetchPolicy: 'no-cache' })
        .subscribe(
          (res) => {
            let error: string;
            if (res.data.insertSQLRecordsAfterQC.success) {
              this.sendGTM();
              this.router.navigate(['/qc'], {
                queryParams: {
                  type: 'info',
                  message: `QC complete for ${this.urlParams.ITN}`,
                },
              });
            } else {
              error = res.data.insertSQLRecordsAfterQC.message;
            }
            this.isLoading = false;
            this.messageType = 'error';
            this.message = error;
            this.containerInput.nativeElement.select();
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

  updateAfterLastLine(
    updateVariables: UpdateRecordsAfterQcLastLineMutationVariables
  ): void {
    this.subscription.add(
      this.updateAfterQcLastLine
        .mutate(updateVariables, { fetchPolicy: 'no-cache' })
        .subscribe(
          (res) => {
            let error: string;
            if (
              res.data.insertSQLRecordsAfterQC.success &&
              res.data.updateMerpOrderStatus.success &&
              res.data.clearMerpTote.success
            ) {
              this.sendGTM();
              this.router.navigate(['/qc'], {
                queryParams: {
                  type: 'success',
                  message: `QC complete for ${this.urlParams.ITN}\nQC complete for Order ${this.urlParams.OrderNum}`,
                },
              });
            } else {
              error =
                res.data.insertSQLRecordsAfterQC.message +
                res.data.updateMerpOrderStatus.message +
                res.data.clearMerpTote.message;
            }
            this.isLoading = false;
            this.messageType = 'error';
            this.message = error;
            this.containerInput.nativeElement.select();
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
