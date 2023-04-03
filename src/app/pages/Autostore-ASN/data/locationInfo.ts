import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { FindContainerforAsnGQL } from 'src/app/graphql/autostoreASN.graphql-gen';
import { environment } from 'src/environments/environment';

@Injectable()
export class ASNLocationService {
  constructor(private _findContainer$: FindContainerforAsnGQL) {}

  private _ITNs = new BehaviorSubject<any>(null);

  public findITNs$(Barcode: string): Observable<boolean> {
    return this._findContainer$
      .fetch(
        {
          Container: {
            DistributionCenter: environment.DistributionCenter,
            Barcode,
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findContainer) {
            throw { name: 'error', message: "Can't find this Location!" };
          }
        }),
        map((res) => res.data.findContainer.INVENTORies),
        map((res) => {
          this._ITNs.next(res);
          return true;
        })
      );
  }
}
