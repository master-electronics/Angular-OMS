import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { FindorCreateUserContainerGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from '../utils/sqlData';
import { StorageUserInfoService } from '../services/storage-user-info.service';
import { SESSION_STORAGE } from '../utils/storage';

@Injectable({
  providedIn: 'root',
})
export class UserContainerService {
  constructor(
    private _userContainer: FindorCreateUserContainerGQL,
    private _userInfo: StorageUserInfoService
  ) {}

  private _sessionStorage = inject(SESSION_STORAGE);
  /**
   * User ContainerID
   */
  private _userContainerID = new BehaviorSubject<number>(
    Number(this._sessionStorage.getItem('UserContainerID'))
  );
  public get userContainerID(): number {
    return this._userContainerID.value;
  }
  public get userContainerID$(): Observable<number> {
    if (this.userContainerID) {
      return of(this.userContainerID);
    }
    return this._userContainer
      .mutate({
        DistributionCenter: this._userInfo.distributionCenter,
        Barcode: this._userInfo.userName.substring(0, 15),
        ContainerTypeID: sqlData.userType_ID,
      })
      .pipe(
        map((res) => {
          this._userContainerID.next(res.data.findOrCreateUserContainer._id);
          return this._userContainerID.value;
        }),
        tap((res) => {
          this._sessionStorage.setItem('UserContainerID', res.toString());
        })
      );
  }
}
