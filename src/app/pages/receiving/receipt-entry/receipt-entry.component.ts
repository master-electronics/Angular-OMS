import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  FetchVendorListGQL,
  FindVendorGQL,
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
  UpdateReceiptGQL,
  UpdateReceiptLineGQL,
  UpdateReceiptLineDetailGQL,
  DeleteReceiptLineDetailGQL,
  InsertReceiptLineDetailsGQL,
} from 'src/app/graphql/receiving.graphql-gen';

interface PartCode {
  _id: number;
  PRC: string;
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
  Selected: boolean;
}

@Component({
  selector: 'receipt-entry',
  templateUrl: './receipt-entry.component.html',
  styleUrls: ['./receipt-entry.component.css'],
})
export class ReceiptEntry implements OnInit {
  message: string;
  alertType = 'success';
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
  receiptVendorID;
  vendorNumber;
  expectedArrivalDate;
  receiptExpectedArrivalDate;
  receiptSource;
  receiptLineDetailsTotal;
  receiptLineDetailsList;
  vendorSearchClass;
  partNumberClass;
  quantityClass;
  dateCodeClass;
  cooClass;
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
  lineDetailTotalClass;
  lineDetailOkDisabled = true;
  lineDetails: Array<{
    Quantity: number;
    PurchaseOrderLID: number;
    PurchaseOrderNumberLine: string;
  }> = [];
  receiptModalVisible: boolean;
  receiptModalOkDisabled = true;
  receiptModalStyle = { width: '800px' };
  receiptModalTitle;
  editingReceipt: boolean;

  private vendorListSubscription = new Subscription();
  private findVendorSubscription = new Subscription();
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
  private updateReceiptSubscription = new Subscription();
  private updateReceiptLineSubscription = new Subscription();
  private updateReceiptLineDetailSubscription = new Subscription();
  private deleteReceiptLineDetailSubscription = new Subscription();
  private insertReceiptLineDetailsSubscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private titleService: Title,
    private _fetchVendorList: FetchVendorListGQL,
    private _findVendor: FindVendorGQL,
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
    private _updateReceipt: UpdateReceiptGQL,
    private _updateReceiptLine: UpdateReceiptLineGQL,
    private _updateReceiptLineDetail: UpdateReceiptLineDetailGQL,
    private _deleteReceiptLineDetail: DeleteReceiptLineDetailGQL,
    private _insertReceiptLineDetails: InsertReceiptLineDetailsGQL
  ) {
    this.commonService.changeNavbar('Receipt Entry');
    this.titleService.setTitle('Receipt Entry');
  }

  ngOnInit(): void {
    this.editingReceipt = false;
    this.lineDetailTotal = 0;
    this.lineDetailTitle = 'Title';
    this.getVendors();
    this.getCountries();
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
          error: (error) => {
            this.alertType = 'error';
            this.message = 'Error getting Vendor list - ' + error;
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
          error: (error) => {
            this.alertType = 'error';
            this.message = 'Error getting Country list - ' + error;
          },
        })
    );
  }

  onReceiptModalCancel(): void {
    this.clearReceiptModal();
  }

  clearReceiptModal(): void {
    this.editingReceipt = false;
    this.vendorID = null;
    this.expectedArrivalDate = null;
    this.sourceType = null;
    this.receiptModalVisible = false;
  }

  clearReceipt(): void {
    this.receiptList = null;
    this.receiptNumber = null;
    this.receiptVendorID = null;
    this.vendorNumber = null;
    this.receiptExpectedArrivalDate = null;
    this.receiptSource = null;
    this.receiptLines = null;
  }

  onReceiptModalOk(): void {
    if (this.editingReceipt) {
      this.updateReceipt();
    } else {
      this.insertReceipt();
    }
  }

  editReceipt(): void {
    this.editingReceipt = true;
    this.vendorID = this.receiptVendorID.toString();
    this.expectedArrivalDate = this.receiptExpectedArrivalDate;
    this.sourceType = this.receiptSource;
    this.receiptModalTitle = 'Edit Receipt ' + this.receiptID;
    this.receiptModalVisible = true;
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
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error searching Receipts - ' + error;
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
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error searching Part Numbers - ' + error;
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
            error: (error) => {
              this.receiptLineDetailAlertType = 'error';
              this.receiptLineDetailMessage =
                'Error searching PO Number-Lines - ' + error;
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

  getReceiptVendor(): void {
    if (this.receiptVendorID) {
      this.findVendorSubscription.add(
        this._findVendor
          .fetch(
            { vendor: { _id: Number(this.receiptVendorID) } },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              this.vendorNumber = res.data.findVendor.VendorNumber;
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error finding Vendor - ' + error;
            },
          })
      );
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
                Selected: false,
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
                    error: (error) => {
                      this.alertType = 'error';
                      this.message = 'Error finding Country - ' + error;
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
                    error: (error) => {
                      this.alertType = 'error';
                      this.message = 'Error finding Part Number - ' + error;
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
                      error: (error) => {
                        this.alertType = 'error';
                        this.message =
                          'Error finding PO Number-Line - ' + error;
                      },
                    })
                );
              });
            });

            this.receiptLines = receiptLines;
          },
          error: (error) => {
            this.alertType = 'error';
            this.message = 'Error getting Receipt Lines - ' + error;
          },
        })
    );
  }

  updateReceipt(): void {
    if (this.receiptID) {
      if (this.vendorID) {
        this.vendorSearchClass = 'valid';
        const expectedDate = new Date(this.expectedArrivalDate);
        expectedDate.setHours(expectedDate.getHours() - 7);

        this.updateReceiptSubscription.add(
          this._updateReceipt
            .mutate({
              _id: Number(this.receiptID),
              vendorID: Number(this.vendorID),
              expectedArrivalDate: expectedDate.toLocaleDateString(),
              sourceType: this.sourceType,
            })
            .subscribe({
              complete: () => {
                this.clearReceiptModal();
                this.findReceipt();
                this.alertType = 'success';
                this.message = 'Receipt updated';
              },
              error: (error) => {
                this.clearReceiptModal();
                this.alertType = 'error';
                this.message = 'Error updating Receipt - ' + error;
              },
            })
        );
      } else {
        this.vendorSearchClass = 'invalid';
      }
    }
  }

  insertReceipt(): void {
    this.receiptLines = null;

    if (this.vendorID) {
      this.vendorSearchClass = 'valid';
      const expectedDate = new Date(this.expectedArrivalDate);
      expectedDate.setHours(expectedDate.getHours() - 7);

      this.insertReceiptSubscription.add(
        this._insertReceipt
          .mutate({
            receipt: {
              VendorID: Number(this.vendorID),
              ExpectedArrivalDate: expectedDate.toLocaleDateString(),
              SourceType: this.sourceType,
            },
          })
          .subscribe({
            next: (res) => {
              this.receiptID = res.data.insertReceipt._id.toString();
              this.receiptSelected = true;
            },
            error: (error) => {
              this.clearReceiptModal();
              this.alertType = 'error';
              this.message = 'Error inserting Receipt - ' + error;
            },
            complete: () => {
              this.alertType = 'success';
              this.message = 'Receipt added';
              this.clearReceiptModal();
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
              this.receiptVendorID = res.data.findReceipt.VendorID;
              this.receiptExpectedArrivalDate = new Date(
                Number(res.data.findReceipt.ExpectedArrivalDate)
              ).toLocaleDateString();
              this.receiptSource = res.data.findReceipt.SourceType;
            },
            complete: () => {
              this.getReceiptVendor();

              this.receiptList = [
                {
                  value: this.receiptID.toString(),
                  text: this.receiptNumber,
                },
              ];
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error loading Receipt - ' + error;
            },
          })
      );
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
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error finding Part Number - ' + error;
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
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error finding Country - ' + error;
            },
          })
      );
    }
  }

  onReceiptIDChange(e: Event): void {
    this.clearReceiptLine();
    this.clearReceiptLineDetail();
    this.clearMessages();

    if (e) {
      this.receiptSelected = true;
      this.findReceipt();
      this.getReceiptLines();
    } else {
      this.receiptSelected = false;
      this.clearReceipt();
    }
  }

  clearMessages(): void {
    this.alertType = 'success';
    this.message = null;
    this.receiptLineDetailAlertType = 'success';
    this.receiptLineDetailMessage = null;
  }

  selectReceiptLine(ReceiptLineID, ReceiptLineDetails): void {
    this.clearMessages();
    this.receiptLineDetailsTotal = 0;

    if (ReceiptLineID) {
      if (ReceiptLineDetails) {
        this.receiptLineDetailsList = [];

        ReceiptLineDetails.map((receiptLineDetail) => {
          this.receiptLineDetailsList.push(receiptLineDetail);
          this.receiptLineDetailsTotal += Number(
            receiptLineDetail.ExpectedQuantity
          );
        });
      }

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

                      this.receiptLines.map((receiptLine) => {
                        if (receiptLine._id == Number(ReceiptLineID)) {
                          receiptLine.Selected = true;
                        } else {
                          receiptLine.Selected = false;
                        }
                      });
                    },
                    error: (error) => {
                      this.alertType = 'error';
                      this.message = 'Error finding Part Number - ' + error;
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
                    error: (error) => {
                      this.alertType = 'error';
                      this.message = 'Error finding Country - ' + error;
                    },
                  })
              );
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error finding Receipt Line - ' + error;
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

                      if (index >= 0) {
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

                        this.alertType = 'success';
                        this.message = 'Receipt Line deleted';
                      }
                    },
                    error: (error) => {
                      this.alertType = 'error';
                      this.message = 'Error deleting Receipt Line - ' + error;
                    },
                  })
              );
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error deleting Receipt Line Details - ' + error;
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
      this.cooClass = 'valid';

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

      if (!this.coo) {
        valid = false;
        this.cooClass = 'invalid';
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
                if (
                  Number(this.quantity) != Number(this.receiptLineDetailsTotal)
                ) {
                  this.lineDetailOkDisabled = true;
                } else {
                  this.lineDetailOkDisabled = false;
                }

                this.showReceiptLineDetail('Save');

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

                this.alertType = 'success';
                this.message = 'Receipt Line updated';
              },
              error: (error) => {
                this.alertType = 'error';
                this.message = 'Error updating Receipt Line - ' + error;
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
    this.receiptLineDetailsTotal = null;
    this.receiptLineDetailsList = null;
    this.dateCode = null;
    this.coo = null;
    this.rohs = null;

    if (this.receiptLines) {
      this.receiptLines.map((receiptLine) => {
        receiptLine.Selected = false;
      });
    }
  }

  clearReceiptLineDetail(): void {
    this.lineDetailTotal = 0;
    this.lineDetails = [];
    this.poLineID = null;
    this.receiptLineDetailQuantity = null;
    this.poLineList = null;
  }

  addReceipt(): void {
    this.clearReceipt();
    this.clearReceiptLine();
    this.clearReceiptLineDetail();
    this.clearMessages();

    this.editingReceipt = false;
    this.receiptModalTitle = 'New Receipt';
    this.receiptModalVisible = true;
  }

  addReceiptLine(): void {
    this.clearMessages();

    this.partNumberClass = 'valid';
    this.quantityClass = 'inputValid';
    this.dateCodeClass = 'inputValid';
    this.cooClass = 'valid';

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

    if (!this.coo) {
      valid = false;
      this.cooClass = 'invalid';
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
                Selected: false,
              };

              const receiptLines: ReceiptLine[] = [];

              receiptLines.push(newReceiptLine);
              this.receiptLines = receiptLines;

              this.alertType = 'success';
              this.message = 'Receipt Line added';
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error inserting Receipt Line - ' + error;
            },
          })
      );
    }
  }

  showReceiptLineDetail(okText: string): void {
    this.receiptLineDetailOkText = okText;

    if (this.receiptLineDetailsList) {
      this.lineDetails = [];
      this.lineDetailTotal = 0;

      this.receiptLineDetailsList.map((lineDetail) => {
        this.lineDetailTotal += Number(lineDetail.ExpectedQuantity);

        this.lineDetails.push({
          Quantity: lineDetail.ExpectedQuantity,
          PurchaseOrderLID: lineDetail.PurchaseOrderLID,
          PurchaseOrderNumberLine: lineDetail.PurchaseOrderNumberLine,
        });
      });
    }

    this.receiptLineDetailVisible = true;
  }

  hideReceiptLineDetail(): void {
    this.receiptLineDetailVisible = false;
  }

  onReceiptLineDetailOKClick(): void {
    if (this.lineDetails.length > 0) {
      const lineDetails: Array<{
        ReceiptLID: number;
        PurchaseOrderLID: number;
        ExpectedQuantity: number;
      }> = [];

      this.deleteReceiptLineDetailsSubscription.add(
        this._deleteReceiptLineDetails
          .mutate({ receiptLineID: Number(this.receiptLineID) })
          .subscribe({
            complete: () => {
              this.lineDetails.map((lineDetail) => {
                lineDetails.push({
                  ReceiptLID: Number(this.receiptLineID),
                  PurchaseOrderLID: lineDetail.PurchaseOrderLID,
                  ExpectedQuantity: lineDetail.Quantity,
                });
              });

              this.insertReceiptLineDetailsSubscription.add(
                this._insertReceiptLineDetails
                  .mutate({
                    receiptLineDetails: lineDetails,
                  })
                  .subscribe({
                    error: (error) => {
                      this.receiptLineDetailAlertType = 'error';
                      this.receiptLineDetailMessage =
                        'Error inserting Receipt Line Details - ' + error;
                    },
                    complete: () => {
                      this.getReceiptLines();
                      this.poLineID = null;
                      this.poLineList = null;
                      this.receiptLineDetailQuantity = null;
                      this.receiptLineDetailVisible = false;

                      this.clearReceiptLine();
                      this.clearReceiptLineDetail();

                      this.alertType = 'success';
                      this.message = 'Receipt line detail(s) saved.';
                    },
                  })
              );
            },
            error: (error) => {
              this.receiptLineDetailAlertType = 'error';
              this.receiptLineDetailMessage =
                'Error deleting Receipt Line Details';
            },
          })
      );
    }
  }

  resetReceiptLineDetailMessage() {
    this.receiptLineDetailMessage = null;
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

              if (this.lineDetailTotal > this.quantity) {
                this.lineDetailTotalClass = 'alert';
              } else {
                this.lineDetailTotalClass = null;
              }

              if (this.lineDetailTotal == this.quantity) {
                this.lineDetailOkDisabled = false;
              } else {
                this.lineDetailOkDisabled = true;
              }

              this.poLineID = null;
              this.poLineList = null;
              this.receiptLineDetailQuantity = null;
            },
            error: (error) => {
              this.receiptLineDetailAlertType = 'error';
              this.receiptLineDetailMessage =
                'Error finding PO Number-Line - ' + error;
            },
          })
      );
    }
  }

  removeDetailLine(index: number): void {
    if (index >= 0) {
      this.lineDetailTotal = 0;

      const lineDetails: Array<{
        Quantity: number;
        PurchaseOrderLID: number;
        PurchaseOrderNumberLine: string;
      }> = [];

      this.lineDetails.splice(index, 1);

      this.lineDetails.map((lineDetail) => {
        this.lineDetailTotal += lineDetail.Quantity;
        lineDetails.push(lineDetail);
      });

      this.lineDetails = lineDetails;

      if (this.lineDetailTotal > this.quantity) {
        this.lineDetailTotalClass = 'alert';
      } else {
        this.lineDetailTotalClass = null;
      }

      if (this.lineDetailTotal == this.quantity) {
        this.lineDetailOkDisabled = false;
      } else {
        this.lineDetailOkDisabled = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.vendorListSubscription.unsubscribe();
    this.findVendorSubscription.unsubscribe();
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
    this.updateReceiptSubscription.unsubscribe();
    this.updateReceiptLineSubscription.unsubscribe();
    this.updateReceiptLineDetailSubscription.unsubscribe();
    this.deleteReceiptLineDetailSubscription.unsubscribe();
    this.insertReceiptLineDetailsSubscription.unsubscribe();
  }
}
