import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  FetchVendorListGQL,
  FindReceiptsGQL,
  InsertReceiptGQL,
  FindPartCodesGQL,
} from 'src/app/graphql/receiving.graphql-gen';
import { SelectCartComponent } from '../../pull-to-pick/select-cart/select-cart.component';

interface Vendor {
  _id: number;
  Number: string;
  Name: string;
}

interface PartCode {
  _id: number;
  PRC: string;
}

interface Country {
  _id: number;
  CountryCode: string;
  CountryName: string;
  ISO2: string;
  ISO3: string;
}

@Component({
  selector: 'receipt-entry',
  templateUrl: './receipt-entry.component.html',
  styleUrls: ['./receipt-entry.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class ReceiptEntry implements OnInit {
  public vendorsLoaded: Promise<boolean>;
  receiptList: Array<{ value: string; text: string }> = [];
  vendorList: { label: string; value: string }[];
  receiptID;
  vendorID;
  expectedArrivalDate;
  vendorSearchClass;
  sourceType;
  sourceTypeOptions: Array<{ label: string; value: string }> = [
    { label: 'Manually entered', value: 'manual' },
    { label: 'ASN from vendor', value: 'ASN' },
    { label: 'Generated from packing list scan', value: 'scan' },
  ];
  receiptSelected: boolean;
  partNumber;
  partNumberID;
  quantity;
  dateCode;
  coo;
  rohs;
  rohsOptions: Array<{ label: string; value: string }> = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];
  partCodes: PartCode[];
  nzFilterOption = (): boolean => true;
  private vendorListSubscription = new Subscription();
  private receiptListSubscription = new Subscription();
  private insertReceiptSubscription = new Subscription();
  private partCodeListSubscription = new Subscription();

  constructor(
    private _fetchVendorList: FetchVendorListGQL,
    private _findReceiptList: FindReceiptsGQL,
    private _insertReceipt: InsertReceiptGQL,
    private _findPartCodes: FindPartCodesGQL
  ) {}

  ngOnInit(): void {
    this.getVendors();
  }

  onClick(e: Event) {
    this.partCodes = null;
  }

  getVendors(): void {
    this.vendorList = [];

    this.vendorListSubscription.add(
      this._fetchVendorList
        .fetch({}, { fetchPolicy: 'network-only' })
        .subscribe({
          next: (res) => {
            res.data.fetchVendorList.map((vendor) => {
              this.vendorList.push({
                label: vendor.VendorNumber,
                value: vendor._id.toString(),
              });
            });
          },
        })
    );
  }

  searchReceipts(value: string): void {
    if (value) {
      const receipts: Array<{ text: string; value: string }> = [];

      this.receiptListSubscription.add(
        this._findReceiptList
          .fetch(
            {
              receiptID: value,
            },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              res.data.findReceipts.map((receipt) => {
                receipts.push({
                  text: receipt._id.toString(),
                  value: receipt._id.toString(),
                });
              });
            },
            complete: () => {
              this.receiptList = receipts;
            },
          })
      );
    } else {
      this.receiptList = [];
    }
  }

  insertReceipt(): void {
    if (this.vendorID) {
      this.vendorSearchClass = 'valid';
      this.insertReceiptSubscription.add(
        this._insertReceipt
          .mutate({
            receipt: {
              VendorID: Number(this.vendorID),
              ExpectedArrivalDate: this.expectedArrivalDate,
              SourceType: this.sourceType,
            },
          })
          .subscribe({
            next: (res) => {
              this.receiptID = res.data.insertReceipt._id;
              this.receiptSelected = true;
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              this.receiptList = [
                { value: this.receiptID, text: this.receiptID },
              ];
            },
          })
      );
    } else {
      this.vendorSearchClass = 'invalid';
    }
  }

  onPartNumberChange(e): void {
    this.searhPartCodes();
  }

  searhPartCodes(): void {
    if (this.partNumber) {
      const partCodes: PartCode[] = [];
      this.partCodeListSubscription.add(
        this._findPartCodes
          .fetch(
            {
              searchString: this.partNumber,
            },
            {
              fetchPolicy: 'network-only',
            }
          )
          .subscribe({
            next: (res) => {
              res.data.findPartCodes.map((partCode) => {
                partCodes.push({
                  _id: partCode._id,
                  PRC: partCode.PRC,
                });
              });
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              this.partCodes = partCodes;
            },
          })
      );
    } else {
      this.partCodes = null;
    }
  }

  onPartNumberClick(PRC: string, ID: number): void {
    this.partNumber = PRC;
    this.partNumberID = ID;
    this.partCodes = null;
  }

  onReceiptIDChange(e: Event): void {
    if (e) {
      this.receiptSelected = true;
    } else {
      this.receiptSelected = false;
    }
  }

  ngOnDestroy(): void {
    this.vendorListSubscription.unsubscribe();
    this.receiptListSubscription.unsubscribe();
    this.insertReceiptSubscription.unsubscribe();
    this.partCodeListSubscription.unsubscribe();
  }

  test(e: Event): void {
    this.searhPartCodes();
  }
}
