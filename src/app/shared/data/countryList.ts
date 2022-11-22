import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';
import { FetchCountryListGQL } from 'src/app/graphql/utilityTools.graphql-gen';

export interface CountryList {
  _id: number;
  CountryName: string;
  ISO2: string;
  ISO3: string;
}

@Injectable()
export class CountryListService {
  private _countryList = new BehaviorSubject<CountryList[]>(null);
  constructor(private _fetch$: FetchCountryListGQL) {}

  public get countryList$(): Observable<CountryList[]> {
    if (this._countryList.value) {
      return this._countryList.asObservable();
    }
    return this._fetch$.fetch().pipe(
      map((res) => {
        return res.data.fetchAllCountry.map((country) => {
          const tmp = { ...country };
          delete tmp.__typename;
          return tmp;
        });
      }),
      tap((res) => {
        this._countryList.next(res);
      }),
      shareReplay()
    );
  }
}
