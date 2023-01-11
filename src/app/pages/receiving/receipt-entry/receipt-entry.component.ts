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
  //FetchCountriesGQL,
  InsertReceiptLineGQL,
  FetchReceiptLinesGQL,
  FindPoLinesGQL,
  //FindCountryGQL,
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
  DeleteReceiptGQL,
  FindPOsGQL,
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
  poNumberList: Array<{ value: string; text: string }> = [];
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
  sourceType;
  sourceTypeOptions: Array<{
    label: string;
    value: string;
    disabled: boolean;
  }> = [
    { label: 'Manually entered', value: 'manual', disabled: false },
    { label: 'ASN from vendor', value: 'ASN', disabled: true },
    {
      label: 'Generated from packing list scan',
      value: 'scan',
      disabled: true,
    },
  ];
  receiptSelected: boolean;
  partNumber;
  partNumberID;
  quantity;
  ROHSOptions: Array<{ label: string; value: string }> = [
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
  receiptModalStyle = { width: '900px' };
  receiptModalTitle;
  editingReceipt: boolean;
  receiptLineDetailQuantityMax: number;

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
  private deleteReceiptSubscription = new Subscription();
  private findPOsSubscription = new Subscription();

  constructor(
    private commonService: CommonService,
    private titleService: Title,
    private _fetchVendorList: FetchVendorListGQL,
    private _findVendor: FindVendorGQL,
    private _findReceipt: FindReceiptGQL,
    private _findReceiptList: FindReceiptsGQL,
    private _insertReceipt: InsertReceiptGQL,
    private _findPartCodes: FindPartCodesGQL,
    //private _fetchCountryList: FetchCountriesGQL,
    private _insertReceiptLine: InsertReceiptLineGQL,
    private _fetchReceiptLines: FetchReceiptLinesGQL,
    private _findPOLines: FindPoLinesGQL,
    //private _findCountry: FindCountryGQL,
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
    private _insertReceiptLineDetails: InsertReceiptLineDetailsGQL,
    private _deleteReceipt: DeleteReceiptGQL,
    private _findPOs: FindPOsGQL
  ) {
    this.commonService.changeNavbar('Receipt Entry');
    this.titleService.setTitle('Receipt Entry');
  }

  ngOnInit(): void {
    this.editingReceipt = false;
    this.lineDetailTotal = 0;
    this.lineDetailTitle = 'Title';
    this.getVendors();
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
                label:
                  vendor.VendorNumber.trim() +
                  (vendor.VendorName.trim() == ''
                    ? ''
                    : '-' + vendor.VendorName.trim()),
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
    this.receiptID = null;
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

  deleteReceipt(): void {
    if (this.receiptID) {
      let result: number;

      this.deleteReceiptSubscription.add(
        this._deleteReceipt
          .mutate({ receiptID: Number(this.receiptID) })
          .subscribe({
            next: (res) => {
              result = Number(res.data.deleteReceipt[0].result);
            },
            complete: () => {
              if (result == 1) {
                this.clearReceipt();
                this.clearReceiptLine();
                this.clearReceiptLineDetail();
                this.receiptSelected = false;
                this.alertType = 'success';
                this.message = 'Receipt deleted';
              } else {
                this.alertType = 'warning';
                this.message = `Receipt ${this.receiptID} cannot be deleted. Items have already been received.`;
              }
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error deleting Receipt - ' + error;
            },
          })
      );
    }
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

  searchPONumbers(value: string): void {
    if (value) {
      const pos: Array<{ text: string; value: string }> = [];

      this.findPOsSubscription.add(
        this._findPOs
          .fetch(
            {
              purchaseOrderNumber: value.toUpperCase(),
              limit: 20,
            },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              res.data.findPOs.map((po) => {
                pos.push({
                  text: po.PurchaseOrderNumber,
                  value: po.VendorID.toString(),
                });
              });
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error searching PO Numbers - ' + error;
            },
            complete: () => {
              this.poNumberList = pos;
            },
          })
      );
    } else {
      this.poNumberList = [];
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
            {
              vendorID: Number(this.receiptVendorID),
              productID: Number(this.partNumberID),
            },
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

  getPOLines(): void {
    if (this.receiptVendorID && this.partNumberID) {
      const poLines: Array<{ text: string; value: string }> = [];

      this.findPOLinesSubscription.add(
        this._findPOLines
          .fetch(
            {
              vendorID: Number(this.receiptVendorID),
              productID: Number(this.partNumberID),
            },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              res.data.findPOLines.map((poline) => {
                if (this.lineDetails) {
                  const line = this.lineDetails.find(
                    (item) => item.PurchaseOrderLID == poline._id
                  );

                  if (!line) {
                    poLines.push({
                      text: poline.PurchaseOrderNumberLine,
                      value: poline._id.toString(),
                    });
                  }
                } else {
                  poLines.push({
                    text: poline.PurchaseOrderNumberLine,
                    value: poline._id.toString(),
                  });
                }
              });
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error finding PO Number-Lines - ' + error;
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

  onPONumberLineChange(): void {
    if (this.poLineID) {
      this.findPOLineSubscripton.add(
        this._findPOLine
          .fetch(
            {
              purchaseOrderLID: Number(this.poLineID),
            },
            { fetchPolicy: 'network-only' }
          )
          .subscribe({
            next: (res) => {
              this.receiptLineDetailQuantityMax = Number(
                res.data.findPOLine[0].MaxQuantity
              );
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

  onReceiptLineDetailQuantityChange(e: Event): void {
    this.receiptLineDetailAlertType = 'success';
    this.receiptLineDetailMessage = null;

    if (Number(e) > this.receiptLineDetailQuantityMax) {
      this.receiptLineDetailAlertType = 'warning';
      this.receiptLineDetailMessage =
        'The max quantity for this PO Line is ' +
        this.receiptLineDetailQuantityMax;
      this.receiptLineDetailQuantity = '';

      return;
    }
  }

  onReceiptLineDetailQuantityFocusOut(e: Event): void {
    this.receiptLineDetailAlertType = 'success';
    this.receiptLineDetailMessage = null;

    if (Number(this.receiptLineDetailQuantity) < 1) {
      this.receiptLineDetailAlertType = 'warning';
      this.receiptLineDetailMessage = 'Quantity must be greater than 0';
      this.receiptLineDetailQuantity = '';
    }
  }

  onReceiptLineQuantityFocusOut(): void {
    this.alertType = 'success';
    this.message = null;

    if (Number(this.quantity) < 1) {
      this.alertType = 'warning';
      this.message = 'Quantity must be greater than 0';
      this.quantity = '';
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
              this.vendorNumber =
                (res.data.findVendor.VendorNumber
                  ? res.data.findVendor.VendorNumber
                  : '') +
                (res.data.findVendor.VendorName
                  ? ' - ' + res.data.findVendor.VendorName
                  : '');
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error finding Vendor - ' + error;
            },
          })
      );
    }
  }

  getVendor(ID: number): void {
    this.findVendorSubscription.add(
      this._findVendor
        .fetch({ vendor: { _id: ID } }, { fetchPolicy: 'network-only' })
        .subscribe({
          next: (res) => {
            this.vendorNumber =
              (res.data.findVendor.VendorNumber
                ? res.data.findVendor.VendorNumber
                : '') +
              (res.data.findVendor.VendorName
                ? ' - ' + res.data.findVendor.VendorName
                : '');
            this.vendorID = res.data.findVendor._id;
          },
          error: (error) => {
            this.alertType = 'error';
            this.message = 'Error finding Vendor - ' + error;
          },
        })
    );
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
                Selected:
                  receiptLine._id == Number(this.receiptLineID) ? true : false,
              });
            });
          },
          complete: () => {
            receiptLines.map((receiptLine) => {
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

  onPONumberChange(e: Event): void {
    if (e) {
      this.getVendor(Number(e));
    } else {
      this.vendorID = null;
      this.vendorNumber = null;
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

              this.getPOLines();
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
                        this.clearReceiptLine();

                        // this.receiptLineID = null;
                        // this.partNumber = null;
                        // this.partNumberID = null;
                        // this.partList = [];
                        // this.quantity = null;

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

      if (valid) {
        this.showReceiptLineDetail('Save');
        // this.updateReceiptLineSubscription.add(
        //   this._updateReceiptLine
        //     .mutate({
        //       receiptLID: Number(this.receiptLineID),
        //       productID: Number(this.partNumberID),
        //       expectedQuantity: Number(this.quantity),
        //       dateCode: null,
        //       countryID: null,
        //       ROHS: null,
        //     })
        //     .subscribe({
        //       complete: () => {
        //         if (
        //           Number(this.quantity) != Number(this.receiptLineDetailsTotal)
        //         ) {
        //           this.lineDetailOkDisabled = true;
        //         } else {
        //           this.lineDetailOkDisabled = false;
        //         }

        //         this.getPOLines();

        //         const receiptLine = this.receiptLines.find(
        //           (item) => item._id == this.receiptLineID
        //         );

        //         if (receiptLine) {
        //           receiptLine.ProductID = Number(this.partNumberID);
        //           receiptLine.PartNumber = this.partNumber;
        //           receiptLine.ExpectedQuantity = Number(this.quantity);
        //           receiptLine.DateCode = null;
        //           receiptLine.CountryID = null;
        //           receiptLine.ISO3 = null;
        //           receiptLine.ROHS = null;
        //         }

        //         this.alertType = 'success';
        //         this.message = 'Receipt Line updated';
        //       },
        //       error: (error) => {
        //         this.alertType = 'error';
        //         this.message = 'Error updating Receipt Line - ' + error;
        //       },
        //     })
        // );
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
    this.clearReceiptLineDetail();

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
    this.lineDetailOkDisabled = true;
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

    if (valid) {
      this.showReceiptLineDetail('Add');

      // let newLineNumber;
      // this.insertReceiptLineSubscription.add(
      //   this._insertReceiptLine
      //     .mutate({
      //       receiptHID: Number(this.receiptID),
      //       productID: Number(this.partNumberID),
      //       expectedQuantity: Number(this.quantity),
      //       dateCode: null,
      //       countryID: null,
      //       ROHS: null,
      //     })
      //     .subscribe({
      //       next: (res) => {
      //         this.receiptLineID = res.data.insertReceiptLine[0]._id;
      //         newLineNumber = res.data.insertReceiptLine[0].LineNumber;
      //       },
      //       complete: () => {
      //         const newReceiptLine: ReceiptLine = {
      //           _id: Number(this.receiptLineID),
      //           ReceiptHID: Number(this.receiptID),
      //           ProductID: Number(this.partNumberID),
      //           PartNumber: this.partNumber,
      //           ExpectedQuantity: Number(this.quantity),
      //           DateCode: null,
      //           CountryID: null,
      //           ISO3: null,
      //           ROHS: null,
      //           LineNumber: newLineNumber,
      //           ReceiptLineDetails: null,
      //           Expanded: false,
      //           Selected: false,
      //         };

      //         const receiptLines: ReceiptLine[] = [];

      //         receiptLines.push(newReceiptLine);
      //         this.receiptLines = receiptLines;

      //         this.getReceiptLines();

      //         this.getPOLines();

      //         this.alertType = 'success';
      //         this.message = 'Receipt Line added';
      //       },
      //       error: (error) => {
      //         this.alertType = 'error';
      //         this.message = 'Error inserting Receipt Line - ' + error;
      //       },
      //     })
      // );
    }
  }

  showReceiptLineDetail(okText: string): void {
    this.getPOLines();
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
    this.clearReceiptLineDetail();
  }

  onReceiptLineDetailOKClick(): void {
    if (this.receiptLineDetailOkText == 'Add') {
      let newLineNumber;
      this.insertReceiptLineSubscription.add(
        this._insertReceiptLine
          .mutate({
            receiptHID: Number(this.receiptID),
            productID: Number(this.partNumberID),
            expectedQuantity: Number(this.quantity),
            dateCode: null,
            countryID: null,
            ROHS: null,
          })
          .subscribe({
            next: (res) => {
              this.receiptLineID = res.data.insertReceiptLine[0]._id;
              newLineNumber = res.data.insertReceiptLine[0].LineNumber;
            },
            complete: () => {
              const newReceiptLine: ReceiptLine = {
                _id: Number(this.receiptLineID),
                ReceiptHID: Number(this.receiptID),
                ProductID: Number(this.partNumberID),
                PartNumber: this.partNumber,
                ExpectedQuantity: Number(this.quantity),
                DateCode: null,
                CountryID: null,
                ISO3: null,
                ROHS: null,
                LineNumber: newLineNumber,
                ReceiptLineDetails: null,
                Expanded: false,
                Selected: false,
              };

              this.alertType = 'success';
              this.message = 'Receipt Line added.';

              this.addLineDetails();

              const receiptLines: ReceiptLine[] = [];

              receiptLines.push(newReceiptLine);
              this.receiptLines = receiptLines;

              this.getReceiptLines();

              this.getPOLines();
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error inserting Receipt Line - ' + error;
            },
          })
      );
    } else if (this.receiptLineDetailOkText == 'Save') {
      this.updateReceiptLineSubscription.add(
        this._updateReceiptLine
          .mutate({
            receiptLID: Number(this.receiptLineID),
            productID: Number(this.partNumberID),
            expectedQuantity: Number(this.quantity),
            dateCode: null,
            countryID: null,
            ROHS: null,
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

              this.getPOLines();

              const receiptLine = this.receiptLines.find(
                (item) => item._id == this.receiptLineID
              );

              if (receiptLine) {
                receiptLine.ProductID = Number(this.partNumberID);
                receiptLine.PartNumber = this.partNumber;
                receiptLine.ExpectedQuantity = Number(this.quantity);
                receiptLine.DateCode = null;
                receiptLine.CountryID = null;
                receiptLine.ISO3 = null;
                receiptLine.ROHS = null;
              }

              this.alertType = 'success';
              this.message = 'Receipt Line updated.';

              this.addLineDetails();
            },
            error: (error) => {
              this.alertType = 'error';
              this.message = 'Error updating Receipt Line - ' + error;
            },
          })
      );
    }
  }

  addLineDetails(): void {
    if (this.lineDetails.length > 0) {
      const lineDetails: Array<{
        ReceiptLID: number;
        PurchaseOrderLID: number;
        ExpectedQuantity: number;
        StatusID: number;
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
                  StatusID: 10,
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
                      //this.poLineList = null;
                      this.receiptLineDetailQuantity = null;
                      this.receiptLineDetailVisible = false;

                      this.clearReceiptLine();
                      this.clearReceiptLineDetail();

                      this.alertType = 'success';
                      this.message += ' Receipt line detail(s) saved.';
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
              //this.poLineList = null;
              this.receiptLineDetailQuantity = null;

              this.getPOLines();
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

      this.getPOLines();

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
    this.deleteReceiptSubscription.unsubscribe();
    this.findPOsSubscription.unsubscribe();
  }
}
