import { Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  FindProductGQL,
  UpdateAutostoreMessageGQL,
  UpdateProductLastSyncGQL,
} from 'src/app/graphql/autostoreASN.graphql-gen';
import { InsertAutostoreMessageGQL } from 'src/app/graphql/autostore.graphql-gen';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
}

@Injectable()
export class ProductService {
  constructor(
    private _findProduct: FindProductGQL,
    private _insertMessage: InsertAutostoreMessageGQL,
    private _updateMessage: UpdateAutostoreMessageGQL,
    private _updateLastSync: UpdateProductLastSyncGQL,
    private http: HttpClient
  ) {}

  public sendToAutostore$(IDList: number[]) {
    console.log('heretoo');

    return combineLatest(
      IDList.map((ID) => {
        const message: Message = {};
        console.log('ID-' + ID);
        return this._findProduct
          .fetch(
            {
              product: {
                _id: ID,
              },
            },
            { fetchPolicy: 'network-only' }
          )
          .pipe(
            map((res) => {
              const ID: number = res.data.findProduct._id;
              const PartNumber: string = res.data.findProduct.PartNumber.trim();
              const ProductCodeNumber: string =
                res.data.findProduct.ProductCode.ProductCodeNumber.trim();
              const Description: string =
                res.data.findProduct.Description.trim();
              const Velocity =
                res.data.findProduct.Velocity == 'A'
                  ? 'A'
                  : res.data.findProduct.Velocity == 'B' ||
                    res.data.findProduct.Velocity == 'C'
                  ? 'B'
                  : 'C';
              const UOM: string = res.data.findProduct.UOM.trim();
              const MICPartNumber: string =
                res.data.findProduct.MICPartNumber.trim();

              message.Type = 'PRODUCT';
              message.TypeID = ID;
              message.AutostoreID = ProductCodeNumber + PartNumber;
              message.Action = 'insert';
              message.Endpoint = '/products';
              message.Method = 'POST';
              message.Status = 'unsent';
              message.Timestamp = new Date(Date.now()).toISOString();

              let msgTxt = '{';
              msgTxt += `"productId": "${ProductCodeNumber + PartNumber}",
              "owner": "MasterElectronics",`;

              if (Description) {
                msgTxt += `"description": "${Description}",`;
              }

              if (Velocity) {
                msgTxt += `"velocity": "${Velocity}",`;
              }

              msgTxt += `"productUom": [ {
                "uomId": "${UOM}",`;

              if (MICPartNumber) {
                msgTxt += `"imagePath": "${
                  environment.productImgSource + MICPartNumber
                }",`;
              }

              msgTxt += `"ratio": 1,
              "baseUomFlag": true,
              "pickUomFlag": false,
              putawayUomFlag": false
            } ] }`;

              message.Message = msgTxt;

              console.log(message);

              return res;
            }),
            switchMap((res) => {
              console.log('hereii - ');
              console.log(message);

              return combineLatest({
                productDataMessage: this._insertMessage.mutate({
                  message: message,
                }),
                productLastSync: this.updateLastSync(ID),
              });

              // return this._insertMessage.mutate({
              //   message: message,
              // });
            }),
            switchMap((res) => {
              const tMsg = JSON.parse(JSON.stringify(message));
              const nMsg = {
                pattern: 'PRODUCT_message',
                data: {
                  message: tMsg,
                },
              };

              return combineLatest({
                productMessage: this.sendMessage(nMsg),
                productMessageStatus: this.updateMessageStatus(
                  'sent',
                  res.productDataMessage.data.insertAutostoreMessage._id
                ),
              });
            })
          );
      })
    );
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  sendMessage(message) {
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

  updateLastSync(ProductID: number) {
    return this._updateLastSync
      .mutate({
        product: {
          _id: ProductID,
          LastAutostoreSync: new Date(Date.now()).toISOString(),
        },
      })
      .pipe((res) => res);
  }

  insertProduct$() {
    //return
  }
}
