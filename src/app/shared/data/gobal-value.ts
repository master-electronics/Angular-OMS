import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';
import { FetchCountryListGQL } from 'src/app/graphql/utilityTools.graphql-gen';

export interface CountryList {
  __typename?: 'Country';
  _id: number;
  CountryName: string;
  ISO2: string;
  ISO3: string;
}

@Injectable()
export class GobalValueStore {
  constructor(private _fetch$: FetchCountryListGQL) {}
  private _countryList = new BehaviorSubject<CountryList[]>(null);

  public get countryList$(): Observable<CountryList[]> {
    return this._countryList.asObservable();
  }

  /**
   * get countryList
   */
  public get countryList() {
    return this._countryList.value;
  }

  public initCountryList(): Observable<CountryList[]> {
    return this._fetch$.fetch().pipe(
      map((res) => res.data.fetchAllCountry),
      tap((res) => this._countryList.next(res))
    );
  }
}
