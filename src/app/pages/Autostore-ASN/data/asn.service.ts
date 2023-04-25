import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  combineLatestWith,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { UserContainerService } from 'src/app/shared/data/user-container';
import { Logger } from 'src/app/shared/services/logger.service';
import {
  VerifyItnForAsnGQL,
  MoveInventoryToContainerForAsnGQL,
  FetchAsnInventoryGQL,
  InsertAutostoreAsnGQL,
  VerifyAsnLocationCreateGQL,
  VerifyAsnLocationStatusGQL,
  UpdateAutostoreAsnGQL,
  UpdateAutostoreMessageGQL,
  FindAsnReplenishmentInventoryGQL,
  UpdateAsnReplenishmentItemGQL,
  FindAsnByItnGQL,
  UpdateAsnParentContainerGQL,
  ItnLocationChangeGQL,
  ItnChangeGQL,
} from 'src/app/graphql/autostoreASN.graphql-gen';
import { InsertAutostoreMessageGQL } from 'src/app/graphql/autostore.graphql-gen';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from './product.service';
import { ReplenishmentItem } from '../utils/interfaces';
import { sqlData } from 'src/app/shared/utils/sqlData';

interface ASNLine {
  lineNumber?: number;
  productId?: string;
  packagingUom?: string;
  quantityExpected?: number;
  InventoryID?: number;
  InventoryTrackingNumber?: string;
}

interface ASN {
  tuType?: string;
  Status?: string;
  ContainerID?: number;
  AUTOSTOREASNLINEs?: ASNLine[];
}

interface Message {
  _id?: number;
  Type?: string;
  TypeID?: number;
  AutostoreID?: string;
  Action?: string;
  Endpoint?: string;
  Method?: string;
  Timestamp?: string;
  Status?: string;
  Message?: string;
  OrderLines?: string;
  ErrorCount?: number;
}

@Injectable()
export class ASNService {
  constructor(
    private _userC: UserContainerService,
    private _verifyITN: VerifyItnForAsnGQL,
    private _move: MoveInventoryToContainerForAsnGQL,
    private _asnInventory: FetchAsnInventoryGQL,
    private _insertASN: InsertAutostoreAsnGQL,
    private _verifyLocation: VerifyAsnLocationCreateGQL,
    private _verifyLocationStatus: VerifyAsnLocationStatusGQL,
    private _insertMessage: InsertAutostoreMessageGQL,
    private http: HttpClient,
    private _productService: ProductService,
    private _updateASN: UpdateAutostoreAsnGQL,
    private _updateMessage: UpdateAutostoreMessageGQL,
    private _findReplenishmentItem: FindAsnReplenishmentInventoryGQL,
    private _updateReplenishmentitem: UpdateAsnReplenishmentItemGQL,
    private _findASN: FindAsnByItnGQL,
    private _updateParentContainer: UpdateAsnParentContainerGQL,
    private _itnLocationChange: ItnLocationChangeGQL,
    private _itnChange: ItnChangeGQL
  ) {}

  inventoryList;
  productList;
  asn: ASN;
  asnID: number;
  data$;
  message: Message;

  public moveItnToUser(ITN: string): Observable<any> {
    return this._verifyITN
      .fetch(
        {
          ITN,
          DC: environment.DistributionCenter,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findInventory) {
            throw new Error('ITN not found');
          }
          if (!this._userC.userContainerID) {
            throw new Error('Container not found');
          }
        }),
        switchMap((res) => {
          return this._move.mutate({
            ITN: ITN,
            DC: environment.DistributionCenter,
            ContainerID: this._userC.userContainerID,
            //locatedInAutostore: true,
          });
        })
      );
  }

  public moveItnToLocation(
    ITN: string,
    ContainerID: number,
    User: string,
    BinLocation: string
  ): Observable<any> {
    return combineLatest({
      move: this._move
        .mutate({
          ITN: ITN,
          DC: environment.DistributionCenter,
          ContainerID: ContainerID,
          boundForAutostore: true,
          suspect: true,
          suspectReason: sqlData.ASN_Inventory_Suspect_Reason,
        })
        .pipe(
          catchError((error) => {
            throw new Error(error);
          })
        ),
      itnLocationChange: this.itnLocationChange(User, ITN, BinLocation),
      itnChange: this.itnChange(User, ITN, 'true', ''),
    });
  }

  public findContainer(Barcode: string) {
    return this._verifyLocation
      .fetch(
        {
          container: { Barcode },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(map((res) => res));
  }

  public sendToAutostore$(Barcode: string) {
    let containerID: number;
    return this._verifyLocation
      .fetch(
        {
          container: { Barcode },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findContainer) {
            throw new Error("Can't find this location");
          }
          containerID = res.data.findContainer._id;
        }),
        switchMap((res) => {
          return this._verifyLocationStatus
            .fetch(
              {
                asn: { ContainerID: containerID, Status: 'Open' },
              },
              { fetchPolicy: 'network-only' }
            )
            .pipe(
              tap((res) => {
                if (res.data.verifyASNLocationStatus.length > 0) {
                  throw new Error(
                    `Open ASN '${res.data.verifyASNLocationStatus[0].tuId}' already exists`
                  );
                }
              })
            );
        }),
        switchMap((res) => {
          return this.fetchASNInventory$(containerID);
        }),
        switchMap((res) => {
          //this.asnID = Number(res._id);
          this.data$ = this.insertASN$();
          return this.data$;
        }),
        switchMap((res) => {
          const product$ =
            this.productList.length > 0
              ? this._productService.sendToAutostore$(this.productList)
              : of(true);

          return combineLatest({
            product: product$,
            message: this.insertMessage$(),
          });
        }),
        switchMap((res) => {
          console.log('***');
          console.log(res);
          console.log('###');
          const tMsg = JSON.parse(JSON.stringify(this.message));
          tMsg._id = res.message.data.insertAutostoreMessage._id;

          const nMsg = {
            pattern: 'ASN_message',
            data: {
              message: tMsg,
            },
          };

          return combineLatest({
            message: this.sendMessage(nMsg),
            AsnStatus: this.updateASNStatus('Sent', this.asnID),
            MessageStatus: this.updateMessageStatus(
              'sent',
              res.message.data.insertAutostoreMessage._id
            ),
          });
        }),
        switchMap((res) => {
          return of(this.asnID);
        })
      );
  }

  insertMessage$() {
    this.message = {};
    this.message.Type = 'ASN';
    this.message.TypeID = this.asnID;
    this.message.AutostoreID = this.asnID.toString();
    this.message.Action = 'insert';
    this.message.Endpoint = '/asns';
    this.message.Method = 'POST';
    this.message.Status = 'unsent';
    this.message.Timestamp = new Date(Date.now()).toISOString();

    const msgObj: any = {};
    const asnLineArray = [];

    msgObj.owner = 'MasterElectronics';

    const transportUnit: { tuId?: string; tuType?: string } = {
      tuId: this.asnID.toString(),
      tuType: this.asn.tuType,
    };

    msgObj.transportUnit = transportUnit;

    let lineNumber = 1;

    this.asn.AUTOSTOREASNLINEs.map((line) => {
      const asnLineObj: any = {};
      const asnLineDetailArray = [];

      asnLineObj.lineNumber = lineNumber;
      asnLineObj.productId = line.productId;
      asnLineObj.quantityExpected = line.quantityExpected;

      asnLineDetailArray.push({
        name: 'itn',
        value: line.InventoryTrackingNumber,
      });

      asnLineObj.attributeValue = asnLineDetailArray;
      asnLineArray.push(asnLineObj);

      lineNumber++;
    });

    msgObj.asnLine = asnLineArray;
    this.message.Message = JSON.stringify(msgObj);

    return this._insertMessage.mutate({
      message: this.message,
    });
  }

  insertASN$() {
    const insertAsn: ASN = JSON.parse(JSON.stringify(this.asn));
    insertAsn.AUTOSTOREASNLINEs.map((line) => {
      delete line.InventoryTrackingNumber;
    });

    return this._insertASN
      .mutate({
        asn: insertAsn, //this.asn,
      })
      .pipe(
        map((res) => {
          this.asnID = res.data.insertAutostoreASN._id;
          return this.asnID;
        })
      );
  }

  fetchASNInventory$(ContainerID: number): Observable<any> {
    this.inventoryList = [];
    this.productList = [];
    this.asn = {};

    return this._asnInventory
      .fetch(
        {
          container: {
            _id: ContainerID,
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          res.data.findContainer.INVENTORies.map((inventory) => {
            this.inventoryList.push(inventory);
          });

          let lineNumber = 1;

          const asnLines: ASNLine[] = [];

          let i = 1;

          this.inventoryList.map((inventory) => {
            //if product hasn't been sent to Autostore add it to list for sending
            if (!inventory.Product.LastAutostoreSync) {
              this.productList.push(inventory.Product._id);
              console.log('send product');
            }

            asnLines.push({
              lineNumber: lineNumber,
              productId:
                inventory.Product.ProductCode.ProductCodeNumber.toString() +
                inventory.Product.PartNumber.toString(),
              packagingUom: inventory.packagingUom,
              quantityExpected: Number(inventory.QuantityOnHand),
              InventoryID: Number(inventory._id),
              InventoryTrackingNumber: inventory.InventoryTrackingNumber,
            });
            lineNumber++;
            i++;
          });

          this.asn.tuType = 'BIN-1x1';
          this.asn.Status = 'Open';
          this.asn.ContainerID = ContainerID;

          this.asn.AUTOSTOREASNLINEs = asnLines;

          return res;
        })
      );
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  data = {
    test: 'woot',
    boom: 'ham',
  };

  sendMessage(message) {
    const t = environment.apiUrl;
    const w = 'woot';
    
    try {
      const msgResult = this.http.post(
        `${environment.apiUrl}/Autostore/message`,
        message,
        this.httpOptions
      );

      return msgResult;
    } catch (error) {
      return of(error);
    }
  }

  updateASNStatus(Status: string, ASNID: number) {
    return this._updateASN
      .mutate({
        asn: {
          Status: Status,
        },
        asnid: ASNID,
      })
      .pipe((res) => res);
  }

  updateMessageStatus(Status: string, MessageID: number) {
    return this._updateMessage
      .mutate({
        autostoreMessage: {
          Status: Status,
        },
        id: MessageID,
      })
      .pipe((res) => res);
  }

  private _replenishmentItem = new BehaviorSubject<ReplenishmentItem>(null);
  public get nextReplenishmentItem$(): Observable<ReplenishmentItem> {
    return this._findReplenishmentItem
      .fetch(
        {
          barcode: sessionStorage.getItem('asnLocation'),
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          const data = res.data.findASNReplenishmentInventory[0];
          const Item: ReplenishmentItem = {
            _id: data._id,
            InventoryID: data.InventoryID,
            Status: data.Status,
            Barcode: data.Barcode,
            Warehouse: data.Warehouse,
            Row: data.Row,
            Aisle: data.Aisle,
            Section: data.Section,
            Shelf: data.Shelf,
            ShelfDetail: data.ShelfDetail,
            InventoryTrackingNumber: data.InventoryTrackingNumber,
          };
          return Item;
        })
      );
  }

  fetchASN(ITN: string) {
    return this._findASN
      .fetch(
        {
          itn: ITN,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  updateASNReplenishmentItem(ID: number, Status: string) {
    const replenishmentItem = {
      _id: ID,
      Status: Status,
    };

    return this._updateReplenishmentitem
      .mutate({
        replenishmentItem: replenishmentItem,
      })
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  updateASNParentContainer(ASNContainerID: number, ParentContainerID: number) {
    const container = {
      ParentContainerID: ParentContainerID,
    };

    return this._updateParentContainer
      .mutate({
        container: container,
        id: ASNContainerID,
      })
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  itnLocationChange(User: string, ITN: string, BinLocation: string) {
    return this._itnLocationChange.fetch(
      {
        user: User,
        itn: ITN,
        binLocation: BinLocation,
      },
      { fetchPolicy: 'network-only' }
    );
  }

  itnChange(
    User: string,
    ITN: string,
    Suspect: string,
    LocatedInAutostore: string
  ) {
    console.log(User);
    console.log(ITN);
    console.log(Suspect);
    console.log(LocatedInAutostore);
    return this._itnChange.fetch(
      {
        user: User,
        itn: ITN,
        suspect: Suspect,
        locatedInAutostore: LocatedInAutostore,
      },
      { fetchPolicy: 'network-only' }
    );
  }
}
