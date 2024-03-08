import { Injectable, inject } from '@angular/core';
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
  InsertAuditsGQL,
  DeleteAuditGQL,
  DeleteAuditsGQL,
  CloseAuditGQL,
  CloseAuditsGQL,
  GetNextSubAuditGQL,
  InsertSuspectGQL,
  FindImInventoryGQL,
  GetSearchLocationGQL,
  GetSearchLocationsGQL,
  ValidateAssignmentGQL,
  UpdateLastUpdatedGQL,
  GetImAdjustReasonsGQL,
  FetchAuditTypesGQL,
  FetchSystemAuditListGQL,
  UpdateSystemTriggerGQL,
  InsertSystemTriggerGQL,
  ClearAuditsGQL,
  GetAuditCountGQL,
  FindContainerInventoryGQL,
  DeleteAuditsListGQL,
  FetchInventoryGQL,
  FetchInventoryAuditsGQL,
  FetchGlobalMessagesGQL,
  RecreateItnGQL,
  FetchPreviousLocationGQL,
  ClearAuditsFromTimeoutGQL,
  FetchLocationAuditsGQL,
  RemoveAuditGQL,
  UpdateAuditGQL,
  ReplanPickGQL,
} from 'src/app/graphql/inventoryManagement.graphql-gen';
import { FindInventoryGQL } from 'src/app/graphql/itn_info.graphql-gen';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { EventLogService } from 'src/app/shared/services/eventLog.service';
import { sqlData } from 'src/app/shared/utils/sqlData';

@Injectable()
export class AuditService {
  userInfo = inject(StorageUserInfoService);
  constructor(
    private _findNextAudit: FindNextAuditGQL,
    private _inventoryUpdate: InventoryUpdateGQL,
    private _insertAudits: InsertAuditsGQL,
    private _deleteAudit: DeleteAuditGQL,
    private _deleteAudits: DeleteAuditsGQL,
    private _closeAudit: CloseAuditGQL,
    private _closeAudits: CloseAuditsGQL,
    private _nextSubAudit: GetNextSubAuditGQL,
    private _insertSuspect: InsertSuspectGQL,
    private _findInventory: FindImInventoryGQL,
    private _getSearchLocation: GetSearchLocationGQL,
    private _getSearchLocations: GetSearchLocationsGQL,
    private _validateAssignment: ValidateAssignmentGQL,
    private _lastUpdated: UpdateLastUpdatedGQL,
    private _imAdjustReasons: GetImAdjustReasonsGQL,
    private _auditTypes: FetchAuditTypesGQL,
    private _systemAuditList: FetchSystemAuditListGQL,
    private _updateSystemTrigger: UpdateSystemTriggerGQL,
    private _insertSystemTrigger: InsertSystemTriggerGQL,
    private _clearAudits: ClearAuditsGQL,
    private _auditCount: GetAuditCountGQL,
    private _userInfo: StorageUserInfoService,
    private _findContainerInventory: FindContainerInventoryGQL,
    private _deleteAuditsList: DeleteAuditsListGQL,
    private _eventLog: EventLogService,
    private _fetchInventory: FetchInventoryGQL,
    private _findInv: FindInventoryGQL,
    private _fetchInvAudits: FetchInventoryAuditsGQL,
    private _fetchGlobalMessages: FetchGlobalMessagesGQL,
    private _recreateITN: RecreateItnGQL,
    private _fetchPrevious: FetchPreviousLocationGQL,
    private _clearAuditsFromTimeout: ClearAuditsFromTimeoutGQL,
    private _fetchLocationAudits: FetchLocationAuditsGQL,
    private _removeAudit: RemoveAuditGQL,
    private _updateAudit: UpdateAuditGQL,
    private _replanPick: ReplanPickGQL
  ) {}

  public get nextSearchLocation$(): Observable<Container> {
    return this._getSearchLocation
      .fetch(
        {
          barcode: JSON.parse(sessionStorage.getItem('currentAudit')).Container
            .Barcode,
          level: Number(sessionStorage.getItem('searchLevel')),
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          const container: Container = {
            Barcode: res.data.getSearchLocation[0].Barcode,
          };

          return container;
        }),
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  public get searchLocations$(): Observable<Container[]> {
    return this._getSearchLocations
      .fetch(
        {
          barcode: JSON.parse(sessionStorage.getItem('currentAudit')).Container
            .Barcode,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          let containers: Container[] = [];
          res.data.getSearchLocations.forEach((container) => {
            containers.push({
              Barcode: container.Barcode,
            });
          });

          return containers;
        }),
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  public updateLastUpdated(
    InventoryID: number,
    TypeID: number,
    LastUpdated: string
  ) {
    return this._lastUpdated.mutate({
      inventoryID: InventoryID,
      typeID: TypeID,
      lastUpdated: LastUpdated,
    });
  }

  public removeAudit(ID: number) {
    return this._removeAudit.mutate({
      id: ID,
    });
  }

  public updateAudit(ID: number, Priority: number) {
    return this._updateAudit.mutate({
      id: ID,
      audit: { Priority: Priority },
    });
  }

  public validateAssignment$(AuditID: number, UserID: number) {
    return this._validateAssignment.fetch(
      {
        auditID: AuditID,
        userID: UserID,
      },
      { fetchPolicy: 'network-only' }
    );
  }

  public get nextAudit$(): Observable<Audit> {
    const barcode = sessionStorage.getItem('CurrentLocation')
      ? sessionStorage.getItem('CurrentLocation')
      : null;

    return this._findNextAudit
      .fetch(
        {
          userID: this.userInfo.userId,
          barcode: barcode,
          distributionCenter: this._userInfo.distributionCenter,
        },
        { fetchPolicy: 'network-only' }
      )
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
              LocationCode: data.LocationCode,
              OrderNumberNOSI: data.OrderNumberNOSI,
              OrderLineNumber: data.OrderLineNumber,
              InventoryID: data.InventoryID,
              Inventory: {
                ITN: data.InventoryTrackingNumber,
                ParentITN: data.ParentITN,
                DateCode: data.DateCode,
                COO: data.COO,
                ROHS: data.ROHS,
                Quantity: data.QuantityOnHand,
                OriginalQuantity: data.OriginalQuantity,
                NotFound: data.NotFound,
                Suspect: data.Suspect,
                LocatedInAutostore: data.LocatedInAutostore,
                BoundForAutostore: data.BoundForAutostore,
                ProductID: data.ProductID,
                Product: {
                  PartNumber: data.PartNumber,
                  Description: data.Description,
                  ProductCodeID: data.ProductCodeID,
                  ProductCode: {
                    ProductCodeNumber: data.ProductCodeNumber,
                  },
                  ProductType: {
                    ProductType: data.ProductType,
                    Description: data.ProductTypeDescription,
                  },
                  ProductTier: data.ProductTier,
                  Velocity: data.Velocity,
                  MICPartNumber: data.MICPartNumber,
                  UOM: data.UOM,
                  Autostore: data.Autostore,
                  PackType: data.PackType,
                  PackQty: data.PackQty,
                  Cost: data.Cost,
                },
              },
              Container: {
                Barcode: data.Barcode,
              },
              LastUpdated: data.LastUpdated,
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
    BinLocation?: string,
    VerificationState?: string
  ) {
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
      verificationState: VerificationState,
    });
  }

  public replanPick(
    ITN: string,
    LocationCode: string,
    OrderNumberNOSI: string,
    OrderLineNumber: string
  ) {
    return this._replanPick.mutate({
      itn: ITN,
      locationCode: LocationCode,
      orderNumberNOSI: OrderNumberNOSI,
      orderLineNumber: OrderLineNumber,
    });
  }

  public recreateITN(
    Username: string,
    ITN: string,
    Warehouse: string,
    BinLocation: string,
    Quantity: string
  ) {
    return this._recreateITN.mutate({
      user: Username,
      itn: ITN,
      warehouse: Warehouse,
      binlocation: BinLocation,
      quantity: Quantity,
    });
  }

  public insertAudits(Audits) {
    return this._insertAudits.mutate({
      audits: Audits,
    });
  }

  public deleteAudit(InventoryID: number, TypeID: number) {
    return this._deleteAudit.mutate({
      inventoryID: InventoryID,
      typeID: TypeID,
    });
  }

  public deleteAudits(InventoryID: number) {
    return this._deleteAudits.mutate({
      inventoryID: InventoryID,
    });
  }

  public closeAudit(
    InventoryID: number,
    TypeID: number,
    ITN: string,
    Username: string
  ) {
    return this._closeAudit
      .mutate({
        inventoryID: InventoryID,
        typeID: TypeID,
      })
      .pipe(
        switchMap((res) => {
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

  public closeSearchAudit(InventoryID: number, TypeID: number) {
    console.log('B');
    return this._closeAudit.mutate({
      inventoryID: InventoryID,
      typeID: TypeID,
    });
  }

  public clearAudits(Username: string, DistributionCenter: string) {
    return this._clearAudits.mutate({
      username: Username,
      distributionCenter: DistributionCenter,
    });
  }

  public clearAuditsByTimeout(UserID: number) {
    return this._clearAuditsFromTimeout.mutate({
      userID: UserID,
    });
  }

  public auditCount() {
    return this._auditCount.fetch({}, { fetchPolicy: 'network-only' });
  }

  public getGlobalMessages(InventoryID: number) {
    return this._fetchGlobalMessages
      .fetch({
        inventoryId: InventoryID,
      })
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  public closeAudits(ITN: string) {
    return this._closeAudits.mutate({
      itn: ITN,
    });
  }

  public insertSuspect(SuspectData) {
    return this._insertSuspect.mutate({
      suspect: [
        {
          InventoryID: Number(SuspectData[0].InventoryID),
          Reason: SuspectData[0].Reason,
          Comment: SuspectData[0].Comment,
        },
      ],
    });
  }

  public LocationSearchDone(
    Barcode: string,
    ScannedITns: [string],
    InventoryID: number
  ) {
    const ids: [number?] = [];

    return this._findContainerInventory
      .fetch(
        {
          container: { Barcode: Barcode },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          res.data.findContainer.INVENTORies.forEach((inv) => {
            const scanned = ScannedITns?.find(
              (itn) => itn == inv.InventoryTrackingNumber
            );

            if (!scanned) {
              if (inv._id != InventoryID) {
                ids.push(inv._id);
              }
            }
          });
        }),
        switchMap(() => {
          return this.deleteAuditsList(ids);
        }),
        switchMap(() => {
          return this.logNFDuringSearch(ids, Barcode);
        }),
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  public fetchInventoryAudits(InventoryID: number) {
    return this._fetchInvAudits
      .fetch({
        inventoryId: InventoryID,
      })
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  public fetchContainerInventory(Container) {
    return this._findContainerInventory
      .fetch(
        {
          container: Container,
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

  public deleteAuditsList(InventoryIDs: [number?]) {
    return this._deleteAuditsList
      .mutate({
        inventoryIDs: InventoryIDs,
      })
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  public findInventory(DistributionCenter: string, ITN: string) {
    return this._findInv.fetch({
      DistributionCenter: DistributionCenter,
      InventoryTrackingNumber: ITN,
    });
  }

  logNFDuringSearch(InventoryIDs: [number?], SearchLocation: string) {
    const userEventLog = [];
    const eventLog = [];

    return this._fetchInventory.fetch({ inventoryIDs: InventoryIDs }).pipe(
      map((res) => {
        res.data.fetchInventory.forEach((inv) => {
          userEventLog.push({
            UserEventID: sqlData.Event_IM_Audit_ITN_NF_During_Search,
            UserName: this.userInfo.userName,
            DistributionCenter: this.userInfo.distributionCenter,
            InventoryTrackingNumber: inv._id.toString(),
            Message: 'Search Location: ' + SearchLocation,
          });

          eventLog.push({
            UserName: this.userInfo.userName,
            EventTypeID: sqlData.Event_IM_Audit_ITN_NF_During_Search,
            Log: JSON.stringify({
              SearchLocation: SearchLocation,
              DistributionCenter: this.userInfo.distributionCenter,
              InventoryTrackingNumber: inv.InventoryTrackingNumber,
              ParentITN: inv.ParentITN,
              BinLocation: inv.BinLocation,
              QuantityOnHand: inv.QuantityOnHand,
              OriginalQuantity: inv.OriginalQuantity,
              DateCode: inv.DateCode,
              CountryOfOrigin: inv.Country?.ISO2,
              ROHS: inv.ROHS,
              NotFound: inv.NotFound,
              Suspect: inv.Suspect,
              LocatedInAutostore: inv.LocatedInAutostore,
              BoundForAutostore: inv.BoundForAutostore,
              PartNumber: inv.Product.PartNumber,
              ProductCode: inv.Product.ProductCode.ProductCodeNumber,
              Description: inv.Product.Description,
              ProductTier: inv.Product.ProductTier,
              Velocity: inv.Product.Velocity,
              MICPartNumber: inv.Product.MICPartNumber,
              UOM: inv.Product.UOM,
              Autostore: inv.Product.Autostore,
              PackType: inv.Product.PackType,
              PackQty: inv.Product.PackQty,
            }),
          });
        });
      }),
      switchMap((res) => {
        return this._eventLog.insertLog(userEventLog, eventLog);
      }),
      catchError((error) => {
        throw new Error(error);
      })
    );
  }

  public updateSystemTrigger(
    TriggerId: number,
    Trigger: {
      Name?: string;
      Description?: string;
      Active?: boolean;
      Priority?: number;
    },
    AuditTypes
  ) {
    return this._updateSystemTrigger
      .mutate({
        triggerId: TriggerId,
        trigger: Trigger,
        auditTypes: AuditTypes,
      })
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  public insertSystemTrigger(
    Trigger: {
      Name?: string;
      Description?: string;
      Active?: boolean;
      Priority?: number;
    },
    AuditTypes
  ) {
    return this._insertSystemTrigger
      .mutate({
        trigger: Trigger,
        auditTypes: AuditTypes,
      })
      .pipe(
        catchError((error) => {
          throw new Error(error);
        })
      );
  }

  public checkBinlocation(ITN) {
    return this._findInventory
      .fetch(
        {
          inventory: {
            InventoryTrackingNumber: ITN,
          },
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

  public getIMAdjustReasons() {
    const reasons = [];
    return this._imAdjustReasons
      .fetch({}, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          res.data.getIMAdjustReasons.forEach((reason) => {
            reasons.push(reason.Reason);
          });

          return reasons;
        }),
        catchError((error) => {
          return error;
        })
      );
  }

  public getAuditTypes(): Observable<any> {
    const auditTypes = [];
    return this._auditTypes.fetch({}, { fetchPolicy: 'network-only' }).pipe(
      map((res) => {
        res.data.fetchAuditTypes.forEach((type) => {
          auditTypes.push({
            name: type.Type,
            value: type._id,
            disabled: type.Type == 'Location,',
          });
        });

        return auditTypes;
      })
    );
  }

  public getPreviousLocation(ITN: string, BinLocation: string) {
    return this._fetchPrevious
      .fetch(
        {
          itn: ITN,
          binlocation: BinLocation,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          return res.data.fetchPreviousLocation.StatusMessage;
        })
      );
  }

  public fetchLocationAudits() {
    return this._fetchLocationAudits.fetch({}, { fetchPolicy: 'network-only' });
  }

  public getSystemAuditList(includeDeactivated: boolean): Observable<any> {
    const audits = [];
    return this._systemAuditList
      .fetch(
        { includedDeactivated: includeDeactivated },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          res.data.fetchSystemAudits.forEach((audit) => {
            const types = [];
            audit.IMTrigger_AuditTypes.forEach((type) => {
              types.push({
                Type: type.IMAuditType.Type,
                IMAuditTypeID: type.IMAuditTypeID,
              });
            });

            audits.push({
              _id: audit._id,
              Active: audit.Active,
              Name: audit.Name,
              Description: audit.Description,
              Priority: audit.Priority,
              IMTrigger_AuditTypes: types,
            });
            //audits.push(audit);
          });

          return audits;
        }),
        catchError((error) => {
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
                ParentITN: data.ParentITN,
                DateCode: data.DateCode,
                COO: data.COO,
                ROHS: data.ROHS,
                Quantity: data.QuantityOnHand,
                OriginalQuantity: data.OriginalQuantity,
                NotFound: data.NotFound,
                Suspect: data.Suspect,
                LocatedInAutostore: data.LocatedInAutostore,
                BoundForAutostore: data.BoundForAutostore,
                ProductID: data.ProductID,
                Product: {
                  PartNumber: data.PartNumber,
                  Description: data.Description,
                  ProductCodeID: data.ProductCodeID,
                  ProductCode: {
                    ProductCodeNumber: data.ProductCodeNumber,
                  },
                  ProductType: {
                    ProductType: data.ProductType,
                    Description: data.ProductTypeDescription,
                  },
                  ProductTier: data.ProductTier,
                  Velocity: data.Velocity,
                  MICPartNumber: data.MICPartNumber,
                  UOM: data.UOM,
                  Autostore: data.Autostore,
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
