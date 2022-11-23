import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';
import { FindAllRoutesGQL } from 'src/app/graphql/route.graphql-gen';

export interface RouteAuthInfo {
  Route: string;
  ADGroupProtected?: boolean;
  __typename?: string;
  ROUTEGROUPs?: {
    __typename?: string;
    ADGroup: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class RouteAuthService {
  constructor(private _info$: FindAllRoutesGQL) {}
  private _routeAuth = new BehaviorSubject<RouteAuthInfo[]>(null);
  public get routeAuth$(): Observable<RouteAuthInfo[]> {
    if (this._routeAuth.value) {
      return this._routeAuth.asObservable();
    }
    return this._info$.fetch().pipe(
      tap((res) => {
        if (!res.data.findRoutes.length) {
          throw new Error("Can fetch Route table's info!");
        }
        this._routeAuth.next(res.data.findRoutes);
      }),
      map((res) => res.data.findRoutes),
      shareReplay(1)
    );
  }
}
