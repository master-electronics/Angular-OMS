import { Injectable } from '@angular/core';
import { BehaviorSubject, elementAt, map, switchMap, tap } from 'rxjs';
import { FetchSuggetionLocationForSortingGQL } from 'src/app/graphql/stocking.graphql-gen';

export interface SuggetionLocation {
  Bincode: string;
  Zone: number;
  Quantity: number;
}

@Injectable()
export class SuggestLocationsService {
  constructor(private _suggetLocation: FetchSuggetionLocationForSortingGQL) {}
  //

  public suggestLocation$(ProductID: number) {
    return this._suggetLocation.fetch({ ProductID, limit: 5 }).pipe(
      map((res) => {
        return res.data.fetchSuggetionLocationForSorting.map((container) => ({
          Quantity: container.Quantity,
          Zone: container.Zone,
          Bincode: container.Barcode,
        }));
      })
    );
  }
}
