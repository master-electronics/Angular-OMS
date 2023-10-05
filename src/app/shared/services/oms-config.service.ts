import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FetchOmsConfigValueGQL } from 'src/app/graphql/omsConfig.graphql-gen';

@Injectable({
  providedIn: 'root',
})
export class OMSConfigService {
  constructor(private _config: FetchOmsConfigValueGQL) {}

  public getValue(Name: string): Observable<any> {
    return this._config.fetch({ name: Name }, { fetchPolicy: 'network-only' });
  }
}
