import { Injectable } from '@angular/core';
import { BehaviorSubject, elementAt, map, switchMap, tap } from 'rxjs';
import { FetchSuggetionLocationForSortingGQL } from 'src/app/graphql/stocking.graphql-gen';

export interface SuggetionLocation {
  Bincode: string;
  Zone: number;
  Quantity: number;
}

export interface SortingInfo {
  ITN: string;
  InventoryID: number;
  ProductID: number;
  ProductCode: string;
  PartNumber: string;
  QuantityOnHand: number;
  Remaining: number;
  ProductType: string;
  Velocity: string;
}
@Injectable()
export class SuggestLocationsService {
  constructor(private _suggetLocation: FetchSuggetionLocationForSortingGQL) {}
  //

  public suggestLocation$(ProductID: number) {
    return this._suggetLocation.fetch({ ProductID, limit: 5 }).pipe(
      map((res) => {
        return res.data.findInventorys.map((inventory) => ({
          Quantity: inventory.QuantityOnHand,
          Zone: inventory.Container.Zone,
          Bincode: inventory.Container.Barcode,
        }));
      })
    );
  }
}
