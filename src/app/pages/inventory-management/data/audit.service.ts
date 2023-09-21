import { Injectable } from '@angular/core';
import { Observable, of, map, catchError, switchMap } from 'rxjs';
import {
  Audit,
  Inventory,
  Product,
  ProductCode,
  Container,
} from '../utils/interfaces';
import {
  FindNextAuditGQL,
  InventoryUpdateGQL,
  DeleteAuditGQL,
  CloseAuditGQL,
  GetNextSubAuditGQL,
  InsertSuspectGQL,
  FindImInventoryGQL,
} from 'src/app/graphql/inventoryManagement.graphql-gen';

@Injectable()
export class AuditService {
  constructor(
    private _findNextAudit: FindNextAuditGQL,
    private _inventoryUpdate: InventoryUpdateGQL,
    private _deleteAudit: DeleteAuditGQL,
    private _closeAudit: CloseAuditGQL,
    private _nextSubAudit: GetNextSubAuditGQL,
    private _insertSuspect: InsertSuspectGQL,
    private _findInventory: FindImInventoryGQL
  ) {}

  //public get nextSearchLocation$(): Observable<Container> {
  //return
  //}

  public get nextAudit$(): Observable<Audit> {
    return this._findNextAudit
      .fetch({ userID: 13 }, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          let Audit: Audit;
          if (res.data.findNextAudit) {
            const data = res.data.findNextAudit[0];
            Audit = {
              _id: data._id,
              TypeID: data.TypeID,
              Type: {
                Type: data.Type,
                Order: data.Order,
              },
              InventoryID: data.InventoryID,
              Inventory: {
                ITN: data.InventoryTrackingNumber,
                DateCode: data.DateCode,
                COO: data.COO,
                ROHS: data.ROHS,
                Quantity: data.QuantityOnHand,
                ProductID: data.ProductID,
                Product: {
                  PartNumber: data.PartNumber,
                  ProductCodeID: data.ProductCodeID,
                  ProductCode: {
                    ProductCodeNumber: data.ProductCodeNumber,
                  },
                  MICPartNumber: data.MICPartNumber,
                  UOM: data.UOM,
                  PackType: data.PackType,
                  PackQty: data.PackQty,
                  Cost: data.Cost,
                },
              },
              Container: {
                Barcode: data.Barcode,
              },
            };
          }

          return Audit;
        })
      );
  }

  public inventoryUpdate(
    Username: string,
    ITN: string,
    Reason: string,
    Quantity?: string,
    DateCode?: string,
    Country?: string,
    ROHS?: string,
    Suspect?: string,
    BinLocation?: string
  ) {
    // if (Quantity) {
    //   return this._inventoryUpdate.mutate({
    //     user: Username,
    //     itn: ITN,
    //     quantity: Quantity,
    //     dateCode: DateCode,
    //     country: Country,
    //     rohs: ROHS,
    //     reason: Reason,
    //   });
    // }

    return this._inventoryUpdate.mutate({
      user: Username,
      itn: ITN,
      quantity: Quantity,
      dateCode: DateCode,
      country: Country,
      rohs: ROHS,
      reason: Reason,
      suspect: Suspect,
      binlocation: BinLocation,
    });
  }

  public deleteAudit(InventoryID: number, TypeID: number) {
    return this._deleteAudit.mutate({
      inventoryID: InventoryID,
      typeID: TypeID,
    });
  }

  public closeAudit(
    InventoryID: number,
    TypeID: number,
    ITN: string,
    Username: string
  ) {
    const t = 'test';
    return this._closeAudit
      .mutate({
        inventoryID: InventoryID,
        typeID: TypeID,
      })
      .pipe(
        switchMap((res) => {
          const t = 'test';
          if (
            JSON.parse(sessionStorage.getItem('currentAudit')).IMSuspect != 'Y'
          ) {
            return this._inventoryUpdate.mutate({
              user: Username,
              itn: ITN,
              suspect: 'false',
              reason: 'Inventory Management Audit',
            });
          }

          return of(res);
        })
      );
  }

  public insertSuspect(PartData) {
    return this._insertSuspect.mutate({
      suspect: [
        {
          InventoryID: Number(PartData[0].InventoryID),
          Reason: PartData[0].Reason,
          Comment: PartData[0].Comment,
        },
      ],
    });
  }

  public validatePartNumber(PartData) {
    return this._findInventory
      .fetch(
        {
          inventory: {
            _id: Number(PartData[0].InventoryID),
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          const t = 'test';
          if (
            res.data.findInventory.Product.PartNumber != PartData[0].PartNumber
          ) {
            return this._insertSuspect
              .mutate({
                suspect: [
                  {
                    InventoryID: Number(PartData[0].InventoryID),
                    Reason: 'Wrong Part Number',
                  },
                ],
              })
              .pipe(
                map((res) => {
                  return res;
                }),
                catchError((error) => {
                  const t = error.message;
                  return error;
                })
              );
          }

          return res;
        }),
        catchError((error) => {
          const t = error.message;
          return error;
        })
      );
  }

  public nextSubAudit$(InventoryID: number, UserID: number): Observable<Audit> {
    return this._nextSubAudit
      .fetch(
        {
          inventoryID: InventoryID,
          userID: UserID,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          let Audit: Audit;
          if (res.data.getNextSubAudit.length > 0) {
            const data = res.data.getNextSubAudit[0];
            let route;

            switch (data.TypeID) {
              case 10:
                route = 'scan-itn';
                break;
              case 20:
                route = 'quantity';
                break;
              case 30:
                route = 'dateCode';
                break;
              case 40:
                route = 'coo';
                break;
              case 50:
                route = 'rohs';
                break;
              case 60:
                route = 'partNumber';
                break;
              default:
                route = 'scan-itn';
                break;
            }

            Audit = {
              _id: data._id,
              TypeID: data.TypeID,
              Type: {
                Type: data.Type,
                Order: data.Order,
              },
              InventoryID: data.InventoryID,
              Inventory: {
                ITN: data.InventoryTrackingNumber,
                ROHS: data.ROHS,
                Quantity: data.QuantityOnHand,
                ProductID: data.ProductID,
                Product: {
                  PartNumber: data.PartNumber,
                  ProductCodeID: data.ProductCodeID,
                  ProductCode: {
                    ProductCodeNumber: data.ProductCodeNumber,
                  },
                  MICPartNumber: data.MICPartNumber,
                  UOM: data.UOM,
                  PackType: data.PackType,
                  PackQty: data.PackQty,
                  Cost: data.Cost,
                },
              },
              Container: {
                Barcode: data.Barcode,
              },
              Route: route,
            };
          }

          return Audit;
        })
      );
  }
}
