import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { CommonService } from '../../shared/services/common.service';

import { AggregationShelfBarcodeRegex } from '../../shared/utils/dataRegex';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { ShelfInventoryService } from './shelf-inventory.server';
import { FindItNsByShelfGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/utils/sqlData';

@Component({
  selector: 'shelf-inventory',
  templateUrl: './shelf-inventory.component.html',
})
export class ShelfInventoryComponent implements AfterViewInit, OnInit {
  title = 'Shelf Inventory';
  isLoading = false;
  alertMessage = '';
  alertType = 'error';
  search$ = new Observable();

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private titleService: Title,
    private searchITNList: FindItNsByShelfGQL,
    private shelfInventory: ShelfInventoryService
  ) {
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle(this.title);
  }

  ngOnInit(): void {
    this.shelfInventory.setITNList([]);
  }

  barcodeForm = this.fb.group({
    barcode: [
      '',
      [Validators.required, Validators.pattern(AggregationShelfBarcodeRegex)],
    ],
  });

  @ViewChild('barcode') barcode: ElementRef;
  ngAfterViewInit(): void {
    this.barcode.nativeElement.select();
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.barcodeForm.get('barcode').invalid) {
      this.barcode.nativeElement.select();
      return;
    }
    this.isLoading = true;
    const barcode = this.barcodeForm.get('barcode').value;
    const containerInfo = {
      DistributionCenter: environment.DistributionCenter,
      Warehouse: barcode.substring(0, 2),
      Row: barcode.substring(3, 5),
      Aisle: barcode.substring(6, 8),
      Section: barcode.substring(9, 11),
      Shelf: barcode.substring(12, 13),
      ShelfDetail: barcode.substring(14),
    };
    this.search$ = this.searchITNList
      .fetch({ Container: containerInfo }, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          if (res.data.findContainers.length === 0) {
            this.alertMessage = 'No Container found for this barcode';
            this.alertType = 'error';
            return;
          }
          const itnList = [];
          res.data.findContainers.forEach((container) => {
            container.INVENTORies.forEach((itn) => {
              if (
                itn.ORDERLINEDETAILs[0]?.StatusID &&
                itn.ORDERLINEDETAILs[0].StatusID === sqlData.agInComplete_ID
              )
                itnList.push(itn.InventoryTrackingNumber);
            });
          });
          if (itnList.length === 0) {
            this.alertMessage = 'No ITN found for this barcode';
            this.alertType = 'error';
            return;
          }
          this.shelfInventory.setITNList(itnList);
          this.isLoading = false;
          this.router.navigate(['/shelfinventory/scanitn/']);
        }),
        catchError((error) => {
          this.alertMessage = error.message;
          this.alertType = 'error';
          this.isLoading = false;
          return error;
        })
      );
  }
}
