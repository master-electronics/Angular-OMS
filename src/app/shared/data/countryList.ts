import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';
import { FetchCountryListGQL } from 'src/app/graphql/utilityTools.graphql-gen';

export interface CountryList {
  _id: number;
  CountryName: string;
  ISO2: string;
  ISO3: string;
}

@Injectable({
  providedIn: 'root',
})
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
          return {
            _id: country._id,
            CountryName: country.CountryName.trim(),
            ISO2: country.ISO2.trim(),
            ISO3: country.ISO3.trim(),
          };
        });
      }),
      tap((res) => {
        this._countryList.next(res);
      })
    );
  }
}
