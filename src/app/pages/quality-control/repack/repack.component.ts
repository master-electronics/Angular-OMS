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
  InsertRecordsAfterQcGQL,
  InsertRecordsAfterQcMutationVariables,
  InventoryUpdate,
  OrderUpdate,
} from '../../../graphql/forQualityControl.graphql-gen';
import { BinContainerRegex } from '../../../shared/dataRegex';

const ToteTypeID = 15;
const QCDoneID = 1;

@Component({
  selector: 'repack',
  templateUrl: './repack.component.html',
})
export class RepackComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';
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
    private qcService: QualityControlService,
    private insertRecords: InsertRecordsAfterQcGQL,
    private findContainer: FindContainerGQL,
    private findInventory: FindInventoryByContainerGQL
  ) {}

  containerForm = this.fb.group({
    container: [
      '',
      [Validators.required, Validators.pattern(BinContainerRegex)],
    ],
  });

  @ViewChild('container') containerInput: ElementRef;
  @ViewChild('containerError') containerError: ElementRef;
  ngOnInit(): void {
    this.urlParams = { ...this.route.snapshot.queryParams };
    this.qcService.changeTab(4);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.containerInput.nativeElement.select();
    }, 10);
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
      const containerInfo = await this.fetchContainerInfo(
        this.urlParams.DC,
        this.containerForm.get('container').value.trim()
      );
      // if return null or container type is not 15(tote) stop
      if (containerInfo.typeID !== ToteTypeID) {
        this.containerError.nativeElement.textContent =
          'This container is not a tote!';
        this.containerError.nativeElement.classList.remove('hidden');
        this.containerInput.nativeElement.select();
        this.isLoading = false;
        return;
      }
      // check if the tote in QC done secton
      const isInventoryInContainer = await this.fetchInventoryInfo(
        containerInfo._id
      );
      if (isInventoryInContainer) {
        this.containerError.nativeElement.textContent =
          'This tote is not empty.';
        this.containerError.nativeElement.classList.remove('hidden');
        this.containerInput.nativeElement.select();
        this.isLoading = false;
        return;
      }

      this.containerError.nativeElement.classList.add('hidden');
      const Inventory: InventoryUpdate = {
        ContainerID: containerInfo._id,
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
      const InsertVariables: InsertRecordsAfterQcMutationVariables = {
        Inventory,
        Order,
      };
      this.insertRecordsToSQL(InsertVariables);
    } catch (error) {
      this.isLoading = false;
      this.messageType = 'error';
      this.message = error;
      this.containerInput.nativeElement.select();
    }
  }

  async fetchInventoryInfo(ContainerID: number): Promise<boolean> {
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

  async fetchContainerInfo(
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

  async insertRecordsToSQL(
    InsertVariables: InsertRecordsAfterQcMutationVariables
  ): Promise<void> {
    this.subscription.add(
      this.insertRecords
        .mutate(InsertVariables, { fetchPolicy: 'no-cache' })
        .subscribe(
          (res) => {
            let error: string;
            if (res.data.insertRecordsAfterQC.success) {
              this.router.navigate(['/qc'], {
                queryParams: {
                  type: 'success',
                  message: `${this.urlParams.ITN} finishs QC!`,
                },
              });
            } else {
              error = res.data.insertRecordsAfterQC.message;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
