import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { FindInventoryByUserGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { StorageUserInfoService } from '../services/storage-user-info.service';

@Injectable({
  providedIn: 'root',
})
export class UserInventoryService {
  constructor(
    private _findUserITN: FindInventoryByUserGQL,
    private _userInfo: StorageUserInfoService
  ) {}

  public get userITN$(): Observable<string> {
    return this._findUserITN
      .fetch(
        {
          username: this._userInfo.userName,
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
