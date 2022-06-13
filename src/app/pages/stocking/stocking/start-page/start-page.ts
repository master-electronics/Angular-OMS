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
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  FetchItnInfoByContainerforStockingGQL,
  FindorCreateUserContainerForStockingGQL,
  MoveInventoryToContainerForStockingGQL,
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
  log$ = new Observable();
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
    private _move: MoveInventoryToContainerForStockingGQL,
    private _service: StockingService
  ) {
    this._title.setTitle('Stock');
    this._commonService.changeNavbar('Stock');
  }

  @ViewChild('barcode') barcodeInput!: ElementRef;
  @ViewChild('countNumber') countNumberEle: ElementRef;
  inputForm = this._fb.group({
    barcode: ['', [Validators.required]],
    countNumber: ['', [Validators.required]],
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
          Barcode: String(JSON.parse(sessionStorage.getItem('userInfo')).Name),
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
    if (ITNBarcodeRegex.test(this.inputForm.value.barcode.trim())) {
      this.verifyITN();
      return;
    }
    this.verifyBarcode();
  }

  verifyITN(): void {
    this.isLoading = true;
    this.verify$ = this._verifyITN
      .fetch(
        {
          ITN: this.inputForm.value.barcode.trim(),
          DC: environment.DistributionCenter,
        },
        { fetchPolicy: 'network-only' }
      )
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
          const log = this._insertLog.mutate({
            log: {
              UserID: Number(
                JSON.parse(sessionStorage.getItem('userInfo'))._id
              ),
              UserEventID: sqlData.Event_Stocking_ScanITN,
              OrderNumber: item.ORDERLINEDETAILs[0]?.Order.OrderNumber,
              NOSINumber: item.ORDERLINEDETAILs[0]?.Order.NOSINumber,
              OrderLineNumber:
                item.ORDERLINEDETAILs[0]?.OrderLine.OrderLineNumber,
              InventoryTrackingNumber: this.inputForm.value.barcode.trim(),
              Message: ``,
            },
          });
          const moveToUser = this._move.mutate({
            ContainerID: this._service.userContainerID,
            ITN: this.inputForm.value.barcode.trim(),
            DC: environment.DistributionCenter,
          });
          return forkJoin({ log, moveToUser });
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
      .fetch(
        {
          Barcode,
          DC: environment.DistributionCenter,
        },
        { fetchPolicy: 'network-only' }
      )
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
        switchMap((res) => {
          const log = [];
          const ITNList = res.data.findContainer[0].INVENTORies.map((item) => {
            log.push({
              UserID: Number(
                JSON.parse(sessionStorage.getItem('userInfo'))._id
              ),
              UserEventID: sqlData.Event_Stocking_ScanLocation,
              InventoryTrackingNumber: item.InventoryTrackingNumber,
              Message: ``,
            });
            return {
              _id: item._id,
              ITN: item.InventoryTrackingNumber,
              Quantity: item.QuantityOnHand,
              productID: item.Product._id,
            };
          });
          this._service.changeITNListInContainer(ITNList);
          this.stage = 'ITNCount';
          this.inputLabel = 'Enter ITN Count';
          return this._insertLog.mutate({
            log,
          });
        }),
        map(() => {
          this.isLoading = false;
          setTimeout(() => {
            this.countNumberEle.nativeElement.select();
          }, 10);
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
    if (!this.inputForm.value.countNumber) {
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
      const log = this._service.ITNListInContainer.map((item) => {
        return {
          UserID: Number(JSON.parse(sessionStorage.getItem('userInfo'))._id),
          UserEventID: sqlData.Event_Stocking_StockingMismatch_Start,
          InventoryTrackingNumber: item.ITN,
          Message: ``,
        };
      });
      this.isLoading = true;
      this.log$ = this._insertLog
        .mutate({
          log,
        })
        .pipe(
          map(() => {
            this.isLoading = false;
            this._router.navigate(['/stocking/stocking/mismatch']);
          }),
          catchError((err) => {
            this.alertType = 'error';
            this.alertMessage = err.message;
            this.isLoading = false;
            this.barcodeInput.nativeElement.select();
            return of(err);
          })
        );
      return;
    }
  }
}
