import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { FindorCreateUserContainerGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { environment } from 'src/environments/environment';
import { sqlData } from '../utils/sqlData';

@Injectable({
  providedIn: 'root',
})
export class UserContainerService {
  constructor(private _userContainer: FindorCreateUserContainerGQL) {}

  /**
   * User ContainerID
   */
  private _userContainerID = new BehaviorSubject<number>(null);
  public get userContainerID(): number {
    return this._userContainerID.value;
  }
  public get userContainerID$(): Observable<number> {
    return this._userContainerID.asObservable().pipe(
      switchMap((res) => {
        if (res) {
          return of(res);
        }
        return this._userContainer
          .mutate({
            DistributionCenter: environment.DistributionCenter,
            Barcode: String(
              JSON.parse(sessionStorage.getItem('userInfo')).Name
            ),
            ContainerTypeID: sqlData.userType_ID,
          })
          .pipe(
            map((res) => {
              this._userContainerID.next(
                res.data.findOrCreateUserContainer._id
              );
              return this._userContainerID.value;
            })
          );
      })
    );
  }
}