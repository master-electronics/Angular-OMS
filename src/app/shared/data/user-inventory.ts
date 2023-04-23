import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { FindInventoryByUserGQL } from 'src/app/graphql/utilityTools.graphql-gen';

@Injectable({
  providedIn: 'root',
})
export class UserInventoryService {
  constructor(private _findUserITN: FindInventoryByUserGQL) {}

  public get userITN$(): Observable<string> {
    return this._findUserITN
      .fetch(
        {
          username: JSON.parse(sessionStorage.getItem('userInfo')).Name,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          if (!res.data.findInventoryByUser[0]) {
            return null;
          }
          return res.data.findInventoryByUser[0].InventoryTrackingNumber;
        })
      );
  }
}
