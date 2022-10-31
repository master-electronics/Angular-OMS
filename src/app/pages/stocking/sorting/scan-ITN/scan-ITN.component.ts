import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { VerifyItnForSortingGQL } from 'src/app/graphql/stocking.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { ITNBarcodeRegex } from 'src/app/shared/dataRegex';
import { CommonService } from 'src/app/shared/services/common.service';
import { sqlData } from 'src/app/shared/sqlData';
import { environment } from 'src/environments/environment';
import { StockingService } from '../../stocking.server';

@Component({
  selector: 'scan-ITN',
  templateUrl: './scan-ITN.component.html',
})
export class ScanITNComponent implements OnInit {
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  verify$ = new Observable();
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _commonService: CommonService,
    private _title: Title,
    private _vierfyITN: VerifyItnForSortingGQL,
    private _insertLog: Insert_UserEventLogsGQL,
    private _service: StockingService
  ) {
    this._title.setTitle('Sorting');
    this._commonService.changeNavbar('Sorting');
  }

  @ViewChild('ITN') ITNInput!: ElementRef;
  ITNForm = this._fb.group({
    ITN: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this._service.changeSortingInfo(null);
    this.alertType = this._route.snapshot.queryParams['type'];
    this.alertMessage = this._route.snapshot.queryParams['message'];
  }

  ngAfterViewInit(): void {
    this.ITNInput.nativeElement.select();
  }

  back(): void {
    this._router.navigate(['/stocking']);
  }

  reprint(): void {
    //
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.ITNForm.invalid || this.isLoading) {
      this.ITNInput.nativeElement.select();
      return;
    }
    this.isLoading = true;
    this.verify$ = this._vierfyITN
      .fetch(
        { ITN: this.ITNForm.value.ITN, DC: environment.DistributionCenter },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findInventory._id) {
            throw 'ITN not found';
          }
          if (!res.data.findInventory.Container.ContainerType.IsMobile) {
            throw new Error('Must be in a mobile container');
          }
        }),
        switchMap((res) => {
          const inventory = res.data.findInventory;
          this._service.changeSortingInfo({
            ITN: this.ITNForm.value.ITN,
            productID: inventory.Product._id,
            InventoryID: inventory._id,
            productCode: inventory.Product.ProductCode.ProductCodeNumber,
            partNumber: inventory.Product.PartNumber,
            QuantityOnHand: inventory.QuantityOnHand ?? null,
            remaining: null,
            productType: null,
            velocity: inventory.Product.DCPRODUCTs[0]?.Velocity ?? null,
            zone: null,
            suggetionLocationList: [],
            OrderNumber: inventory.ORDERLINEDETAILs[0].Order.OrderNumber,
            NOSINumber: inventory.ORDERLINEDETAILs[0].Order.NOSINumber,
            OrderLineNumber:
              inventory.ORDERLINEDETAILs[0].OrderLine.OrderLineNumber,
          });
          return this._insertLog.mutate({
            log: {
              UserName: JSON.parse(sessionStorage.getItem('userInfo')).Name,
              UserEventID: sqlData.Event_Stocking_SortingStart,
              OrderNumber: inventory.ORDERLINEDETAILs[0].Order.OrderNumber,
              NOSINumber: inventory.ORDERLINEDETAILs[0].Order.NOSINumber,
              OrderLineNumber:
                inventory.ORDERLINEDETAILs[0].OrderLine.OrderLineNumber,
              InventoryTrackingNumber: this.ITNForm.value.ITN,
              Message: ``,
            },
          });
        }),
        map(() => {
          this.isLoading = false;
          this._router.navigate(['/stocking/sorting/location']);
        }),
        catchError((error) => {
          this.isLoading = false;
          this.alertMessage = error;
          this.alertType = 'error';
          this.ITNInput.nativeElement.select();
          return of(null);
        })
      );
  }
}
