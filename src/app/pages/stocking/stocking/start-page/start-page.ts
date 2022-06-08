import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  FetchItnInfoByContainerforStockingGQL,
  FindorCreateUserContainerForStockingGQL,
  VerifyItnForStockingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { ITNBarcodeRegex } from 'src/app/shared/dataRegex';
import { CommonService } from 'src/app/shared/services/common.service';
import { sqlData } from 'src/app/shared/sqlData';
import { environment } from 'src/environments/environment';
import { StockingService } from '../../stocking.server';

@Component({
  selector: 'start-page',
  templateUrl: './start-page.html',
})
export class StartPageComponent implements OnInit, AfterViewInit {
  stage = '';
  inputLabel = '';
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  verify$ = new Observable();
  init$ = new Observable();
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _commonService: CommonService,
    private _title: Title,
    private _verifyBarcode: FetchItnInfoByContainerforStockingGQL,
    private _verifyITN: VerifyItnForStockingGQL,
    private _userContainer: FindorCreateUserContainerForStockingGQL,
    private _insertLog: Insert_UserEventLogsGQL,
    private _service: StockingService
  ) {
    this._title.setTitle('Stock');
    this._commonService.changeNavbar('Stock');
  }

  @ViewChild('barcode') barcodeInput!: ElementRef;
  @ViewChild('countNumber') countNumberEle: ElementRef;
  inputForm = this._fb.group({
    barcode: ['', [Validators.required]],
    countNumber: [0],
  });

  ngOnInit(): void {
    this.alertType = this._route.snapshot.queryParams['type'];
    this.alertMessage = this._route.snapshot.queryParams['message'];
    this._service.changeITNListInContainer([]);
    this._service.changeScanedITNList([]);
    this._service.changeCurrentITN(null);
    this.stage = 'scanBarcode';
    this.inputLabel = 'Scan Location or ITN';
    // fetch user's container ID, and save it to service
    if (!this._service.userContainerID) {
      this.isLoading = true;
      this.init$ = this._userContainer
        .mutate({
          DistrubutionCenter: environment.DistributionCenter,
          Barcode: String(JSON.parse(sessionStorage.getItem('userInfo')).name),
          ContainerTypeID: sqlData.userType_ID,
        })
        .pipe(
          map((res) => {
            this.isLoading = false;
            this._service.changeUserContainerID(
              res.data.findOrCreateContainer._id
            );
          }),
          catchError((err) => {
            this.alertType = 'error';
            this.alertMessage = err.message;
            this.isLoading = false;
            this.barcodeInput.nativeElement.select();
            return of(err);
          })
        );
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.stage === 'scanBarcode') {
        this.barcodeInput.nativeElement.select();
      }
      if (this.stage === 'ITNCount') {
        this.countNumberEle.nativeElement.select();
      }
    }, 10);
  }

  back(): void {
    this._router.navigate(['/stocking']);
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.inputForm.get('barcode').valid || this.isLoading) {
      this.barcodeInput.nativeElement.select();
      return;
    }
    if (this.stage === 'scanBarcode') {
      this.scanBarcode();
      return;
    }
    if (this.stage === 'ITNCount') {
      this.ITNCount();
      return;
    }
  }

  scanBarcode(): void {
    if (ITNBarcodeRegex.test(this.inputForm.value.barcode.trim())) {
      this.verifyITN();
      return;
    }
    this.verifyBarcode();
  }

  verifyITN(): void {
    this.isLoading = true;
    this.verify$ = this._verifyITN
      .fetch({
        ITN: this.inputForm.value.barcode.trim(),
        DC: environment.DistributionCenter,
      })
      .pipe(
        tap((res) => {
          if (res.data.findInventory.length === 0) {
            this.alertType = 'error';
            this.alertMessage = 'ITN not found';
            this.isLoading = false;
            return;
          }
          if (!this._service.userContainerID) {
            this.alertType = 'error';
            this.alertMessage = 'Container not found';
            this.isLoading = false;
            return;
          }
        }),
        switchMap((res) => {
          const item = res.data.findInventory[0];
          const ITNInfo = {
            _id: item._id,
            ITN: this.inputForm.value.barcode.trim(),
            Quantity: item.QuantityOnHand,
            productID: item.Product._id,
          };
          this._service.changeITNListInContainer([ITNInfo]);
          this._service.changeCurrentITN(ITNInfo);
          return this._insertLog.mutate({
            log: {
              UserID: Number(
                JSON.parse(sessionStorage.getItem('userInfo'))._id
              ),
              UserEventID: sqlData.Event_Stocking_StockingITNSelect,
              OrderNumber: item.ORDERLINEDETAILs[0].Order.OrderNumber,
              NOSINumber: item.ORDERLINEDETAILs[0].Order.NOSINumber,
              OrderLineNumber:
                item.ORDERLINEDETAILs[0].OrderLine.OrderLineNumber,
              InventoryTrackingNumber: this.inputForm.value.barcode.trim(),
              Message: ``,
            },
          });
        }),
        map(() => {
          this._router.navigate(['/stocking/stocking/location']);
        }),
        catchError((err) => {
          this.alertType = 'error';
          this.alertMessage = err.message;
          this.isLoading = false;
          this.barcodeInput.nativeElement.select();
          return of(err);
        })
      );
  }

  verifyBarcode(): void {
    const barcodeInput = this.inputForm.value.barcode;
    const Barcode =
      barcodeInput.trim().length === 16
        ? barcodeInput.trim().replace(/-/g, '')
        : barcodeInput.trim();
    this.isLoading = true;
    this.verify$ = this._verifyBarcode
      .fetch({
        Barcode,
        DC: environment.DistributionCenter,
      })
      .pipe(
        tap((res) => {
          if (res.data.findContainer.length === 0) {
            throw new Error('Barcode not found');
          }
          if (!res.data.findContainer[0].ContainerType.IsMobile) {
            throw new Error(`${barcodeInput} is not a mobile container`);
          }
          if (res.data.findContainer[0].INVENTORies.length === 0) {
            throw new Error(`${barcodeInput} has no ITN`);
          }
        }),
        map((res) => {
          const ITNList = res.data.findContainer[0].INVENTORies.map((item) => {
            return {
              _id: item._id,
              ITN: item.InventoryTrackingNumber,
              Quantity: item.QuantityOnHand,
              productID: item.Product._id,
            };
          });
          this._service.changeITNListInContainer(ITNList);
          this.isLoading = false;
          this.stage = 'ITNCount';
          this.inputLabel = 'Enter ITN Count';
          this.countNumberEle.nativeElement.select();
        }),
        catchError((err) => {
          this.alertType = 'error';
          this.alertMessage = err.message;
          this.isLoading = false;
          this.barcodeInput.nativeElement.select();
          return of(err);
        })
      );
  }

  ITNCount(): void {
    if (this.inputForm.value.countNumber.trim() === '') {
      this.countNumberEle.nativeElement.select();
      return;
    }
    if (this._service.ITNListInContainer.length === 0) {
      this.alertType = 'error';
      this.alertMessage = 'No ITN in container';
      return;
    }
    if (
      this.inputForm.value.countNumber ===
      this._service.ITNListInContainer.length
    ) {
      this._router.navigate(['/stocking/stocking/verify']);
      return;
    } else {
      this._router.navigate(['/stocking/stocking/mismatch']);
      return;
    }
  }
}
