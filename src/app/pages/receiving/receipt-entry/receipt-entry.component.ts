import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { Subscription } from 'rxjs';
import {
  FetchVendorListGQL,
  FindReceiptGQL,
  FindReceiptsGQL,
  InsertReceiptGQL,
  FindPartCodesGQL,
  FetchCountryListGQL,
  InsertReceiptLineGQL,
  FetchReceiptLinesGQL,
  FindPoLinesGQL,
  FindCountryGQL,
  FindPartGQL,
  FindPoLineGQL,
  InsertReceiptLineDetailGQL,
  FindReceiptLineGQL,
  DeleteReceiptLineGQL,
  DeleteReceiptLineDetailsGQL,
  UpdateReceiptLineGQL,
  UpdateReceiptLineDetailGQL,
  DeleteReceiptLineDetailGQL,
} from 'src/app/graphql/receiving.graphql-gen';
import { ReceiptLineDetail } from 'src/app/graphql/route.graphql-gen';
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

interface ReceiptLine {
  _id: number;
  ReceiptHID: number;
  ProductID: number;
  PartNumber: string;
  ExpectedQuantity: number;
  DateCode: string;
  CountryID: number;
  ISO3: string;
  ROHS: boolean;
  LineNumber: number;
  ReceiptLineDetails: {
    _id: number;
    ReceiptLID: number;
    ExpectedQuantity: number;
    PurchaseOrderLID: number;
    PurchaseOrderNumberLine: string;
  }[];
  Expanded: boolean;
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
  receiptLineDetailMessage: string;
  receiptLineDetailAlertType = 'success';
  receiptList: Array<{ value: string; text: string }> = [];
  partList: Array<{ value: string; text: string }> = [];
  poLineList: Array<{ value: string; text: string }> = [];
  vendorList: { label: string; value: string }[];
  countryList: { label: string; value: string }[];
  receiptID;
  receiptNumber;
  vendorID;
  expectedArrivalDate;
  vendorSearchClass;
  partNumberClass;
  quantityClass;
  dateCodeClass;
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
  ISO3;
  rohs;
  rohsOptions: Array<{ label: string; value: string }> = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];
  partCodes: PartCode[];
  receiptLineID;
  receiptLines: ReceiptLine[];
  nzFilterOption = (): boolean => true;
  receiptLineDetailVisible: boolean;
  poNumber;
  poLineID;
  receiptLineDetailQuantity;
  receiptLineDetailCancelDisabled = true;
  receiptLineDetailOKDisabled = true;
  receiptLineDetailClosable = false;
  receiptLineDetailOkText;
  receiptLineDetailID;
  lineDetailTitle;
  lineDetailTotal: number;
  lineDetails: Array<{
    Quantity: number;
    PurchaseOrderLID: number;
    PurchaseOrderNumberLine: string;
  }> = [];

  private vendorListSubscription = new Subscription();
  private receiptSubscription = new Subscription();
  private receiptListSubscription = new Subscription();
  private insertReceiptSubscription = new Subscription();
  private partCodeListSubscription = new Subscription();
  private countryListSubscription = new Subscription();
  private insertReceiptLineSubscription = new Subscription();
  private receiptLinesListSubscription = new Subscription();
  private findPOLinesSubscription = new Subscription();
  private findCountrySubscription = new Subscription();
  private findPartSubscription = new Subscription();
  private findPOLineSubscripton = new Subscription();
  private insertReceiptLineDetailSubscription = new Subscription();
  private findReceiptLineSubscription = new Subscription();
  private deleteReceiptLineSubscription = new Subscription();
  private deleteReceiptLineDetailsSubscription = new Subscription();
  private updateReceiptLineSubscription = new Subscription();
  private updateReceiptLineDetailSubscription = new Subscription();
  private deleteReceiptLineDetailSubscription = new Subscription();

  constructor(
    private _fetchVendorList: FetchVendorListGQL,
    private _findReceipt: FindReceiptGQL,
    private _findReceiptList: FindReceiptsGQL,
    private _insertReceipt: InsertReceiptGQL,
    private _findPartCodes: FindPartCodesGQL,
    private _fetchCountryList: FetchCountryListGQL,
    private _insertReceiptLine: InsertReceiptLineGQL,
    private _fetchReceiptLines: FetchReceiptLinesGQL,
    private _findPOLines: FindPoLinesGQL,
    private _findCountry: FindCountryGQL,
    private _findPart: FindPartGQL,
    private _findPOLine: FindPoLineGQL,
    private _insertReceiptLineDetail: InsertReceiptLineDetailGQL,
    private _findReceiptLine: FindReceiptLineGQL,
    private _deleteReceiptLine: DeleteReceiptLineGQL,
    private _deleteReceiptLineDetails: DeleteReceiptLineDetailsGQL,
    private _updateReceiptLine: UpdateReceiptLineGQL,
    private _updateReceiptLineDetail: UpdateReceiptLineDetailGQL,
    private _deleteReceiptLineDetail: DeleteReceiptLineDetailGQL
  ) {}

  ngOnInit(): void {
    this.lineDetailTotal = 0;
    this.lineDetailTitle = 'Title';
    this.getVendors();
    this.getCountries();
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

  getCountries(): void {
    this.countryList = [];

    this.countryListSubscription.add(
      this._fetchCountryList
        .fetch({}, { fetchPolicy: 'network-only' })
        .subscribe({
          next: (res) => {
            res.data.fetchCountryList.map((country) => {
              this.countryList.push({
                label: country.ISO3,
                value: country._id.toString(),
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
              receiptID: value.toUpperCase(),
            },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              res.data.findReceipts.map((receipt) => {
                receipts.push({
                  text: receipt.ReceiptNumber,
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

  searchPartNumbers(value: string): void {
    if (value) {
      const parts: Array<{ text: string; value: string }> = [];

      this.partCodeListSubscription.add(
        this._findPartCodes
          .fetch({ searchString: value }, { fetchPolicy: 'network-only' })
          .subscribe({
            next: (res) => {
              res.data.findPartCodes.map((part) => {
                parts.push({
                  text: part.PRC,
                  value: part._id.toString(),
                });
              });
            },
            complete: () => {
              this.partList = parts;
            },
          })
      );
    } else {
      this.partList = [];
    }
  }

  searchPOLines(value: string): void {
    if (value) {
      const poLines: Array<{ text: string; value: string }> = [];

      this.findPOLinesSubscription.add(
        this._findPOLines
          .fetch(
            { searchString: value.toLowerCase() },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              res.data.findPOLines.map((poline) => {
                poLines.push({
                  text: poline.PurchaseOrderNumberLine,
                  value: poline._id.toString(),
                });
              });
            },
            complete: () => {
              this.poLineList = poLines;
            },
          })
      );
    } else {
      this.poLineList = [];
    }
  }

  getReceiptLines(): void {
    const receiptLines: ReceiptLine[] = [];

    this.receiptLinesListSubscription.add(
      this._fetchReceiptLines
        .fetch(
          { receiptHID: Number(this.receiptID) },
          { fetchPolicy: 'network-only' }
        )
        .subscribe({
          next: (res) => {
            res.data.fetchReceiptLines.map((receiptLine) => {
              const lineDetails: {
                _id: number;
                ReceiptLID: number;
                ExpectedQuantity: number;
                PurchaseOrderLID: number;
                PurchaseOrderNumberLine: string;
              }[] = [];

              receiptLine.RECEIPTLDs.map((lineDetail) => {
                lineDetails.push({
                  _id: lineDetail._id,
                  ReceiptLID: lineDetail.ReceiptLID,
                  ExpectedQuantity: lineDetail.ExpectedQuantity,
                  PurchaseOrderLID: lineDetail.PurchaseOrderLID,
                  PurchaseOrderNumberLine: '',
                });
              });

              receiptLines.push({
                _id: receiptLine._id,
                ReceiptHID: receiptLine.ReceiptHID,
                ProductID: receiptLine.ProductID,
                PartNumber: '',
                ExpectedQuantity: receiptLine.ExpectedQuantity,
                DateCode: receiptLine.DateCode,
                CountryID: receiptLine.CountryID,
                ISO3: '',
                ROHS: receiptLine.ROHS,
                LineNumber: receiptLine.LineNumber,
                ReceiptLineDetails: lineDetails,
                Expanded: false,
              });
            });
          },
          complete: () => {
            receiptLines.map((receiptLine) => {
              let ISO3 = '';
              this.findCountrySubscription.add(
                this._findCountry
                  .fetch(
                    { countryID: receiptLine.CountryID },
                    { fetchPolicy: 'network-only' }
                  )
                  .subscribe({
                    next: (res) => {
                      ISO3 = res.data.findCountry
                        ? res.data.findCountry.ISO3
                        : '';
                    },
                    complete: () => {
                      receiptLine.ISO3 = ISO3;
                    },
                  })
              );

              let partNumber = '';
              this.findPartSubscription.add(
                this._findPart
                  .fetch(
                    { productID: receiptLine.ProductID },
                    { fetchPolicy: 'network-only' }
                  )
                  .subscribe({
                    next: (res) => {
                      partNumber = res.data.findPart.PartNumber;
                    },
                    complete: () => {
                      receiptLine.PartNumber = partNumber;
                    },
                  })
              );

              receiptLine.ReceiptLineDetails.map((lineDetail) => {
                let purchaseOrderNumberLine = '';
                this.findPOLineSubscripton.add(
                  this._findPOLine
                    .fetch(
                      { purchaseOrderLID: lineDetail.PurchaseOrderLID },
                      { fetchPolicy: 'network-only' }
                    )
                    .subscribe({
                      next: (res) => {
                        purchaseOrderNumberLine =
                          res.data.findPOLine[0].PurchaseOrderNumberLine;
                      },
                      complete: () => {
                        lineDetail.PurchaseOrderNumberLine =
                          purchaseOrderNumberLine;
                      },
                    })
                );
              });
            });

            this.receiptLines = receiptLines;
          },
        })
    );
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
              this.receiptID = res.data.insertReceipt._id.toString();
              this.receiptSelected = true;
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              this.findReceipt();
            },
          })
      );
    } else {
      this.vendorSearchClass = 'invalid';
    }
  }

  findReceipt(): void {
    if (this.receiptID) {
      this.receiptSubscription.add(
        this._findReceipt
          .fetch(
            { receiptID: Number(this.receiptID) },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              this.receiptNumber = res.data.findReceipt.ReceiptNumber;
            },
            complete: () => {
              this.receiptList = [
                {
                  value: this.receiptID.toString(),
                  text: this.receiptNumber,
                },
              ];
            },
          })
      );
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

  onPartNumberClick(partNumberID: Event): void {
    if (partNumberID) {
      this.findPartSubscription.add(
        this._findPart
          .fetch(
            { productID: Number(partNumberID) },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              this.partNumber = res.data.findPart.PartNumber;
            },
          })
      );
    }
  }

  onCountryChange(countryID: Event): void {
    if (countryID) {
      this.findCountrySubscription.add(
        this._findCountry
          .fetch(
            { countryID: Number(countryID) },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              this.ISO3 = res.data.findCountry.ISO3;
            },
          })
      );
    }
  }

  onReceiptIDChange(e: Event): void {
    if (e) {
      this.receiptSelected = true;
      this.getReceiptLines();
    } else {
      this.receiptSelected = false;
      this.receiptLines = null;
    }
  }

  selectReceiptLine(ReceiptLineID): void {
    if (ReceiptLineID) {
      this.findReceiptLineSubscription.add(
        this._findReceiptLine
          .fetch(
            { receiptLineId: Number(ReceiptLineID) },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              this.receiptLineID = res.data.findReceiptLine._id;
              this.partNumberID = res.data.findReceiptLine.ProductID.toString();
              this.quantity = res.data.findReceiptLine.ExpectedQuantity;
              this.dateCode = res.data.findReceiptLine.DateCode;
              this.coo = res.data.findReceiptLine.CountryID
                ? res.data.findReceiptLine.CountryID.toString()
                : '';
              this.rohs = res.data.findReceiptLine.ROHS.toString();
            },
            complete: () => {
              this.findPartSubscription.add(
                this._findPart
                  .fetch(
                    { productID: Number(this.partNumberID) },
                    { fetchPolicy: 'network-only' }
                  )
                  .subscribe({
                    next: (res) => {
                      this.partNumber = res.data.findPart.PartNumber.trim();
                    },
                    complete: () => {
                      this.partList = [
                        {
                          value: this.partNumberID.toString(),
                          text: this.partNumber,
                        },
                      ];
                    },
                  })
              );

              this.findCountrySubscription.add(
                this._findCountry
                  .fetch(
                    { countryID: Number(this.coo) },
                    { fetchPolicy: 'network-only' }
                  )
                  .subscribe({
                    next: (res) => {
                      this.ISO3 = res.data.findCountry
                        ? res.data.findCountry.ISO3
                        : '';
                    },
                  })
              );
            },
          })
      );
    }
  }

  deleteReceiptLine(): void {
    if (this.receiptLineID) {
      this.deleteReceiptLineDetailsSubscription.add(
        this._deleteReceiptLineDetails
          .mutate({ receiptLineID: Number(this.receiptLineID) })
          .subscribe({
            complete: () => {
              this.deleteReceiptLineSubscription.add(
                this._deleteReceiptLine
                  .mutate({ receiptLineID: Number(this.receiptLineID) })
                  .subscribe({
                    complete: () => {
                      const index = this.receiptLines.findIndex(
                        (item) => item._id === this.receiptLineID
                      );

                      if (index) {
                        this.receiptLines.splice(index, 1);

                        const receiptLines: ReceiptLine[] = [];

                        this.receiptLines.map((receiptLine) => {
                          receiptLines.push(receiptLine);
                        });

                        this.receiptLines = receiptLines;
                        this.receiptLineID = null;
                        this.partNumber = null;
                        this.partNumberID = null;
                        this.partList = [];
                        this.quantity = null;
                        this.dateCode = null;
                        this.coo = null;
                        this.rohs = null;
                      }
                    },
                  })
              );
            },
          })
      );
    }
  }

  saveReceiptLine(): void {
    if (this.receiptID) {
      this.partNumberClass = 'valid';
      this.quantityClass = 'inputValid';
      this.dateCodeClass = 'inputValid';

      let valid = true;

      if (!this.receiptID) {
        valid = false;
      }

      if (!this.partNumberID) {
        valid = false;
        this.partNumberClass = 'invalid';
      }

      if (!this.quantity) {
        valid = false;
        this.quantityClass = 'invalid';
      }

      if (!this.dateCode) {
        valid = false;
        this.dateCodeClass = 'invalid';
      }

      if (valid) {
        this.updateReceiptLineSubscription.add(
          this._updateReceiptLine
            .mutate({
              receiptLID: Number(this.receiptLineID),
              productID: Number(this.partNumberID),
              expectedQuantity: Number(this.quantity),
              dateCode: this.dateCode,
              countryID: Number(this.coo),
              rohs: Boolean(this.rohs),
            })
            .subscribe({
              complete: () => {
                const receiptLine = this.receiptLines.find(
                  (item) => item._id == this.receiptLineID
                );

                if (receiptLine) {
                  receiptLine.ProductID = Number(this.partNumberID);
                  receiptLine.PartNumber = this.partNumber;
                  receiptLine.ExpectedQuantity = Number(this.quantity);
                  receiptLine.DateCode = this.dateCode;
                  receiptLine.CountryID = Number(this.coo);
                  receiptLine.ISO3 = this.ISO3;
                  receiptLine.ROHS = this.rohs;
                }
              },
            })
        );
      }
    }
  }

  clearReceiptLine(): void {
    this.receiptLineID = null;
    this.partNumber = null;
    this.partNumberID = null;
    this.partList = [];
    this.quantity = null;
    this.dateCode = null;
    this.coo = null;
    this.rohs = null;
  }

  addReceiptLineDetail(): void {
    this.receiptLineDetailClosable = true;
    this.showReceiptLineDetail('Add');
  }

  addReceiptLine(): void {
    this.partNumberClass = 'valid';
    this.quantityClass = 'inputValid';
    this.dateCodeClass = 'inputValid';

    let valid = true;

    if (!this.receiptID) {
      valid = false;
    }

    if (!this.partNumberID) {
      valid = false;
      this.partNumberClass = 'invalid';
    }

    if (!this.quantity) {
      valid = false;
      this.quantityClass = 'invalid';
    }

    if (!this.dateCode) {
      valid = false;
      this.dateCodeClass = 'invalid';
    }

    if (valid) {
      let newLineNumber;
      this.insertReceiptLineSubscription.add(
        this._insertReceiptLine
          .mutate({
            receiptHID: Number(this.receiptID),
            productID: Number(this.partNumberID),
            expectedQuantity: Number(this.quantity),
            dateCode: this.dateCode,
            countryID: Number(this.coo),
            rohs: Boolean(this.rohs),
          })
          .subscribe({
            next: (res) => {
              this.receiptLineID = res.data.insertReceiptLine[0]._id;
              newLineNumber = res.data.insertReceiptLine[0].LineNumber;
            },
            complete: () => {
              this.showReceiptLineDetail('Add');

              const newReceiptLine: ReceiptLine = {
                _id: Number(this.receiptLineID),
                ReceiptHID: Number(this.receiptID),
                ProductID: Number(this.partNumberID),
                PartNumber: this.partNumber,
                ExpectedQuantity: Number(this.quantity),
                DateCode: this.dateCode,
                CountryID: Number(this.coo),
                ISO3: this.ISO3,
                ROHS: this.rohs,
                LineNumber: newLineNumber,
                ReceiptLineDetails: null,
                Expanded: false,
              };

              const receiptLines: ReceiptLine[] = [];

              this.receiptLines.map((receiptLine) => {
                receiptLines.push(receiptLine);
              });

              receiptLines.push(newReceiptLine);
              this.receiptLines = receiptLines;
            },
          })
      );
    }
  }

  showReceiptLineDetail(okText: string): void {
    this.receiptLineDetailOkText = okText;
    this.receiptLineDetailVisible = true;
  }

  hideReceiptLineDetail(): void {
    this.receiptLineDetailVisible = false;
  }

  onReceiptLineDetailOKClick(): void {
    if (this.receiptLineDetailOkText == 'Save') {
      if (
        this.receiptLineDetailID &&
        this.poLineID &&
        this.receiptLineDetailQuantity
      ) {
        this.updateReceiptLineDetailSubscription.add(
          this._updateReceiptLineDetail
            .mutate({
              receiptLDID: Number(this.receiptLineDetailID),
              expectedQuantity: Number(this.receiptLineDetailQuantity),
              purchaseOrderLID: Number(this.poLineID),
            })
            .subscribe({
              error: (error) => {
                this.receiptLineDetailAlertType = 'error';
                this.receiptLineDetailMessage = error;
              },
              complete: () => {
                this.receiptLineDetailAlertType = 'success';
                this.receiptLineDetailMessage = 'Receipt line detail saved.';
              },
            })
        );
      }
    } else if (this.receiptLineDetailOkText == 'Add') {
      if (
        this.receiptLineID &&
        this.poLineID &&
        this.receiptLineDetailQuantity
      ) {
        let newReceiptLineDetail: {
          _id: number;
          ReceiptLID: number;
          ExpectedQuantity: number;
          PurchaseOrderLID: number;
          PurchaseOrderNumberLine: string;
        };

        this.insertReceiptLineDetailSubscription.add(
          this._insertReceiptLineDetail
            .mutate({
              receiptLineDetail: {
                ReceiptLID: Number(this.receiptLineID),
                ExpectedQuantity: Number(this.receiptLineDetailQuantity),
                PurchaseOrderLID: Number(this.poLineID),
              },
            })
            .subscribe({
              next: (res) => {
                newReceiptLineDetail = {
                  _id: res.data.insertReceiptLineDetail._id,
                  ReceiptLID: res.data.insertReceiptLineDetail.ReceiptLID,
                  ExpectedQuantity:
                    res.data.insertReceiptLineDetail.ExpectedQuantity,
                  PurchaseOrderLID:
                    res.data.insertReceiptLineDetail.PurchaseOrderLID,
                  PurchaseOrderNumberLine: '',
                };
              },
              error: (error) => {
                this.receiptLineDetailAlertType = 'error';
                this.receiptLineDetailMessage = error;
              },
              complete: () => {
                let purchaseOrderNumberLine = '';
                this.findPOLineSubscripton.add(
                  this._findPOLine
                    .fetch(
                      {
                        purchaseOrderLID: newReceiptLineDetail.PurchaseOrderLID,
                      },
                      { fetchPolicy: 'network-only' }
                    )
                    .subscribe({
                      next: (res) => {
                        purchaseOrderNumberLine =
                          res.data.findPOLine[0].PurchaseOrderNumberLine;
                      },
                      complete: () => {
                        newReceiptLineDetail.PurchaseOrderNumberLine =
                          purchaseOrderNumberLine;

                        this.receiptLineDetailClosable = true;
                        this.receiptLineDetailAlertType = 'success';
                        this.receiptLineDetailMessage =
                          'Receipt line detail added.';
                        this.poLineList = null;
                        this.poLineID = null;
                        this.receiptLineDetailQuantity = null;

                        const receiptLineDetails: {
                          _id: number;
                          ReceiptLID: number;
                          ExpectedQuantity: number;
                          PurchaseOrderLID: number;
                          PurchaseOrderNumberLine: string;
                        }[] = [];

                        const receiptLine = this.receiptLines.find(
                          (item) => item._id == this.receiptLineID
                        );

                        if (receiptLine) {
                          receiptLine.ReceiptLineDetails.map(
                            (receiptLineDetail) => {
                              receiptLineDetails.push(receiptLineDetail);
                            }
                          );

                          receiptLineDetails.push({
                            _id: newReceiptLineDetail._id,
                            ReceiptLID: newReceiptLineDetail.ReceiptLID,
                            ExpectedQuantity:
                              newReceiptLineDetail.ExpectedQuantity,
                            PurchaseOrderLID:
                              newReceiptLineDetail.PurchaseOrderLID,
                            PurchaseOrderNumberLine:
                              newReceiptLineDetail.PurchaseOrderNumberLine,
                          });

                          receiptLine.ReceiptLineDetails = receiptLineDetails;
                        }
                      },
                    })
                );
              },
            })
        );
      }
    }
  }

  resetReceiptLineDetailMessage() {
    this.receiptLineDetailMessage = null;
  }

  selectReceiptLineDetail(
    receiptLineDetailID,
    poLineID,
    poNumberLine,
    receiptLineDetailQuantity
  ): void {
    this.receiptLineDetailID = receiptLineDetailID;
    this.poLineID = poLineID.toString();
    this.poLineList = [
      { text: poNumberLine.toString(), value: poLineID.toString() },
    ];
    this.receiptLineDetailQuantity = receiptLineDetailQuantity;
    this.receiptLineDetailClosable = true;
    this.showReceiptLineDetail('Save');
  }

  deleteReceiptLineDetail(receiptLineDetailID, receiptLineID): void {
    if (receiptLineDetailID) {
      this.deleteReceiptLineDetailSubscription.add(
        this._deleteReceiptLineDetail
          .mutate({
            receiptLDID: Number(receiptLineDetailID),
          })
          .subscribe({
            complete: () => {
              //
            },
          })
      );
    }
  }

  addDetailLine(): void {
    if (this.poLineID) {
      let purchaseOrderNumberLine = '';
      this.findPOLineSubscripton.add(
        this._findPOLine
          .fetch(
            { purchaseOrderLID: Number(this.poLineID) },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              purchaseOrderNumberLine =
                res.data.findPOLine[0].PurchaseOrderNumberLine;
            },
            complete: () => {
              this.lineDetails.push({
                Quantity: Number(this.receiptLineDetailQuantity),
                PurchaseOrderLID: Number(this.poLineID),
                PurchaseOrderNumberLine: purchaseOrderNumberLine,
              });

              this.lineDetailTotal += Number(this.receiptLineDetailQuantity);
            },
          })
      );
    }
  }

  removeDetailLine(index: number): void {
    //
  }

  ngOnDestroy(): void {
    this.vendorListSubscription.unsubscribe();
    this.countryListSubscription.unsubscribe();
    this.receiptSubscription.unsubscribe();
    this.receiptListSubscription.unsubscribe();
    this.insertReceiptSubscription.unsubscribe();
    this.partCodeListSubscription.unsubscribe();
    this.insertReceiptLineSubscription.unsubscribe();
    this.receiptLinesListSubscription.unsubscribe();
    this.findPOLinesSubscription.unsubscribe();
    this.findCountrySubscription.unsubscribe();
    this.findPartSubscription.unsubscribe();
    this.findPOLineSubscripton.unsubscribe();
    this.insertReceiptLineDetailSubscription.unsubscribe();
    this.findReceiptLineSubscription.unsubscribe();
    this.deleteReceiptLineSubscription.unsubscribe();
    this.deleteReceiptLineDetailsSubscription.unsubscribe();
    this.updateReceiptLineSubscription.unsubscribe();
    this.updateReceiptLineDetailSubscription.unsubscribe();
    this.deleteReceiptLineDetailSubscription.unsubscribe();
  }

  test(e: Event): void {
    alert(this.lineDetailTotal);
  }

  test2(): void {
    this.lineDetailTotal = 4;
  }
}
